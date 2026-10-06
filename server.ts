import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { maskSensitiveFinancialIdentifiers, calculateCTCToTakeHome, calculateSIP } from './src/utils/calculators.ts';
import { calculateMentorDecisionScenario, ExtractedScenario, UserScenarioProfile } from './src/utils/mentorDecisionEngine.ts';
import { sanitizePii } from './src/utils/piiSanitizer.ts';

dotenv.config();

// Also load .env.local if present (useful in GitHub Codespaces and local dev)
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

/**
 * Universal Gemini API key resolver
 * Supports GEMINI_API_KEY, GOOGLE_API_KEY, VITE_GEMINI_API_KEY, and API_KEY across process.env, .env, and .env.local.
 * Strips accidental wrapping quotes and whitespace.
 */
function getGeminiApiKey(): string | null {
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.VITE_GEMINI_API_KEY,
    process.env.API_KEY,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    const clean = String(raw).trim().replace(/^["']|["']$/g, '').trim();
    if (
      clean &&
      clean !== 'MY_GEMINI_API_KEY' &&
      clean !== 'your_api_key_here' &&
      clean !== 'YOUR_GEMINI_API_KEY' &&
      clean !== 'your_actual_gemini_api_key_here' &&
      clean !== '""' &&
      clean !== "''"
    ) {
      return clean;
    }
  }
  return null;
}

import {
  initDatabaseClients,
  supabaseClient,
  verifySupabaseToken,
  getProfileById,
  getProfileByEmail,
  upsertProfile,
  getMythFactHistory,
  addMythFactCheck,
  getSavedCalculations,
  addSavedCalculation,
  getSavedDocumentExplanations,
  addSavedDocumentExplanation,
  getFlashcardProgress,
  setFlashcardStatus,
  getQuizAttempts,
  addQuizAttempt,
  createOfflineSessionToken,
  IncomeType,
  UserProfileRecord,
  MythFactCheckRecord,
  SavedCalculationRecord,
  SavedDocumentExplanationRecord,
  QuizAttemptRecord,
} from './server/db.ts';

export type { IncomeType, UserProfileRecord };

export interface MythFactStructuredResult {
  verdict: 'Myth' | 'Fact' | 'Partly true / depends' | 'Cannot verify';
  short_answer: string;
  why: string;
  what_is_factual: string;
  what_depends_on_context: string;
  real_world_example: string;
  remember_this: string;
  common_mistake: string;
}

export interface MythFactCheckEntry {
  id: string;
  statement: string;
  verdict: MythFactStructuredResult['verdict'];
  response: MythFactStructuredResult;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

export interface SavedCalculationEntry {
  id: string;
  calculatorType: 'SIP' | 'EMI' | 'CTC';
  label: string;
  inputs: Record<string, number | string | boolean>;
  outputs: Record<string, number | string>;
  timestamp: string;
}

export interface SavedDocumentExplanationEntry {
  id: string;
  fileName: string;
  document_type: string;
  summary: string;
  key_fields: { label: string; value: string }[];
  important_terms_explained: { term: string; explanation: string }[];
  things_to_watch_out_for: string[];
  questions_you_may_want_to_ask: string[];
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

export interface QuizAttemptRecordEntry {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

// Verification function for legacy PBKDF2 / scrypt users during first migration login
function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const pbkdf2Hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const pbkdf2Buf = Buffer.from(pbkdf2Hash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (pbkdf2Buf.length === storedBuf.length && crypto.timingSafeEqual(pbkdf2Buf, storedBuf)) {
      return true;
    }
    const scryptHash = crypto.scryptSync(password, salt, 64).toString('hex');
    const scryptBuf = Buffer.from(scryptHash, 'hex');
    if (scryptBuf.length === storedBuf.length && crypto.timingSafeEqual(scryptBuf, storedBuf)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function sanitizeProfile(user: UserProfileRecord) {
  const { legacyPasswordHash, legacySalt, ...safeUser } = user;
  return safeUser;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required. Please log in again.' });
      return;
    }
    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please log in again.' });
      return;
    }
    const userId = await verifySupabaseToken(token);
    if (!userId) {
      console.warn('[Auth Notice] requireAuth: Token verification returned null (session invalid or expired)');
      res.status(401).json({ error: 'Your session has expired. Please log in again.' });
      return;
    }
    const user = await getProfileById(userId);
    if (!user) {
      console.warn('[Auth Notice] requireAuth: User profile not found for verified token sub');
      res.status(401).json({ error: 'User account not found. Please log in again.' });
      return;
    }
    // Row-Level Security enforcement: bind authenticated userId strictly from verified token
    req.userId = user.id;
    next();
  } catch (err: any) {
    console.warn('[Auth Warning] requireAuth unexpected error:', err?.message || err);
    res.status(401).json({ error: 'Authentication required. Please log in again.' });
  }
}

export function createExpressApp() {
  // Initialize primary and fallback database connections
  initDatabaseClients();

  const app = express();

  app.use(express.json({ limit: '15mb' }));

  // Ensure /api prefix is normalized regardless of Vercel routing
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/_')) {
      req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
    }
    next();
  });

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // POST /api/auth/signup
  app.post('/api/auth/signup', async (req: Request, res: Response) => {
    try {
      const {
        fullName,
        email,
        username,
        password,
        age,
        location,
        preferredLanguage,
        theme,
      } = req.body || {};

      const cleanName = String(fullName || (req.body as any)?.name || '').trim();
      const rawIdentifier = String(email || username || '').trim().toLowerCase();
      const cleanLocation = String(location || '').trim();
      const parsedAge = Number(age);

      if (!cleanName || cleanName.length < 2) {
        res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
        return;
      }
      if (!rawIdentifier || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawIdentifier)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }
      if (!password || String(password).length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        return;
      }
      if (!Number.isFinite(parsedAge) || parsedAge < 15 || parsedAge > 100) {
        res.status(400).json({ error: 'Please enter a valid age between 15 and 100.' });
        return;
      }
      if (!cleanLocation || cleanLocation.length < 2) {
        res.status(400).json({ error: 'Please enter your city and state (e.g., Pune, Maharashtra).' });
        return;
      }

      const validLanguages = ['English', 'Hindi', 'Marathi'] as const;
      const lang = validLanguages.includes(preferredLanguage) ? preferredLanguage : 'English';
      const userTheme = theme === 'light' ? 'light' : 'dark';

      const existing = await getProfileByEmail(rawIdentifier);
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
        return;
      }

      let userId: string = crypto.randomUUID();
      let token = await createOfflineSessionToken(userId, rawIdentifier);

      // Create user through Supabase Auth with email confirmed (no verification barrier)
      if (supabaseClient) {
        try {
          const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
            email: rawIdentifier,
            password: String(password),
            email_confirm: true,
            user_metadata: { full_name: cleanName },
          });

          if (authError || !authData?.user) {
            if (
              authError?.message?.toLowerCase().includes('already') ||
              authError?.message?.toLowerCase().includes('registered') ||
              authError?.message?.toLowerCase().includes('exists')
            ) {
              res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
              return;
            }
            res.status(500).json({ error: 'Unable to create account right now. Please try again.' });
            return;
          }

          userId = authData.user.id;

          // Sign in to retrieve official Supabase session JWT
          const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
            email: rawIdentifier,
            password: String(password),
          });

          if (signInData?.session?.access_token) {
            token = signInData.session.access_token;
          } else {
            if (signInError) {
              console.warn('[Auth Warning] signInWithPassword notice:', signInError.message);
            }
            token = await createOfflineSessionToken(userId, rawIdentifier);
          }
        } catch (authErr: any) {
          console.error('[Auth Error] Supabase Auth signup error:', authErr?.message);
          token = await createOfflineSessionToken(userId, rawIdentifier);
        }
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = crypto.pbkdf2Sync(String(password), salt, 100000, 64, 'sha512').toString('hex');

      const now = new Date().toISOString();
      const newProfile: UserProfileRecord = {
        id: userId,
        fullName: cleanName,
        email: rawIdentifier,
        age: Math.round(parsedAge),
        location: cleanLocation,
        preferredLanguage: lang,
        theme: userTheme,
        incomeType: 'Salaried',
        dreamJob: '',
        annualCtc: null,
        monthlyExpenses: null,
        monthlyEmi: 0,
        currentSavings: null,
        monthlyInvestments: 0,
        riskAppetite: 'Balanced',
        profileCompleted: false,
        createdAt: now,
        updatedAt: now,
        legacyPasswordHash: passwordHash,
        legacySalt: salt,
      };

      await upsertProfile(newProfile);

      res.status(201).json({
        token,
        user: sanitizeProfile(newProfile),
      });
    } catch (err) {
      console.error('Signup error:', err instanceof Error ? err.message : 'Error');
      res.status(500).json({ error: 'Unable to create account right now. Please try again.' });
    }
  });

  // POST /api/auth/login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body || {};
      const cleanIdentifier = String(email || username || '').trim().toLowerCase();

      if (!cleanIdentifier || !password) {
        res.status(400).json({ error: 'Please enter both email and password.' });
        return;
      }

      let authUserId: string | null = null;
      let sessionToken: string | null = null;

      // 1. Try Supabase Auth sign-in
      if (supabaseClient) {
        try {
          const { data: loginData, error: loginErr } = await supabaseClient.auth.signInWithPassword({
            email: cleanIdentifier,
            password: String(password),
          });
          if (!loginErr && loginData?.session && loginData?.user) {
            authUserId = loginData.user.id;
            sessionToken = loginData.session.access_token;
          }
        } catch {
          // Fall through to legacy check
        }
      }

      // 2. Existing user check: seamless first-login migration from PBKDF2 hash
      if (!authUserId) {
        const profile = await getProfileByEmail(cleanIdentifier);
        if (profile && profile.legacyPasswordHash && profile.legacySalt) {
          if (verifyPassword(String(password), profile.legacySalt, profile.legacyPasswordHash)) {
            // Password verified against legacy hash! Create or update Supabase Auth user
            authUserId = profile.id;
            if (supabaseClient) {
              try {
                try {
                  await supabaseClient.auth.admin.updateUserById(profile.id, {
                    password: String(password),
                    email_confirm: true,
                  });
                } catch {
                  await supabaseClient.auth.admin.createUser({
                    id: profile.id,
                    email: profile.email,
                    password: String(password),
                    email_confirm: true,
                    user_metadata: { full_name: profile.fullName },
                  });
                }

                const { data: migratedLogin } = await supabaseClient.auth.signInWithPassword({
                  email: profile.email,
                  password: String(password),
                });
                if (migratedLogin?.session) {
                  sessionToken = migratedLogin.session.access_token;
                }

                // Clear temporary legacy credentials column
                profile.legacyPasswordHash = null;
                profile.legacySalt = null;
                await upsertProfile(profile);
              } catch (migrationErr: any) {
                console.warn('[Legacy User Migration Notice]:', migrationErr?.message);
              }
            }
            if (!sessionToken) {
              sessionToken = await createOfflineSessionToken(profile.id, profile.email);
            }
          } else {
            res.status(401).json({ error: 'Invalid email or password. Please try again.' });
            return;
          }
        }
      }

      if (!authUserId) {
        res.status(401).json({ error: 'Invalid email or password. Please check your credentials or sign up.' });
        return;
      }

      const profile = await getProfileById(authUserId);
      if (!profile) {
        res.status(401).json({ error: 'User account not found. Please log in again.' });
        return;
      }

      if (!sessionToken) {
        sessionToken = await createOfflineSessionToken(profile.id, profile.email);
      }

      res.json({
        token: sessionToken,
        user: sanitizeProfile(profile),
      });
    } catch (err) {
      console.error('Login error:', err instanceof Error ? err.message : 'Error');
      res.status(500).json({ error: 'Unable to sign in right now. Please try again.' });
    }
  });

  // GET /api/auth/me - session check
  app.get('/api/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const profile = await getProfileById(req.userId!);
    if (!profile) {
      res.status(401).json({ error: 'User account not found. Please log in again.' });
      return;
    }
    res.json({ user: sanitizeProfile(profile) });
  });

  // GET /api/auth/session - session verification
  app.get('/api/auth/session', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const profile = await getProfileById(req.userId!);
    if (!profile) {
      res.status(401).json({ error: 'User account not found. Please log in again.' });
      return;
    }
    res.json({ user: sanitizeProfile(profile) });
  });

  // POST /api/auth/logout
  app.post('/api/auth/logout', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ') && supabaseClient) {
        const token = authHeader.slice('Bearer '.length).trim();
        await supabaseClient.auth.admin.signOut(token).catch(() => {});
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to log out cleanly.' });
    }
  });

  // GET /api/profile - RLS enforced via requireAuth
  app.get('/api/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const profile = await getProfileById(req.userId!);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found.' });
      return;
    }
    res.json({ user: sanitizeProfile(profile) });
  });

  // PUT /api/profile - Update financial & personal profile (RLS enforced via req.userId)
  app.put('/api/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const profile = await getProfileById(req.userId!);
      if (!profile) {
        res.status(404).json({ error: 'User profile not found.' });
        return;
      }

      const user = profile;

      const {
        fullName,
        age,
        location,
        preferredLanguage,
        theme,
        incomeType,
        dreamJob,
        annualCtc,
        monthlyExpenses,
        monthlyEmi,
        currentSavings,
        monthlyInvestments,
        riskAppetite,
      } = req.body || {};

      // Validate personal fields if provided
      if (fullName !== undefined) {
        const cleanName = String(fullName).trim();
        if (cleanName.length < 2) {
          res.status(400).json({ error: 'Full name must be at least 2 characters.' });
          return;
        }
        user.fullName = cleanName;
      }

      if (age !== undefined) {
        const parsedAge = Number(age);
        if (!Number.isFinite(parsedAge) || parsedAge < 15 || parsedAge > 100) {
          res.status(400).json({ error: 'Age must be a valid number between 15 and 100.' });
          return;
        }
        user.age = Math.round(parsedAge);
      }

      if (location !== undefined) {
        const cleanLoc = String(location).trim();
        if (cleanLoc.length < 2) {
          res.status(400).json({ error: 'Location (City/State) cannot be empty.' });
          return;
        }
        user.location = cleanLoc;
      }

      if (preferredLanguage && ['English', 'Hindi', 'Marathi'].includes(preferredLanguage)) {
        user.preferredLanguage = preferredLanguage;
      }

      if (theme === 'light' || theme === 'dark') {
        user.theme = theme;
      }

      // Validate incomeType
      const validIncomeTypes: IncomeType[] = [
        'Salaried',
        'Self-employed or business',
        'Farmer',
        'Daily-wage worker',
        'Homemaker',
        'Student',
        'Other',
      ];
      const resolvedIncomeType: IncomeType =
        incomeType && validIncomeTypes.includes(incomeType)
          ? incomeType
          : user.incomeType || 'Salaried';
      user.incomeType = resolvedIncomeType;

      // Validate financial fields
      // dreamJob is optional (What work do you do?)
      const cleanJob = dreamJob !== undefined ? String(dreamJob).trim() : (user.dreamJob || '');
      user.dreamJob = cleanJob;

      const parsedCtc = annualCtc !== undefined && annualCtc !== '' ? Number(annualCtc) : user.annualCtc;
      const parsedExpenses = monthlyExpenses !== undefined && monthlyExpenses !== '' ? Number(monthlyExpenses) : user.monthlyExpenses;
      const parsedSavings = currentSavings !== undefined && currentSavings !== '' ? Number(currentSavings) : user.currentSavings;

      const allowsZeroIncome = resolvedIncomeType === 'Student' || resolvedIncomeType === 'Homemaker';

      if (parsedCtc === null || !Number.isFinite(parsedCtc)) {
        res.status(400).json({ error: 'Please enter a valid income amount.' });
        return;
      }

      if (allowsZeroIncome) {
        if (parsedCtc < 0) {
          res.status(400).json({ error: 'Income amount cannot be negative.' });
          return;
        }
      } else if (resolvedIncomeType === 'Salaried') {
        if (parsedCtc <= 0) {
          res.status(400).json({ error: 'Annual CTC / Salary must be a positive number greater than 0.' });
          return;
        }
      } else {
        // Other non-salaried: cannot be negative
        if (parsedCtc < 0) {
          res.status(400).json({ error: 'Income amount cannot be negative.' });
          return;
        }
      }

      if (parsedExpenses === null || !Number.isFinite(parsedExpenses) || parsedExpenses < 0) {
        res.status(400).json({ error: 'Monthly Expenses cannot be negative or invalid.' });
        return;
      }
      if (parsedSavings === null || !Number.isFinite(parsedSavings) || parsedSavings < 0) {
        res.status(400).json({ error: 'Current Savings cannot be negative or invalid.' });
        return;
      }

      if (monthlyEmi !== undefined && monthlyEmi !== '') {
        const parsedEmi = Number(monthlyEmi);
        if (!Number.isFinite(parsedEmi) || parsedEmi < 0) {
          res.status(400).json({ error: 'Monthly EMI cannot be negative or invalid.' });
          return;
        }
        user.monthlyEmi = Math.round(parsedEmi);
      } else if (user.monthlyEmi === undefined) {
        user.monthlyEmi = 0;
      }

      user.annualCtc = Math.round(parsedCtc);
      user.monthlyExpenses = Math.round(parsedExpenses);
      user.currentSavings = Math.round(parsedSavings);

      if (monthlyInvestments !== undefined && monthlyInvestments !== '') {
        const parsedInv = Number(monthlyInvestments);
        if (!Number.isFinite(parsedInv) || parsedInv < 0) {
          res.status(400).json({ error: 'Monthly Investments cannot be negative.' });
          return;
        }
        user.monthlyInvestments = Math.round(parsedInv);
      } else if (!user.monthlyInvestments) {
        // Default SIP estimate to 20% of monthly surplus if positive
        const monthlyInHand = resolvedIncomeType === 'Salaried'
          ? Math.round((user.annualCtc * 0.85) / 12)
          : Math.round(user.annualCtc / 12);
        const surplus = Math.max(0, monthlyInHand - user.monthlyExpenses);
        user.monthlyInvestments = Math.round(surplus * 0.5);
      }

      if (riskAppetite && ['Conservative', 'Balanced', 'Aggressive'].includes(riskAppetite)) {
        user.riskAppetite = riskAppetite;
      }

      user.profileCompleted = Boolean(
        user.annualCtc !== null &&
        (allowsZeroIncome || resolvedIncomeType !== 'Salaried' ? user.annualCtc >= 0 : user.annualCtc > 0) &&
        user.monthlyExpenses !== null &&
        user.monthlyExpenses >= 0 &&
        user.currentSavings !== null &&
        user.currentSavings >= 0
      );
      user.updatedAt = new Date().toISOString();

      await upsertProfile(user);

      res.json({ user: sanitizeProfile(user) });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Failed to save your profile. Please try again.' });
    }
  });

  // PATCH /api/profile/theme - Persist user theme preference across devices
  app.patch('/api/profile/theme', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { theme } = req.body || {};
      if (theme !== 'light' && theme !== 'dark') {
        res.status(400).json({ error: 'Theme must be "light" or "dark".' });
        return;
      }
      const user = await getProfileById(req.userId!);
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      user.theme = theme;
      user.updatedAt = new Date().toISOString();
      await upsertProfile(user);
      res.json({ theme: user.theme, user: sanitizeProfile(user) });
    } catch (err) {
      console.error('Theme save error:', err);
      res.status(500).json({ error: 'Failed to save theme preference.' });
    }
  });

  // GET /api/youtube/verify - Check if a YouTube video is available & embeddable via oEmbed
  app.get('/api/youtube/verify', async (req: Request, res: Response) => {
    const videoId = String(req.query.videoId || '').trim();
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      res.json({ embeddable: false, reason: 'Invalid video ID format' });
      return;
    }
    try {
      const oembedUrl = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
      const response = await fetch(oembedUrl);
      if (!response.ok) {
        res.json({ embeddable: false, reason: `oEmbed returned ${response.status}` });
        return;
      }
      const data = (await response.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
      res.json({
        embeddable: true,
        title: data.title,
        authorName: data.author_name,
        thumbnailUrl: data.thumbnail_url,
      });
    } catch {
      // If offline/network restricted, allow standard iframe attempt with client fallback
      res.json({ embeddable: true });
    }
  });

  // POST /api/mentor/chat - Server-Side Gemini AI Financial Mentor
  const GEMINI_PRIMARY_MODEL = 'gemini-3.5-flash';
  const GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

  app.post('/api/mentor/chat', async (req: Request, res: Response) => {
    const { message, history, userContext } = req.body || {};
    const promptText = String(message || '').trim();
    if (!promptText) {
      res.status(400).json({ error: 'EMPTY_MESSAGE' });
      return;
    }

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.warn('[AI Mentor] Request failed: Gemini API key is missing.');
      res.status(503).json({ error: 'MISSING_API_KEY' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
      });

      // Supplement context with database profile if user is authenticated and fields are missing
      let resolvedContext = { ...(userContext || {}) };
      let dbUser: UserProfileRecord | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length).trim();
        const userId = await verifySupabaseToken(token);
        if (userId) {
          dbUser = await getProfileById(userId);
          if (dbUser) {
            resolvedContext = {
              age: resolvedContext.age ?? dbUser.age,
              location: resolvedContext.location || dbUser.location,
              incomeType: resolvedContext.incomeType || dbUser.incomeType || 'Salaried',
              dreamJob: resolvedContext.dreamJob || dbUser.dreamJob,
              annualCtc: resolvedContext.annualCtc !== undefined && resolvedContext.annualCtc !== null ? resolvedContext.annualCtc : dbUser.annualCtc,
              monthlyExpenses: resolvedContext.monthlyExpenses !== undefined && resolvedContext.monthlyExpenses !== null ? resolvedContext.monthlyExpenses : dbUser.monthlyExpenses,
              monthlyEmi: resolvedContext.monthlyEmi !== undefined && resolvedContext.monthlyEmi !== null ? resolvedContext.monthlyEmi : dbUser.monthlyEmi,
              currentSavings: resolvedContext.currentSavings !== undefined && resolvedContext.currentSavings !== null ? resolvedContext.currentSavings : dbUser.currentSavings,
              monthlyInvestments: resolvedContext.monthlyInvestments !== undefined && resolvedContext.monthlyInvestments !== null ? resolvedContext.monthlyInvestments : dbUser.monthlyInvestments,
              riskAppetite: resolvedContext.riskAppetite || dbUser.riskAppetite,
              preferredLanguage: resolvedContext.preferredLanguage || dbUser.preferredLanguage,
            };
          }
        }
      }

      const incomeType: IncomeType = (resolvedContext.incomeType as IncomeType) || dbUser?.incomeType || 'Salaried';
      const isSalaried = incomeType === 'Salaried';
      const isIrregular = ['Self-employed or business', 'Farmer', 'Daily-wage worker', 'Other'].includes(incomeType);
      const emergencyMonths = isIrregular ? 9 : 6;

      // Check available vs missing financial figures
      const hasCtc = typeof resolvedContext.annualCtc === 'number' && resolvedContext.annualCtc >= (isSalaried ? 1 : 0);
      const hasExpenses = typeof resolvedContext.monthlyExpenses === 'number' && resolvedContext.monthlyExpenses >= 0;
      const hasSavings = typeof resolvedContext.currentSavings === 'number' && resolvedContext.currentSavings >= 0;

      const annualCtc = hasCtc ? Number(resolvedContext.annualCtc) : 0;
      const monthlyExpenses = hasExpenses ? Number(resolvedContext.monthlyExpenses) : 0;
      const currentSavings = hasSavings ? Number(resolvedContext.currentSavings) : 0;
      const monthlyInvestments = Number(resolvedContext.monthlyInvestments || 0);
      const monthlyEmi = Number(resolvedContext.monthlyEmi || 0);
      const riskAppetite = resolvedContext.riskAppetite || 'Balanced';
      const dreamJob = resolvedContext.dreamJob || '';

      // Salaried: calculate take-home using standard calculateCTCToTakeHome
      // Non-salaried: monthly take-home = annualCtc / 12
      let monthlyInHand = 0;
      if (hasCtc) {
        if (isSalaried) {
          const ctcCalc = calculateCTCToTakeHome({ annualCtc });
          monthlyInHand = ctcCalc.monthlyTakeHome;
        } else {
          monthlyInHand = Math.round(annualCtc / 12);
        }
      }

      const monthlySurplus = (hasCtc && hasExpenses) ? Math.max(0, monthlyInHand - monthlyExpenses - monthlyEmi) : null;
      const emergencyTarget = (hasExpenses && (monthlyExpenses + monthlyEmi) > 0) ? (monthlyExpenses + monthlyEmi) * emergencyMonths : null;
      const emergencyShortfall = (emergencyTarget !== null && hasSavings) ? Math.max(0, emergencyTarget - currentSavings) : null;

      const missingFields: string[] = [];
      if (!hasCtc && (isSalaried || (incomeType !== 'Student' && incomeType !== 'Homemaker'))) {
        missingFields.push(isSalaried ? 'Annual CTC / Salary' : 'Monthly Income');
      }
      if (!hasExpenses) missingFields.push('Monthly Living Expenses');
      if (!hasSavings) missingFields.push('Current Savings Corpus');

      const selectedLanguage = resolvedContext?.preferredLanguage || 'English';

      // PII Sanitization for user question and history
      const sanitizedPrompt = sanitizePii(promptText);

      const recentMessages = Array.isArray(history)
        ? history
            .filter((m: { role?: string; text?: string }) => m && typeof m.text === 'string' && m.text.trim())
            .slice(-8)
            .map((m: { role: string; text: string }) => ({
              role: m.role,
              text: sanitizePii(m.text),
            }))
        : [];

      // -------------------------------------------------------------
      // PART A: FAST SCENARIO EXTRACTION (GEMINI_FALLBACK_MODEL, <=6s)
      // -------------------------------------------------------------
      const scenarioSchema = {
        type: Type.OBJECT,
        properties: {
          is_scenario: {
            type: Type.BOOLEAN,
            description: 'True if user asks a what-if money decision or hypothetical scenario changing income, SIP, expense, EMI, loan, or investment. False for plain definitions, greetings, or stock picks.',
          },
          income_change: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              type: { type: Type.STRING, description: 'set_monthly, set_annual_ctc, percent_change, add_monthly, reduce_monthly' },
              value: { type: Type.NUMBER, description: 'Numeric change or target amount' },
              is_gross: { type: Type.BOOLEAN, description: 'True if monthly gross salary' },
              is_annual: { type: Type.BOOLEAN, description: 'True if annual figure' },
              specified_in_hand: { type: Type.BOOLEAN, description: 'True if explicitly in-hand' },
            },
          },
          sip_change: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              type: { type: Type.STRING, description: 'add_monthly, reduce_monthly, set_monthly, stop, start, lump_sum' },
              amount: { type: Type.NUMBER, description: 'Amount in INR' },
            },
          },
          expense_change: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              type: { type: Type.STRING, description: 'add_monthly, reduce_monthly, set_monthly' },
              amount: { type: Type.NUMBER, description: 'Amount in INR' },
            },
          },
          emi_change: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              type: { type: Type.STRING, description: 'new_emi, changed_emi, pay_off' },
              amount: { type: Type.NUMBER, description: 'Amount in INR' },
            },
          },
          redirect_money: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
              from: { type: Type.STRING, description: 'Source category to reduce (e.g. sip, shopping)' },
              to: { type: Type.STRING, description: 'Target category to increase (e.g. savings, sip)' },
              amount: { type: Type.NUMBER, description: 'Amount in INR' },
            },
          },
          horizon_years: { type: Type.NUMBER, nullable: true, description: 'Horizon in years' },
          return_rate: { type: Type.NUMBER, nullable: true, description: 'Annual return rate %' },
        },
        required: ['is_scenario'],
      };

      let extractedScenario: ExtractedScenario = { is_scenario: false };
      try {
        const extractorAbort = new AbortController();
        const extractTimeout = setTimeout(() => extractorAbort.abort(), 6000);
        const extractionPrompt = `You are a financial decision scenario extractor. Read the latest user question and recent context.
Determine if the user is asking a "what-if" hypothetical money decision (changing income, SIP, expense, EMI, loan, or investment).
If it is a follow-up question (e.g. "what about 7,000 instead?"), use recent context to know what was being changed.
If it is a general definition (e.g. "What is SIP?"), stock tip ("Should I buy XYZ?"), or non-scenario, return is_scenario: false.

Recent Messages:
${recentMessages.slice(-4).map((m: { role: string; text: string }) => `${m.role === 'user' ? 'User' : 'Mentor'}: ${m.text}`).join('\n')}

Latest Question: ${sanitizedPrompt}`;

        const extractRes = await ai.models.generateContent({
          model: GEMINI_FALLBACK_MODEL,
          contents: extractionPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: scenarioSchema,
            abortSignal: extractorAbort.signal,
          },
        });
        clearTimeout(extractTimeout);
        if (extractRes.text) {
          extractedScenario = JSON.parse(extractRes.text) as ExtractedScenario;
        }
      } catch (extractErr) {
        console.warn('[AI Mentor] Scenario extraction skipped or timed out:', (extractErr as Error)?.message || extractErr);
        extractedScenario = { is_scenario: false };
      }

      let systemInstruction = '';

      if (extractedScenario.is_scenario) {
        const scenarioProfile: UserScenarioProfile = {
          incomeType,
          annualCtc: hasCtc ? annualCtc : null,
          monthlyTakeHome: hasCtc ? monthlyInHand : null,
          monthlyExpenses: hasExpenses ? monthlyExpenses : null,
          monthlyEmi,
          monthlyInvestments,
          currentSavings: hasSavings ? currentSavings : null,
          riskAppetite: (resolvedContext?.riskAppetite as any) || 'Balanced',
        };

        const comparison = calculateMentorDecisionScenario(scenarioProfile, extractedScenario);

        if (comparison.missingFields.length > 0) {
          systemInstruction = `You are DhanDrishti's AI Money Decision Mentor.
The user is testing a financial decision, but their saved profile is missing required data: ${comparison.missingFields.join(', ')}.

Rules:
1. Clearly state EXACTLY which profile numbers are missing: ${comparison.missingFields.join(', ')}.
2. Explain simply why these figures are required to test this money decision against their cash flow.
3. Guide the user to complete their profile in the Executive Dashboard questions instead of guessing or calculating with imaginary numbers.
4. Do NOT guess or calculate numbers.
5. Respond in ${selectedLanguage} (Devanagari script for Hindi and Marathi).
6. Educational disclaimer: this is educational guidance, not licensed financial advice.`;
        } else {
          const c = comparison.current;
          const h = comparison.hypothetical;
          const d = comparison.diff;

          systemInstruction = `You are DhanDrishti's AI Money Decision Mentor. Your defined job is: "Testing a money decision against the user's own income, expenses, savings and goals, before they make it."

Framework: Current profile -> Hypothetical change -> Impact -> Decision guidance.

CRITICAL RULES:
1. Use ONLY the code-calculated facts below. Do NOT invent, recalculate, or guess any financial numbers.
2. Structure your response in ${selectedLanguage} in this EXACT FIXED ORDER (do not alter this order):
   - **Now** (or वर्तमान स्थिति / सध्याची स्थिती in Hindi/Marathi): summarize their current numbers.
   - **If you do this** (or यदि आप यह करते हैं / जर तुम्ही हे केले तर in Hindi/Marathi): describe the exact change proposed.
   - **What changes** (or क्या बदलता है / काय बदलते in Hindi/Marathi): explain the before/after differences and impact on surplus, money left after SIP, emergency fund timeline, and SIP future value.
   - **Trade-off and risk** (or फायदे-नुकसान और जोखिम / तडजोड आणि जोखीम in Hindi/Marathi): highlight the trade-offs (Affordability: ${h.isAffordable ? 'Affordable' : 'Not affordable / Deficit'}, Emergency Fund gap trend: ${d.emergencyGapTrend}).
   - **What to check before deciding** (or निर्णय लेने से पहले क्या जांचें / निर्णय घेण्यापूर्वी काय तपासावे in Hindi/Marathi): practical checks to verify before proceeding.
3. Bold key figures with ** ** (e.g., **₹${c.moneyLeftAfterSip.toLocaleString('en-IN')}**, **${c.monthsToCloseEmergency} months**, **${h.annualReturnRate}% p.a.**).
4. State the modeling assumptions clearly (${comparison.assumptions.join('; ')}).
5. Add one brief closing line: projections are educational estimates and this is educational guidance, not licensed financial advice.
6. Language: Respond in ${selectedLanguage}. For Hindi and Marathi, write purely in Devanagari script.

CODE-CALCULATED FACTS (GROUND TRUTH):
[CURRENT SITUATION]:
- Monthly Take-Home: ₹${c.monthlyTakeHome.toLocaleString('en-IN')}/mo
- Monthly Expenses: ₹${c.monthlyExpenses.toLocaleString('en-IN')}/mo
- Monthly Loan EMI: ₹${c.monthlyEmi.toLocaleString('en-IN')}/mo
- Monthly Investable Surplus: ₹${c.monthlySurplus.toLocaleString('en-IN')}/mo
- Existing Monthly SIP: ₹${c.monthlyInvestments.toLocaleString('en-IN')}/mo
- Money Left Each Month After SIP: ₹${c.moneyLeftAfterSip.toLocaleString('en-IN')}/mo
- Emergency Fund Target (${emergencyMonths} months): ₹${c.emergencyTarget.toLocaleString('en-IN')} (Current Savings: ₹${c.currentSavings.toLocaleString('en-IN')}, Shortfall: ₹${c.emergencyShortfall.toLocaleString('en-IN')})
- Months to Close Emergency Shortfall: ${c.monthsToCloseEmergency} months
- SIP Projected Value over ${c.horizonYears} yrs @ ${c.annualReturnRate}%: ₹${c.sipFutureValue.toLocaleString('en-IN')} (Invested: ₹${c.sipInvestedPrincipal.toLocaleString('en-IN')}, Returns: ₹${c.sipEstimatedReturns.toLocaleString('en-IN')})

[HYPOTHETICAL SITUATION]:
- Monthly Take-Home: ₹${h.monthlyTakeHome.toLocaleString('en-IN')}/mo
- Monthly Expenses: ₹${h.monthlyExpenses.toLocaleString('en-IN')}/mo
- Monthly Loan EMI: ₹${h.monthlyEmi.toLocaleString('en-IN')}/mo
- Monthly Investable Surplus: ₹${h.monthlySurplus.toLocaleString('en-IN')}/mo
- Monthly SIP: ₹${h.monthlyInvestments.toLocaleString('en-IN')}/mo
- Money Left Each Month After SIP: ₹${h.moneyLeftAfterSip.toLocaleString('en-IN')}/mo
- Emergency Fund Target: ₹${h.emergencyTarget.toLocaleString('en-IN')} (Shortfall: ₹${h.emergencyShortfall.toLocaleString('en-IN')})
- Months to Close Emergency Shortfall: ${h.monthsToCloseEmergency} months
- SIP Projected Value over ${h.horizonYears} yrs @ ${h.annualReturnRate}%: ₹${h.sipFutureValue.toLocaleString('en-IN')} (Invested: ₹${h.sipInvestedPrincipal.toLocaleString('en-IN')}, Returns: ₹${h.sipEstimatedReturns.toLocaleString('en-IN')})
- Affordability: ${h.isAffordable ? 'Affordable (Surplus covers investments)' : 'Unfavorable / Deficit (Money left after SIP is negative)'}

[KEY DIFFERENCES]:
- Change in Monthly Take-Home: ₹${d.deltaTakeHome.toLocaleString('en-IN')}/mo
- Change in Monthly Expenses: ₹${d.deltaExpenses.toLocaleString('en-IN')}/mo
- Change in Monthly EMI: ₹${d.deltaEmi.toLocaleString('en-IN')}/mo
- Change in Monthly Investable Surplus: ₹${d.deltaSurplus.toLocaleString('en-IN')}/mo
- Change in Monthly SIP: ₹${d.deltaSip.toLocaleString('en-IN')}/mo
- Change in Money Left After SIP: ₹${d.deltaMoneyLeftAfterSip.toLocaleString('en-IN')}/mo
- Change in Months to Close Emergency Gap: ${d.deltaMonthsToCloseEmergency} months (Trend: ${d.emergencyGapTrend})
- Change in ${h.horizonYears}-Yr SIP Future Value: ₹${d.deltaSipFutureValue.toLocaleString('en-IN')}`;
        }
      } else {
        // Non-scenario query: strict scope rules (A2)
        systemInstruction = `You are DhanDrishti's AI Money Decision Mentor. You specialize in testing money decisions against the user's own profile before they make them. You are NOT a general AI chatbot.

Strict Scope Rules:
1. Definition Questions (e.g., "What is SIP?", "What is an emergency fund?", "Explain inflation"):
   - Give a brief 1-2 line simple definition.
   - Explicitly point the user to Termopedia (the "Term-O-Pedia" feature in the app) for the complete detailed explanation, real-world examples, and videos.
2. Investment & Product Recommendations:
   - You do NOT recommend specific stocks, mutual funds, or products by name (e.g. "Buy Reliance" or "Invest in HDFC Top 100").
   - You do NOT predict stock markets or promise/guarantee returns.
   - Politely decline, remind the user that you help test money decisions against their personal budget and cash flow rather than recommending specific market products, and invite a what-if question (such as "What if I invest ₹5,000 more every month?").
3. Tax & Legal Advice:
   - You do not give individual legal or CA tax filing advice.
4. Non-Financial / Off-Topic Questions:
   - Politely explain that you are DhanDrishti's personal money-decision mentor, and invite a what-if financial question.
5. General Financial Questions Grounded in Profile:
   - Answer concisely using their saved profile numbers below.
6. Language & Tone:
   - Respond in ${selectedLanguage} (Devanagari script for Hindi and Marathi).
   - Use simple words and bold key figures with ** **.
   - Include a brief line that projections are educational estimates, not licensed financial advice.

Saved Profile Context:
- Income Type: ${incomeType}
- Occupation / Field: ${dreamJob || 'Not specified'}
- Risk Profile: ${riskAppetite}
- Monthly In-Hand Take-Home: ${hasCtc ? `₹${monthlyInHand.toLocaleString('en-IN')}/mo` : 'NOT PROVIDED'}
- Monthly Living Expenses: ${hasExpenses ? `₹${monthlyExpenses.toLocaleString('en-IN')}/mo` : 'NOT PROVIDED'}
- Monthly EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/mo
- Existing Monthly SIP: ₹${monthlyInvestments.toLocaleString('en-IN')}/mo
- Current Savings Corpus: ${hasSavings ? `₹${currentSavings.toLocaleString('en-IN')}` : 'NOT PROVIDED'}
- Emergency Fund Target (${emergencyMonths} months): ${emergencyTarget !== null ? `₹${emergencyTarget.toLocaleString('en-IN')}` : 'NOT CALCULATED'}`;
      }

      const conversationTranscript = recentMessages
        .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'User' : 'DhanaDrishti Mentor'}: ${m.text}`)
        .join('\n\n');

      const fullPrompt = conversationTranscript
        ? `Previous conversation context:\n${conversationTranscript}\n\nCurrent User Question: ${sanitizedPrompt}`
        : `User Question: ${sanitizedPrompt}`;

      const generateWithModel = async (modelName: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
        try {
          const result = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction,
              abortSignal: controller.signal,
            },
          });
          return result.text?.trim() || '';
        } finally {
          clearTimeout(timeoutId);
        }
      };

      let replyText = '';
      try {
        replyText = await generateWithModel(GEMINI_PRIMARY_MODEL);
      } catch (primErr) {
        console.warn(`[AI Mentor] Primary model (${GEMINI_PRIMARY_MODEL}) failed:`, (primErr as Error)?.message || primErr);
        try {
          replyText = await generateWithModel(GEMINI_FALLBACK_MODEL);
        } catch (fallErr) {
          console.error(`[AI Mentor] Fallback model (${GEMINI_FALLBACK_MODEL}) also failed:`, (fallErr as Error)?.message || fallErr);
          throw fallErr;
        }
      }

      if (!replyText) {
        res.status(503).json({ error: 'EMPTY_MODEL_RESPONSE' });
        return;
      }

      // Safety net: post-processing privacy masking
      const safeReply = maskSensitiveFinancialIdentifiers(replyText);
      res.json({ reply: safeReply });
    } catch (err) {
      console.error('[AI Mentor Error]:', (err as Error)?.message || err);
      res.status(503).json({ error: 'MENTOR_TEMPORARILY_UNAVAILABLE' });
    }
  });

  // GET /api/mythfact/history - Retrieve logged-in user's saved Myth/Fact checks
  app.get('/api/mythfact/history', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const list = await getMythFactHistory(req.userId!);
    res.json({ history: list });
  });

  // POST /api/mythfact/check - Check a user-submitted financial statement (ITEM 1)
  app.post('/api/mythfact/check', async (req: Request, res: Response) => {
    const { statement, language } = req.body || {};
    const rawStatement = String(statement || '').trim();

    if (rawStatement.length < 5) {
      res.status(400).json({ error: 'STATEMENT_TOO_SHORT' });
      return;
    }
    if (rawStatement.length > 500) {
      res.status(400).json({ error: 'STATEMENT_TOO_LONG' });
      return;
    }

    const cleanStatement = sanitizePii(rawStatement);

    const validLanguages = ['English', 'Hindi', 'Marathi'] as const;
    const selectedLang: 'English' | 'Hindi' | 'Marathi' = validLanguages.includes(language)
      ? language
      : 'English';

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      res.status(503).json({ error: 'MISSING_API_KEY' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `You are DhanaDrishti's financial fact-checker for Indian users.
Evaluate the user's financial statement or belief and respond in ${selectedLang} (except the "verdict" field, which MUST be one of the exact English strings: "Myth", "Fact", "Partly true / depends", or "Cannot verify").

