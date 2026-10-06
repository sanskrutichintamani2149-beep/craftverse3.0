/**
 * Reusable PII Sanitizer for DhanDrishti
 *
 * Detects and replaces sensitive Indian and universal personal identifiers before
 * text is transmitted to Gemini or external AI models.
 *
 * Handles English, Hindi, and Marathi text with Devanagari digit normalization (०-९ -> 0-9).
 * Preserves financial values (e.g. ₹60,000, 12% p.a., monthly expenses, interest rates).
 */

// Verhoeff algorithm tables for Aadhaar checksum validation
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

/**
 * Validates a 12-digit Aadhaar number using the Verhoeff checksum algorithm.
 */
export function validateVerhoeff(numStr: string): boolean {
  const digits = numStr.replace(/\D/g, '');
  if (digits.length !== 12) return false;

  let c = 0;
  const invertedArray = digits.split('').map(Number).reverse();

  for (let i = 0; i < invertedArray.length; i++) {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][invertedArray[i]]];
  }

  return c === 0;
}

/**
 * Validates a credit/debit card number using the Luhn checksum algorithm.
 */
export function validateLuhn(cardStr: string): boolean {
  const digits = cardStr.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n = (n % 10) + 1;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

/**
 * Normalizes Devanagari numerals (०, १, २, ३, ४, ५, ६, ७, ८, ९) to standard ASCII digits (0-9).
 */
export function normalizeDevanagariDigits(text: string): string {
  if (!text) return '';
  return text.replace(/[\u0966-\u096F]/g, (match) => {
    return String(match.charCodeAt(0) - 0x0966);
  });
}

/**
 * Known Indian UPI handles to distinguish UPI IDs from email addresses.
 */
const UPI_HANDLES = new Set([
  'okhdfcbank',
  'okaxis',
  'oksbi',
  'okicici',
  'upi',
  'paytm',
  'apl',
  'ybl',
  'ibl',
  'axl',
  'barodampay',
  'pnb',
  'cnrb',
  'postbank',
  'aubank',
  'idfcbank',
  'fbl',
  'jupiteraxis',
  'slice',
  'cred',
  'superyes',
]);

/**
 * Main PII Sanitization Function.
 *
 * Removes and replaces personal identifiers with placeholders, while preserving
 * financial values (salary amounts, expenses, savings, investments, loan amounts, interest rates).
 */
export function sanitizePii(input: string): string {
  if (!input || typeof input !== 'string') return '';

  // 1. Normalize Devanagari numerals for consistent regex detection
  let text = normalizeDevanagariDigits(input);

  // 2. Passwords / Secret keys / Auth tokens
  text = text.replace(
    /\b(?:password|passwd|secret|token|api[_-]?key|bearer)\s*[:=]\s*([^\s,;]+)/gi,
    (match, val) => match.replace(val, '[TOKEN]')
  );
  text = text.replace(/AIza[0-9A-Za-z-_]{35}/g, '[KEY]');
  text = text.replace(/\beyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\b/g, '[TOKEN]');

  // 3. Indian PAN Card: 5 uppercase letters, 4 digits, 1 uppercase letter
  text = text.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, '[PAN]');

  // 4. IFSC Code: 4 uppercase letters, 0, 6 alphanumeric characters
  text = text.replace(/\b[A-Z]{4}0[A-Z0-9]{6}\b/g, '[IFSC]');

  // 5. UPI IDs (e.g. user@okhdfcbank, 9876543210@paytm)
  text = text.replace(
    /\b([a-zA-Z0-9._-]{2,256})@([a-zA-Z0-9]{2,64})\b/g,
    (match, user, handle) => {
      const lowerHandle = handle.toLowerCase();
      if (UPI_HANDLES.has(lowerHandle)) {
        return '[UPI]';
      }
      return match;
    }
  );

  // 6. Email Addresses (remaining email patterns)
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL]');

  // 7. Aadhaar Numbers (12 digits with optional spaces or hyphens)
  // Check Verhoeff algorithm to verify valid Aadhaar candidates
  text = text.replace(
    /\b([2-9][0-9]{3}[ -]?[0-9]{4}[ -]?[0-9]{4})\b/g,
    (match) => {
      const rawDigits = match.replace(/[\s-]/g, '');
      if (validateVerhoeff(rawDigits)) {
        return '[AADHAAR]';
      }
      // If candidate is explicitly prefixed with Aadhaar keyword, treat as Aadhaar even if mock/demo number
      return match;
    }
  );

  // Also replace explicit Aadhaar mentions e.g. "Aadhaar: 1234 5678 9012"
  text = text.replace(
    /\b(?:aadhaar|aadhar|आधार)[:\s-]*([0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4})\b/gi,
    () => '[AADHAAR]'
  );

  // 8. Card Numbers (13-19 digits, Luhn validated or card context)
  text = text.replace(
    /\b(?:\d{4}[ -]?){3,4}\d{1,4}\b/g,
    (match) => {
      const raw = match.replace(/[\s-]/g, '');
      if (raw.length >= 13 && raw.length <= 19 && validateLuhn(raw)) {
        return '[CARD]';
      }
      return match;
    }
  );

  // 9. Indian Mobile Phone Numbers: 10 digits starting with 6, 7, 8, 9, optional +91 or 0
  // Note: Avoid matching financial numbers by checking context (e.g. not preceded by ₹, Rs, Rs., INR)
  text = text.replace(
    /(?:^|[^\d₹₨]|\b)(?:(?:\+91|91|0)[-.\s]?)?([6-9]\d{4}[-.\s]?\d{5})(?!\d)/g,
    (match, phone) => {
      // Ensure this is not a currency amount (e.g. ₹90,000)
      const prefix = match.slice(0, match.indexOf(phone));
      if (/[₹₨]|\b(?:inr|rs\.?)\s*$/i.test(prefix)) {
        return match;
      }
      return `${prefix}[PHONE]`;
    }
  );

  // 10. Date of Birth in DOB context
  text = text.replace(
    /\b(?:dob|date of birth|जन्म तारीख|जन्मतारीख|जन्मदिन)[:\s]*([0-3]?[0-9][\/\-.][0-1]?[0-9][\/\-.](?:19|20)\d{2})\b/gi,
    () => '[DOB]'
  );

  // 11. Bank Account Numbers in explicit account context
  text = text.replace(
    /\b(?:a\/c|acct|account|खाता|खाते)\s*(?:no\.?|number|क्रमांक)?[:\s-]*([0-9]{9,18})\b/gi,
    (match, acct) => match.replace(acct, '[ACCOUNT]')
  );

  return text;
}
