import React, { useState } from 'react';
import { ImageOff, Sparkles, ExternalLink } from 'lucide-react';

export default function SafeImage({
  src,
  fallbackSrc,
  alt = 'Space Artifact',
  credit = 'NASA Public Domain',
  nasaPageUrl = null,
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden bg-space-950',
  celestialBody = 'Moon',
  showCreditOverlay = true,
}) {
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  // Choose initial source: prefer local_path if provided, else fallbackSrc
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);

  const handleError = () => {
    if (!attemptedFallback && fallbackSrc && activeSrc !== fallbackSrc) {
      setAttemptedFallback(true);
      setActiveSrc(fallbackSrc);
    } else {
      setLoading(false);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setLoading(false);
    setHasError(false);
  };

  return (
    <div className={`relative ${containerClassName} group/safeimg`}>
      {/* Loading Skeleton */}
      {loading && !hasError && (
        <div className="absolute inset-0 bg-space-900 animate-pulse flex flex-col items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-cosmic-cyan/40 border-t-cosmic-cyan animate-spin mb-2" />
          <span className="text-[10px] text-slate-400 font-mono tracking-wider">
            Loading NASA Archive...
          </span>
        </div>
      )}

      {/* Styled Error Fallback Placeholder */}
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-space-900 to-space-950 border border-white/5 rounded-inherit">
          <div className="p-3 rounded-2xl bg-space-800/80 text-cosmic-cyan mb-2 border border-white/5">
            <span className="text-2xl">{celestialBody === 'Mars' ? '🔴' : '🌕'}</span>
          </div>
          <div className="font-display font-bold text-xs text-slate-200 line-clamp-1 max-w-[90%]">
            {alt}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 font-medium mt-1">
            <ImageOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Image Unavailable</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1 max-w-[85%] truncate">
            {credit}
          </div>
        </div>
      ) : (
        /* Image Display */
        <img
          src={activeSrc}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Credit Line Overlay (Always Rendered) */}
      {showCreditOverlay && credit && !hasError && (
        <div className="absolute bottom-1.5 right-1.5 z-20 max-w-[90%]">
          {nasaPageUrl ? (
            <a
              href={nasaPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9px] text-slate-300 hover:text-white bg-black/75 hover:bg-black/90 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 transition-colors truncate"
              title={`View on NASA Image Library: ${credit}`}
            >
              <span className="truncate">{credit}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0 text-cosmic-cyan" />
            </a>
          ) : (
            <div className="text-[9px] text-slate-300 bg-black/75 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 truncate">
              {credit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
