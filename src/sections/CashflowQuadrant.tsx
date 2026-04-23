import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Quadrant = 'E' | 'S' | 'B' | 'I';

interface QuadrantData {
  key: Quadrant;
  label: string;
  name: string;
  persona: string;
  income: string;
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
    accent: 'text-malaysian-blue',
    borderColor: 'border-malaysian-blue',
    tagline: "Your salary makes your boss rich. Who makes you rich?",
    details: ['LHDN progressive tax up to 24%', 'EPF: 11% employee + 12% employer (locked)', '9-to-6 + MRT commute', 'Highest tax burden, zero time freedom'],
    pipeColors: { tax: '#0033A0', epf: '#DAA520', time: '#DC2626', income: '#FFD700' },
    pipeWidths: { tax: 28, epf: 23, time: 45, income: 35 },
  },
  {
    key: 'S',
    label: 'S — SELF-EMPLOYED',
    name: 'Sarah',
    persona: 'Freelance Designer',
    income: 'RM 12,000/month',
    accent: 'text-slate-light',
    borderColor: 'border-slate',
    tagline: "Sarah earns more than Ahmad. But she has no safety net.",
    details: ['No employer EPF contribution', 'Higher effective tax rate', 'No work = No income', 'Time pipe is WIDEST'],
    pipeColors: { tax: '#0033A0', epf: '#64748B', time: '#DC2626', income: '#FFD700' },
    pipeWidths: { tax: 35, epf: 0, time: 55, income: 42 },
  },
  {
    key: 'B',
    label: 'B — BUSINESS OWNER',
    name: 'Raj',
    persona: 'Sdn Bhd Owner',
    income: 'Corporate tax: 24%',
    accent: 'text-emerald',
    borderColor: 'border-emerald',
    tagline: "Raj's company pays his lifestyle. These are expenses, not liabilities.",
    details: ['Company pays car, phone, travel', 'Dividends: tax-exempt up to RM 100K', 'Leverage through business structure', 'Thin time pipe'],
    pipeColors: { tax: '#0033A0', epf: '#DAA520', time: '#10B981', income: '#10B981' },
    pipeWidths: { tax: 15, epf: 10, time: 8, income: 50 },
  },
  {
    key: 'I',
    label: 'I — INVESTOR',
    name: 'Aminah',
    persona: 'ASB + Rental Portfolio',
    income: 'RM 6,000/month passive',
    accent: 'text-gold',
    borderColor: 'border-gold',
    tagline: "Aminah stopped working at 42. Her income never did.",
    details: ['ASB dividends + rental + dividend stocks', 'Tax: Minimal (dividends exempt)', 'Time pipe: GONE', 'Multiple income streams'],
    pipeColors: { tax: '#0033A0', epf: '#DAA520', time: '#10B981', income: '#FFD700' },
    pipeWidths: { tax: 5, epf: 5, time: 0, income: 60 },
  },
];

