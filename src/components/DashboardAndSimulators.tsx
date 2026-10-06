import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  Wallet,
  ShieldAlert,
  Edit3,
  CheckCircle2,
  ArrowUpRight,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Info,
  Sparkles,
  PieChart,
} from 'lucide-react';
import { useAuth, PreferredLanguage } from '../context/AuthContext';
import { usePrivacy } from '../context/PrivacyContext';
import { maskCurrency, maskName } from '../utils/masking';
import {
  formatINR,
  formatCompactINR,
  estimateMonthlyInHand,
  calculateWealthTrajectory,
} from '../config/financialData';
import { WealthTrajectoryChart, AllocationBreakdownChart } from './InteractiveCharts';
import { AppView } from './Navbar';

export const DashboardView: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const { user, updateProfile } = useAuth();
  const { privacyMode } = usePrivacy();

  const incomeType = user?.incomeType || 'Salaried';
  const isSalaried = incomeType === 'Salaried';
  const isIrregular = ['Self-employed or business', 'Farmer', 'Daily-wage worker', 'Other'].includes(incomeType);
  const emergencyMonths = isIrregular ? 9 : 6;

  const annualCtc = user?.annualCtc ?? 1200000;
  const monthlyExpenses = user?.monthlyExpenses ?? 35000;
  const currentSavings = user?.currentSavings ?? 200000;
  const userMonthlyEmi = user?.monthlyEmi ?? 0;

  const [emiInput, setEmiInput] = useState<string>(String(userMonthlyEmi));
  const [emiError, setEmiError] = useState<string | null>(null);

  useEffect(() => {
    setEmiInput(String(user?.monthlyEmi ?? 0));
  }, [user?.monthlyEmi]);

  const handleEmiChange = (val: string) => {
    setEmiInput(val);
    const parsed = val.trim() === '' ? 0 : Number(val);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setEmiError('Monthly EMI cannot be negative.');
      return;
    }
    setEmiError(null);
    updateProfile({ monthlyEmi: Math.round(parsed) }).catch(() => {});
  };

  const activeEmi =
    Number.isFinite(Number(emiInput)) && Number(emiInput) >= 0
      ? emiInput.trim() === ''
        ? 0
        : Number(emiInput)
      : userMonthlyEmi;

  // Salaried: estimateMonthlyInHand(annualCtc)
  // Non-Salaried: annualCtc was stored as monthly * 12, so monthly take-home = annualCtc / 12
  const monthlyInHand = isSalaried ? estimateMonthlyInHand(annualCtc) : Math.round(annualCtc / 12);
  const monthlySurplus = Math.max(0, monthlyInHand - monthlyExpenses - activeEmi);
  const monthlySip = user?.monthlyInvestments || Math.round(monthlySurplus * 0.6);
  const savingsRate = monthlyInHand > 0 ? Math.round((monthlySurplus / monthlyInHand) * 100) : 0;

  const emergencyTarget = (monthlyExpenses + activeEmi) * emergencyMonths;
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
              {user?.dreamJob || incomeType}
            </span>
            <span>·</span>
            <span>{incomeType}</span>
            <span>·</span>
            <span>{user?.location || 'India'}</span>
            <span>·</span>
            <span>Age {user?.age || 25}</span>
            <span>·</span>
            <span>{user?.riskAppetite || 'Balanced'} Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            Namaste, {privacyMode ? maskName(user?.fullName) : (user?.fullName || 'Investor')}! Here is Your Financial Vision
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
            onClick={() => onNavigate('planners')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            <span>View 10-Year Roadmap</span>
          </button>
        </div>
      </div>

      {/* Interactive Monthly EMI Input & Loan Obligations */}
      <div className="theme-card rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            <label htmlFor="dashboard-emi-input" className="text-sm font-semibold text-[var(--text-primary)]">
              Input Your EMI / Monthly EMI (₹)
            </label>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Enter 0 if you have no active loan. Automatically syncs with your 10-Year Roadmap and updates your monthly surplus live.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative w-full sm:w-56">
            <span className="absolute left-3.5 top-2.5 text-xs font-mono text-[var(--text-muted)]">₹</span>
            <input
              id="dashboard-emi-input"
              type="number"
              min="0"
              step="500"
              value={emiInput}
              onChange={(e) => handleEmiChange(e.target.value)}
              placeholder="e.g., 15000 (0 if none)"
              className="w-full pl-8 pr-3.5 py-2 rounded-xl theme-input text-sm font-mono"
            />
          </div>
          {emiError && (
            <span className="text-xs text-rose-500 font-medium">{emiError}</span>
          )}
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{isSalaried ? 'Annual CTC Package' : 'Average Monthly Income'}</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {maskCurrency(isSalaried ? annualCtc : monthlyInHand, privacyMode)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            {isSalaried
              ? `Est. Monthly In-Hand: ${maskCurrency(monthlyInHand, privacyMode)}`
              : `Annualized: ${maskCurrency(annualCtc, privacyMode)}`}
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Monthly Expenses & EMI</span>
            <Wallet className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {maskCurrency(monthlyExpenses + activeEmi, privacyMode)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            Living: {maskCurrency(monthlyExpenses, privacyMode)} · EMI: {maskCurrency(activeEmi, privacyMode)}
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Current Saved Corpus</span>
            <ShieldAlert className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
            {maskCurrency(currentSavings, privacyMode)}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">
            {emergencyMonths}-Mo Emergency Target: {maskCurrency(emergencyTarget, privacyMode)} ({emergencyProgress}%)
          </div>
        </div>

        <div className="theme-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>10-Yr Projected Net Worth</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {maskCurrency(tenYearNetWorth, privacyMode)}
          </div>
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            With {maskCurrency(monthlySip, privacyMode)}/mo Step-Up SIP
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
                Starting from {maskCurrency(currentSavings, privacyMode)} current savings + {maskCurrency(monthlySip, privacyMode)}/month SIP with 10% annual step-up
              </p>
            </div>
          </div>
          <WealthTrajectoryChart data={projectionData} />
        </div>

        <div className="lg:col-span-4 theme-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold text-[var(--text-primary)]">
              Emergency Fund & Cashflow
            </h2>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-secondary)]">{emergencyMonths}-Month Safety Target</span>
                <span className="font-mono font-semibold text-[var(--text-primary)]">
                  {maskCurrency(emergencyTarget, privacyMode)}
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
                  ? `Full ${emergencyMonths}-month emergency buffer achieved!`
                  : `You have covered ${emergencyProgress}% of your ${emergencyMonths}-month expense + EMI buffer.`}
              </p>
            </div>

            <AllocationBreakdownChart
              monthlyInHand={monthlyInHand}
              monthlyExpenses={monthlyExpenses + activeEmi}
              monthlyInvestments={monthlySip}
            />
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('planners')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <span>Explore 10-Year Roadmap</span>
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

