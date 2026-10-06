import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface PrivacyContextType {
  privacyMode: boolean;
  togglePrivacyMode: () => void;
  setPrivacyMode: (value: boolean) => void;
}

const STORAGE_KEY = 'dhanadrishti_privacy_mode';

const PrivacyContext = createContext<PrivacyContextType>({
  privacyMode: false,
  togglePrivacyMode: () => {},
  setPrivacyMode: () => {},
});

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [privacyMode, setPrivacyModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(privacyMode));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [privacyMode]);

  const togglePrivacyMode = useCallback(() => {
    setPrivacyModeState((prev) => !prev);
  }, []);

  const setPrivacyMode = useCallback((value: boolean) => {
    setPrivacyModeState(value);
  }, []);

  return (
    <PrivacyContext.Provider value={{ privacyMode, togglePrivacyMode, setPrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = (): PrivacyContextType => {
  return useContext(PrivacyContext);
};
