import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GameState {
  year: number;
  age: number;
  salary: number;
  expenses: number;
  passiveIncome: number;
  ptptnDebt: number;
  asbBalance: number;
  carPayment: number;
  completed: boolean;
  won: boolean;
}

interface Decision {
  text: string;
  effect: (s: GameState) => Partial<GameState>;
  icon: string;
}

interface Event {
  text: string;
  choices: { label: string; effect: (s: GameState) => Partial<GameState> }[];
}

const initialState: GameState = {
  year: 1,
  age: 22,
  salary: 3500,
  expenses: 2800,
  passiveIncome: 0,
  ptptnDebt: 30000,
  asbBalance: 0,
  carPayment: 0,
  completed: false,
  won: false,
};

const decisions: Decision[] = [
  {
    text: 'Buy a new Myvi — RM 600/month for 7 years',
    effect: s => ({ expenses: s.expenses + 600, carPayment: s.carPayment + 600 }),
    icon: '🚗',
  },
  {
    text: 'Start ASB auto-deduction — RM 200/month',
    effect: s => ({
      asbBalance: s.asbBalance + 2400,
      passiveIncome: s.passiveIncome + 10,
    }),
    icon: '🏦',
  },
  {
    text: 'Aggressively pay PTPTN — RM 500/month',
    effect: s => ({
      ptptnDebt: Math.max(0, s.ptptnDebt - 6000),
      expenses: s.expenses + 500,
    }),
    icon: '🎓',
  },
  {
    text: 'Upgrade to iPhone — RM 200/month installment',
    effect: s => ({ expenses: s.expenses + 200 }),
    icon: '📱',
  },
  {
    text: 'Invest in dividend stocks — RM 300/month',
    effect: s => ({
      passiveIncome: s.passiveIncome + 25,
      expenses: s.expenses + 300,
    }),
    icon: '📈',
  },
  {
    text: 'Minimal lifestyle, max savings — RM 400/month to ASB',
    effect: s => ({
      asbBalance: s.asbBalance + 4800,
      passiveIncome: s.passiveIncome + 20,
    }),
    icon: '💰',
  },
  {
    text: 'Side hustle — freelance on weekends',
    effect: s => ({ salary: s.salary + 500 }),
    icon: '💻',
  },
  {
    text: 'Rent out a spare room — RM 500/month income',
    effect: s => ({ passiveIncome: s.passiveIncome + 500 }),
    icon: '🏠',
  },
];

const randomEvents: Event[] = [
  {
    text: 'Your friends bought a new condo. Follow?',
    choices: [
      { label: 'Yes (RM 1,200/month)', effect: s => ({ expenses: s.expenses + 1200 }) },
      { label: 'No, stay put', effect: () => ({}) },
    ],
  },
  {
    text: 'Raya is coming. Splurge on celebrations?',
    choices: [
      { label: 'Yes (RM 2,000)', effect: s => ({ asbBalance: s.asbBalance - 2000 }) },
      { label: 'Keep it modest', effect: () => ({}) },
    ],
  },
  {
    text: 'You got a raise! What do you do?',
    choices: [
      { label: 'Celebrate (upgrade lifestyle)', effect: s => ({ salary: s.salary + 500, expenses: s.expenses + 400 }) },
      { label: 'Invest it all', effect: s => ({ salary: s.salary + 500, asbBalance: s.asbBalance + 6000, passiveIncome: s.passiveIncome + 25 }) },
    ],
  },
];

