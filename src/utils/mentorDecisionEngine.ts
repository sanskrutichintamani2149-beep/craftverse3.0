import { calculateCTCToTakeHome, calculateSIP } from './calculators';

export interface ExtractedScenario {
  is_scenario: boolean;
  income_change?: {
    type: 'set_monthly' | 'set_annual_ctc' | 'percent_change' | 'add_monthly' | 'reduce_monthly';
    value: number;
    is_gross?: boolean;
    is_annual?: boolean;
    specified_in_hand?: boolean;
  } | null;
  sip_change?: {
    type: 'add_monthly' | 'reduce_monthly' | 'set_monthly' | 'stop' | 'start' | 'lump_sum';
    amount: number;
  } | null;
  expense_change?: {
    type: 'add_monthly' | 'reduce_monthly' | 'set_monthly';
    amount: number;
  } | null;
  emi_change?: {
    type: 'new_emi' | 'changed_emi' | 'pay_off';
    amount: number;
  } | null;
  redirect_money?: {
    from: string;
    to: string;
    amount: number;
  } | null;
  horizon_years?: number | null;
  return_rate?: number | null;
}

export interface UserScenarioProfile {
  incomeType?: string;
  annualCtc?: number | null;
  monthlyTakeHome?: number | null;
  monthlyExpenses?: number | null;
  monthlyEmi?: number;
  monthlyInvestments?: number;
  currentSavings?: number | null;
  riskAppetite?: 'Conservative' | 'Balanced' | 'Aggressive';
}

export interface ScenarioMetrics {
  monthlyTakeHome: number;
  monthlyExpenses: number;
  monthlyEmi: number;
  totalMonthlyOutflow: number;
  monthlySurplus: number;
  monthlyInvestments: number;
  moneyLeftAfterSip: number;
  emergencyTarget: number;
  currentSavings: number;
  emergencyShortfall: number;
  monthsToCloseEmergency: number | string;
  sipFutureValue: number;
  sipInvestedPrincipal: number;
  sipEstimatedReturns: number;
  isAffordable: boolean;
  horizonYears: number;
  annualReturnRate: number;
}

export interface ScenarioComparison {
  current: ScenarioMetrics;
  hypothetical: ScenarioMetrics;
  diff: {
    deltaTakeHome: number;
    deltaExpenses: number;
    deltaEmi: number;
    deltaSurplus: number;
    deltaSip: number;
    deltaMoneyLeftAfterSip: number;
    deltaEmergencyTarget: number;
    deltaMonthsToCloseEmergency: number | string;
    deltaSipFutureValue: number;
    emergencyGapTrend: 'smaller' | 'larger' | 'unchanged' | 'closed';
  };
  assumptions: string[];
  missingFields: string[];
}

/**
 * Validates numeric inputs against sensible boundaries
 */
function sanitizeNumber(val: unknown, min = 0, max = 1000000000): number | null {
  if (val === null || val === undefined) return null;
  const num = Number(val);
  if (!Number.isFinite(num) || num < min || num > max) return null;
  return num;
}

/**
 * Deterministic Decision-Testing Calculator for DhanDrishti AI Mentor
 * Compares current profile numbers vs hypothetical what-if scenario.
 */
