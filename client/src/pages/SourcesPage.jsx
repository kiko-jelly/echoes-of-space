import React, { useState, useEffect } from 'react';
import { fetchObjects } from '../services/api';
import ConfidenceBadge from '../components/common/ConfidenceBadge';
import { FileText, ExternalLink, ShieldCheck, Database, CheckCircle2, HelpCircle } from 'lucide-react';
import { useBadges } from '../context/BadgeContext';

export default function SourcesPage() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unlockBadge } = useBadges();

  useEffect(() => {
    fetchObjects()
      .then((data) => {
        setObjects(data);
        setLoading(false);
        unlockBadge('badge-archive-keeper');
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
          <FileText className="w-4 h-4 text-cosmic-cyan" />
          <span>Data Provenance & Verification</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
          Sources & NASA Archives
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Full transparency on every cataloged item, verified coordinates, orbital imaging instruments, and confidence determinations.
        </p>
      </div>

      {/* CONFIRMED vs ESTIMATED Plain Language Guide */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-xl space-y-4">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Understanding Confidence Tags: Confirmed vs Estimated</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-space-950 border border-emerald-500/30">
            <div className="flex items-center gap-2 font-bold text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>CONFIRMED ("We're sure")</span>
            </div>
            <p className="text-slate-300">
              The artifact has been directly photographed in situ by high-resolution modern orbital spacecraft (such as the Lunar Reconnaissance Orbiter Camera down to 25 cm/pixel, or the Mars Reconnaissance Orbiter HiRISE camera). Latitude and longitude are pinpoint accurate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-space-950 border border-amber-500/30">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>ESTIMATED ("Scientists think so")</span>
            </div>
            <p className="text-slate-300">
              Landing telemetry confirmed the spacecraft arrived safely on the surface, but exact sub-meter coordinates have not yet been located or resolved in modern orbital photographic archives. We never invent coordinates to fill gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Per-Object Source Directory Table */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-xl">
        <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-cosmic-cyan" />
          <span>Complete Artifact Sourcing Directory</span>
        </h2>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-slate-400">
            Loading provenance registry...
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto pr-2">
            {objects.map((obj) => (
              <div key={obj.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{obj.name}</span>
                    <ConfidenceBadge confidence={obj.coords_confidence} size="xs" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Mission: {obj.mission_name} · Year: {obj.year_left} · Status: {obj.current_status}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Coords: {obj.latitude != null ? `${obj.latitude}°, ${obj.longitude}°` : 'Estimated / Incomplete'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-cosmic-cyan bg-space-950 px-2 py-1 rounded border border-white/5">
                    {obj.image_credit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Primary NASA Archives Links */}
      <div className="p-6 rounded-2xl glass-panel border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          Independent educational project for the NASA Space Apps Challenge.
          <br />
          Data sourced from public-domain NASA datasets with attribution.
        </div>
        <a
          href="https://images.nasa.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-space-800 text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors border border-white/10 shrink-0"
        >
          <span>NASA Image and Video Library</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