Honesty & Accuracy Rules:
1. Do not present uncertain claims as verified facts. Use "Cannot verify" when a claim is unverifiable or lacks evidence, and use "Partly true / depends" when a statement holds true only under certain conditions.
2. Ground all explanations in the Indian financial context (RBI, SEBI, AMFI, Income Tax Act, GST rules, EPFO, CIBIL).
3. Do not give personalized investment advice or tell the user to buy or sell any specific product or security.
4. Do not invent statistics, returns, or tax rates. If a rule or tax slab changes over time (such as Union Budget revisions or RBI repo rate changes), explicitly state that it is subject to periodic change.
5. Write every explanation field in clear, plain ${selectedLang} suitable for everyday Indian households.`;

      const mythFactSchema = {
        type: Type.OBJECT,
        properties: {
          verdict: {
            type: Type.STRING,
            description: 'Must be one of: "Myth", "Fact", "Partly true / depends", "Cannot verify"',
          },
          short_answer: { type: Type.STRING },
          why: { type: Type.STRING },
          what_is_factual: { type: Type.STRING },
          what_depends_on_context: { type: Type.STRING },
          real_world_example: { type: Type.STRING },
          remember_this: { type: Type.STRING },
          common_mistake: { type: Type.STRING },
        },
        required: [
          'verdict',
          'short_answer',
          'why',
          'what_is_factual',
          'what_depends_on_context',
          'real_world_example',
          'remember_this',
          'common_mistake',
        ],
      };

      const parseRobustMythFactJson = (rawOutput: string): MythFactStructuredResult => {
        const cleaned = rawOutput
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        const candidateJson =
          firstBrace !== -1 && lastBrace > firstBrace
            ? cleaned.slice(firstBrace, lastBrace + 1)
            : cleaned;

        try {
          const obj = JSON.parse(candidateJson) as Partial<MythFactStructuredResult>;
          return {
            verdict: (obj.verdict as MythFactStructuredResult['verdict']) || 'Cannot verify',
            short_answer: String(obj.short_answer || cleaned).trim(),
            why: String(obj.why || obj.short_answer || cleaned).trim(),
            what_is_factual: String(
              obj.what_is_factual || 'Refer to official RBI, SEBI, and Income Tax guidelines.'
            ).trim(),
            what_depends_on_context: String(
              obj.what_depends_on_context || 'Individual financial goals, time horizon, and tax slab.'
            ).trim(),
            real_world_example: String(
              obj.real_world_example || 'For example, comparing post-tax and post-inflation returns in India.'
            ).trim(),
            remember_this: String(
              obj.remember_this || 'Always verify financial claims against official RBI or SEBI sources.'
            ).trim(),
            common_mistake: String(
              obj.common_mistake || 'Relying on unverified social media or WhatsApp financial tips.'
            ).trim(),
          };
        } catch {
          // Plain-text fallback if JSON is malformed
          return {
            verdict: 'Cannot verify',
            short_answer: cleaned.slice(0, 280) || 'Unable to verify this statement definitively.',
            why: cleaned || 'The statement could not be verified as a standard financial rule.',
            what_is_factual: 'In India, regulated financial products follow RBI, SEBI, and Income Tax rules.',
            what_depends_on_context: 'Your personal income, risk profile, and investment horizon.',
            real_world_example: 'Always check official SEBI/RBI circulars before acting on financial claims.',
            remember_this: 'If a claim promises guaranteed high returns with zero risk, treat it with caution.',
            common_mistake: 'Acting on unverified claims without checking official regulatory disclosures.',
          };
        }
      };

      const runCheckWithModel = async (modelName: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 18000);
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Statement to evaluate: "${cleanStatement}"\nRespond in ${selectedLang}. If the input is gibberish or not a meaningful claim, set verdict to "Cannot verify" and explain politely in ${selectedLang}.`,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: mythFactSchema,
              abortSignal: controller.signal,
            },
          });
          const rawText = response.text?.trim() || '';
          if (!rawText) throw new Error('Empty response');
          return parseRobustMythFactJson(rawText);
        } finally {
          clearTimeout(timeoutId);
        }
      };

      let parsed: MythFactStructuredResult;
      try {
        parsed = await runCheckWithModel(GEMINI_PRIMARY_MODEL);
      } catch {
        try {
          parsed = await runCheckWithModel(GEMINI_FALLBACK_MODEL);
        } catch {
          const fallbackResponse = await ai.models.generateContent({
            model: GEMINI_PRIMARY_MODEL,
            contents: `${systemInstruction}\n\nEvaluate this statement: "${cleanStatement}"\nRespond ONLY with a valid JSON object containing keys: verdict ("Myth", "Fact", "Partly true / depends", or "Cannot verify"), short_answer, why, what_is_factual, what_depends_on_context, real_world_example, remember_this, common_mistake in ${selectedLang}.`,
          });
          parsed = parseRobustMythFactJson(fallbackResponse.text?.trim() || '');
        }
      }

      const allowedVerdicts: MythFactStructuredResult['verdict'][] = [
        'Myth',
        'Fact',
        'Partly true / depends',
        'Cannot verify',
      ];
      const normalizedVerdict: MythFactStructuredResult['verdict'] = allowedVerdicts.includes(
        parsed.verdict as MythFactStructuredResult['verdict']
      )
        ? (parsed.verdict as MythFactStructuredResult['verdict'])
        : /myth|false/i.test(String(parsed.verdict))
        ? 'Myth'
        : /partly|depend/i.test(String(parsed.verdict))
        ? 'Partly true / depends'
        : /fact|true/i.test(String(parsed.verdict))
        ? 'Fact'
        : 'Cannot verify';

      const finalResult: MythFactStructuredResult = {
        verdict: normalizedVerdict,
        short_answer: String(parsed.short_answer || '').trim(),
        why: String(parsed.why || '').trim(),
        what_is_factual: String(parsed.what_is_factual || '').trim(),
        what_depends_on_context: String(parsed.what_depends_on_context || '').trim(),
        real_world_example: String(parsed.real_world_example || '').trim(),
        remember_this: String(parsed.remember_this || '').trim(),
        common_mistake: String(parsed.common_mistake || '').trim(),
      };

      // If user is logged in, persist to their account history
      let savedEntry: MythFactCheckEntry | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length).trim();
        const userId = await verifySupabaseToken(token);
        if (userId) {
          savedEntry = {
            id: crypto.randomUUID(),
            statement: cleanStatement,
            verdict: finalResult.verdict,
            response: finalResult,
            language: selectedLang,
            timestamp: new Date().toISOString(),
          };
          await addMythFactCheck({
            ...savedEntry,
            userId,
          });
        }
      }

      res.json({ result: finalResult, savedEntry });
    } catch {
      res.status(503).json({ error: 'CHECK_TEMPORARILY_UNAVAILABLE' });
    }
  });

  // POST /api/document/explain - Financial Document Explainer (ITEM 2)
  app.post('/api/document/explain', async (req: Request, res: Response) => {
    const { fileData, mimeType, fileName, language, textContent } = req.body || {};
    const cleanMime = String(mimeType || 'text/plain').trim().toLowerCase();
    const allowedMimes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'text/plain',
      'text/csv',
    ];

    if (!allowedMimes.includes(cleanMime)) {
      res.status(400).json({ error: 'UNSUPPORTED_FILE_TYPE' });
      return;
    }

    const rawBase64 = String(fileData || '').replace(/^data:[^;]+;base64,/, '').trim();
    const rawText = String(textContent || '').trim();

    if (!rawBase64 && !rawText) {
      res.status(400).json({ error: 'EMPTY_FILE_DATA' });
      return;
    }

    if (rawBase64) {
      const approxBytes = Math.floor((rawBase64.length * 3) / 4);
      if (approxBytes > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'FILE_TOO_LARGE' });
        return;
      }
    }

    const validLanguages = ['English', 'Hindi', 'Marathi'] as const;
    const selectedLang: 'English' | 'Hindi' | 'Marathi' = validLanguages.includes(language)
      ? language
      : 'English';

    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      console.warn('[Document Explainer] Request failed: Gemini API key is missing.');
      res.status(503).json({ error: 'MISSING_API_KEY' });
      return;
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
      });

      const normalizedMime = cleanMime === 'image/jpg' ? 'image/jpeg' : cleanMime;

      const systemInstruction = `You are a friendly financial document explainer for ordinary people in India. Read the document or text the user gives you and explain everything important in it in very simple ${selectedLang}, using short sentences and everyday words. Explain what the document is, its purpose, what the key numbers and terms mean (balances, amounts, dates, interest rates, charges, fees, tenure, due dates, benefits, risks), and what the user should watch out for or do next.
Never include sensitive personal information in your answer, such as account numbers, card numbers, Aadhaar, PAN, phone numbers, email addresses, home addresses, customer IDs, or policy holder personal numbers. Refer to them generically, for example 'your account' or 'your policy'. If the input is unreadable, blurry, or is not a financial document, say so politely in the summary and set status accordingly.`;

      const docSchema = {
        type: Type.OBJECT,
        properties: {
          status: {
            type: Type.STRING,
            description:
              'Must be one of: "success" (valid readable financial document), "unreadable" (blurry or illegible image/file), or "not_financial_document" (image/file is not a financial document)',
          },
          document_type: {
            type: Type.STRING,
            description:
              'Detected document type, e.g. Salary Slip, Form 16, Bank Statement, Loan Agreement, Insurance Policy, Credit Card Statement, GST Invoice, Non-Financial Image, or Unreadable Document',
          },
          detected_language: {
            type: Type.STRING,
            description:
              'Detected primary language of the document: "Marathi", "Hindi", or "English"',
          },
          summary: { type: Type.STRING },
          key_fields: {
            type: Type.ARRAY,
            description:
              'Key fields and real values read directly from the document (e.g. Bank Name, Branch, Account Type, Account Opening Date, Occupation, Balances, Transactions, etc.). Sensitive identifiers (account number, customer ID, phone, email, PAN, Aadhaar, card number) MUST be in MASKED form with only the last 4 characters visible, e.g. Account No: XXXXXXXX3594.',
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
              },
              required: ['label', 'value'],
            },
          },
          important_terms_explained: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['term', 'explanation'],
            },
          },
          things_to_watch_out_for: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          questions_you_may_want_to_ask: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'status',
          'document_type',
          'detected_language',
          'summary',
          'key_fields',
          'important_terms_explained',
          'things_to_watch_out_for',
          'questions_you_may_want_to_ask',
        ],
      };

      const runDocExplainWithModel = async (modelName: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        try {
          const parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> = [];

          if (rawBase64) {
            parts.push({
              inlineData: {
                mimeType: normalizedMime,
                data: rawBase64,
              },
            });
          }

          if (rawText) {
            parts.push({
              text: `Pasted Document Text:\n${sanitizePii(rawText)}`,
            });
          }

          parts.push({
            text: `Analyze this uploaded financial document (${fileName || 'document'}).

KEY EXTRACTION & EXPLANATION INSTRUCTIONS:
1. Carefully READ and EXTRACT all real values visibly printed or written in the document into "key_fields":
   - For a bank passbook, bank statement, or account document, extract all readable details:
     * Bank Name (e.g., State Bank of India, HDFC Bank, Bank of Maharashtra, ICICI Bank)
     * Branch & IFSC Code / MICR Code
     * Account Type (e.g., Savings Bank Account, Current Account, Salary Account)
     * Account Number (MUST be MASKED with only last 4 visible, e.g., Account No: XXXXXXXX3594)
     * Customer ID / CIF Number (MUST be MASKED with only last 4 visible, e.g., Customer ID: XXXXX1234)
     * Account Opening Date / Issue Date
     * Occupation / Nominee (if visible)
     * Available Balance / Opening Balance / Closing Balance (in ₹ Rupees)
     * Recent Transactions (date, withdrawal/deposit amount, balance after transaction)
     * Interest Rate, Mode of Operation, or other visible terms
   - For other financial documents (salary slip, Form 16, loan agreement, bill, policy), extract the actual real values visibly present (e.g., Basic Pay, Gross Salary, Net Pay, Deductions, Loan Amount, EMI, Interest Rate, Premium, Due Date).
   - In "key_fields", explain each extracted field and its value in very simple English so a normal person with no finance background can easily understand it.

PRIVACY & SENSITIVE IDENTIFIERS MASKING RULES (CRITICAL):
2. Sensitive identifiers (account number, customer ID, phone, email, PAN, Aadhaar, card number) MUST be shown in MASKED form with ONLY the last 4 characters visible (for example: Account No: XXXXXXXX3594, Customer ID: XXXXX1234, Phone: XXXXXX3210, Email: XXXXXXX@domain.com, PAN: XXXXXX234F, Aadhaar: XXXXXXXX9012, Card Number: XXXXXXXXXXXX4444). Do NOT skip them and do NOT show them in full! Always include them in masked form.
3. FORBIDDEN INFORMATION:
   - Do NOT show the account holder's full name.
   - Do NOT show the account holder's personal home address.
   - Do NOT include any visual description of the photo/image (do NOT describe the camera angle, photo background, paper folds, lighting, or borders). Focus purely on the financial data.

Language Rules:
- Detect the primary language of the document ("Marathi", "Hindi", or "English").
- Provide the explanation, summary, important terms, things to watch out for, and questions to ask in that detected language (defaulting to ${selectedLang}).
- Explain in simple, plain words with short sentences.
- All monetary amounts must be in Rupees (₹).
- If the image/file is blurry, blank, or too illegible to read any text, set status to "unreadable" and provide a polite message in summary asking for a clearer, readable image or document.
- If the image/file is not a financial document, set status to "not_financial_document" and provide a polite message in summary explaining that the file does not appear to be a financial document.`,
          });

          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts,
            },
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: docSchema,
              abortSignal: controller.signal,
            },
          });
          const responseRawText = response.text?.trim() || '';
          if (!responseRawText) throw new Error('Empty document explanation');
          const cleaned = responseRawText
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim();
          const firstBrace = cleaned.indexOf('{');
          const lastBrace = cleaned.lastIndexOf('}');
          const jsonSlice =
            firstBrace !== -1 && lastBrace > firstBrace
              ? cleaned.slice(firstBrace, lastBrace + 1)
              : cleaned;
          return JSON.parse(jsonSlice);
        } finally {
          clearTimeout(timeoutId);
        }
      };

      let rawExplanation;
      try {
        rawExplanation = await runDocExplainWithModel(GEMINI_PRIMARY_MODEL);
      } catch (primErr) {
        console.warn(`[Document Explainer] Primary model (${GEMINI_PRIMARY_MODEL}) failed:`, (primErr as Error)?.message || primErr);
        try {
          rawExplanation = await runDocExplainWithModel(GEMINI_FALLBACK_MODEL);
        } catch (fallErr) {
          console.error(`[Document Explainer] Fallback model (${GEMINI_FALLBACK_MODEL}) also failed:`, (fallErr as Error)?.message || fallErr);
          throw fallErr;
        }
      }

      // Helper specific to POST /api/document/explain route only:
      // Masks value so only the last 4 characters are visible (e.g. XXXXXXXX3594).
      const maskDocFieldValueToLast4 = (val: string): string => {
        if (!val) return '';
        const str = String(val).trim();
        if (!str) return '';

        // If it's an explanatory note like "not clearly readable", leave it as is
        if (/^not\s+clearly\s+readable/i.test(str)) {
          return str;
        }

        // If already masked with 4+ X's or asterisks leaving up to 4 alphanumeric chars at the end
        if (/[X*]{4,}[A-Za-z0-9]{2,4}$/.test(str) || /^[X*x#\s\-_:.]+[A-Za-z0-9]{1,4}$/.test(str)) {
          return str;
        }

        // If value has a prefix like "Account No: 123456783594"
        const prefixMatch = str.match(/^([^:]+:\s*)(.+)$/);
        if (prefixMatch) {
          return prefixMatch[1] + maskDocFieldValueToLast4(prefixMatch[2]);
        }

        // If email address
        if (str.includes('@')) {
          const atIdx = str.indexOf('@');
          const userPart = str.slice(0, atIdx);
          const domainPart = str.slice(atIdx);
          const visibleUser = userPart.slice(-4);
          const maskedUser = 'X'.repeat(Math.max(4, userPart.length - visibleUser.length)) + visibleUser;
          return maskedUser + domainPart;
        }

        // Extract alphanumeric characters
        const alphanumeric = str.replace(/[^A-Za-z0-9]/g, '');
        if (alphanumeric.length === 0) return str;
        if (alphanumeric.length <= 4) {
          return 'XXXX' + alphanumeric;
        }

        const last4 = alphanumeric.slice(-4);
        const maskCount = Math.max(4, alphanumeric.length - 4);
        return 'X'.repeat(maskCount) + last4;
      };

      // Label-based safety check: if label contains account, customer, phone, tel, email, PAN, Aadhaar or card
      const isSensitiveDocFieldLabel = (label: string): boolean => {
        const l = label.toLowerCase().trim();
        // Skip non-sensitive metadata labels like "account type", "account opening date", "account status"
        if (/account\s+(?:type|status|category|nature)/i.test(l)) return false;
        if (/account\s+(?:opening\s+)?date/i.test(l)) return false;

        return /(?:account|customer|phone|tel|email|pan|aadhaar|card)/i.test(l);
      };

      // Prohibited fields check: do not show account holder full name, home address, or photo description
      const isProhibitedDocField = (label: string, value: string): boolean => {
        const l = label.toLowerCase().trim();
        const v = value.toLowerCase().trim();

        // Account holder full name (keep bank name / branch name)
        if (
          /(?:account\s*holder|customer|holder|client|user|borrower|applicant)\s*name/i.test(l) ||
          (l === 'name' && !/(?:bank|branch|company|employer)/i.test(v))
        ) {
          return true;
        }

        // Personal home address (keep bank branch address)
        if (
          /(?:home|residential|permanent|current|customer|holder)\s*address/i.test(l) ||
          (l === 'address' && !/(?:bank|branch)/i.test(l))
        ) {
          return true;
        }

        // Visual description of the photo
        if (
          /(?:photo|image|picture|camera|lighting|background|fold|glare|blur|angle|border)\b/i.test(l) ||
          /(?:photo of|image of|picture of|taken with|captured with|camera angle|lighting in photo)/i.test(v)
        ) {
          return true;
        }

        return false;
      };

      // Apply deterministic server-side privacy masking and label-based safety checks
      const explanation = {
        status:
          rawExplanation?.status === 'unreadable' ||
          rawExplanation?.status === 'not_financial_document'
            ? rawExplanation.status
            : 'success',
        document_type: maskSensitiveFinancialIdentifiers(
          String(rawExplanation?.document_type || 'Document')
        ),
        detected_language: maskSensitiveFinancialIdentifiers(
          String(rawExplanation?.detected_language || selectedLang)
        ),
        summary: maskSensitiveFinancialIdentifiers(String(rawExplanation?.summary || '')),
        key_fields: Array.isArray(rawExplanation?.key_fields)
          ? rawExplanation.key_fields
              .filter((kf: { label?: string; value?: string }) => {
                const label = String(kf?.label || '').trim();
                const value = String(kf?.value || '').trim();
                if (!label && !value) return false;
                return !isProhibitedDocField(label, value);
              })
              .map((kf: { label?: string; value?: string }) => {
                const rawLabel = String(kf?.label || '').trim();
                let rawValue = String(kf?.value || 'not clearly readable').trim();

                // Requirement 4: Label-based safety check inside this route only
                if (isSensitiveDocFieldLabel(rawLabel)) {
                  rawValue = maskDocFieldValueToLast4(rawValue);
                }

                return {
                  label: maskSensitiveFinancialIdentifiers(rawLabel),
                  value: maskSensitiveFinancialIdentifiers(rawValue),
                };
              })
          : [],
        important_terms_explained: Array.isArray(rawExplanation?.important_terms_explained)
          ? rawExplanation.important_terms_explained.map(
              (it: { term?: string; explanation?: string }) => ({
                term: maskSensitiveFinancialIdentifiers(String(it?.term || '')),
                explanation: maskSensitiveFinancialIdentifiers(String(it?.explanation || '')),
              })
            )
          : [],
        things_to_watch_out_for: Array.isArray(rawExplanation?.things_to_watch_out_for)
          ? rawExplanation.things_to_watch_out_for.map((w: string) =>
              maskSensitiveFinancialIdentifiers(String(w || ''))
            )
          : [],
        questions_you_may_want_to_ask: Array.isArray(
          rawExplanation?.questions_you_may_want_to_ask
        )
          ? rawExplanation.questions_you_may_want_to_ask.map((q: string) =>
              maskSensitiveFinancialIdentifiers(String(q || ''))
            )
          : [],
      };

      res.json({ explanation });
    } catch (err) {
      console.error('[Document Explainer Error]:', (err as Error)?.message || err);
      res.status(503).json({ error: 'DOCUMENT_EXPLAIN_UNAVAILABLE' });
    }
  });

  // GET /api/document/saved & POST /api/document/save - Save ONLY explanation text (never the file) for logged-in user
  app.get('/api/document/saved', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const list = await getSavedDocumentExplanations(req.userId!);
    res.json({ savedExplanations: list });
  });

  app.post('/api/document/save', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fileName, explanation, language } = req.body || {};
      if (!explanation || typeof explanation.summary !== 'string') {
        res.status(400).json({ error: 'Invalid explanation data.' });
        return;
      }
      const entry: SavedDocumentExplanationRecord = {
        id: crypto.randomUUID(),
        userId: req.userId!,
        fileName: maskSensitiveFinancialIdentifiers(String(fileName || 'Document')),
        document_type: maskSensitiveFinancialIdentifiers(String(explanation.document_type || 'Document')),
        summary: maskSensitiveFinancialIdentifiers(String(explanation.summary || '')),
        key_fields: Array.isArray(explanation.key_fields) ? explanation.key_fields : [],
        important_terms_explained: Array.isArray(explanation.important_terms_explained)
          ? explanation.important_terms_explained
          : [],
        things_to_watch_out_for: Array.isArray(explanation.things_to_watch_out_for)
          ? explanation.things_to_watch_out_for
          : [],
        questions_you_may_want_to_ask: Array.isArray(explanation.questions_you_may_want_to_ask)
          ? explanation.questions_you_may_want_to_ask
          : [],
        language: ['English', 'Hindi', 'Marathi'].includes(language) ? language : 'English',
        timestamp: new Date().toISOString(),
      };
      await addSavedDocumentExplanation(entry);
      res.json({ savedEntry: entry });
    } catch {
      res.status(500).json({ error: 'Could not save explanation.' });
    }
  });

  // GET /api/calculators/saved & POST /api/calculators/save - Save user calculator runs (ITEM 2)
  app.get('/api/calculators/saved', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const list = await getSavedCalculations(req.userId!);
    res.json({ savedCalculations: list });
  });

  app.post('/api/calculators/save', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { calculatorType, label, inputs, outputs } = req.body || {};
      if (!['SIP', 'EMI', 'CTC'].includes(calculatorType)) {
        res.status(400).json({ error: 'Invalid calculator type.' });
        return;
      }
      const entry: SavedCalculationRecord = {
        id: crypto.randomUUID(),
        userId: req.userId!,
        calculatorType,
        label: String(label || `${calculatorType} Calculation`),
        inputs: inputs || {},
        outputs: outputs || {},
        timestamp: new Date().toISOString(),
      };
      await addSavedCalculation(entry);
      res.json({ savedEntry: entry });
    } catch {
      res.status(500).json({ error: 'Could not save calculation.' });
    }
  });

  // GET /api/termopedia/progress - Retrieve logged-in user's Flashcard statuses & Quiz attempts (CHANGE 4)
  app.get('/api/termopedia/progress', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const flashcardProgress = await getFlashcardProgress(req.userId!);
    const quizAttempts = await getQuizAttempts(req.userId!);
    res.json({ flashcardProgress, quizAttempts });
  });

  // PUT /api/termopedia/flashcard-status - Save "known" or "learning" status for a term card (CHANGE 4)
  app.put('/api/termopedia/flashcard-status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { termId, status } = req.body || {};
      const cleanTermId = String(termId || '').trim();
      if (!cleanTermId || (status !== 'known' && status !== 'learning')) {
        res.status(400).json({ error: 'Invalid termId or status.' });
        return;
      }
      await setFlashcardStatus(req.userId!, cleanTermId, status);
      const flashcardProgress = await getFlashcardProgress(req.userId!);
      res.json({ flashcardProgress });
    } catch {
      res.status(500).json({ error: 'Failed to save flashcard progress.' });
    }
  });

  // POST /api/termopedia/quiz-attempt - Save a completed quiz attempt for the logged-in user (CHANGE 4)
  app.post('/api/termopedia/quiz-attempt', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { category, score, totalQuestions, language } = req.body || {};
      const parsedScore = Number(score);
      const parsedTotal = Number(totalQuestions);
      if (
        !Number.isFinite(parsedScore) ||
        !Number.isFinite(parsedTotal) ||
        parsedTotal <= 0 ||
        parsedScore < 0 ||
        parsedScore > parsedTotal
      ) {
        res.status(400).json({ error: 'Invalid quiz score or question count.' });
        return;
      }
      const attempt: QuizAttemptRecord = {
        id: crypto.randomUUID(),
        userId: req.userId!,
        category: String(category || 'All'),
        score: Math.round(parsedScore),
        totalQuestions: Math.round(parsedTotal),
        language: ['English', 'Hindi', 'Marathi'].includes(language) ? language : 'English',
        timestamp: new Date().toISOString(),
      };
      await addQuizAttempt(attempt);
      const quizAttempts = await getQuizAttempts(req.userId!);
      res.json({ savedAttempt: attempt, quizAttempts });
    } catch {
      res.status(500).json({ error: 'Failed to save quiz attempt.' });
    }
  });

  return app;
}

export const app = createExpressApp();

async function startStandaloneServer() {
  const PORT = Number(process.env.PORT) || 3000;

  // Serve public assets (including /videos/login-bg.mp4 with byte-range streaming)
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const apiKey = getGeminiApiKey();
  if (apiKey) {
    console.log('Gemini API key loaded successfully.');
  } else {
    console.warn('GEMINI_API_KEY is missing. Add it to a .env file and restart.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DhanaDrishti server running on http://localhost:${PORT}`);
  });
}

// Only launch standalone listener when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  startStandaloneServer();
}

export default app;
