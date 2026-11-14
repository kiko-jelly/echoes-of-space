import React, { useState, useEffect } from 'react';
import { fetchObjects } from '../services/api';
import SafeImage from '../components/common/SafeImage';
import { BookOpen, Sparkles, Scale, Vote, ArrowRight, ShieldCheck, HelpCircle, Weight, Flame, ShieldAlert, Check } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { useBadges } from '../context/BadgeContext';

const LESSONS = [
  {
    id: 'what-is-space-archaeology',
    title: 'What is Space Archaeology?',
    kid_title: 'Space Detectives: What is Space Archaeology?',
    icon: '🔍',
    summary: 'Space archaeology applies archaeological methods to human material culture in outer space. Rather than digging in ancient Roman ruins, space archaeologists study bootprints, lander legs, rover tire tracks, and scientific stations left on the Moon and Mars.',
    kid_summary: 'Imagine being a space detective! Instead of digging up dinosaur bones on Earth, space archaeologists study the footprints, lunar cars, and robot landers left behind on other planets.'
  },
  {
    id: 'why-things-stay-behind',
    title: 'The Tsiolkovsky Rocket Equation & Mass Penalty',
    kid_title: 'Why Can\'t We Just Bring Everything Back?',
    icon: '⚖️',
    summary: 'Every kilogram hauled back off the lunar surface requires exponentially more fuel during liftoff and Earth re-entry. Leaving descent stages, rovers, and experiments in situ was an indispensable mathematical requirement for human survival.',
    kid_summary: 'Rocket fuel is super heavy! If astronauts tried to bring their heavy cars and landing legs back home, the spaceship would be too heavy to fly into space and escape the Moon!'
  },
  {
    id: 'planetary-protection',
    title: 'Planetary Protection & Microbial Quarantine',
    kid_title: 'Keeping Alien Worlds Clean',
    icon: '🛡️',
    summary: 'NASA Office of Planetary Protection enforces strict sterilization protocols under the 1967 Outer Space Treaty to prevent forward contamination of Mars or false biosignature detection.',
    kid_summary: 'We must never sneeze on Mars! Spacecraft are cleaned in ultra-clean rooms with heat and alcohol so no Earth germs or bacteria hitchhike to Mars.'
  },
  {
    id: 'moon-vs-mars',
    title: 'Moon vs Mars: Environmental Preservation',
    kid_title: 'Moon Dust vs Mars Winds: How Artifacts Age',
    icon: '🪐',
    summary: 'The Moon has no atmosphere, meaning no wind, rain, or oxygen. Metal does not rust, and footprints can last millions of years until micrometeoroids slowly erode them. Mars has wind, dust storms, and thin carbon dioxide air that can bury rovers in red dust over decades.',
    kid_summary: 'On the Moon, there is no rain or wind at all, so footprints stay forever! On Mars, windy red dust storms blow across the desert and can bury a rover\'s solar panels in dust!'
  },
  {
    id: 'preserving-historic-sites',
    title: 'Historic Preservation: UNESCO for the Solar System',
    kid_title: 'Protecting the First Footsteps Forever',
    icon: '🏛️',
    summary: 'NASA established recommendation guidelines (e.g., a 2-kilometer no-fly buffer zone around Tranquility Base) to protect humanity\'s first footprint from rocket plume sandblasting.',
    kid_summary: 'One day tourists will travel to space! NASA has created invisible fences around Apollo 11 so visitors don\'t accidentally kick dust onto Neil Armstrong\'s historic footprints.'
  }
];

