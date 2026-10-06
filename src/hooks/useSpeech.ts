import { useState, useEffect, useRef, useCallback } from 'react';
import { PreferredLanguage } from '../context/AuthContext';

// Global singleton to track active speech synthesis and stop previous playback
let globalActiveUtterance: SpeechSynthesisUtterance | null = null;
let globalActiveStopCallback: (() => void) | null = null;

export const LANGUAGE_LOCALE_MAP: Record<PreferredLanguage, string> = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Marathi: 'mr-IN',
};

// Spoken number parser for English, Hindi, and Marathi
export function parseSpokenNumber(transcript: string): number | null {
  const cleaned = transcript.trim().toLowerCase();

  // Direct digits in text
  const digitMatch = cleaned.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  if (digitMatch) {
    return Number(digitMatch[0]);
  }

  // Common Indian English number words
  const indianScaleMap: Record<string, number> = {
    crore: 10000000,
    crores: 10000000,
    lakh: 100000,
    lakhs: 100000,
    thousand: 1000,
    thousands: 1000,
    hundred: 100,
  };

  // Hindi and Marathi word maps
  const devanagariWordMap: Record<string, number> = {
    // English words
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,

    // Marathi words
    'शून्य': 0, 'एक': 1, 'दोन': 2, 'तीन': 3, 'चार': 4, 'पाच': 5, 'सहा': 6, 'सात': 7, 'आठ': 8, 'नऊ': 9, 'दहा': 10,
    'वीस': 20, 'तीस': 30, 'चाळीस': 40, 'पन्नास': 50, 'साठ': 60, 'सत्तर': 70, 'ऐंशी': 80, 'नव्वद': 90, 'शंभर': 100,
    'हजार': 1000, 'लाख': 100000, 'कोटी': 10000000,

    // Hindi words
    'दो': 2, 'दस': 10, 'बीस': 20, 'पचास': 50, 'सौ': 100,
  };

  let total = 0;
  let currentGroup = 0;
  const words = cleaned.split(/\s+/);

  for (const word of words) {
    if (devanagariWordMap[word] !== undefined) {
      const val = devanagariWordMap[word];
      if (val === 100) {
        currentGroup = (currentGroup || 1) * 100;
      } else if (val === 1000 || val === 100000 || val === 10000000) {
        currentGroup = (currentGroup || 1) * val;
        total += currentGroup;
        currentGroup = 0;
      } else {
        currentGroup += val;
      }
    } else if (indianScaleMap[word]) {
      currentGroup = (currentGroup || 1) * indianScaleMap[word];
      total += currentGroup;
      currentGroup = 0;
    }
  }

  total += currentGroup;
  return total > 0 ? total : null;
}

// Browser Web Speech Recognition Interface
interface IWindowSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

