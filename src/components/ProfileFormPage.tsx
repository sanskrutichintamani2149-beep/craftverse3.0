import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, Briefcase, IndianRupee, MapPin, UserCheck } from 'lucide-react';
import { useAuth, PreferredLanguage } from '../context/AuthContext';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { estimateMonthlyInHand, formatINR } from '../config/financialData';

interface ProfileFormPageProps {
  onSuccessNavigate: () => void;
}

export const ProfileFormPage: React.FC<ProfileFormPageProps> = ({ onSuccessNavigate }) => {
  const { user, updateProfile, unsavedDraft } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [age, setAge] = useState<string>(user?.age ? String(user.age) : '26');
  const [location, setLocation] = useState(user?.location || '');
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>(
    user?.preferredLanguage || 'English'
  );
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme);

  const [dreamJob, setDreamJob] = useState(
    unsavedDraft?.dreamJob ?? user?.dreamJob ?? ''
  );
  const [annualCtc, setAnnualCtc] = useState<string>(
    unsavedDraft?.annualCtc !== undefined
      ? String(unsavedDraft.annualCtc)
      : user?.annualCtc !== null && user?.annualCtc !== undefined
      ? String(user.annualCtc)
      : ''
  );
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>(
    unsavedDraft?.monthlyExpenses !== undefined
      ? String(unsavedDraft.monthlyExpenses)
      : user?.monthlyExpenses !== null && user?.monthlyExpenses !== undefined
      ? String(user.monthlyExpenses)
      : ''
  );
  const [currentSavings, setCurrentSavings] = useState<string>(
    unsavedDraft?.currentSavings !== undefined
      ? String(unsavedDraft.currentSavings)
      : user?.currentSavings !== null && user?.currentSavings !== undefined
      ? String(user.currentSavings)
      : ''
  );
  const [monthlyInvestments, setMonthlyInvestments] = useState<string>(
    unsavedDraft?.monthlyInvestments !== undefined
      ? String(unsavedDraft.monthlyInvestments)
      : user?.monthlyInvestments
      ? String(user.monthlyInvestments)
      : ''
  );
  const [riskAppetite, setRiskAppetite] = useState<'Conservative' | 'Balanced' | 'Aggressive'>(
    unsavedDraft?.riskAppetite ?? user?.riskAppetite ?? 'Balanced'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName((prev) => prev || user.fullName);
      setAge((prev) => prev || String(user.age));
      setLocation((prev) => prev || user.location);
      setPreferredLanguage(user.preferredLanguage);
      if (!unsavedDraft) {
        if (user.dreamJob) setDreamJob(user.dreamJob);
        if (user.annualCtc !== null) setAnnualCtc(String(user.annualCtc));
        if (user.monthlyExpenses !== null) setMonthlyExpenses(String(user.monthlyExpenses));
        if (user.currentSavings !== null) setCurrentSavings(String(user.currentSavings));
        if (user.monthlyInvestments) setMonthlyInvestments(String(user.monthlyInvestments));
        if (user.riskAppetite) setRiskAppetite(user.riskAppetite);
      }
    }
  }, [user, unsavedDraft]);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const parsedCtcPreview = Number(annualCtc) > 0 ? Number(annualCtc) : 0;
  const estimatedInHand = estimateMonthlyInHand(parsedCtcPreview);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate saves on double-click

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = fullName.trim();
    const cleanLoc = location.trim();
    const cleanJob = dreamJob.trim();
    const numAge = Number(age);
    const numCtc = Number(annualCtc);
    const numExpenses = Number(monthlyExpenses);
    const numSavings = Number(currentSavings);
    const numInvestments = monthlyInvestments === '' ? undefined : Number(monthlyInvestments);

    if (cleanName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!Number.isFinite(numAge) || numAge < 15 || numAge > 100) {
      setErrorMessage('Age must be between 15 and 100.');
      return;
    }
    if (cleanLoc.length < 2) {
      setErrorMessage('Please enter your City / State.');
      return;
    }
    if (cleanJob.length < 2) {
      setErrorMessage('Please enter your Dream Job / Job Title.');
      return;
    }
    if (annualCtc === '' || !Number.isFinite(numCtc) || numCtc <= 0) {
      setErrorMessage('Annual CTC / Salary must be a positive number greater than ₹0.');
      return;
    }
    if (monthlyExpenses === '' || !Number.isFinite(numExpenses) || numExpenses < 0) {
      setErrorMessage('Monthly Expenses cannot be negative or blank.');
      return;
    }
    if (currentSavings === '' || !Number.isFinite(numSavings) || numSavings < 0) {
      setErrorMessage('Current Savings cannot be negative or blank.');
      return;
    }
    if (numInvestments !== undefined && (!Number.isFinite(numInvestments) || numInvestments < 0)) {
      setErrorMessage('Monthly Investments cannot be negative.');
      return;
    }

    setIsSubmitting(true);
    try {
      setTheme(selectedTheme, false);
      await updateProfile({
        fullName: cleanName,
        age: Math.round(numAge),
        location: cleanLoc,
        preferredLanguage,
        theme: selectedTheme,
        dreamJob: cleanJob,
        annualCtc: Math.round(numCtc),
        monthlyExpenses: Math.round(numExpenses),
        currentSavings: Math.round(numSavings),
        monthlyInvestments: numInvestments !== undefined ? Math.round(numInvestments) : undefined,
        riskAppetite,
      });
      setSuccessMessage('Profile saved to database! Redirecting to your updated Dashboard...');
      setTimeout(() => {
        onSuccessNavigate();
      }, 450);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save profile. Your typed values are kept safe.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstTimeSetup = !user?.profileCompleted;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="theme-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="border-b border-[var(--border-subtle)] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {isFirstTimeSetup
                ? 'Step 2 of 2 · Complete Your Financial Profile'
                : 'Account & Financial Profile Settings'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mt-1">
              {isFirstTimeSetup
                ? `Welcome, ${user?.fullName || 'Investor'}! Let’s set your Financial Baseline`
                : 'Edit Personal & Financial Profile'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Saved securely to your account database so your Dashboard, What-If Simulator, and Planners stay synced across every login.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-sm flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not save profile</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1: Financial Profile (Dream Job, Annual CTC, Monthly Expenses, Current Savings) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Core Financial Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Dream Job / Current Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={dreamJob}
                  onChange={(e) => setDreamJob(e.target.value)}
                  placeholder="e.g., Full-Stack Software Engineer, Product Manager"
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Annual CTC / Salary (₹ per year) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="1"
                    step="1000"
                    required
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(e.target.value)}
                    placeholder="e.g., 1200000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
                {parsedCtcPreview > 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                    Est. Monthly In-Hand: {formatINR(estimatedInHand)}/mo
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Monthly Living Expenses (₹ per month) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    placeholder="e.g., 35000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Current Total Savings / Corpus (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    required
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    placeholder="e.g., 250000"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Monthly SIP / Investment Commitment (₹, optional)
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={monthlyInvestments}
                    onChange={(e) => setMonthlyInvestments(e.target.value)}
                    placeholder="Auto-calculated from surplus if left blank"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl theme-input text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Risk Appetite
                </label>
                <select
                  value={riskAppetite}
                  onChange={(e) =>
                    setRiskAppetite(e.target.value as 'Conservative' | 'Balanced' | 'Aggressive')
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                >
                  <option value="Conservative">Conservative (Debt & Large Cap Focus)</option>
                  <option value="Balanced">Balanced (Index + Flexi-Cap + Debt Buffer)</option>
                  <option value="Aggressive">Aggressive (High Equity Growth & Step-Up SIP)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details & Saved Preferences */}
          <div className="space-y-4 pt-6 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <UserCheck className="w-4 h-4 text-amber-500" />
              <span>Personal Information & Cross-Device Preferences</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Age (Years) *
                </label>
                <input
                  type="number"
                  min="15"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Location (City, State) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Pune, Maharashtra"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl theme-input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Preferred Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as PreferredLanguage)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Marathi">मराठी (Marathi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Saved Account Theme
                </label>
                <select
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value as ThemeMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm"
                >
                  <option value="dark">Dark Theme (Signature Navy)</option>
                  <option value="light">Light Theme (High-Contrast Daylight)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Registered Email (Account ID)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl theme-input text-sm opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
            {user?.profileCompleted && (
              <button
                type="button"
                onClick={onSuccessNavigate}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-strong)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Saving to Database...'
                  : isFirstTimeSetup
                  ? 'Save Profile & Open Dashboard'
                  : 'Save Changes & Refresh Views'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
