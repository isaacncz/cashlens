import { useState, useEffect, useRef, useMemo } from 'react';
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

interface ImpactChip {
  label: string;
  value: string;
  tone: 'good' | 'bad' | 'neutral';
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

function shouldShowRandomEvent(year: number) {
  return year > 1 && Math.random() < 0.25;
}

function getRandomEvent() {
  return randomEvents[Math.floor(Math.random() * randomEvents.length)];
}

function formatImpactAmount(value: number): string {
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}RM ${Math.abs(value).toFixed(0)}`;
}

function getImpactPreview(current: GameState, effect: Partial<GameState>): ImpactChip[] {
  const chips: ImpactChip[] = [];

  const pushChip = (
    label: string,
    nextValue: number | undefined,
    currentValue: number,
    goodWhenPositive: boolean,
  ) => {
    if (typeof nextValue !== 'number' || nextValue === currentValue) return;
    const delta = nextValue - currentValue;
    chips.push({
      label,
      value: formatImpactAmount(delta),
      tone: delta === 0 ? 'neutral' : (delta > 0) === goodWhenPositive ? 'good' : 'bad',
    });
  };

  pushChip('Salary', effect.salary, current.salary, true);
  pushChip('Expenses', effect.expenses, current.expenses, false);
  pushChip('Passive', effect.passiveIncome, current.passiveIncome, true);
  pushChip('PTPTN', effect.ptptnDebt, current.ptptnDebt, false);
  pushChip('ASB', effect.asbBalance, current.asbBalance, true);

  return chips.length > 0
    ? chips
    : [{ label: 'Impact', value: 'No immediate change', tone: 'neutral' }];
}

function scoreDecision(current: GameState, effect: Partial<GameState>) {
  const nextSalary = effect.salary ?? current.salary;
  const nextExpenses = effect.expenses ?? current.expenses;
  const nextPassive = effect.passiveIncome ?? current.passiveIncome;
  const nextDebt = effect.ptptnDebt ?? current.ptptnDebt;
  const nextAsb = effect.asbBalance ?? current.asbBalance;

  return (
    (nextPassive - current.passiveIncome) * 4 +
    (nextSalary - current.salary) * 2 +
    (current.ptptnDebt - nextDebt) * 1.2 +
    (nextAsb - current.asbBalance) * 0.08 -
    (nextExpenses - current.expenses) * 3
  );
}

function getDecisionCoaching(current: GameState, effect: Partial<GameState>) {
  const score = scoreDecision(current, effect);
  if (score >= 1200) {
    return { label: 'Builds freedom faster', tone: 'good' as const };
  }
  if (score >= 200) {
    return { label: 'Reasonable long-term move', tone: 'neutral' as const };
  }
  return { label: 'Comfort now, pressure later', tone: 'bad' as const };
}

function advanceGameState(current: GameState, updates: Partial<GameState> = {}): GameState {
  const next = { ...current, ...updates };
  next.year += 1;
  next.age += 1;

  if (next.asbBalance > 0) {
    next.asbBalance = next.asbBalance * 1.055;
    next.passiveIncome = next.passiveIncome + next.asbBalance * 0.005;
  }

  if (next.year % 3 === 0) next.salary += 300;

  next.expenses = next.expenses * 1.02;

  if (next.passiveIncome >= next.expenses * 0.8) {
    next.completed = true;
    next.won = true;
  } else if (next.age >= 65) {
    next.completed = true;
    next.won = false;
  }

  return next;
}

export default function RatRace() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useState<GameState>(initialState);
  const [currentDecisions, setCurrentDecisions] = useState<[Decision, Decision] | null>([decisions[1], decisions[2]]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState('');
  const [workHarderClicks, setWorkHarderClicks] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [freedomXp, setFreedomXp] = useState(0);
  const [smartStreak, setSmartStreak] = useState(0);
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: 248 + (i % 4) * 11 + (i % 2) * 3,
        y: 42 + Math.floor(i / 4) * 12 + (i % 3) * 2,
        rotationX: 255 + i * 3,
        rotationY: 50 + i * 2,
        duration: `${1 + (i % 4) * 0.2}s`,
        color: ['#FFD700', '#10B981', '#E6F1FF'][i % 3],
      })),
    [],
  );

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

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
    const score = scoreDecision(game, effect);
    const xpGain = Math.max(8, Math.round(Math.max(score, 0) / 80));
    setLogs(prev => [`Year ${game.year}: ${decision.text}`, ...prev].slice(0, 8));
    const nextGame = advanceGameState(game, effect);
    setGame(nextGame);
    setFreedomXp(prev => prev + xpGain);
    setSmartStreak(prev => (score >= 1200 ? prev + 1 : score >= 200 ? prev : 0));
    setCurrentDecisions(null);
    if (nextGame.completed) {
      setCurrentEvent(null);
      return;
    }
    if (shouldShowRandomEvent(nextGame.year)) {
      setCurrentEvent(getRandomEvent());
    } else {
      setCurrentEvent(null);
      setCurrentDecisions(getRandomPair());
    }
  };

  const handleEvent = (choice: { label: string; effect: (s: GameState) => Partial<GameState> }) => {
    const effect = choice.effect(game);
    const score = scoreDecision(game, effect);
    const xpGain = Math.max(5, Math.round(Math.max(score, 0) / 120));
    setLogs(prev => [`Year ${game.year}: ${currentEvent?.text} → ${choice.label}`, ...prev].slice(0, 8));
    const nextGame = advanceGameState(game, effect);
    setGame(nextGame);
    setFreedomXp(prev => prev + xpGain);
    setSmartStreak(prev => (score >= 1200 ? prev + 1 : score >= 200 ? prev : 0));
    setCurrentEvent(null);
    if (nextGame.completed) {
      setCurrentDecisions(null);
      return;
    }
    setCurrentDecisions(getRandomPair());
  };

  const workHarder = () => {
    setWorkHarderClicks(prev => prev + 1);
    setMessage('You worked harder... but the wheel spins faster. Nothing changes.');
    setTimeout(() => setMessage(''), 2000);
  };

  const resetGame = () => {
    setGame(initialState);
    setCurrentDecisions([decisions[1], decisions[2]]);
    setCurrentEvent(null);
    setMessage('');
    setWorkHarderClicks(0);
    setLogs([]);
    setFreedomXp(0);
    setSmartStreak(0);
  };

  const freedomPercent = Math.min(100, (game.passiveIncome / Math.max(game.expenses, 1)) * 100);
  const monthlyGap = game.passiveIncome - game.expenses;
  const playerTier = freedomXp >= 140 ? 'Investor Mindset' : freedomXp >= 70 ? 'Freedom Builder' : freedomXp >= 25 ? 'Cashflow Rookie' : 'Fresh Grad';
  const wheelSpinDuration = `${Math.max(1.5, 8 - workHarderClicks * 0.2)}s`;

  return (
    <section id="rat-race" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-crimson text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 05 / Rat Race Simulator
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Work Harder.{' '}
          <span className="text-crimson">Never Leave the Wheel.</span>
        </h2>
        <div data-reveal className="bg-navy-surface/50 border border-navy-light rounded-2xl p-5 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Mission starts immediately</p>
              <p className="text-slate text-sm">You are a fresh graduate: RM 3,500/month salary, RM 30,000 PTPTN debt. Tap a choice to play Year 1 right away.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-semibold">{playerTier}</span>
              <span className="px-3 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-semibold">XP {freedomXp}</span>
              <span className="px-3 py-1 rounded-full bg-navy border border-navy-light text-white text-xs font-semibold">Smart streak {smartStreak}</span>
            </div>
          </div>
        </div>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Panel - Game Status */}
            <div className="lg:col-span-2 space-y-4">
              {/* Status Panel */}
              <div className="bg-navy-surface border border-navy-light rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-slate text-xs uppercase">Year {game.year}</p>
                    <p className="text-white text-2xl font-bold font-mono-data">Age {game.age}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate text-xs uppercase">Freedom</p>
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
                  <div className="bg-navy/60 border border-navy-light rounded-xl p-4 mt-2">
                    <p className="text-slate text-xs uppercase mb-1">Monthly gap right now</p>
                    <p className={`font-mono-data text-xl font-bold ${monthlyGap >= 0 ? 'text-emerald' : 'text-crimson'}`}>
                      {monthlyGap >= 0 ? '+' : '-'} RM {Math.abs(monthlyGap).toFixed(0)}
                    </p>
                    <p className="text-slate text-xs mt-2">Positive means your passive income already covers your lifestyle.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-navy/60 border border-navy-light rounded-xl p-4">
                      <p className="text-slate text-xs uppercase mb-1">Freedom XP</p>
                      <p className="text-gold font-mono-data text-xl font-bold">{freedomXp}</p>
                    </div>
                    <div className="bg-navy/60 border border-navy-light rounded-xl p-4">
                      <p className="text-slate text-xs uppercase mb-1">Smart streak</p>
                      <p className="text-emerald font-mono-data text-xl font-bold">{smartStreak}</p>
                    </div>
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
                    <p key={i} className="text-slate text-xs mb-1">{log}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Right Panel - Wheel & Decisions */}
            <div className="lg:col-span-3">
              {/* Wheel Visualization */}
              <div className="bg-navy-surface border border-navy-light rounded-2xl p-6 mb-6 flex justify-center">
                <svg width="280" height="280" viewBox="0 0 280 280">
                  <defs>
                    <radialGradient id="wheelSurface" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#1E467C" />
                      <stop offset="55%" stopColor="#12365F" />
                      <stop offset="100%" stopColor="#0A2446" />
                    </radialGradient>
                    <linearGradient id="wheelRim" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FB7185" />
                      <stop offset="45%" stopColor="#F43F5E" />
                      <stop offset="100%" stopColor="#9F1239" />
                    </linearGradient>
                    <linearGradient id="wheelSpoke" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FB7185" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#881337" stopOpacity="0.35" />
                    </linearGradient>
                    <filter id="wheelGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="spokeGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="1.2" result="soft" />
                      <feMerge>
                        <feMergeNode in="soft" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="ratBody" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD54F" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>

                  <circle cx="140" cy="140" r="120" fill="none" stroke="#F43F5E" strokeWidth="2" opacity="0.4" filter="url(#wheelGlow)" />
                  <circle cx="140" cy="140" r="114" fill="none" stroke="#FB7185" strokeWidth="1.2" opacity="0.45" />

                  {/* Wheel */}
                  <g style={{ animation: game.completed && game.won ? 'none' : `wheelSpin ${wheelSpinDuration} linear infinite`, transformOrigin: '140px 140px' }}>
                    <circle cx="140" cy="140" r="110" fill="url(#wheelSurface)" stroke="url(#wheelRim)" strokeWidth="4" filter="url(#wheelGlow)" />
                    <circle cx="140" cy="140" r="100" fill="none" stroke="#FB7185" strokeWidth="1.6" opacity="0.42" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, index) => {
                      const start = (deg * Math.PI) / 180;
                      const end = ((deg + 45) * Math.PI) / 180;
                      const x1 = 140 + Math.cos(start) * 106;
                      const y1 = 140 + Math.sin(start) * 106;
                      const x2 = 140 + Math.cos(end) * 106;
                      const y2 = 140 + Math.sin(end) * 106;
                      return (
                        <path
                          key={`slice-${deg}`}
                          d={`M140 140 L${x1} ${y1} A106 106 0 0 1 ${x2} ${y2} Z`}
                          fill={index % 2 === 0 ? '#183A63' : '#102F54'}
                          opacity="0.58"
                        />
                      );
                    })}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
                      const rad = (deg * Math.PI) / 180;
                      return (
                        <line
                          key={deg}
                          x1="140"
                          y1="140"
                          x2={140 + Math.cos(rad) * 104}
                          y2={140 + Math.sin(rad) * 104}
                          stroke="url(#wheelSpoke)"
                          strokeWidth="2"
                          filter="url(#spokeGlow)"
                        />
                      );
                    })}
                    {Array.from({ length: 48 }).map((_, i) => {
                      const deg = (i / 48) * 360;
                      const rad = (deg * Math.PI) / 180;
                      const isMajor = i % 6 === 0;
                      return (
                        <line
                          key={`tick-${i}`}
                          x1={140 + Math.cos(rad) * (isMajor ? 101 : 105)}
                          y1={140 + Math.sin(rad) * (isMajor ? 101 : 105)}
                          x2={140 + Math.cos(rad) * 110}
                          y2={140 + Math.sin(rad) * 110}
                          stroke="#FB7185"
                          strokeWidth={isMajor ? 1.8 : 0.8}
                          opacity={isMajor ? 0.95 : 0.65}
                        />
                      );
                    })}
                  </g>

                  <path d="M140 16 L148 32 L132 32 Z" fill="#FB7185" opacity="0.95" filter="url(#wheelGlow)" />

                  {/* Rat runner */}
                  <g
                    opacity={game.completed && game.won ? 0.35 : 1}
                    style={{ animation: game.completed && game.won ? 'none' : 'ratRunBob 0.75s ease-in-out infinite', transformOrigin: '140px 56px' }}
                  >
                    <ellipse cx="140" cy="63" rx="14" ry="8" fill="#0F172A" opacity="0.45" />
                    <ellipse cx="140" cy="54" rx="9.5" ry="7" fill="url(#ratBody)" />
                    <ellipse cx="150" cy="53" rx="4.8" ry="4" fill="url(#ratBody)" />
                    <circle cx="147.2" cy="48.8" r="2.4" fill="#FCD34D" />
                    <circle cx="143.2" cy="49.3" r="2.1" fill="#FCD34D" />
                    <circle cx="151.8" cy="52.6" r="0.9" fill="#1E293B" />
                    <line x1="154.3" y1="53.1" x2="158.8" y2="52.5" stroke="#FCD34D" strokeWidth="0.9" />
                    <line x1="154.3" y1="53.8" x2="158.8" y2="54.1" stroke="#FCD34D" strokeWidth="0.9" />
                    <path d="M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62" fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round">
                      {!game.completed && <animate attributeName="d" values="M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62;M132 57 Q123 61 120 67 Q119 70 122 70 Q126 68 128 65 Q132 61 136 62;M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62" dur="0.65s" repeatCount="indefinite" />}
                    </path>
                    <rect x="136.5" y="59.7" width="3.8" height="7" rx="1.2" fill="#FCD34D" />
                    <rect x="142" y="59.7" width="3.8" height="7" rx="1.2" fill="#FCD34D" />
                  </g>

                  {/* Center hub */}
                  <circle cx="140" cy="140" r="10" fill="#0F172A" opacity="0.75" />
                  <circle cx="140" cy="140" r="6" fill="#DC2626" opacity="0.9" />
                  {!game.completed && <circle cx="140" cy="140" r="14" fill="none" stroke="#F43F5E" opacity="0.3">
                    <animate attributeName="r" values="12;16;12" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.35;0.1;0.35" dur="1.8s" repeatCount="indefinite" />
                  </circle>}
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
                      {confettiPieces.map((piece, i) => (
                        <rect key={i} x={piece.x} y={piece.y}
                          width="4" height="8" fill={piece.color} opacity="0.8">
                          <animateTransform attributeName="transform" type="rotate"
                            from={`0 ${piece.rotationX} ${piece.rotationY}`} to={`360 ${piece.rotationX} ${piece.rotationY}`}
                            dur={piece.duration} repeatCount="indefinite" />
                        </rect>
                      ))}
                    </>
                  )}
                  {/* Labels */}
                  <text x="140" y="242" textAnchor="middle" fill="#FDA4AF" fontSize="12" fontWeight="700" letterSpacing="2.1" opacity="1">RAT RACE</text>
                  {game.completed && game.won && (
                    <text x="260" y="40" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">FREEDOM!</text>
                  )}
                </svg>
              </div>

              {/* Decision Cards */}
              {!game.completed && currentDecisions && (
                <div className="space-y-4">
                  <div className="bg-navy-surface/50 border border-navy-light rounded-xl p-4">
                    <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Coach's lens</p>
                    <p className="text-slate text-sm">A strong choice should increase passive income, reduce debt, or buy back time without permanently locking in higher expenses.</p>
                  </div>
                  <p className="text-slate text-sm text-center">Year {game.year} — Choose your path:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentDecisions.map((d, i) => {
                      const impactChips = getImpactPreview(game, d.effect(game));
                      const coaching = getDecisionCoaching(game, d.effect(game));
                      const xpReward = Math.max(8, Math.round(Math.max(scoreDecision(game, d.effect(game)), 0) / 80));

                      return (
                        <button
                          key={i}
                          onClick={() => makeDecision(d)}
                          className="bg-navy-surface border border-navy-light rounded-xl p-5 text-left hover:border-gold/40 hover:shadow-elevated transition-all duration-200 group"
                        >
                          <span className="text-3xl mb-3 block">{d.icon}</span>
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold border mb-3 ${
                              coaching.tone === 'good'
                                ? 'bg-emerald/10 text-emerald border-emerald/30'
                                : coaching.tone === 'bad'
                                  ? 'bg-crimson/10 text-crimson border-crimson/30'
                                  : 'bg-gold/10 text-gold border-gold/30'
                            }`}
                          >
                            {coaching.label}
                          </span>
                          <p className="text-white text-sm font-medium group-hover:text-gold transition-colors mb-4">{d.text}</p>
                          <p className="text-slate text-xs mb-3">Reward: +{xpReward} XP if this builds freedom.</p>
                          <div className="flex flex-wrap gap-2">
                            {impactChips.map(chip => (
                              <span
                                key={`${d.text}-${chip.label}`}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                  chip.tone === 'good'
                                    ? 'bg-emerald/10 text-emerald border-emerald/30'
                                    : chip.tone === 'bad'
                                      ? 'bg-crimson/10 text-crimson border-crimson/30'
                                      : 'bg-navy/70 text-slate border-navy-light'
                                }`}
                              >
                                {chip.label}: {chip.value}
                              </span>
                            ))}
                          </div>
                          <p className="text-slate text-xs mt-4">Real-time preview: this is the immediate impact before year-end growth and inflation.</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Random Event */}
              {!game.completed && currentEvent && (
                <div className="bg-navy-surface border border-gold/30 rounded-2xl p-6">
                  <p className="text-gold text-sm font-medium mb-1">Life Event!</p>
                  <p className="text-white text-base mb-4">{currentEvent.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentEvent.choices.map((c, i) => {
                      const impactChips = getImpactPreview(game, c.effect(game));

                      return (
                        <button
                          key={i}
                          onClick={() => handleEvent(c)}
                          className={`rounded-lg text-sm font-medium transition-all duration-200 p-4 text-left ${
                            i === 0 ? 'bg-crimson/20 border border-crimson/40 text-crimson hover:bg-crimson/30' : 'bg-emerald/20 border border-emerald/40 text-emerald hover:bg-emerald/30'
                          }`}
                        >
                          <p className="mb-3">{c.label}</p>
                          <div className="flex flex-wrap gap-2">
                            {impactChips.map(chip => (
                              <span
                                key={`${c.label}-${chip.label}`}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                                  chip.tone === 'good'
                                    ? 'bg-emerald/10 text-emerald border-emerald/30'
                                    : chip.tone === 'bad'
                                      ? 'bg-crimson/10 text-crimson border-crimson/30'
                                      : 'bg-navy/70 text-slate border-navy-light'
                                }`}
                              >
                                {chip.label}: {chip.value}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
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
                      <p className="text-slate text-sm italic">
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
      </div>

      <style>{`
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ratRunBob {
          0% { transform: translateY(0px); }
          50% { transform: translateY(2px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
}