// 1. Hook for Voice Input (Microphone)
export function useVoiceInput({
  language,
  onResult,
  onNumericResult,
}: {
  language: PreferredLanguage;
  onResult: (text: string) => void;
  onNumericResult?: (num: number) => void;
}) {
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<IWindowSpeechRecognition | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(
      // @ts-expect-error browser compatibility
      window.SpeechRecognition || window.webkitSpeechRecognition
    );

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, [isListening]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setMicError(
        language === 'Hindi'
          ? 'आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) समर्थित नहीं है।'
          : language === 'Marathi'
          ? 'तुमच्या ब्राउझरमध्ये आवाज ओळख (Speech Recognition) समर्थित नाही.'
          : 'Voice input is not supported in this browser. Please use Google Chrome or Edge.'
      );
      return;
    }

    setMicError(null);

    // Stop any ongoing speech synthesis when user talks
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      if (globalActiveStopCallback) {
        globalActiveStopCallback();
        globalActiveStopCallback = null;
      }
    }

    try {
      // @ts-expect-error browser speech API
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass() as IWindowSpeechRecognition;

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = LANGUAGE_LOCALE_MAP[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results.length > 0) {
          const spokenText = event.results[0][0]?.transcript || '';
          if (spokenText) {
            onResult(spokenText);
            if (onNumericResult) {
              const parsedNum = parseSpokenNumber(spokenText);
              if (parsedNum !== null) {
                onNumericResult(parsedNum);
              }
            }
          }
        }
      };

      recognition.onerror = (e: { error: string }) => {
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setMicError(
            language === 'Hindi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया माइक्रोफ़ोन की अनुमति दें।'
              : language === 'Marathi'
              ? 'मायक्रोफोन परवानगी नाकारली. कृपया मायक्रोफोन सुरू करा.'
              : 'Microphone permission denied. Please allow microphone access.'
          );
        } else if (e.error !== 'no-speech') {
          setMicError(
            language === 'Hindi'
              ? 'आवाज़ रिकॉर्ड करने में समस्या हुई। कृपया पुनः प्रयास करें।'
              : language === 'Marathi'
              ? 'आवाज नोंदवण्यात त्रुटी आली. कृपया पुन्हा प्रयत्न करा.'
              : 'Could not catch your voice. Please tap the mic and try again.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setMicError('Could not start voice recognition.');
    }
  }, [isSupported, language, onResult, onNumericResult]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    isListening,
    micError,
    isSupported,
    startListening,
    stopListening,
    clearError: () => setMicError(null),
  };
}

// 2. Hook for Voice Output (Listen / Speech Synthesis)
export function useVoiceOutput(language: PreferredLanguage) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (globalActiveUtterance) {
      globalActiveUtterance = null;
    }
    if (globalActiveStopCallback) {
      globalActiveStopCallback();
      globalActiveStopCallback = null;
    }
    setIsPlaying(false);
  }, []);

  // Stop playback when language changes or component unmounts
  useEffect(() => {
    stop();
    return () => {
      stop();
    };
  }, [language, stop]);

  const speak = useCallback(
    (textToRead: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        setVoiceNotice('Text-to-speech is not supported in this browser.');
        return;
      }

      // If already playing this exact text, clicking again stops it
      if (isPlaying) {
        stop();
        return;
      }

      // Stop any other currently playing utterance
      stop();

      // Clean markdown asterisks, hashes, and formatting characters for clean speech
      const cleanText = textToRead
        .replace(/[*#_`~]/g, '')
        .replace(/₹\s*/g, 'Rupees ')
        .replace(/Rs\.?\s*/gi, 'Rupees ')
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLangCode = LANGUAGE_LOCALE_MAP[language] || 'en-IN';
      utterance.lang = targetLangCode;
      utterance.rate = 0.95; // Slightly slower for clear Indian pronunciation

      const voices = window.speechSynthesis.getVoices();
      // Look for specific locale matching voice
      const exactVoice = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === targetLangCode.toLowerCase());
      const langVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode.split('-')[0]));
      // For English, prefer Indian English voice if available
      const indianVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('en-in') ||
          v.name.toLowerCase().includes('india') ||
          v.name.toLowerCase().includes('hindi')
      );

      if (exactVoice) {
        utterance.voice = exactVoice;
      } else if (language === 'English' && indianVoice) {
        utterance.voice = indianVoice;
      } else if (langVoice) {
        utterance.voice = langVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setVoiceNotice(null);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        globalActiveUtterance = null;
        globalActiveStopCallback = null;
      };

      utterance.onerror = (e) => {
        setIsPlaying(false);
        globalActiveUtterance = null;
        globalActiveStopCallback = null;
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          setVoiceNotice('Voice playback encountered an issue.');
        }
      };

      globalActiveUtterance = utterance;
      globalActiveStopCallback = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    },
    [language, isPlaying, stop]
  );

  return {
    isPlaying,
    voiceNotice,
    speak,
    stop,
    clearNotice: () => setVoiceNotice(null),
  };
}
