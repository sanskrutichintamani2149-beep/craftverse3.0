# encoding: utf-8
import json
import os

# Import the builder modules sequentially
import data_builder
import append_all_other_categories
import append_credit_investing
import append_basics_business
import append_credit
import append_basics

terms = data_builder.terms
print(f"Total compiled terms: {len(terms)}")

categories_count = {}
for t in terms:
    cat = t["category"]
    categories_count[cat] = categories_count.get(cat, 0) + 1

print("Categories distribution:")
for cat, count in categories_count.items():
    print(f"  {cat}: {count}")

# Generate TypeScript file content
ts_content = """export type TermCategory = 'Tax' | 'Investing' | 'Income' | 'Credit' | 'Business' | 'Basics';

export interface TermVideoInfo {
  videoId?: string;
  searchFallback: string;
  title: string;
  channel?: string;
}

export interface TermItem {
  id: string;
  term: string;
  category: TermCategory;
  shortDef: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  analogy: string;
  indianExample: string;
  rememberThis: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  commonMistake: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  mythStatement: {
    English: string;
    Hindi: string;
    Marathi: string;
  };
  professionTracks?: string[];
  video: {
    English: TermVideoInfo;
    Hindi: TermVideoInfo;
    Marathi: TermVideoInfo;
  };
}

export interface MythFactItem {
  id: string;
  category: string;
  myth: string;
  fact: string;
  proof: string;
}

export const TERM_O_PEDIA_ITEMS: TermItem[] = """ + json.dumps(terms, ensure_ascii=False, indent=2) + """;

export const MYTH_FACT_ITEMS: MythFactItem[] = [
  {
    id: 'myth-1',
    category: 'Investing Basics',
    myth: 'You need at least ₹25,000–₹50,000 to start investing in Mutual Funds or Index Funds.',
    fact: 'You can start a regulated Mutual Fund SIP in India with as little as ₹100 to ₹500 per month.',
    proof:
      'SEBI and AMFI enable micro-SIPs across Nifty 50 Index funds and Flexi-Cap funds with zero entry load via UPI AutoPay.',
  },
  {
    id: 'myth-2',
    category: 'Tax & Savings',
    myth: 'Bank Fixed Deposits (FDs) are 100% risk-free for long-term 20-year wealth creation.',
    fact: 'While FDs protect nominal capital, post-tax FD returns (4.9%–5.5% in the 30% slab) often trail Indian lifestyle & medical inflation (7%–10%), eroding purchasing power.',
    proof:
      'FDs are ideal for short-term goals and emergency buffers, whereas long-term 10+ year goals require equity exposure to beat inflation.',
  },
  {
    id: 'myth-3',
    category: 'Insurance',
    myth: 'Endowment / Money-Back policies are the best way to combine Life Insurance and Investment.',
    fact: 'Mixing insurance and investment typically yields low 4.5%–5.5% XIRR with inadequate life cover. Pure Term Insurance + Mutual Fund SIP provides 10× higher protection and superior wealth creation.',
    proof:
      'A 26-year-old can get a ₹1 Crore Pure Term Cover for ~₹900/month and invest the remaining ₹9,100/month in an Index Fund SIP.',
  },
  {
    id: 'myth-4',
    category: 'Credit Score',
    myth: 'Owning a Credit Card automatically damages your CIBIL score and traps you in debt.',
    fact: 'Using less than 30% of your credit limit and paying the 100% Total Amount Due before the due date builds a 780+ CIBIL score at zero interest cost.',
    proof:
      'Credit bureaus reward disciplined credit utilization (<30%) and on-time repayment history when you later apply for a Home Loan.',
  },
  {
    id: 'myth-5',
    category: 'Market Timing',
    myth: 'You must wait for a market crash to start your SIP; investing at all-time highs loses money.',
    fact: 'Over 10–15 year horizons, time IN the market beats timing the market. SIPs automatically buy more units when markets dip and fewer when markets peak.',
    proof:
      'Historical Nifty 50 rolling 10-year SIP data shows consistent double-digit compounding regardless of the starting month.',
  },
];

export function formatINR(amount: number | null | undefined): string {
  const num = Number(amount || 0);
  if (!Number.isFinite(num)) return '₹0';
  return '₹' + Math.round(num).toLocaleString('en-IN');
}

export function formatCompactINR(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return formatINR(amount);
}

export function estimateMonthlyInHand(annualCtc: number): number {
  if (!annualCtc || annualCtc <= 0) return 0;
  const taxInfo = calculateTaxComparison(annualCtc, 150000, 50000);
  const annualTax = Math.min(taxInfo.newRegimeTax, taxInfo.oldRegimeTax);
  const epfAndGratuity = annualCtc * 0.08;
  const netAnnual = Math.max(0, annualCtc - annualTax - epfAndGratuity);
  return Math.round(netAnnual / 12);
}

export function calculateTaxComparison(
  annualCtc: number,
  deduction80C = 150000,
  deduction80DAndHra = 75000
) {
  // FY 2025-26 New Tax Regime (Standard Deduction ₹75,000, Rebate up to ₹12L taxable)
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
        const taxableSlice = Math.min(newTaxable, s.limit) - prev;
        newTax += taxableSlice * s.rate;
        prev = s.limit;
      }
    }
  }
  const newRegimeTax = Math.round(newTax * 1.04); // 4% cess

  // Old Tax Regime (Standard Deduction ₹50,000 + 80C + 80D/HRA)
  const oldTaxable = Math.max(0, annualCtc - 50000 - Math.min(150000, deduction80C) - deduction80DAndHra);
  let oldTax = 0;
  if (oldTaxable > 500000) {
    if (oldTaxable > 250000) {
      oldTax += (Math.min(oldTaxable, 500000) - 250000) * 0.05;
    }
    if (oldTaxable > 500000) {
      oldTax += (Math.min(oldTaxable, 1000000) - 500000) * 0.2;
    }
    if (oldTaxable > 1000000) {
      oldTax += (oldTaxable - 1000000) * 0.3;
    }
  }
  const oldRegimeTax = Math.round(oldTax * 1.04);

  return {
    newRegimeTax,
    oldRegimeTax,
    recommended: newRegimeTax <= oldRegimeTax ? 'New Regime' : 'Old Regime',
    annualSavings: Math.abs(newRegimeTax - oldRegimeTax),
  };
}

export interface ProjectionPoint {
  year: number;
  label: string;
  baselineWealth: number;
  whatIfWealth: number;
  investedCapital: number;
}

export function calculateWealthTrajectory(params: {
  currentSavings: number;
  monthlySip: number;
  annualReturnRate: number;
  stepUpPercent: number;
  years: number;
  whatIfMonthlySip?: number;
  whatIfReturnRate?: number;
  whatIfStepUpPercent?: number;
  whatIfInitialDelta?: number;
}): ProjectionPoint[] {
  const points: ProjectionPoint[] = [];
  let baseCorpus = Math.max(0, params.currentSavings);
  let altCorpus = Math.max(0, params.currentSavings + (params.whatIfInitialDelta || 0));
  let totalInvested = Math.max(0, params.currentSavings);

  let currentBaseSip = Math.max(0, params.monthlySip);
  let currentAltSip = Math.max(0, params.whatIfMonthlySip ?? params.monthlySip);

  const baseMonthlyRate = params.annualReturnRate / 100 / 12;
  const altMonthlyRate = (params.whatIfReturnRate ?? params.annualReturnRate) / 100 / 12;

  points.push({
    year: 0,
    label: 'Now',
    baselineWealth: Math.round(baseCorpus),
    whatIfWealth: Math.round(altCorpus),
    investedCapital: Math.round(totalInvested),
  });

  for (let y = 1; y <= params.years; y++) {
    for (let m = 1; m <= 12; m++) {
      baseCorpus = (baseCorpus + currentBaseSip) * (1 + baseMonthlyRate);
      altCorpus = (altCorpus + currentAltSip) * (1 + altMonthlyRate);
      totalInvested += currentBaseSip;
    }
    currentBaseSip *= 1 + params.stepUpPercent / 100;
    currentAltSip *= 1 + (params.whatIfStepUpPercent ?? params.stepUpPercent) / 100;

    points.push({
      year: y,
      label: `Yr ${y}`,
      baselineWealth: Math.round(baseCorpus),
      whatIfWealth: Math.round(altCorpus),
      investedCapital: Math.round(totalInvested),
    });
  }

  return points;
}
"""

with open('/app/applet/src/config/financialData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Successfully wrote /app/applet/src/config/financialData.ts!")
