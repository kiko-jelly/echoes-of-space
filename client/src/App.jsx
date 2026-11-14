import React, { useState } from 'react';
import { ModeProvider } from './context/ModeContext';
import { AudioProvider } from './context/AudioContext';
import { BadgeProvider, useBadges } from './context/BadgeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import BadgeDrawer from './components/common/BadgeDrawer';

import LandingPage from './pages/LandingPage';
import ExplorerPage from './pages/ExplorerPage';
import ArchivePage from './pages/ArchivePage';
import StoryDetailPage from './pages/StoryDetailPage';
import TimelinePage from './pages/TimelinePage';
import ArchaeologyLabPage from './pages/ArchaeologyLabPage';
import QuizPage from './pages/QuizPage';
import SourcesPage from './pages/SourcesPage';
import { Sparkles } from 'lucide-react';

function BadgeUnlockToast() {
  const { recentNotification, clearNotification, setIsDrawerOpen } = useBadges();
  if (!recentNotification) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-bounce cursor-pointer" onClick={() => setIsDrawerOpen(true)}>
      <div className="glass-panel p-4 rounded-2xl border-cosmic-amber/50 bg-space-900/95 shadow-2xl flex items-center gap-3">
        <div className="p-2 bg-cosmic-amber/20 rounded-xl text-cosmic-amber">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-cosmic-amber">
            Achievement Unlocked!
          </div>
          <div className="text-xs font-bold text-white">{recentNotification.name}</div>
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedStorySlug, setSelectedStorySlug] = useState(null);

  const handleSelectStory = (slug) => {
    setSelectedStorySlug(slug);
    setActivePage('story-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans selection:bg-cosmic-blue/30 selection:text-white">
      {/* Navbar with Mode Switcher & Badge Trigger */}
      <Navbar activePage={activePage} setActivePage={handleNavigate} />

      {/* Slide-over Badge Drawer */}
      <BadgeDrawer />

      {/* Achievement Unlocked Toast */}
      <BadgeUnlockToast />

      {/* Page Routing */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage onNavigate={handleNavigate} onSelectStory={handleSelectStory} />
        )}

        {activePage === 'explorer' && (
          <ExplorerPage onSelectStory={handleSelectStory} />
        )}

        {activePage === 'archive' && (
          <ArchivePage onSelectStory={handleSelectStory} />
        )}

        {activePage === 'story-detail' && (
          <StoryDetailPage
            slug={selectedStorySlug || 'apollo-11-descent-stage'}
            onBack={() => handleNavigate('archive')}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'timeline' && (
          <TimelinePage onSelectStory={handleSelectStory} />
        )}

        {activePage === 'lab' && (
          <ArchaeologyLabPage onSelectStory={handleSelectStory} />
        )}

        {activePage === 'quiz' && (
          <QuizPage onSelectStory={handleSelectStory} />
        )}

        {activePage === 'sources' && (
          <SourcesPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ModeProvider>
      <AudioProvider>
        <BadgeProvider>
          <MainApp />
        </BadgeProvider>
      </AudioProvider>
    </ModeProvider>
  );
}
