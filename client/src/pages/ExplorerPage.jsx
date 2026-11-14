import React, { useState, useEffect } from 'react';
import { fetchObjects } from '../services/api';
import PlanetaryMap from '../components/map/PlanetaryMap';
import MascotEcho from '../components/common/MascotEcho';
import { Compass, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function ExplorerPage({ onSelectStory }) {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isStory } = useMode();

  useEffect(() => {
    fetchObjects()
      .then((data) => {
        setObjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load explorer objects:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title & Context Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
            <Compass className="w-4 h-4 text-cosmic-cyan" />
            <span>Planetary Explorer</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
            Where Are They Now?
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isStory
              ? "Hop aboard our orbital satellite! Switch between the Moon and Mars to see where humanity's historic landers, buggies, and mirrors are resting today."
              : "High-resolution orbital cartography tracking artifact sites across the lunar and Martian surfaces. Coordinates verified by LROC and HiRISE."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-space-900/80 px-3.5 py-2 rounded-xl border border-white/5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Pulsing markers denote sub-meter confirmed sites</span>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      {loading ? (
        <div className="w-full h-[680px] rounded-3xl glass-panel flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-cosmic-cyan border-t-transparent rounded-full animate-spin" />
          <span>Calibrating orbital planetary telemetry...</span>
        </div>
      ) : (
        <PlanetaryMap objects={objects} onSelectStory={onSelectStory} />
      )}

      {/* Mascot Echo Guide */}
      <MascotEcho
        customMessage="Tap any glowing marker on the planet to see what landed there! Or try the 'Fly To' buttons to zoom straight to Apollo 11 or Viking 1!"
      />
    </div>
  );
}
