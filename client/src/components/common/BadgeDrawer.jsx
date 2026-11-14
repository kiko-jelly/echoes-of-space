import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Footprints, Moon, Compass, Sparkles, ShieldCheck, Lock } from 'lucide-react';
import { useBadges } from '../../context/BadgeContext';

const ICON_MAP = {
  Footprints,
  Moon,
  Compass,
  Award,
  Sparkles,
  ShieldCheck
};

export default function BadgeDrawer() {
  const { badges, unlockedIds, isDrawerOpen, setIsDrawerOpen } = useBadges();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-space-900 border-l border-white/10 shadow-2xl p-6 flex flex-col h-full z-10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-cosmic-amber/20 rounded-xl text-cosmic-amber">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Explorer Badges</h2>
                  <p className="text-xs text-slate-400">
                    Unlocked {unlockedIds.length} of {badges.length} badges
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close badges drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {badges.map((badge) => {
                const isUnlocked = unlockedIds.includes(badge.id);
                const IconComponent = ICON_MAP[badge.icon] || Award;

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-space-800/80 border-cosmic-cyan/40 shadow-lg shadow-cosmic-cyan/5'
                        : 'bg-space-950/40 border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`p-3 rounded-xl shrink-0 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-cosmic-blue/20 to-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/40 shadow-inner'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isUnlocked ? (
                          <IconComponent className="w-6 h-6" />
                        ) : (
                          <Lock className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className={`font-semibold text-sm ${
                              isUnlocked ? 'text-white' : 'text-slate-400'
                            }`}
                          >
                            {badge.name}
                          </h3>
                          {isUnlocked ? (
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Unlocked
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer tip */}
            <div className="border-t border-white/10 pt-4 text-xs text-slate-400 text-center">
              Complete missions, explore sites, and take the quiz to collect all badges!
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