export default function CashflowQuadrant() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Quadrant | null>(null);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const activeQuadrant = quadrants[Math.min(Math.floor(sliderValue), 3)];

  return (
    <section id="cashflow-quadrant" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 03 / Cashflow Quadrant
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Your Quadrant{' '}
          <span className="text-gold">Determines Your Flow.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          Select a quadrant. See how money and time move.
        </p>

        {/* Quadrant Grid */}
        <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {quadrants.map(q => {
            const isSelected = selected === q.key;
            return (
              <button
                key={q.key}
                onClick={() => setSelected(isSelected ? null : q.key)}
                className={`relative text-left bg-navy-surface border-2 rounded-2xl p-6 transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
                  isSelected ? `${q.borderColor} shadow-[0_0_30px_rgba(255,215,0,0.15)] scale-[1.02]` : 'border-navy-light hover:border-gold/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full border ${q.borderColor} ${q.accent} bg-opacity-10`}>
                    {q.key}
                  </span>
                  <span className="text-navy-light text-xs uppercase tracking-wider">{q.label}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{q.name}</h3>
                <p className="text-slate text-sm mb-2">{q.persona}</p>
                <p className={`font-mono-data text-sm font-bold ${q.accent}`}>{q.income}</p>

                {/* Mini Pipe Preview */}
                <div className="mt-4 h-12 relative">
                  <svg width="100%" height="48" viewBox="0 0 200 48" className="opacity-60">
                    {/* Income pipe */}
                    <rect x="20" y="4" width={q.pipeWidths.income} height="6" rx="3" fill={q.pipeColors.income} opacity="0.8" />
                    {/* Tax pipe */}
                    <rect x="20" y="14" width={q.pipeWidths.tax} height="6" rx="3" fill={q.pipeColors.tax} opacity="0.7" />
                    {/* EPF pipe */}
                    <rect x="20" y="24" width={q.pipeWidths.epf} height="6" rx="3" fill={q.pipeColors.epf} opacity="0.7" />
                    {/* Time pipe */}
                    {q.pipeWidths.time > 0 && (
                      <rect x="20" y="34" width={q.pipeWidths.time} height="6" rx="3" fill={q.pipeColors.time} opacity="0.7" />
                    )}
                    {/* Labels */}
                    <text x="120" y="10" fill="#8892B0" fontSize="6">Income</text>
                    <text x="120" y="20" fill="#8892B0" fontSize="6">Tax</text>
                    <text x="120" y="30" fill="#8892B0" fontSize="6">EPF</text>
                    <text x="120" y="40" fill="#8892B0" fontSize="6">Time</text>
                  </svg>
                </div>

                <p className={`text-sm mt-3 italic ${q.accent} opacity-80`}>"{q.tagline}"</p>
              </button>
            );
          })}
        </div>

        {/* Expanded Detail */}
        {selected && (
          <div className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {quadrants.filter(q => q.key === selected).map(q => (
              <div key={q.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className={`text-2xl font-bold ${q.accent}`}>{q.name} — {q.persona}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gold font-mono-data text-2xl font-bold mb-4">{q.income}</p>
                    <ul className="space-y-2">
                      {q.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate text-sm">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ backgroundColor: q.pipeColors.income }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <svg width="100%" height="200" viewBox="0 0 300 200">
                      {/* Income source */}
                      <circle cx="150" cy="20" r="12" fill={q.pipeColors.income} opacity="0.3" />
                      <text x="150" y="24" textAnchor="middle" fill={q.pipeColors.income} fontSize="8" fontWeight="bold">INCOME</text>
                      {/* Main flow down */}
                      <line x1="150" y1="32" x2="150" y2="180" stroke={q.pipeColors.income} strokeWidth="3" opacity="0.5" />
                      {/* Tax branch */}
                      <line x1="150" y1="60" x2="60" y2="60" stroke={q.pipeColors.tax} strokeWidth={Math.max(2, q.pipeWidths.tax / 8)} opacity="0.7" />
                      <text x="30" y="58" fill={q.pipeColors.tax} fontSize="8">TAX</text>
                      {/* EPF branch */}
                      <line x1="150" y1="100" x2="60" y2="100" stroke={q.pipeColors.epf} strokeWidth={Math.max(2, q.pipeWidths.epf / 8)} opacity="0.7" />
                      <text x="30" y="98" fill={q.pipeColors.epf} fontSize="8">EPF</text>
                      {/* Time branch */}
                      {q.pipeWidths.time > 0 && (
                        <>
                          <line x1="150" y1="140" x2="240" y2="140" stroke={q.pipeColors.time} strokeWidth={Math.max(2, q.pipeWidths.time / 8)} opacity="0.7" />
                          <text x="250" y="143" fill={q.pipeColors.time} fontSize="8">TIME</text>
                          <polygon points="245,135 255,140 245,145" fill={q.pipeColors.time} opacity="0.5" />
                        </>
                      )}
                      {q.pipeWidths.time === 0 && (
                        <text x="160" y="143" fill="#10B981" fontSize="8" fontWeight="bold">NO TIME TRADE!</text>
                      )}
                      {/* Net flow */}
                      <circle cx="150" cy="180" r="8" fill={q.pipeColors.income} opacity="0.4" />
                      <text x="150" y="196" textAnchor="middle" fill="#FFD700" fontSize="8" fontWeight="bold">NET</text>
                      {/* Flowing particles */}
                      <circle r="2" fill={q.pipeColors.income}>
                        <animate attributeName="cy" values="35;175" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="cx" values="150;150" dur="2s" repeatCount="indefinite" />
                      </circle>
                      {q.pipeWidths.tax > 10 && (
                        <circle r="1.5" fill={q.pipeColors.tax}>
                          <animate attributeName="cx" values="150;65" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="60;60" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {q.pipeWidths.time > 10 && (
                        <circle r="1.5" fill={q.pipeColors.time}>
                          <animate attributeName="cx" values="150;235" dur="1.5s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="140;140" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Switch Quadrants Slider */}
        <div data-reveal className="bg-navy-surface border border-navy-light rounded-2xl p-6">
          <p className="text-slate text-sm mb-4">Drag to see how your quadrant changes your money flow:</p>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={sliderValue}
              onChange={e => setSliderValue(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #DC2626 0%, #FFD700 50%, #10B981 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-navy-light">
              <span className={sliderValue < 1 ? 'text-crimson font-bold' : ''}>E — Employee</span>
              <span className={sliderValue >= 1 && sliderValue < 2 ? 'text-slate-light font-bold' : ''}>S — Self-employed</span>
              <span className={sliderValue >= 2 && sliderValue < 3 ? 'text-emerald font-bold' : ''}>B — Business</span>
              <span className={sliderValue >= 3 ? 'text-gold font-bold' : ''}>I — Investor</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: activeQuadrant.pipeColors.income + '30', color: activeQuadrant.pipeColors.income }}>
              {activeQuadrant.key}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{activeQuadrant.name} — {activeQuadrant.persona}</p>
              <p className="text-slate text-xs">{activeQuadrant.tagline}</p>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div data-reveal className="mt-10 text-center">
          <p className="text-slate text-lg italic max-w-2xl mx-auto">
            "{quadrants[0].name} and {quadrants[3].name} both 'make' RM 8,000. But {quadrants[0].name} trades 160 hours. {quadrants[3].name} trades <span className="text-emerald font-bold">zero.</span>"
          </p>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFD700;
          border: 3px solid #0A192F;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FFD700;
          border: 3px solid #0A192F;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,215,0,0.5);
        }
      `}</style>
    </section>
  );
}
