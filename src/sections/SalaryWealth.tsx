import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    freedomColor: '#DC2626',
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
    freedomColor: '#FFD700',
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
    freedomColor: '#10B981',
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const thermometerRef = useRef<HTMLDivElement>(null);
  const [limSalary, setLimSalary] = useState(25000);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  useEffect(() => {
    if (!thermometerRef.current) return;
    const bars = thermometerRef.current.querySelectorAll('.thermo-fill');
    gsap.fromTo(bars, { height: '0%' }, {
      height: (i) => {
        const c = characters[i];
        if (c.freedom === Infinity) return '100%';
        return `${Math.min(100, (c.freedom / 60) * 100)}%`;
      },
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: { trigger: thermometerRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const adjustedLimFreedom = Math.max(1, 8 * (25000 / Math.max(limSalary, 1000)));

  return (
    <section id="salary-wealth" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 06 / Salary Illusion
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          High Salary.{' '}
          <span className="text-gold">Zero Freedom.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          Three Malaysians. Three incomes. One truth.
        </p>

        {/* Character Cards */}
        <div data-reveal ref={thermometerRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {characters.map((c, i) => {
            const isInfinite = c.freedom === Infinity;
            const displayFreedom = i === 0 ? adjustedLimFreedom : c.freedom;
            const fillHeight = isInfinite ? 100 : Math.min(100, (displayFreedom / 60) * 100);
            const showFreedom = isInfinite ? 'INFINITE' : `${displayFreedom.toFixed(0)} months`;

            return (
              <div
                key={c.name}
                className={`relative bg-navy-surface rounded-2xl p-6 border-2 ${c.borderColor} transition-all duration-300 hover:shadow-elevated ${
                  c.isWinner ? 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' : ''
                }`}
                style={c.isWinner ? { animation: 'winnerPulse 3s ease-in-out infinite' } : {}}
              >
                {c.isWinner && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald text-navy text-xs font-bold px-3 py-1 rounded-full">
                    FINANCIALLY FREE
                  </div>
                )}

                <h3 className={`text-xl font-bold mb-1 ${c.accent}`}>{c.name}</h3>
                <p className="text-slate text-sm mb-4">{c.title}</p>

                <p className={`font-mono-data text-2xl md:text-3xl font-bold mb-4 ${c.accent}`}>
                  {i === 0 ? `RM ${limSalary.toLocaleString()}/month` : c.salaryLabel}
                </p>

                {/* Income Sources */}
                <div className="space-y-2 mb-6">
                  {c.sourceLabels.map((s, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <span className="text-slate">{s.label}</span>
                      <span className="text-white font-mono-data">
                        {i === 0 && s.label === 'Salary' ? `RM ${limSalary.toLocaleString()}` : `RM ${s.amount.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-navy-light">
                    <span className="text-slate">Expenses</span>
                    <span className="text-crimson font-mono-data">
                      RM {i === 0 ? (limSalary * 0.88).toFixed(0) : c.expenses.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Wealth Thermometer */}
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-[160px] bg-navy-light rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="thermo-fill absolute bottom-0 left-0 right-0 rounded-full transition-all"
                      style={{
                        height: i === 0 ? `${Math.min(100, (adjustedLimFreedom / 60) * 100)}%` : `${fillHeight}%`,
                        background: isInfinite
                          ? 'linear-gradient(to top, #10B981, #FFD700)'
                          : 'linear-gradient(to top, #DC2626, #FFD700, #10B981)',
                      }}
                    />
                    {isInfinite && (
                      <div className="absolute inset-0 bg-emerald/20 animate-pulse rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="text-navy-light text-xs uppercase mb-1">Freedom</p>
                    <p className="font-mono-data text-xl font-bold" style={{ color: i === 0 ? (adjustedLimFreedom < 12 ? '#DC2626' : '#FFD700') : c.freedomColor }}>
                      {showFreedom}
                    </p>
                    {isInfinite && <p className="text-emerald text-xs">Financially Free!</p>}
                  </div>
                </div>

                <p className={`text-sm italic mt-4 ${c.accent} opacity-80`}>"{c.tagline}"</p>

                {/* Dr. Lim salary slider */}
                {i === 0 && (
                  <div className="mt-4 pt-4 border-t border-navy-light">
                    <label className="text-navy-light text-xs uppercase mb-2 block">Adjust Dr. Lim's salary</label>
                    <input
                      type="range"
                      min="25000"
                      max="100000"
                      step="1000"
                      value={limSalary}
                      onChange={e => setLimSalary(parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #FFD700 ${((limSalary - 25000) / 75000) * 100}%, #233554 ${((limSalary - 25000) / 75000) * 100}%)` }}
                    />
                    <p className="text-navy-light text-xs mt-1">Notice: More salary ≠ More freedom</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* EPF Illusion */}
        <div data-reveal className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8">
          <h3 className="text-white text-lg font-bold mb-3">The EPF Illusion</h3>
          <p className="text-slate text-sm leading-relaxed mb-4">
            "Dr. Lim has RM 800K in EPF. He thinks he's rich. But he cannot touch it until 55. And Account 1 is 70% locked.
            <span className="text-gold"> Is this wealth or a government-managed allowance?</span>")
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy/50 rounded-lg p-4 border border-navy-light">
              <p className="text-navy-light text-xs uppercase mb-1">EPF Account 1</p>
              <p className="text-gold font-mono-data text-lg font-bold">70%</p>
              <p className="text-slate text-xs">Locked until 55/60</p>
            </div>
            <div className="bg-navy/50 rounded-lg p-4 border border-navy-light">
              <p className="text-navy-light text-xs uppercase mb-1">EPF Account 2</p>
              <p className="text-gold font-mono-data text-lg font-bold">30%</p>
              <p className="text-slate text-xs">Accessible (limited)</p>
            </div>
            <div className="bg-navy/50 rounded-lg p-4 border border-crimson/30">
              <p className="text-navy-light text-xs uppercase mb-1">True Liquidity</p>
              <p className="text-crimson font-mono-data text-lg font-bold">~30%</p>
              <p className="text-slate text-xs">EPF is not wealth. It's forced savings.</p>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div data-reveal className="mt-10 text-center">
          <p className="text-slate text-lg italic max-w-2xl mx-auto">
            "{characters[0].name} makes 5x more than {characters[2].name}. But {characters[2].name} can stop working{' '}
            <span className="text-emerald font-bold">forever.</span>"
          </p>
        </div>
      </div>

      <style>{`
        @keyframes winnerPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(16,185,129,0.15); }
          50% { box-shadow: 0 0 40px rgba(16,185,129,0.3); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFD700;
          border: 2px solid #0A192F;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFD700;
          border: 2px solid #0A192F;
          cursor: pointer;
        }
      `}</style>
    </section>
  );
}
