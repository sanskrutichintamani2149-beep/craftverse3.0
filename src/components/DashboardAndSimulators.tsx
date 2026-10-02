import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  Wallet,
  ShieldAlert,
  Edit3,
  Sliders,
  Calculator,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
  Save,
  Clock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  formatINR,
  formatCompactINR,
  estimateMonthlyInHand,
  calculateWealthTrajectory,
} from '../config/financialData';
import {
  calculateSIP,
  calculateEMI,
  calculateCTCToTakeHome,
} from '../utils/calculators';
import { TAX_RULES_FY2025_26 } from '../config/taxRulesConfig';
import { WealthTrajectoryChart, AllocationBreakdownChart } from './InteractiveCharts';
import { AppView } from './Navbar';

export const DashboardView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();

  const annualCtc = user?.annualCtc ?? 1200000;
  const monthlyExpenses = user?.monthlyExpenses ?? 35000;
  const currentSavings = user?.currentSavings ?? 200000;
  const monthlyInHand = estimateMonthlyInHand(annualCtc);
  const monthlySurplus = Math.max(0, monthlyInHand - monthlyExpenses);
  const monthlySip = user?.monthlyInvestments || Math.round(monthlySurplus * 0.6);
  const savingsRate = monthlyInHand > 0 ? Math.round((monthlySurplus / monthlyInHand) * 100) : 0;

  const emergencyTarget = monthlyExpenses * 6;
  const emergencyProgress =
    emergencyTarget > 0 ? Math.min(100, Math.round((currentSavings / emergencyTarget) * 100)) : 100;

  const projectionData = calculateWealthTrajectory({
    currentSavings,
    monthlySip,
    annualReturnRate: user?.riskAppetite === 'Aggressive' ? 13.5 : user?.riskAppetite === 'Conservative' ? 9.5 : 12,
    stepUpPercent: 10,
    years: 10,
  });

  const tenYearNetWorth = projectionData[projectionData.length - 1]?.baselineWealth || currentSavings;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner with Saved Profile Info */}
      <div className="theme-card rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {user?.dreamJob || 'Financial Profile'}
            </span>
            <span>·</span>
            <span>{user?.location || 'India'}</span>
            <span>·</span>
            <span>Age {user?.age || 25}</span>
            <span>·</span>
            <span>{user?.riskAppetite || 'Balanced'} Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            Namaste, {user?.fullName}! Here is Your Financial Vision
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            All metrics below are computed live from your saved profile in the database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs sm:text-sm font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-emerald-500" />
            <span>Edit CTC / Profile</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('whatif')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Sliders className="w-4 h-4" />
            <span>Run What-If Simulator</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Annual CTC Package</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {formatINR(annualCtc)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            Est. Monthly In-Hand: {formatINR(monthlyInHand)}
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Monthly Living Expenses</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {formatINR(monthlyExpenses)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            Monthly Surplus: {formatINR(monthlySurplus)} ({savingsRate}% rate)
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Current Saved Corpus</span>
            <ShieldAlert className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {formatINR(currentSavings)}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            6-Mo Emergency Target: {formatCompactINR(emergencyTarget)} ({emergencyProgress}%)
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>10-Yr Projected Net Worth</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formatCompactINR(tenYearNetWorth)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            With {formatINR(monthlySip)}/mo Step-Up SIP
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 theme-card rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                10-Year Compounding Trajectory
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Starting from {formatINR(currentSavings)} current savings + {formatINR(monthlySip)}/month SIP with 10% annual step-up
              </p>
            </div>
          </div>
          <WealthTrajectoryChart data={projectionData} showWhatIf={false} />
        </div>

        <div className="lg:col-span-4 theme-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
              Emergency Fund & Cashflow
            </h2>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">6-Month Safety Target</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {formatINR(emergencyTarget)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden border border-[var(--border-subtle)]">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${emergencyProgress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {emergencyProgress >= 100
                  ? 'Full 6-month emergency buffer achieved!'
                  : `You have covered ${emergencyProgress}% of your 6-month living expense buffer.`}
              </p>
            </div>

            <AllocationBreakdownChart
              monthlyInHand={monthlyInHand}
              monthlyExpenses={monthlyExpenses}
              monthlyInvestments={monthlySip}
            />
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('planners')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <span>Compare Old vs New Tax Regime</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('mentor')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
            >
              <span>Ask AI Mentor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WhatIfView: React.FC = () => {
  const { user } = useAuth();

  const baseCtc = user?.annualCtc ?? 1200000;
  const baseExpenses = user?.monthlyExpenses ?? 35000;
  const baseSavings = user?.currentSavings ?? 200000;
  const baseInHand = estimateMonthlyInHand(baseCtc);
  const baseDefaultSip =
    user?.monthlyInvestments || Math.max(5000, Math.round(Math.max(0, baseInHand - baseExpenses) * 0.6));

  const [whatIfSip, setWhatIfSip] = useState<number>(Math.round(baseDefaultSip * 1.25));
  const [whatIfReturn, setWhatIfReturn] = useState<number>(13);
  const [whatIfStepUp, setWhatIfStepUp] = useState<number>(12);
  const [whatIfInitialDelta, setWhatIfInitialDelta] = useState<number>(0);
  const [horizonYears, setHorizonYears] = useState<number>(15);
  const [activePreset, setActivePreset] = useState<string>('stepup');

  useEffect(() => {
    setWhatIfSip(Math.round(baseDefaultSip * 1.25));
  }, [baseDefaultSip]);

  const applyPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId === 'career-jump') {
      // +30% CTC jump channels half of additional monthly in-hand into SIP
      const jumpedInHand = estimateMonthlyInHand(Math.round(baseCtc * 1.3));
      const extraMonthly = Math.max(5000, Math.round((jumpedInHand - baseInHand) * 0.7));
      setWhatIfSip(baseDefaultSip + extraMonthly);
      setWhatIfReturn(12.5);
      setWhatIfStepUp(12);
      setWhatIfInitialDelta(0);
    } else if (presetId === 'car-purchase') {
      // Buying a car reduces initial savings by ₹2,00,000 downpayment and lowers monthly SIP by ₹12,000 EMI
      setWhatIfSip(Math.max(1000, baseDefaultSip - 12000));
      setWhatIfReturn(12);
      setWhatIfStepUp(8);
      setWhatIfInitialDelta(-Math.min(baseSavings, 150000));
    } else if (presetId === 'aggressive-fire') {
      setWhatIfSip(Math.round(baseDefaultSip * 1.4));
      setWhatIfReturn(14);
      setWhatIfStepUp(15);
      setWhatIfInitialDelta(0);
    } else {
      setWhatIfSip(Math.round(baseDefaultSip * 1.25));
      setWhatIfReturn(13);
      setWhatIfStepUp(12);
      setWhatIfInitialDelta(0);
    }
  };

  const trajectory = calculateWealthTrajectory({
    currentSavings: baseSavings,
    monthlySip: baseDefaultSip,
    annualReturnRate: 12,
    stepUpPercent: 10,
    years: horizonYears,
    whatIfMonthlySip: whatIfSip,
    whatIfReturnRate: whatIfReturn,
    whatIfStepUpPercent: whatIfStepUp,
    whatIfInitialDelta,
  });

  const finalBase = trajectory[trajectory.length - 1]?.baselineWealth || 0;
  const finalWhatIf = trajectory[trajectory.length - 1]?.whatIfWealth || 0;
  const wealthDifference = finalWhatIf - finalBase;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="theme-card rounded-2xl p-6 space-y-2">
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          Interactive Wealth Scenario Engine · Anchored to Your Saved Profile ({formatINR(baseCtc)} CTC)
        </p>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
          What-If Financial Simulator
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Compare your current baseline against life events, career hikes, or disciplined Step-Up SIP changes.
        </p>
      </div>

      {/* Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2.5">
        {[
          { id: 'stepup', label: 'Disciplined +25% SIP Boost' },
          { id: 'career-jump', label: 'Career Switch (+30% CTC Hike)' },
          { id: 'car-purchase', label: 'Buy a Car (Downpayment + EMI Impact)' },
          { id: 'aggressive-fire', label: 'FIRE Accelerator (15% Step-Up)' },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
              activePreset === p.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-4 theme-card rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-display font-bold text-[var(--text-primary)]">
            Adjust What-If Parameters
          </h2>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">What-If Monthly SIP</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {formatINR(whatIfSip)}/mo
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={Math.max(150000, baseDefaultSip * 3)}
                step={1000}
                value={whatIfSip}
                onChange={(e) => setWhatIfSip(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-xs text-[var(--text-muted)] font-mono">
                Baseline SIP: {formatINR(baseDefaultSip)}/mo
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Expected Annual Return (CAGR)</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {whatIfReturn}% p.a.
                </span>
              </div>
              <input
                type="range"
                min={7}
                max={18}
                step={0.5}
                value={whatIfReturn}
                onChange={(e) => setWhatIfReturn(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Annual SIP Step-Up %</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {whatIfStepUp}% / yr
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={whatIfStepUp}
                onChange={(e) => setWhatIfStepUp(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-secondary)]">Investment Horizon</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {horizonYears} Years
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={25}
                step={1}
                value={horizonYears}
                onChange={(e) => setHorizonYears(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
            <div className="text-xs text-[var(--text-muted)]">Net Impact in {horizonYears} Years</div>
            <div
              className={`text-xl font-mono font-bold ${
                wealthDifference >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {wealthDifference >= 0 ? '+' : ''}
              {formatCompactINR(wealthDifference)}
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Baseline: {formatCompactINR(finalBase)} → What-If: {formatCompactINR(finalWhatIf)}
            </p>
          </div>
        </div>

        {/* Trajectory Chart Column */}
        <div className="lg:col-span-8 theme-card rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                Baseline vs What-If Wealth Trajectory ({horizonYears} Years)
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Starting from your saved corpus of {formatINR(baseSavings)}
              </p>
            </div>
          </div>
          <WealthTrajectoryChart
            data={trajectory}
            showWhatIf={true}
            baselineLabel={`Baseline (${formatINR(baseDefaultSip)}/mo)`}
            whatIfLabel={`What-If (${formatINR(whatIfSip)}/mo)`}
          />
        </div>
      </div>
    </div>
  );
};

