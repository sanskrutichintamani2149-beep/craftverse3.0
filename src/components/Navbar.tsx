import React, { useEffect } from 'react';
import {
  Sun,
  Moon,
  LogOut,
  User,
  Globe,
  ShieldCheck,
  Menu,
  X,
  LayoutDashboard,
  Sliders,
  BookOpen,
  HeartPulse,
  CheckCircle2,
  Sparkles,
  Home,
  PlayCircle,
  FileText,
  Calendar,
  Layers,
  HelpCircle,
  LogIn,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth, PreferredLanguage } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo';
import { getTranslation } from '../config/translations';

export type AppView =
  | 'landing'
  | 'auth'
  | 'profile'
  | 'dashboard'
  | 'termopedia'
  | 'whatif'
  | 'planners'
  | 'explainer'
  | 'docexplainer'
  | 'health'
  | 'mythfact'
  | 'mentor';

export type TermOPediaTab = 'terms' | 'planner' | 'flashcards' | 'quiz';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView, subTab?: TermOPediaTab) => void;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export interface SidebarItem {
  id: AppView;
  subTab?: TermOPediaTab;
  icon: React.ComponentType<{ className?: string }>;
  label: { English: string; Hindi: string; Marathi: string };
}

export const SIDEBAR_NAV_ITEMS: SidebarItem[] = [
  {
    id: 'dashboard',
    icon: LayoutDashboard,
    label: { English: 'Executive Dashboard', Hindi: 'कार्यकारी डैशबोर्ड', Marathi: 'कार्यकारी डॅशबोर्ड' },
  },
  {
    id: 'profile',
    icon: User,
    label: { English: 'Financial Profile', Hindi: 'वित्तीय प्रोफाइल', Marathi: 'आर्थिक प्रोफाइल' },
  },
  {
    id: 'whatif',
    icon: Sliders,
    label: { English: 'What-If Simulator', Hindi: 'What-If सिम्युलेटर', Marathi: 'What-If सिम्युलेटर' },
  },
  {
    id: 'planners',
    icon: Calendar,
    label: { English: '10-Year Roadmap', Hindi: '10-वर्षीय रोडमैप', Marathi: '१०-वर्षीय आराखडा' },
  },
  {
    id: 'termopedia',
    subTab: 'terms',
    icon: BookOpen,
    label: { English: 'Term-O-Pedia Lexicon', Hindi: 'Term-O-Pedia शब्दावली', Marathi: 'Term-O-Pedia शब्दकोश' },
  },
  {
    id: 'termopedia',
    subTab: 'flashcards',
    icon: Layers,
    label: { English: 'Flashcard Decks', Hindi: 'फ्लैशकार्ड अभ्यास', Marathi: 'फ्लॅशकार्ड सराव' },
  },
  {
    id: 'termopedia',
    subTab: 'quiz',
    icon: HelpCircle,
    label: { English: 'Self-Check Quiz', Hindi: 'स्वयं-जांच क्विज़', Marathi: 'मूल्यमापन क्विझ' },
  },
  {
    id: 'explainer',
    icon: PlayCircle,
    label: { English: 'Video Explainers', Hindi: 'वीडियो मार्गदर्शक', Marathi: 'व्हिडिओ मार्गदर्शक' },
  },
  {
    id: 'health',
    icon: HeartPulse,
    label: { English: 'Health Diagnostic', Hindi: 'वित्तीय स्वास्थ्य', Marathi: 'आर्थिक आरोग्य' },
  },
  {
    id: 'mythfact',
    icon: CheckCircle2,
    label: { English: 'Myth vs Fact', Hindi: 'मिथक बनाम तथ्य', Marathi: 'गैरसमज की सत्य' },
  },
  {
    id: 'mentor',
    icon: Sparkles,
    label: { English: 'AI Financial Advisor', Hindi: 'AI वित्तीय सलाहकार', Marathi: 'AI आर्थिक मार्गदर्शक' },
  },
];

