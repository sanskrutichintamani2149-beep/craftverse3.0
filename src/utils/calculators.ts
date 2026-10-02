import { TAX_RULES_FY2025_26, TaxSlab, VersionedTaxRules } from '../config/taxRulesConfig';

export interface SIPYearlyPoint {
  year: number;
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
}

export interface SIPCalculationResult {
  valid: boolean;
  error?: string;
  monthlyInvestment: number;
  annualReturnRate: number;
  durationYears: number;
  totalMonths: number;
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
  yearlyBreakdown: SIPYearlyPoint[];
}

export interface EMIYearlyPoint {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface EMICalculationResult {
  valid: boolean;
  error?: string;
  loanAmount: number;
  annualInterestRate: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
  yearlyBreakdown: EMIYearlyPoint[];
}

export interface CTCCalculationResult {
  valid: boolean;
  error?: string;
  annualCtc: number;
  regime: 'new' | 'old';
  financialYear: string;
  grossAnnualSalary: number;
  employerEpfAndGratuity: number;
  employeeEpfAnnual: number;
  professionalTaxAnnual: number;
  standardDeduction: number;
  chapterVIADeductions: number;
  taxableIncome: number;
  baseTaxBeforeCess: number;
  cessAmount: number;
  estimatedAnnualTax: number;
  totalAnnualDeductionsFromGross: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  alternativeRegimeTax: number;
  recommendedRegime: 'new' | 'old';
}

/**
 * Deterministic SIP Calculator
 * Formula: FV = P * [((1 + i)^n - 1) / i] * (1 + i)
 * where i = annualReturn / 12 / 100 and n = durationYears * 12 (beginning-of-month compounding)
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number,
  durationYears: number
): SIPCalculationResult {
  const P = Number(monthlyInvestment);
  const r = Number(annualReturnRate);
  const Y = Number(durationYears);

  const emptyResult: SIPCalculationResult = {
    valid: false,
    monthlyInvestment: 0,
    annualReturnRate: 0,
    durationYears: 0,
    totalMonths: 0,
    investedAmount: 0,
    estimatedReturns: 0,
    futureValue: 0,
    yearlyBreakdown: [],
  };

  if (!Number.isFinite(P) || !Number.isFinite(r) || !Number.isFinite(Y)) {
    return { ...emptyResult, error: 'Please enter valid numeric values for all SIP fields.' };
  }
  if (P <= 0) {
    return { ...emptyResult, error: 'Monthly investment must be greater than ₹0.' };
  }
  if (P > 100000000) {
    return { ...emptyResult, error: 'Monthly investment cannot exceed ₹10 Crore.' };
  }
  if (r < 0 || r > 50) {
    return { ...emptyResult, error: 'Expected annual return rate must be between 0% and 50%.' };
  }
  if (Y <= 0 || Y > 60) {
    return { ...emptyResult, error: 'Duration must be between 1 and 60 years.' };
  }

  const totalMonths = Math.round(Y * 12);
  const i = r / 12 / 100;

  const computeFvForMonths = (months: number): number => {
    if (months <= 0) return 0;
    if (i === 0) return P * months;
    return P * (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
  };

  const exactFv = computeFvForMonths(totalMonths);
  const investedAmount = Math.round(P * totalMonths);
  const futureValue = Math.round(exactFv);
  const estimatedReturns = Math.max(0, futureValue - investedAmount);

  const yearlyBreakdown: SIPYearlyPoint[] = [];
  const fullYears = Math.floor(Y);
  for (let yr = 1; yr <= fullYears; yr++) {
    const m = yr * 12;
    const yrInv = Math.round(P * m);
    const yrFv = Math.round(computeFvForMonths(m));
    yearlyBreakdown.push({
      year: yr,
      investedAmount: yrInv,
      estimatedReturns: Math.max(0, yrFv - yrInv),
      futureValue: yrFv,
    });
  }
  if (Y > fullYears) {
    yearlyBreakdown.push({
      year: Number(Y.toFixed(1)),
      investedAmount,
      estimatedReturns,
      futureValue,
    });
  }

  return {
    valid: true,
    monthlyInvestment: P,
    annualReturnRate: r,
    durationYears: Y,
    totalMonths,
    investedAmount,
    estimatedReturns,
    futureValue,
    yearlyBreakdown,
  };
}

/**
 * Deterministic EMI Calculator
 * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where r = annualRate / 12 / 100 and n = tenureMonths
 */
export function calculateEMI(
  loanAmount: number,
  annualInterestRate: number,
  tenureMonths: number
): EMICalculationResult {
  const P = Number(loanAmount);
  const annualRate = Number(annualInterestRate);
  const n = Math.round(Number(tenureMonths));

  const emptyResult: EMICalculationResult = {
    valid: false,
    loanAmount: 0,
    annualInterestRate: 0,
    tenureMonths: 0,
    monthlyEmi: 0,
    totalInterest: 0,
    totalPayment: 0,
    principalPercentage: 0,
    interestPercentage: 0,
    yearlyBreakdown: [],
  };

  if (!Number.isFinite(P) || !Number.isFinite(annualRate) || !Number.isFinite(n)) {
    return { ...emptyResult, error: 'Please enter valid numeric values for all EMI fields.' };
  }
  if (P <= 0) {
    return { ...emptyResult, error: 'Loan amount must be greater than ₹0.' };
  }
  if (P > 1000000000) {
    return { ...emptyResult, error: 'Loan amount cannot exceed ₹100 Crore.' };
  }
  if (annualRate < 0 || annualRate > 60) {
    return { ...emptyResult, error: 'Annual interest rate must be between 0% and 60%.' };
  }
  if (n <= 0 || n > 480) {
    return { ...emptyResult, error: 'Loan tenure must be between 1 and 480 months (40 years).' };
  }

  const r = annualRate / 12 / 100;
  let exactEmi = 0;
  if (r === 0) {
    exactEmi = P / n;
  } else {
    const factor = Math.pow(1 + r, n);
    exactEmi = (P * r * factor) / (factor - 1);
  }

  const exactTotalPayment = exactEmi * n;
  const exactTotalInterest = Math.max(0, exactTotalPayment - P);

  // Build yearly amortization schedule
  const yearlyBreakdown: EMIYearlyPoint[] = [];
  let balance = P;
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let m = 1; m <= n; m++) {
    const monthInterest = r === 0 ? 0 : balance * r;
    const monthPrincipal = Math.min(balance, exactEmi - monthInterest);
    balance = Math.max(0, balance - monthPrincipal);
    yearPrincipal += monthPrincipal;
    yearInterest += monthInterest;

    if (m % 12 === 0 || m === n) {
      yearlyBreakdown.push({
        year: Math.ceil(m / 12),
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        remainingBalance: Math.round(balance),
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  const monthlyEmi = Math.round(exactEmi);
  const totalPayment = Math.round(exactTotalPayment);
  const totalInterest = Math.round(exactTotalInterest);
  const principalPercentage =
    totalPayment > 0 ? Math.round((P / totalPayment) * 100) : 100;
  const interestPercentage = Math.max(0, 100 - principalPercentage);

  return {
    valid: true,
    loanAmount: P,
    annualInterestRate: annualRate,
    tenureMonths: n,
    monthlyEmi,
    totalInterest,
    totalPayment,
    principalPercentage,
    interestPercentage,
    yearlyBreakdown,
  };
}

function computeSlabTax(taxableIncome: number, slabs: TaxSlab[]): number {
  let tax = 0;
  let previousLimit = 0;
  for (const slab of slabs) {
    if (taxableIncome > previousLimit) {
      const taxableSlice = Math.min(taxableIncome, slab.upTo) - previousLimit;
      tax += taxableSlice * slab.rate;
      previousLimit = slab.upTo;
    }
  }
  return tax;
}

/**
 * Deterministic CTC to Take-Home Calculator
 * Uses versioned tax rules from src/config/taxRulesConfig.ts
 */
export function calculateCTCToTakeHome(
  params: {
    annualCtc: number;
    regime?: 'new' | 'old';
    deduction80C?: number;
    hraAndOtherDeductions?: number;
    includeEpf?: boolean;
  },
  rules: VersionedTaxRules = TAX_RULES_FY2025_26
): CTCCalculationResult {
  const ctc = Number(params.annualCtc);
  const regime = params.regime || 'new';
  const includeEpf = params.includeEpf !== false;
  const ded80C = Math.max(0, Number(params.deduction80C || 0));
  const hraOther = Math.max(0, Number(params.hraAndOtherDeductions || 0));

  const emptyResult: CTCCalculationResult = {
    valid: false,
    annualCtc: 0,
    regime,
    financialYear: rules.financialYear,
    grossAnnualSalary: 0,
    employerEpfAndGratuity: 0,
    employeeEpfAnnual: 0,
    professionalTaxAnnual: 0,
    standardDeduction: 0,
    chapterVIADeductions: 0,
    taxableIncome: 0,
    baseTaxBeforeCess: 0,
    cessAmount: 0,
    estimatedAnnualTax: 0,
    totalAnnualDeductionsFromGross: 0,
    annualTakeHome: 0,
    monthlyTakeHome: 0,
    alternativeRegimeTax: 0,
    recommendedRegime: 'new',
  };

  if (!Number.isFinite(ctc) || !Number.isFinite(ded80C) || !Number.isFinite(hraOther)) {
    return { ...emptyResult, error: 'Please enter valid numeric values for CTC and deductions.' };
  }
  if (ctc <= 0) {
    return { ...emptyResult, error: 'Annual CTC must be greater than ₹0.' };
  }
  if (ctc > 1000000000) {
    return { ...emptyResult, error: 'Annual CTC cannot exceed ₹100 Crore.' };
  }

  const employerEpfAndGratuity = includeEpf
    ? Math.round(ctc * rules.defaultEmployerEpfAndGratuityRateOfCtc)
    : 0;
  const grossAnnualSalary = Math.max(0, ctc - employerEpfAndGratuity);
  const employeeEpfAnnual = includeEpf
    ? Math.round(ctc * rules.defaultEmployeeEpfRateOfCtc)
    : 0;
  const professionalTaxAnnual = ctc > 300000 ? rules.defaultAnnualProfessionalTax : 0;

  // Compute New Regime Tax
  const newStdDed = rules.newRegime.standardDeduction;
  const newTaxable = Math.max(0, grossAnnualSalary - newStdDed);
  let newBaseTax = computeSlabTax(newTaxable, rules.newRegime.slabs);
  if (newTaxable <= rules.newRegime.rebate87ATaxableLimit) {
    newBaseTax = 0;
  }
  const newCess = Math.round(newBaseTax * rules.cessRate);
  const newTotalTax = Math.round(newBaseTax + newCess);

  // Compute Old Regime Tax
  const oldStdDed = rules.oldRegime.standardDeduction;
  const capped80C = Math.min(
    rules.oldRegime.max80CDeduction,
    ded80C + employeeEpfAnnual
  );
  const oldChapterVIA = capped80C + hraOther;
  const oldTaxable = Math.max(
    0,
    grossAnnualSalary - oldStdDed - professionalTaxAnnual - oldChapterVIA
  );
  let oldBaseTax = computeSlabTax(oldTaxable, rules.oldRegime.slabs);
  if (oldTaxable <= rules.oldRegime.rebate87ATaxableLimit) {
    oldBaseTax = 0;
  }
  const oldCess = Math.round(oldBaseTax * rules.cessRate);
  const oldTotalTax = Math.round(oldBaseTax + oldCess);

  const isNew = regime === 'new';
  const standardDeduction = isNew ? newStdDed : oldStdDed;
  const chapterVIADeductions = isNew ? 0 : oldChapterVIA;
  const taxableIncome = isNew ? newTaxable : oldTaxable;
  const baseTaxBeforeCess = Math.round(isNew ? newBaseTax : oldBaseTax);
  const cessAmount = isNew ? newCess : oldCess;
  const estimatedAnnualTax = isNew ? newTotalTax : oldTotalTax;
  const alternativeRegimeTax = isNew ? oldTotalTax : newTotalTax;

  const totalAnnualDeductionsFromGross =
    employeeEpfAnnual + professionalTaxAnnual + estimatedAnnualTax;
  const annualTakeHome = Math.max(0, grossAnnualSalary - totalAnnualDeductionsFromGross);
  const monthlyTakeHome = Math.round(annualTakeHome / 12);

  return {
    valid: true,
    annualCtc: ctc,
    regime,
    financialYear: rules.financialYear,
    grossAnnualSalary,
    employerEpfAndGratuity,
    employeeEpfAnnual,
    professionalTaxAnnual,
    standardDeduction,
    chapterVIADeductions,
    taxableIncome,
    baseTaxBeforeCess,
    cessAmount,
    estimatedAnnualTax,
    totalAnnualDeductionsFromGross,
    annualTakeHome,
    monthlyTakeHome,
    alternativeRegimeTax,
    recommendedRegime: newTotalTax <= oldTotalTax ? 'new' : 'old',
  };
}

/**
 * Privacy Masking Utility (ITEM 3)
 * Masks PAN, Aadhaar, Credit/Debit Card, and Bank Account numbers so only the last 4 digits/chars are shown.
 */
export function maskSensitiveFinancialIdentifiers(input: string): string {
  if (!input) return '';
  let masked = String(input);

  // Mask Indian PAN numbers (e.g. ABCDE1234F -> XXXXXX234F)
  masked = masked.replace(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/gi, (match) => {
    return 'XXXXXX' + match.slice(-4).toUpperCase();
  });

  // Mask 12-to-16 digit sequences with spaces/hyphens (Aadhaar / Card / Account numbers)
  masked = masked.replace(/\b(?:\d[ -]*?){9,18}\d\b/g, (match) => {
    const digitsOnly = match.replace(/\D/g, '');
    // Skip normal currency amounts or dates unless it's 10+ digits without a ₹ prefix
    if (digitsOnly.length < 10) return match;
    return 'X'.repeat(Math.max(4, digitsOnly.length - 4)) + digitsOnly.slice(-4);
  });

  return masked;
}
