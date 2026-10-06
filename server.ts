import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { maskSensitiveFinancialIdentifiers } from './src/utils/calculators';
import { sanitizePii } from './src/utils/piiSanitizer';

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

export type IncomeType =
  | 'Salaried'
  | 'Self-employed or business'
  | 'Farmer'
  | 'Daily-wage worker'
  | 'Homemaker'
  | 'Student'
  | 'Other';

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  salt: string;
  age: number;
  location: string;
  preferredLanguage: 'English' | 'Hindi' | 'Marathi';
  theme: 'dark' | 'light';
  incomeType?: IncomeType;
  dreamJob: string;
  annualCtc: number | null;
  monthlyExpenses: number | null;
  monthlyEmi?: number;
  currentSavings: number | null;
  monthlyInvestments: number;
  riskAppetite: 'Conservative' | 'Balanced' | 'Aggressive';
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SessionRecord {
  token: string;
  userId: string;
  expiresAt: number;
}

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

export interface QuizAttemptRecord {
  id: string;
  category: string;
  score: number;
  totalQuestions: number;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  sessions: Record<string, SessionRecord>;
  mythFactHistory?: Record<string, MythFactCheckEntry[]>;
  savedCalculations?: Record<string, SavedCalculationEntry[]>;
  savedDocumentExplanations?: Record<string, SavedDocumentExplanationEntry[]>;
  flashcardProgress?: Record<string, Record<string, 'known' | 'learning'>>;
  quizAttempts?: Record<string, QuizAttemptRecord[]>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const LEGACY_DB_FILE = path.join(DATA_DIR, 'dhanadrishti.db.json');

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  let targetFile = DB_FILE;
  if (!fs.existsSync(DB_FILE) && fs.existsSync(LEGACY_DB_FILE)) {
    targetFile = LEGACY_DB_FILE;
  }

