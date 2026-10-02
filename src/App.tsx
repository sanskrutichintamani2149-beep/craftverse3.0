/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, FeatureSidebar, Footer, AppView, TermOPediaTab } from './components/Navbar';
import { BrandLogo } from './components/BrandLogo';
import { LandingView, AuthView } from './components/LandingAndAuthViews';
import { ProfileFormPage } from './components/ProfileFormPage';
import { DashboardView, WhatIfView, PlannersView } from './components/DashboardAndSimulators';
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
  'whatif',
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
  }, []);

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
      // Returning user with completed profile goes straight to Dashboard;
      // newly signed-up user (or incomplete profile) goes to Financial Profile form
      if (currentView === 'landing' || currentView === 'auth') {
        setCurrentView(user.profileCompleted ? 'dashboard' : 'profile');
      } else if (!user.profileCompleted && currentView === 'dashboard') {
        setCurrentView('profile');
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
    if (user && !user.profileCompleted && targetView === 'dashboard') {
      setCurrentView('profile');
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
        <FeatureSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

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
          {currentView === 'whatif' && user && <WhatIfView />}
          {currentView === 'planners' && <PlannersView />}
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
        <ScreenshotProtection>
          <AppShell />
        </ScreenshotProtection>
      </AuthProvider>
    </ThemeProvider>
  );
}
