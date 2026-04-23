import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Quadrant = 'E' | 'S' | 'B' | 'I';
const TAX_OUT = '#DC2626';

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
    pipeColors: { tax: TAX_OUT, epf: '#DAA520', time: '#DC2626', income: '#FFD700' },
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
    pipeColors: { tax: TAX_OUT, epf: '#64748B', time: '#DC2626', income: '#FFD700' },
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
    pipeColors: { tax: TAX_OUT, epf: '#DAA520', time: '#10B981', income: '#10B981' },
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
    pipeColors: { tax: TAX_OUT, epf: '#DAA520', time: '#10B981', income: '#FFD700' },
    pipeWidths: { tax: 5, epf: 5, time: 0, income: 60 },
  },
];

function formatRinggit(amount: number) {
  return `RM ${amount.toLocaleString()}`;
}

export default function CashflowQuadrant() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Quadrant | null>(null);
  const [activeStep, setActiveStep] = useState<'income' | 'tax' | 'epf' | 'time' | 'net'>('income');

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

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
                  <span className="text-slate text-xs uppercase tracking-wider">{q.label}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-1">{q.name}</h3>
                <p className="text-slate text-sm mb-2">{q.persona}</p>
                <p className={`font-mono-data text-lg md:text-2xl font-bold ${q.accent}`}>{q.income}</p>
                <p className="text-slate text-xs mt-1">Net usable flow: <span className="text-white font-semibold">{formatRinggit(q.netTakeHome)}</span></p>

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
            {quadrants.filter(q => q.key === selected).map(q => {
              const stepInfo = {
                income: { title: 'Income in', value: formatRinggit(q.monthlyIncome), note: 'This is the top of the pipeline before deductions.' },
                tax: { title: 'Tax out', value: formatRinggit(q.taxAmount), note: 'Paid first to LHDN based on income band.' },
                epf: { title: 'EPF out', value: formatRinggit(q.epfAmount), note: 'Forced savings that is useful later, but less liquid today.' },
                time: { title: 'Time trade', value: q.timeHours === 0 ? 'No time trade' : `${q.timeHours} hrs/month`, note: q.timeHours === 0 ? 'Your income is no longer tied to working hours.' : 'These hours are the real cost behind the paycheck.' },
                net: { title: 'Net left', value: formatRinggit(q.netTakeHome), note: 'The usable cashflow left after all outflows.' },
              } as const;
              const activeStepInfo = stepInfo[activeStep];
              return (
              <div key={q.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className={`text-2xl font-bold ${q.accent}`}>{q.name} — {q.persona}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gold font-mono-data text-3xl font-bold mb-4">{q.income}</p>
                    <div className="rounded-xl border border-navy-light bg-navy p-4 mb-4">
                      <p className="text-slate text-xs uppercase tracking-[0.12em] mb-3">Flow steps</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <button type="button" onClick={() => setActiveStep('income')} className={`min-h-10 rounded-lg border text-xs font-semibold transition-all ${activeStep === 'income' ? 'border-emerald/40 bg-emerald/15 text-emerald' : 'border-navy-light bg-navy-surface text-slate hover:border-emerald/20'}`}>1 Income</button>
                        <button type="button" onClick={() => setActiveStep('tax')} className={`min-h-10 rounded-lg border text-xs font-semibold transition-all ${activeStep === 'tax' ? 'border-crimson/40 bg-crimson/15 text-crimson' : 'border-navy-light bg-navy-surface text-slate hover:border-crimson/20'}`}>2 Tax</button>
                        <button type="button" onClick={() => setActiveStep('epf')} className={`min-h-10 rounded-lg border text-xs font-semibold transition-all ${activeStep === 'epf' ? 'border-gold/40 bg-gold/15 text-gold' : 'border-navy-light bg-navy-surface text-slate hover:border-gold/20'}`}>3 EPF</button>
                        <button type="button" onClick={() => setActiveStep('time')} className={`min-h-10 rounded-lg border text-xs font-semibold transition-all ${activeStep === 'time' ? 'border-crimson/40 bg-crimson/15 text-crimson' : 'border-navy-light bg-navy-surface text-slate hover:border-crimson/20'}`}>4 Time</button>
                        <button type="button" onClick={() => setActiveStep('net')} className={`min-h-10 rounded-lg border text-xs font-semibold transition-all ${activeStep === 'net' ? 'border-emerald/40 bg-emerald/15 text-emerald' : 'border-navy-light bg-navy-surface text-slate hover:border-emerald/20'}`}>5 Net</button>
                      </div>
                    </div>
                    <div className="rounded-xl border border-gold/25 bg-navy-surface p-4 mb-5">
                      <p className="text-slate text-xs uppercase mb-1">Focused step</p>
                      <p className={`text-lg font-bold mb-1 ${activeStep === 'tax' || activeStep === 'time' ? 'text-crimson' : activeStep === 'epf' ? 'text-gold' : 'text-emerald'}`}>{activeStepInfo.title}</p>
                      <p className="text-white font-mono-data text-xl font-bold">{activeStepInfo.value}</p>
                      <p className="text-slate text-sm mt-2">{activeStepInfo.note}</p>
                    </div>
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald/10 text-emerald border border-emerald/25" title="Income entering the system">Green = income in</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-crimson/10 text-crimson border border-crimson/25" title="Time and lifestyle drain">Red = deduction / time out</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ backgroundColor: 'rgba(220,38,38,0.12)', color: TAX_OUT, borderColor: 'rgba(220,38,38,0.35)' }} title="Tax flow">Red = tax out</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/25" title="Locked or retained wealth">Gold = savings / net</span>
                    </div>
                    <svg width="100%" height="260" viewBox="0 0 300 260">
                      {/* Income source */}
                      <circle cx="150" cy="24" r="12" fill={q.pipeColors.income} opacity="0.3" />
                      <title>{`${q.name} monthly income: ${formatRinggit(q.monthlyIncome)}`}</title>
                      <text x="150" y="28" textAnchor="middle" fill={q.pipeColors.income} fontSize="8" fontWeight="bold">IN</text>
                      <text x="150" y="48" textAnchor="middle" fill="#E6F1FF" fontSize="11" fontWeight="bold">{formatRinggit(q.monthlyIncome)}</text>
                      <text x="150" y="63" textAnchor="middle" fill="#8892B0" fontSize="9">Income enters</text>
                      {/* Main flow down */}
                      <line x1="150" y1="36" x2="150" y2="212" stroke={q.pipeColors.income} strokeWidth="3" opacity="0.5" />
                      <text x="160" y="86" fill="#8892B0" fontSize="9">↓ flowing through the quadrant</text>
                      {/* Tax branch */}
                      <line x1="150" y1="92" x2="60" y2="92" stroke={q.pipeColors.tax} strokeWidth={Math.max(2, q.pipeWidths.tax / 8)} opacity={activeStep === 'tax' ? '1' : '0.55'} />
                      <polygon points="60,92 68,88 68,96" fill={q.pipeColors.tax} opacity="0.8" />
                      <text x="26" y="88" fill={q.pipeColors.tax} fontSize="9" fontWeight="bold">Tax</text>
                      <text x="26" y="102" fill="#E6F1FF" fontSize="9">{formatRinggit(q.taxAmount)}</text>
                      {/* EPF branch */}
                      <line x1="150" y1="136" x2="60" y2="136" stroke={q.pipeColors.epf} strokeWidth={Math.max(2, q.pipeWidths.epf / 8)} opacity={activeStep === 'epf' ? '1' : '0.55'} />
                      <polygon points="60,136 68,132 68,140" fill={q.pipeColors.epf} opacity="0.8" />
                      <text x="26" y="132" fill={q.pipeColors.epf} fontSize="9" fontWeight="bold">EPF</text>
                      <text x="26" y="146" fill="#E6F1FF" fontSize="9">{formatRinggit(q.epfAmount)}</text>
                      {/* Time branch */}
                      {q.pipeWidths.time > 0 && (
                        <>
                          <line x1="150" y1="178" x2="240" y2="178" stroke={q.pipeColors.time} strokeWidth={Math.max(2, q.pipeWidths.time / 8)} opacity={activeStep === 'time' ? '1' : '0.55'} />
                          <text x="250" y="174" fill={q.pipeColors.time} fontSize="9" fontWeight="bold">Time</text>
                          <text x="250" y="188" fill="#E6F1FF" fontSize="9">{q.timeHours} hrs</text>
                          <polygon points="240,178 232,174 232,182" fill={q.pipeColors.time} opacity="0.8" />
                        </>
                      )}
                      {q.pipeWidths.time === 0 && (
                        <>
                          <rect x="168" y="164" width="96" height="28" rx="14" fill="#10B981" opacity="0.14" />
                          <text x="216" y="182" textAnchor="middle" fill="#10B981" fontSize="13" fontWeight="bold">NO TIME TRADE</text>
                        </>
                      )}
                      {/* Net flow */}
                      <circle cx="150" cy="214" r="8" fill={q.pipeColors.income} opacity={activeStep === 'net' ? '0.85' : '0.4'} />
                      <text x="150" y="232" textAnchor="middle" fill="#FFD700" fontSize="10" fontWeight="bold">NET LEFT</text>
                      <text x="150" y="248" textAnchor="middle" fill="#E6F1FF" fontSize="11" fontWeight="bold">{formatRinggit(q.netTakeHome)}</text>
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
                    <p className="text-slate text-sm leading-relaxed mt-3">
                      Tap step chips to focus each part of the flow.
                    </p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}

        {/* Key Insight */}
        <div data-reveal className="mt-8 text-center">
          <p className="text-slate text-lg italic max-w-2xl mx-auto">
            "{quadrants[0].name} and {quadrants[3].name} both 'make' RM 8,000. But {quadrants[0].name} trades 160 hours. {quadrants[3].name} trades <span className="text-emerald font-bold">zero.</span>"
          </p>
        </div>
      </div>
    </section>
  );
}