export interface YearPointData {
  year: number;
  label: string;
  age: number;
  monthlySip: number;
  investedPrincipal: number;
  sipCorpus: number;
  cashBuffer: number;
  cumulativeEmi: number;
  totalWealth: number;
}

function getYearExplanation(
  point: YearPointData,
  lang: PreferredLanguage,
  monthlyInHand: number,
  monthlyExpenses: number,
  monthlyEmi: number
): { title: string; narrative: string } {
  if (lang === 'Hindi') {
    switch (point.year) {
      case 0:
        return {
          title: 'वर्ष 0: वित्तीय आधार और वर्तमान बचत',
          narrative: `शुरुआती स्थिति: आप ${formatINR(point.cashBuffer)} की वर्तमान बचत के साथ शुरुआत कर रहे हैं। आपकी मासिक इन-हैंड आय ${formatINR(monthlyInHand)}, मासिक जीवन-यापन खर्च ${formatINR(monthlyExpenses)} और मासिक ईएमआई ${formatINR(monthlyEmi)} है।`,
        };
      case 1:
        return {
          title: 'वर्ष 1: नींव का निर्माण',
          narrative: `12 महीने के अनुशासित एसआईपी (${formatINR(point.monthlySip)}/माह) से निवेश की शुरुआत। कुल मूलधन निवेश ${formatINR(point.investedPrincipal)} पहुंचा। कुल चुकाई गई ईएमआई ${formatINR(point.cumulativeEmi)} है और कुल संपत्ति ${formatINR(point.totalWealth)} हो गई।`,
        };
      case 2:
        return {
          title: 'वर्ष 2: चक्रवाढ की शुरुआत',
          narrative: `10% वेतन वृद्धि के साथ स्टेप-अप एसआईपी बढ़कर ${formatINR(point.monthlySip)}/माह हो गया। इक्विटी पोर्टफोलियो ${formatINR(point.sipCorpus)} तक पहुंचा और कुल ईएमआई ${formatINR(point.cumulativeEmi)} चुकाई गई।`,
        };
      case 3:
        return {
          title: 'वर्ष 3: तीन साल की वित्तीय स्थिरता',
          narrative: `बाजार के उतार-चढ़ाव 3 साल में संतुलित होने लगते हैं। कुल संपत्ति ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} निवेश और ${formatINR(point.cashBuffer)} लिक्विड बफर) हो गई है। कुल चुकाई गई ईएमआई: ${formatINR(point.cumulativeEmi)}।`,
        };
      case 4:
        return {
          title: 'वर्ष 4: अनुशासित वृद्धि',
          narrative: `वार्षिक एसआईपी (${formatINR(point.monthlySip)}/माह) और चक्रवृद्धि रिटर्न मिलकर गति पकड़ रहे हैं। कुल संचित संपत्ति ${formatINR(point.totalWealth)} तक पहुंच गई है।`,
        };
      case 5:
        return {
          title: 'वर्ष 5: पाँच साल का महत्वपूर्ण पड़ाव',
          narrative: `5 वर्षों के चक्रवृद्धि ब्याज (कंपाउंडिंग) की वास्तविक शक्ति अब स्पष्ट दिखाई देती है। शुद्ध संपत्ति ${formatINR(point.totalWealth)} है, जिसमें ${formatINR(point.sipCorpus)} इक्विटी में है।`,
        };
      case 6:
        return {
          title: 'वर्ष 6: संपत्ति में तीव्र वृद्धि',
          narrative: `पुराने संचित पोर्टफोलियो से मिलने वाला वार्षिक रिटर्न आपके नए वार्षिक निवेश से भी अधिक होने लगता है। कुल संपत्ति ${formatINR(point.totalWealth)} तक बढ़ जाती है।`,
        };
      case 7:
        return {
          title: 'वर्ष 7: सात साल का चक्र',
          narrative: `इक्विटी पोर्टफोलियो ${formatINR(point.sipCorpus)} तक पहुंच गया। कुल ${formatINR(point.cumulativeEmi)} ईएमआई भुगतान के साथ कर्ज का भार कम हो रहा है और कुल संपत्ति ${formatINR(point.totalWealth)} हो गई।`,
        };
      case 8:
        return {
          title: 'वर्ष 8: मजबूत वित्तीय सुरक्षा',
          narrative: `आपका लिक्विड फंड (${formatINR(point.cashBuffer)}) और इक्विटी पोर्टफोलियो (${formatINR(point.sipCorpus)}) मिलकर वित्तीय स्वतंत्रता को मजबूती देते हैं। कुल संपत्ति: ${formatINR(point.totalWealth)}।`,
        };
      case 9:
        return {
          title: 'वर्ष 9: घातांकीय विस्तार',
          narrative: `कंपाउंडिंग का घातांकीय (exponential) लाभ तेजी से बढ़ रहा है। शुद्ध संपत्ति ${formatINR(point.totalWealth)} के करीब पहुंचती है। कुल चुकाई गई ईएमआई: ${formatINR(point.cumulativeEmi)}।`,
        };
      default:
        return {
          title: 'वर्ष 10: एक दशक का अनुशासित मील का पत्थर',
          narrative: `एक पूरे दशक के निरंतर निवेश और ऋण भुगतान के बाद आपकी कुल अनुमानित संपत्ति ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} पोर्टफोलियो + ${formatINR(point.cashBuffer)} लिक्विड बफर) तक पहुंचती है। कुल ईएमआई: ${formatINR(point.cumulativeEmi)}।`,
        };
    }
  }

  if (lang === 'Marathi') {
    switch (point.year) {
      case 0:
        return {
          title: 'वर्ष ०: आर्थिक पाया आणि सुरुवातीची बचत',
          narrative: `सुरुवातीचा टप्पा: तुमची सध्याची बचत ${formatINR(point.cashBuffer)} आहे. तुमचे मासिक इन-हँड उत्पन्न ${formatINR(monthlyInHand)}, मासिक खर्च ${formatINR(monthlyExpenses)} आणि मासिक ईएमआय ${formatINR(monthlyEmi)} आहे.`,
        };
      case 1:
        return {
          title: 'वर्ष १: पायाभरणीचा टप्पा',
          narrative: `१२ महिन्यांची शिस्तबद्ध एसआयपी (${formatINR(point.monthlySip)}/महिना). एकूण जमा केलेले मुद्दल ${formatINR(point.investedPrincipal)} झाले. एकूण भरलेला ईएमआय ${formatINR(point.cumulativeEmi)} असून एकूण संपत्ती ${formatINR(point.totalWealth)} वर पोहोचली.`,
        };
      case 2:
        return {
          title: 'वर्ष २: चक्रवाढीचा वेग',
          narrative: `१०% स्टेप-अप एसआयपी वाढून ${formatINR(point.monthlySip)}/महिना झाली. इक्विटी पोर्टफोलिओ ${formatINR(point.sipCorpus)} वर पोहोचला आणि एकूण भरलेला ईएमआय ${formatINR(point.cumulativeEmi)} झाला.`,
        };
      case 3:
        return {
          title: 'वर्ष ३: तीन वर्षांची स्थिरता',
          narrative: `बाजारातील चढ-उतार ३ वर्षांत संतुलित होतात. एकूण संपत्ती ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} गुंतवणूक आणि ${formatINR(point.cashBuffer)} रोख बफर) झाली. एकूण कर्जफेड: ${formatINR(point.cumulativeEmi)}.`,
        };
      case 4:
        return {
          title: 'वर्ष ४: शिस्तबद्ध संपत्ती वाढ',
          narrative: `तुमची वार्षिक स्टेप-अप एसआयपी (${formatINR(point.monthlySip)}/महिना) चक्रवाढीमुळे मोठी गती पकडते. एकूण संपत्ती ${formatINR(point.totalWealth)} वर पोहोचते.`,
        };
      case 5:
        return {
          title: 'वर्ष ५: पाच वर्षांचा महत्त्वपूर्ण टप्पा',
          narrative: `५ वर्षांच्या चक्रवाढीची खरी ताकद आता स्पष्ट दिसते. एकूण संपत्ती ${formatINR(point.totalWealth)} असून यामध्ये ${formatINR(point.sipCorpus)} इक्विटी मालमत्ता आहे.`,
        };
      case 6:
        return {
          title: 'वर्ष ६: संपत्तीचा वेग वाढणे',
          narrative: `जुन्या संचित पोर्टफोलिओवरील वार्षिक परतावा तुमच्या नवीन वार्षिक बचतीपेक्षा जास्त वाढू लागतो. एकूण संपत्ती ${formatINR(point.totalWealth)} पर्यंत वाढते.`,
        };
      case 7:
        return {
          title: 'वर्ष ७: सात वर्षांचा प्रवास',
          narrative: `इक्विटी पोर्टफोलिओ ${formatINR(point.sipCorpus)} वर पोहोचला. एकूण ${formatINR(point.cumulativeEmi)} ईएमआय भरून कर्ज कमी झाले असून एकूण संपत्ती ${formatINR(point.totalWealth)} झाली.`,
        };
      case 8:
        return {
          title: 'वर्ष ८: भक्कम आर्थिक सुरक्षितता',
          narrative: `तुमचा रोख निधी (${formatINR(point.cashBuffer)}) आणि इक्विटी पोर्टफोलिओ (${formatINR(point.sipCorpus)}) आर्थिक स्वातंत्र्याला भक्कम आधार देतात. एकूण संपत्ती: ${formatINR(point.totalWealth)}.`,
        };
      case 9:
        return {
          title: 'वर्ष ९: घातांकीय वाढ',
          narrative: `चक्रवाढीचा वेग प्रचंड वाढतो. एकूण निव्वळ संपत्ती ${formatINR(point.totalWealth)} च्या जवळ पोहोचते. एकूण भरलेला ईएमआय: ${formatINR(point.cumulativeEmi)}.`,
        };
      default:
        return {
          title: 'वर्ष १०: एका दशकाचा महा-टप्पा',
          narrative: `पूर्ण १० वर्षांच्या शिस्तबद्ध गुंतवणूक आणि कर्जफेडीनंतर तुमची एकूण संपत्ती ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} पोर्टफोलिओ + ${formatINR(point.cashBuffer)} रोख बफर) वर पोहोचते. एकूण ईएमआय: ${formatINR(point.cumulativeEmi)}.`,
        };
    }
  }

  // English fallback
  switch (point.year) {
    case 0:
      return {
        title: 'Year 0: Financial Baseline & Starting Corpus',
        narrative: `Starting Baseline: You begin with a current savings corpus of ${formatINR(point.cashBuffer)}. Your monthly take-home is ${formatINR(monthlyInHand)}, monthly living expenses are ${formatINR(monthlyExpenses)}, and monthly EMI obligation is ${formatINR(monthlyEmi)}.`,
      };
    case 1:
      return {
        title: 'Year 1: Foundation Phase',
        narrative: `12 months of disciplined SIP investing (${formatINR(point.monthlySip)}/mo). Total principal invested reaches ${formatINR(point.investedPrincipal)}. Cumulative EMI paid is ${formatINR(point.cumulativeEmi)}. Total wealth compounds to ${formatINR(point.totalWealth)}.`,
      };
    case 2:
      return {
        title: 'Year 2: Compounding Momentum',
        narrative: `Step-Up SIP increases to ${formatINR(point.monthlySip)}/mo (10% hike). Equity portfolio grows to ${formatINR(point.sipCorpus)}. Total cumulative EMI serviced is ${formatINR(point.cumulativeEmi)}.`,
      };
    case 3:
      return {
        title: 'Year 3: Three-Year Resilience',
        narrative: `Market volatility smooths out across 3 years. Total net worth reaches ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} in investments and ${formatINR(point.cashBuffer)} in liquid reserves). Cumulative debt amortized: ${formatINR(point.cumulativeEmi)}.`,
      };
    case 4:
      return {
        title: 'Year 4: Steady Compounding Growth',
        narrative: `Your disciplined Step-Up SIP (${formatINR(point.monthlySip)}/mo) builds serious momentum. Portfolio returns begin rivaling fresh contributions. Total net worth stands at ${formatINR(point.totalWealth)}.`,
      };
    case 5:
      return {
        title: 'Year 5: Half-Decade Inflection Point',
        narrative: `The exponential power of 5 years of compounding becomes clearly visible. Net worth stands at ${formatINR(point.totalWealth)} with ${formatINR(point.sipCorpus)} in equity assets and ${formatINR(point.cumulativeEmi)} in total loans serviced.`,
      };
    case 6:
      return {
        title: 'Year 6: Wealth Acceleration',
        narrative: `Annual returns generated by your accumulated portfolio start exceeding your fresh annual savings. Cumulative investments reach ${formatINR(point.investedPrincipal)}, elevating total wealth to ${formatINR(point.totalWealth)}.`,
      };
    case 7:
      return {
        title: 'Year 7: Seven-Year Compounder',
        narrative: `Investment corpus scales to ${formatINR(point.sipCorpus)}. With cumulative EMI payments reaching ${formatINR(point.cumulativeEmi)}, debt liabilities shrink relative to your expanding net worth of ${formatINR(point.totalWealth)}.`,
      };
    case 8:
      return {
        title: 'Year 8: Financial Independence Cushion',
        narrative: `Liquid reserves (${formatINR(point.cashBuffer)}) and equity investments (${formatINR(point.sipCorpus)}) create strong financial security. Total wealth reaches ${formatINR(point.totalWealth)}.`,
      };
    case 9:
      return {
        title: 'Year 9: Exponential Expansion',
        narrative: `Compounding growth accelerates steeply. Total wealth approaches ${formatINR(point.totalWealth)}. Cumulative loan payments of ${formatINR(point.cumulativeEmi)} are fully accounted for.`,
      };
    default:
      return {
        title: 'Year 10: A Full Decade of Discipline',
        narrative: `A full decade of consistent investing and amortizing loans yields a projected net worth of ${formatINR(point.totalWealth)} (${formatINR(point.sipCorpus)} investment portfolio + ${formatINR(point.cashBuffer)} cash buffer). Total cumulative EMI serviced: ${formatINR(point.cumulativeEmi)}.`,
      };
  }
}

