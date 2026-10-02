import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTheme, ThemeMode } from './ThemeContext';

export type PreferredLanguage = 'English' | 'Hindi' | 'Marathi';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  age: number;
  location: string;
  preferredLanguage: PreferredLanguage;
  theme: ThemeMode;
  dreamJob: string;
  annualCtc: number | null;
  monthlyExpenses: number | null;
  currentSavings: number | null;
  monthlyInvestments: number;
  riskAppetite: 'Conservative' | 'Balanced' | 'Aggressive';
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  age: number;
  location: string;
  preferredLanguage: PreferredLanguage;
}

export interface ProfileUpdatePayload {
  fullName?: string;
  age?: number;
  location?: string;
  preferredLanguage?: PreferredLanguage;
  theme?: ThemeMode;
  dreamJob: string;
  annualCtc: number;
  monthlyExpenses: number;
  currentSavings: number;
  monthlyInvestments?: number;
  riskAppetite?: 'Conservative' | 'Balanced' | 'Aggressive';
}

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  sessionExpiredMessage: string | null;
  unsavedDraft: Partial<ProfileUpdatePayload> | null;
  setUnsavedDraft: (draft: Partial<ProfileUpdatePayload> | null) => void;
  language: PreferredLanguage;
  setLanguage: (lang: PreferredLanguage) => void;
  signup: (payload: SignupPayload) => Promise<UserProfile>;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<UserProfile>;
  refreshProfile: () => Promise<UserProfile | null>;
}

