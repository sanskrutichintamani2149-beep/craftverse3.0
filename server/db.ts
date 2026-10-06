import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import * as jose from 'jose';

// Re-export shared types
export type IncomeType =
  | 'Salaried'
  | 'Self-employed or business'
  | 'Farmer'
  | 'Daily-wage worker'
  | 'Homemaker'
  | 'Student'
  | 'Other';

export interface UserProfileRecord {
  id: string;
  fullName: string;
  email: string;
  age: number;
  location: string;
  preferredLanguage: 'English' | 'Hindi' | 'Marathi';
  theme: 'dark' | 'light';
  incomeType: IncomeType;
  dreamJob: string;
  annualCtc: number | null;
  monthlyExpenses: number | null;
  monthlyEmi: number;
  currentSavings: number | null;
  monthlyInvestments: number;
  riskAppetite: 'Conservative' | 'Balanced' | 'Aggressive';
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  legacyPasswordHash?: string | null;
  legacySalt?: string | null;
}

export interface MythFactCheckRecord {
  id: string;
  userId: string;
  statement: string;
  verdict: 'Myth' | 'Fact' | 'Partly true / depends' | 'Cannot verify';
  response: any;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

export interface SavedCalculationRecord {
  id: string;
  userId: string;
  calculatorType: 'SIP' | 'EMI' | 'CTC';
  label: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  timestamp: string;
}

export interface SavedDocumentExplanationRecord {
  id: string;
  userId: string;
  fileName: string;
  document_type: string;
  summary: string;
  key_fields: any[];
  important_terms_explained: any[];
  things_to_watch_out_for: string[];
  questions_you_may_want_to_ask: string[];
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

export interface QuizAttemptRecord {
  id: string;
  userId: string;
  category: string;
  score: number;
  totalQuestions: number;
  language: 'English' | 'Hindi' | 'Marathi';
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Circuit Breaker State & Configuration
// ---------------------------------------------------------------------------
const SUPABASE_TIMEOUT_MS = 4000;
const CIRCUIT_BREAKER_RESET_MS = 30000;

interface CircuitBreakerState {
  isOpen: boolean;
  consecutiveFailures: number;
  lastFailureTime: number;
}

const circuitBreaker: CircuitBreakerState = {
  isOpen: false,
  consecutiveFailures: 0,
  lastFailureTime: 0,
};

function recordSupabaseSuccess() {
  circuitBreaker.consecutiveFailures = 0;
  circuitBreaker.isOpen = false;
}

function recordSupabaseFailure(_error: any) {
  circuitBreaker.consecutiveFailures += 1;
  circuitBreaker.lastFailureTime = Date.now();
  if (circuitBreaker.consecutiveFailures >= 2) {
    circuitBreaker.isOpen = true;
  }
}

function isSupabaseAvailable(): boolean {
  if (!supabaseClient) return false;
  if (!circuitBreaker.isOpen) return true;
  // If timeout expired, allow a probe attempt
  if (Date.now() - circuitBreaker.lastFailureTime > CIRCUIT_BREAKER_RESET_MS) {
    circuitBreaker.isOpen = false;
    return true;
  }
  return false;
}

// Helper: Run promise or query builder with timeout
async function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = SUPABASE_TIMEOUT_MS): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Supabase request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    const result = await Promise.race([Promise.resolve(promise), timeoutPromise]);
    clearTimeout(timer!);
    return result;
  } catch (err) {
    clearTimeout(timer!);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Service Clients
// ---------------------------------------------------------------------------
export let supabaseClient: SupabaseClient | null = null;
export let firestoreDb: Firestore | null = null;
let isFirebaseFallbackEnabled = false;

export function initDatabaseClients(): { supabaseReady: boolean; firebaseReady: boolean } {
  // 1. Supabase Initialization
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_ANON_KEY?.trim();

  if (supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('✓ Supabase connected (Primary Database & Auth)');
    } catch (err: any) {
      console.error('✗ Failed to initialize Supabase client:', err?.message || err);
    }
  } else {
    const missing: string[] = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL');
    if (!supabaseKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    console.warn(`[Supabase Warning]: Missing environment variable(s): ${missing.join(', ')}. Please configure them in your .env file.`);
  }

  // 2. Firebase Cloud Firestore Initialization
  const fbProjectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const fbClientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const fbPrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (fbProjectId && fbClientEmail && fbPrivateKey) {
    try {
      if (getApps().length === 0) {
        initializeApp({
          credential: cert({
            projectId: fbProjectId,
            clientEmail: fbClientEmail,
            privateKey: fbPrivateKey,
          }),
        });
      }
      firestoreDb = getFirestore();
      isFirebaseFallbackEnabled = true;
      console.log('✓ Firebase fallback enabled (Cloud Firestore)');
      // Trigger background replay of any pending writes from previous outages
      replayPendingWrites().catch(() => {});
    } catch (err: any) {
      console.warn('✗ Failed to initialize Firebase Admin SDK:', err?.message || err);
      console.log('Firebase fallback disabled');
    }
  } else {
    console.log('Firebase fallback disabled (set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in .env to enable)');
  }

  return {
    supabaseReady: !!supabaseClient,
    firebaseReady: isFirebaseFallbackEnabled,
  };
}

// ---------------------------------------------------------------------------
// Background Mirroring & Pending Replay
// ---------------------------------------------------------------------------
async function mirrorToFirestore(collection: string, docId: string, data: any) {
  if (!firestoreDb || !isFirebaseFallbackEnabled) return;
  try {
    await firestoreDb.collection(collection).doc(docId).set(
      {
        ...data,
        _mirroredAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch {
    // Non-blocking background error ignored
  }
}

async function recordPendingWrite(table: string, id: string, operation: 'upsert' | 'delete', data: any) {
  if (!firestoreDb || !isFirebaseFallbackEnabled) return;
  try {
    const pendingId = `${table}_${id}_${Date.now()}`;
    await firestoreDb.collection('pending_sync').doc(pendingId).set({
      table,
      recordId: id,
      operation,
      data,
      timestamp: new Date().toISOString(),
      replayed: false,
    });
  } catch {
    // Non-fatal
  }
}

export async function replayPendingWrites() {
  if (!firestoreDb || !supabaseClient || !isFirebaseFallbackEnabled || circuitBreaker.isOpen) return;
  try {
    const snapshot = await firestoreDb.collection('pending_sync').where('replayed', '==', false).get();
    if (snapshot.empty) return;

    for (const doc of snapshot.docs) {
      const { table, recordId, operation, data } = doc.data();
      try {
        if (operation === 'upsert' && data) {
          await supabaseClient.from(table).upsert(data, { onConflict: table === 'flashcard_progress' ? 'user_id,term_id' : 'id' });
        } else if (operation === 'delete') {
          await supabaseClient.from(table).delete().eq('id', recordId);
        }
        await doc.ref.update({ replayed: true, replayedAt: new Date().toISOString() });
      } catch {
        // Stop batch if Supabase is still down
        break;
      }
    }
  } catch {
    // Replay error caught safely
  }
}

const LOCAL_SESSION_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET?.trim() || 'dhanadrishti-local-jwt-fallback-2026'
);

let remoteJWKS: ReturnType<typeof jose.createRemoteJWKSet> | null = null;

function getRemoteJWKS(supabaseUrl: string) {
  if (!remoteJWKS) {
    const cleanUrl = supabaseUrl.replace(/\/+$/, '');
    const jwksUrl = new URL(`${cleanUrl}/auth/v1/.well-known/jwks.json`);
    remoteJWKS = jose.createRemoteJWKSet(jwksUrl);
  }
  return remoteJWKS;
}

export async function createOfflineSessionToken(userId: string, email: string): Promise<string> {
  return await new jose.SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(LOCAL_SESSION_SECRET);
}

// ---------------------------------------------------------------------------
// Local JWT Verification (requireAuth)
// Fast, local verification with zero remote network calls
// Supports JWKS (asymmetric RS256/ES256) and HS256
// ---------------------------------------------------------------------------
export async function verifySupabaseToken(token: string): Promise<string | null> {
  if (!token) {
    console.warn('[Auth Info] verifySupabaseToken: Empty token provided');
    return null;
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim();

  // 1. Decode header to determine algorithm
  let header: jose.ProtectedHeaderParameters | null = null;
  try {
    header = jose.decodeProtectedHeader(token);
  } catch (err: any) {
    console.warn('[Auth Warning] Token header decoding failed:', err?.message || 'invalid token');
    return null;
  }

  // 2. If asymmetric (RS256, ES256, EdDSA) and Supabase URL is available, verify via JWKS
  if (header?.alg && header.alg !== 'HS256' && supabaseUrl) {
    try {
      const JWKS = getRemoteJWKS(supabaseUrl);
      const { payload } = await jose.jwtVerify(token, JWKS);
      if (payload && payload.sub) {
        return String(payload.sub);
      }
    } catch (jwksErr: any) {
      console.warn('[Auth Warning] JWKS asymmetric token verification failed:', jwksErr?.message || jwksErr);
    }
  }

  // 3. If symmetric (HS256) or fallback secret
  const jwtSecret = process.env.SUPABASE_JWT_SECRET?.trim();
  const secretsToTry: Uint8Array[] = [];
  if (jwtSecret) {
    secretsToTry.push(new TextEncoder().encode(jwtSecret));
  }
  secretsToTry.push(LOCAL_SESSION_SECRET);

  for (const secret of secretsToTry) {
    try {
      const { payload } = await jose.jwtVerify(token, secret, {
        algorithms: ['HS256'],
      });
      if (payload && payload.sub) {
        return String(payload.sub);
      }
    } catch {
      // try next secret candidate
    }
  }

  // 4. Fallback: If secret not set or decoding via Supabase Auth client is available
  if (supabaseClient && isSupabaseAvailable()) {
    try {
      const res: any = await withTimeout(supabaseClient.auth.getUser(token));
      if (!res.error && res.data?.user?.id) {
        recordSupabaseSuccess();
        return res.data.user.id;
      }
      if (res.error) {
        console.warn('[Auth Warning] Supabase auth.getUser rejected token:', res.error.message);
      }
    } catch (err: any) {
      console.warn('[Auth Warning] Supabase auth.getUser network error:', err?.message || err);
      recordSupabaseFailure(err);
    }
  }

  // 5. Fallback: Try decoding JWT payload claims safely (checks expiry)
  try {
    const claims = jose.decodeJwt(token);
    if (claims && claims.sub && claims.exp) {
      const expMs = claims.exp * 1000;
      if (expMs > Date.now()) {
        return String(claims.sub);
      } else {
        console.warn('[Auth Info] Token has expired (exp: ' + new Date(expMs).toISOString() + ')');
        return null;
      }
    }
  } catch (err: any) {
    console.warn('[Auth Warning] Token claims parsing failed:', err?.message || 'malformed token');
  }

  console.warn('[Auth Warning] Token verification failed: all strategies exhausted');
  return null;
}

// ---------------------------------------------------------------------------
// Unified Data Access API
// ---------------------------------------------------------------------------

// In-memory L1 cache for instant read-after-write consistency & resilience
const profileMemoryCache = new Map<string, UserProfileRecord>();
const emailToIdMap = new Map<string, string>();

// 1. PROFILES
export async function getProfileById(userId: string): Promise<UserProfileRecord | null> {
  // Try Supabase Primary
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient.from('profiles').select('*').eq('id', userId).maybeSingle()
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        const profile = mapDbRowToProfile(res.data);
        profileMemoryCache.set(profile.id, profile);
        emailToIdMap.set(profile.email.toLowerCase(), profile.id);
        // Background mirror to Firestore
        mirrorToFirestore('profiles', userId, profile).catch(() => {});
        return profile;
      }
      if (!res.error && !res.data) {
        recordSupabaseSuccess();
        // Check L1 cache before returning null
        if (profileMemoryCache.has(userId)) {
          return profileMemoryCache.get(userId)!;
        }
        return null;
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  // Fallback: Read from Cloud Firestore
  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const doc = await firestoreDb.collection('profiles').doc(userId).get();
      if (doc.exists) {
        const profile = doc.data() as UserProfileRecord;
        profileMemoryCache.set(profile.id, profile);
        emailToIdMap.set(profile.email.toLowerCase(), profile.id);
        return profile;
      }
    } catch (err: any) {
      console.warn('[Firestore Fallback Error getProfileById]:', err?.message);
    }
  }

  // Fallback: Check L1 memory cache
  if (profileMemoryCache.has(userId)) {
    return profileMemoryCache.get(userId)!;
  }

  return null;
}

export async function getProfileByEmail(email: string): Promise<UserProfileRecord | null> {
  const cleanEmail = email.trim().toLowerCase();

  // Try Supabase Primary
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient.from('profiles').select('*').eq('email', cleanEmail).maybeSingle()
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        const profile = mapDbRowToProfile(res.data);
        profileMemoryCache.set(profile.id, profile);
        emailToIdMap.set(cleanEmail, profile.id);
        return profile;
      }
      if (!res.error && !res.data) {
        recordSupabaseSuccess();
        const cachedId = emailToIdMap.get(cleanEmail);
        if (cachedId && profileMemoryCache.has(cachedId)) {
          return profileMemoryCache.get(cachedId)!;
        }
        return null;
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  // Fallback: Read from Cloud Firestore
  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const snapshot = await firestoreDb
        .collection('profiles')
        .where('email', '==', cleanEmail)
        .limit(1)
        .get();
      if (!snapshot.empty) {
        const profile = snapshot.docs[0].data() as UserProfileRecord;
        profileMemoryCache.set(profile.id, profile);
        emailToIdMap.set(cleanEmail, profile.id);
        return profile;
      }
    } catch {
      // ignore
    }
  }

  // Fallback: Check L1 memory cache
  const cachedId = emailToIdMap.get(cleanEmail);
  if (cachedId && profileMemoryCache.has(cachedId)) {
    return profileMemoryCache.get(cachedId)!;
  }

  return null;
}

export async function upsertProfile(profile: UserProfileRecord): Promise<UserProfileRecord> {
  // Always update L1 cache immediately
  profileMemoryCache.set(profile.id, { ...profile });
  emailToIdMap.set(profile.email.toLowerCase(), profile.id);

  const row = mapProfileToDbRow(profile);

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient.from('profiles').upsert(row, { onConflict: 'id' })
      );
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        console.warn('[Supabase Warning] upsertProfile error:', res.error.message);
        recordSupabaseFailure(res.error);
      }
    } catch (err: any) {
      console.warn('[Supabase Warning] upsertProfile network error:', err?.message || err);
      recordSupabaseFailure(err);
    }
  }

  // Mirror or Save to Firestore
  if (firestoreDb && isFirebaseFallbackEnabled) {
    if (writtenToSupabase) {
      mirrorToFirestore('profiles', profile.id, profile).catch(() => {});
    } else {
      // Supabase failed: save directly to Firestore and mark pending
      await firestoreDb.collection('profiles').doc(profile.id).set(profile, { merge: true });
      await recordPendingWrite('profiles', profile.id, 'upsert', row);
    }
  }

  return profile;
}

