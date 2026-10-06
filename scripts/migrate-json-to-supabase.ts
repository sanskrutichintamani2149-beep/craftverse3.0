import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env to run migration.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const LEGACY_DB_FILE = path.join(DATA_DIR, 'dhanadrishti.db.json');

async function migrate() {
  console.log('--- Starting Migration from JSON to Supabase ---');

  let dbPath = fs.existsSync(DB_FILE) ? DB_FILE : fs.existsSync(LEGACY_DB_FILE) ? LEGACY_DB_FILE : null;
  if (!dbPath) {
    console.log('No local db.json found to migrate.');
    return;
  }

  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);
  const users = Object.values(db.users || {}) as any[];

  console.log(`Found ${users.length} user records to migrate.`);

  for (const user of users) {
    console.log(`Migrating user: ${user.email} (${user.id})...`);

    // 1. Ensure user exists in Supabase Auth (or create placeholder)
    let authUserId = user.id;
    try {
      const { data: existingUser } = await supabase.auth.admin.getUserById(user.id);
      if (!existingUser?.user) {
        // Create auth user with confirmed email and random temporary password
        // When user logs in with their old password, server verifies legacy hash and sets their real password
        const tempPassword = crypto.randomBytes(32).toString('hex') + 'Aa1!';
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          id: user.id,
          email: user.email,
          email_confirm: true,
          password: tempPassword,
          user_metadata: { full_name: user.fullName },
        });
        if (createError) {
          // If user exists with different ID, find by email
          const { data: userList } = await supabase.auth.admin.listUsers();
          const match = userList?.users?.find((u) => u.email?.toLowerCase() === user.email.toLowerCase());
          if (match) {
            authUserId = match.id;
          } else {
            console.warn(`Could not create auth user for ${user.email}:`, createError.message);
          }
        } else if (newUser?.user) {
          authUserId = newUser.user.id;
        }
      }
    } catch (authErr: any) {
      console.warn(`Auth check warning for ${user.email}:`, authErr?.message);
    }

    // 2. Upsert Profile
    const profileRow = {
      id: authUserId,
      full_name: user.fullName || 'User',
      email: user.email.toLowerCase(),
      age: user.age || 25,
      location: user.location || 'India',
      preferred_language: user.preferredLanguage || 'English',
      theme: user.theme || 'dark',
      income_type: user.incomeType || 'Salaried',
      dream_job: user.dreamJob || '',
      annual_ctc: user.annualCtc !== undefined ? user.annualCtc : null,
      monthly_expenses: user.monthlyExpenses !== undefined ? user.monthlyExpenses : null,
      monthly_emi: user.monthlyEmi || 0,
      current_savings: user.currentSavings !== undefined ? user.currentSavings : null,
      monthly_investments: user.monthlyInvestments || 0,
      risk_appetite: user.riskAppetite || 'Balanced',
      profile_completed: Boolean(user.profileCompleted),
      created_at: user.createdAt || new Date().toISOString(),
      updated_at: user.updatedAt || new Date().toISOString(),
      legacy_password_hash: user.passwordHash || null,
      legacy_salt: user.salt || null,
    };

    const { error: profErr } = await supabase.from('profiles').upsert(profileRow, { onConflict: 'id' });
    if (profErr) {
      console.error(`Failed to upsert profile for ${user.email}:`, profErr.message);
      continue;
    }

    // 3. Migrate Myth vs Fact History
    const userMythHistory = db.mythFactHistory?.[user.id] || [];
    for (const item of userMythHistory) {
      await supabase.from('myth_fact_history').upsert({
        id: item.id || crypto.randomUUID(),
        user_id: authUserId,
        statement: item.statement,
        verdict: item.verdict,
        response: item.response,
        language: item.language || 'English',
        created_at: item.timestamp || new Date().toISOString(),
      });
    }

    // 4. Migrate Saved Calculations
    const userCalcs = db.savedCalculations?.[user.id] || [];
    for (const item of userCalcs) {
      await supabase.from('saved_calculations').upsert({
        id: item.id || crypto.randomUUID(),
        user_id: authUserId,
        calculator_type: item.calculatorType,
        label: item.label,
        inputs: item.inputs || {},
        outputs: item.outputs || {},
        created_at: item.timestamp || new Date().toISOString(),
      });
    }

    // 5. Migrate Saved Document Explanations
    const userDocs = db.savedDocumentExplanations?.[user.id] || [];
    for (const item of userDocs) {
      await supabase.from('saved_document_explanations').upsert({
        id: item.id || crypto.randomUUID(),
        user_id: authUserId,
        file_name: item.fileName,
        document_type: item.document_type,
        summary: item.summary,
        key_fields: item.key_fields || [],
        important_terms_explained: item.important_terms_explained || [],
        things_to_watch_out_for: item.things_to_watch_out_for || [],
        questions_you_may_want_to_ask: item.questions_you_may_want_to_ask || [],
        language: item.language || 'English',
        created_at: item.timestamp || new Date().toISOString(),
      });
    }

    // 6. Migrate Flashcard Progress
    const userFlashcards = db.flashcardProgress?.[user.id] || {};
    for (const [termId, status] of Object.entries(userFlashcards)) {
      await supabase.from('flashcard_progress').upsert({
        user_id: authUserId,
        term_id: termId,
        status: status as string,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,term_id' });
    }

    // 7. Migrate Quiz Attempts
    const userQuizzes = db.quizAttempts?.[user.id] || [];
    for (const item of userQuizzes) {
      await supabase.from('quiz_attempts').upsert({
        id: item.id || crypto.randomUUID(),
        user_id: authUserId,
        category: item.category,
        score: item.score,
        total_questions: item.totalQuestions,
        language: item.language || 'English',
        created_at: item.timestamp || new Date().toISOString(),
      });
    }
  }

  console.log('--- Migration completed successfully! ---');
  console.log('Notice: data/db.json was kept untouched as a backup.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
