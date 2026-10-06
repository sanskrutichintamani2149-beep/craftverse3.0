# DhanaDrishti (Craftverse 3.0) — Privacy & PII Security Architecture

This document outlines the privacy design, personally identifiable information (PII) sanitization mechanisms, display masking, data minimization policies, and production security recommendations for **DhanaDrishti**.

---

## 1. Executive Summary & Design Principles

DhanaDrishti is designed with **Privacy by Design** and **Data Minimization** as core tenets:
- **Zero Raw PII to Third Parties**: Personal identifiers (names, Aadhaar, PAN, phone numbers, bank accounts, emails, passwords, session tokens) are strictly stripped, scrubbed, or sanitized before any payload reaches external AI providers (Google Gemini).
- **Non-Destructive Masking**: Privacy Mode masks sensitive figures on the client without mutating the underlying numbers, allowing financial calculators, compound interest projections, and charts to remain accurate.
- **In-Memory Ephemeral Processing**: Uploaded documents (salary slips, Form 16, bank statements) are parsed and explained in-memory for the single request cycle only; raw files are never stored on disk or persistent storage.
- **Secure Authentication**: Authentication uses PBKDF2 password hashing with unique per-user salts and cryptographically secure random session tokens.

---

## 2. PII & Financial Data Handled

| Data Category | Specific Fields / Formats | Processing Location | Sanitization / Protection Strategy |
| :--- | :--- | :--- | :--- |
| **Authentication Credentials** | Plaintext passwords | `server.ts` | Hashed with PBKDF2 (`crypto.pbkdf2Sync`, 10,000 iterations, SHA-512) with a 16-byte random salt. Plaintext passwords never written to database or logs. |
| **Session Authentication** | Bearer Tokens (`dhanadrishti_auth_token`) | Client (`localStorage`) & `server.ts` | 32-byte crypto-random hex string (`crypto.randomBytes(32)`). Never sent to external LLMs; sanitized if pasted by mistake. |
| **Government & Financial IDs** | Aadhaar (12 digits), PAN (`[A-Z]{5}[0-9]{4}[A-Z]`), Bank Account (9-18 digits), IFSC, Credit/Debit Cards | In-memory only (Document Scanner & AI chat) | Verhoeff algorithm validates Aadhaar; Luhn algorithm validates cards; regular expressions detect PAN, IFSC, and accounts. Replaced with `[REDACTED_AADHAAR]`, `[REDACTED_PAN]`, `[REDACTED_BANK_ACCOUNT]`, `[REDACTED_CARD]`. |
| **Contact Identifiers** | Indian phone numbers (+91 / 10 digits), Email addresses, UPI IDs | In-memory, Profile DB | Masked on UI (`j•••e@example.com`, `+91 ••••••3210`); sanitized before AI (`[REDACTED_PHONE]`, `[REDACTED_EMAIL]`, `[REDACTED_UPI]`). |
| **User Identity** | Full Name, Age, Location | Profile DB | Stripped from AI Mentor prompts (AI receives financial numbers and age only; user name is NEVER sent to Gemini). Masked on UI (`R•••• S••••`) when Privacy Mode is ON. |
| **Income & Financial Profile** | `incomeType`, `annualCtc`, `monthlyExpenses`, `monthlyEmi`, `currentSavings`, `monthlyInvestments`, `riskAppetite` | Profile DB & AI Context | Preserved as numeric data for calculators; masked on screen with Privacy Mode (`••••••`). Non-salaried users store monthly income as annualized `monthly * 12` in `annualCtc`. |

---

## 3. PII Sanitization Engine (`src/utils/piiSanitizer.ts`)

Located in `src/utils/piiSanitizer.ts` and imported in both frontend and backend (`server.ts`):

### 3.1 Algorithm-Verified Detection
- **Aadhaar Number (12 Digits)**:
  - Uses the **Verhoeff algorithm** (permutation and multiplication matrices $d$ and $p$) to validate Aadhaar checksums.
  - Normalizes spaces and dashes (`1234 5678 9012` -> `123456789012`).
  - Redacts only verified Aadhaar numbers with `[REDACTED_AADHAAR]`, avoiding false positives on generic 12-digit figures.
