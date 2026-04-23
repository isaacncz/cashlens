import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const companyStreams = [
  { label: 'Cloud', amount: '35%', color: '#38BDF8', note: 'High-margin recurring revenue' },
  { label: 'Office / SaaS', amount: '27%', color: '#10B981', note: 'Subscription cashflow' },
  { label: 'Devices / OS', amount: '21%', color: '#FFD700', note: 'Installed base moat' },
  { label: 'Ads / Gaming / Other', amount: '17%', color: '#F97316', note: 'Extra upside and spread' },
];

const personalStreams = [
  { label: 'Primary salary', amount: 'RM 6,000', color: '#38BDF8', note: 'Funds the first move' },
  { label: 'Freelance / service', amount: 'RM 1,200', color: '#10B981', note: 'Turns skill into cashflow' },
  { label: 'Dividends / ASB', amount: 'RM 500', color: '#FFD700', note: 'Owned capital starts paying you' },
  { label: 'Rental / digital product', amount: 'RM 800', color: '#F97316', note: 'Income that can keep running' },
];

const reasons = [
  {
    title: 'Resilience',
    body: 'If one stream slows down, your whole life does not collapse with it.',
    tone: 'text-emerald',
  },
  {
    title: 'Optionality',
    body: 'A second and third stream buy negotiating power, career flexibility, and time.',
    tone: 'text-gold',
  },
  {
    title: 'Compounding',
    body: 'Small streams stacked together can outperform one big salary over time.',
    tone: 'text-sky-400',
  },
];

const steps = [
  'Start with one stable stream.',
  'Add one skill-based side income.',
  'Convert savings into assets that pay.',
  'Repeat until one payer no longer controls your life.',
];

export default function IncomeEngine() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 32 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
    });
  }, []);

  return (
    <section id="income-engine" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#081424' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 04 / Income Engine
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Big Companies Build{' '}
          <span className="text-gold">Multiple Streams.</span>
          <br />
          You Can Too.
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-3xl">
          Microsoft does not depend on one product. Strong businesses spread revenue across several engines. As an individual,
          you can use the same logic: keep your salary, then slowly add side income, assets, and repeatable cashflow.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-8">
          <div data-reveal className="bg-navy-surface border border-navy-light rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.12em] mb-2">Company model</p>
                <h3 className="text-white text-2xl font-bold">How big companies think</h3>
              </div>
              <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-right">
                <p className="text-slate text-[11px] uppercase tracking-[0.12em] mb-1">Risk profile</p>
                <p className="text-sky-400 font-bold">Diversified revenue</p>
              </div>
            </div>

            <div className="space-y-4">
              {companyStreams.map((stream, index) => (
                <div key={stream.label} className="rounded-2xl border border-navy-light bg-navy/60 p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-white font-semibold">{stream.label}</p>
                      <p className="text-slate text-sm">{stream.note}</p>
                    </div>
                    <p className="font-mono-data text-xl font-bold" style={{ color: stream.color }}>
                      {stream.amount}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-navy-light overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: stream.amount,
                        background: `linear-gradient(90deg, ${stream.color}, rgba(255,255,255,0.2))`,
                        animationDelay: `${index * 120}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-emerald/20 bg-emerald/10 p-4">
              <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-2">Lesson</p>
              <p className="text-slate text-sm leading-relaxed">
                A company becomes stronger when one line does not have to carry the whole machine.
              </p>
            </div>
          </div>

          <div data-reveal className="hidden xl:flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border border-gold/25 bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-2xl">→</span>
              </div>
              <p className="text-slate text-sm text-center max-w-[140px]">
                Same principle.
                <br />
                Different scale.
              </p>
            </div>
          </div>

          <div data-reveal className="bg-navy-surface border border-gold/20 rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-gold text-xs font-semibold uppercase tracking-[0.12em] mb-2">Personal model</p>
                <h3 className="text-white text-2xl font-bold">How an individual can copy it</h3>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-right">
                <p className="text-slate text-[11px] uppercase tracking-[0.12em] mb-1">Target profile</p>
                <p className="text-gold font-bold">One person, four streams</p>
              </div>
            </div>

            <div className="space-y-4">
              {personalStreams.map((stream, index) => (
                <div key={stream.label} className="rounded-2xl border border-navy-light bg-navy/60 p-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-white font-semibold">{stream.label}</p>
                      <p className="text-slate text-sm">{stream.note}</p>
                    </div>
                    <p className="font-mono-data text-xl font-bold" style={{ color: stream.color }}>
                      {stream.amount}
                    </p>
                  </div>
                  <div className="h-2 rounded-full bg-navy-light overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, ((index + 1) / personalStreams.length) * 100)}%`,
                        background: `linear-gradient(90deg, ${stream.color}, rgba(255,255,255,0.2))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-gold/20 bg-gold/10 p-4">
              <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Reality check</p>
              <p className="text-slate text-sm leading-relaxed">
                You do not need to build all four at once. The goal is to stop relying on exactly one payer forever.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {reasons.map((reason) => (
            <div key={reason.title} data-reveal className="bg-navy-surface border border-navy-light rounded-2xl p-6">
              <p className={`text-sm font-semibold uppercase tracking-[0.12em] mb-3 ${reason.tone}`}>{reason.title}</p>
              <p className="text-slate text-sm leading-relaxed">{reason.body}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <div className="rounded-3xl border border-navy-light bg-navy-surface p-6 md:p-8">
            <p className="text-crimson text-xs font-semibold uppercase tracking-[0.12em] mb-3">One stream = one point of failure</p>
            <p className="text-white text-xl font-bold mb-4">When your salary is your only engine, job loss feels like total shutdown.</p>
            <p className="text-slate text-sm leading-relaxed mb-6">
              The goal of side income is not just “extra money.” It is to reduce fragility. A second stream gives breathing room.
              A third starts creating real freedom.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-crimson/20 bg-crimson/10 p-4">
                <p className="text-crimson text-xs uppercase tracking-[0.12em] mb-2">Fragile setup</p>
                <p className="text-white font-semibold mb-1">1 income stream</p>
                <p className="text-slate text-sm">One boss, one paycheck, one disruption away from pressure.</p>
              </div>
              <div className="rounded-2xl border border-emerald/20 bg-emerald/10 p-4">
                <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-2">Resilient setup</p>
                <p className="text-white font-semibold mb-1">3 to 4 income streams</p>
                <p className="text-slate text-sm">More margin, more options, and less fear around one source slowing down.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-gold/5 p-6 md:p-8">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.12em] mb-4">Simple path to start</p>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-2xl border border-navy-light bg-navy/50 p-4">
                  <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-slate text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