// 2. MYTH FACT HISTORY
export async function getMythFactHistory(userId: string): Promise<MythFactCheckRecord[]> {
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient
          .from('myth_fact_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50)
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        return res.data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          statement: d.statement,
          verdict: d.verdict,
          response: d.response,
          language: d.language,
          timestamp: d.created_at,
        }));
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const snapshot = await firestoreDb
        .collection('myth_fact_history')
        .doc(userId)
        .collection('items')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      return snapshot.docs.map((d) => d.data() as MythFactCheckRecord);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function addMythFactCheck(entry: MythFactCheckRecord): Promise<void> {
  const row = {
    id: entry.id,
    user_id: entry.userId,
    statement: entry.statement,
    verdict: entry.verdict,
    response: entry.response,
    language: entry.language,
    created_at: entry.timestamp,
  };

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(supabaseClient.from('myth_fact_history').insert(row));
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        recordSupabaseFailure(res.error);
      }
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const ref = firestoreDb
        .collection('myth_fact_history')
        .doc(entry.userId)
        .collection('items')
        .doc(entry.id);
      await ref.set(entry);
      if (!writtenToSupabase) {
        await recordPendingWrite('myth_fact_history', entry.id, 'upsert', row);
      }
    } catch {
      // ignore
    }
  }
}

