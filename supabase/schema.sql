-- ============================================================================
-- DhanaDrishti (Craftverse 3.0) — Supabase PostgreSQL Schema
-- Run this script in the Supabase SQL Editor.
-- ============================================================================

-- Enable pgcrypto / uuid-ossp if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Mirrors user account & financial profile)
-- Directly references Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 15 AND age <= 100),
    location TEXT NOT NULL,
    preferred_language TEXT NOT NULL DEFAULT 'English' CHECK (preferred_language IN ('English', 'Hindi', 'Marathi')),
    theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
    income_type TEXT NOT NULL DEFAULT 'Salaried' CHECK (income_type IN ('Salaried', 'Self-employed or business', 'Farmer', 'Daily-wage worker', 'Homemaker', 'Student', 'Other')),
    dream_job TEXT DEFAULT '',
    annual_ctc NUMERIC DEFAULT NULL,
    monthly_expenses NUMERIC DEFAULT NULL,
    monthly_emi NUMERIC DEFAULT 0,
    current_savings NUMERIC DEFAULT NULL,
    monthly_investments NUMERIC DEFAULT 0,
    risk_appetite TEXT NOT NULL DEFAULT 'Balanced' CHECK (risk_appetite IN ('Conservative', 'Balanced', 'Aggressive')),
    profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Temporary columns for seamless existing PBKDF2 user password migration
    legacy_password_hash TEXT DEFAULT NULL,
    legacy_salt TEXT DEFAULT NULL
);

-- 2. MYTH VS FACT HISTORY TABLE (Retains newest 50 checks per user)
CREATE TABLE IF NOT EXISTS public.myth_fact_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    verdict TEXT NOT NULL,
    response JSONB NOT NULL,
    language TEXT NOT NULL DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SAVED CALCULATIONS TABLE (Retains newest 30 calculations per user)
CREATE TABLE IF NOT EXISTS public.saved_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    calculator_type TEXT NOT NULL CHECK (calculator_type IN ('SIP', 'EMI', 'CTC')),
    label TEXT NOT NULL,
    inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    outputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SAVED DOCUMENT EXPLANATIONS TABLE (Retains newest 30 explanations per user; text only, never files)
CREATE TABLE IF NOT EXISTS public.saved_document_explanations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    document_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    key_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    important_terms_explained JSONB NOT NULL DEFAULT '[]'::jsonb,
    things_to_watch_out_for JSONB NOT NULL DEFAULT '[]'::jsonb,
    questions_you_may_want_to_ask JSONB NOT NULL DEFAULT '[]'::jsonb,
    language TEXT NOT NULL DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FLASHCARD PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    term_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('known', 'learning')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, term_id)
);

-- 6. QUIZ ATTEMPTS TABLE (Retains newest 30 attempts per user)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    language TEXT NOT NULL DEFAULT 'English',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_myth_fact_user_created ON public.myth_fact_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_calc_user_created ON public.saved_calculations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_doc_user_created ON public.saved_document_explanations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flashcard_user ON public.flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_user_created ON public.quiz_attempts(user_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- All application requests query through the Express backend with service_role.
-- Deny public and anonymous access to prevent unauthorized client exposure.
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.myth_fact_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_document_explanations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Revoke default public/anon permissions
REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
REVOKE ALL ON TABLE public.myth_fact_history FROM anon, authenticated;
REVOKE ALL ON TABLE public.saved_calculations FROM anon, authenticated;
REVOKE ALL ON TABLE public.saved_document_explanations FROM anon, authenticated;
REVOKE ALL ON TABLE public.flashcard_progress FROM anon, authenticated;
REVOKE ALL ON TABLE public.quiz_attempts FROM anon, authenticated;

-- Grant access to service_role (used exclusively by our server)
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.myth_fact_history TO service_role;
GRANT ALL ON TABLE public.saved_calculations TO service_role;
GRANT ALL ON TABLE public.saved_document_explanations TO service_role;
GRANT ALL ON TABLE public.flashcard_progress TO service_role;
GRANT ALL ON TABLE public.quiz_attempts TO service_role;
