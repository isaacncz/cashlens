import { formatMoney } from '../lib/currency';
import { useState, useMemo } from 'react';
import { Car, ChevronDown, GraduationCap, House, Landmark, Laptop, PiggyBank, Smartphone, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
  icon: LucideIcon;
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
    icon: Car,
  },
  {
    text: 'Start ASB auto-deduction — RM 200/month',
    effect: s => ({
      asbBalance: s.asbBalance + 2400,
      passiveIncome: s.passiveIncome + 10,
    }),
    icon: Landmark,
  },
  {
    text: 'Aggressively pay PTPTN — RM 500/month',
    effect: s => ({
      ptptnDebt: Math.max(0, s.ptptnDebt - 6000),
      expenses: s.expenses + 500,
    }),
    icon: GraduationCap,
  },
  {
    text: 'Upgrade to iPhone — RM 200/month installment',
    effect: s => ({ expenses: s.expenses + 200 }),
    icon: Smartphone,
  },
  {
    text: 'Invest in dividend stocks — RM 300/month',
    effect: s => ({
      passiveIncome: s.passiveIncome + 25,
      expenses: s.expenses + 300,
    }),
    icon: TrendingUp,
  },
  {
    text: 'Minimal lifestyle, max savings — RM 400/month to ASB',
    effect: s => ({
      asbBalance: s.asbBalance + 4800,
      passiveIncome: s.passiveIncome + 20,
    }),
    icon: PiggyBank,
  },
  {
    text: 'Side hustle — freelance on weekends',
    effect: s => ({ salary: s.salary + 500 }),
    icon: Laptop,
  },
  {
    text: 'Rent out a spare room — RM 500/month income',
    effect: s => ({ passiveIncome: s.passiveIncome + 500 }),
    icon: House,
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
  return `${value > 0 ? '+' : value < 0 ? '-' : ''}RM ${formatMoney(Math.abs(value))}`;
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
        color: ['var(--ledger-accent)', 'var(--ledger-positive)', 'var(--ledger-ink)'][i % 3],
      })),
    [],
  );





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

  const toneClass = (tone: 'good' | 'bad' | 'neutral') => tone === 'good' ? 'tone-good' : tone === 'bad' ? 'tone-bad' : 'tone-neutral';

  return (
    <section id="rat-race" className="lesson" aria-labelledby="rat-race-heading">
      <header className="lesson-intro">
        <h1 id="rat-race-heading">Work harder. Never leave the wheel.</h1>
        <p>You are a fresh graduate: RM 3,500/month salary, RM 30,000 PTPTN debt. Tap a choice to play Year 1 right away.</p>
      </header>

      <div className="lesson-stack">
        <section className="lesson-card rr-status" aria-label="Your situation">
          <div className="rr-status-head">
            <p><strong>Age {game.age}</strong> · Year {game.year}</p>
            <p>Freedom <strong className={freedomPercent >= 80 ? 'tone-good' : freedomPercent >= 40 ? 'tone-warn' : 'tone-bad'}>{freedomPercent.toFixed(0)}%</strong></p>
          </div>
          <div className="meter" aria-hidden="true"><span style={{ width: `${Math.max(2, freedomPercent)}%` }} /></div>
          <dl className="stat-strip">
            <div><dt>Salary</dt><dd>RM {formatMoney(game.salary)}</dd></div>
            <div><dt>Expenses</dt><dd className="tone-bad">RM {formatMoney(game.expenses)}</dd></div>
            <div><dt>Passive</dt><dd className="tone-good">RM {formatMoney(game.passiveIncome)}</dd></div>
          </dl>
          <p className="lesson-muted">{playerTier} · XP {freedomXp} · Smart streak {smartStreak}</p>
        </section>

        {!game.completed && currentDecisions && (
          <section className="lesson-stack" aria-labelledby="rr-choices-heading">
            <h2 id="rr-choices-heading" className="lesson-heading">Year {game.year} — choose your path</h2>
            <div className="choice-list">
              {currentDecisions.map((d, i) => {
                const impactChips = getImpactPreview(game, d.effect(game));
                const coaching = getDecisionCoaching(game, d.effect(game));
                const xpReward = Math.max(8, Math.round(Math.max(scoreDecision(game, d.effect(game)), 0) / 80));
                const Icon = d.icon;
                return (
                  <button key={i} type="button" className="choice-card" onClick={() => makeDecision(d)}>
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    <span>
                      <strong>{d.text}</strong>
                      <small className={toneClass(coaching.tone)}>{coaching.label} · +{xpReward} XP if this builds freedom</small>
                      <ul className="impact-list">{impactChips.map(chip => <li key={`${d.text}-${chip.label}`}>{chip.label}: <strong className={toneClass(chip.tone)}>{chip.value}</strong></li>)}</ul>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="lesson-muted">Real-time preview: this is the immediate impact before year-end growth and inflation.</p>
          </section>
        )}

        {!game.completed && currentEvent && (
          <section className="lesson-stack" aria-labelledby="rr-event-heading">
            <h2 id="rr-event-heading" className="lesson-heading">Life event: {currentEvent.text}</h2>
            <div className="choice-list">
              {currentEvent.choices.map((c, i) => {
                const impactChips = getImpactPreview(game, c.effect(game));
                return (
                  <button key={i} type="button" className="choice-card" onClick={() => handleEvent(c)}>
                    <span>
                      <strong>{c.label}</strong>
                      <ul className="impact-list">{impactChips.map(chip => <li key={`${c.label}-${chip.label}`}>{chip.label}: <strong className={toneClass(chip.tone)}>{chip.value}</strong></li>)}</ul>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {game.completed && (
          <section id="rat-race-summary" className="lesson-card rr-summary" aria-live="polite">
            {game.won ? (
              <>
                <h2 className="tone-good">You Escaped the Rat Race!</h2>
                <p>At age {game.age}, your passive income of RM {formatMoney(game.passiveIncome)}/month covers your expenses.</p>
                <p className="lesson-quote">"You can balik kampung permanently."</p>
              </>
            ) : (
              <>
                <h2 className="tone-bad">Time's Up.</h2>
                <p>43 years on the wheel. You worked hard. But you never left.</p>
                <p className="lesson-muted">Passive income: RM {formatMoney(game.passiveIncome)} — still short of RM {formatMoney(game.expenses)} expenses.</p>
              </>
            )}
            <button type="button" className="lesson-button" onClick={resetGame}>Play Again</button>
          </section>
        )}

        <div className="lesson-disclosures">
          <details className="lesson-disclosure">
            <summary><span><span>Full status</span><span>Debt, savings and monthly gap</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <dl className="lesson-rows">
                <div><dt>PTPTN Debt</dt><dd className="tone-bad">RM {formatMoney(game.ptptnDebt)}</dd></div>
                <div><dt>ASB Balance</dt><dd>RM {formatMoney(game.asbBalance)}</dd></div>
                <div><dt>Monthly gap right now <small>Positive means your passive income already covers your lifestyle.</small></dt><dd className={monthlyGap >= 0 ? 'tone-good' : 'tone-bad'}>{monthlyGap >= 0 ? '+' : '-'} RM {formatMoney(Math.abs(monthlyGap))}</dd></div>
              </dl>
              {logs.length > 0 && <div><h3>Your choices so far</h3><ul className="rr-log">{logs.map((log, i) => <li key={i}>{log}</li>)}</ul></div>}
            </div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>Coach's lens</span><span>What makes a strong choice</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div><p>A strong choice should increase passive income, reduce debt, or buy back time without permanently locking in higher expenses.</p></div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>The wheel</span><span>Why working harder alone keeps you in place</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <div className="rr-wheel">
            <svg width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="A rat runs on a spinning wheel">
              <defs>
                <radialGradient id="wheelSurface" cx="50%" cy="40%" r="65%">
                  <stop offset="0%" stopColor={'var(--ledger-raised)'} />
                  <stop offset="55%" stopColor={'var(--ledger-raised)'} />
                  <stop offset="100%" stopColor={'var(--ledger-surface)'} />
                </radialGradient>
                <linearGradient id="wheelRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={'var(--ledger-negative)'} />
                  <stop offset="45%" stopColor={'var(--ledger-negative)'} />
                  <stop offset="100%" stopColor={'var(--ledger-negative)'} />
                </linearGradient>
                <linearGradient id="wheelSpoke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={'var(--ledger-negative)'} stopOpacity="0.95" />
                  <stop offset="100%" stopColor={'var(--ledger-negative)'} stopOpacity="0.35" />
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
                  <stop offset="0%" stopColor={'var(--ledger-accent)'} />
                  <stop offset="100%" stopColor={'var(--ledger-warning)'} />
                </linearGradient>
              </defs>

              <circle cx="140" cy="140" r="120" fill="none" stroke={'var(--ledger-negative)'} strokeWidth="2" opacity="0.4" filter="url(#wheelGlow)" />
              <circle cx="140" cy="140" r="114" fill="none" stroke={'var(--ledger-negative)'} strokeWidth="1.2" opacity="0.45" />

              {/* Wheel */}
              <g style={{ animation: game.completed && game.won ? 'none' : `wheelSpin ${wheelSpinDuration} linear infinite`, transformOrigin: '140px 140px' }}>
                <circle cx="140" cy="140" r="110" fill="url(#wheelSurface)" stroke="url(#wheelRim)" strokeWidth="4" filter="url(#wheelGlow)" />
                <circle cx="140" cy="140" r="100" fill="none" stroke={'var(--ledger-negative)'} strokeWidth="1.6" opacity="0.42" />
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
                      fill={index % 2 === 0 ? 'var(--ledger-raised)' : 'var(--ledger-surface)'}
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
                      stroke={'var(--ledger-negative)'}
                      strokeWidth={isMajor ? 1.8 : 0.8}
                      opacity={isMajor ? 0.95 : 0.65}
                    />
                  );
                })}
              </g>

              <path d="M140 16 L148 32 L132 32 Z" fill={'var(--ledger-negative)'} opacity="0.95" filter="url(#wheelGlow)" />

              {/* Rat runner */}
              <g
                opacity={game.completed && game.won ? 0.35 : 1}
                style={{ animation: game.completed && game.won ? 'none' : 'ratRunBob 0.75s ease-in-out infinite', transformOrigin: '140px 56px' }}
              >
                <ellipse cx="140" cy="63" rx="14" ry="8" fill={'var(--ledger-surface)'} opacity="0.45" />
                <ellipse cx="140" cy="54" rx="9.5" ry="7" fill="url(#ratBody)" />
                <ellipse cx="150" cy="53" rx="4.8" ry="4" fill="url(#ratBody)" />
                <circle cx="147.2" cy="48.8" r="2.4" fill={'var(--ledger-accent)'} />
                <circle cx="143.2" cy="49.3" r="2.1" fill={'var(--ledger-accent)'} />
                <circle cx="151.8" cy="52.6" r="0.9" fill={'var(--ledger-raised)'} />
                <line x1="154.3" y1="53.1" x2="158.8" y2="52.5" stroke={'var(--ledger-accent)'} strokeWidth="0.9" />
                <line x1="154.3" y1="53.8" x2="158.8" y2="54.1" stroke={'var(--ledger-accent)'} strokeWidth="0.9" />
                <path d="M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62" fill="none" stroke={'var(--ledger-warning)'} strokeWidth="2.2" strokeLinecap="round">
                  {!game.completed && <animate attributeName="d" values="M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62;M132 57 Q123 61 120 67 Q119 70 122 70 Q126 68 128 65 Q132 61 136 62;M132 57 Q123 60 119 66 Q117 69 120 70 Q124 69 127 66 Q132 62 136 62" dur="0.65s" repeatCount="indefinite" />}
                </path>
                <rect x="136.5" y="59.7" width="3.8" height="7" rx="1.2" fill={'var(--ledger-accent)'} />
                <rect x="142" y="59.7" width="3.8" height="7" rx="1.2" fill={'var(--ledger-accent)'} />
              </g>

              {/* Center hub */}
              <circle cx="140" cy="140" r="10" fill={'var(--ledger-surface)'} opacity="0.75" />
              <circle cx="140" cy="140" r="6" fill={'var(--ledger-negative)'} opacity="0.9" />
              {!game.completed && <circle cx="140" cy="140" r="14" fill="none" stroke={'var(--ledger-negative)'} opacity="0.3">
                <animate attributeName="r" values="12;16;12" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0.1;0.35" dur="1.8s" repeatCount="indefinite" />
              </circle>}
              {/* Freedom bridge */}
              {game.completed && game.won && (
                <>
                  <path d="M 220 140 Q 250 100 260 60" stroke={'var(--ledger-accent)'} strokeWidth="4" fill="none" strokeLinecap="round">
                    <animate attributeName="stroke-dasharray" from="0,200" to="200,0" dur="1.5s" fill="freeze" />
                  </path>
                  {/* Escaped avatar */}
                  <circle cx="260" cy="55" r="8" fill={'var(--ledger-positive)'} />
                  <rect x="254" y="63" width="12" height="16" rx="3" fill={'var(--ledger-positive)'} />
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
              <text x="140" y="242" textAnchor="middle" fill={'var(--ledger-negative)'} fontSize="12" fontWeight="700" letterSpacing="2.1" opacity="1">RAT RACE</text>
              {game.completed && game.won && (
                <text x="260" y="40" textAnchor="middle" fill={'var(--ledger-positive)'} fontSize="10" fontWeight="bold">FREEDOM!</text>
              )}
            </svg>
              </div>
              {!game.completed && <button type="button" className="lesson-button" onClick={workHarder}>Work Harder ({workHarderClicks}x clicked)</button>}
              {message && <p className="tone-bad" role="status">{message}</p>}
            </div>
          </details>
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