export const PlannersView: React.FC<{ onNavigate?: (view: AppView) => void; embedded?: boolean }> = ({
  onNavigate,
}) => {
  const { user, language, updateProfile } = useAuth();
  const { privacyMode } = usePrivacy();

  const [emiInput, setEmiInput] = useState<string>(String(user?.monthlyEmi ?? 0));
  const [emiError, setEmiError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(10);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  useEffect(() => {
    setEmiInput(String(user?.monthlyEmi ?? 0));
  }, [user?.monthlyEmi]);

  if (!user || !user.profileCompleted || user.annualCtc === null || user.annualCtc === undefined) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-12">
        <div className="theme-card rounded-3xl p-8 sm:p-12 text-center space-y-5 border border-amber-500/20">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              {language === 'Hindi'
                ? 'कृपया पहले अपना वित्तीय प्रोफाइल पूरा करें'
                : language === 'Marathi'
                ? 'कृपया आधी तुमची आर्थिक प्रोफाइल पूर्ण करा'
                : 'Complete Your Executive Dashboard Profile First'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {language === 'Hindi'
                ? '10-वर्षीय रोडमैप आपके वार्षिक पैकेज, बचत, और ईएमआई के आधार पर तैयार होता है। व्यक्तिगत प्रक्षेपण देखने के लिए कृपया अपनी प्रोफ़ाइल भरें।'
                : language === 'Marathi'
                ? '१०-वर्षीय आराखडा तुमच्या वार्षिक पॅकेज, बचत आणि ईएमआयवर आधारित तयार होतो. वैयक्तिक अंदाज पाहण्यासाठी आधी प्रोफाइल भरा.'
                : 'The 10-Year Roadmap dynamically models your future net worth based on your annual CTC, living expenses, savings, and monthly EMI. Please configure your profile first.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('profile');
              else window.location.hash = 'profile';
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all cursor-pointer shadow-md"
          >
            <span>
              {language === 'Hindi'
                ? 'प्रोफ़ाइल सेटिंग्स खोलें'
                : language === 'Marathi'
                ? 'प्रोफाइल सेटिंग्स उघडा'
                : 'Complete Financial Profile'}
            </span>
          </button>
        </div>
      </div>
    );
  }

  const handleEmiChange = (val: string) => {
    setEmiInput(val);
    const parsed = val.trim() === '' ? 0 : Number(val);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setEmiError('Monthly EMI cannot be negative.');
      return;
    }
    setEmiError(null);
    updateProfile({ monthlyEmi: Math.round(parsed) }).catch(() => {});
  };

  const isSalaried = (user.incomeType || 'Salaried') === 'Salaried';
  const isIrregular = ['Self-employed or business', 'Farmer', 'Daily-wage worker', 'Other'].includes(user.incomeType || 'Salaried');
  const emergencyMonths = isIrregular ? 9 : 6;

  const currentSavings = user.currentSavings ?? 200000;
  const annualCtc = user.annualCtc ?? 1200000;
  const monthlyExpenses = user.monthlyExpenses ?? 35000;
  const activeEmi =
    Number.isFinite(Number(emiInput)) && Number(emiInput) >= 0
      ? emiInput.trim() === ''
        ? 0
        : Number(emiInput)
      : user.monthlyEmi ?? 0;

  const monthlyInHand = isSalaried ? estimateMonthlyInHand(annualCtc) : Math.round(annualCtc / 12);
  const monthlySurplus = Math.max(0, monthlyInHand - monthlyExpenses - activeEmi);
  const monthlySipBase =
    user.monthlyInvestments && user.monthlyInvestments > 0
      ? user.monthlyInvestments
      : Math.max(0, Math.round(monthlySurplus * 0.6));

  const riskRate =
    user.riskAppetite === 'Aggressive' ? 0.135 : user.riskAppetite === 'Conservative' ? 0.095 : 0.12;
  const monthlyEquityRate = riskRate / 12;
  const baseAge = user.age || 25;

  // Build Year 0 to 10 points
  const roadmapPoints: YearPointData[] = [];
  let currentSipCorpus = 0;
  let currentPrincipalInvested = 0;
  let currentCashBuffer = currentSavings;

  roadmapPoints.push({
    year: 0,
    label: 'Year 0',
    age: baseAge,
    monthlySip: monthlySipBase,
    investedPrincipal: 0,
    sipCorpus: 0,
    cashBuffer: Math.round(currentCashBuffer),
    cumulativeEmi: 0,
    totalWealth: Math.round(currentCashBuffer),
  });

  for (let y = 1; y <= 10; y++) {
    const sipThisYear = Math.round(monthlySipBase * Math.pow(1.1, y - 1));
    const unallocatedMonthly = Math.max(0, monthlyInHand - monthlyExpenses - activeEmi - sipThisYear);

    for (let m = 0; m < 12; m++) {
      currentSipCorpus = (currentSipCorpus + sipThisYear) * (1 + monthlyEquityRate);
      currentPrincipalInvested += sipThisYear;
      currentCashBuffer = currentCashBuffer * (1 + 0.04 / 12) + unallocatedMonthly;
    }

    const cumulativeEmi = activeEmi * 12 * y;
    const totalWealth = Math.round(currentSipCorpus + currentCashBuffer);

    roadmapPoints.push({
      year: y,
      label: `Year ${y}`,
      age: baseAge + y,
      monthlySip: sipThisYear,
      investedPrincipal: Math.round(currentPrincipalInvested),
      sipCorpus: Math.round(currentSipCorpus),
      cashBuffer: Math.round(currentCashBuffer),
      cumulativeEmi,
      totalWealth,
    });
  }

  const activePoint =
    roadmapPoints.find((p) => p.year === (hoveredYear !== null ? hoveredYear : selectedYear)) ||
    roadmapPoints[roadmapPoints.length - 1];

  const maxVal = Math.max(
    500000,
    ...roadmapPoints.map((p) => Math.max(p.totalWealth, p.cumulativeEmi, p.sipCorpus))
  );

  // SVG Chart geometry
  const chartW = 860;
  const chartH = 340;
  const padL = 90;
  const padR = 30;
  const padT = 30;
  const padB = 45;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const getX = (idx: number) => padL + (idx / 10) * plotW;
  const getY = (val: number) => padT + plotH - Math.min(1, Math.max(0, val / maxVal)) * plotH;

  const totalWealthPoints = roadmapPoints.map((p, i) => `${getX(i)},${getY(p.totalWealth)}`).join(' ');
  const sipPoints = roadmapPoints.map((p, i) => `${getX(i)},${getY(p.sipCorpus)}`).join(' ');
  const cashPoints = roadmapPoints.map((p, i) => `${getX(i)},${getY(p.cashBuffer)}`).join(' ');
  const emiPoints = roadmapPoints.map((p, i) => `${getX(i)},${getY(p.cumulativeEmi)}`).join(' ');

  const areaTotalWealth = `${getX(0)},${padT + plotH} ${totalWealthPoints} ${getX(10)},${padT + plotH}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => Math.round(maxVal * ratio));

  // Personalized Suggestions
  const emergencyTarget = (monthlyExpenses + activeEmi) * emergencyMonths;
  const emergencyTargetRatio = emergencyTarget > 0 ? (currentSavings / emergencyTarget) : 1;
  const emiRatio = monthlyInHand > 0 ? (activeEmi / monthlyInHand) : 0;
  const activeExplanation = getYearExplanation(activePoint, language, monthlyInHand, monthlyExpenses, activeEmi);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="theme-card rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Calendar className="w-4 h-4" />
            <span>10-Year Interactive Financial Roadmap · Personalized to {maskName(user.fullName, privacyMode)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
            10-Year Financial Trajectory & Wealth Vision
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Modeled from your saved salary, current liquid corpus, SIP commitment, and loan EMIs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
            <span>Risk Profile: </span>
            <strong className="text-emerald-600 dark:text-emerald-400">
              {user.riskAppetite} ({(riskRate * 100).toFixed(1)}% p.a.)
            </strong>
          </div>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('profile');
              else window.location.hash = 'profile';
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] hover:border-emerald-500/50 text-xs font-semibold text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-emerald-500" />
            <span>Update Profile</span>
          </button>
        </div>
      </div>

      {/* EMI Input Strip (Synchronized bidirectionally with Executive Dashboard) */}
      <div className="theme-card rounded-2xl p-5 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-500" />
            <label htmlFor="roadmap-emi-input" className="text-sm font-semibold text-[var(--text-primary)]">
              Input Your EMI / Monthly EMI (₹)
            </label>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Accepts 0 or any active loan EMI. Synchronizes instantly with your Executive Dashboard and recalculates your 10-Year roadmap.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative w-full sm:w-56">
            <span className="absolute left-3.5 top-2.5 text-xs font-mono text-[var(--text-muted)]">₹</span>
            <input
              id="roadmap-emi-input"
              type="number"
              min="0"
              step="500"
              value={emiInput}
              onChange={(e) => handleEmiChange(e.target.value)}
              placeholder="e.g., 15000 (0 if none)"
              className="w-full pl-8 pr-3.5 py-2 rounded-xl theme-input text-sm font-mono"
            />
          </div>
          {emiError && (
            <span className="text-xs text-rose-500 font-medium">{emiError}</span>
          )}
        </div>
      </div>

      {/* Interactive 10-Year Financial Graph Container */}
      <div className="theme-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
              10-Year Net Worth & Amortization Progression
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Hover or tap on any Year (0 through 10) to inspect your portfolio breakdown and cumulative metrics.
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-3.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              Total Projected Net Worth
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <span className="w-3 h-3 rounded-sm bg-cyan-500 inline-block" />
              SIP Equity Portfolio
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
              Liquid Cash Buffer
            </span>
            {activeEmi > 0 && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" />
                Cumulative EMI Serviced
              </span>
            )}
          </div>
        </div>

        {/* Selected Year Interactive Snapshot Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-emerald-500/30 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-[var(--border-subtle)] pb-2 sm:pb-0 pr-2">
            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              Selected Point
            </span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {activePoint.label}
            </div>
            <span className="text-xs text-[var(--text-secondary)]">Age {activePoint.age}</span>
          </div>

          <div>
            <span className="text-xs text-[var(--text-muted)]">Total Net Worth</span>
            <div className="text-base sm:text-lg font-mono font-bold text-[var(--text-primary)] mt-0.5">
              {maskCurrency(formatINR(activePoint.totalWealth), privacyMode)}
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400">
              {activePoint.year === 0 ? 'Baseline' : `+${maskCurrency(formatCompactINR(activePoint.totalWealth - currentSavings), privacyMode)} growth`}
            </span>
          </div>

          <div>
            <span className="text-xs text-[var(--text-muted)]">SIP Equity Portfolio</span>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {maskCurrency(formatINR(activePoint.sipCorpus), privacyMode)}
            </div>
            <span className="text-xs text-[var(--text-secondary)]">
              {maskCurrency(formatINR(activePoint.monthlySip), privacyMode)}/mo SIP
            </span>
          </div>

          <div>
            <span className="text-xs text-[var(--text-muted)]">Liquid Cash Buffer</span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {maskCurrency(formatINR(activePoint.cashBuffer), privacyMode)}
            </div>
            <span className="text-xs text-[var(--text-secondary)]">4% p.a. safe reserve</span>
          </div>

          <div>
            <span className="text-xs text-[var(--text-muted)]">Cumulative EMI Paid</span>
            <div className="text-base sm:text-lg font-mono font-bold text-rose-600 dark:text-rose-400 mt-0.5">
              {maskCurrency(formatINR(activePoint.cumulativeEmi), privacyMode)}
            </div>
            <span className="text-xs text-[var(--text-secondary)]">
              {activeEmi > 0 ? `${maskCurrency(formatINR(activeEmi), privacyMode)}/mo loan` : 'No active loan'}
            </span>
          </div>
        </div>

        {/* Responsive Interactive SVG Graph */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto min-w-[700px] select-none"
            role="img"
            aria-label="10-Year Financial Roadmap Chart"
          >
            <defs>
              <linearGradient id="roadmapWealthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {yTicks.map((tickVal, idx) => {
              const y = getY(tickVal);
              return (
                <g key={idx}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray={idx === 0 ? undefined : '4 4'}
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="var(--text-muted)"
                    fontSize="11"
                    fontFamily="monospace"
                  >
                    {formatCompactINR(tickVal)}
                  </text>
                </g>
              );
            })}

            {/* Shaded Area Under Total Wealth */}
            <polygon points={areaTotalWealth} fill="url(#roadmapWealthGrad)" />

            {/* Cumulative EMI Line */}
            {activeEmi > 0 && (
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={emiPoints}
              />
            )}

            {/* Cash Buffer Line */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.25"
              strokeLinecap="round"
              points={cashPoints}
            />

            {/* SIP Equity Portfolio Line */}
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.5"
              strokeLinecap="round"
              points={sipPoints}
            />

            {/* Total Net Worth Line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="3.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={totalWealthPoints}
            />

            {/* Vertical Guide Line for Selected Year */}
            <line
              x1={getX(activePoint.year)}
              y1={padT}
              x2={getX(activePoint.year)}
              y2={chartH - padB}
              stroke="#10b981"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />

            {/* Interactive Year Node Columns */}
            {roadmapPoints.map((pt, i) => {
              const x = getX(i);
              const yWealth = getY(pt.totalWealth);
              const isSelected = activePoint.year === pt.year;

              return (
                <g
                  key={pt.year}
                  className="cursor-pointer"
                  onClick={() => setSelectedYear(pt.year)}
                  onMouseEnter={() => setHoveredYear(pt.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  {/* Invisible touch/click hit area */}
                  <rect
                    x={x - plotW / 22}
                    y={padT}
                    width={plotW / 11}
                    height={plotH}
                    fill="transparent"
                  />

                  {/* Wealth Node Circle */}
                  {isSelected && (
                    <circle cx={x} cy={yWealth} r="8" fill="#10b981" fillOpacity="0.25" />
                  )}
                  <circle
                    cx={x}
                    cy={yWealth}
                    r={isSelected ? '5.5' : '4'}
                    fill={isSelected ? '#10b981' : '#059669'}
                    stroke="var(--bg-card)"
                    strokeWidth="1.5"
                  />

                  {/* X-Axis Year Labels */}
                  <text
                    x={x}
                    y={chartH - 15}
                    textAnchor="middle"
                    fill={isSelected ? '#10b981' : 'var(--text-muted)'}
                    fontSize="11"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    Y{pt.year}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Plain-Language Assumptions Explainer */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-3 text-xs text-[var(--text-secondary)]">
          <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-[var(--text-primary)]">
              Roadmap Underlying Modeling Assumptions:
            </span>
            <p>
              • <strong>Equity SIP Growth:</strong> Compounded monthly at {(riskRate * 100).toFixed(1)}% p.a. based on your {user.riskAppetite} risk profile.
              <br />
              • <strong>Annual Step-Up:</strong> Monthly SIP increases by 10% each year, modeling disciplined salary promotions and career growth.
              <br />
              • <strong>Liquid Cash Buffer:</strong> Initial savings plus unencumbered monthly surplus compound at 4% p.a. safe liquid rate.
              <br />
                • <strong>Loan Amortization:</strong> Monthly EMI of {maskCurrency(formatINR(activeEmi), privacyMode)} is serviced consistently without compounding debt penalties.
            </p>
          </div>
        </div>
      </div>

      {/* Below the Graph: Personalized Suggestions */}
      <div className="theme-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
            Personalized Financial Suggestions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Emergency Fund Insight */}
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Emergency Readiness
              </span>
              <ShieldAlert className="w-4 h-4 text-sky-500" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {emergencyTargetRatio >= 1
                ? `Healthy ${emergencyMonths}-Month Emergency Cushion`
                : 'Prioritize Emergency Fund Buffer'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {emergencyTargetRatio >= 1
                ? `Your current liquid corpus of ${maskCurrency(formatINR(currentSavings), privacyMode)} safely covers ${emergencyMonths}+ months of living expenses and EMI commitments (${maskCurrency(formatINR(emergencyTarget), privacyMode)}).`
                : `Your ${emergencyMonths}-month safety threshold is ${maskCurrency(formatINR(emergencyTarget), privacyMode)}. Maintain at least this amount in liquid funds or high-yield savings before escalating aggressive equity investments.`}
            </p>
          </div>

          {/* EMI-to-Income Health */}
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Debt-to-Income Ratio
              </span>
              <IndianRupee className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {emiRatio === 0
                ? 'Zero Loan Burden'
                : emiRatio <= 0.35
                ? `Safe EMI Load (${Math.round(emiRatio * 100)}% of In-Hand)`
                : `Elevated EMI Load (${Math.round(emiRatio * 100)}% of In-Hand)`}
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {emiRatio === 0
                ? 'You have zero monthly debt obligations, channeling your entire surplus into high-growth wealth accumulation.'
                : emiRatio <= 0.35
                ? `Financial planners recommend keeping loan EMIs below 35% of take-home pay. Your EMI of ${maskCurrency(formatINR(activeEmi), privacyMode)} is well within safe boundaries.`
                : `Your monthly EMI of ${maskCurrency(formatINR(activeEmi), privacyMode)} consumes ${Math.round(emiRatio * 100)}% of take-home pay. Consider making partial prepayments to reduce interest drain.`}
            </p>
          </div>

          {/* Wealth Compounding Power */}
          <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                10-Year Net Wealth Milestone
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {maskCurrency(formatCompactINR(roadmapPoints[10].totalWealth), privacyMode)} Projected Corpus
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Over 10 years, your total invested principal of {maskCurrency(formatCompactINR(roadmapPoints[10].investedPrincipal), privacyMode)} compounds into {maskCurrency(formatCompactINR(roadmapPoints[10].sipCorpus), privacyMode)} in equity alone, proving the power of steady 10% annual Step-Up discipline.
            </p>
          </div>
        </div>
      </div>

      {/* Below the Graph: Year-by-Year Detailed Explanations in Selected Language */}
      <div className="theme-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold text-[var(--text-primary)]">
              {language === 'Hindi'
                ? 'वर्ष-दर-वर्ष विस्तृत विश्लेषण (Year 0 से Year 10)'
                : language === 'Marathi'
                ? 'वर्षनिहाय सविस्तर विश्लेषण (Year ० ते Year १०)'
                : 'Year-by-Year Financial Progression Breakdown'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'Hindi'
                ? 'किसी भी वर्ष पर क्लिक करके उस वर्ष की अनुमानित बचत, एसआईपी और ईएमआई की स्थिति देखें।'
                : language === 'Marathi'
                ? 'कोणत्याही वर्षावर क्लिक करून त्या वर्षाची अंदाजित बचत, एसआयपी आणि ईएमआय तपशील तपासा.'
                : 'Click any year tab to examine the detailed narrative and milestones for that point in your financial journey.'}
            </p>
          </div>

          {/* Year selector tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            {roadmapPoints.map((p) => (
              <button
                key={p.year}
                type="button"
                onClick={() => setSelectedYear(p.year)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  selectedYear === p.year
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Y{p.year}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Year Narrative Box */}
        <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-display font-bold text-[var(--text-primary)]">
                {activeExplanation.title}
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Age {activePoint.age} · Year {activePoint.year}
            </span>
          </div>

          <p className="text-sm text-[var(--text-primary)] leading-relaxed">
            {activeExplanation.narrative}
          </p>

          <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Monthly SIP:</span>
              <div className="font-mono font-semibold text-[var(--text-primary)] mt-0.5">
                {formatINR(activePoint.monthlySip)}/mo
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Equity Portfolio:</span>
              <div className="font-mono font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                {formatINR(activePoint.sipCorpus)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Liquid Cash Buffer:</span>
              <div className="font-mono font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                {formatINR(activePoint.cashBuffer)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[var(--text-muted)]">Cumulative EMI Paid:</span>
              <div className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-0.5">
                {formatINR(activePoint.cumulativeEmi)}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'Hindi'
              ? 'अस्वीकरण: यह 10-वर्षीय रोडमैप केवल शैक्षिक अनुकरण और वित्तीय साक्षरता उद्देश्यों के लिए बनाया गया है। वास्तविक बाजार रिटर्न आर्थिक स्थितियों और म्यूचुअल फंड प्रदर्शन के अनुसार बदलते रहते हैं। यह सेबी-पंजीकृत वित्तीय सलाह नहीं है।'
              : language === 'Marathi'
              ? 'अस्वीकरण: हा १०-वर्षीय आराखडा केवळ शैक्षणिक आणि आर्थिक साक्षरतेच्या उद्देशाने तयार केला आहे. बाजारातील वास्तविक परतावा आर्थिक परिस्थितीनुसार बदलू शकतो. हे सेबी-नोंदणीकृत अधिकृत आर्थिक सल्ला नाही.'
              : 'Disclaimer: This 10-Year Roadmap is generated for educational simulation and financial planning awareness only. Actual market returns fluctuate with economic conditions and fund performance. This is not SEBI-registered investment advice.'}
          </p>
        </div>
      </div>
    </div>
  );
};
