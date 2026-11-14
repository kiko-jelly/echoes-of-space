import React, { useState, useEffect } from 'react';
import { fetchMissions } from '../services/api';
import { Clock, Calendar, Rocket, CheckCircle2, ArrowRight, Play, Check, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function TimelinePage({ onSelectStory }) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBody, setSelectedBody] = useState('All');
  const [expandedMissionId, setExpandedMissionId] = useState('apollo-11');
  const [animStage, setAnimStage] = useState(1); // 1: Arrived, 2: Worked, 3: Left Behind
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { isStory } = useMode();

  useEffect(() => {
    fetchMissions(selectedBody === 'All' ? null : selectedBody)
      .then((data) => {
        setMissions(data);
        if (data.length > 0 && !data.find(m => m.id === expandedMissionId)) {
          setExpandedMissionId(data[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load missions:', err);
        setLoading(false);
      });
  }, [selectedBody]);

  // Mini animation autoplay cycle
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setAnimStage((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 2400);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeMission = missions.find(m => m.id === expandedMissionId) || missions[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
            <Clock className="w-4 h-4 text-cosmic-cyan" />
            <span>The Last Footprint</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
            Mission Timeline
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isStory
              ? "Follow the journey from humanity's very first soft landing in 1966 all the way to modern robotic rovers on Mars."
              : "Chronological expedition registry detailing launch dates, objectives, and equipment left in situ on extraterrestrial terrain."}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-white/10 self-start md:self-auto">
          {['All', 'Moon', 'Mars'].map((body) => (
            <button
              key={body}
              onClick={() => setSelectedBody(body)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedBody === body
                  ? 'bg-cosmic-blue text-space-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {body === 'Moon' ? '🌕 Moon' : body === 'Mars' ? '🔴 Mars' : 'All Expeditions'}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED MISSION LIFECYCLE ANIMATION: "Arrived → Worked → Left Behind" */}
      {activeMission && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-cosmic-blue/30 bg-gradient-to-b from-space-900 to-space-950 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎬</span>
                <h2 className="font-display font-bold text-lg md:text-xl text-white">
                  Mission Lifecycle: {activeMission.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified factual milestone progression: Arrived → Worked → Left Behind
              </p>
            </div>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cosmic-blue text-space-950 hover:bg-sky-400'
              }`}
            >
              <Play className="w-3 h-3" />
              <span>{isAutoPlaying ? 'Pause Simulation' : 'Play Lifecycle'}</span>
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { num: 1, title: '1. ARRIVED', subtitle: activeMission.landing_date || activeMission.launch_date, icon: '🛬' },
              { num: 2, title: '2. WORKED', subtitle: 'Science Operations', icon: '⚡' },
              { num: 3, title: '3. LEFT BEHIND', subtitle: `${activeMission.objects_left_behind?.length || 0} Artifacts in Situ`, icon: '🛰️' }
            ].map((step) => {
              const isCurrent = animStage === step.num;
              const isPast = animStage > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setAnimStage(step.num);
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-cosmic-blue/20 border-cosmic-cyan text-white shadow-lg shadow-cosmic-cyan/10'
                      : isPast
                      ? 'bg-space-950 border-emerald-500/30 text-emerald-300'
                      : 'bg-space-950/60 border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>{step.icon} {step.title}</span>
                    {isPast && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{step.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Stage Content Reveal Box */}
          <div className="p-6 rounded-2xl bg-space-950/90 border border-white/10 min-h-[140px] flex flex-col justify-between">
            {animStage === 1 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1">
                  Touchdown & Atmospheric Entry
                </div>
                <h3 className="font-display font-bold text-base md:text-lg text-white mb-2">
                  Touchdown: {activeMission.landing_date || activeMission.launch_date}
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                  {isStory
                    ? `After blasting off through Earth's atmosphere, ${activeMission.name} touched down smoothly on the surface to begin humanity's exploration!`
                    : `Spacecraft executed precision descent and landing sequence. Primary objective: ${activeMission.objective}`}
                </p>
              </div>
            )}

            {animStage === 2 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-cosmic-amber mb-1">
                  Active Surface Science
                </div>
                <h3 className="font-display font-bold text-base md:text-lg text-white mb-2">
                  Operations & Mission Execution
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                  {activeMission.outcome}
                </p>
              </div>
            )}

            {animStage === 3 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Permanent Preservation in Situ
                </div>
                <h3 className="font-display font-bold text-base md:text-lg text-white mb-2">
                  Equipment Preserved at Landing Site
                </h3>
                <p className="text-xs md:text-sm text-slate-300 mb-3 leading-relaxed font-light">
                  {isStory
                    ? "When the astronauts zoomed home or power ran out, these brave machines remained behind as permanent space treasures:"
                    : "The following hardware was left in place, contributing to extraterrestrial material culture:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeMission.objects_left_behind?.map((obj) => (
                    <button
                      key={obj.id}
                      onClick={() => onSelectStory(obj.slug)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cosmic-blue/20 hover:bg-cosmic-blue/30 text-cosmic-cyan border border-cosmic-cyan/40 text-xs font-bold transition-all hover:scale-105"
                    >
                      <span>{obj.name}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/5 text-xs text-slate-400">
              <span>Mission: {activeMission.name} ({activeMission.type})</span>
              <span>Step {animStage} of 3</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Chronological List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-slate-400">
          Loading chronological timeline...
        </div>
      ) : (
        <div className="relative border-l-2 border-cosmic-blue/30 ml-4 md:ml-32 space-y-6 pl-6 md:pl-8 py-2">
          {missions.map((m) => {
            const dateStr = m.landing_date || m.launch_date;
            const year = dateStr ? new Date(dateStr).getFullYear() : 'Unknown';
            const isSelected = m.id === expandedMissionId;

            return (
              <div key={m.id} className="relative group">
                {/* Year Marker on Left for Desktop */}
                <div className="hidden md:block absolute -left-36 top-1 text-sm font-bold font-mono text-cosmic-cyan">
                  {year}
                </div>

                {/* Pulsing Node on Timeline */}
                <div
                  className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-space-950 transition-all ${
                    isSelected ? 'bg-cosmic-cyan scale-125' : 'bg-cosmic-blue group-hover:scale-110'
                  }`}
                />

                {/* Mission Card */}
                <div
                  onClick={() => {
                    setExpandedMissionId(m.id);
                    setAnimStage(1);
                  }}
                  className={`glass-panel p-5 md:p-6 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'border-cosmic-cyan/50 bg-space-900/95 shadow-xl shadow-cosmic-cyan/5'
                      : 'border-white/5 hover:border-white/20 bg-space-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-cosmic-amber uppercase">
                      {m.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {m.landing_date ? `Landed: ${m.landing_date}` : `Launched: ${m.launch_date}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-bold text-lg md:text-xl text-white">
                      {m.name}
                    </h3>
                    <span className="text-xs text-cosmic-cyan font-semibold flex items-center gap-1">
                      <span>{isSelected ? 'Selected' : 'Simulate'}</span>
                      {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-2 line-clamp-2">
                    {m.objective}
                  </p>

                  {/* Left Behind Artifacts preview pills */}
                  {m.objects_left_behind && m.objects_left_behind.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Left Behind:</span>
                      {m.objects_left_behind.map((obj) => (
                        <button
                          key={obj.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStory(obj.slug);
                          }}
                          className="px-2 py-0.5 rounded-md bg-space-950 text-cosmic-cyan hover:bg-space-800 text-[11px] font-semibold transition-colors"
                        >
                          {obj.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
