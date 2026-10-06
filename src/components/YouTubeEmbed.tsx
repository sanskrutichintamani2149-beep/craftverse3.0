import React, { useEffect, useState } from 'react';
import { ExternalLink, PlayCircle, AlertCircle, RefreshCw } from 'lucide-react';

export interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  description: string;
  channel?: string;
  language?: string;
  topic?: string;
  localSrc?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  description,
  channel,
  language,
  topic,
  localSrc,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const cleanVideoId = String(videoId || '').trim();
  const isValidFormat = /^[a-zA-Z0-9_-]{11}$/.test(cleanVideoId);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${cleanVideoId}?rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/watch?v=${cleanVideoId}`;

  useEffect(() => {
    let cancelled = false;
    setHasError(!isValidFormat);
    setIframeLoaded(false);

    if (localSrc) {
      setIsChecking(false);
      return;
    }

    if (!isValidFormat) {
      setIsChecking(false);
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    fetch(`/api/youtube/verify?videoId=${encodeURIComponent(cleanVideoId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data && data.embeddable === false) {
          setHasError(true);
        }
        setIsChecking(false);
      })
      .catch(() => {
        if (!cancelled) {
          setIsChecking(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cleanVideoId, isValidFormat, localSrc]);

  if (localSrc) {
    return (
      <div className="space-y-2">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-subtle)]">
          <video
            src={localSrc}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
            title={title}
          />
        </div>
      </div>
    );
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return (
      <div className="theme-card rounded-2xl p-6 flex flex-col justify-between min-h-[220px]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Offline Mode
            </span>
            {language && <span>{language}</span>}
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Video streaming requires an active internet connection. Definitions, flashcards, and quizzes remain fully functional offline.
          </p>
        </div>
      </div>
    );
  }

  if (hasError || !isValidFormat) {
    return (
      <div className="theme-card rounded-2xl p-6 flex flex-col justify-between min-h-[260px] transition-all">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-500">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Direct YouTube Playback
            </span>
            {language && (
              <span>
                {topic ? `${topic} · ` : ''}
                {language}
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
            {title}
          </h3>
          {channel && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Channel: {channel}
            </p>
          )}
          <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
            {description}
          </p>
        </div>

        <div className="pt-5 mt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Open on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {isValidFormat && (
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIframeLoaded(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Embed
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-[var(--border-subtle)]">
        {(isChecking || !iframeLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-slate-300 text-xs gap-2 z-10 pointer-events-none">
            <div className="w-7 h-7 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span>Loading video player...</span>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIframeLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
      <div className="flex items-center justify-between gap-2 pt-1 text-xs text-[var(--text-muted)]">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
        >
          <span>Watch directly on YouTube</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <button
          type="button"
          onClick={() => setHasError(true)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline cursor-pointer"
          title="Switch to fallback card if video is blocked by your network"
        >
          Video not playing? Show fallback card
        </button>
      </div>
    </div>
  );
};