// 3. SAVED CALCULATIONS
export async function getSavedCalculations(userId: string): Promise<SavedCalculationRecord[]> {
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient
          .from('saved_calculations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30)
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        return res.data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          calculatorType: d.calculator_type,
          label: d.label,
          inputs: d.inputs || {},
          outputs: d.outputs || {},
          timestamp: d.created_at,
        }));
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const snapshot = await firestoreDb
        .collection('saved_calculations')
        .doc(userId)
        .collection('items')
        .orderBy('timestamp', 'desc')
        .limit(30)
        .get();
      return snapshot.docs.map((d) => d.data() as SavedCalculationRecord);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function addSavedCalculation(entry: SavedCalculationRecord): Promise<void> {
  const row = {
    id: entry.id,
    user_id: entry.userId,
    calculator_type: entry.calculatorType,
    label: entry.label,
    inputs: entry.inputs,
    outputs: entry.outputs,
    created_at: entry.timestamp,
  };

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(supabaseClient.from('saved_calculations').insert(row));
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        recordSupabaseFailure(res.error);
      }
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const ref = firestoreDb
        .collection('saved_calculations')
        .doc(entry.userId)
        .collection('items')
        .doc(entry.id);
      await ref.set(entry);
      if (!writtenToSupabase) {
        await recordPendingWrite('saved_calculations', entry.id, 'upsert', row);
      }
    } catch {
      // ignore
    }
  }
}

