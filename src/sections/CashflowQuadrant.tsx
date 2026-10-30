import { formatMoney } from '../lib/currency';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Quadrant = 'E' | 'S' | 'B' | 'I';
const TAX_OUT = 'var(--ledger-negative)';

interface QuadrantData {
  key: Quadrant;
  label: string;
  name: string;
  persona: string;
  income: string;
  monthlyIncome: number;
  taxAmount: number;
  epfAmount: number;
  timeHours: number;
  netTakeHome: number;
  accent: string;
  borderColor: string;
  tagline: string;
  details: string[];
  pipeColors: { tax: string; epf: string; time: string; income: string };
  pipeWidths: { tax: number; epf: number; time: number; income: number };
}

const quadrants: QuadrantData[] = [
  {
    key: 'E',
    label: 'E — EMPLOYEE',
    name: 'Ahmad',
    persona: 'Software Engineer at GLC',
    income: 'RM 8,000/month',
    monthlyIncome: 8000,
    taxAmount: 980,
    epfAmount: 880,
    timeHours: 160,
    netTakeHome: 6140,
    accent: 'text-crimson',
    borderColor: 'border-crimson',
    tagline: "Your salary makes your boss rich. Who makes you rich?",
    details: ['LHDN progressive tax up to 24%', 'EPF: 11% employee + 12% employer (locked)', '9-to-6 + MRT commute', 'Highest tax burden, zero time freedom'],
    pipeColors: { tax: TAX_OUT, epf: 'var(--ledger-warning)', time: 'var(--ledger-negative)', income: 'var(--ledger-accent)' },
    pipeWidths: { tax: 28, epf: 23, time: 45, income: 35 },
  },
  {
    key: 'S',
    label: 'S — SELF-EMPLOYED',
    name: 'Sarah',
    persona: 'Freelance Designer',
    income: 'RM 12,000/month',
    monthlyIncome: 12000,
    taxAmount: 1650,
    epfAmount: 0,
    timeHours: 220,
    netTakeHome: 10350,
    accent: 'text-slate-light',
    borderColor: 'border-slate',
    tagline: "Sarah earns more than Ahmad. But she has no safety net.",
    details: ['No employer EPF contribution', 'Higher effective tax rate', 'No work = No income', 'Time pipe is WIDEST'],
    pipeColors: { tax: TAX_OUT, epf: 'var(--ledger-muted)', time: 'var(--ledger-negative)', income: 'var(--ledger-accent)' },
    pipeWidths: { tax: 35, epf: 0, time: 55, income: 42 },
  },
  {
    key: 'B',
    label: 'B — BUSINESS OWNER',
    name: 'Raj',
    persona: 'Sdn Bhd Owner',
    income: 'Corporate tax: 24%',
    monthlyIncome: 18000,
    taxAmount: 2700,
    epfAmount: 900,
    timeHours: 40,
    netTakeHome: 14400,
    accent: 'text-emerald',
    borderColor: 'border-emerald',
    tagline: "Raj's company pays his lifestyle. These are expenses, not liabilities.",
    details: ['Company pays car, phone, travel', 'Dividends: tax-exempt up to RM 100K', 'Leverage through business structure', 'Thin time pipe'],
    pipeColors: { tax: TAX_OUT, epf: 'var(--ledger-warning)', time: 'var(--ledger-positive)', income: 'var(--ledger-positive)' },
    pipeWidths: { tax: 15, epf: 10, time: 8, income: 50 },
  },
  {
    key: 'I',
    label: 'I — INVESTOR',
    name: 'Aminah',
    persona: 'ASB + Rental Portfolio',
    income: 'RM 6,000/month passive',
    monthlyIncome: 6000,
    taxAmount: 150,
    epfAmount: 0,
    timeHours: 0,
    netTakeHome: 5850,
    accent: 'text-gold',
    borderColor: 'border-gold',
    tagline: "Aminah stopped working at 42. Her income never did.",
    details: ['ASB dividends + rental + dividend stocks', 'Tax: Minimal (dividends exempt)', 'Time pipe: GONE', 'Multiple income streams'],
    pipeColors: { tax: TAX_OUT, epf: 'var(--ledger-warning)', time: 'var(--ledger-positive)', income: 'var(--ledger-accent)' },
    pipeWidths: { tax: 5, epf: 5, time: 0, income: 60 },
  },
];