const SESSION_TOKEN_KEY = 'dhanadrishti_session_token';
const PREFERRED_LANG_KEY = 'dhanadrishti_preferred_lang';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SESSION_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState<string | null>(null);
  const [unsavedDraft, setUnsavedDraft] = useState<Partial<ProfileUpdatePayload> | null>(null);
  const [language, setLanguageState] = useState<PreferredLanguage>(() => {
    try {
      const saved = localStorage.getItem(PREFERRED_LANG_KEY) as PreferredLanguage;
      if (saved === 'English' || saved === 'Hindi' || saved === 'Marathi') {
        return saved;
      }
    } catch {
      // fallback to English
    }
    return 'English';
  });

  const applyUserPreferences = useCallback(
    (profile: UserProfile) => {
      if (profile.preferredLanguage) {
        setLanguageState(profile.preferredLanguage);
        try {
          localStorage.setItem(PREFERRED_LANG_KEY, profile.preferredLanguage);
        } catch {
          // ignore storage error
        }
      }
      if (profile.theme === 'light' || profile.theme === 'dark') {
        setTheme(profile.theme, false);
      }
    },
    [setTheme]
  );

  const clearClientSessionOnly = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      sessionStorage.clear();
    } catch {
      // ignore storage errors
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    const activeToken = token || localStorage.getItem(SESSION_TOKEN_KEY);
    if (!activeToken) {
      setLoading(false);
      return null;
    }
    try {
      const res = await fetch('/api/profile', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });
      if (res.status === 401) {
        clearClientSessionOnly();
        setSessionExpiredMessage('Your session expired. Please log in again.');
        setLoading(false);
        return null;
      }
      if (!res.ok) {
        setLoading(false);
        return null;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        applyUserPreferences(data.user);
        setLoading(false);
        return data.user;
      }
    } catch {
      // network error during initial check
    }
    setLoading(false);
    return null;
  }, [token, clearClientSessionOnly, applyUserPreferences]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const signup = useCallback(
    async (payload: SignupPayload): Promise<UserProfile> => {
      setSessionExpiredMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          theme,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign up.');
      }
      localStorage.setItem(SESSION_TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      applyUserPreferences(data.user);
      return data.user;
    },
    [theme, applyUserPreferences]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<UserProfile> => {
      setSessionExpiredMessage(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid login credentials.');
      }
      localStorage.setItem(SESSION_TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      applyUserPreferences(data.user);
      return data.user;
    },
    [applyUserPreferences]
  );

  const logout = useCallback(async () => {
    const activeToken = token || localStorage.getItem(SESSION_TOKEN_KEY);
    if (activeToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      } catch {
        // continue client cleanup even if network call fails
      }
    }
    clearClientSessionOnly();
    setUnsavedDraft(null);
    setSessionExpiredMessage(null);
  }, [token, clearClientSessionOnly]);

  const updateProfile = useCallback(
    async (payload: ProfileUpdatePayload): Promise<UserProfile> => {
      const activeToken = token || localStorage.getItem(SESSION_TOKEN_KEY);
      if (!activeToken) {
        setUnsavedDraft(payload);
        setSessionExpiredMessage('Your session expired. Please log in to save your changes.');
        throw new Error('Session expired. Please log in again.');
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.status === 401) {
        setUnsavedDraft(payload);
        clearClientSessionOnly();
        setSessionExpiredMessage('Your session expired while saving. Please log in again — your typed values are preserved.');
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Could not save profile changes.');
      }

      setUser(data.user);
      setUnsavedDraft(null);
      applyUserPreferences(data.user);
      return data.user;
    },
    [token, clearClientSessionOnly, applyUserPreferences]
  );

  const setLanguage = useCallback(
    (lang: PreferredLanguage) => {
      setLanguageState(lang);
      try {
        localStorage.setItem(PREFERRED_LANG_KEY, lang);
      } catch {
        // ignore storage error
      }
      if (user && token) {
        // Persist language change to user profile if profile is already completed
        if (user.profileCompleted && user.annualCtc) {
          fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              preferredLanguage: lang,
              dreamJob: user.dreamJob,
              annualCtc: user.annualCtc,
              monthlyExpenses: user.monthlyExpenses ?? 0,
              currentSavings: user.currentSavings ?? 0,
            }),
          })
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => {
              if (d?.user) setUser(d.user);
            })
            .catch(() => {});
        }
      }
    },
    [user, token]
  );

  /**
   * CHANGE 8: Security - Automatic logout on tab change or window blur.
   *
   * IMPORTANT SECURITY NOTICE:
   * This behaviour applies strictly while a user is logged in (i.e. user && token are present).
   * It uses both the Page Visibility API (document.visibilitychange when document.visibilityState === 'hidden')
   * and window blur to end the current authenticated session via the existing logout() function,
   * clearing token/session/auth state, and triggering a redirect to the login page so the user must log in again.
   *
   * Because it verifies `if (!user || !token) return;`, this automatic logout CANNOT trigger
   * during the normal login or registration flows themselves (for example, if a third-party popup
   * or file dialogue opens before an active authenticated session is established).
   */
  useEffect(() => {
    if (!user || !token) return;

    let blurTimer: number | null = null;

    const performSecurityLogout = () => {
      logout();
      setSessionExpiredMessage(
        language === 'Hindi'
          ? 'सुरक्षा कारणों से टैब बदलने या निष्क्रियता पर सत्र समाप्त कर दिया गया है। कृपया पुनः लॉग इन करें।'
          : language === 'Marathi'
          ? 'सुरक्षेच्या कारणास्तव टॅब बदलल्यामुळे किंवा निष्क्रियतेमुळे सत्र बंद करण्यात आले आहे. कृपया पुन्हा लॉग इन करा.'
          : 'For your security, you were logged out automatically due to switching tabs or window inactivity. Please log in again.'
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        performSecurityLogout();
      }
    };

    const handleWindowBlur = () => {
      // Small debounce to avoid false triggers during momentary internal DOM focus shifts
      blurTimer = window.setTimeout(() => {
        if (document.visibilityState === 'hidden' || !document.hasFocus()) {
          performSecurityLogout();
        }
      }, 350);
    };

    const handleWindowFocus = () => {
      if (blurTimer) {
        window.clearTimeout(blurTimer);
        blurTimer = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (blurTimer) window.clearTimeout(blurTimer);
    };
  }, [user, token, logout, language]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        sessionExpiredMessage,
        unsavedDraft,
        setUnsavedDraft,
        language,
        setLanguage,
        signup,
        login,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