export function calculateMentorDecisionScenario(
  profile: UserScenarioProfile,
  scenario: ExtractedScenario
): ScenarioComparison {
  const incomeType = profile.incomeType || 'Salaried';
  const isSalaried = incomeType === 'Salaried';
  const isIrregular = ['Self-employed or business', 'Farmer', 'Daily-wage worker', 'Other'].includes(incomeType);
  const emergencyMonths = isIrregular ? 9 : 6;

  const assumptions: string[] = [];
  const missingFields: string[] = [];

  // 1. Determine current monthly take-home
  let currentTakeHome = 0;
  if (profile.monthlyTakeHome && profile.monthlyTakeHome > 0) {
    currentTakeHome = Math.round(profile.monthlyTakeHome);
  } else if (profile.annualCtc !== null && profile.annualCtc !== undefined && profile.annualCtc >= 0) {
    if (isSalaried) {
      if (profile.annualCtc > 0) {
        const ctcRes = calculateCTCToTakeHome({ annualCtc: profile.annualCtc });
        currentTakeHome = ctcRes.monthlyTakeHome;
        assumptions.push(`Salaried monthly take-home calculated from Annual CTC (₹${profile.annualCtc.toLocaleString('en-IN')}) via standard tax & EPF engine: ₹${currentTakeHome.toLocaleString('en-IN')}/mo`);
      } else {
        currentTakeHome = 0;
      }
    } else {
      currentTakeHome = Math.round(profile.annualCtc / 12);
      assumptions.push(`Non-salaried monthly take-home calculated as Annual Income / 12: ₹${currentTakeHome.toLocaleString('en-IN')}/mo`);
    }
  } else {
    missingFields.push(isSalaried ? 'Annual CTC / Salary' : 'Monthly Income');
  }

  // 2. Validate current expenses and savings
  const hasExpenses = profile.monthlyExpenses !== null && profile.monthlyExpenses !== undefined && profile.monthlyExpenses >= 0;
  if (!hasExpenses) {
    missingFields.push('Monthly Living Expenses');
  }
  const currentExpenses = hasExpenses ? Math.round(profile.monthlyExpenses!) : 0;

  const hasSavings = profile.currentSavings !== null && profile.currentSavings !== undefined && profile.currentSavings >= 0;
  if (!hasSavings) {
    missingFields.push('Current Savings Corpus');
  }
  const currentSavings = hasSavings ? Math.round(profile.currentSavings!) : 0;

  const currentEmi = Math.max(0, Math.round(Number(profile.monthlyEmi || 0)));
  const currentSip = Math.max(0, Math.round(Number(profile.monthlyInvestments || 0)));

  // 3. Assumptions for horizon & return
  const rawHorizon = sanitizeNumber(scenario.horizon_years, 1, 60);
  const horizon = rawHorizon ? Math.round(rawHorizon) : 10;
  assumptions.push(`Time Horizon: ${horizon} years`);

  const rawReturnRate = sanitizeNumber(scenario.return_rate, 0, 50);
  const returnRate = rawReturnRate !== null
    ? rawReturnRate
    : profile.riskAppetite === 'Aggressive'
    ? 13.5
    : profile.riskAppetite === 'Conservative'
    ? 9.5
    : 12.0;
  assumptions.push(`Assumed Annual Growth Rate: ${returnRate}% p.a. (Historical compounding estimate, not guaranteed)`);

  const computeMetrics = (
    takeHome: number,
    expenses: number,
    emi: number,
    sip: number,
    savings: number
  ): ScenarioMetrics => {
    const totalOutflow = expenses + emi;
    const surplus = Math.max(0, takeHome - totalOutflow);
    const moneyLeftAfterSip = surplus - sip;
    const emgTarget = totalOutflow * emergencyMonths;
    const emgShortfall = Math.max(0, emgTarget - savings);

    let monthsToClose: number | string = 0;
    if (emgShortfall <= 0) {
      monthsToClose = 0;
    } else if (moneyLeftAfterSip <= 0) {
      monthsToClose = 'Never (Deficit or no cashflow after SIP)';
    } else {
      monthsToClose = Number((emgShortfall / moneyLeftAfterSip).toFixed(1));
    }

    const sipRes = sip > 0 ? calculateSIP(sip, returnRate, horizon) : null;
    const sipFv = sipRes ? sipRes.futureValue : 0;
    const sipPrincipal = sipRes ? sipRes.investedAmount : 0;
    const sipReturns = sipRes ? sipRes.estimatedReturns : 0;

    return {
      monthlyTakeHome: Math.round(takeHome),
      monthlyExpenses: Math.round(expenses),
      monthlyEmi: Math.round(emi),
      totalMonthlyOutflow: Math.round(totalOutflow),
      monthlySurplus: Math.round(surplus),
      monthlyInvestments: Math.round(sip),
      moneyLeftAfterSip: Math.round(moneyLeftAfterSip),
      emergencyTarget: Math.round(emgTarget),
      currentSavings: Math.round(savings),
      emergencyShortfall: Math.round(emgShortfall),
      monthsToCloseEmergency: monthsToClose,
      sipFutureValue: sipFv,
      sipInvestedPrincipal: sipPrincipal,
      sipEstimatedReturns: sipReturns,
      isAffordable: moneyLeftAfterSip >= 0,
      horizonYears: horizon,
      annualReturnRate: returnRate,
    };
  };

  const currentMetrics = computeMetrics(
    currentTakeHome,
    currentExpenses,
    currentEmi,
    currentSip,
    currentSavings
  );

  // 4. Compute Hypothetical Changes
  let hypTakeHome = currentTakeHome;
  let hypExpenses = currentExpenses;
  let hypEmi = currentEmi;
  let hypSip = currentSip;
  let hypSavings = currentSavings;

  // Income change
  if (scenario.income_change) {
    const ic = scenario.income_change;
    const rawVal = sanitizeNumber(ic.value, 0, 1000000000);
    if (rawVal !== null) {
      if (ic.type === 'set_monthly') {
        if (ic.specified_in_hand || !isSalaried) {
          hypTakeHome = Math.round(rawVal);
          assumptions.push(`Hypothetical income set to ₹${hypTakeHome.toLocaleString('en-IN')}/month in-hand.`);
        } else {
          // Salaried user: treated as monthly gross unless in-hand specified
          const annualGross = Math.round(rawVal * 12);
          const res = calculateCTCToTakeHome({ annualCtc: annualGross });
          hypTakeHome = res.monthlyTakeHome;
          assumptions.push(`Hypothetical salary of ₹${rawVal.toLocaleString('en-IN')}/mo treated as monthly gross (Annual CTC ₹${annualGross.toLocaleString('en-IN')}), giving ₹${hypTakeHome.toLocaleString('en-IN')}/mo in-hand.`);
        }
      } else if (ic.type === 'set_annual_ctc') {
        if (isSalaried) {
          const res = calculateCTCToTakeHome({ annualCtc: Math.round(rawVal) });
          hypTakeHome = res.monthlyTakeHome;
          assumptions.push(`Hypothetical Annual CTC of ₹${rawVal.toLocaleString('en-IN')} gives ₹${hypTakeHome.toLocaleString('en-IN')}/mo take-home.`);
        } else {
          hypTakeHome = Math.round(rawVal / 12);
          assumptions.push(`Hypothetical Annual Income of ₹${rawVal.toLocaleString('en-IN')} gives ₹${hypTakeHome.toLocaleString('en-IN')}/mo take-home.`);
        }
      } else if (ic.type === 'percent_change') {
        const factor = 1 + rawVal / 100;
        if (isSalaried && profile.annualCtc && profile.annualCtc > 0) {
          const newCtc = Math.round(profile.annualCtc * factor);
          const res = calculateCTCToTakeHome({ annualCtc: newCtc });
          hypTakeHome = res.monthlyTakeHome;
          assumptions.push(`Salary increase of ${rawVal}% on Annual CTC ₹${profile.annualCtc.toLocaleString('en-IN')} -> New CTC ₹${newCtc.toLocaleString('en-IN')}, take-home ₹${hypTakeHome.toLocaleString('en-IN')}/mo.`);
        } else {
          hypTakeHome = Math.round(currentTakeHome * factor);
          assumptions.push(`Income change of ${rawVal}%: Take-home adjusted to ₹${hypTakeHome.toLocaleString('en-IN')}/mo.`);
        }
      } else if (ic.type === 'add_monthly') {
        hypTakeHome = currentTakeHome + Math.round(rawVal);
        assumptions.push(`Additional take-home of ₹${rawVal.toLocaleString('en-IN')}/mo added.`);
      } else if (ic.type === 'reduce_monthly') {
        hypTakeHome = Math.max(0, currentTakeHome - Math.round(rawVal));
        assumptions.push(`Take-home reduced by ₹${rawVal.toLocaleString('en-IN')}/mo.`);
      }
    }
  }

  // SIP change
  if (scenario.sip_change) {
    const sc = scenario.sip_change;
    const rawAmt = sanitizeNumber(sc.amount, 0, 100000000);
    if (rawAmt !== null) {
      if (sc.type === 'add_monthly') {
        hypSip = currentSip + Math.round(rawAmt);
        assumptions.push(`Monthly SIP increased by ₹${rawAmt.toLocaleString('en-IN')} (New Total: ₹${hypSip.toLocaleString('en-IN')}/mo).`);
      } else if (sc.type === 'reduce_monthly') {
        hypSip = Math.max(0, currentSip - Math.round(rawAmt));
        assumptions.push(`Monthly SIP reduced by ₹${rawAmt.toLocaleString('en-IN')} (New Total: ₹${hypSip.toLocaleString('en-IN')}/mo).`);
      } else if (sc.type === 'set_monthly' || sc.type === 'start') {
        hypSip = Math.round(rawAmt);
        assumptions.push(`Monthly SIP set to ₹${hypSip.toLocaleString('en-IN')}/mo.`);
      } else if (sc.type === 'stop') {
        hypSip = 0;
        assumptions.push(`Monthly SIP stopped (₹0/mo).`);
      } else if (sc.type === 'lump_sum') {
        hypSavings = currentSavings + Math.round(rawAmt);
        assumptions.push(`One-time lump sum of ₹${rawAmt.toLocaleString('en-IN')} added to savings.`);
      }
    } else if (sc.type === 'stop') {
      hypSip = 0;
      assumptions.push(`Monthly SIP stopped (₹0/mo).`);
    }
  }

  // Expense change
  if (scenario.expense_change) {
    const ec = scenario.expense_change;
    const rawAmt = sanitizeNumber(ec.amount, 0, 100000000);
    if (rawAmt !== null) {
      if (ec.type === 'add_monthly') {
        hypExpenses = currentExpenses + Math.round(rawAmt);
        assumptions.push(`Monthly living expenses increased by ₹${rawAmt.toLocaleString('en-IN')}.`);
      } else if (ec.type === 'reduce_monthly') {
        hypExpenses = Math.max(0, currentExpenses - Math.round(rawAmt));
        assumptions.push(`Monthly living expenses reduced by ₹${rawAmt.toLocaleString('en-IN')}.`);
      } else if (ec.type === 'set_monthly') {
        hypExpenses = Math.round(rawAmt);
        assumptions.push(`Monthly living expenses set to ₹${hypExpenses.toLocaleString('en-IN')}.`);
      }
    }
  }

  // EMI change
  if (scenario.emi_change) {
    const mc = scenario.emi_change;
    const rawAmt = sanitizeNumber(mc.amount, 0, 1000000000);
    if (mc.type === 'pay_off') {
      hypEmi = 0;
      assumptions.push(`Loan paid off (Monthly EMI becomes ₹0).`);
    } else if (rawAmt !== null) {
      if (mc.type === 'new_emi') {
        hypEmi = currentEmi + Math.round(rawAmt);
        assumptions.push(`New loan EMI of ₹${rawAmt.toLocaleString('en-IN')}/mo added (Total EMI: ₹${hypEmi.toLocaleString('en-IN')}/mo).`);
      } else if (mc.type === 'changed_emi') {
        hypEmi = Math.round(rawAmt);
        assumptions.push(`Monthly EMI adjusted to ₹${hypEmi.toLocaleString('en-IN')}/mo.`);
      }
    }
  }

  // Redirect money
  if (scenario.redirect_money) {
    const rc = scenario.redirect_money;
    const rawAmt = sanitizeNumber(rc.amount, 0, 100000000);
    if (rawAmt !== null) {
      const from = String(rc.from || '').toLowerCase();
      const to = String(rc.to || '').toLowerCase();
      if (from.includes('sip')) {
        hypSip = Math.max(0, currentSip - Math.round(rawAmt));
        assumptions.push(`Reduced/stopped SIP by ₹${rawAmt.toLocaleString('en-IN')}/mo.`);
      } else if (from.includes('expense') || from.includes('spend')) {
        hypExpenses = Math.max(0, currentExpenses - Math.round(rawAmt));
        assumptions.push(`Cut living expenses by ₹${rawAmt.toLocaleString('en-IN')}/mo.`);
      }

      if (to.includes('sip') || to.includes('invest')) {
        hypSip += Math.round(rawAmt);
        assumptions.push(`Redirected ₹${rawAmt.toLocaleString('en-IN')}/mo into SIP.`);
      } else if (to.includes('saving') || to.includes('emergency')) {
        assumptions.push(`Redirected ₹${rawAmt.toLocaleString('en-IN')}/mo into emergency savings buffer.`);
      }
    }
  }

  const hypMetrics = computeMetrics(
    hypTakeHome,
    hypExpenses,
    hypEmi,
    hypSip,
    hypSavings
  );

  let emergencyTrend: 'smaller' | 'larger' | 'unchanged' | 'closed' = 'unchanged';
  if (hypMetrics.emergencyShortfall === 0 && currentMetrics.emergencyShortfall > 0) {
    emergencyTrend = 'closed';
  } else if (typeof hypMetrics.monthsToCloseEmergency === 'number' && typeof currentMetrics.monthsToCloseEmergency === 'number') {
    if (hypMetrics.monthsToCloseEmergency > currentMetrics.monthsToCloseEmergency) {
      emergencyTrend = 'larger';
    } else if (hypMetrics.monthsToCloseEmergency < currentMetrics.monthsToCloseEmergency) {
      emergencyTrend = 'smaller';
    }
  }

  let deltaMonths: number | string = 0;
  if (typeof hypMetrics.monthsToCloseEmergency === 'number' && typeof currentMetrics.monthsToCloseEmergency === 'number') {
    deltaMonths = Number((hypMetrics.monthsToCloseEmergency - currentMetrics.monthsToCloseEmergency).toFixed(1));
  } else {
    deltaMonths = 'N/A';
  }

  return {
    current: currentMetrics,
    hypothetical: hypMetrics,
    diff: {
      deltaTakeHome: hypMetrics.monthlyTakeHome - currentMetrics.monthlyTakeHome,
      deltaExpenses: hypMetrics.monthlyExpenses - currentMetrics.monthlyExpenses,
      deltaEmi: hypMetrics.monthlyEmi - currentMetrics.monthlyEmi,
      deltaSurplus: hypMetrics.monthlySurplus - currentMetrics.monthlySurplus,
      deltaSip: hypMetrics.monthlyInvestments - currentMetrics.monthlyInvestments,
      deltaMoneyLeftAfterSip: hypMetrics.moneyLeftAfterSip - currentMetrics.moneyLeftAfterSip,
      deltaEmergencyTarget: hypMetrics.emergencyTarget - currentMetrics.emergencyTarget,
      deltaMonthsToCloseEmergency: deltaMonths,
      deltaSipFutureValue: hypMetrics.sipFutureValue - currentMetrics.sipFutureValue,
      emergencyGapTrend: emergencyTrend,
    },
    assumptions,
    missingFields,
  };
}
