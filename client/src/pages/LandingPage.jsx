import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Layers, ArrowRight, HelpCircle, Shuffle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchStats, fetchRandomObject } from '../services/api';
import Card3D from '../components/common/Card3D';
import MascotEcho from '../components/common/MascotEcho';
import StarfieldCanvas from '../components/common/StarfieldCanvas';
import { useMode } from '../context/ModeContext';

export default function LandingPage({ onNavigate, onSelectStory }) {
  const [stats, setStats] = useState(null);
  const [featuredObject, setFeaturedObject] = useState(null);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(false);
  const { isStory } = useMode();

  useEffect(() => {
    fetchStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats:', err));

    loadRandomFeatured();
  }, []);

  const loadRandomFeatured = () => {
    setIsLoadingFeatured(true);
    fetchRandomObject()
      .then((obj) => setFeaturedObject(obj))
      .catch((err) => console.error('Failed to load random object:', err))
      .finally(() => setIsLoadingFeatured(false));
  };

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden">
      {/* Dynamic Starfield Background */}
      <StarfieldCanvas />

      {/* Floating Mascot Echo */}
      <MascotEcho
        onStartMission={() => onNavigate('explorer')}
        customMessage="Welcome to Echoes of Space! I'm Echo! Come explore the amazing machines humanity left on the Moon and Mars!"
      />

      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-cosmic-cyan/30 text-cosmic-cyan text-xs md:text-sm font-semibold mb-6 shadow-lg shadow-cosmic-cyan/10"
        >
          <Sparkles className="w-4 h-4 text-cosmic-amber animate-spin-slow" />
          <span>NASA Space Apps Challenge: Abandoned but not Forgotten</span>
        </motion.div>

        {/* Main Cinematic Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.08] max-w-5xl"
        >
          They left.{' '}
          <span className="bg-gradient-to-r from-cosmic-blue via-cosmic-cyan to-cosmic-orange bg-clip-text text-transparent">
            Their stories remained.
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-light leading-relaxed"
        >
          {isStory
            ? "Every rover, mirror, and lander resting in the red dust of Mars and silent valleys of the Moon has an incredible adventure to share."
            : "A scientifically verified digital archive exploring material culture and space archaeology on extraterrestrial bodies."}
        </motion.p>

        {/* Action Button Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
        >
          <button
            onClick={() => onNavigate('archive')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-sky-400 hover:to-cyan-400 text-space-950 font-bold text-sm shadow-xl shadow-cosmic-blue/25 transition-all transform hover:scale-105 active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>Explore the Archive</span>
          </button>

          <button
            onClick={() => onNavigate('explorer')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-panel bg-slate-900/80 hover:bg-slate-800 border-white/10 text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>🌕</span>
            <span>Explore the Moon</span>
          </button>

          <button
            onClick={() => onNavigate('explorer')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-panel bg-orange-950/40 hover:bg-orange-900/50 border-orange-500/30 text-orange-200 font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>🔴</span>
            <span>Explore Mars</span>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl glass-panel bg-cosmic-amber/10 hover:bg-cosmic-amber/20 border-cosmic-amber/30 text-amber-300 font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Take the Quiz</span>
          </button>
        </motion.div>
      </section>

      {/* 2. LIVE DATABASE-COMPUTED METRICS SECTION (NEVER HARDCODED) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-2xl border-white/10 text-center">
            <div className="text-3xl md:text-5xl font-display font-extrabold text-white mb-1">
              {stats ? stats.total_objects : '...'}
            </div>
            <div className="text-xs uppercase tracking-wider text-cosmic-cyan font-semibold">
              Artifacts Cataloged
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {stats ? `${stats.moon_objects} Moon · ${stats.mars_objects} Mars` : 'Computing...'}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/10 text-center">
            <div className="text-3xl md:text-5xl font-display font-extrabold text-white mb-1">
              {stats ? stats.total_missions : '...'}
            </div>
            <div className="text-xs uppercase tracking-wider text-cosmic-amber font-semibold">
              Historic Missions
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Apollo, Viking, MER & More</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/10 text-center">
            <div className="text-3xl md:text-5xl font-display font-extrabold text-emerald-400 mb-1">
              {stats ? stats.status_breakdown.still_in_use : '...'}
            </div>
            <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
              Still In Active Use
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Laser Ranging Observatories</div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/10 text-center">
            <div className="text-3xl md:text-5xl font-display font-extrabold text-cosmic-blue mb-1">
              {stats ? stats.verified_coordinates_count : '...'}
            </div>
            <div className="text-xs uppercase tracking-wider text-cosmic-blue font-semibold">
              Verified Surface Sites
            </div>
            <div className="text-[11px] text-slate-400 mt-1">LROC & HiRISE Imagery</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTIFACT & SURPRISE ME */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cosmic-amber" />
              <span>Artifact Spotlight</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white">
              Every Machine Has a Story
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Click the card to reveal its secret fun fact, or tap "Surprise me" to discover another artifact!
            </p>
          </div>

          <button
            onClick={loadRandomFeatured}
            disabled={isLoadingFeatured}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel bg-space-800/80 hover:bg-space-700/80 text-cosmic-cyan border border-cosmic-cyan/30 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 self-start md:self-auto"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isLoadingFeatured ? 'animate-spin' : ''}`} />
            <span>Surprise Me!</span>
          </button>
        </div>

        <div className="max-w-md mx-auto">
          {featuredObject ? (
            <Card3D object={featuredObject} onSelectStory={onSelectStory} />
          ) : (
            <div className="h-[460px] rounded-2xl glass-panel flex items-center justify-center text-slate-400">
              Loading featured artifact...
            </div>
          )}
        </div>
      </section>

      {/* 4. SCIENTIFIC INTEGRITY & HONESTY PROMISE BANNER */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 z-10">
        <div className="p-8 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-space-950 via-space-900 to-space-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Zero Invented Data: Scientific Integrity Guarantee
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Every coordinate, date, mission fact, and image in Echoes of Space comes from primary NASA, NSSDCA, LROC, and PDS archives. Where high-resolution imaging is still pending, we label it clearly.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sources')}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-space-800 hover:bg-space-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Review Source Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