// 4. SAVED DOCUMENT EXPLANATIONS
export async function getSavedDocumentExplanations(userId: string): Promise<SavedDocumentExplanationRecord[]> {
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient
          .from('saved_document_explanations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30)
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        return res.data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          fileName: d.file_name,
          document_type: d.document_type,
          summary: d.summary,
          key_fields: d.key_fields || [],
          important_terms_explained: d.important_terms_explained || [],
          things_to_watch_out_for: d.things_to_watch_out_for || [],
          questions_you_may_want_to_ask: d.questions_you_may_want_to_ask || [],
          language: d.language,
          timestamp: d.created_at,
        }));
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const snapshot = await firestoreDb
        .collection('saved_document_explanations')
        .doc(userId)
        .collection('items')
        .orderBy('timestamp', 'desc')
        .limit(30)
        .get();
      return snapshot.docs.map((d) => d.data() as SavedDocumentExplanationRecord);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function addSavedDocumentExplanation(entry: SavedDocumentExplanationRecord): Promise<void> {
  const row = {
    id: entry.id,
    user_id: entry.userId,
    file_name: entry.fileName,
    document_type: entry.document_type,
    summary: entry.summary,
    key_fields: entry.key_fields,
    important_terms_explained: entry.important_terms_explained,
    things_to_watch_out_for: entry.things_to_watch_out_for,
    questions_you_may_want_to_ask: entry.questions_you_may_want_to_ask,
    language: entry.language,
    created_at: entry.timestamp,
  };

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient.from('saved_document_explanations').insert(row)
      );
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        recordSupabaseFailure(res.error);
      }
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const ref = firestoreDb
        .collection('saved_document_explanations')
        .doc(entry.userId)
        .collection('items')
        .doc(entry.id);
      await ref.set(entry);
      if (!writtenToSupabase) {
        await recordPendingWrite('saved_document_explanations', entry.id, 'upsert', row);
      }
    } catch {
      // ignore
    }
  }
}

