import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

const DEFAULT_TIPS_STORY = [
  "Hi! I'm Echo! 🚀 Did you know some mirrors left on the Moon still bounce laser beams back to Earth?",
  "Mars is super cold and dusty! Spirit rover once found hot spring minerals by accident!",
  "Tap any card in the archive to flip it and read a secret fun fact!",
  "Astronauts used real duct tape to fix a Moon Buggy fender in 1972!"
];

const DEFAULT_TIPS_EXPLORER = [
  "Echo online. 📡 Laser Ranging Retroreflectors measure the lunar recession rate at 3.8 cm/year.",
  "MRO HiRISE orbital cameras have resolved Apollo descent stages down to 25 cm/pixel resolution.",
  "Check the confidence tags: 'CONFIRMED' items possess independent orbital verification.",
  "Space archaeology examines preserved material culture in extraterrestrial environments."
];

export default function MascotEcho({ onStartMission, customMessage = null }) {
  const { isStory } = useMode();
  const tips = isStory ? DEFAULT_TIPS_STORY : DEFAULT_TIPS_EXPLORER;
  const [tipIndex, setTipIndex] = useState(0);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  const currentSpeech = customMessage || tips[tipIndex];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {isBubbleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="mb-3 max-w-xs md:max-w-sm glass-panel p-4 rounded-2xl border-cosmic-blue/30 shadow-xl relative text-left"
          >
            <button
              onClick={() => setIsBubbleOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cosmic-cyan mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cosmic-amber" />
              <span>Echo the Space Archivist</span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
              {currentSpeech}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-700/60 pt-2.5">
              <button
                onClick={handleNextTip}
                className="text-xs text-cosmic-blue hover:text-cosmic-cyan flex items-center gap-1 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Next tip</span>
              </button>
              {onStartMission && (
                <button
                  onClick={onStartMission}
                  className="px-3 py-1 bg-gradient-to-r from-cosmic-blue to-cosmic-cyan hover:from-sky-400 hover:to-cyan-400 text-space-950 font-bold text-xs rounded-full shadow transition-all duration-150 transform hover:scale-105"
                >
                  Start my mission
                </button>
              )}
            </div>

            {/* Speech bubble arrow pointer */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-space-900 border-b border-r border-cosmic-blue/30 transform rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar */}
      <motion.button
        onClick={() => {
          if (!isBubbleOpen) setIsBubbleOpen(true);
          else handleNextTip();
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group p-1.5 rounded-full bg-space-900/90 border-2 border-cosmic-blue/40 shadow-2xl hover:border-cosmic-cyan transition-colors"
        aria-label="Echo Mascot Guide"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-cosmic-blue/20 blur-md group-hover:bg-cosmic-cyan/30 transition-all pointer-events-none" />

        {/* Original Astronaut Echo SVG Artwork */}
        <svg
          viewBox="0 0 100 100"
          className="w-14 h-14 md:w-16 md:h-16 relative z-10 drop-shadow"
        >
          {/* Antenna */}
          <line x1="50" y1="20" x2="50" y2="8" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="7" r="4.5" fill="#F59E0B" className="animate-pulse" />

          {/* Helmet Outer */}
          <circle cx="50" cy="46" r="32" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
          {/* Helmet Glass Visor */}
          <ellipse cx="50" cy="45" rx="23" ry="18" fill="#0B132B" stroke="#38BDF8" strokeWidth="2" />
          {/* Visor Glint Reflection */}
          <path d="M 36 36 Q 48 30 62 36" stroke="#22D3EE" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
          {/* Friendly Visor Eyes */}
          <circle cx="43" cy="44" r="3" fill="#38BDF8" />
          <circle cx="57" cy="44" r="3" fill="#38BDF8" />
          <ellipse cx="50" cy="51" rx="4" ry="2" fill="#F59E0B" opacity="0.85" />

          {/* Suit Collar & Shoulders */}
          <path d="M 22 75 C 22 66, 34 64, 50 64 C 66 64, 78 66, 78 75 L 82 92 C 82 95, 75 97, 50 97 C 25 97, 18 95, 18 92 Z" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
          {/* Chest Badge with Star */}
          <circle cx="50" cy="78" r="6" fill="#0284C7" />
          <polygon points="50,74 51.5,77 54.5,77.5 52,79.5 53,82.5 50,81 47,82.5 48,79.5 45.5,77.5 48.5,77" fill="#F59E0B" />
        </svg>

        {/* Active Ping Beacon */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cosmic-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-cosmic-blue border-2 border-space-950"></span>
        </span>
      </motion.button>
    </div>
  );
}
