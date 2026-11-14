import React, { useState, useEffect } from 'react';
import { fetchObjects } from '../services/api';
import Card3D from '../components/common/Card3D';
import MascotEcho from '../components/common/MascotEcho';
import { Layers, Search, Filter, ArrowUpDown, X, RotateCcw } from 'lucide-react';
import { useMode } from '../context/ModeContext';

export default function ArchivePage({ onSelectStory }) {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBody, setSelectedBody] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('year-asc');
  const { isStory } = useMode();

  useEffect(() => {
    fetchObjects()
      .then((data) => {
        setObjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load archive objects:', err);
        setLoading(false);
      });
  }, []);

  // Filter & Search Logic
  const filtered = objects.filter((obj) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.kid_summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.fun_fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.mission_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBody = selectedBody === 'All' || obj.celestial_body === selectedBody;
    const matchesCategory = selectedCategory === 'All' || obj.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || obj.current_status === selectedStatus;

    return matchesSearch && matchesBody && matchesCategory && matchesStatus;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'year-asc') return a.year_left - b.year_left;
    if (sortBy === 'year-desc') return b.year_left - a.year_left;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return b.name.localeCompare(a.name);
  });

  const categories = ['All', ...new Set(objects.map((o) => o.category))];
  const statuses = ['All', ...new Set(objects.map((o) => o.current_status))];

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBody('All');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortBy('year-asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
            <Layers className="w-4 h-4 text-cosmic-cyan" />
            <span>The Collection</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
            Artifact Archive
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isStory
              ? "Browse through our collection of rovers, landers, and laser stations left behind in deep space. Click any card to reveal secret facts!"
              : "Comprehensive inventory of human technological material left on lunar and Martian surfaces with physical purpose and orbital coordinates."}
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-space-900/80 px-4 py-2 rounded-xl border border-white/5 font-mono">
          Showing <span className="text-cosmic-cyan font-bold">{sorted.length}</span> of{' '}
          <span className="text-white font-bold">{objects.length}</span> artifacts
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel p-5 rounded-2xl border-white/10 mb-8 space-y-4">
        {/* Search input & Sort */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, mission, fun fact, or keywords..."
              className="w-full pl-10 pr-10 py-2.5 bg-space-950/80 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cosmic-blue focus:ring-1 focus:ring-cosmic-blue"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-3.5 py-2.5 bg-space-950/80 border border-white/10 rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-cosmic-blue"
            >
              <option value="year-asc">Year Left: Oldest First</option>
              <option value="year-desc">Year Left: Newest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-cosmic-cyan" />
              <span>Body:</span>
            </span>
            {['All', 'Moon', 'Mars'].map((body) => (
              <button
                key={body}
                onClick={() => setSelectedBody(body)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedBody === body
                    ? 'bg-cosmic-blue/20 text-cosmic-cyan border border-cosmic-blue/40 shadow'
                    : 'bg-space-950/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {body === 'Moon' ? '🌕 Moon' : body === 'Mars' ? '🔴 Mars' : 'All Worlds'}
              </button>
            ))}
          </div>

          {/* Category & Status dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-space-950/80 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cosmic-blue"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-space-950/80 border border-white/10 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cosmic-blue"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All Statuses' : s}
                </option>
              ))}
            </select>

            {(searchTerm || selectedBody !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of 3D Cards */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-cosmic-cyan border-t-transparent rounded-full animate-spin" />
          <span>Loading catalog entries...</span>
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border-white/10 text-center max-w-lg mx-auto my-12">
          <div className="text-4xl mb-3">📡</div>
          <h3 className="text-lg font-bold text-white font-display mb-1">
            No matching artifacts found
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your search keywords or resetting your filter criteria.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-cosmic-blue text-space-950 font-bold text-xs rounded-xl hover:bg-sky-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((obj) => (
            <Card3D key={obj.id} object={obj} onSelectStory={onSelectStory} />
          ))}
        </div>
      )}

      {/* Mascot Echo Guide */}
      <MascotEcho customMessage="Hover over any card to tilt it in 3D! Click 'Fun Fact' to flip the card and read its secret trivia!" />
    </div>
  );
}