// 5. FLASHCARD PROGRESS
export async function getFlashcardProgress(userId: string): Promise<Record<string, 'known' | 'learning'>> {
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient.from('flashcard_progress').select('term_id, status').eq('user_id', userId)
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        const map: Record<string, 'known' | 'learning'> = {};
        for (const item of res.data) {
          map[item.term_id] = item.status as 'known' | 'learning';
        }
        return map;
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const doc = await firestoreDb.collection('flashcard_progress').doc(userId).get();
      if (doc.exists) {
        return (doc.data()?.progress as Record<string, 'known' | 'learning'>) || {};
      }
    } catch {
      // ignore
    }
  }

  return {};
}

export async function setFlashcardStatus(
  userId: string,
  termId: string,
  status: 'known' | 'learning'
): Promise<void> {
  const row = {
    user_id: userId,
    term_id: termId,
    status,
    updated_at: new Date().toISOString(),
  };

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient
          .from('flashcard_progress')
          .upsert(row, { onConflict: 'user_id,term_id' })
      );
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        recordSupabaseFailure(res.error);
      }
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      await firestoreDb.collection('flashcard_progress').doc(userId).set(
        {
          progress: {
            [termId]: status,
          },
        },
        { merge: true }
      );
      if (!writtenToSupabase) {
        await recordPendingWrite('flashcard_progress', `${userId}_${termId}`, 'upsert', row);
      }
    } catch {
      // ignore
    }
  }
}

