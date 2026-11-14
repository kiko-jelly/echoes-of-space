import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMode } from '../../context/ModeContext';
import ConfidenceBadge from '../common/ConfidenceBadge';
import { Compass, ZoomIn, ArrowRight, Layers, AlertCircle, Sparkles, Navigation } from 'lucide-react';

// Landing sites coordinates for "Fly To" quick jump controls
const FLY_LOCATIONS = {
  Moon: [
    { name: 'Apollo 11 (Tranquility Base)', lat: 0.67408, lng: 23.47297, zoom: 6 },
    { name: 'Apollo 12 & Surveyor 3 (Ocean of Storms)', lat: -3.0163, lng: -23.4180, zoom: 6 },
    { name: 'Apollo 15 (Hadley Rille)', lat: 26.1322, lng: 3.63386, zoom: 6 },
    { name: 'Apollo 17 (Taurus-Littrow)', lat: 20.1908, lng: 30.7717, zoom: 6 },
  ],
  Mars: [
    { name: 'Viking 1 (Chryse Planitia)', lat: 22.697, lng: -48.222, zoom: 5 },
    { name: 'Mars Pathfinder (Ares Vallis)', lat: 19.33, lng: -33.55, zoom: 5 },
    { name: 'Opportunity (Endeavour Crater)', lat: -1.9462, lng: -5.5266, zoom: 5 }, // 354.47° E == -5.53° W
    { name: 'InSight (Elysium Planitia)', lat: 4.5024, lng: 135.6234, zoom: 5 },
  ]
};

