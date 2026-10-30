import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const companyStreams = [
  { label: 'Cloud', amount: '35%', color: 'var(--ledger-info)', note: 'High-margin recurring revenue' },
  { label: 'Office / SaaS', amount: '27%', color: 'var(--ledger-positive)', note: 'Subscription cashflow' },
  { label: 'Devices / OS', amount: '21%', color: 'var(--ledger-accent)', note: 'Installed base moat' },
  { label: 'Ads / Gaming / Other', amount: '17%', color: 'var(--ledger-warning)', note: 'Extra upside and spread' },
];

const personalStreams = [
  { label: 'Primary salary', amount: 'RM 6,000', color: 'var(--ledger-info)', note: 'Funds the first move' },
  { label: 'Freelance / service', amount: 'RM 1,200', color: 'var(--ledger-positive)', note: 'Turns skill into cashflow' },
  { label: 'Dividends / ASB', amount: 'RM 500', color: 'var(--ledger-accent)', note: 'Owned capital starts paying you' },
  { label: 'Rental / digital product', amount: 'RM 800', color: 'var(--ledger-warning)', note: 'Income that can keep running' },
];

const reasons = [
  {
    title: 'Resilience',
    body: 'If one stream slows down, your whole life does not collapse with it.',
  },
  {
    title: 'Optionality',
    body: 'A second and third stream buy negotiating power, career flexibility, and time.',
  },
  {
    title: 'Compounding',
    body: 'Small streams stacked together can outperform one big salary over time.',
  },
];

const steps = [
  'Start with one stable stream.',
  'Add one skill-based side income.',
  'Convert savings into assets that pay.',
  'Repeat until one payer no longer controls your life.',
];

const models = {
  company: { label: 'Company', eyebrow: 'Company model', title: 'How big companies think', profileLabel: 'Risk profile', profile: 'Diversified revenue', streams: companyStreams, noteLabel: 'Lesson', note: 'A company becomes stronger when one line does not have to carry the whole machine.' },
  personal: { label: 'Personal', eyebrow: 'Personal model', title: 'How an individual can copy it', profileLabel: 'Target profile', profile: 'One person, four streams', streams: personalStreams, noteLabel: 'Reality check', note: 'You do not need to build all four at once. The goal is to stop relying on exactly one payer forever.' },
} as const;

export default function IncomeEngine() {
  const [view, setView] = useState<keyof typeof models>('company');
  const model = models[view];

  return (
    <section id="income-engine" className="lesson" aria-labelledby="income-engine-heading">
      <header className="lesson-intro">
        <h1 id="income-engine-heading">Build income beyond your salary.</h1>
        <p>Compare a business with a personal income mix. See how several streams can reduce reliance on a single payer.</p>
      </header>

      <div className="lesson-stack">
        <div className="segmented" role="group" aria-label="Income model">
          {(Object.keys(models) as (keyof typeof models)[]).map(key => <button key={key} type="button" aria-pressed={view === key} onClick={() => setView(key)}>{models[key].label}</button>)}
        </div>
        <p className="segmented-caption">Same principle. Different scale.</p>

        <section className="lesson-card ie-model" aria-live="polite" aria-labelledby="ie-model-title">
          <p className="lesson-muted">{model.eyebrow} · {model.profileLabel}: <strong>{model.profile}</strong></p>
          <h2 id="ie-model-title">{model.title}</h2>
          <ul className="ie-streams">
            {model.streams.map((stream, index) => (
              <li key={stream.label}>
                <div><span><strong>{stream.label}</strong><small>{stream.note}</small></span><span className="ie-amount">{stream.amount}</span></div>
                <span className="meter" aria-hidden="true"><span style={{ width: view === 'company' ? stream.amount : `${Math.min(100, ((index + 1) / personalStreams.length) * 100)}%`, background: stream.color }} /></span>
              </li>
            ))}
          </ul>
          <p className="lesson-muted"><strong>{model.noteLabel}:</strong> {model.note}</p>
        </section>

        <div className="lesson-disclosures">
          <details className="lesson-disclosure">
            <summary><span><span>Why more than one stream</span><span>Resilience · Optionality · Compounding</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>{reasons.map(reason => <div key={reason.title}><h3>{reason.title}</h3><p>{reason.body}</p></div>)}</div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>One stream = one point of failure</span><span>Fragile vs resilient setups</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <p><strong>When your salary is your only engine, job loss feels like total shutdown.</strong> The goal of side income is not just “extra money.” It is to reduce fragility. A second stream gives breathing room. A third starts creating real freedom.</p>
              <dl className="lesson-rows">
                <div><dt>Fragile setup <small>One boss, one paycheck, one disruption away from pressure.</small></dt><dd className="tone-bad">1 income stream</dd></div>
                <div><dt>Resilient setup <small>More margin, more options, and less fear around one source slowing down.</small></dt><dd className="tone-good">3 to 4 income streams</dd></div>
              </dl>
            </div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>Simple path to start</span><span>Four steps</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div><ol className="lesson-steps">{steps.map(step => <li key={step}>{step}</li>)}</ol></div>
          </details>
        </div>
      </div>
    </section>
  );
}
