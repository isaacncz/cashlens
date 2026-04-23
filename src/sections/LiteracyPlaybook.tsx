import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const rules = [
  {
    title: 'Buy cash flow, not status',
    body: 'A payment that leaves your pocket each month is pressure. A payment covered by an asset is leverage.',
    tone: 'text-emerald',
  },
  {
    title: 'Protect liquidity first',
    body: 'EPF is useful, but liquidity is survival. Real freedom starts with assets you can actually access.',
    tone: 'text-gold',
  },
  {
    title: 'Measure time, not just money',
    body: 'If an income stream still depends on your hours, it is not freedom yet.',
    tone: 'text-crimson',
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
    <section id="literacy-playbook" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#081424' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 09 / Financial Literacy Playbook
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Learn The Rule.
          {' '}
          <span className="text-gold">Use It Anywhere.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-2xl">
          Financial literacy works when you can transfer the lesson to real life. These are the rules, myths, and first actions that matter after you leave this page.
        </p>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {rules.map((rule) => (
            <div key={rule.title} className="bg-navy-surface border border-navy-light rounded-2xl p-6">
              <p className={`text-sm font-semibold uppercase tracking-[0.12em] mb-3 ${rule.tone}`}>Rule</p>
              <h3 className="text-white text-xl font-bold mb-3">{rule.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{rule.body}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div data-reveal className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.12em] mb-4">Myth vs reality</p>
            <div className="space-y-4">
              {myths.map((item) => (
                <div key={item.myth} className="rounded-xl border border-navy-light bg-navy/50 p-4">
                  <p className="text-crimson text-sm font-semibold mb-2">Myth: {item.myth}</p>
                  <p className="text-emerald text-sm">Reality: {item.reality}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="bg-navy-surface border border-gold/20 rounded-2xl p-6 md:p-8">
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.12em] mb-4">Start this week</p>
            <div className="space-y-3">
              {actions.map((action, index) => (
                <div key={action} className="flex items-start gap-3 rounded-xl border border-navy-light bg-navy/50 p-4">
                  <div className="w-7 h-7 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-slate text-sm leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl bg-emerald/10 border border-emerald/20 p-4">
              <p className="text-emerald text-sm font-semibold mb-1">Definition of progress</p>
              <p className="text-slate text-sm">Your next ringgit should either increase liquidity, reduce expensive debt, or create future cashflow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
