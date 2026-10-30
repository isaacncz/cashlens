import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const rules = [
  {
    title: 'Buy cash flow, not status',
    body: 'A payment that leaves your pocket each month is pressure. A payment covered by an asset is leverage.',
  },
  {
    title: 'Protect liquidity first',
    body: 'EPF is useful, but liquidity is survival. Real freedom starts with assets you can actually access.',
  },
  {
    title: 'Measure time, not just money',
    body: 'If an income stream still depends on your hours, it is not freedom yet.',
  },
];

const myths = [
  { myth: 'High salary = rich', reality: 'If expenses rise with salary, freedom barely moves.' },
  { myth: 'All debt is bad', reality: 'Debt is only useful when it improves cashflow and buys back time.' },
  { myth: 'Own-stay house = asset', reality: 'If it drains monthly cash, it behaves like a liability.' },
];

const actions = [
  'Track every recurring monthly outflow for 7 days.',
  'Automate one small wealth habit: ASB, savings, or debt reduction.',
  'Remove one payment that buys status but not cashflow.',
];

export default function LiteracyPlaybook() {
  const [activeMyth, setActiveMyth] = useState(0);
  const [doneActions, setDoneActions] = useState<number[]>([]);

  const toggleAction = (index: number) => {
    setDoneActions((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]));
  };

  return (
    <section id="literacy-playbook" className="lesson" aria-labelledby="literacy-playbook-heading">
      <header className="lesson-intro">
        <h1 id="literacy-playbook-heading">Learn the rule. Use it anywhere.</h1>
        <p>Financial literacy only matters if you can apply it. Tap through the myths and action steps.</p>
      </header>

      <div className="lesson-stack">
        <section className="lesson-stack" aria-labelledby="lp-week-heading">
          <h2 id="lp-week-heading" className="lesson-heading">Start this week</h2>
          <div className="choice-list">
            {actions.map((action, index) => {
              const done = doneActions.includes(index);
              return <button key={action} type="button" className="choice-card lp-action" aria-pressed={done} onClick={() => toggleAction(index)}>
                <span className="lesson-marker" data-visited={done}>{done ? <Check size={16} strokeWidth={2.5} aria-hidden="true" /> : index + 1}</span>
                <span>{action}</span>
              </button>;
            })}
          </div>
          <p className="lesson-muted"><strong>Definition of progress ({doneActions.length}/{actions.length} done):</strong> Your next ringgit should either increase liquidity, reduce expensive debt, or create future cashflow.</p>
        </section>

        <section className="lesson-card lp-myths" aria-labelledby="lp-myth-heading">
          <h2 id="lp-myth-heading">Myth vs reality</h2>
          <div className="segmented" role="group" aria-label="Choose a myth">
            {myths.map((item, index) => <button key={item.myth} type="button" aria-pressed={activeMyth === index} onClick={() => setActiveMyth(index)}>Myth {index + 1}</button>)}
          </div>
          <div aria-live="polite">
            <p className="tone-bad"><strong>Myth:</strong> {myths[activeMyth].myth}</p>
            <p className="tone-good"><strong>Reality:</strong> {myths[activeMyth].reality}</p>
          </div>
        </section>

        <div className="lesson-disclosures">
          {rules.map(rule => (
            <details key={rule.title} className="lesson-disclosure">
              <summary><span><span>{rule.title}</span><span>Rule</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
              <div><p>{rule.body}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