// Interactive items for the "Why Can't We Bring It Back?" reveal activity
const RETURN_CHALLENGES = [
  {
    id: 'fuel',
    title: 'Fuel Multiplier (The Tyranny of the Rocket Equation)',
    kid_title: 'The Heavy Fuel Mystery',
    icon: '⛽',
    weight: '+5,000 kg fuel needed for every 100 kg brought home',
    reveal: 'To lift a 210 kg Lunar Rover off the Moon, the ascent module would need an extra rocket engine and hundreds of liters of hypergolic propellant—which itself would have required an impossibly massive Saturn V rocket at launch on Earth.',
    kid_reveal: 'To bring the Moon Buggy home, astronauts would need a fuel tank as big as a school bus! But lifting that extra fuel from Earth was impossible!'
  },
  {
    id: 'heat',
    title: 'Atmospheric Re-entry Fire',
    kid_title: 'The Fiery Earth Shield',
    icon: '🔥',
    weight: '3,000°C re-entry plasma temperatures',
    reveal: 'The Apollo command module had a heat shield sized strictly for the 3 astronauts and moon rocks. Hauling bulky landers back into Earth\'s atmosphere at 40,000 km/h would have incinerated the capsule.',
    kid_reveal: 'Spaceships hit Earth\'s air so fast that the outside glows orange-hot like molten lava! Only tiny spacecraft with special heat shields can survive without burning up.'
  },
  {
    id: 'science',
    title: 'Leaving Them Doing Science',
    kid_title: 'Still Doing Science Today!',
    icon: '🔭',
    weight: '55+ years of active continuous research',
    reveal: 'Leaving the laser retroreflectors, ALSEP transmitters, and weather stations in situ allowed them to gather data for decades after crews returned home safely.',
    kid_reveal: 'The mirrors left on the Moon were supposed to stay there! They are still doing homework and shooting laser flashes with scientists today!'
  }
];

