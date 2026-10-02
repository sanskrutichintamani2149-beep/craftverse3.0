import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../config/translations';

/**
 * CHANGE 9: Screenshot Protection (Best-effort deterrent)
 *
 * NOTE: Modern web browsers cannot fully block OS-level screen grabbers or external camera/device screenshots.
 * Therefore, this serves as an active visual and functional deterrent:
 * - Detects the dedicated PrintScreen key (keydown and keyup).
 * - Detects common screenshot shortcuts: Win + Shift + S, Cmd + Shift + 3 / 4 / 5.
 * - Detects the browser window losing focus or visibility while any modifier key (Shift/Meta/Win/Alt) is pressed.
 * - Clears the clipboard where supported.
 * - Applies CSS filter: blur(24px) to the entire app and presents a clear modal message:
 *   "Screenshots are not allowed on this website."
 * - Restores the view after a short delay (approx. 2.8 seconds) or when focus returns to the window.
 */
export const ScreenshotProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useAuth();
  const t = getTranslation(language);
  const [blocked, setBlocked] = useState(false);
  const modifierDownRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const triggerProtection = () => {
      setBlocked(true);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      // Remove blur and message after a short delay
      timerRef.current = window.setTimeout(() => {
        setBlocked(false);
      }, 2800);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Track modifier keys
      if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Alt' || e.key === 'Control') {
        modifierDownRef.current = true;
      }

      // 1. Dedicated PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        try {
          navigator.clipboard?.writeText('');
        } catch {
          // ignore clipboard permissions errors
        }
        triggerProtection();
        return;
      }

      // 2. Windows Snipping Tool: Win + Shift + S
      if ((e.key === 's' || e.key === 'S') && e.shiftKey && (e.metaKey || e.altKey)) {
        triggerProtection();
        return;
      }

      // 3. MacOS Screenshot shortcuts: Cmd + Shift + 3 / 4 / 5
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        triggerProtection();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        triggerProtection();
      }
      if (!e.shiftKey && !e.metaKey && !e.altKey && !e.ctrlKey) {
        modifierDownRef.current = false;
      }
    };

    // Detect window losing focus while modifier keys or screenshot keys were pressed
    const handleBlur = () => {
      if (modifierDownRef.current) {
        triggerProtection();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && modifierDownRef.current) {
        triggerProtection();
      }
    };

    // When focus returns, dismiss earlier if desired
    const handleFocus = () => {
      modifierDownRef.current = false;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          setBlocked(false);
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <div
        className={`transition-all duration-300 w-full min-h-screen ${
          blocked ? 'filter blur-2xl select-none pointer-events-none' : ''
        }`}
      >
        {children}
      </div>

      {blocked && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200"
        >
          <div className="max-w-md w-full navy-glass-card p-8 border-2 border-cyan-400/50 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center mx-auto text-[#22D3EE]">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">
              Screenshots are not allowed on this website.
            </h2>
            <p className="text-sm text-[#B6C4DD] leading-relaxed">
              {t.screenshotNotice}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setBlocked(false)}
                className="px-6 py-2.5 rounded-xl btn-primary-gradient text-white text-sm font-semibold cursor-pointer shadow-md"
              >
                Continue Working
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
