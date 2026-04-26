import { useMemo, useState } from 'react';

const lessons = [
  {
    title: 'AI Tool or AI Asset?',
    subtitle: 'Most people buy speed. Owners build repeatable cashflow.',
    choices: [
      'I mostly use AI to finish tasks faster.',
      'I use AI to increase output volume.',
      'I am building AI systems that run without me.',
      'I am still figuring it out.',
    ],
  },
  {
    title: 'Skill vs Asset',
    subtitle: 'Skill saves time. Asset keeps producing value when you are offline.',
  },
  {
    title: 'Cashflow Lens Questions',
    subtitle: 'Replace fear with better financial questions.',
  },
  {
    title: 'Measure Return',
    subtitle: 'Use AI ROI to decide if your spend is leverage or just convenience.',
  },
] as const;

export default function AIIncomeLab() {
  const [step, setStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [costAnswer, setCostAnswer] = useState('');
  const [outputAnswer, setOutputAnswer] = useState('');
  const [cashflowAnswer, setCashflowAnswer] = useState('');

  const [spend, setSpend] = useState('100');
  const [costSaved, setCostSaved] = useState('0');
  const [extraRevenue, setExtraRevenue] = useState('0');

  const spendNum = Number(spend) || 0;
  const costSavedNum = Number(costSaved) || 0;
  const extraRevenueNum = Number(extraRevenue) || 0;

  const roi = useMemo(() => {
    if (spendNum <= 0) return null;
    return (costSavedNum + extraRevenueNum) / spendNum;
  }, [costSavedNum, extraRevenueNum, spendNum]);

  const roiLabel =
    roi === null ? 'Enter monthly AI spend to calculate ROI.'
      : roi < 1 ? 'You are learning, but your AI stack is not profitable yet.'
      : roi < 3 ? 'Positive return. Keep improving your system every week.'
      : 'Strong leverage. You are moving from user mindset to owner mindset.';

  const progress = ((step + 1) / lessons.length) * 100;

  return (
    <section id="ai-income-lab" className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[960px] mx-auto px-6 md:px-12">
        <p className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">Module 10 / AI Income Lab</p>
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Learn AI Fast.
          {' '}
          <span className="text-gold">Build AI Cashflow.</span>
        </h2>
        <p className="text-slate text-base md:text-lg mb-6 max-w-2xl">
          This chapter is interactive on purpose: short screens, clear money decisions, and one action plan.
        </p>

        <div className="w-full bg-navy-light rounded-full h-2 mb-8 overflow-hidden">
          <div className="bg-gold h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8">
          <p className="text-gold/90 text-xs uppercase tracking-[0.12em] mb-2">Step {step + 1} of {lessons.length}</p>
          <h3 className="text-white text-2xl font-bold mb-2">{lessons[step].title}</h3>
          <p className="text-slate text-sm md:text-base mb-6">{lessons[step].subtitle}</p>

          {step === 0 && (
            <div className="space-y-3">
              {lessons[0].choices.map((choice, index) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => setSelectedChoice(index)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedChoice === index
                      ? 'border-gold/45 bg-gold/10 text-gold'
                      : 'border-navy-light bg-navy/50 text-slate hover:border-gold/30'
                  }`}
                >
                  {choice}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-navy-light bg-navy/50 p-5">
                <p className="text-crimson text-xs uppercase tracking-[0.1em] font-semibold mb-3">AI as skill</p>
                <ul className="text-slate text-sm space-y-2 list-disc pl-5">
                  <li>Faster writing, admin, and research.</li>
                  <li>Better personal productivity.</li>
                  <li>Income still depends on your active time.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-5">
                <p className="text-emerald text-xs uppercase tracking-[0.1em] font-semibold mb-3">AI as asset</p>
                <ul className="text-slate text-sm space-y-2 list-disc pl-5">
                  <li>Creates repeatable output and lead flow.</li>
                  <li>Supports follow-up and conversion automatically.</li>
                  <li>Builds cashflow with less manual effort.</li>
                </ul>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-white text-sm font-medium">How can AI reduce your cost?</span>
                <input
                  value={costAnswer}
                  onChange={(event) => setCostAnswer(event.target.value)}
                  placeholder="Example: reduce editing cost by 30%"
                  className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35"
                />
              </label>
              <label className="block">
                <span className="text-white text-sm font-medium">How can AI increase your output?</span>
                <input
                  value={outputAnswer}
                  onChange={(event) => setOutputAnswer(event.target.value)}
                  placeholder="Example: publish 3 posts per week"
                  className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35"
                />
              </label>
              <label className="block">
                <span className="text-white text-sm font-medium">How can AI create recurring cashflow?</span>
                <input
                  value={cashflowAnswer}
                  onChange={(event) => setCashflowAnswer(event.target.value)}
                  placeholder="Example: automated lead nurture + booking"
                  className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35"
                />
              </label>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-white text-sm font-medium">Monthly AI spend ($)</span>
                  <input value={spend} onChange={(event) => setSpend(event.target.value)} type="number" min="0" className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35" />
                </label>
                <label className="block">
                  <span className="text-white text-sm font-medium">Monthly cost saved ($)</span>
                  <input value={costSaved} onChange={(event) => setCostSaved(event.target.value)} type="number" min="0" className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35" />
                </label>
                <label className="block">
                  <span className="text-white text-sm font-medium">Monthly extra revenue ($)</span>
                  <input value={extraRevenue} onChange={(event) => setExtraRevenue(event.target.value)} type="number" min="0" className="mt-2 w-full rounded-xl border border-navy-light bg-navy/50 text-slate px-4 py-3 outline-none focus:border-gold/35" />
                </label>
              </div>

              <div className="rounded-xl border border-gold/20 bg-gold/10 p-5">
                <p className="text-gold text-xs uppercase tracking-[0.1em] font-semibold mb-3">AI ROI</p>
                <p className="text-white text-2xl font-bold mb-2">{roi === null ? '--' : roi.toFixed(2)}x</p>
                <p className="text-slate text-sm mb-3">(Cost Saved + Extra Revenue) / AI Spend</p>
                <p className="text-white text-sm">{roiLabel}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-lg border border-navy-light text-slate disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(lessons.length - 1, prev + 1))}
              disabled={step === lessons.length - 1}
              className="px-4 py-2 rounded-lg border border-gold/35 bg-gold/15 text-gold font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-emerald/20 bg-emerald/10 p-4">
          <p className="text-emerald text-sm font-semibold mb-1">Your one-line takeaway</p>
          <p className="text-slate text-sm">If AI only saves your time, it is a skill. If AI generates repeatable cashflow, it is an asset.</p>
        </div>
      </div>
    </section>
  );
}
