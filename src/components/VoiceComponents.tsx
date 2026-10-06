import React from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { PreferredLanguage } from '../context/AuthContext';
import { useVoiceInput, useVoiceOutput } from '../hooks/useSpeech';

interface MicButtonProps {
  language: PreferredLanguage;
  onTranscript: (text: string) => void;
  onNumericValue?: (num: number) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({
  language,
  onTranscript,
  onNumericValue,
  disabled = false,
  className = '',
}) => {
  const { isListening, micError, startListening, stopListening, clearError } = useVoiceInput({
    language,
    onResult: onTranscript,
    onNumericResult: onNumericValue,
  });

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        title={
          isListening
            ? language === 'Hindi'
              ? 'सुनना बंद करें'
              : language === 'Marathi'
              ? 'ऐकणे थांबवा'
              : 'Stop listening'
            : language === 'Hindi'
            ? 'बोलकर दर्ज करें (माइक्रोफ़ोन)'
            : language === 'Marathi'
            ? 'बोलून नोंदवा (मायक्रोफोन)'
            : 'Speak input (Microphone)'
        }
        className={`relative p-2 rounded-xl transition-all duration-200 cursor-pointer ${
          isListening
            ? 'bg-rose-500 text-white shadow-md animate-pulse ring-2 ring-rose-400/50'
            : 'bg-[var(--bg-secondary)] hover:bg-emerald-500/10 text-[var(--text-secondary)] hover:text-emerald-500 border border-[var(--border-subtle)]'
        } ${className}`}
        aria-label="Voice input"
      >
        {isListening ? (
          <>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
            <MicOff className="w-4 h-4" />
          </>
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating Listening Indicator */}
      {isListening && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 text-white text-xs rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5 z-20 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {language === 'Hindi'
              ? 'सुन रहा हूँ...'
              : language === 'Marathi'
              ? 'ऐकत आहे...'
              : 'Listening...'}
          </span>
        </div>
      )}

      {/* Mic Error Notice */}
      {micError && (
        <div
          role="alert"
          onClick={clearError}
          className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 max-w-xs p-2.5 bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs rounded-xl shadow-xl z-30 cursor-pointer"
        >
          {micError}
        </div>
      )}
    </div>
  );
};

interface ListenButtonProps {
  textToSpeak?: string;
  text?: string;
  language: PreferredLanguage;
  label?: string;
  className?: string;
}

export const ListenButton: React.FC<ListenButtonProps> = ({
  textToSpeak,
  text,
  language,
  className = '',
}) => {
  const speechContent = textToSpeak || text || '';
  const { isPlaying, voiceNotice, speak, stop, clearNotice } = useVoiceOutput(language);

  const buttonLabel = isPlaying
    ? language === 'Hindi'
      ? 'रोकें'
      : language === 'Marathi'
      ? 'थांबवा'
      : 'Stop'
    : language === 'Hindi'
    ? 'सुनें'
    : language === 'Marathi'
    ? 'ऐका'
    : 'Listen';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => {
          if (isPlaying) {
            stop();
          } else {
            speak(speechContent);
          }
        }}
        title={isPlaying ? 'Stop speaking' : 'Listen aloud'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isPlaying
            ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40'
            : 'bg-[var(--bg-card)] hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
        } ${className}`}
        aria-label={isPlaying ? 'Stop listening' : 'Listen aloud'}
      >
        {isPlaying ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <VolumeX className="w-3.5 h-3.5 shrink-0" />
          </>
        ) : (
          <Volume2 className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{buttonLabel}</span>
      </button>

      {voiceNotice && (
        <div
          role="alert"
          onClick={clearNotice}
          className="absolute top-full mt-1.5 left-0 p-2 bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs rounded-lg shadow-lg z-30 cursor-pointer whitespace-nowrap"
        >
          {voiceNotice}
        </div>
      )}
    </div>
  );
};
