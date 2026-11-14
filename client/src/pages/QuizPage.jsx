import React, { useState, useEffect } from 'react';
import { fetchQuiz } from '../services/api';
import confetti from 'canvas-confetti';
import { HelpCircle, Sparkles, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, Compass, Eye } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { useBadges } from '../context/BadgeContext';

const SPOT_SITE_CHALLENGES = [
  {
    id: 'tranquility',
    name: 'Apollo 11: Tranquility Base',
    image: 'https://images-assets.nasa.gov/image/AS11-40-5922/AS11-40-5922~orig.jpg',
    clue: 'Notice the golden landing strut foil and the famous peace plaque on the lunar module leg: "Here men from the planet Earth first set foot upon the Moon."',
    kid_clue: 'Look for the golden spaceship foot and the ladder Neil Armstrong climbed down!',
    options: ['Tranquility Base (Moon)', 'Hadley Rille (Moon)', 'Utopia Planitia (Mars)', 'Gusev Crater (Mars)'],
    correct: 0,
    fact: 'LROC orbital spacecraft re-photographed this site in 2009, revealing the dark astronaut footpaths stamped into the regolith.'
  },
  {
    id: 'hadley',
    name: 'Apollo 15: Hadley Rille',
    image: 'https://images-assets.nasa.gov/image/AS15-88-11866/AS15-88-11866~orig.jpg',
    clue: 'A lunar roving vehicle parked against the towering Apennine mountain range and a deep meandering volcanic canyon gorge.',
    kid_clue: 'A Moon Buggy parked next to giant mountain hills in the background!',
    options: ['Ocean of Storms (Moon)', 'Hadley-Apennine (Moon)', 'Ares Vallis (Mars)', 'Fra Mauro (Moon)'],
    correct: 1,
    fact: 'Hadley Rille is a collapsed volcanic lava tube over 1,000 meters wide and 300 meters deep.'
  },
  {
    id: 'ares',
    name: 'Mars Pathfinder: Ares Vallis',
    image: 'https://images-assets.nasa.gov/image/PIA01120/PIA01120~orig.jpg',
    clue: 'A microwave-sized rover with six wheels inspecting rounded boulders deposited by a catastrophic ancient Martian flash flood.',
    kid_clue: 'A tiny skateboard robot inspecting a rock named Barnacle Bill in red dirt!',
    options: ['Hadley Rille (Moon)', 'Elysium Planitia (Mars)', 'Ares Vallis (Mars)', 'Descartes Highlands (Moon)'],
    correct: 2,
    fact: 'Ares Vallis was chosen specifically because ancient floodwaters gathered rocks from hundreds of miles away into one landing zone.'
  },
  {
    id: 'endeavour',
    name: 'Opportunity: Endeavour Crater',
    image: 'https://images-assets.nasa.gov/image/PIA10216/PIA10216~orig.jpg',
    clue: 'The long solar shadow of a veteran robotic explorer stretched across the rim of an ancient 22-kilometer-wide impact crater.',
    kid_clue: 'The shadow of our favorite marathon rover resting on the edge of a giant crater bowl!',
    options: ['Endeavour Crater (Mars)', 'Tranquility Base (Moon)', 'Green Valley (Mars)', 'Ocean of Storms (Moon)'],
    correct: 0,
    fact: 'Opportunity spent over 7 years exploring the rim of Endeavour Crater after driving 21 km just to reach it.'
  }
];