// Map Recenter & FlyTo Helper
function MapFlyController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom pulsing marker icons
const createCustomIcon = (body, status, isSelected) => {
  const isMoon = body === 'Moon';
  const color = isMoon ? '#38BDF8' : '#FB923C';
  const ringColor = isMoon ? 'rgba(56, 189, 248, 0.4)' : 'rgba(251, 146, 60, 0.4)';
  const pulseClass = isSelected ? 'scale-125' : '';

  return L.divIcon({
    className: 'custom-pulsing-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <span style="position: absolute; width: 28px; height: 28px; border-radius: 9999px; background: ${ringColor}; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 18px; height: 18px; border-radius: 9999px; background: ${color}; border: 2.5px solid #030712; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center; color: #030712; font-size: 10px; font-weight: bold;">
          ${isMoon ? '🌕' : '🔴'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export default function PlanetaryMap({ objects, onSelectStory }) {
  const [activeBody, setActiveBody] = useState('Moon');
  const [selectedObject, setSelectedObject] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showUnverifiedTray, setShowUnverifiedTray] = useState(false);
  const { isStory } = useMode();

  // Normalize Mars longitudes to Leaflet standard (-180 to +180)
  const normalizeLng = (lng) => {
    if (lng > 180) return lng - 360;
    return lng;
  };

  const currentObjects = objects.filter(obj => obj.celestial_body === activeBody);
  const verifiedObjects = currentObjects.filter(
    obj => obj.latitude != null && obj.longitude != null && obj.coords_confidence === 'CONFIRMED'
  );
  const unverifiedObjects = currentObjects.filter(
    obj => obj.latitude == null || obj.longitude == null || obj.coords_confidence !== 'CONFIRMED'
  );

  const filteredObjects = categoryFilter === 'All'
    ? verifiedObjects
    : verifiedObjects.filter(obj => obj.category === categoryFilter);

  const categories = ['All', ...new Set(currentObjects.map(o => o.category))];

  // Base map configurations
  // Authentic Moon: NASA LROC WAC Global Mosaic
  // Authentic Mars: NASA Viking/MOLA Global Color Shaded Relief
  const mapConfigs = {
    Moon: {
      center: [0.674, 23.473],
      defaultZoom: 3,
      tileUrl: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303P_100M/1.0.0/default/default028mm/{z}/{y}/{x}.jpg',
      fallbackImage: 'https://images-assets.nasa.gov/image/PIA14022/PIA14022~orig.jpg',
      attribution: 'NASA / GSFC / Arizona State University (LROC WAC Global)'
    },
    Mars: {
      center: [14.0, -35.0],
      defaultZoom: 3,
      tileUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/{z}/{y}/{x}.png',
      fallbackImage: 'https://images-assets.nasa.gov/image/PIA04304/PIA04304~orig.jpg',
      attribution: 'NASA / JPL / USGS (MGS MOLA Mars Global)'
    }
  };

  const activeConfig = mapConfigs[activeBody];

  return (
    <div className="relative w-full h-[680px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Planet Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel bg-space-950/80 border-white/10 shadow-lg pointer-events-auto">
          <button
            onClick={() => {
              setActiveBody('Moon');
              setFlyTarget({ center: [0.674, 23.473], zoom: 3 });
              setSelectedObject(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeBody === 'Moon'
                ? 'bg-slate-200 text-space-950 shadow-md scale-102'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌕</span>
            <span>The Moon</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-space-950/20 text-slate-900 font-mono">
              {objects.filter(o => o.celestial_body === 'Moon').length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveBody('Mars');
              setFlyTarget({ center: [14.0, -35.0], zoom: 3 });
              setSelectedObject(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeBody === 'Mars'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-102'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🔴</span>
            <span>Mars</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/25 text-white font-mono">
              {objects.filter(o => o.celestial_body === 'Mars').length}
            </span>
          </button>
        </div>

        {/* Quick Fly-To Historic Sites Dropdown / Pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl glass-panel bg-space-950/80 border-white/10 pointer-events-auto">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-semibold">
            <Navigation className="w-3 h-3 text-cosmic-cyan" />
            <span>Fly To:</span>
          </span>
          {FLY_LOCATIONS[activeBody].map((site) => (
            <button
              key={site.name}
              onClick={() => {
                setFlyTarget({ center: [site.lat, site.lng], zoom: site.zoom });
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {site.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel bg-space-950/80 border-white/10 pointer-events-auto">
          <span className="text-xs text-slate-400 px-2 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cosmic-cyan" />
            <span className="hidden sm:inline">Filter:</span>
          </span>
          {categories.slice(0, 4).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
                categoryFilter === cat
                  ? 'bg-cosmic-blue/30 text-cosmic-cyan border border-cosmic-blue/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Leaflet Map View */}
      <div className="w-full flex-1 relative">
        <MapContainer
          key={activeBody}
          center={activeConfig.center}
          zoom={activeConfig.defaultZoom}
          minZoom={2}
          maxZoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {flyTarget && (
            <MapFlyController center={flyTarget.center} zoom={flyTarget.zoom} />
          )}

          {/* NASA Trek Tiles with authentic planetary projection */}
          <TileLayer
            url={activeConfig.tileUrl}
            attribution={activeConfig.attribution}
            noWrap={true}
            bounds={[[-90, -180], [90, 180]]}
          />

          {/* Verified Markers */}
          {filteredObjects.map((obj) => {
            const lat = obj.latitude;
            const lng = normalizeLng(obj.longitude);
            const isSelected = selectedObject?.id === obj.id;

            return (
              <Marker
                key={obj.id}
                position={[lat, lng]}
                icon={createCustomIcon(obj.celestial_body, obj.current_status, isSelected)}
                eventHandlers={{
                  click: () => setSelectedObject(obj),
                }}
              >
                <Popup>
                  <div className="p-1 max-w-xs text-left">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-cosmic-cyan uppercase font-mono">
                        {obj.mission_name}
                      </span>
                      <ConfidenceBadge confidence={obj.coords_confidence} size="xs" />
                    </div>
                    <h4 className="font-bold text-sm text-white font-display mb-1">
                      {obj.name}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mb-2">
                      {isStory ? obj.kid_summary : obj.summary}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/10 pt-1.5 mb-2">
                      <span>Coords:</span>
                      <span>
                        {lat.toFixed(4)}°, {lng.toFixed(4)}°
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectStory(obj.slug)}
                      className="w-full py-1.5 bg-cosmic-blue hover:bg-sky-400 text-space-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Hear the Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Projection Disclaimer Banner */}
      <div className="absolute bottom-3 left-4 z-[400] text-[11px] text-slate-400 bg-space-950/90 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-2 max-w-md">
        <Sparkles className="w-3.5 h-3.5 text-cosmic-cyan shrink-0" />
        <span>
          Authentic {activeBody} map: {activeConfig.attribution} (Equirectangular Projection)
        </span>
      </div>

      {/* Location Unknown / Unverified Drawer Trigger */}
      {unverifiedObjects.length > 0 && (
        <div className="absolute bottom-3 right-4 z-[400]">
          <button
            onClick={() => setShowUnverifiedTray(!showUnverifiedTray)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-950/90 text-amber-300 border border-amber-500/40 text-xs font-semibold shadow-lg hover:bg-space-900 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              {unverifiedObjects.length} Unverified Site{unverifiedObjects.length > 1 ? 's' : ''}
            </span>
          </button>
        </div>
      )}

      {/* Unverified Objects Tray Drawer */}
      {showUnverifiedTray && (
        <div className="absolute bottom-14 right-4 z-[450] w-80 glass-panel bg-space-900/95 border border-amber-500/30 rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <AlertCircle className="w-4 h-4" />
              <span>Location Unverified Tray</span>
            </div>
            <button
              onClick={() => setShowUnverifiedTray(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-slate-300 mb-3">
            In keeping with strict scientific integrity, these objects landed safely on the surface, but high-resolution sub-meter orbital photos have not yet verified pinpoint coordinates:
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {unverifiedObjects.map((obj) => (
              <div
                key={obj.id}
                className="p-2.5 rounded-xl bg-space-950 border border-white/5 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{obj.name}</div>
                  <div className="text-[10px] text-slate-400">{obj.mission_name}</div>
                </div>
                <button
                  onClick={() => onSelectStory(obj.slug)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-medium transition-colors"
                >
                  Story
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
