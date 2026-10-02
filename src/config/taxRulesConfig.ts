/**
 * Versioned Indian Income Tax & Salary Deduction Configuration
 * Financial Year: FY 2025-26 (Assessment Year: AY 2026-27)
 *
 * Source Reference:
 * - Income Tax Department, Government of India (https://www.incometax.gov.in)
 * - Section 115BAC (New Tax Regime) & Old Tax Regime slabs under the Finance Act
 * - Standard Deduction u/s 16(ia), Rebate u/s 87A, and Health & Education Cess (4%)
 */

export interface TaxSlab {
  upTo: number; // Upper limit in INR (Infinity for top bracket)
  rate: number; // Decimal tax rate (e.g., 0.05 for 5%)
  label: string;
}

export interface VersionedTaxRules {
  financialYear: string;
  assessmentYear: string;
  sourceNote: string;
  cessRate: number;
  defaultEmployeeEpfRateOfCtc: number;
  defaultEmployerEpfAndGratuityRateOfCtc: number;
  defaultAnnualProfessionalTax: number;
  newRegime: {
    standardDeduction: number;
    rebate87ATaxableLimit: number;
    maxRebate87AAmount: number;
    slabs: TaxSlab[];
  };
  oldRegime: {
    standardDeduction: number;
    rebate87ATaxableLimit: number;
    maxRebate87AAmount: number;
    max80CDeduction: number;
    slabs: TaxSlab[];
  };
}

export const TAX_RULES_FY2025_26: VersionedTaxRules = {
  financialYear: 'FY 2025-26',
  assessmentYear: 'AY 2026-27',
  sourceNote:
    'Based on Income Tax Department of India (Section 115BAC New Tax Regime & Old Tax Regime provisions). All figures are educational estimates prior to surcharge or special capital-gains slabs.',
  cessRate: 0.04, // 4% Health & Education Cess on income tax
  defaultEmployeeEpfRateOfCtc: 0.048, // Approx 12% of Basic (where Basic is ~40% of CTC)
  defaultEmployerEpfAndGratuityRateOfCtc: 0.067, // Employer PF (4.8%) + Gratuity (~1.9%) included in CTC
  defaultAnnualProfessionalTax: 2400, // ₹200/month standard state professional tax
  newRegime: {
    standardDeduction: 75000,
    rebate87ATaxableLimit: 1200000, // Zero tax up to ₹12,00,000 taxable income (₹12.75L gross salaried)
    maxRebate87AAmount: 60000,
    slabs: [
      { upTo: 400000, rate: 0.0, label: 'Up to ₹4,00,000 (Nil)' },
      { upTo: 800000, rate: 0.05, label: '₹4,00,001 – ₹8,00,000 (5%)' },
      { upTo: 1200000, rate: 0.1, label: '₹8,00,001 – ₹12,00,000 (10%)' },
      { upTo: 1600000, rate: 0.15, label: '₹12,00,001 – ₹16,00,000 (15%)' },
      { upTo: 2000000, rate: 0.2, label: '₹16,00,001 – ₹20,00,000 (20%)' },
      { upTo: 2400000, rate: 0.25, label: '₹20,00,001 – ₹24,00,000 (25%)' },
      { upTo: Infinity, rate: 0.3, label: 'Above ₹24,00,000 (30%)' },
    ],
  },
  oldRegime: {
    standardDeduction: 50000,
    rebate87ATaxableLimit: 500000, // Zero tax up to ₹5,00,000 taxable income
    maxRebate87AAmount: 12500,
    max80CDeduction: 150000,
    slabs: [
      { upTo: 250000, rate: 0.0, label: 'Up to ₹2,50,000 (Nil)' },
      { upTo: 500000, rate: 0.05, label: '₹2,50,001 – ₹5,00,000 (5%)' },
      { upTo: 1000000, rate: 0.2, label: '₹5,00,001 – ₹10,00,000 (20%)' },
      { upTo: Infinity, rate: 0.3, label: 'Above ₹10,00,000 (30%)' },
    ],
  },
};
