import React from 'react';
import { ExternalLink, Database, Sparkles, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="mt-20 border-t border-white/10 bg-space-950/90 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Mission statement & non-affiliation */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold font-display text-base mb-2">
              <span>🛰️</span>
              <span>ECHOES OF SPACE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              A digital space museum dedicated to the storytelling and preservation of hardware left by humanity on the Moon and Mars.
            </p>
            <div className="p-3 rounded-xl bg-space-900 border border-white/5 text-[11px] text-slate-400">
              <strong className="text-slate-200">Legal Disclaimer:</strong> Independent project for the NASA Space Apps Challenge. Not affiliated with or endorsed by NASA. No official NASA logo is utilized.
            </div>
          </div>

          {/* Column 2: Data Provenance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cosmic-cyan" />
              <span>Public Domain NASA Data</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://images.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cosmic-cyan flex items-center gap-1 transition-colors"
                >
                  <span>NASA Image and Video Library</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.lroc.asu.edu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cosmic-cyan flex items-center gap-1 transition-colors"
                >
                  <span>LROC (Lunar Reconnaissance Orbiter Camera)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://nssdc.gsfc.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cosmic-cyan flex items-center gap-1 transition-colors"
                >
                  <span>NSSDCA Master Catalog</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://trek.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cosmic-cyan flex items-center gap-1 transition-colors"
                >
                  <span>NASA Moon Trek & Mars Trek Cartography</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cosmic-amber" />
              <span>Exploration Portals</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigate('landing')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Museum Entrance
              </button>
              <button
                onClick={() => onNavigate('explorer')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Planetary Maps
              </button>
              <button
                onClick={() => onNavigate('archive')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Artifact Archive
              </button>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Mission Timeline
              </button>
              <button
                onClick={() => onNavigate('lab')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Archaeology Lab
              </button>
              <button
                onClick={() => onNavigate('quiz')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Discovery Quiz
              </button>
              <button
                onClick={() => onNavigate('sources')}
                className="text-left hover:text-cosmic-cyan transition-colors"
              >
                Data & Verification
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {new Date().getFullYear()} Echoes of Space. Built with passion for space history and education.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Every footprint, mirror, and rover tells a story.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