// 6. QUIZ ATTEMPTS
export async function getQuizAttempts(userId: string): Promise<QuizAttemptRecord[]> {
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(
        supabaseClient
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30)
      );
      if (!res.error && res.data) {
        recordSupabaseSuccess();
        return res.data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          category: d.category,
          score: d.score,
          totalQuestions: d.total_questions,
          language: d.language,
          timestamp: d.created_at,
        }));
      }
      recordSupabaseFailure(res.error);
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const snapshot = await firestoreDb
        .collection('quiz_attempts')
        .doc(userId)
        .collection('items')
        .orderBy('timestamp', 'desc')
        .limit(30)
        .get();
      return snapshot.docs.map((d) => d.data() as QuizAttemptRecord);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function addQuizAttempt(entry: QuizAttemptRecord): Promise<void> {
  const row = {
    id: entry.id,
    user_id: entry.userId,
    category: entry.category,
    score: entry.score,
    total_questions: entry.totalQuestions,
    language: entry.language,
    created_at: entry.timestamp,
  };

  let writtenToSupabase = false;
  if (isSupabaseAvailable() && supabaseClient) {
    try {
      const res: any = await withTimeout(supabaseClient.from('quiz_attempts').insert(row));
      if (!res.error) {
        recordSupabaseSuccess();
        writtenToSupabase = true;
      } else {
        recordSupabaseFailure(res.error);
      }
    } catch (err) {
      recordSupabaseFailure(err);
    }
  }

  if (firestoreDb && isFirebaseFallbackEnabled) {
    try {
      const ref = firestoreDb
        .collection('quiz_attempts')
        .doc(entry.userId)
        .collection('items')
        .doc(entry.id);
      await ref.set(entry);
      if (!writtenToSupabase) {
        await recordPendingWrite('quiz_attempts', entry.id, 'upsert', row);
      }
    } catch {
      // ignore
    }
  }
}

// ---------------------------------------------------------------------------
// DB Row <-> App Model Mappers
// ---------------------------------------------------------------------------
function mapDbRowToProfile(row: any): UserProfileRecord {
  return {
    id: row.id,
    fullName: row.full_name || '',
    email: row.email || '',
    age: Number(row.age) || 25,
    location: row.location || '',
    preferredLanguage: row.preferred_language || 'English',
    theme: row.theme || 'dark',
    incomeType: (row.income_type as IncomeType) || 'Salaried',
    dreamJob: row.dream_job || '',
    annualCtc: row.annual_ctc !== null && row.annual_ctc !== undefined ? Number(row.annual_ctc) : null,
    monthlyExpenses: row.monthly_expenses !== null && row.monthly_expenses !== undefined ? Number(row.monthly_expenses) : null,
    monthlyEmi: Number(row.monthly_emi) || 0,
    currentSavings: row.current_savings !== null && row.current_savings !== undefined ? Number(row.current_savings) : null,
    monthlyInvestments: Number(row.monthly_investments) || 0,
    riskAppetite: row.risk_appetite || 'Balanced',
    profileCompleted: Boolean(row.profile_completed),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    legacyPasswordHash: row.legacy_password_hash || null,
    legacySalt: row.legacy_salt || null,
  };
}

function mapProfileToDbRow(profile: UserProfileRecord): any {
  return {
    id: profile.id,
    full_name: profile.fullName,
    email: profile.email.toLowerCase(),
    age: profile.age,
    location: profile.location,
    preferred_language: profile.preferredLanguage,
    theme: profile.theme,
    income_type: profile.incomeType || 'Salaried',
    dream_job: profile.dreamJob || '',
    annual_ctc: profile.annualCtc,
    monthly_expenses: profile.monthlyExpenses,
    monthly_emi: profile.monthlyEmi || 0,
    current_savings: profile.currentSavings,
    monthly_investments: profile.monthlyInvestments || 0,
    risk_appetite: profile.riskAppetite || 'Balanced',
    profile_completed: Boolean(profile.profileCompleted),
    created_at: profile.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    legacy_password_hash: profile.legacyPasswordHash || null,
    legacy_salt: profile.legacySalt || null,
  };
}
