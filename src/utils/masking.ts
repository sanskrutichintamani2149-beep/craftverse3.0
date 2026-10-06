/**
 * Display-only Masking Utility for DhanDrishti
 *
 * Provides non-destructive formatting functions for masking sensitive user data
 * and financial amounts in the UI when Privacy Mode is active.
 *
 * CRITICAL: These functions ONLY affect display strings rendered in the UI.
 * They never mutate original numbers, models, state, or database records.
 */

/**
 * Masks an email address: e.g., "john.doe@example.com" -> "j•••e@example.com"
 */
export function maskEmail(email: string | null | undefined, privacyMode?: boolean): string {
  if (!email || typeof email !== 'string') return '';
  if (privacyMode !== undefined && !privacyMode) return email;
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 1) return '••••@••••';

  const user = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);

  if (user.length <= 2) {
    return `${user[0]}••${domain}`;
  }
  return `${user[0]}••••${user[user.length - 1]}${domain}`;
}

/**
 * Masks an Indian or international phone number: e.g., "9876543210" -> "••••••3210"
 */
export function maskPhone(phone: string | null | undefined, privacyMode?: boolean): string {
  if (!phone || typeof phone !== 'string') return '';
  if (privacyMode !== undefined && !privacyMode) return phone;
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return '••••';
  const visible = cleaned.slice(-4);
  const prefix = cleaned.startsWith('+91') ? '+91 ' : '';
  return `${prefix}••••••${visible}`;
}

/**
 * Masks a personal name: e.g., "Rahul Sharma" -> "R•••• S••••"
 */
export function maskName(name: string | null | undefined, privacyMode?: boolean): string {
  if (!name || typeof name !== 'string') return '';
  if (privacyMode !== undefined && !privacyMode) return name;
  const parts = name.trim().split(/\s+/);
  return parts
    .map((part) => (part.length > 0 ? `${part[0]}••••` : ''))
    .join(' ');
}

/**
 * Masks a financial currency amount when privacy mode is enabled.
 * If privacyMode is false, formats or returns the amount normally.
 *
 * @param amount - Number or pre-formatted string (e.g. 50000 or "₹50,000")
 * @param privacyMode - Whether Privacy Mode is currently ON
 * @param currencySymbol - Currency prefix (defaults to '₹')
 */
export function maskCurrency(
  amount: number | string | null | undefined,
  privacyMode: boolean,
  currencySymbol = '₹'
): string {
  if (privacyMode) {
    return `${currencySymbol} ••••••`;
  }
  if (amount === null || amount === undefined || amount === '') {
    return `${currencySymbol}0`;
  }
  if (typeof amount === 'number') {
    return `${currencySymbol}${amount.toLocaleString('en-IN')}`;
  }
  return String(amount);
}

/**
 * Masks a sensitive generic number or statistic (e.g. credit score, account digits)
 * when privacy mode is enabled.
 */
export function maskSensitiveNumber(
  value: number | string | null | undefined,
  privacyMode: boolean,
  placeholder = '••••••'
): string {
  if (privacyMode) {
    return placeholder;
  }
  if (value === null || value === undefined) return '';
  return String(value);
}