  if (!fs.existsSync(targetFile)) {
    const initial: DatabaseSchema = {
      users: {},
      sessions: {},
      mythFactHistory: {},
      savedCalculations: {},
      savedDocumentExplanations: {},
      flashcardProgress: {},
      quizAttempts: {},
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    fs.writeFileSync(LEGACY_DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(targetFile, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.users) parsed.users = {};
    if (!parsed.sessions) parsed.sessions = {};
    if (!parsed.mythFactHistory) parsed.mythFactHistory = {};
    if (!parsed.savedCalculations) parsed.savedCalculations = {};
    if (!parsed.savedDocumentExplanations) parsed.savedDocumentExplanations = {};
    if (!parsed.flashcardProgress) parsed.flashcardProgress = {};
    if (!parsed.quizAttempts) parsed.quizAttempts = {};

    // Treat existing users who already have their dashboard data filled in as completed
    for (const u of Object.values(parsed.users)) {
      if (u.incomeType === undefined || u.incomeType === null) {
        u.incomeType = 'Salaried';
      }
      if (u.monthlyEmi === undefined || u.monthlyEmi === null) {
        u.monthlyEmi = 0;
      }
      if (u.profileCompleted === undefined || u.profileCompleted === null) {
        const allowZero = u.incomeType === 'Student' || u.incomeType === 'Homemaker';
        u.profileCompleted = Boolean(
          u.annualCtc !== null &&
          (allowZero ? u.annualCtc >= 0 : u.annualCtc > 0) &&
          u.monthlyExpenses !== null &&
          u.monthlyExpenses >= 0
        );
      }
    }

    // Ensure db.json exists with the latest loaded contents
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }

    return parsed;
  } catch {
    return {
      users: {},
      sessions: {},
      mythFactHistory: {},
      savedCalculations: {},
      savedDocumentExplanations: {},
      flashcardProgress: {},
      quizAttempts: {},
    };
  }
}

function saveDb(db: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const content = JSON.stringify(db, null, 2);
  fs.writeFileSync(DB_FILE, content, 'utf-8');
  try {
    fs.writeFileSync(LEGACY_DB_FILE, content, 'utf-8');
  } catch {
    // Secondary legacy file update failure is non-fatal
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const pbkdf2Hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    const pbkdf2Buf = Buffer.from(pbkdf2Hash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (pbkdf2Buf.length === storedBuf.length && crypto.timingSafeEqual(pbkdf2Buf, storedBuf)) {
      return true;
    }
    // Backward compatibility for existing users with legacy scrypt hashes
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

function sanitizeUser(user: UserRecord) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in again.' });
    return;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  const db = ensureDb();
  const session = db.sessions[token];
  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      delete db.sessions[token];
      saveDb(db);
    }
    res.status(401).json({ error: 'Your session has expired. Please log in again.' });
    return;
  }
  const user = db.users[session.userId];
  if (!user) {
    res.status(401).json({ error: 'User account not found. Please log in again.' });
    return;
  }
  // Row-Level Security enforcement: bind authenticated userId strictly from verified session token
  req.userId = user.id;
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // POST /api/auth/signup
  app.post('/api/auth/signup', (req: Request, res: Response) => {
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

      const cleanName = String(fullName || '').trim();
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

      const db = ensureDb();
      const existing = Object.values(db.users).find(
        (u) => u.email.toLowerCase() === rawIdentifier || (u as any).username?.toLowerCase() === rawIdentifier
      );
      if (existing) {
        res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
        return;
      }

      const id = crypto.randomUUID();
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHash = hashPassword(String(password), salt);
      const now = new Date().toISOString();

      const newUser: UserRecord = {
        id,
        fullName: cleanName,
        email: rawIdentifier,
        passwordHash,
        salt,
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
      };

      const token = crypto.randomBytes(32).toString('hex');
      db.users[id] = newUser;
      db.sessions[token] = {
        token,
        userId: id,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14, // 14 days
      };
      saveDb(db);

      res.status(201).json({
        token,
        user: sanitizeUser(newUser),
      });
    } catch (err) {
      console.error('Signup error:', err instanceof Error ? err.message : 'Error');
      res.status(500).json({ error: 'Unable to create account right now. Please try again.' });
    }
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body || {};
      const cleanIdentifier = String(email || username || '').trim().toLowerCase();

      if (!cleanIdentifier || !password) {
        res.status(400).json({ error: 'Please enter both email and password.' });
        return;
      }

      const db = ensureDb();
      const user = Object.values(db.users).find(
        (u) => u.email.toLowerCase() === cleanIdentifier || (u as any).username?.toLowerCase() === cleanIdentifier
      );
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password. Please check your credentials or sign up.' });
        return;
      }

      if (!verifyPassword(String(password), user.salt, user.passwordHash)) {
        res.status(401).json({ error: 'Invalid email or password. Please try again.' });
        return;
      }

      // Upgrade legacy password hash to PBKDF2 seamlessly if needed
      const pbkdf2Expected = hashPassword(String(password), user.salt);
      if (user.passwordHash !== pbkdf2Expected) {
        user.passwordHash = pbkdf2Expected;
      }

      const token = crypto.randomBytes(32).toString('hex');
      db.sessions[token] = {
        token,
        userId: user.id,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 14,
      };
      saveDb(db);

      res.json({
        token,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Login error:', err instanceof Error ? err.message : 'Error');
      res.status(500).json({ error: 'Unable to sign in right now. Please try again.' });
    }
  });