- **Payment Card Numbers (13–19 Digits)**:
  - Validates potential card sequences via the **Luhn algorithm (Modulus 10)**.
  - Replaces valid Visa, MasterCard, RuPay, Amex numbers with `[REDACTED_CARD]`.
- **Devanagari Numeral Normalization**:
  - Translates Devanagari digits (`०-९`, Unicode range `\u0966-\u096F`) to Latin digits (`0-9`) before pattern matching, ensuring bilingual Hindi/Marathi documents are properly protected.

### 3.2 Regular Expression Matchers
- **Permanent Account Number (PAN)**: `\b[A-Z]{5}[0-9]{4}[A-Z]\b` -> `[REDACTED_PAN]`
- **Indian Mobile Numbers**: `(?:(?:\+91|0091|0)?[ -]?)?[6-9]\d{4}[ -]?\d{5}\b` -> `[REDACTED_PHONE]`
- **Email Addresses**: `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b` -> `[REDACTED_EMAIL]`
- **UPI IDs / VPA**: `[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b` (filtering out standard email domains) -> `[REDACTED_UPI]`
- **Indian Bank Accounts**: 9 to 18 contiguous digits preceded by banking keywords (`account`, `a/c`, `acct`, `खाता`, etc.) -> `[REDACTED_BANK_ACCOUNT]`
- **IFSC Codes**: `\b[A-Z]{4}0[A-Z0-9]{6}\b` -> `[REDACTED_IFSC]`
- **Date of Birth**: Preceded by `dob`, `born`, `birth`, `जन्म` -> `[REDACTED_DOB]`
- **Passwords & Auth Tokens**: Preceded by `password`, `pwd`, `passcode`, `bearer`, `token`, `api_key` -> `[REDACTED_SECRET]`

### 3.3 Preservation of Legitimate Financial Figures
Legitimate monetary amounts (e.g., `₹50,000`, `12,00,000`, `45000 per month`, `8.5% interest`, `10-year horizon`) are explicitly preserved so financial advice, tax slab computations, and compounding models remain numerically accurate.

---

## 4. AI Data Minimization Policy

When constructing queries for Gemini (`POST /api/mentor/chat`, `POST /api/document/explain`, `POST /api/mythfact/check`):
1. **No Personal Names**: The user's name is completely excluded from the AI prompt and system instruction. The mentor addresses the user directly as a financial peer.
2. **No Contact Information**: Email addresses, phone numbers, and physical addresses are never included in the AI context.
3. **No Auth Tokens / Secrets**: Request headers and authorization tokens are processed in `server.ts` auth middleware and never passed to the GenAI SDK.
4. **Input Sanitization**: User-submitted chat messages, conversation history, and pasted document texts pass through `sanitizePii()` prior to invoking `ai.models.generateContent()`.

---

## 5. Non-Destructive Display Masking (`src/utils/masking.ts`)

Located in `src/utils/masking.ts`:
- `maskCurrency(amount, privacyMode)`: When Privacy Mode is active, converts any numeric value or formatted rupee string (e.g., `₹12,00,000` or `1200000`) to `••••••` or `₹••••••`.
- `maskName(name, privacyMode)`: Masks names to their initial and dots (`Rahul Sharma` -> `R•••• S••••`).
- `maskEmail(email, privacyMode)`: Masks emails (`john.doe@example.com` -> `j•••e@example.com`).
- `maskPhone(phone, privacyMode)`: Masks phone numbers (`9876543210` -> `••••••3210`).

**Non-Destructive Principle**: Masking only wraps UI display strings in JSX. Internal calculation state (`annualCtc`, `monthlyExpenses`, `monthlyEmi`, compounding loops, graph coordinates) retains pure floating-point numbers.

---

## 6. Privacy Mode Architecture (`src/context/PrivacyContext.tsx`)