interface SavedCalculationItem {
  id: string;
  calculatorType: 'SIP' | 'EMI' | 'CTC';
  label: string;
  inputs: Record<string, number | string | boolean>;
  outputs: Record<string, number | string>;
  timestamp: string;
}

export const PlannersView: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { user, token } = useAuth();

  const defaultMonthlyInHand = estimateMonthlyInHand(user?.annualCtc ?? 1200000);
  const defaultSurplus = Math.max(0, defaultMonthlyInHand - (user?.monthlyExpenses ?? 35000));
  const defaultSipFromProfile =
    user?.monthlyInvestments || Math.max(5000, Math.round(defaultSurplus * 0.5));

  // 1. SIP Calculator State (pure deterministic calculateSIP)
  const [sipMonthly, setSipMonthly] = useState<string>(String(defaultSipFromProfile));
  const [sipReturnRate, setSipReturnRate] = useState<string>('12');
  const [sipYears, setSipYears] = useState<string>('10');
  const [showSipSchedule, setShowSipSchedule] = useState<boolean>(false);

  // 2. EMI Calculator State (pure deterministic calculateEMI)
  const [emiLoanAmount, setEmiLoanAmount] = useState<string>('2500000');
  const [emiInterestRate, setEmiInterestRate] = useState<string>('8.5');
  const [emiTenureValue, setEmiTenureValue] = useState<string>('120');
  const [emiTenureUnit, setEmiTenureUnit] = useState<'months' | 'years'>('months');
  const [showEmiSchedule, setShowEmiSchedule] = useState<boolean>(false);

  // 3. CTC-to-Take-Home & Tax Regime Calculator State (pure deterministic calculateCTCToTakeHome)
  const [ctcInput, setCtcInput] = useState<string>(String(user?.annualCtc ?? 1200000));
  const [selectedRegime, setSelectedRegime] = useState<'new' | 'old'>('new');
  const [deduction80C, setDeduction80C] = useState<string>('150000');
  const [deductionHra80D, setDeductionHra80D] = useState<string>('100000');
  const [includeEpf, setIncludeEpf] = useState<boolean>(true);

  // 4. Inflation-Adjusted Goal Planner State
  const [goalName, setGoalName] = useState('Home Downpayment / Dream Goal');
  const [goalTargetToday, setGoalTargetToday] = useState<number>(2500000);
  const [goalYears, setGoalYears] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(6);

  // Saved Calculations State for logged-in user
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculationItem[]>([]);
  const [savingType, setSavingType] = useState<'SIP' | 'EMI' | 'CTC' | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.annualCtc) {
      setCtcInput(String(user.annualCtc));
    }
    if (user?.monthlyInvestments && user.monthlyInvestments > 0) {
      setSipMonthly(String(user.monthlyInvestments));
    }
  }, [user?.annualCtc, user?.monthlyInvestments]);

  useEffect(() => {
    if (!user || !token) {
      setSavedCalculations([]);
      return;
    }
    fetch('/api/calculators/saved', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && Array.isArray(d.savedCalculations)) {
          setSavedCalculations(d.savedCalculations);
        }
      })
      .catch(() => {});
  }, [user, token]);

  // Run deterministic pure functions
  const sipResult = calculateSIP(
    Number(sipMonthly),
    Number(sipReturnRate),
    Number(sipYears)
  );

  const tenureInMonths =
    emiTenureUnit === 'years'
      ? Math.round(Number(emiTenureValue) * 12)
      : Math.round(Number(emiTenureValue));

  const emiResult = calculateEMI(
    Number(emiLoanAmount),
    Number(emiInterestRate),
    tenureInMonths
  );

  const ctcResult = calculateCTCToTakeHome(
    {
      annualCtc: Number(ctcInput),
      regime: selectedRegime,
      deduction80C: Number(deduction80C),
      hraAndOtherDeductions: Number(deductionHra80D),
      includeEpf,
    },
    TAX_RULES_FY2025_26
  );

  const handleSaveCalculation = async (
    calculatorType: 'SIP' | 'EMI' | 'CTC',
    label: string,
    inputs: Record<string, number | string | boolean>,
    outputs: Record<string, number | string>
  ) => {
    if (!user || !token || savingType) return;
    setSavingType(calculatorType);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/calculators/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          calculatorType,
          label,
          inputs,
          outputs,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      if (data && data.savedEntry) {
        setSavedCalculations((prev) => [
          data.savedEntry,
          ...prev.filter((c) => c.id !== data.savedEntry.id),
        ]);
        setSaveMessage(`Saved ${calculatorType} calculation to your account.`);
      }
    } catch {
      setSaveMessage('Could not save calculation right now. Please try again.');
    } finally {
      setSavingType(null);
    }
  };

  const restoreSavedCalculation = (item: SavedCalculationItem) => {
    if (item.calculatorType === 'SIP') {
      if (item.inputs.monthlyInvestment !== undefined)
        setSipMonthly(String(item.inputs.monthlyInvestment));
      if (item.inputs.annualReturnRate !== undefined)
        setSipReturnRate(String(item.inputs.annualReturnRate));
      if (item.inputs.durationYears !== undefined)
        setSipYears(String(item.inputs.durationYears));
    } else if (item.calculatorType === 'EMI') {
      if (item.inputs.loanAmount !== undefined)
        setEmiLoanAmount(String(item.inputs.loanAmount));
      if (item.inputs.annualInterestRate !== undefined)
        setEmiInterestRate(String(item.inputs.annualInterestRate));
      if (item.inputs.tenureMonths !== undefined) {
        setEmiTenureUnit('months');
        setEmiTenureValue(String(item.inputs.tenureMonths));
      }
    } else if (item.calculatorType === 'CTC') {
      if (item.inputs.annualCtc !== undefined) setCtcInput(String(item.inputs.annualCtc));
      if (item.inputs.regime === 'new' || item.inputs.regime === 'old')
        setSelectedRegime(item.inputs.regime);
      if (item.inputs.deduction80C !== undefined)
        setDeduction80C(String(item.inputs.deduction80C));
      if (item.inputs.hraAndOtherDeductions !== undefined)
        setDeductionHra80D(String(item.inputs.hraAndOtherDeductions));
      if (typeof item.inputs.includeEpf === 'boolean') setIncludeEpf(item.inputs.includeEpf);
    }
  };

  // Inflation-adjusted goal math
  const inflatedTarget = Math.round(goalTargetToday * Math.pow(1 + inflationRate / 100, goalYears));
  const monthlyRate = 0.12 / 12;
  const months = goalYears * 12;
  const requiredGoalSip =
    months > 0
      ? Math.round(
          (inflatedTarget * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate))
        )
      : 0;

  return (
    <div className={embedded ? 'space-y-8' : 'max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8'}>
      <div className="theme-card rounded-2xl p-6 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Deterministic Indian Financial Calculators · {TAX_RULES_FY2025_26.financialYear} ({TAX_RULES_FY2025_26.assessmentYear})
          </p>
          {saveMessage && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {saveMessage}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
          SIP, EMI, CTC-to-Take-Home & Goal Calculators
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Pre-populated with your saved profile (Annual CTC: {formatINR(user?.annualCtc ?? 1200000)}, Monthly SIP: {formatINR(defaultSipFromProfile)}). Powered by pure deterministic math formulas.
        </p>
      </div>

      {/* Row 1: SIP Calculator & EMI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. SIP Calculator */}
        <div className="theme-card rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                  SIP Wealth Calculator
                </h2>
              </div>
              {user && sipResult.valid && (
                <button
                  type="button"
                  disabled={savingType === 'SIP'}
                  onClick={() =>
                    handleSaveCalculation(
                      'SIP',
                      `SIP ${formatINR(sipResult.monthlyInvestment)}/mo @ ${sipResult.annualReturnRate}% for ${sipResult.durationYears} yrs`,
                      {
                        monthlyInvestment: sipResult.monthlyInvestment,
                        annualReturnRate: sipResult.annualReturnRate,
                        durationYears: sipResult.durationYears,
                      },
                      {
                        investedAmount: sipResult.investedAmount,
                        estimatedReturns: sipResult.estimatedReturns,
                        futureValue: sipResult.futureValue,
                      }
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingType === 'SIP' ? 'Saving...' : 'Save SIP'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Monthly SIP (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  step={500}
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Expected Return (% p.a.)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  step={0.5}
                  value={sipReturnRate}
                  onChange={(e) => setSipReturnRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Duration (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  step={1}
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>
            </div>

            {!sipResult.valid ? (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{sipResult.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-muted)]">Total Invested</div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)] mt-1">
                      {formatINR(sipResult.investedAmount)}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-muted)]">Estimated Returns</div>
                    <div className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      +{formatINR(sipResult.estimatedReturns)}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Total Future Value
                    </div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)] mt-1">
                      {formatINR(sipResult.futureValue)}
                    </div>
                  </div>
                </div>

                {/* Visual Invested vs Returns Bar */}
                {sipResult.futureValue > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                      <span>
                        Principal ({Math.round((sipResult.investedAmount / sipResult.futureValue) * 100)}%)
                      </span>
                      <span>
                        Compounded Gains (
                        {Math.max(
                          0,
                          100 - Math.round((sipResult.investedAmount / sipResult.futureValue) * 100)
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div
                        className="h-full bg-slate-500 transition-all duration-300"
                        style={{
                          width: `${Math.round((sipResult.investedAmount / sipResult.futureValue) * 100)}%`,
                        }}
                      />
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            0,
                            100 - Math.round((sipResult.investedAmount / sipResult.futureValue) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={() => setShowSipSchedule(!showSipSchedule)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {showSipSchedule
                      ? 'Hide Year-by-Year SIP Breakdown'
                      : 'View Year-by-Year SIP Breakdown Table'}
                  </button>

                  {showSipSchedule && (
                    <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] border-b border-[var(--border-subtle)] sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Year</th>
                            <th className="py-2 px-3">Invested</th>
                            <th className="py-2 px-3">Est. Returns</th>
                            <th className="py-2 px-3">Total Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                          {sipResult.yearlyBreakdown.map((row) => (
                            <tr key={row.year}>
                              <td className="py-1.5 px-3">Yr {row.year}</td>
                              <td className="py-1.5 px-3">{formatCompactINR(row.investedAmount)}</td>
                              <td className="py-1.5 px-3 text-emerald-600 dark:text-emerald-400">
                                +{formatCompactINR(row.estimatedReturns)}
                              </td>
                              <td className="py-1.5 px-3 font-semibold">
                                {formatCompactINR(row.futureValue)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] font-mono">
            Formula: FV = P × [((1 + i)^n − 1) / i] × (1 + i), where i = r / 12 / 100
          </p>
        </div>

        {/* 2. Loan EMI Calculator */}
        <div className="theme-card rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                  Loan EMI & Interest Breakdown Calculator
                </h2>
              </div>
              {user && emiResult.valid && (
                <button
                  type="button"
                  disabled={savingType === 'EMI'}
                  onClick={() =>
                    handleSaveCalculation(
                      'EMI',
                      `Loan ${formatCompactINR(emiResult.loanAmount)} @ ${emiResult.annualInterestRate}% for ${emiResult.tenureMonths} mos`,
                      {
                        loanAmount: emiResult.loanAmount,
                        annualInterestRate: emiResult.annualInterestRate,
                        tenureMonths: emiResult.tenureMonths,
                      },
                      {
                        monthlyEmi: emiResult.monthlyEmi,
                        totalInterest: emiResult.totalInterest,
                        totalPayment: emiResult.totalPayment,
                      }
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingType === 'EMI' ? 'Saving...' : 'Save EMI'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Loan Principal (₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={50000}
                  value={emiLoanAmount}
                  onChange={(e) => setEmiLoanAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  step={0.25}
                  value={emiInterestRate}
                  onChange={(e) => setEmiInterestRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Tenure ({emiTenureUnit})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (emiTenureUnit === 'months') {
                        setEmiTenureUnit('years');
                        setEmiTenureValue(String(Math.max(1, Math.round(Number(emiTenureValue) / 12))));
                      } else {
                        setEmiTenureUnit('months');
                        setEmiTenureValue(String(Math.max(1, Math.round(Number(emiTenureValue) * 12))));
                      }
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
                  >
                    Switch to {emiTenureUnit === 'months' ? 'Years' : 'Months'}
                  </button>
                </div>
                <input
                  type="number"
                  min={1}
                  max={emiTenureUnit === 'months' ? 480 : 40}
                  step={1}
                  value={emiTenureValue}
                  onChange={(e) => setEmiTenureValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>
            </div>

            {!emiResult.valid ? (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{emiResult.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Monthly EMI
                    </div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)] mt-1">
                      {formatINR(emiResult.monthlyEmi)}/mo
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-muted)]">Total Interest Payable</div>
                    <div className="text-base font-mono font-bold text-amber-600 dark:text-amber-400 mt-1">
                      {formatINR(emiResult.totalInterest)}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-xs text-[var(--text-muted)]">Total Payment (P + I)</div>
                    <div className="text-base font-mono font-bold text-[var(--text-primary)] mt-1">
                      {formatINR(emiResult.totalPayment)}
                    </div>
                  </div>
                </div>

                {/* Visual Principal vs Interest Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                    <span>Principal ({emiResult.principalPercentage}%)</span>
                    <span>Interest ({emiResult.interestPercentage}%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${emiResult.principalPercentage}%` }}
                    />
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${emiResult.interestPercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => setShowEmiSchedule(!showEmiSchedule)}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    {showEmiSchedule
                      ? 'Hide Yearly Amortization Schedule'
                      : 'View Yearly Amortization Schedule'}
                  </button>

                  {showEmiSchedule && (
                    <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[var(--bg-card)] text-[var(--text-muted)] border-b border-[var(--border-subtle)] sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Year</th>
                            <th className="py-2 px-3">Principal Paid</th>
                            <th className="py-2 px-3">Interest Paid</th>
                            <th className="py-2 px-3">Balance Left</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                          {emiResult.yearlyBreakdown.map((row) => (
                            <tr key={row.year}>
                              <td className="py-1.5 px-3">Yr {row.year}</td>
                              <td className="py-1.5 px-3">{formatCompactINR(row.principalPaid)}</td>
                              <td className="py-1.5 px-3 text-amber-600 dark:text-amber-400">
                                {formatCompactINR(row.interestPaid)}
                              </td>
                              <td className="py-1.5 px-3 font-semibold">
                                {formatCompactINR(row.remainingBalance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)] font-mono">
            Formula: EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where r = annualRate / 12 / 100
          </p>
        </div>
      </div>

      {/* Row 2: CTC-to-Take-Home Calculator & Inflation-Adjusted Goal SIP Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3. CTC-to-Take-Home & Tax Regime Calculator */}
        <div className="theme-card rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
                    CTC to Take-Home & Tax Regime Calculator ({TAX_RULES_FY2025_26.financialYear})
                  </h2>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Versioned rules: {TAX_RULES_FY2025_26.financialYear} ({TAX_RULES_FY2025_26.assessmentYear}) · Std Deduction ₹75k (New) / ₹50k (Old) · Sec 87A Rebate + 4% Cess
                </p>
              </div>
              {user && ctcResult.valid && (
                <button
                  type="button"
                  disabled={savingType === 'CTC'}
                  onClick={() =>
                    handleSaveCalculation(
                      'CTC',
                      `CTC ${formatCompactINR(ctcResult.annualCtc)} (${ctcResult.regime.toUpperCase()} Regime)`,
                      {
                        annualCtc: ctcResult.annualCtc,
                        regime: ctcResult.regime,
                        deduction80C: Number(deduction80C),
                        hraAndOtherDeductions: Number(deductionHra80D),
                        includeEpf,
                      },
                      {
                        monthlyTakeHome: ctcResult.monthlyTakeHome,
                        annualTakeHome: ctcResult.annualTakeHome,
                        estimatedAnnualTax: ctcResult.estimatedAnnualTax,
                      }
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingType === 'CTC' ? 'Saving...' : 'Save CTC'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Annual CTC Package (₹)
                </label>
                <input
                  type="number"
                  min={10000}
                  step={50000}
                  value={ctcInput}
                  onChange={(e) => setCtcInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Sec 80C Investments (Max ₹1.5L)
                </label>
                <input
                  type="number"
                  min={0}
                  max={150000}
                  step={10000}
                  value={deduction80C}
                  onChange={(e) => setDeduction80C(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  HRA + 80D + NPS Deductions (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={deductionHra80D}
                  onChange={(e) => setDeductionHra80D(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(['new', 'old'] as const).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => setSelectedRegime(reg)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedRegime === reg
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                    }`}
                  >
                    {reg === 'new' ? 'New Tax Regime (Default)' : 'Old Tax Regime'}
                  </button>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEpf}
                  onChange={(e) => setIncludeEpf(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <span>Include Standard EPF & Gratuity in CTC</span>
              </label>
            </div>

            {!ctcResult.valid ? (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{ctcResult.error}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      Estimated Monthly Take-Home ({ctcResult.regime.toUpperCase()} Regime)
                    </div>
                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                      {formatINR(ctcResult.monthlyTakeHome)}/mo
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-mono">
                      Annual Net Take-Home: {formatINR(ctcResult.annualTakeHome)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                    <div className="text-xs text-[var(--text-muted)]">
                      Annual Income Tax + 4% Cess ({ctcResult.regime.toUpperCase()} Regime)
                    </div>
                    <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
                      {formatINR(ctcResult.estimatedAnnualTax)}/yr
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] font-mono">
                      {ctcResult.regime === 'new' ? 'Old' : 'New'} Regime Tax:{' '}
                      {formatINR(ctcResult.alternativeRegimeTax)}/yr
                    </div>
                  </div>
                </div>

                {/* Detailed CTC to Take-Home Breakdown */}
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Annual CTC</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {formatINR(ctcResult.annualCtc)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Less: Employer EPF & Gratuity (part of CTC)
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">
                      −{formatINR(ctcResult.employerEpfAndGratuity)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--border-subtle)] pt-1.5">
                    <span className="text-[var(--text-secondary)]">Gross Annual Salary</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      {formatINR(ctcResult.grossAnnualSalary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Less: Employee EPF + Professional Tax
                    </span>
                    <span className="text-rose-600 dark:text-rose-400">
                      −{formatINR(ctcResult.employeeEpfAnnual + ctcResult.professionalTaxAnnual)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Taxable Income (after ₹{ctcResult.standardDeduction.toLocaleString('en-IN')} Std Ded)
                    </span>
                    <span className="text-[var(--text-primary)]">
                      {formatINR(ctcResult.taxableIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      Less: Annual Income Tax (incl. 4% Cess)
                    </span>
                    <span className="text-rose-600 dark:text-rose-400">
                      −{formatINR(ctcResult.estimatedAnnualTax)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 callout-emphasis">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div className="text-[var(--text-primary)]">
                    <strong>
                      Recommended:{' '}
                      {ctcResult.recommendedRegime === 'new' ? 'New Tax Regime' : 'Old Tax Regime'}
                    </strong>{' '}
                    saves you{' '}
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(
                        Math.abs(ctcResult.estimatedAnnualTax - ctcResult.alternativeRegimeTax)
                      )}
                    </span>{' '}
                    per year in tax.
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border-subtle)]">
            {TAX_RULES_FY2025_26.sourceNote}
          </p>
        </div>

        {/* 4. Inflation-Adjusted Goal SIP Planner */}
        <div className="theme-card rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
              Inflation-Adjusted Goal SIP Roadmap
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Financial Goal Name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Cost in Today’s Rupees (₹)
                </label>
                <input
                  type="number"
                  min={50000}
                  step={50000}
                  value={goalTargetToday}
                  onChange={(e) => setGoalTargetToday(Math.max(10000, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Years Away
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={35}
                    value={goalYears}
                    onChange={(e) => setGoalYears(Math.max(1, Math.min(35, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Inflation %
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">
                  Future Cost of “{goalName}” in {goalYears} Years
                </span>
                <span className="font-mono font-bold text-sm text-[var(--text-primary)]">
                  {formatCompactINR(inflatedTarget)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  Required Monthly SIP (at 12% Equity Return)
                </span>
                <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(requiredGoalSip)}/mo
                </span>
              </div>
            </div>

            {/* Logged-in User Saved Calculations History */}
            {user && savedCalculations.length > 0 && (
              <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Your Saved Calculator Runs (Click to Restore)</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {savedCalculations.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => restoreSavedCalculation(item)}
                      className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-emerald-500/50 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                          {item.label}
                        </p>
                        <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                          {item.calculatorType === 'SIP' &&
                            `FV: ${formatINR(Number(item.outputs.futureValue || 0))}`}
                          {item.calculatorType === 'EMI' &&
                            `EMI: ${formatINR(Number(item.outputs.monthlyEmi || 0))}/mo`}
                          {item.calculatorType === 'CTC' &&
                            `Take-Home: ${formatINR(Number(item.outputs.monthlyTakeHome || 0))}/mo`}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {item.calculatorType}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
