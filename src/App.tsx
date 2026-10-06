/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PrivacyProvider } from './context/PrivacyContext';
import { Navbar, FeatureSidebar, Footer, AppView, TermOPediaTab } from './components/Navbar';
import { BrandLogo } from './components/BrandLogo';
import { LandingView, AuthView } from './components/LandingAndAuthViews';
import { ProfileFormPage } from './components/ProfileFormPage';
import { DashboardView, PlannersView } from './components/DashboardAndSimulators';
import {
  TermOPediaView,
  ExplainerView,
  HealthAssessmentView,
  MythFactView,
  AIMentorView,
} from './components/KnowledgeAndMentorViews';
import { ScreenshotProtection } from './components/ScreenshotProtection';

const PROTECTED_VIEWS: AppView[] = [
  'profile',
  'dashboard',
  'health',
];

const AppShell: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [termOPediaTab, setTermOPediaTab] = useState<TermOPediaTab>('terms');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const prevUserRef = useRef(user);

  // Support direct route links: /planner, /video-explainers, /flashcards, /quiz
  useEffect(() => {
    const checkRoute = () => {
      if (user && !user.profileCompleted) {
        setCurrentView('profile');
        return;
      }
      const pathOrHash = `${window.location.pathname}${window.location.hash}`.toLowerCase();
      if (pathOrHash.includes('video') || pathOrHash.includes('explainer')) {
        setCurrentView('explainer');
      } else if (pathOrHash.includes('planner') || pathOrHash.includes('roadmap')) {
        setCurrentView('planners');
      } else if (pathOrHash.includes('flashcard')) {
        setTermOPediaTab('flashcards');
        setCurrentView('termopedia');
      } else if (pathOrHash.includes('quiz')) {
        setTermOPediaTab('quiz');
        setCurrentView('termopedia');
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, [user]);

  // CHANGE 8: Redirect to login/auth view upon session logout (including tab-change security logout)
  useEffect(() => {
    if (prevUserRef.current && !user) {
      setCurrentView('auth');
    }
    prevUserRef.current = user;
  }, [user]);

  useEffect(() => {
    if (loading) return;

    if (user) {
      // If user profile is not completed, strictly enforce profile screen
      // and block access to any other feature until questions are submitted
      if (!user.profileCompleted) {
        if (currentView !== 'profile') {
          setCurrentView('profile');
        }
      } else {
        // Returning user with completed profile goes straight to Dashboard
        if (currentView === 'landing' || currentView === 'auth') {
          setCurrentView('dashboard');
        }
      }
    } else {
      // Block protected pages after logout
      if (PROTECTED_VIEWS.includes(currentView)) {
        setCurrentView('auth');
      }
    }
  }, [user, loading, currentView]);

  const handleNavigate = (targetView: AppView, subTab?: TermOPediaTab) => {
    setMobileMenuOpen(false);

    // If user is logged in but hasn't completed Executive Dashboard questions,
    // block access to all other features and keep them on the profile questions screen
    if (user && !user.profileCompleted) {
      setCurrentView('profile');
      return;
    }

    // CHANGE 4: Video explainer opens as an item in the left-side area the same way "Myths & Facts" is opened
    if (targetView === 'explainer') {
      setCurrentView('explainer');
      return;
    }

    // CHANGE 5: 10-Year Roadmap opens as an item in the left-side area
    if (targetView === 'planners') {
      setCurrentView('planners');
      return;
    }

    // CHANGE 6: AI Mentor opens as an item in the left-side area
    if (targetView === 'mentor') {
      setCurrentView('mentor');
      return;
    }

    if (targetView === 'termopedia') {
      setTermOPediaTab(subTab || 'terms');
      setCurrentView('termopedia');
      return;
    }

    if (!user && PROTECTED_VIEWS.includes(targetView)) {
      setCurrentView('auth');
      return;
    }
    setCurrentView(targetView);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
        <div className="theme-card rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
          <BrandLogo size="xl" showText={true} />
          <div className="w-7 h-7 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mt-2" />
          <p className="text-xs text-[var(--text-secondary)]">
            Restoring your DhanaDrishti financial workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />

      <div className="flex-1 flex">
        {Boolean(user) && (
          <FeatureSidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0">
          {currentView === 'landing' && <LandingView onNavigate={handleNavigate} />}
          {currentView === 'auth' && (
            <AuthView
              onAuthSuccess={(profileCompleted) => {
                setCurrentView(profileCompleted ? 'dashboard' : 'profile');
              }}
            />
          )}
          {currentView === 'profile' && user && (
            <ProfileFormPage onSuccessNavigate={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'dashboard' && user && <DashboardView onNavigate={handleNavigate} />}
          {currentView === 'planners' && <PlannersView onNavigate={handleNavigate} />}
          {currentView === 'explainer' && <ExplainerView />}
          {currentView === 'termopedia' && (
            <TermOPediaView
              initialTab={termOPediaTab}
              onTabChange={(tab) => setTermOPediaTab(tab)}
            />
          )}
          {currentView === 'health' && user && <HealthAssessmentView />}
          {currentView === 'mythfact' && <MythFactView />}
          {currentView === 'mentor' && <AIMentorView />}
        </main>
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PrivacyProvider>
          <ScreenshotProtection>
            <AppShell />
          </ScreenshotProtection>
        </PrivacyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