function formatRinggit(amount: number) {
  return `RM ${formatMoney(amount)}`;
}

const quadrantName = (label: string) => label.replace(/ — (.*)/, (_, name: string) => ` — ${name.charAt(0)}${name.slice(1).toLowerCase()}`);

export default function CashflowQuadrant() {
  const [selected, setSelected] = useState<Quadrant>('E');
  const q = quadrants.find(item => item.key === selected)!;

  return (
    <section id="cashflow-quadrant" className="lesson" aria-labelledby="cashflow-quadrant-heading">
      <header className="lesson-intro">
        <h1 id="cashflow-quadrant-heading">Your quadrant determines your flow.</h1>
        <p>Select a quadrant. See how money and time move.</p>
      </header>

      <div className="lesson-stack">
        <fieldset className="segmented-field">
          <legend>Quadrant</legend>
          <div className="segmented">
            {quadrants.map(item => (
              <label key={item.key}>
                <input type="radio" name="cashflow-quadrant" value={item.key} checked={selected === item.key} onChange={() => setSelected(item.key)} aria-label={quadrantName(item.label)} />
                <span aria-hidden="true">{item.key}</span>
              </label>
            ))}
          </div>
          <p className="segmented-caption">{quadrantName(q.label)}</p>
        </fieldset>

        <section className="lesson-card cq-person" aria-live="polite" aria-labelledby="cq-person-name">
          <div className="sw-person-head">
            <div><h2 id="cq-person-name">{q.name}</h2><p className="lesson-muted">{q.persona}</p></div>
            <strong>{q.income}</strong>
          </div>
          <dl className="lesson-rows">
            <div><dt>Income in <small>This is the top of the pipeline before deductions.</small></dt><dd>{formatRinggit(q.monthlyIncome)}</dd></div>
            <div><dt>Tax out <small>Paid first to LHDN based on income band.</small></dt><dd className="tone-bad">{formatRinggit(q.taxAmount)}</dd></div>
            <div><dt>EPF out <small>Forced savings that is useful later, but less liquid today.</small></dt><dd className="tone-warn">{formatRinggit(q.epfAmount)}</dd></div>
            <div><dt>Time trade <small>{q.timeHours === 0 ? 'Your income is no longer tied to working hours.' : 'These hours are the real cost behind the paycheck.'}</small></dt><dd className={q.timeHours === 0 ? 'tone-good' : 'tone-bad'}>{q.timeHours === 0 ? 'No time trade' : `${q.timeHours} hrs/month`}</dd></div>
          </dl>
          <div className="lesson-total"><span>Net usable flow</span><strong>{formatRinggit(q.netTakeHome)}</strong></div>
          <p className="lesson-quote">"{q.tagline}"</p>
        </section>

        <div className="lesson-disclosures">
          <details className="lesson-disclosure">
            <summary><span><span>How {q.name}'s money moves</span><span>Flow diagram and details</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <ul className="rr-log">{q.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
              <svg width="100%" height="260" viewBox="0 0 300 260" role="img" aria-label={`${q.name}: income, tax, EPF, time and net flow`}>
                {/* Income source */}
                <circle cx="150" cy="24" r="12" fill={q.pipeColors.income} opacity="0.3" />
                <title>{`${q.name} monthly income: ${formatRinggit(q.monthlyIncome)}`}</title>
                <text x="150" y="28" textAnchor="middle" fill={q.pipeColors.income} fontSize="12" fontWeight="bold">IN</text>
                <text x="150" y="48" textAnchor="middle" fill={'var(--ledger-ink)'} fontSize="14" fontWeight="bold">{formatRinggit(q.monthlyIncome)}</text>
                <text x="150" y="63" textAnchor="middle" fill={'var(--ledger-muted)'} fontSize="14">Income enters</text>
                {/* Main flow down */}
                <line x1="150" y1="36" x2="150" y2="212" stroke={q.pipeColors.income} strokeWidth="3" opacity="0.5" />
                <text x="160" y="86" fill={'var(--ledger-muted)'} fontSize="14">↓ Cashflow</text>
                {/* Tax branch */}
                <line x1="150" y1="92" x2="60" y2="92" stroke={q.pipeColors.tax} strokeWidth={Math.max(2, q.pipeWidths.tax / 8)} opacity="0.8" />
                <polygon points="60,92 68,88 68,96" fill={q.pipeColors.tax} opacity="0.8" />
                <text x="26" y="88" fill={q.pipeColors.tax} fontSize="14" fontWeight="bold">Tax</text>
                <text x="26" y="102" fill={'var(--ledger-ink)'} fontSize="14">{formatRinggit(q.taxAmount)}</text>
                {/* EPF branch */}
                <line x1="150" y1="136" x2="60" y2="136" stroke={q.pipeColors.epf} strokeWidth={Math.max(2, q.pipeWidths.epf / 8)} opacity="0.8" />
                <polygon points="60,136 68,132 68,140" fill={q.pipeColors.epf} opacity="0.8" />
                <text x="26" y="132" fill={q.pipeColors.epf} fontSize="14" fontWeight="bold">EPF</text>
                <text x="26" y="146" fill={'var(--ledger-ink)'} fontSize="14">{formatRinggit(q.epfAmount)}</text>
                {/* Time branch */}
                {q.pipeWidths.time > 0 && (
                  <>
                    <line x1="150" y1="178" x2="240" y2="178" stroke={q.pipeColors.time} strokeWidth={Math.max(2, q.pipeWidths.time / 8)} opacity="0.8" />
                    <text x="250" y="174" fill={q.pipeColors.time} fontSize="14" fontWeight="bold">Time</text>
                    <text x="250" y="188" fill={'var(--ledger-ink)'} fontSize="14">{q.timeHours} hrs</text>
                    <polygon points="240,178 232,174 232,182" fill={q.pipeColors.time} opacity="0.8" />
                  </>
                )}
                {q.pipeWidths.time === 0 && (
                  <>
                    <rect x="168" y="164" width="96" height="28" rx="14" fill={'var(--ledger-positive)'} opacity="0.14" />
                    <text x="216" y="182" textAnchor="middle" fill={'var(--ledger-positive)'} fontSize="13" fontWeight="bold">NO TIME TRADE</text>
                  </>
                )}
                {/* Net flow */}
                <circle cx="150" cy="214" r="8" fill={q.pipeColors.income} opacity="0.6" />
                <text x="150" y="232" textAnchor="middle" fill={'var(--ledger-accent)'} fontSize="13" fontWeight="bold">NET LEFT</text>
                <text x="150" y="248" textAnchor="middle" fill={'var(--ledger-ink)'} fontSize="14" fontWeight="bold">{formatRinggit(q.netTakeHome)}</text>
                {/* Flowing particles */}
                <circle r="2" fill={q.pipeColors.income}>
                  <animate attributeName="cy" values="42;208" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="cx" values="150;150" dur="2s" repeatCount="indefinite" />
                </circle>
                {q.pipeWidths.tax > 10 && (
                  <circle r="1.5" fill={q.pipeColors.tax}>
                    <animate attributeName="cx" values="150;65" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="92;92" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {q.pipeWidths.time > 10 && (
                  <circle r="1.5" fill={q.pipeColors.time}>
                    <animate attributeName="cx" values="150;235" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="178;178" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </svg>
            </div>
          </details>
        </div>
      </div>

      <p className="lesson-quote">"{quadrants[0].name} and {quadrants[3].name} both 'make' RM 8,000. But {quadrants[0].name} trades 160 hours. {quadrants[3].name} trades <strong>zero.</strong>"</p>
    </section>
  );
}
