import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  TrendingUp,
  BookOpen,
  PlayCircle,
  ShieldCheck,
  Calculator,
  Sparkles,
  AlertCircle,
  Lock,
  Mail,
  User,
  MapPin,
  Calendar,
  Globe,
  Sliders,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth, PreferredLanguage } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AppView } from './Navbar';
import { getTranslation } from '../config/translations';

/**
 * Full-Screen Background Video for Landing & Login/Signup Screens (CHANGE 1 & CHANGE 3)
 * - Dark Mode: /videos/login-bg.mp4 with deep navy radial overlay & blurred city-lights feel
 * - Light Mode: /videos/bgvdo2.mp4 with soft logo-derived pastel gradient
 * - Autoplay promise properly handled to prevent browser blocking
 * - Seamless loop cross-fade and reduced-motion support
 */
export const FirstPageVideoBackground: React.FC = () => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loopFadeOpacity, setLoopFadeOpacity] = useState(1);

  const isLight = theme === 'light';
  const videoSrc = isLight ? '/videos/bgvdo2.mp4' : '/videos/login-bg.mp4';
  const posterSrc = isLight ? '/videos/bgvdo2-poster.jpg' : '/videos/login-bg-poster.jpg';

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const navConn = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
    const shouldPause = mq.matches || Boolean(navConn?.saveData);
    setReduceMotion(shouldPause);

    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (reduceMotion) {
      vid.pause();
    } else {
      vid.load();
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay handled safely; poster fallback displays smoothly
        });
      }
    }
  }, [theme, reduceMotion]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || !vid.duration || !Number.isFinite(vid.duration)) return;
    const remaining = vid.duration - vid.currentTime;
    if (remaining < 0.55) {
      setLoopFadeOpacity(Math.max(0.72, remaining / 0.55));
    } else if (vid.currentTime < 0.45) {
      setLoopFadeOpacity(Math.min(1, 0.72 + (vid.currentTime / 0.45) * 0.28));
    } else if (loopFadeOpacity !== 1) {
      setLoopFadeOpacity(1);
    }
  };

  if (videoFailed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {/* Static poster layer underneath for seamless loop cross-fade and reduced-motion mode */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url("${posterSrc}")` }}
      />

      {!reduceMotion && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onError={() => setVideoFailed(true)}
          style={{ opacity: loopFadeOpacity }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />
      )}

      {/* CHANGE 1: Deep Navy Blue Subtle Blurred Overlay for Dark Mode (blurred city-lights feel)
          CHANGE 2: Soft Logo-Derived Tinted Overlay for Light Mode */}
      <div
        className="absolute inset-0 w-full h-full transition-colors duration-300 backdrop-blur-[1.5px]"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(circle at 50% 25%, rgba(37, 99, 235, 0.18) 0%, rgba(4, 11, 26, 0.72) 55%, rgba(4, 11, 26, 0.94) 100%)'
              : 'radial-gradient(circle at 50% 25%, rgba(37, 99, 235, 0.08) 0%, rgba(237, 244, 252, 0.82) 55%, rgba(237, 244, 252, 0.95) 100%)',
        }}
      />
    </div>
  );
};

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const { user, language } = useAuth();
  const t = getTranslation(language);

  const heroCopy = {
    English: {
      kicker: 'YOUR AI FINANCIAL COMPANION',
      title: 'Clarity on Every Rupee — Empowering Your Finances.',
      subtitle:
        'Simulate career increments, compare Old vs New Tax Regimes, master 60+ Indian financial terms in English, Hindi & Marathi, and achieve true financial freedom.',
      primaryCta: user ? t.dashboard : t.signIn,
      secondaryCta: t.explainer,
    },
    Hindi: {
      kicker: 'आपका AI वित्तीय मार्गदर्शक',
      title: 'हर रुपये की स्पष्टता — आपके वित्तीय भविष्य का सशक्तिकरण।',
      subtitle:
        'वेतन वृद्धि का अनुकरण करें, पुरानी बनाम नई कर व्यवस्था की तुलना करें, और 60+ आवश्यक भारतीय वित्तीय शब्दों में दक्षता प्राप्त करें।',
      primaryCta: user ? t.dashboard : t.signIn,
      secondaryCta: t.explainer,
    },
    Marathi: {
      kicker: 'आपला AI आर्थिक मार्गदर्शक',
      title: 'प्रत्येक रुपयाची स्पष्टता — आपल्या आर्थिक नियोजनाचे सक्षमीकरण.',
      subtitle:
        'पगारवाढीचा अंदाज घ्या, जुनी विरुद्ध नवीन कर रचना तपासा, आणि ६०+ भारतीय आर्थिक संकल्पना सोप्या भाषेत समजून घ्या.',
      primaryCta: user ? t.dashboard : t.signIn,
      secondaryCta: t.explainer,
    },
  }[language];

  const features = [
    {
      icon: Sliders,
      title: t.whatif,
      desc: 'Simulate how a 30% CTC hike, Step-Up SIP, or major planned expenditure influences your 10-to-20 year net worth trajectory.',
      target: (user ? 'whatif' : 'auth') as AppView,
    },
    {
      icon: Calendar,
      title: t.planners,
      desc: 'Formulate a 10-Year compounding roadmap, compare FY 2025-26 New vs Old Tax Regimes, and structure SIPs for long-term targets.',
      target: 'planners' as AppView,
    },
    {
      icon: BookOpen,
      title: t.termopedia,
      desc: 'Master over 60 essential Indian financial concepts across Tax, Investing, Income, Credit, Business, and Basics with interactive quizzes.',
      target: 'termopedia' as AppView,
    },
    {
      icon: PlayCircle,
      title: t.explainer,
      desc: 'Curated financial education video lessons from RBI, CA Rachana Ranade, Zerodha Varsity, and Pranjal Kamra in English, Hindi & Marathi.',
      target: 'explainer' as AppView,
    },
    {
      icon: ShieldCheck,
      title: t.health,
      desc: 'Conduct a comprehensive assessment of your emergency liquidity, savings propensity, insurance protection, and tax efficiency.',
      target: (user ? 'health' : 'auth') as AppView,
    },
    {
      icon: Sparkles,
      title: t.mentor,
      desc: 'Consult your personalized AI financial mentor tailored to your saved salary, monthly living expenses, and liquid savings corpus.',
      target: (user ? 'mentor' : 'auth') as AppView,
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <FirstPageVideoBackground />
      <div className="relative z-10 max-w-[1300px] mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        {/* Hero Section */}
        <section className="navy-glass-card p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm font-mono tracking-widest uppercase font-semibold text-[#22D3EE]">
                {heroCopy.kicker}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight">
                {heroCopy.title}
              </h1>
              <p className="text-base sm:text-lg text-[#B6C4DD] max-w-2xl leading-relaxed">
                {heroCopy.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(user ? (user.profileCompleted ? 'dashboard' : 'profile') : 'auth')
                  }
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl btn-primary-gradient text-white font-semibold text-sm sm:text-base transition-all cursor-pointer shadow-lg"
                >
                  <span>{heroCopy.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('explainer')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-blue-500/30 bg-[#0A1B38]/80 hover:border-cyan-400/60 text-[#B6C4DD] hover:text-white font-medium text-sm sm:text-base transition-all cursor-pointer backdrop-blur-md"
                >
                  <PlayCircle className="w-4 h-4 text-[#22D3EE]" />
                  <span>{heroCopy.secondaryCta}</span>
                </button>
              </div>
            </div>

            {/* Right Hero Brand Card (CHANGE 2 & CHANGE 3: Spacious logo & languages container) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-lg rounded-3xl p-6 sm:p-9 bg-[#0A1B38]/90 border border-blue-500/35 backdrop-blur-xl flex flex-col items-center text-center space-y-6 shadow-2xl transition-all">
                <div className="w-full py-2 flex items-center justify-center">
                  <BrandLogo size="xl" showText={true} />
                </div>
                <p className="text-xs sm:text-sm text-[#B6C4DD] max-w-sm leading-relaxed">
                  Your financial profile, CTC scenarios, language preference, and theme follow you securely across every session.
                </p>
                <div className="w-full grid grid-cols-3 gap-3.5 pt-4 border-t border-blue-500/25 text-left">
                  <div className="p-3.5 rounded-2xl bg-[#040B1A]/70 border border-blue-500/30 flex flex-col justify-center">
                    <div className="text-xs text-[#8295b5] font-medium">Languages</div>
                    <div className="font-mono font-bold text-sm text-white mt-1">
                      EN · हिं · म
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#040B1A]/70 border border-blue-500/30 flex flex-col justify-center">
                    <div className="text-xs text-[#8295b5] font-medium">Tax Slabs</div>
                    <div className="font-mono font-bold text-sm text-[#22D3EE] mt-1">
                      FY 25–26
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#040B1A]/70 border border-blue-500/30 flex flex-col justify-center">
                    <div className="text-xs text-[#8295b5] font-medium">Terms</div>
                    <div className="font-mono font-bold text-sm text-[#2DD4BF] mt-1">
                      60+ Terms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Modules Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-feature-heading">
                Complete Financial Vision Suite
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Every module adapts automatically to your saved profile and Light/Dark theme preference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => onNavigate(feat.target)}
                  className="navy-glass-card p-6 flex flex-col justify-between hover:border-cyan-400/60 transition-all cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-[#22D3EE] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white group-hover:text-[#22D3EE] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[#B6C4DD] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-blue-500/20 flex items-center justify-between text-xs font-semibold text-[#22D3EE]">
                    <span>Open Module</span>
                    <div className="w-6 h-6 rounded-full border border-cyan-400/40 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

interface AuthViewProps {
  onAuthSuccess: (profileCompleted: boolean) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const { login, signup, sessionExpiredMessage, language } = useAuth();
  const t = getTranslation(language);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [age, setAge] = useState('25');
  const [location, setLocation] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>(language);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState<string | null>(null);

  // Synchronize language selection
  useEffect(() => {
    setPreferredLanguage(language);
  }, [language]);

  const handleFillDemoCredentials = () => {
    setError(null);
    setLoginEmail('demo@dhanadrishti.in');
    setLoginPassword('Demo@123');
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordNotice(t.passwordHelp);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setForgotPasswordNotice(null);

    if (!loginEmail.trim() || !loginPassword) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(loginEmail.trim(), loginPassword);
      onAuthSuccess(loggedInUser.profileCompleted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to log in. Please verify your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const parsedAge = Number(age);
    if (fullName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!Number.isFinite(parsedAge) || parsedAge < 15 || parsedAge > 100) {
      setError('Please enter a valid age between 15 and 100.');
      return;
    }
    if (location.trim().length < 2) {
      setError('Please enter your location (City, State).');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await signup({
        fullName: fullName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
        age: Math.round(parsedAge),
        location: location.trim(),
        preferredLanguage,
      });
      onAuthSuccess(createdUser.profileCompleted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to create account. Your typed inputs are preserved.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 sm:py-16">
      <FirstPageVideoBackground />

      <div className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-6">
        {/* Focused Login & Register Panel */}
        <div className="w-full navy-glass-card p-7 sm:p-9 space-y-6 shadow-2xl">
          {/* Header with Logo and short info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <BrandLogo size="lg" showText={true} />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white pt-1">
              {mode === 'login' ? t.welcomeBack : t.createAccount}
            </h2>
            <p className="text-xs sm:text-sm text-[#B6C4DD] leading-relaxed">
              {mode === 'login'
                ? 'Sign in to access your personalized Indian financial roadmap, tax calculations, and AI mentor.'
                : 'Create your DhanaDrishti account — your financial scenarios stay saved securely.'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#040B1A]/80 border border-blue-500/25">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setForgotPasswordNotice(null);
              }}
              className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[#B6C4DD] hover:text-white'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setForgotPasswordNotice(null);
              }}
              className={`py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-[#B6C4DD] hover:text-white'
              }`}
            >
              {t.signUp}
            </button>
          </div>

              {sessionExpiredMessage && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sessionExpiredMessage}</span>
                </div>
              )}

              {forgotPasswordNotice && (
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-[#22D3EE] text-xs flex items-center gap-2">
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>{forgotPasswordNotice}</span>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1.5">
                      {t.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1.5">
                      {t.passwordLabel}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 placeholder:text-slate-400 text-sm font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Accents & Links Row (Forgot Password & Demo Credentials in bright cyan #22D3EE) */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <button
                      type="button"
                      onClick={handleFillDemoCredentials}
                      className="text-[#22D3EE] hover:underline font-semibold cursor-pointer"
                    >
                      {t.fillDemo}
                    </button>
                    <a
                      href="#forgot-password"
                      onClick={handleForgotPasswordClick}
                      className="text-[#22D3EE] hover:underline font-semibold cursor-pointer"
                    >
                      {t.forgotPassword}
                    </a>
                  </div>

                  {/* Primary Log In Button (Gradient from #2563EB to #2DD4BF) */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl btn-primary-gradient disabled:opacity-60 text-white font-bold text-sm cursor-pointer shadow-lg mt-2"
                  >
                    {isSubmitting ? t.submitting : t.login}
                  </button>

                  <div className="text-center text-xs text-[#B6C4DD] pt-1">
                    Don’t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#22D3EE] hover:underline font-semibold cursor-pointer ml-1"
                    >
                      {t.signUp}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5" noValidate>
                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                      {t.fullNameLabel} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                      {t.emailLabel} *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                      {t.passwordLabel} (min 6 chars) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create strong password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] focus:ring-2 focus:ring-[#22D3EE]/25 placeholder:text-slate-400 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                        {t.ageLabel} *
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="100"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] text-sm font-mono font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                        {t.preferredLanguageLabel}
                      </label>
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value as PreferredLanguage)}
                        className="w-full px-2 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] text-xs font-medium"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">हिन्दी</option>
                        <option value="Marathi">मराठी</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B6C4DD] mb-1">
                      {t.locationLabel} *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Pune, Maharashtra"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:border-[#22D3EE] text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl btn-primary-gradient disabled:opacity-60 text-white font-bold text-sm cursor-pointer shadow-lg mt-2"
                  >
                    {isSubmitting ? t.submitting : t.signUp}
                  </button>

                  <div className="text-center text-xs text-[#B6C4DD] pt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-[#22D3EE] hover:underline font-semibold cursor-pointer ml-1"
                    >
                      {t.login}
                    </button>
                  </div>
                </form>
              )}
        </div>
      </div>
    </div>
  );
};
