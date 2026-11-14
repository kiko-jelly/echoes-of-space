import React, { useState, useEffect } from 'react';
import { fetchObjectBySlug } from '../services/api';
import ConfidenceBadge from '../components/common/ConfidenceBadge';
import SafeImage from '../components/common/SafeImage';
import { useMode } from '../context/ModeContext';
import { useAudio } from '../context/AudioContext';
import { useBadges } from '../context/BadgeContext';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Calendar,
  MapPin,
  Compass,
  CheckCircle2,
  Layers,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const STAGE_LABELS = {
  intro: { number: 1, name: 'The Introduction', icon: '🌌' },
  before: { number: 2, name: 'Before the Mission', icon: '🛠️' },
  journey: { number: 3, name: 'The Journey', icon: '🚀' },
  purpose: { number: 4, name: 'The Purpose', icon: '🔬' },
  final_moment: { number: 5, name: 'The Final Moment', icon: '⏳' },
  after: { number: 6, name: 'After the Mission', icon: '🌙' },
  legacy: { number: 7, name: 'The Legacy', icon: '🏛️' }
};

export default function StoryDetailPage({ slug, onBack, onNavigate }) {
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [voicePerspective, setVoicePerspective] = useState('object'); // 'object' | 'factual'
  const [sliderPosition, setSliderPosition] = useState(50); // For Then & Now slider
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const { isStory } = useMode();
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useAudio();
  const { unlockBadge } = useBadges();

  useEffect(() => {
    setLoading(true);
    fetchObjectBySlug(slug)
      .then((data) => {
        setObject(data);
        setLoading(false);
        unlockBadge('badge-first-step');
      })
      .catch((err) => {
        console.error('Failed to load object story:', err);
        setLoading(false);
      });

    return () => {
      stop();
    };
  }, [slug]);

  const currentStories = object?.stories || [];
  const activeChapter = currentStories[activeStageIndex];

  // Text content for active chapter
  const rawContent = activeChapter
    ? (isStory ? activeChapter.kid_body : activeChapter.body)
    : '';

  // Typewriter effect on chapter change
  useEffect(() => {
    if (!rawContent) return;
    setIsTyping(true);
    let i = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      i += 2;
      setDisplayedText(rawContent.slice(0, i));
      if (i >= rawContent.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [rawContent, activeStageIndex]);

  // Audio speech trigger for current chapter
  const handlePlayAudio = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      const speechPrefix =
        voicePerspective === 'object'
          ? `Speaking as ${object.name}. `
          : `Historical archive narration for ${object.name}. `;
      speak(`${speechPrefix} ${rawContent}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-2 border-cosmic-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white">Retrieving object narrative archives...</h2>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Artifact Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">Could not locate records for this object slug.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-cosmic-blue text-space-950 font-bold text-xs"
        >
          Return to Archive
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-space-900 border border-white/10 hover:border-cosmic-cyan/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-cosmic-cyan">{object.mission_name}</span>
          <ConfidenceBadge confidence={object.coords_confidence} />
        </div>
      </div>

      {/* Main Title & Hero Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 mb-8 relative overflow-hidden bg-space-900/90">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cosmic-amber uppercase tracking-wider mb-2">
              <span>{object.celestial_body === 'Moon' ? '🌕 Lunar Surface' : '🔴 Martian Soil'}</span>
              <span>·</span>
              <span>Left in {object.year_left}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white leading-tight">
              {object.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-3 leading-relaxed">
              {isStory ? object.kid_summary : object.summary}
            </p>

            {/* Quick telemetry badges */}
            <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300 bg-space-950/60 px-2.5 py-1 rounded-lg border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-cosmic-cyan" />
                <span>
                  {object.latitude != null && object.longitude != null
                    ? `${object.latitude.toFixed(4)}°, ${object.longitude.toFixed(4)}°`
                    : 'Unconfirmed site'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 bg-space-950/60 px-2.5 py-1 rounded-lg border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-cosmic-cyan" />
                <span>Status: {object.current_status}</span>
              </div>
            </div>
          </div>

          {/* Large Hero SafeImage */}
          <SafeImage
            src={object.local_path}
            fallbackSrc={object.image_url}
            alt={object.name}
            credit={object.image_credit}
            nasaPageUrl={object.nasa_page_url}
            celestialBody={object.celestial_body}
            containerClassName="relative rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-2xl bg-space-950"
          />
        </div>
      </div>

      {/* SIGNATURE SECTION: "IF OBJECTS COULD TALK" */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-cosmic-blue/30 mb-8 bg-gradient-to-b from-space-900 to-space-950 shadow-2xl">
        {/* Narration Controls & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎙️</span>
              <h2 className="font-display font-bold text-xl md:text-2xl text-white">
                If Objects Could Talk
              </h2>
            </div>
            <p className="text-xs text-cosmic-cyan font-mono mt-0.5">
              Chapter {activeStageIndex + 1} of 7: {STAGE_LABELS[activeChapter?.stage]?.name || 'Story'}
            </p>
          </div>

          {/* Perspective Toggle (Object vs Factual) */}
          <div className="flex items-center gap-2 bg-space-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setVoicePerspective('object')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voicePerspective === 'object'
                  ? 'bg-cosmic-blue text-space-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hear from Object
            </button>
            <button
              onClick={() => setVoicePerspective('factual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                voicePerspective === 'factual'
                  ? 'bg-cosmic-blue text-space-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Factual Narrator
            </button>
          </div>
        </div>

        {/* Mandatory Creative Storytelling Disclaimer Rule */}
        {voicePerspective === 'object' && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Creative storytelling, not a historical statement:</strong> First-person narration is a creative interpretation strictly bounded by confirmed database facts.
            </span>
          </div>
        )}

        {/* 7-Stage Horizontal Stepper */}
        <div className="grid grid-cols-7 gap-1.5 mb-6 overflow-x-auto pb-2">
          {currentStories.map((s, idx) => {
            const meta = STAGE_LABELS[s.stage] || { number: idx + 1, icon: '📍', name: s.stage };
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={s.stage}
                onClick={() => {
                  stop();
                  setActiveStageIndex(idx);
                }}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-cosmic-blue/20 border-cosmic-cyan text-cosmic-cyan shadow-lg shadow-cosmic-cyan/10'
                    : 'bg-space-950/60 border-white/5 text-slate-400 hover:text-white hover:bg-space-800'
                }`}
              >
                <span className="text-base">{meta.icon}</span>
                <span className="text-[10px] font-bold mt-1 line-clamp-1">{meta.name}</span>
              </button>
            );
          })}
        </div>

        {/* Story Text Box with Typewriter Animation */}
        <div className="relative min-h-[140px] p-6 rounded-2xl bg-space-950/90 border border-white/10 mb-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-white mb-2 flex items-center gap-2">
              <span>{STAGE_LABELS[activeChapter?.stage]?.icon}</span>
              <span>{activeChapter?.title}</span>
            </h3>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light">
              {displayedText}
              {isTyping && <span className="animate-pulse text-cosmic-cyan font-bold">|</span>}
            </p>
          </div>

          {/* Narration & Audio Controls */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayAudio}
                disabled={!isSupported}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cosmic-cyan/20 hover:bg-cosmic-cyan/30 text-cosmic-cyan border border-cosmic-cyan/40 text-xs font-bold transition-all"
                title={isSpeaking ? 'Pause speech' : 'Listen with browser voice'}
              >
                {isSpeaking && !isPaused ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </>
                )}
              </button>

              {isSpeaking && (
                <button
                  onClick={stop}
                  className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
                  title="Stop audio playback"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chapter Steppers */}
            <div className="flex items-center gap-2">
              <button
                disabled={activeStageIndex === 0}
                onClick={() => {
                  stop();
                  setActiveStageIndex((prev) => Math.max(0, prev - 1));
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300"
                aria-label="Previous chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400">
                {activeStageIndex + 1} / {currentStories.length}
              </span>
              <button
                disabled={activeStageIndex === currentStories.length - 1}
                onClick={() => {
                  stop();
                  setActiveStageIndex((prev) => Math.min(currentStories.length - 1, prev + 1));
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300"
                aria-label="Next chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* THEN AND NOW INTERACTIVE VISUAL SECTION */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 mb-8 bg-space-900/90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              Then & Now: Visual Evidence
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Compare original mission surface photos with modern high-resolution satellite imagery.
            </p>
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="relative w-full h-80 rounded-2xl overflow-hidden select-none border border-white/10 bg-space-950">
          {/* THEN Image (Full Background) */}
          <img
            src={object.image_url}
            alt="Then: Mission Era Surface"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-black/70 px-2.5 py-1 rounded text-xs font-bold text-cosmic-cyan">
            THEN: Historic Mission View
          </div>

          {/* NOW Image (Clipped Overlay) */}
          <div
            className="absolute inset-0 overflow-hidden border-r-2 border-cosmic-cyan shadow-2xl"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src="https://images-assets.nasa.gov/image/PIA14022/PIA14022~orig.jpg"
              alt="Now: Orbital Reconnaissance Satellite View"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/70 px-2.5 py-1 rounded text-xs font-bold text-emerald-400">
              NOW: Modern Orbital Satellite Map
            </div>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-cosmic-cyan cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-cosmic-cyan text-space-950 flex items-center justify-center shadow-lg font-bold text-xs">
              ↔
            </div>
          </div>

          {/* Invisible Range Input for Dragging */}
          <input
            type="range"
            min="5"
            max="95"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            aria-label="Comparison slider"
          />
        </div>
      </div>

      {/* PRIMARY DATA SOURCES & PROVENANCE */}
      <div className="glass-panel p-6 rounded-3xl border-white/10 bg-space-900/90">
        <h3 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
          <span>📜</span>
          <span>Verified Primary Sources & NASA Archives</span>
        </h3>
        <p className="text-xs text-slate-300 mb-4">
          All factual claims and coordinates for this artifact have been sourced from official NASA documentation:
        </p>

        <div className="space-y-2">
          {(object.sources || []).map((src, i) => (
            <a
              key={i}
              href={src.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-space-950 border border-white/5 hover:border-cosmic-blue/40 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors group"
            >
              <div>
                <span className="font-semibold text-cosmic-cyan group-hover:underline">
                  {src.source_name}
                </span>
                <span className="text-slate-500 ml-2">({src.source_type})</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cosmic-cyan" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