function getRandomPair(): [Decision, Decision] {
  const shuffled = [...decisions].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

export default function RatRace() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameState>(initialState);
  const [currentDecisions, setCurrentDecisions] = useState<[Decision, Decision] | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState('');
  const [workHarderClicks, setWorkHarderClicks] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const nextYear = useCallback((updates: Partial<GameState> = {}) => {
    setGame(prev => {
      const next = { ...prev, ...updates };
      next.year += 1;
      next.age += 1;
      // ASB grows
      if (next.asbBalance > 0) {
        next.asbBalance = next.asbBalance * 1.055;
        next.passiveIncome = next.passiveIncome + next.asbBalance * 0.005;
      }
      // Salary raise
      if (next.year % 3 === 0) next.salary += 300;
      // Expense inflation
      next.expenses = next.expenses * 1.02;
      // Check win/lose
      if (next.passiveIncome >= next.expenses * 0.8) {
        next.completed = true;
        next.won = true;
      } else if (next.age >= 65) {
        next.completed = true;
        next.won = false;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!game.completed && !showIntro && !currentDecisions && !currentEvent) {
      // Show random event occasionally
      if (game.year > 1 && Math.random() < 0.25) {
        setCurrentEvent(randomEvents[Math.floor(Math.random() * randomEvents.length)]);
      } else {
        setCurrentDecisions(getRandomPair());
      }
    }
  }, [game.year, game.completed, showIntro, currentDecisions, currentEvent]);

  useEffect(() => {
    if (game.completed) {
      const summaryEl = document.getElementById('rat-race-summary');
      if (summaryEl) {
        gsap.fromTo(summaryEl, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
      }
    }
  }, [game.completed]);

  const makeDecision = (decision: Decision) => {
    const effect = decision.effect(game);
    setGame(prev => ({ ...prev, ...effect }));
    setLogs(prev => [`Year ${game.year}: ${decision.text}`, ...prev].slice(0, 8));
    setCurrentDecisions(null);
    nextYear(effect);
  };

  const handleEvent = (choice: { label: string; effect: (s: GameState) => Partial<GameState> }) => {
    const effect = choice.effect(game);
    setGame(prev => ({ ...prev, ...effect }));
    setLogs(prev => [`Year ${game.year}: ${currentEvent?.text} → ${choice.label}`, ...prev].slice(0, 8));
    setCurrentEvent(null);
    nextYear(effect);
  };

  const workHarder = () => {
    setWorkHarderClicks(prev => prev + 1);
    setMessage('You worked harder... but the wheel spins faster. Nothing changes.');
    setTimeout(() => setMessage(''), 2000);
  };

  const startGame = () => {
    setShowIntro(false);
    setCurrentDecisions(getRandomPair());
  };

  const resetGame = () => {
    setGame(initialState);
    setCurrentDecisions(null);
    setCurrentEvent(null);
    setMessage('');
    setWorkHarderClicks(0);
    setShowIntro(true);
    setLogs([]);
  };

  const freedomPercent = Math.min(100, (game.passiveIncome / Math.max(game.expenses, 1)) * 100);

  return (
    <section id="rat-race" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-crimson text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 04 / Rat Race Simulator
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Work Harder.{' '}
          <span className="text-crimson">Never Leave the Wheel.</span>
        </h2>

        {showIntro ? (
          <div data-reveal className="max-w-lg mx-auto text-center py-10">
            <p className="text-slate text-lg mb-6">
              You are a fresh graduate: RM 3,500/month, PTPTN debt RM 30,000. Each year you make one financial decision. Will you escape the Rat Race?
            </p>
            <div className="bg-navy-surface border border-navy-light rounded-xl p-6 mb-8 text-left">
              <p className="text-navy-light text-xs uppercase mb-3">Starting Position</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate">Age:</span> <span className="text-white font-mono-data">22</span></div>
                <div><span className="text-slate">Salary:</span> <span className="text-gold font-mono-data">RM 3,500</span></div>
                <div><span className="text-slate">Expenses:</span> <span className="text-crimson font-mono-data">RM 2,800</span></div>
                <div><span className="text-slate">PTPTN:</span> <span className="text-crimson font-mono-data">RM 30,000</span></div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="px-8 py-4 bg-crimson text-white font-semibold rounded-lg hover:shadow-[0_4px_16px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Start Simulation
            </button>
          </div>
        ) : (
          <div data-reveal className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Panel - Game Status */}
            <div className="lg:col-span-2 space-y-4">
              {/* Status Panel */}
              <div className="bg-navy-surface border border-navy-light rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-navy-light text-xs uppercase">Year {game.year}</p>
                    <p className="text-white text-2xl font-bold font-mono-data">Age {game.age}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-navy-light text-xs uppercase">Freedom</p>
                    <p className={`font-mono-data text-lg font-bold ${freedomPercent >= 80 ? 'text-emerald' : freedomPercent >= 40 ? 'text-gold' : 'text-crimson'}`}>
                      {freedomPercent.toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate text-sm">Monthly Salary</span>
                    <span className="text-gold font-mono-data font-bold">RM {game.salary.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-navy-light rounded-full h-2">
                    <div className="bg-gold h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, game.salary / 100)}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate text-sm">Monthly Expenses</span>
                    <span className="text-crimson font-mono-data font-bold">RM {game.expenses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-navy-light rounded-full h-2">
                    <div className="bg-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, game.expenses / 100)}%` }} />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate text-sm">Passive Income</span>
                    <span className="text-emerald font-mono-data font-bold">RM {game.passiveIncome.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-navy-light rounded-full h-2">
                    <div className="bg-emerald h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, freedomPercent)}%` }} />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-navy-light">
                    <span className="text-slate text-sm">PTPTN Debt</span>
                    <span className="text-crimson font-mono-data">RM {game.ptptnDebt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate text-sm">ASB Balance</span>
                    <span className="text-gold font-mono-data">RM {game.asbBalance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Work Harder Button */}
              {!game.completed && (
                <button
                  onClick={workHarder}
                  className="w-full py-3 border border-crimson/50 text-crimson rounded-lg hover:bg-crimson/10 transition-all duration-200 text-sm"
                >
                  Work Harder ({workHarderClicks}x clicked)
                </button>
              )}
              {message && (
                <p className="text-crimson text-sm italic animate-pulse">{message}</p>
              )}

              {/* Game Log */}
              {logs.length > 0 && (
                <div className="bg-navy-surface/50 border border-navy-light rounded-xl p-4 max-h-40 overflow-y-auto">
                  {logs.map((log, i) => (
                    <p key={i} className="text-navy-light text-xs mb-1">{log}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel - Wheel & Decisions */}
            <div className="lg:col-span-3">
              {/* Wheel Visualization */}
              <div className="bg-navy-surface border border-navy-light rounded-2xl p-6 mb-6 flex justify-center">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  {/* Wheel */}
                  <g style={{ animation: game.completed && game.won ? 'none' : 'wheelSpin 8s linear infinite', transformOrigin: '140px 140px' }}>
                    <circle cx="140" cy="140" r="110" fill="none" stroke="#DC2626" strokeWidth="2.5" opacity="0.6" />
                    {/* Spokes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <line key={deg} x1="140" y1="140" x2={140 + Math.cos(rad) * 110} y2={140 + Math.sin(rad) * 110}
                          stroke="#DC2626" strokeWidth="1" opacity="0.3" />
                      );
                    })}
                    {/* Age ticks */}
                    {Array.from({ length: 44 }).map((_, i) => {
                      const deg = (i / 44) * 360;
                      const rad = (deg * Math.PI) / 180;
                      const isMajor = i % 5 === 0;
                      return (
                        <line key={i} x1={140 + Math.cos(rad) * (isMajor ? 105 : 108)}
                          y1={140 + Math.sin(rad) * (isMajor ? 105 : 108)}
                          x2={140 + Math.cos(rad) * 110} y2={140 + Math.sin(rad) * 110}
                          stroke="#DC2626" strokeWidth={isMajor ? 1.5 : 0.5} opacity={0.4} />
                      );
                    })}
                  </g>
                  {/* Avatar */}
                  <circle cx="140" cy="55" r="8" fill="#FFD700" opacity={game.completed && game.won ? 0.3 : 1}>
                    {!game.completed && <animateTransform attributeName="transform" type="translate" values="0,0; 0,3; 0,0" dur="1s" repeatCount="indefinite" />}
                  </circle>
                  <rect x="134" y="63" width="12" height="16" rx="3" fill="#FFD700" opacity={game.completed && game.won ? 0.3 : 1} />
                  {/* Center hub */}
                  <circle cx="140" cy="140" r="6" fill="#DC2626" opacity="0.5" />
                  {/* Freedom bridge */}
                  {game.completed && game.won && (
                    <>
                      <path d="M 220 140 Q 250 100 260 60" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round">
                        <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="1.5s" fill="freeze" />
                      </path>
                      {/* Escaped avatar */}
                      <circle cx="260" cy="55" r="8" fill="#10B981" />
                      <rect x="254" y="63" width="12" height="16" rx="3" fill="#10B981" />
                      {/* Confetti */}
                      {[...Array(12)].map((_, i) => (
                        <rect key={i} x={250 + Math.random() * 40} y={40 + Math.random() * 40}
                          width="4" height="8" fill={['#FFD700', '#10B981', '#E6F1FF'][i % 3]} opacity="0.8">
                          <animateTransform attributeName="transform" type="rotate"
                            from={`0 ${255 + i * 3} ${50 + i * 2}`} to={`360 ${255 + i * 3} ${50 + i * 2}`}
                            dur={`${1 + Math.random()}s`} repeatCount="indefinite" />
                        </rect>
                      ))}
                    </>
                  )}
                  {/* Labels */}
                  <text x="140" y="240" textAnchor="middle" fill="#DC2626" fontSize="10" opacity="0.6">RAT RACE</text>
                  {game.completed && game.won && (
                    <text x="260" y="40" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">FREEDOM!</text>
                  )}
                </svg>
              </div>

              {/* Decision Cards */}
              {!game.completed && currentDecisions && (
                <div className="space-y-4">
                  <p className="text-slate text-sm text-center">Year {game.year} — Choose your path:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentDecisions.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => makeDecision(d)}
                        className="bg-navy-surface border border-navy-light rounded-xl p-5 text-left hover:border-gold/40 hover:shadow-elevated transition-all duration-200 group"
                      >
                        <span className="text-3xl mb-3 block">{d.icon}</span>
                        <p className="text-white text-sm font-medium group-hover:text-gold transition-colors">{d.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Random Event */}
              {!game.completed && currentEvent && (
                <div className="bg-navy-surface border border-gold/30 rounded-2xl p-6">
                  <p className="text-gold text-sm font-medium mb-1">Life Event!</p>
                  <p className="text-white text-base mb-4">{currentEvent.text}</p>
                  <div className="flex gap-3">
                    {currentEvent.choices.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => handleEvent(c)}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          i === 0 ? 'bg-crimson/20 border border-crimson/40 text-crimson hover:bg-crimson/30' : 'bg-emerald/20 border border-emerald/40 text-emerald hover:bg-emerald/30'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Over */}
              {game.completed && (
                <div id="rat-race-summary" className={`rounded-2xl p-8 text-center ${game.won ? 'bg-emerald/10 border-2 border-emerald' : 'bg-crimson/10 border-2 border-crimson'}`}>
                  {game.won ? (
                    <>
                      <p className="text-emerald text-3xl font-bold mb-2">You Escaped the Rat Race!</p>
                      <p className="text-slate text-sm mb-4">
                        At age {game.age}, your passive income of RM {game.passiveIncome.toFixed(0)}/month covers your expenses.
                      </p>
                      <p className="text-gold text-lg italic">"You can balik kampung permanently."</p>
                    </>
                  ) : (
                    <>
                      <p className="text-crimson text-3xl font-bold mb-2">Time's Up.</p>
                      <p className="text-slate text-sm mb-4">
                        43 years on the wheel. You worked hard. But you never left.
                      </p>
                      <p className="text-navy-light text-sm italic">
 Passive income: RM {game.passiveIncome.toFixed(0)} — still short of RM {game.expenses.toFixed(0)} expenses.
                      </p>
                    </>
                  )}
                  <button
                    onClick={resetGame}
                    className="mt-6 px-6 py-3 bg-navy-surface border border-navy-light text-white rounded-lg hover:border-gold/40 transition-all duration-200"
                  >
                    Play Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
