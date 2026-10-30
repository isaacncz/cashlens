import { formatMoney } from '../lib/currency';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Character {
  name: string;
  title: string;
  salary: number;
  salaryLabel: string;
  accent: string;
  borderColor: string;
  glowColor: string;
  expenses: number;
  freedom: number;
  freedomLabel: string;
  freedomColor: string;
  tagline: string;
  details: string[];
  sourceLabels: { label: string; amount: number }[];
  isWinner?: boolean;
}

const characters: Character[] = [
  {
    name: 'Dr. Lim',
    title: 'Specialist',
    salary: 25000,
    salaryLabel: 'RM 25,000/month',
    accent: 'text-gold',
    borderColor: 'border-navy-light',
    glowColor: 'rgba(255,215,0,0.1)',
    expenses: 22000,
    freedom: 8,
    freedomLabel: '8 months',
    freedomColor: 'var(--ledger-negative)',
    tagline: 'Highest income. Lowest freedom.',
    details: ['Tax bracket: 24% + 26% above RM 400K', 'EPF maxed: RM 33K/year', 'Bungalow + BMW + International school'],
    sourceLabels: [
      { label: 'Salary', amount: 25000 },
      { label: 'Expenses', amount: 22000 },
    ],
  },
  {
    name: 'Manager Kumar',
    title: 'Manager',
    salary: 8000,
    salaryLabel: 'RM 8,000/month',
    accent: 'text-slate-light',
    borderColor: 'border-navy-light',
    glowColor: 'rgba(136,146,176,0.1)',
    expenses: 6500,
    freedom: 14,
    freedomLabel: '14 months',
    freedomColor: 'var(--ledger-accent)',
    tagline: 'Good salary. Moderate discipline.',
    details: ['Tax: 11-19% bracket', 'Small ASB contribution', 'Moderate lifestyle'],
    sourceLabels: [
      { label: 'Salary', amount: 8000 },
      { label: 'ASB', amount: 200 },
      { label: 'Expenses', amount: 6500 },
    ],
  },
  {
    name: 'Investor Aisyah',
    title: 'Investor',
    salary: 6000,
    salaryLabel: 'RM 6,000/month passive',
    accent: 'text-emerald',
    borderColor: 'border-emerald',
    glowColor: 'rgba(16,185,129,0.2)',
    expenses: 5500,
    freedom: Infinity,
    freedomLabel: 'INFINITE',
    freedomColor: 'var(--ledger-positive)',
    tagline: 'She stopped working at 42. Her income never did.',
    details: ['ASB dividends: RM 2,000', 'Rental (2 rooms): RM 2,500', 'Dividend stocks: RM 1,500', 'Tax: Minimal'],
    sourceLabels: [
      { label: 'ASB', amount: 2000 },
      { label: 'Rental', amount: 2500 },
      { label: 'Stocks', amount: 1500 },
    ],
    isWinner: true,
  },
];

export default function SalaryWealth() {
  const [limSalary, setLimSalary] = useState(25000);
  const [selected, setSelected] = useState(0);
  const adjustedLimFreedom = Math.max(1, 8 * (25000 / Math.max(limSalary, 1000)));
  const c = characters[selected];
  const isInfinite = c.freedom === Infinity;
  const displayFreedom = selected === 0 ? adjustedLimFreedom : c.freedom;
  const fill = isInfinite ? 100 : Math.min(100, (displayFreedom / 60) * 100);
  const freedomTone = isInfinite ? 'tone-good' : selected === 0 ? (adjustedLimFreedom < 12 ? 'tone-bad' : '') : c.freedom < 12 ? 'tone-bad' : '';

  return (
    <section id="salary-wealth" className="lesson" aria-labelledby="salary-wealth-heading">
      <header className="lesson-intro">
        <h1 id="salary-wealth-heading">High salary. Zero freedom.</h1>
        <p>Three Malaysians. Three incomes. One truth.</p>
      </header>

      <div className="lesson-stack">
        <div className="segmented" role="group" aria-label="Choose a person">
          {characters.map((person, i) => <button key={person.name} type="button" aria-pressed={selected === i} onClick={() => setSelected(i)}>{person.name.split(' ').pop()}</button>)}
        </div>

        <section className="lesson-card sw-person" aria-live="polite" aria-labelledby="sw-person-name">
          <div className="sw-person-head">
            <div><h2 id="sw-person-name">{c.name}</h2><p className="lesson-muted">{c.title}{c.isWinner ? ' · Financially free' : ''}</p></div>
            <strong className={c.isWinner ? 'tone-good' : ''}>{selected === 0 ? `RM ${formatMoney(limSalary)}/month` : c.salaryLabel}</strong>
          </div>
          <dl className="lesson-rows">
            {c.sourceLabels.filter(source => source.label !== 'Expenses').map(source => <div key={source.label}><dt>{source.label}</dt><dd>{selected === 0 && source.label === 'Salary' ? `RM ${formatMoney(limSalary)}` : `RM ${formatMoney(source.amount)}`}</dd></div>)}
            <div><dt>Expenses</dt><dd className="tone-bad">RM {selected === 0 ? formatMoney(limSalary * 0.88) : formatMoney(c.expenses)}</dd></div>
          </dl>
          <div className="lesson-total"><span>Freedom</span><strong className={freedomTone}>{isInfinite ? 'INFINITE' : `${displayFreedom.toFixed(0)} months`}</strong></div>
          <div className="meter meter-freedom" aria-hidden="true"><span style={{ width: `${fill}%` }} /></div>
          <p className="lesson-quote">"{c.tagline}"</p>
          {selected === 0 && <div className="sw-slider">
            <div className="sw-slider-label"><label htmlFor="sw-lim-salary">Adjust Dr. Lim's salary</label><strong>RM {formatMoney(limSalary)}</strong></div>
            <input id="sw-lim-salary" type="range" className="lesson-range" aria-label="Dr. Lim monthly salary" min="25000" max="100000" step="1000" value={limSalary} onChange={e => setLimSalary(parseInt(e.target.value))} />
            <div className="sw-slider-ends" aria-hidden="true"><span>RM 25,000</span><span>RM 100,000</span></div>
            <p className="lesson-muted">Notice: More salary ≠ More freedom</p>
          </div>}
        </section>

        <div className="lesson-disclosures">
          <details className="lesson-disclosure">
            <summary><span><span>About {c.name}</span><span>Tax, savings and lifestyle</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div><ul className="rr-log">{c.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>The EPF Illusion</span><span>Why EPF is not liquid wealth</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <p>"Dr. Lim has RM 800K in EPF. He thinks he's rich. But he cannot touch it until 55. And Account 1 is 70% locked. Is this wealth or a government-managed allowance?"</p>
              <dl className="lesson-rows">
                <div><dt>EPF Account 1 <small>Locked until 55/60</small></dt><dd>70%</dd></div>
                <div><dt>EPF Account 2 <small>Accessible (limited)</small></dt><dd>30%</dd></div>
                <div><dt>True Liquidity <small>EPF is not wealth. It's forced savings.</small></dt><dd className="tone-bad">~30%</dd></div>
              </dl>
            </div>
          </details>
        </div>
      </div>

      <p className="lesson-quote">"{characters[0].name} makes 5x more than {characters[2].name}. But {characters[2].name} can stop working <strong>forever.</strong>"</p>
    </section>
  );
}