- **State Persistence**: Synced with browser `localStorage` under the key `dhanadrishti_privacy_mode`.
- **Default State**: OFF (`false`).
- **One-Click Toggle**: Accessible in the top navigation bar with visual status indicator (`Eye` / `EyeOff` icon) and responsive badge (`Privacy: ON` / `Privacy: OFF`).
- **Scope**:
  - Executive Dashboard: Annual income/CTC, monthly take-home, living expenses, emergency fund targets, 10-year net worth.
  - 10-Year Roadmap: Net worth snapshot, SIP portfolio balance, liquid cash buffer, cumulative EMI.
  - User Header: Greeting and personalized banner titles.

---

## 7. Diverse Income Types Support

DhanaDrishti supports 7 distinct Indian income demographics:
1. **Salaried** (Default)
2. **Self-employed or business**
3. **Farmer**
4. **Daily-wage worker**
5. **Homemaker**
6. **Student**
7. **Other**

### Key Income Handling Rules:
- **Single Database Storage Field**: Non-salaried users input their **Average Monthly Income**, which is stored as annualized `monthly * 12` in the existing `annualCtc` database column. No new database amount columns were created.
- **Zero Income Permitted**: Students and Homemakers can register and save a financial profile with `0` income.
- **Dynamic Emergency Cushion**:
  - **9 Months**: Recommended for irregular, seasonal, or entrepreneurial income streams (`Self-employed or business`, `Farmer`, `Daily-wage worker`, `Other`).
  - **6 Months**: Recommended for predictable income streams (`Salaried`, `Student`, `Homemaker`).
- **No Inappropriate Salaried Assumptions**: For non-salaried users, monthly take-home is calculated directly as `annualCtc / 12` (no corporate EPF, standard deduction, or salaried tax deductions). The AI Mentor system prompt is instructed to avoid salaried jargon (CTC, Form 16, EPF, corporate bonus) when advising non-salaried users.

---

## 8. Ephemeral Document Analysis & Privacy Notice

- **Dropzone Privacy Notice**: Prominently displayed in `ExplainerView`:
  > *"Your Aadhaar, PAN, phone and account numbers are hidden before AI reads this. Documents are processed purely in-memory for this single analysis request and are never stored or retained on disk or external servers."*
- **Multilingual Support**: Translated into English, Hindi, and Marathi via `src/config/translations.ts`.
- **In-Memory Buffer Only**: File uploads are received as Base64 in JSON request bodies, sent directly to Gemini's multimodal API, and immediately garbage-collected upon response completion. No files are saved to `uploads/`, `/tmp`, or object storage.

---

## 9. Secure Server Logging Hygiene

In `server.ts`:
- **No Request Body Dumps**: `console.log(req.body)` has been removed from all API endpoints.
- **No Credential Logging**: Passwords, hashes, salts, and session tokens are never printed to stdout or log streams.
- **Sanitized Error Logs**: Catch blocks log only concise operational error messages (`err?.message`) rather than entire exception objects that could dump raw database records or unmasked payloads.

---

## 10. Production Security Recommendations (For Cloud Deployment)

| Recommendation | Priority | Description & Implementation Path |
| :--- | :--- | :--- |
| **HTTPS / TLS 1.3** | High | Enforce HTTPS via reverse proxy (Nginx, Caddy, Cloudflare, or AWS ALB) with HSTS (`Strict-Transport-Security`). |
| **HTTP-Only, Secure Cookies** | Medium | Migrate session tokens from `localStorage` to `HttpOnly; Secure; SameSite=Strict` cookies to eliminate XSS token theft vectors. |
| **Database Encryption at Rest** | High | When migrating from local `data/db.json` to PostgreSQL (e.g. Supabase, AWS RDS, Cloud SQL), enable Transparent Data Encryption (TDE) with customer-managed keys (KMS). |
| **API Rate Limiting** | Medium | Implement IP and user-based rate limiting on `/api/mentor/chat` and `/api/document/explain` using `express-rate-limit` to prevent AI quota exhaustion. |
| **Content Security Policy (CSP)** | Medium | Configure strict CSP headers restricting script and connect sources to trusted endpoints. |
| **Periodic Secret Rotation** | High | Rotate Gemini API keys and encryption salts on a 90-day cycle via cloud secret managers (AWS Secrets Manager / GCP Secret Manager). |
