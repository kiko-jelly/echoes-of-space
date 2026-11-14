import React, { useState } from 'react';
import { useMode } from '../../context/ModeContext';
import { useBadges } from '../../context/BadgeContext';
import { Compass, Sparkles, BookOpen, Layers, Clock, HelpCircle, FileText, Menu, X, Award } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { mode, toggleMode, isStory } = useMode();
  const { badges, unlockedIds, setIsDrawerOpen } = useBadges();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'explorer', label: 'Moon & Mars Map', icon: Compass },
    { id: 'archive', label: 'Archive', icon: Layers },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'lab', label: 'Archaeology Lab', icon: BookOpen },
    { id: 'quiz', label: 'Quiz & Games', icon: HelpCircle },
    { id: 'sources', label: 'Sources', icon: FileText },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cosmic-blue to-cosmic-cyan flex items-center justify-center p-0.5 shadow-lg shadow-cosmic-blue/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
              <span className="text-xl">🛰️</span>
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-base md:text-lg tracking-wide bg-gradient-to-r from-white via-slate-100 to-cosmic-cyan bg-clip-text text-transparent">
              ECHOES OF SPACE
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block tracking-tight font-medium">
              Every object left behind has a story to tell
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cosmic-blue/20 text-cosmic-cyan border border-cosmic-cyan/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Mode Switcher & Badges */}
        <div className="flex items-center gap-2.5">
          {/* Mode Switcher Pill */}
          <button
            onClick={toggleMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border shadow-sm cursor-pointer hover:scale-105 active:scale-95"
            style={{
              backgroundColor: isStory ? 'rgba(251, 146, 60, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              borderColor: isStory ? 'rgba(251, 146, 60, 0.4)' : 'rgba(56, 189, 248, 0.4)',
              color: isStory ? '#FDBA74' : '#7DD3FC'
            }}
            title={isStory ? 'Story Mode: Simple words, fun facts' : 'Explorer Mode: Deep scientific data'}
          >
            <span className="text-sm">{isStory ? '🧒' : '🔬'}</span>
            <span className="hidden sm:inline">
              {isStory ? 'Story Mode' : 'Explorer Mode'}
            </span>
          </button>

          {/* Badges Drawer Trigger */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-space-800/80 hover:bg-space-700/80 text-cosmic-amber border border-cosmic-amber/30 text-xs font-semibold shadow transition-all hover:scale-105"
            title="View unlocked achievement badges"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="tabular-nums">
              {unlockedIds.length}/{badges.length}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-1 bg-space-950/95 border-b border-white/10 backdrop-blur-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-cosmic-blue/20 text-cosmic-cyan border border-cosmic-cyan/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