export default function ArchaeologyLabPage({ onSelectStory }) {
  const [objects, setObjects] = useState([]);
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [userVote, setUserVote] = useState(() => localStorage.getItem('echoes_lab_vote') || null);
  const [revealedChallenge, setRevealedChallenge] = useState('fuel');

  const { isStory } = useMode();
  const { unlockBadge } = useBadges();

  useEffect(() => {
    fetchObjects()
      .then((data) => {
        setObjects(data);
        if (data.length >= 4) {
          setCompareA(data[0]); // Apollo 11
          setCompareB(data[3]); // Apollo 15 Rover
        }
        unlockBadge('badge-archaeologist');
      })
      .catch((err) => console.error(err));
  }, []);

  const handleVote = (choice) => {
    setUserVote(choice);
    localStorage.setItem('echoes_lab_vote', choice);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
          <BookOpen className="w-4 h-4 text-cosmic-cyan" />
          <span>Interactive Science Lab</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
          Space Archaeology Lab
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          {isStory
            ? "Discover why machines stay behind in space, how we protect historic moon footprints, and compare incredible space machines side by side!"
            : "Explore the preservation, ethical debates, orbital physics, and planetary protection guidelines governing cultural heritage sites off Earth."}
        </p>
      </div>

      {/* 1. LESSON MODULE CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {LESSONS.map((lesson) => {
          const isSelected = activeLesson.id === lesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'glass-panel bg-cosmic-blue/15 border-cosmic-cyan shadow-lg shadow-cosmic-cyan/10'
                  : 'glass-panel bg-space-900/60 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-2xl mb-1.5">{lesson.icon}</div>
              <h3 className="font-display font-bold text-xs md:text-sm text-white line-clamp-2">
                {isStory ? lesson.kid_title : lesson.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Detail View */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{activeLesson.icon}</span>
          <h2 className="font-display font-bold text-xl md:text-2xl text-white">
            {isStory ? activeLesson.kid_title : activeLesson.title}
          </h2>
        </div>
        <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light">
          {isStory ? activeLesson.kid_summary : activeLesson.summary}
        </p>
      </div>

      {/* 2. "WHY CAN'T WE JUST BRING IT ALL BACK?" INTERACTIVE REVEAL ACTIVITY */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-cosmic-blue/30 bg-gradient-to-b from-space-900 to-space-950 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Weight className="w-5 h-5 text-cosmic-cyan" />
          <h3 className="font-display font-bold text-xl text-white">
            Activity: "Why Can't We Just Bring It All Back?"
          </h3>
        </div>
        <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
          Tap each critical challenge below to reveal why physics, heat, and science required leaving equipment on the Moon and Mars:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {RETURN_CHALLENGES.map((challenge) => {
            const isSelected = revealedChallenge === challenge.id;
            return (
              <button
                key={challenge.id}
                onClick={() => setRevealedChallenge(challenge.id)}
                className={`p-5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-cosmic-blue/20 border-cosmic-cyan text-white shadow-lg'
                    : 'bg-space-950/80 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-2">{challenge.icon}</div>
                <h4 className="font-display font-bold text-sm text-white mb-1">
                  {isStory ? challenge.kid_title : challenge.title}
                </h4>
                <div className="text-[11px] font-mono text-cosmic-amber">{challenge.weight}</div>
              </button>
            );
          })}
        </div>

        {/* Revealed Explanation Box */}
        {(() => {
          const active = RETURN_CHALLENGES.find((c) => c.id === revealedChallenge);
          if (!active) return null;
          return (
            <div className="p-6 rounded-2xl bg-space-950 border border-white/10 animate-fade-in">
              <div className="text-xs font-bold uppercase text-cosmic-cyan mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cosmic-amber" />
                <span>The Engineering Reality:</span>
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-light">
                {isStory ? active.kid_reveal : active.reveal}
              </p>
            </div>
          );
        })()}
      </div>

      {/* 3. SIDE-BY-SIDE ARTIFACT COMPARISON TOOL */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-cosmic-cyan" />
          <h3 className="font-display font-bold text-xl text-white">
            Artifact Side-by-Side Comparator
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-6">
          Pick any two artifacts to compare their celestial bodies, operational status, coordinates, and physical purposes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Object A Selector & Preview */}
          <div className="p-5 rounded-2xl bg-space-950/80 border border-white/10">
            <label className="text-xs text-slate-400 font-semibold mb-2 block">Select Artifact 1:</label>
            <select
              value={compareA?.slug || ''}
              onChange={(e) => {
                const found = objects.find((o) => o.slug === e.target.value);
                setCompareA(found);
              }}
              className="w-full p-2.5 bg-space-900 border border-white/10 rounded-xl text-xs text-white mb-4 focus:outline-none focus:border-cosmic-blue"
            >
              {objects.map((o) => (
                <option key={o.id} value={o.slug}>
                  {o.name} ({o.celestial_body})
                </option>
              ))}
            </select>

            {compareA && (
              <div className="space-y-3 text-xs text-slate-300">
                <SafeImage
                  src={compareA.local_path}
                  fallbackSrc={compareA.image_url}
                  alt={compareA.name}
                  credit={compareA.image_credit}
                  nasaPageUrl={compareA.nasa_page_url}
                  celestialBody={compareA.celestial_body}
                  containerClassName="h-44 rounded-xl overflow-hidden mb-3 border border-white/5"
                />
                <div><strong className="text-white">Celestial Body:</strong> {compareA.celestial_body}</div>
                <div><strong className="text-white">Year Left:</strong> {compareA.year_left}</div>
                <div><strong className="text-white">Status:</strong> {compareA.current_status}</div>
                <div><strong className="text-white">Coordinates:</strong> {compareA.latitude != null ? `${compareA.latitude}°, ${compareA.longitude}°` : 'Unconfirmed'}</div>
                <div className="pt-2 border-t border-white/5 leading-relaxed">{isStory ? compareA.kid_summary : compareA.summary}</div>
              </div>
            )}
          </div>

          {/* Object B Selector & Preview */}
          <div className="p-5 rounded-2xl bg-space-950/80 border border-white/10">
            <label className="text-xs text-slate-400 font-semibold mb-2 block">Select Artifact 2:</label>
            <select
              value={compareB?.slug || ''}
              onChange={(e) => {
                const found = objects.find((o) => o.slug === e.target.value);
                setCompareB(found);
              }}
              className="w-full p-2.5 bg-space-900 border border-white/10 rounded-xl text-xs text-white mb-4 focus:outline-none focus:border-cosmic-blue"
            >
              {objects.map((o) => (
                <option key={o.id} value={o.slug}>
                  {o.name} ({o.celestial_body})
                </option>
              ))}
            </select>

            {compareB && (
              <div className="space-y-3 text-xs text-slate-300">
                <SafeImage
                  src={compareB.local_path}
                  fallbackSrc={compareB.image_url}
                  alt={compareB.name}
                  credit={compareB.image_credit}
                  nasaPageUrl={compareB.nasa_page_url}
                  celestialBody={compareB.celestial_body}
                  containerClassName="h-44 rounded-xl overflow-hidden mb-3 border border-white/5"
                />
                <div><strong className="text-white">Celestial Body:</strong> {compareB.celestial_body}</div>
                <div><strong className="text-white">Year Left:</strong> {compareB.year_left}</div>
                <div><strong className="text-white">Status:</strong> {compareB.current_status}</div>
                <div><strong className="text-white">Coordinates:</strong> {compareB.latitude != null ? `${compareB.latitude}°, ${compareB.longitude}°` : 'Unconfirmed'}</div>
                <div className="pt-2 border-t border-white/5 leading-relaxed">{isStory ? compareB.kid_summary : compareB.summary}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. "KEEP IT OR BRING IT BACK?" DEBATE CARD */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border-cosmic-amber/30 bg-gradient-to-b from-space-900 to-space-950 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Vote className="w-5 h-5 text-cosmic-amber" />
          <h3 className="font-display font-bold text-xl text-white">
            Ethical Debate: Keep It In Situ or Bring It Back?
          </h3>
        </div>
        <p className="text-xs md:text-sm text-slate-300 mb-6 leading-relaxed">
          Should Apollo landers and Mars rovers stay forever in their original landing sites as off-world monuments, or should future missions recover them for terrestrial museums?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-space-950 border border-white/5">
            <h4 className="font-bold text-cosmic-cyan text-sm mb-2">Preserve In Situ (Leave on the Moon/Mars)</h4>
            <p className="text-slate-300">
              Preserves authentic archaeological context. Bootprints and rover tracks exist only once in human history. Moving hardware destroys its relationship to the lunar soil and landscape.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-space-950 border border-white/5">
            <h4 className="font-bold text-cosmic-amber text-sm mb-2">Recover for Earth Museums</h4>
            <p className="text-slate-300">
              Allows millions of students, families, and scientists on Earth to inspect weathering, cosmic ray pitting, and solar wind effects firsthand (as Apollo 12 did with Surveyor 3).
            </p>
          </div>
        </div>

        {/* Local Poll Action (no fake numbers) */}
        <div className="p-4 rounded-2xl bg-space-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300">
            {userVote ? (
              <span className="text-emerald-400 font-semibold">
                ✓ You voted to: {userVote === 'preserve' ? 'Preserve them where they rest in space' : 'Bring selected artifacts home to museums'}
              </span>
            ) : (
              <span>What would you do as Director of Space Heritage? Cast your local vote:</span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleVote('preserve')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                userVote === 'preserve'
                  ? 'bg-cosmic-cyan text-space-950 shadow'
                  : 'bg-space-800 text-slate-300 hover:text-white'
              }`}
            >
              Preserve In Space
            </button>
            <button
              onClick={() => handleVote('recover')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                userVote === 'recover'
                  ? 'bg-cosmic-amber text-space-950 shadow'
                  : 'bg-space-800 text-slate-300 hover:text-white'
              }`}
            >
              Bring to Earth Museums
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