  // GET /api/auth/me - session check
  app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const user = db.users[req.userId!];
    if (!user) {
      res.status(401).json({ error: 'User account not found. Please log in again.' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  // GET /api/auth/session - session verification
  app.get('/api/auth/session', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const user = db.users[req.userId!];
    if (!user) {
      res.status(401).json({ error: 'User account not found. Please log in again.' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  // POST /api/auth/logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length).trim();
        const db = ensureDb();
        if (db.sessions[token]) {
          delete db.sessions[token];
          saveDb(db);
        }
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({ error: 'Failed to log out cleanly.' });
    }
  });

  // GET /api/profile - RLS enforced via requireAuth
  app.get('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const user = db.users[req.userId!];
    if (!user) {
      res.status(404).json({ error: 'Profile not found.' });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  // PUT /api/profile - Update financial & personal profile (RLS enforced via req.userId)
  app.put('/api/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = ensureDb();
      const user = db.users[req.userId!];
      if (!user) {
        res.status(404).json({ error: 'User profile not found.' });
        return;
      }

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

      db.users[user.id] = user;
      saveDb(db);

      res.json({ user: sanitizeUser(user) });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Failed to save your profile. Please try again.' });
    }
  });

  // PATCH /api/profile/theme - Persist user theme preference across devices
  app.patch('/api/profile/theme', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { theme } = req.body || {};
      if (theme !== 'light' && theme !== 'dark') {
        res.status(400).json({ error: 'Theme must be "light" or "dark".' });
        return;
      }
      const db = ensureDb();
      const user = db.users[req.userId!];
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }
      user.theme = theme;
      user.updatedAt = new Date().toISOString();
      db.users[user.id] = user;
      saveDb(db);
      res.json({ theme: user.theme, user: sanitizeUser(user) });
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
      let dbUser: UserRecord | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice('Bearer '.length).trim();
        const db = ensureDb();
        const session = db.sessions[token];
        if (session && session.expiresAt > Date.now() && db.users[session.userId]) {
          dbUser = db.users[session.userId];
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

      // Tax calculations (only relevant for salaried employees)
      const newTaxable = Math.max(0, annualCtc - 75000);
      let newTax = 0;
      if (newTaxable > 1200000) {
        const slabs = [
          { limit: 400000, rate: 0 },
          { limit: 800000, rate: 0.05 },
          { limit: 1200000, rate: 0.1 },
          { limit: 1600000, rate: 0.15 },
          { limit: 2000000, rate: 0.2 },
          { limit: 2400000, rate: 0.25 },
          { limit: Infinity, rate: 0.3 },
        ];
        let prev = 0;
        for (const s of slabs) {
          if (newTaxable > prev) {
            newTax += (Math.min(newTaxable, s.limit) - prev) * s.rate;
            prev = s.limit;
          }
        }
      }
      const newRegimeTax = Math.round(newTax * 1.04);

      const oldTaxable = Math.max(0, annualCtc - 50000 - 150000 - 50000);
      let oldTax = 0;
      if (oldTaxable > 500000) {
        if (oldTaxable > 250000) oldTax += (Math.min(oldTaxable, 500000) - 250000) * 0.05;
        if (oldTaxable > 500000) oldTax += (Math.min(oldTaxable, 1000000) - 500000) * 0.2;
        if (oldTaxable > 1000000) oldTax += (oldTaxable - 1000000) * 0.3;
      }
      const oldRegimeTax = Math.round(oldTax * 1.04);
      const annualTax = Math.min(newRegimeTax, oldRegimeTax);
      const epfAndGratuity = isSalaried ? Math.round(annualCtc * 0.08) : 0;

      // In-hand monthly calculation:
      // Salaried: deducts tax and EPF
      // Non-salaried: monthly income entered was stored as monthly * 12, so monthly take-home = annualCtc / 12
      const monthlyInHand = hasCtc
        ? isSalaried
          ? Math.round(Math.max(0, annualCtc - annualTax - epfAndGratuity) / 12)
          : Math.round(annualCtc / 12)
        : 0;

      const monthlySurplus = (hasCtc && hasExpenses) ? Math.max(0, monthlyInHand - monthlyExpenses - monthlyEmi) : null;
      const recommendedSip = monthlySurplus !== null ? Math.round(monthlySurplus * 0.6) : null;
      const emergencyTarget = (hasExpenses && (monthlyExpenses + monthlyEmi) > 0) ? (monthlyExpenses + monthlyEmi) * emergencyMonths : null;
      const emergencyShortfall = (emergencyTarget !== null && hasSavings) ? Math.max(0, emergencyTarget - currentSavings) : null;
      const monthsToBuildEmergency =
        emergencyShortfall !== null && emergencyShortfall > 0 && monthlySurplus !== null && monthlySurplus > 0
          ? (emergencyShortfall / monthlySurplus).toFixed(1)
          : emergencyShortfall === 0 ? '0 (Fully funded)' : 'Unknown';

      const missingFields: string[] = [];
      if (!hasCtc && (isSalaried || (incomeType !== 'Student' && incomeType !== 'Homemaker'))) {
        missingFields.push(isSalaried ? 'Annual CTC / Salary' : 'Monthly Income');
      }
      if (!hasExpenses) missingFields.push('Monthly Living Expenses');
      if (!hasSavings) missingFields.push('Current Savings Corpus');

      const selectedLanguage = resolvedContext?.preferredLanguage || 'English';

      // PII Sanitization for user question and history
      const sanitizedPrompt = sanitizePii(promptText);

      const systemInstruction = `You are DhanDrishti's AI financial mentor, a friendly, knowledgeable financial-literacy guide for Indian users.
Base all your guidance directly on the user's specific Executive Dashboard and profile numbers provided below.

Strict Guidance Rules:
1. Income Profile Adaptation:
   - User's Income Type: "${incomeType}".
   ${
     isSalaried
       ? `- Salaried User: Address their Annual CTC, estimated monthly in-hand post-tax & EPF, and tax regime comparisons.`
       : `- Non-Salaried User (${incomeType}): Do NOT mention salaried CTC, corporate EPF, or corporate tax regime comparisons (New vs Old salaried slabs). Refer to their earnings as monthly income, business income, agricultural/harvest earnings, or household budget.
          - Emergency fund target is specifically ${emergencyMonths} months (₹${emergencyTarget !== null ? emergencyTarget.toLocaleString('en-IN') : 'target'}) to safeguard against variable or irregular cash flows.`
   }
2. Personalized Calculations:
   - When the user asks investment questions (e.g., "What if I invest in this SIP tomorrow?"), directly check their real numbers:
     * Check affordability against their monthly investable surplus (${monthlySurplus !== null ? `₹${monthlySurplus.toLocaleString('en-IN')}` : 'NOT PROVIDED'}) and living expenses.
     * Evaluate the effect on their Emergency Fund: note whether their ${emergencyMonths}-month buffer target is met or if there is a shortfall, and advise building emergency savings first if a gap exists.
     * Factor in their Risk Appetite (${riskAppetite}) and their work/goals (${dreamJob || 'General Financial Health'}).
     * Provide a clear, simple projection with clearly stated assumptions (such as expected rate of return e.g. 10-12% p.a. for equity SIP, duration, and monthly amount).
3. Missing Data Honesty:
   - If crucial financial data needed to answer the question is marked as "NOT PROVIDED" (such as income, expenses, or savings), explicitly state what numbers are missing instead of inventing or assuming figures.
4. Language & Tone:
   - Always respond in ${selectedLanguage} using simple words and short, clear sentences that any person without financial background can easily understand.
   - For Hindi and Marathi, write your entire response strictly in Devanagari script (not Hinglish or Romanized script).
5. Privacy & Data Minimization:
   - Never reveal, guess, or ask for sensitive identifiers (account numbers, card numbers, PAN, Aadhaar, phone numbers, email addresses, passwords, tokens). Only discuss the general financial figures.
6. Educational Disclaimer:
   - Always include a brief note stating that projections are estimates and this is educational guidance, not licensed financial advice.
7. Formatting:
   - Highlight key figures and percentages in bold (e.g. **₹5,000**, **12% p.a.**). Keep explanations practical and structured.

Financial Dashboard Context (Anonymized & Minimized):
- Income Category: ${incomeType}
- Occupation / Field: ${dreamJob || 'Not specified'}
- Risk Profile: ${riskAppetite}
- Location Context: ${resolvedContext?.location || 'India'}
${isSalaried ? `- Annual CTC Package: ${hasCtc ? `₹${annualCtc.toLocaleString('en-IN')}` : 'NOT PROVIDED'}` : `- Annualized Income: ${hasCtc ? `₹${annualCtc.toLocaleString('en-IN')}` : '₹0'}`}
- Monthly In-Hand / Take-Home Income: ${hasCtc ? `₹${monthlyInHand.toLocaleString('en-IN')}/month` : '₹0'}
- Monthly Living Expenses: ${hasExpenses ? `₹${monthlyExpenses.toLocaleString('en-IN')}/month` : 'NOT PROVIDED'}
- Monthly Loan / Liability EMI: ₹${monthlyEmi.toLocaleString('en-IN')}/month
- Monthly Investable Surplus: ${monthlySurplus !== null ? `₹${monthlySurplus.toLocaleString('en-IN')}/month` : 'NOT PROVIDED'}
- Existing Monthly Investments: ₹${monthlyInvestments.toLocaleString('en-IN')}/month
- Recommended Monthly SIP (60% of surplus): ${recommendedSip !== null ? `₹${recommendedSip.toLocaleString('en-IN')}/month` : 'NOT CALCULATED'}
- Current Savings Corpus: ${hasSavings ? `₹${currentSavings.toLocaleString('en-IN')}` : 'NOT PROVIDED'}
- Emergency Fund Target (${emergencyMonths} Months): ${emergencyTarget !== null ? `₹${emergencyTarget.toLocaleString('en-IN')} (Shortfall: ₹${emergencyShortfall?.toLocaleString('en-IN')}, ~${monthsToBuildEmergency} months to reach target)` : 'NOT CALCULATED'}
${isSalaried ? `- Tax Regime Comparison: New Regime Tax = ₹${newRegimeTax.toLocaleString('en-IN')}/yr vs Old Regime Tax = ₹${oldRegimeTax.toLocaleString('en-IN')}/yr (Recommended: ${newRegimeTax <= oldRegimeTax ? 'New Tax Regime' : 'Old Tax Regime'})` : `- Tax Regime: Not applicable for ${incomeType}`}
- Missing Profile Information: ${missingFields.length > 0 ? missingFields.join(', ') : 'None (Full financial numbers available)'}`;

      const recentMessages = Array.isArray(history)
        ? history
            .filter((m: { role?: string; text?: string }) => m && typeof m.text === 'string' && m.text.trim())
            .slice(-8)
            .map((m: { role: string; text: string }) => ({
              role: m.role,
              text: sanitizePii(m.text),
            }))
        : [];

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
  app.get('/api/mythfact/history', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const list = db.mythFactHistory?.[req.userId!] || [];
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
        const db = ensureDb();
        const session = db.sessions[token];
        if (session && session.expiresAt > Date.now() && db.users[session.userId]) {
          savedEntry = {
            id: crypto.randomUUID(),
            statement: cleanStatement,
            verdict: finalResult.verdict,
            response: finalResult,
            language: selectedLang,
            timestamp: new Date().toISOString(),
          };
          if (!db.mythFactHistory) db.mythFactHistory = {};
          const existingList = db.mythFactHistory[session.userId] || [];
          db.mythFactHistory[session.userId] = [savedEntry, ...existingList].slice(0, 50);
          saveDb(db);
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
            text: `Analyze this uploaded document/text (${fileName || 'financial document'}).
Language Rules (CRITICAL):
- DETECT THE LANGUAGE of the uploaded document/text: determine if it is written primarily in Marathi, Hindi, or English. If mixed, choose the dominant language.
- Set detected_language to "Marathi", "Hindi", or "English".
- Provide the ENTIRE explanation, summary, key fields, important terms, things to watch out for, and questions to ask in that DETECTED LANGUAGE.
- If the document is in Marathi, the entire explanation MUST be in simple Marathi (Devanagari script).
- If the document is in Hindi, the entire explanation MUST be in simple Hindi (Devanagari script).
- If the document is in English, the entire explanation MUST be in simple English.
- If the document language cannot be identified or is ambiguous, default to ${selectedLang}.

Content Rules:
- Explain in simple, plain words that a normal person with no finance knowledge can easily understand. Use short sentences and explain any financial term in plain words.
- Explain the complete content of the document: what it is, its purpose, what the key figures and terms mean (balances, amounts, deductions, dates, fees, charges, benefits, due dates), and what the user should note or do next.
- All monetary amounts must be in Rupees (₹).
- Handle all kinds of financial documents (bank passbook or statement, salary slip, Form 16, loan or EMI paper, insurance policy, mutual fund or SIP statement, receipts, tax documents, or pasted text).
- Extract ONLY what is visibly readable in the file or text. If any value is unclear, write "not clearly readable" (or its translation in that language). Never invent numbers.
- PRIVACY: NEVER include sensitive personal information such as account numbers, card numbers, Aadhaar, PAN, phone numbers, emails, addresses, customer IDs, or policy holder personal numbers. Refer to them generically, e.g. "your account".
- If the image/file is blurry, blank, or too illegible to read any text, set status to "unreadable" and provide a polite message in summary in the detected language asking for a clearer, readable image or document.
- If the image/file is not a financial document (e.g. photos of people, nature, logos, or unrelated objects), set status to "not_financial_document" and provide a polite message in summary in the detected language explaining that the file does not appear to be a financial document and asking to upload a financial document.`,
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

      // Apply deterministic server-side privacy masking to all returned strings
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
          ? rawExplanation.key_fields.map((kf: { label?: string; value?: string }) => ({
              label: maskSensitiveFinancialIdentifiers(String(kf?.label || '')),
              value: maskSensitiveFinancialIdentifiers(String(kf?.value || 'not clearly readable')),
            }))
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
  app.get('/api/document/saved', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const list = db.savedDocumentExplanations?.[req.userId!] || [];
    res.json({ savedExplanations: list });
  });

  app.post('/api/document/save', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { fileName, explanation, language } = req.body || {};
      if (!explanation || typeof explanation.summary !== 'string') {
        res.status(400).json({ error: 'Invalid explanation data.' });
        return;
      }
      const db = ensureDb();
      if (!db.savedDocumentExplanations) db.savedDocumentExplanations = {};
      const entry: SavedDocumentExplanationEntry = {
        id: crypto.randomUUID(),
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
      const existing = db.savedDocumentExplanations[req.userId!] || [];
      db.savedDocumentExplanations[req.userId!] = [entry, ...existing].slice(0, 30);
      saveDb(db);
      res.json({ savedEntry: entry });
    } catch {
      res.status(500).json({ error: 'Could not save explanation.' });
    }
  });

  // GET /api/calculators/saved & POST /api/calculators/save - Save user calculator runs (ITEM 2)
  app.get('/api/calculators/saved', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const list = db.savedCalculations?.[req.userId!] || [];
    res.json({ savedCalculations: list });
  });

  app.post('/api/calculators/save', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { calculatorType, label, inputs, outputs } = req.body || {};
      if (!['SIP', 'EMI', 'CTC'].includes(calculatorType)) {
        res.status(400).json({ error: 'Invalid calculator type.' });
        return;
      }
      const db = ensureDb();
      if (!db.savedCalculations) db.savedCalculations = {};
      const entry: SavedCalculationEntry = {
        id: crypto.randomUUID(),
        calculatorType,
        label: String(label || `${calculatorType} Calculation`),
        inputs: inputs || {},
        outputs: outputs || {},
        timestamp: new Date().toISOString(),
      };
      const existing = db.savedCalculations[req.userId!] || [];
      db.savedCalculations[req.userId!] = [entry, ...existing].slice(0, 30);
      saveDb(db);
      res.json({ savedEntry: entry });
    } catch {
      res.status(500).json({ error: 'Could not save calculation.' });
    }
  });

  // GET /api/termopedia/progress - Retrieve logged-in user's Flashcard statuses & Quiz attempts (CHANGE 4)
  app.get('/api/termopedia/progress', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    const db = ensureDb();
    const flashcardProgress = db.flashcardProgress?.[req.userId!] || {};
    const quizAttempts = db.quizAttempts?.[req.userId!] || [];
    res.json({ flashcardProgress, quizAttempts });
  });

  // PUT /api/termopedia/flashcard-status - Save "known" or "learning" status for a term card (CHANGE 4)
  app.put('/api/termopedia/flashcard-status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { termId, status } = req.body || {};
      const cleanTermId = String(termId || '').trim();
      if (!cleanTermId || (status !== 'known' && status !== 'learning')) {
        res.status(400).json({ error: 'Invalid termId or status.' });
        return;
      }
      const db = ensureDb();
      if (!db.flashcardProgress) db.flashcardProgress = {};
      if (!db.flashcardProgress[req.userId!]) db.flashcardProgress[req.userId!] = {};
      db.flashcardProgress[req.userId!][cleanTermId] = status;
      saveDb(db);
      res.json({ flashcardProgress: db.flashcardProgress[req.userId!] });
    } catch {
      res.status(500).json({ error: 'Failed to save flashcard progress.' });
    }
  });

  // POST /api/termopedia/quiz-attempt - Save a completed quiz attempt for the logged-in user (CHANGE 4)
  app.post('/api/termopedia/quiz-attempt', requireAuth, (req: AuthenticatedRequest, res: Response) => {
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
      const db = ensureDb();
      if (!db.quizAttempts) db.quizAttempts = {};
      const attempt: QuizAttemptRecord = {
        id: crypto.randomUUID(),
        category: String(category || 'All'),
        score: Math.round(parsedScore),
        totalQuestions: Math.round(parsedTotal),
        language: ['English', 'Hindi', 'Marathi'].includes(language) ? language : 'English',
        timestamp: new Date().toISOString(),
      };
      const existing = db.quizAttempts[req.userId!] || [];
      db.quizAttempts[req.userId!] = [attempt, ...existing].slice(0, 30);
      saveDb(db);
      res.json({ savedAttempt: attempt, quizAttempts: db.quizAttempts[req.userId!] });
    } catch {
      res.status(500).json({ error: 'Failed to save quiz attempt.' });
    }
  });

  // Serve public assets (including /videos/login-bg.mp4 with byte-range streaming)
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
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

startServer();