export default function QuizPage({ onSelectStory }) {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' | 'match' | 'spotsite'
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Match Game state
  const [matchPairs, setMatchPairs] = useState([
    { id: '1', object: 'Descent Stage "Eagle"', mission: 'Apollo 11', matched: false },
    { id: '2', object: 'Laser Retroreflector (300 cubes)', mission: 'Apollo 15', matched: false },
    { id: '3', object: 'Sojourner Microrover', mission: 'Mars Pathfinder', matched: false },
    { id: '4', object: 'Opportunity 45km Marathon Rover', mission: 'Mars Exploration Rover B', matched: false },
  ]);
  const [selectedObj, setSelectedObj] = useState(null);
  const [selectedMis, setSelectedMis] = useState(null);
  const [matchSuccess, setMatchSuccess] = useState(false);

  // Spot Site Game state
  const [spotIndex, setSpotIndex] = useState(0);
  const [spotSelected, setSpotSelected] = useState(null);
  const [spotAnswered, setSpotAnswered] = useState(false);
  const [spotScore, setSpotScore] = useState(0);

  const { isStory } = useMode();
  const { unlockBadge } = useBadges();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = () => {
    setLoading(true);
    setCurrentIndex(0);
    setScore(0);
    setIsAnswered(false);
    setIsCompleted(false);
    setSelectedOption(null);

    fetchQuiz('all', 10)
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load quiz:', err);
        setLoading(false);
      });
  };

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const q = questions[currentIndex];
    if (idx === q.correct_index) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      const finalScore = score + (selectedOption === questions[currentIndex].correct_index ? 1 : 0);
      if (finalScore >= 7) {
        unlockBadge('badge-quiz-cadet');
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      }
    }
  };

  // Match Game logic
  const handleObjectClick = (pair) => {
    if (pair.matched) return;
    setSelectedObj(pair);
    if (selectedMis) {
      checkMatch(pair, selectedMis);
    }
  };

  const handleMissionClick = (pair) => {
    if (pair.matched) return;
    setSelectedMis(pair);
    if (selectedObj) {
      checkMatch(selectedObj, pair);
    }
  };

  const checkMatch = (objPair, misPair) => {
    if (objPair.id === misPair.id) {
      setMatchPairs((prev) =>
        prev.map((p) => (p.id === objPair.id ? { ...p, matched: true } : p))
      );
      setSelectedObj(null);
      setSelectedMis(null);

      setTimeout(() => {
        setMatchPairs((current) => {
          if (current.every((p) => p.matched)) {
            setMatchSuccess(true);
            try {
              confetti({ particleCount: 80, spread: 60 });
            } catch {}
          }
          return current;
        });
      }, 200);
    } else {
      setTimeout(() => {
        setSelectedObj(null);
        setSelectedMis(null);
      }, 500);
    }
  };

  const resetMatchGame = () => {
    setMatchPairs((prev) => prev.map((p) => ({ ...p, matched: false })));
    setSelectedObj(null);
    setSelectedMis(null);
    setMatchSuccess(false);
  };

  // Spot Site logic
  const handleSpotAnswer = (idx) => {
    if (spotAnswered) return;
    setSpotSelected(idx);
    setSpotAnswered(true);
    if (idx === SPOT_SITE_CHALLENGES[spotIndex].correct) {
      setSpotScore((prev) => prev + 1);
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {}
    }
  };

  const handleNextSpot = () => {
    if (spotIndex + 1 < SPOT_SITE_CHALLENGES.length) {
      setSpotIndex((prev) => prev + 1);
      setSpotSelected(null);
      setSpotAnswered(false);
    } else {
      setSpotIndex(0);
      setSpotSelected(null);
      setSpotAnswered(false);
      setSpotScore(0);
    }
  };

  const currentQ = questions[currentIndex];
  const currentSpot = SPOT_SITE_CHALLENGES[spotIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cosmic-cyan mb-1.5">
            <HelpCircle className="w-4 h-4 text-cosmic-cyan" />
            <span>Knowledge Verification</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white">
            Discovery Quiz & Mini-Games
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            {isStory
              ? "Test your space detective skills! Complete quizzes and identify landing sites to earn official explorer badges!"
              : "Scientifically accurate knowledge evaluation assessing history, orbital mechanics, and extraterrestrial material artifacts."}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-cosmic-blue text-space-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            10-Q Quiz
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'match' ? 'bg-cosmic-blue text-space-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Match Game
          </button>
          <button
            onClick={() => setActiveTab('spotsite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'spotsite' ? 'bg-cosmic-blue text-space-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Spot the Site
          </button>
        </div>
      </div>

      {/* 1. QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-2xl">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400">
              Loading verified questions...
            </div>
          ) : isCompleted ? (
            /* Completed Score Screen */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                Quiz Complete!
              </h2>
              <p className="text-base text-cosmic-cyan font-bold mb-4">
                You scored {score} out of {questions.length} points!
              </p>
              <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto mb-8">
                {score >= 7
                  ? "Outstanding job, Space Explorer! You've unlocked the 'Space Cadet' achievement badge!"
                  : "Great effort! Review the artifact stories and try again to earn your badge!"}
              </p>
              <button
                onClick={loadQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cosmic-blue to-cosmic-cyan text-space-950 font-bold text-sm shadow-lg hover:scale-105 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Quiz</span>
              </button>
            </div>
          ) : currentQ ? (
            <div>
              {/* Progress Bar & Question Counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1.5 bg-space-950 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-cosmic-blue to-cosmic-cyan transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="font-display font-bold text-lg md:text-xl text-white mb-6 leading-snug">
                {isStory ? currentQ.kid_question : currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, i) => {
                  let optStyle = 'bg-space-950/80 border-white/5 hover:border-white/20 text-slate-200';
                  if (isAnswered) {
                    if (i === currentQ.correct_index) {
                      optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                    } else if (i === selectedOption) {
                      optStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    } else {
                      optStyle = 'bg-space-950/40 border-white/5 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && i === currentQ.correct_index && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && i === selectedOption && i !== currentQ.correct_index && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div className="p-4 rounded-xl bg-space-950 border border-white/10 mb-6">
                  <div className="text-xs font-bold text-cosmic-cyan uppercase mb-1">
                    Scientific Fact:
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {isStory ? currentQ.kid_explanation : currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cosmic-blue hover:bg-sky-400 text-space-950 font-bold text-xs shadow-md transition-colors"
                  >
                    <span>{currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* 2. MATCH THE OBJECT GAME TAB */}
      {activeTab === 'match' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                Match the Object to its Mission
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Tap an artifact on the left, then tap its corresponding mission on the right!
              </p>
            </div>
            <button
              onClick={resetMatchGame}
              className="text-xs text-cosmic-cyan flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Game</span>
            </button>
          </div>

          {matchSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center text-sm font-bold mb-6 animate-pulse">
              🎉 Perfect match! You paired all 4 space artifacts with their missions!
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Column A: Objects */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Artifacts:
              </div>
              {matchPairs.map((p) => (
                <button
                  key={p.id}
                  disabled={p.matched}
                  onClick={() => handleObjectClick(p)}
                  className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all ${
                    p.matched
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 line-through opacity-70'
                      : selectedObj?.id === p.id
                      ? 'bg-cosmic-blue/20 border-cosmic-cyan text-cosmic-cyan ring-1 ring-cosmic-cyan'
                      : 'bg-space-950 border-white/5 hover:border-white/20 text-slate-200'
                  }`}
                >
                  {p.object}
                </button>
              ))}
            </div>

            {/* Column B: Missions */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Missions:
              </div>
              {matchPairs.map((p) => (
                <button
                  key={p.id}
                  disabled={p.matched}
                  onClick={() => handleMissionClick(p)}
                  className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm font-semibold transition-all ${
                    p.matched
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 line-through opacity-70'
                      : selectedMis?.id === p.id
                      ? 'bg-cosmic-blue/20 border-cosmic-cyan text-cosmic-cyan ring-1 ring-cosmic-cyan'
                      : 'bg-space-950 border-white/5 hover:border-white/20 text-slate-200'
                  }`}
                >
                  {p.mission}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SPOT THE LANDING SITE GAME TAB */}
      {activeTab === 'spotsite' && (
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 bg-space-900/90 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cosmic-cyan" />
                <h2 className="font-display font-bold text-xl text-white">
                  Mini Game: Spot the Landing Site
                </h2>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Challenge {spotIndex + 1} of {SPOT_SITE_CHALLENGES.length} · Score: {spotScore}
              </p>
            </div>
          </div>

          {/* Photo & Clue */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-6">
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 bg-space-950">
              <img
                src={currentSpot.image}
                alt="NASA verified site view"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 px-2.5 py-1 rounded text-[10px] font-bold text-cosmic-cyan">
                Verified Historical Photo
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-cosmic-amber mb-1">
                Visual Clue:
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-light mb-4">
                {isStory ? currentSpot.kid_clue : currentSpot.clue}
              </p>
              <div className="text-xs font-bold text-white mb-3">
                Which historic landing site is this?
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentSpot.options.map((opt, i) => {
                  let btnStyle = 'bg-space-950/80 border-white/10 text-slate-200 hover:border-white/30';
                  if (spotAnswered) {
                    if (i === currentSpot.correct) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                    } else if (i === spotSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
                    } else {
                      btnStyle = 'bg-space-950/40 border-white/5 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={spotAnswered}
                      onClick={() => handleSpotAnswer(i)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {spotAnswered && i === currentSpot.correct && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Fact & Next */}
          {spotAnswered && (
            <div className="p-4 rounded-xl bg-space-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-cosmic-cyan">Field Discovery: </strong>
                {currentSpot.fact}
              </div>
              <button
                onClick={handleNextSpot}
                className="shrink-0 px-4 py-2 bg-cosmic-blue hover:bg-sky-400 text-space-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <span>{spotIndex + 1 === SPOT_SITE_CHALLENGES.length ? 'Restart Sites' : 'Next Site'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
