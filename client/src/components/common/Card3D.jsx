import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import ConfidenceBadge from './ConfidenceBadge';
import SafeImage from './SafeImage';
import { Sparkles, RotateCw, ArrowRight, MapPin, Calendar, Info } from 'lucide-react';

export default function Card3D({ object, onSelectStory }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { isStory } = useMode();

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const statusStyles = {
    'Still in use': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Still operating': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Left behind': 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    'Mission ended': 'bg-slate-700/50 text-slate-300 border-slate-600/40',
    'Crashed/impacted': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'Unknown': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  };

  return (
    <div className="perspective-1000 w-full h-[470px] select-none group">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* FRONT OF CARD */}
        <div className="absolute inset-0 backface-hidden rounded-2xl glass-panel p-5 flex flex-col justify-between border-white/10 group-hover:border-cosmic-blue/40 shadow-xl transition-all duration-300 overflow-hidden bg-space-900/90">
          <div>
            {/* SafeImage Container with Badges */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-space-950 mb-3.5 border border-white/5">
              <SafeImage
                src={object.local_path}
                fallbackSrc={object.image_url}
                alt={object.name}
                credit={object.image_credit}
                nasaPageUrl={object.nasa_page_url}
                celestialBody={object.celestial_body}
                containerClassName="w-full h-full"
                showCreditOverlay={true}
              />

              {/* Status pill & Confidence */}
              <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-20">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${
                    statusStyles[object.current_status] || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {object.current_status}
                </span>
                <ConfidenceBadge confidence={object.coords_confidence} size="xs" />
              </div>

              {/* Body Badge (Moon / Mars) */}
              <div className="absolute top-2.5 right-2.5 z-20">
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    object.celestial_body === 'Moon'
                      ? 'bg-slate-200/90 text-space-950 border-white'
                      : 'bg-orange-500/90 text-white border-orange-400'
                  }`}
                >
                  {object.celestial_body === 'Moon' ? '🌕 Moon' : '🔴 Mars'}
                </span>
              </div>
            </div>

            {/* Title & Category */}
            <div className="flex items-center justify-between text-xs text-cosmic-cyan font-mono mb-1">
              <span>{object.mission_name}</span>
              <span className="text-slate-400">{object.category}</span>
            </div>
            <h3 className="font-display font-bold text-base text-white line-clamp-1 group-hover:text-cosmic-cyan transition-colors">
              {object.name}
            </h3>

            {/* Summary (Story vs Explorer) */}
            <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
              {isStory ? object.kid_summary : object.summary}
            </p>
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            <button
              onClick={handleFlip}
              className="flex items-center gap-1.5 text-xs text-cosmic-amber hover:text-amber-300 font-semibold px-2.5 py-1.5 rounded-lg bg-cosmic-amber/10 hover:bg-cosmic-amber/20 transition-all border border-cosmic-amber/20"
              title="Flip to reveal fun fact"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Fun Fact</span>
            </button>

            <button
              onClick={() => onSelectStory(object.slug)}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-sky-400 hover:to-cyan-400 text-space-950 font-bold px-3 py-1.5 rounded-lg shadow-md hover:shadow-cosmic-cyan/25 transition-all transform hover:scale-102"
            >
              <span>Hear Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BACK OF CARD (Fun Fact & Field Intelligence) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl glass-panel p-6 flex flex-col justify-between border-cosmic-amber/40 shadow-2xl bg-gradient-to-b from-space-900 to-space-950 text-white">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cosmic-amber/20 rounded-lg text-cosmic-amber">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-display font-bold text-sm text-cosmic-amber">
                  Did You Know?
                </h4>
              </div>
              <button
                onClick={handleFlip}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Flip back"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Fun Fact Feature Box */}
            <div className="p-4 rounded-xl bg-cosmic-amber/10 border border-cosmic-amber/20 mb-4 text-xs md:text-sm text-amber-200 leading-relaxed font-medium">
              "{object.fun_fact}"
            </div>

            {/* Scientific Details */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cosmic-cyan shrink-0" />
                <span className="text-slate-400">Year Left:</span>
                <span className="font-semibold text-white">{object.year_left}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cosmic-cyan shrink-0" />
                <span className="text-slate-400">Coordinates:</span>
                <span className="font-mono text-white text-[11px]">
                  {object.latitude != null && object.longitude != null
                    ? `${object.latitude.toFixed(4)}°, ${object.longitude.toFixed(4)}°`
                    : 'Unconfirmed Location'}
                </span>
              </div>
              <div className="flex items-start gap-2 mt-2 pt-2 border-t border-white/5">
                <Info className="w-3.5 h-3.5 text-cosmic-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">Original Mission: </span>
                  <span className="text-slate-200">{object.original_purpose}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Footer Controls */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleFlip}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Card
            </button>
            <button
              onClick={() => onSelectStory(object.slug)}
              className="flex items-center gap-1 text-xs text-cosmic-cyan hover:underline font-semibold"
            >
              <span>Full Narrative</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
