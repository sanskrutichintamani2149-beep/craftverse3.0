import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { maskSensitiveFinancialIdentifiers } from './src/utils/calculators';

dotenv.config();

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
  dreamJob: string;
  annualCtc: number | null;
  monthlyExpenses: number | null;
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
const DB_FILE = path.join(DATA_DIR, 'dhanadrishti.db.json');

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
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
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.users) parsed.users = {};
    if (!parsed.sessions) parsed.sessions = {};
    if (!parsed.mythFactHistory) parsed.mythFactHistory = {};
    if (!parsed.savedCalculations) parsed.savedCalculations = {};
    if (!parsed.savedDocumentExplanations) parsed.savedDocumentExplanations = {};
    if (!parsed.flashcardProgress) parsed.flashcardProgress = {};
    if (!parsed.quizAttempts) parsed.quizAttempts = {};
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
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
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
        password,
        age,
        location,
        preferredLanguage,
        theme,
      } = req.body || {};

      const cleanName = String(fullName || '').trim();
      const cleanEmail = String(email || '').trim().toLowerCase();
      const cleanLocation = String(location || '').trim();
      const parsedAge = Number(age);

      if (!cleanName || cleanName.length < 2) {
        res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
        return;
      }
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
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
      const existing = Object.values(db.users).find((u) => u.email === cleanEmail);
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
        email: cleanEmail,
        passwordHash,
        salt,
        age: Math.round(parsedAge),
        location: cleanLocation,
        preferredLanguage: lang,
        theme: userTheme,
        dreamJob: '',
        annualCtc: null,
        monthlyExpenses: null,
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
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Unable to create account right now. Please try again.' });
    }
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body || {};
      const cleanEmail = String(email || '').trim().toLowerCase();

      if (!cleanEmail || !password) {
        res.status(400).json({ error: 'Please enter both email and password.' });
        return;
      }

      const db = ensureDb();
      const user = Object.values(db.users).find((u) => u.email === cleanEmail);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password. Please check your credentials or sign up.' });
        return;
      }

      const expectedHash = hashPassword(String(password), user.salt);
      if (expectedHash !== user.passwordHash) {
        res.status(401).json({ error: 'Invalid email or password. Please try again.' });
        return;
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
      console.error('Login error:', err);
      res.status(500).json({ error: 'Unable to sign in right now. Please try again.' });
    }
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
        dreamJob,
        annualCtc,
        monthlyExpenses,
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

      // Validate financial fields
      const cleanJob = dreamJob !== undefined ? String(dreamJob).trim() : user.dreamJob;
      if (!cleanJob || cleanJob.length < 2) {
        res.status(400).json({ error: 'Please enter your Dream Job / Job Title (at least 2 characters).' });
        return;
      }

      const parsedCtc = annualCtc !== undefined && annualCtc !== '' ? Number(annualCtc) : user.annualCtc;
      const parsedExpenses = monthlyExpenses !== undefined && monthlyExpenses !== '' ? Number(monthlyExpenses) : user.monthlyExpenses;
      const parsedSavings = currentSavings !== undefined && currentSavings !== '' ? Number(currentSavings) : user.currentSavings;

      if (parsedCtc === null || !Number.isFinite(parsedCtc) || parsedCtc <= 0) {
        res.status(400).json({ error: 'Annual CTC / Salary must be a positive number greater than 0.' });
        return;
      }
      if (parsedExpenses === null || !Number.isFinite(parsedExpenses) || parsedExpenses < 0) {
        res.status(400).json({ error: 'Monthly Expenses cannot be negative or invalid.' });
        return;
      }
      if (parsedSavings === null || !Number.isFinite(parsedSavings) || parsedSavings < 0) {
        res.status(400).json({ error: 'Current Savings cannot be negative or invalid.' });
        return;
      }

      user.dreamJob = cleanJob;
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
        const monthlyInHand = Math.round((user.annualCtc * 0.85) / 12);
        const surplus = Math.max(0, monthlyInHand - user.monthlyExpenses);
        user.monthlyInvestments = Math.round(surplus * 0.5);
      }

      if (riskAppetite && ['Conservative', 'Balanced', 'Aggressive'].includes(riskAppetite)) {
        user.riskAppetite = riskAppetite;
      }

      user.profileCompleted = Boolean(
        user.dreamJob &&
        user.annualCtc !== null &&
        user.annualCtc > 0 &&
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
  const GEMINI_MENTOR_MODEL = 'gemini-3-flash-preview';
  const GEMINI_FALLBACK_MODEL = 'gemini-3.1-flash-lite';

  app.post('/api/mentor/chat', async (req: Request, res: Response) => {
    const { message, history, userContext } = req.body || {};
    const promptText = String(message || '').trim();
    if (!promptText) {
      res.status(400).json({ error: 'EMPTY_MESSAGE' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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

      // Pre-compute exact user financial numbers using the app's calculation logic
      const annualCtc = Number(userContext?.annualCtc || 0);
      const monthlyExpenses = Number(userContext?.monthlyExpenses || 0);
      const currentSavings = Number(userContext?.currentSavings || 0);

      // Same tax & in-hand formula as src/config/financialData.ts
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
      const epfAndGratuity = Math.round(annualCtc * 0.08);
      const monthlyInHand = annualCtc > 0 ? Math.round(Math.max(0, annualCtc - annualTax - epfAndGratuity) / 12) : 0;
      const monthlySurplus = Math.max(0, monthlyInHand - monthlyExpenses);
      const recommendedSip = Math.round(monthlySurplus * 0.6);
      const emergencyTarget6Mo = monthlyExpenses * 6;
      const emergencyShortfall = Math.max(0, emergencyTarget6Mo - currentSavings);
      const monthsToBuildEmergency =
        emergencyShortfall > 0 && monthlySurplus > 0
          ? (emergencyShortfall / monthlySurplus).toFixed(1)
          : '0';

      const selectedLanguage = userContext?.preferredLanguage || 'English';

      const systemInstruction = `You are DhanaDrishti's simple-finance mentor for Indian users.
Your goal is to explain financial concepts and answer any user question in plain, easy-to-understand language with a short real-world Indian example.
Always reply in ${selectedLanguage} (unless the user explicitly asks you to switch languages in their prompt).

Saved User Profile & Pre-Calculated App Numbers (DO NOT re-ask for this information, and DO NOT invent or alter these numbers):
- Name: ${userContext?.fullName || 'Investor'}
- Age: ${userContext?.age || 'Not specified'}
- Location: ${userContext?.location || 'India'}
- Dream Job / Role: ${userContext?.dreamJob || 'Professional'}
- Annual CTC: ₹${annualCtc.toLocaleString('en-IN')}
- Estimated Monthly Take-Home (In-Hand) Salary: ₹${monthlyInHand.toLocaleString('en-IN')}/month (after est. annual EPF/Gratuity of ₹${epfAndGratuity.toLocaleString('en-IN')} and annual Income Tax/TDS of ₹${annualTax.toLocaleString('en-IN')})
- FY 2025-26 Tax Comparison: New Tax Regime Tax = ₹${newRegimeTax.toLocaleString('en-IN')}/yr vs Old Tax Regime Tax (with standard 80C/80D) = ₹${oldRegimeTax.toLocaleString('en-IN')}/yr (Recommended: ${newRegimeTax <= oldRegimeTax ? 'New Tax Regime' : 'Old Tax Regime'})
- Monthly Living Expenses: ₹${monthlyExpenses.toLocaleString('en-IN')}/month
- Monthly Investable Surplus: ₹${monthlySurplus.toLocaleString('en-IN')}/month
- Suggested Monthly SIP (60% of surplus): ₹${recommendedSip.toLocaleString('en-IN')}/month
- Current Savings Corpus: ₹${currentSavings.toLocaleString('en-IN')}
- 6-Month Emergency Fund Target: ₹${emergencyTarget6Mo.toLocaleString('en-IN')} (Shortfall: ₹${emergencyShortfall.toLocaleString('en-IN')}, ~${monthsToBuildEmergency} months of surplus to complete)

Rules:
1. Answer the user's exact question clearly in plain language with a short real-world Indian example (e.g., for GST, TDS, CTC vs take-home, SIP, inflation, etc.).
2. When the user's profile is relevant to the question (such as CTC vs take-home, tax regime choice, SIP allocation, or emergency fund), reference the exact pre-calculated numbers above instead of inventing numbers.
3. Never ask the user to provide their CTC, expenses, or savings since you already have them.
4. If you are unsure about a specific fact or number, state that clearly rather than guessing.
5. Visually highlight important financial figures, percentages, key amounts (e.g., **₹50,000**, **12%**, **₹12,00,000**), key terms, and warnings in bold markdown so they can be highlighted cleanly in the UI.`;

      const recentMessages = Array.isArray(history)
        ? history
            .filter((m: { role?: string; text?: string }) => m && typeof m.text === 'string' && m.text.trim())
            .slice(-8)
        : [];

      const conversationTranscript = recentMessages
        .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'User' : 'DhanaDrishti Mentor'}: ${m.text}`)
        .join('\n\n');

      const fullPrompt = conversationTranscript
        ? `Previous conversation context:\n${conversationTranscript}\n\nCurrent User Question: ${promptText}`
        : `User Question: ${promptText}`;

      const generateWithModel = async (modelName: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
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
        replyText = await generateWithModel(GEMINI_MENTOR_MODEL);
      } catch {
        // Automatic server-side retry / fallback if primary model hits temporary 503 high demand
        replyText = await generateWithModel(GEMINI_FALLBACK_MODEL);
      }

      if (!replyText) {
        res.status(503).json({ error: 'EMPTY_MODEL_RESPONSE' });
        return;
      }

      res.json({ reply: replyText });
    } catch {
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
    const cleanStatement = String(statement || '').trim();

    if (cleanStatement.length < 5) {
      res.status(400).json({ error: 'STATEMENT_TOO_SHORT' });
      return;
    }
    if (cleanStatement.length > 500) {
      res.status(400).json({ error: 'STATEMENT_TOO_LONG' });
      return;
    }

    const validLanguages = ['English', 'Hindi', 'Marathi'] as const;
    const selectedLang: 'English' | 'Hindi' | 'Marathi' = validLanguages.includes(language)
      ? language
      : 'English';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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
        parsed = await runCheckWithModel(GEMINI_MENTOR_MODEL);
      } catch {
        try {
          parsed = await runCheckWithModel(GEMINI_FALLBACK_MODEL);
        } catch {
          const fallbackResponse = await ai.models.generateContent({
            model: GEMINI_MENTOR_MODEL,
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
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

      const normalizedMime = cleanMime === 'image/jpg' ? 'image/jpeg' : cleanMime;

      const systemInstruction = `You are DhanaDrishti's Financial Document Explainer for Indian users.
Carefully read the uploaded document image or PDF and explain it in plain, easy-to-understand ${selectedLang}.

Strict Accuracy & Honesty Rules:
1. Extract ONLY what is actually visible and legible in the uploaded document. Never invent, guess, or assume numbers, salary figures, tax amounts, dates, interest rates, or names that are not visibly present in the document.
2. In "key_fields", list only the label/value pairs that are genuinely visible in the document (e.g., Gross Salary, Basic Pay, EPF Deduction, TDS, Net Pay, EMI, Interest Rate, Due Date, GSTIN, Invoice Total, Policy Sum Assured). If no specific numerical fields are visible, return an empty array or only the visible labels.
3. If part of the document is blurry, cut off, or unreadable, explicitly mention that in "summary" rather than guessing.
4. Translate any financial or legal jargon present in the document into simple ${selectedLang} inside "important_terms_explained".
5. Highlight fees, penalties, lock-in clauses, due dates, or unusual charges that deserve a second look in "things_to_watch_out_for", and suggest practical clarification questions in "questions_you_may_want_to_ask".
6. Do not give personalized investment advice or recommend buying/selling any financial product.`;

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
          'summary',
          'key_fields',
          'important_terms_explained',
          'things_to_watch_out_for',
          'questions_you_may_want_to_ask',
        ],
      };

      const runDocExplainWithModel = async (modelName: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000);
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
              text: `Pasted Document Text:\n${rawText}`,
            });
          }

          parts.push({
            text: `Analyze this uploaded document/text (${fileName || 'financial document'}) and provide the structured explanation in ${selectedLang}.
Rules:
- Explain in simple, plain ${selectedLang} that a person with no financial background can easily grasp.
- Extract ONLY what is visibly readable in the file or text. If any value is unclear, write "not clearly readable". Never invent numbers.
- Mask any visible Bank Account, Card, Aadhaar, or PAN numbers so only the last 4 digits/characters appear (e.g., XXXXXX1234).
- If the image/file is too blurry or blank to read any text, set status to "unreadable" and explain politely in summary.
- If the image/file is not a financial document (e.g. a logo, portrait, nature photo, or unrelated object), set status to "not_financial_document" and state politely in summary that this does not appear to be a financial document.`,
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
        rawExplanation = await runDocExplainWithModel(GEMINI_MENTOR_MODEL);
      } catch {
        rawExplanation = await runDocExplainWithModel(GEMINI_FALLBACK_MODEL);
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
    } catch {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DhanaDrishti server running on http://localhost:${PORT}`);
  });
}

startServer();