export const GUEST_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 'landing',
    icon: Home,
    label: { English: 'Platform Overview', Hindi: 'प्लेटफॉर्म परिचय', Marathi: 'मुख्य पृष्ठ / परिचय' },
  },
  {
    id: 'termopedia',
    subTab: 'terms',
    icon: BookOpen,
    label: { English: 'Term-O-Pedia Lexicon', Hindi: 'Term-O-Pedia शब्दावली', Marathi: 'Term-O-Pedia शब्दकोश' },
  },
  {
    id: 'termopedia',
    subTab: 'flashcards',
    icon: Layers,
    label: { English: 'Flashcard Decks', Hindi: 'फ्लैशकार्ड अभ्यास', Marathi: 'फ्लॅशकार्ड सराव' },
  },
  {
    id: 'termopedia',
    subTab: 'quiz',
    icon: HelpCircle,
    label: { English: 'Self-Check Quiz', Hindi: 'स्वयं-जांच क्विज़', Marathi: 'मूल्यमापन क्विझ' },
  },
  {
    id: 'explainer',
    icon: PlayCircle,
    label: { English: 'Video Explainers', Hindi: 'वीडियो मार्गदर्शक', Marathi: 'व्हिडिओ मार्गदर्शक' },
  },
  {
    id: 'planners',
    icon: Calendar,
    label: { English: '10-Year Roadmap', Hindi: '10-वर्षीय रोडमैप', Marathi: '१०-वर्षीय आराखडा' },
  },
  {
    id: 'mythfact',
    icon: CheckCircle2,
    label: { English: 'Myth vs Fact', Hindi: 'मिथक बनाम तथ्य', Marathi: 'गैरसमज की सत्य' },
  },
  {
    id: 'mentor',
    icon: Sparkles,
    label: { English: 'AI Financial Advisor', Hindi: 'AI वित्तीय सलाहकार', Marathi: 'AI आर्थिक मार्गदर्शक' },
  },
  {
    id: 'auth',
    icon: LogIn,
    label: { English: 'Sign In / Register', Hindi: 'साइन इन / रजिस्टर', Marathi: 'साइन इन / नोंदणी' },
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  mobileMenuOpen = false,
  onToggleMobileMenu,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, language, setLanguage } = useAuth();
  const t = getTranslation(language);

  const handleLogout = async () => {
    await logout();
    onNavigate('auth');
  };

  return (
    <header className="sticky top-0 z-40 w-full theme-glass border-b border-[var(--border-subtle)] transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Mobile & Tablet Slide-in Drawer Button (Visible ONLY after login) */}
          {Boolean(user) && onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-blue-500/30 bg-[#0A1B38]/80 text-white hover:border-cyan-400/60 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          )}

          {/* Official DhanaDrishti Logo */}
          <button
            type="button"
            onClick={() =>
              onNavigate(user ? (user.profileCompleted ? 'dashboard' : 'profile') : 'landing')
            }
            className="cursor-pointer text-left focus:outline-none"
          >
            <BrandLogo size="sm" showText={true} />
          </button>
        </div>

        {/* CHANGE 1: Theme & Language Pills in Header (navy glass pill with a thin blue border) */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-[#0A1B38]/85 text-xs text-white backdrop-blur-md shadow-sm">
            <Globe className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
            <select
              aria-label="Select Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as PreferredLanguage)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-[#0A1B38] text-white">
                English
              </option>
              <option value="Hindi" className="bg-[#0A1B38] text-white">
                हिन्दी
              </option>
              <option value="Marathi" className="bg-[#0A1B38] text-white">
                मराठी
              </option>
            </select>
          </div>

          {/* Theme Toggle Pill */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            title={`Current theme: ${theme === 'dark' ? 'Dark' : 'Light'}. Click to toggle.`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-500/30 bg-[#0A1B38]/85 hover:border-cyan-400/50 text-xs font-medium text-white transition-all cursor-pointer backdrop-blur-md shadow-sm"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span className="hidden sm:inline text-xs font-semibold">{t.dark}</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-xs font-semibold">{t.light}</span>
              </>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  currentView === 'profile'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#0A1B38]/85 text-white border-blue-500/30 hover:border-cyan-400/50'
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span className="max-w-[120px] truncate font-semibold">{user.fullName}</span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                title="Log out safely"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('auth')}
              className="px-4 py-1.5 rounded-full btn-primary-gradient text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md"
            >
              {t.signIn}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

interface FeatureSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView, subTab?: TermOPediaTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const FeatureSidebar: React.FC<FeatureSidebarProps> = ({
  currentView,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, language } = useAuth();
  const t = getTranslation(language);

  // CHANGE 2: Hide the entire left sidebar when logged out (landing, login, signup)
  if (!user) {
    return null;
  }

  const items = SIDEBAR_NAV_ITEMS;

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  const handleSelect = (item: SidebarItem) => {
    onNavigate(item.id, item.subTab);
    onCloseMobile();
  };

  const renderNavList = () => (
    <nav aria-label="Main Features Navigation" className="space-y-1 p-3">
      <div className="px-3 pb-2 text-[11px] font-mono tracking-widest uppercase font-semibold text-[#22D3EE]/80">
        {t.features}
      </div>
      {items.map((item, idx) => {
        const Icon = item.icon;
        const isActive = currentView === item.id && !item.subTab;
        return (
          <button
            key={`${item.id}-${item.subTab || 'main'}-${idx}`}
            type="button"
            onClick={() => handleSelect(item)}
            aria-current={isActive ? 'page' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer text-left border ${
              isActive
                ? 'bg-blue-600/20 text-[#22D3EE] border-cyan-400/40 font-bold shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border-transparent'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${
                isActive ? 'text-[#22D3EE]' : 'text-[var(--text-muted)]'
              }`}
            />
            <span className="truncate">{item.label[language] || item.label.English}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Vertical Sidebar: Scrollable within itself per CHANGE 3 */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col theme-glass border-r border-[var(--border-subtle)] min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 self-start z-20">
        {renderNavList()}
      </aside>

      {/* Mobile & Tablet Slide-In Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Features Menu"
            className="relative z-10 w-72 max-w-[85vw] h-full theme-card border-r border-[var(--border-strong)] flex flex-col justify-between overflow-y-auto shadow-2xl"
          >
            <div>
              <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <BrandLogo size="sm" showText={true} />
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderNavList()}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export const Footer: React.FC<{ onNavigate: (view: AppView) => void }> = ({ onNavigate }) => {
  const { language } = useAuth();
  const t = getTranslation(language);

  return (
    <footer className="mt-16 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-10 transition-colors relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <BrandLogo
            size="sm"
            showText={true}
            subtitle="Empowering Indian households with clarity on CTC, SIPs, Taxes & Long-Term Wealth."
          />
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)]">
          <button
            type="button"
            onClick={() => onNavigate('termopedia')}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            {t.termopedia}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('explainer')}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            {t.explainer}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('planners')}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            {t.planners}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mythfact')}
            className="hover:text-[var(--text-primary)] cursor-pointer"
          >
            {t.mythfact}
          </button>
          <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {t.disclaimerNote} · © {new Date().getFullYear()} DhanaDrishti
          </span>
        </div>
      </div>
    </footer>
  );
};
