import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MoneyMirrorPreset {
  name: string;
  icon: string;
  badge: string;
  salary: string;
  hours: string;
  commute: string;
  expenses: string;
  description: string;
}

interface MoneyMirrorResult {
  trueHourly: number;
  annualHours: number;
  monthsSurvival: number;
  grossMonthly: number;
  epfEmployee: number;
  epfEmployer: number;
  taxMonthly: number;
  sstMonthly: number;
  workExpenses: number;
  netIncome: number;
}

type FlowKey = 'tax' | 'epf' | 'sst' | 'expense' | 'net';
type InsightKey = 'rate' | 'keep' | 'time';

function calculateTax(monthlySalary: number): number {
  const annual = monthlySalary * 12;
  let tax = 0;
  const brackets = [
    { limit: 5000, rate: 0 },
    { limit: 20000, rate: 0.01 },
    { limit: 35000, rate: 0.03 },
    { limit: 50000, rate: 0.06 },
    { limit: 70000, rate: 0.11 },
    { limit: 100000, rate: 0.19 },
    { limit: 250000, rate: 0.25 },
    { limit: 400000, rate: 0.26 },
    { limit: 600000, rate: 0.28 },
    { limit: 1000000, rate: 0.30 },
  ];

  let remaining = annual;
  let prevLimit = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(Math.max(remaining, 0), bracket.limit - prevLimit);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.limit;
    if (remaining <= 0) break;
  }

  if (remaining > 0) tax += remaining * 0.3;

  const rebate = annual <= 35000 ? 400 : 0;
  return Math.max(0, tax - rebate) / 12;
}

function calculateEPF(salary: number): { employee: number; employer: number } {
  const capped = Math.min(salary, 20000);
  return {
    employee: capped * 0.11,
    employer: capped * (salary <= 5000 ? 0.13 : 0.12),
  };
}

const SALARY_MIN = 1000;
const SALARY_MAX = 50000;
const SALARY_TYPICAL_MIN = 1500;
const SALARY_TYPICAL_MAX = 15000;
const HOURS_MIN = 20;
const HOURS_MAX = 100;

const presets: MoneyMirrorPreset[] = [
  {
    name: 'Fresh Grad',
    icon: '🎓',
    badge: 'Starter',
    salary: '3500',
    hours: '45',
    commute: '2',
    expenses: '450',
    description: 'Salary looks fine, but time freedom is tight.',
  },
  {
    name: 'Urban Commuter',
    icon: '🏙️',
    badge: 'Busy city',
    salary: '8000',
    hours: '55',
    commute: '3',
    expenses: '900',
    description: 'Higher pay, but long hours and transport costs eat the upside.',
  },
  {
    name: 'Disciplined Saver',
    icon: '💾',
    badge: 'Lean spender',
    salary: '5000',
    hours: '42',
    commute: '1',
    expenses: '300',
    description: 'Lower lifestyle drag leaves more room to build wealth.',
  },
];

function computeMoneyMirrorResults(salary: number, hours: number, commute: number, expenses: number): MoneyMirrorResult {
  const epf = calculateEPF(salary);
  const taxMonthly = calculateTax(salary);
  const sstMonthly = salary * 0.03;
  const netIncome = salary - epf.employee - taxMonthly - sstMonthly - expenses;
  const totalHours = hours * 4.3 + commute * 4.3 * 5;
  const trueHourly = totalHours > 0 ? netIncome / totalHours : 0;
  const annualHours = totalHours * 12;
  const monthsSurvival = expenses > 0 ? (netIncome * 6) / (salary * 0.7) : 0;

  return {
    trueHourly,
    annualHours,
    monthsSurvival,
    grossMonthly: salary,
    epfEmployee: epf.employee,
    epfEmployer: epf.employer,
    taxMonthly,
    sstMonthly,
    workExpenses: expenses,
    netIncome,
  };
}

export default function MoneyMirror() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [salary, setSalary] = useState('');
  const [hours, setHours] = useState('');
  const [commute, setCommute] = useState('');
  const [expenses, setExpenses] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [highlightedFlow, setHighlightedFlow] = useState<FlowKey>('net');
  const [activeInsight, setActiveInsight] = useState<InsightKey>('rate');
  const [supportsHover, setSupportsHover] = useState(false);
  const [results, setResults] = useState<MoneyMirrorResult>({
    trueHourly: 0,
    annualHours: 0,
    monthsSurvival: 0,
    grossMonthly: 0,
    epfEmployee: 0,
    epfEmployer: 0,
    taxMonthly: 0,
    sstMonthly: 0,
    workExpenses: 0,
    netIncome: 0,
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateHoverSupport = () => setSupportsHover(mediaQuery.matches);
    updateHoverSupport();
    mediaQuery.addEventListener('change', updateHoverSupport);
    return () => mediaQuery.removeEventListener('change', updateHoverSupport);
  }, []);

  const inputClass = 'w-full bg-navy-surface border border-navy-light rounded-lg px-4 py-3 text-white font-mono-data text-sm focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15)] transition-all placeholder:text-slate';
  const labelClass = 'block text-xs font-medium uppercase tracking-wider text-slate mb-2';

  const salaryValue = salary === '' ? Number.NaN : parseFloat(salary);
  const salaryHasInput = salary.trim().length > 0;
  const salaryIsValid = salaryHasInput && salaryValue >= SALARY_MIN && salaryValue <= SALARY_MAX;
  const salaryIsTypical = salaryHasInput && salaryValue >= SALARY_TYPICAL_MIN && salaryValue <= SALARY_TYPICAL_MAX;
  const hoursValue = hours === '' ? 44 : Math.min(HOURS_MAX, Math.max(HOURS_MIN, parseFloat(hours) || 44));
  const salaryInputClass = `${inputClass} ${salaryHasInput ? (salaryIsValid ? 'border-emerald/60' : 'border-crimson') : ''}`;
  const selectedPresetMeta = presets.find((preset) => preset.name === selectedPreset);

  useEffect(() => {
    if (!salaryIsValid) {
      setCalculated(false);
      return;
    }

    const gross = parseFloat(salary) || 0;
    const hrs = parseFloat(hours) || 44;
    const comm = parseFloat(commute) || 0;
    const exp = parseFloat(expenses) || 0;
    setResults(computeMoneyMirrorResults(gross, hrs, comm, exp));
    setCalculated(true);
  }, [salary, hours, commute, expenses, salaryIsValid]);

  useEffect(() => {
    if (!calculated || !resultsRef.current) return;
    const timeoutId = window.setTimeout(() => {
      if (!resultsRef.current) return;
      const els = resultsRef.current.querySelectorAll('[data-result]');
      gsap.fromTo(els, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06 });
    }, 100);

    return () => window.clearTimeout(timeoutId);
  }, [calculated, results]);

  const applyPreset = (preset: MoneyMirrorPreset) => {
    setSelectedPreset(preset.name);
    setSalary(preset.salary);
    setHours(preset.hours);
    setCommute(preset.commute);
    setExpenses(preset.expenses);
  };

  const hourlyInsight = results.trueHourly < 15
    ? {
        title: 'Your job is paying less than it looks.',
        body: 'Once time and work-related costs are included, the headline salary is masking a weak real return on your hours.',
        tone: 'text-crimson',
      }
    : results.trueHourly < 30
      ? {
          title: 'Your pay is decent, but leaks matter.',
          body: 'You are earning, but tax, commute, and work costs are taking a meaningful bite out of your real hourly value.',
          tone: 'text-gold',
        }
      : {
          title: 'Your hourly value is strong. Protect it.',
          body: 'The next question is not just how much you earn, but how quickly that income can stop depending on your hours.',
          tone: 'text-emerald',
        };

  const flowItems = useMemo(() => {
    const gross = Math.max(results.grossMonthly, 1);
    return [
      {
        key: 'tax' as const,
        label: 'Income tax',
        amount: results.taxMonthly,
        percent: (results.taxMonthly / gross) * 100,
        color: '#DC2626',
        accent: 'text-crimson',
        description: 'Paid to LHDN before you feel richer.',
        side: 'left' as const,
        y: 110,
      },
      {
        key: 'epf' as const,
        label: 'EPF',
        amount: results.epfEmployee,
        percent: (results.epfEmployee / gross) * 100,
        color: '#FFD700',
        accent: 'text-gold',
        description: 'Forced savings — useful, but not liquid now.',
        side: 'left' as const,
        y: 165,
      },
      {
        key: 'sst' as const,
        label: 'SST drag',
        amount: results.sstMonthly,
        percent: (results.sstMonthly / gross) * 100,
        color: '#64748B',
        accent: 'text-slate',
        description: 'Consumption tax pressure built into spending.',
        side: 'right' as const,
        y: 220,
      },
      {
        key: 'expense' as const,
        label: 'Work costs',
        amount: results.workExpenses,
        percent: (results.workExpenses / gross) * 100,
        color: '#DC2626',
        accent: 'text-crimson',
        description: 'Petrol, tolls, food, parking, uniforms, commute friction.',
        side: 'right' as const,
        y: 275,
      },
      {
        key: 'net' as const,
        label: 'Keep',
        amount: results.netIncome,
        percent: (results.netIncome / gross) * 100,
        color: '#10B981',
        accent: 'text-emerald',
        description: 'This is what is truly left for living, saving, or investing.',
        side: 'center' as const,
        y: 330,
      },
    ];
  }, [results]);

  const highlightedItem = flowItems.find((item) => item.key === highlightedFlow) ?? flowItems[flowItems.length - 1];
  const takeHomePercent = Math.max(0, highlightedItem.key === 'net' ? highlightedItem.percent : flowItems.find((item) => item.key === 'net')?.percent ?? 0);
  const netItem = flowItems.find((item) => item.key === 'net') ?? flowItems[flowItems.length - 1];
  const totalOutflow = Math.max(0, results.grossMonthly - netItem.amount);
  const insightItems = [
    {
      key: 'rate' as const,
      label: 'Real rate',
      value: `RM ${results.trueHourly.toFixed(2)}/hr`,
      detail: hourlyInsight.body,
      tone: hourlyInsight.tone,
    },
    {
      key: 'keep' as const,
      label: 'Keep rate',
      value: `${netItem.percent.toFixed(1)}%`,
      detail: `From RM ${results.grossMonthly.toFixed(0)}, you keep RM ${netItem.amount.toFixed(0)} after tax, EPF, SST, and work costs.`,
      tone: 'text-emerald',
    },
    {
      key: 'time' as const,
      label: 'Time traded',
      value: `${results.annualHours.toFixed(0)} hrs/yr`,
      detail: `At this pace, your job takes about ${Math.round(results.annualHours / 24)} full days each year.`,
      tone: 'text-gold',
    },
  ];
  const activeInsightItem = insightItems.find((item) => item.key === activeInsight) ?? insightItems[0];
  const handleFlowHover = (key: FlowKey) => {
    if (supportsHover) setHighlightedFlow(key);
  };
  const handleFlowSelect = (key: FlowKey) => setHighlightedFlow(key);

  return (
    <section id="money-mirror" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
              Module 01 / The Money Mirror
            </p>
            <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
              What Is Your Time{' '}
              <span className="text-gold">Really Worth?</span>
            </h2>
            <p data-reveal className="text-slate text-base md:text-lg mb-8 leading-relaxed">
              Enter monthly numbers and see where your salary actually goes.
            </p>

            <div data-reveal className="mb-6">
              <p className="text-slate text-xs uppercase tracking-[0.12em] mb-3">Try a learning preset first</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`text-left rounded-xl border p-3 transition-all duration-200 min-h-[82px] ${
                      selectedPreset === preset.name
                        ? 'bg-gold/15 border-gold/50'
                        : 'bg-navy-surface border-navy-light text-white hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xl">{preset.icon}</span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-slate">{preset.badge}</span>
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${selectedPreset === preset.name ? 'text-gold' : 'text-white'}`}>{preset.name}</p>
                  </button>
                ))}
              </div>
              {selectedPresetMeta && (
                <p className="text-slate text-sm mt-3 rounded-xl border border-navy-light bg-navy-surface/40 px-3 py-2">{selectedPresetMeta.description}</p>
              )}
            </div>

            <div data-reveal className="space-y-5 mb-8">
              <div>
                <label className={labelClass}>Gross Monthly Salary (RM)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-sm font-semibold">RM</span>
                  <input
                    type="number"
                    min={SALARY_MIN}
                    max={SALARY_MAX}
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    placeholder="8000"
                    className={`${salaryInputClass} pl-12`}
                    aria-invalid={salaryHasInput && !salaryIsValid}
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <p className={`text-xs ${salaryIsTypical ? 'text-emerald' : 'text-slate'}`}>
                    {salaryIsTypical ? '✓' : '•'} Typical range: RM 1,500 - RM 15,000
                  </p>
                  <p className={`text-xs ${salaryHasInput && !salaryIsValid ? 'text-crimson' : 'text-slate'}`}>
                    {salaryHasInput && !salaryIsValid ? '⚠' : '•'} Enter amount between RM 1,000 and RM 50,000
                  </p>
                </div>
              </div>

              <div>
                <label className={labelClass}>Hours Worked Per Week</label>
                <div className="bg-navy-surface/50 border border-navy-light rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                    <input
                      type="range"
                      min={HOURS_MIN}
                      max={HOURS_MAX}
                      step="1"
                      value={hoursValue}
                      onChange={(event) => setHours(event.target.value)}
                      className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background: `linear-gradient(to right, #FFD700 ${((hoursValue - HOURS_MIN) / (HOURS_MAX - HOURS_MIN)) * 100}%, #233554 ${((hoursValue - HOURS_MIN) / (HOURS_MAX - HOURS_MIN)) * 100}%)` }}
                      aria-label="Hours worked per week"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-slate text-sm">hrs</span>
                      <input
                        type="number"
                        min={HOURS_MIN}
                        max={HOURS_MAX}
                        value={hours === '' ? '' : hours}
                        onChange={(event) => setHours(event.target.value)}
                        placeholder="44"
                        className="w-24 bg-navy border border-navy-light rounded-lg px-3 py-2 text-white font-mono-data text-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate">
                    <span>20 hrs</span>
                    <span className="text-white font-medium">{hoursValue.toFixed(0)} hrs/week</span>
                    <span>100 hrs</span>
                  </div>
                </div>
                <p className="text-slate text-xs mt-2">Use the slider for quick adjustment, or type an exact value.</p>
              </div>

              <div>
                <label className={labelClass}>Daily Commute (hours)</label>
                <input type="number" value={commute} onChange={(event) => setCommute(event.target.value)} placeholder="2" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Work-Related Expenses (RM/month)</label>
                <input type="number" value={expenses} onChange={(event) => setExpenses(event.target.value)} placeholder="500" className={inputClass} />
                <p className="text-slate text-xs mt-1">Petrol, toll, food, uniforms, parking</p>
              </div>
            </div>

            <div data-reveal className={`w-full py-4 px-5 rounded-xl border ${salaryIsValid ? 'border-emerald/30 bg-emerald/10' : 'border-navy-light bg-navy-surface/40'}`}>
              <p className={`text-sm font-semibold ${salaryIsValid ? 'text-emerald' : 'text-slate'}`}>
                {salaryIsValid ? 'Live mode on — your real rate updates automatically.' : 'Enter a valid salary to unlock the live calculation.'}
              </p>
              <p className="text-slate text-xs mt-1">Fewer clicks, faster learning.</p>
            </div>

            {calculated && (
              <div ref={resultsRef} className="mt-8 space-y-4">
                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-6">
                  <p className="text-slate text-sm mb-1">True Hourly Rate</p>
                  <p className="text-gold font-mono-data text-4xl md:text-5xl font-bold">
                    RM {results.trueHourly.toFixed(2)}
                  </p>
                </div>

                <div data-result className="grid grid-cols-2 gap-4">
                  <div className="bg-navy-surface border border-navy-light rounded-xl p-4">
                    <p className="text-slate text-xs uppercase mb-1">Annual Hours Traded</p>
                    <p className="text-white font-mono-data text-xl font-bold">{results.annualHours.toFixed(0)}</p>
                  </div>
                  <div className="bg-navy-surface border border-navy-light rounded-xl p-4">
                    <p className="text-slate text-xs uppercase mb-1">Survival Without Work</p>
                    <p className="text-crimson font-mono-data text-xl font-bold">{results.monthsSurvival.toFixed(1)} months</p>
                  </div>
                </div>

                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-5">
                  <p className="text-slate text-xs uppercase mb-3">Quick insights</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {insightItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActiveInsight(item.key)}
                        className={`min-h-9 px-3 rounded-full border text-xs font-semibold transition-all ${
                          activeInsight === item.key
                            ? 'border-gold/45 bg-gold/15 text-gold'
                            : 'border-navy-light bg-navy text-slate hover:border-gold/30'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className={`text-base font-bold ${activeInsightItem.tone}`}>{activeInsightItem.value}</p>
                  <p className="text-slate text-sm mt-2 leading-relaxed">{activeInsightItem.detail}</p>
                </div>
              </div>
            )}
          </div>

          <div data-reveal className="bg-navy-surface/30 rounded-2xl border border-navy-light/50 p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Salary funnel</p>
                <h3 className="text-white text-xl font-bold">From gross income to what you actually keep</h3>
              </div>
              <div className="bg-emerald/10 border border-emerald/20 rounded-xl px-4 py-3">
                <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-1">You keep</p>
                <p className="text-white font-mono-data text-2xl font-bold">{takeHomePercent.toFixed(0)}%</p>
              </div>
            </div>

            {calculated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-gold/25 bg-gold/10 p-4">
                    <p className="text-gold text-xs uppercase tracking-[0.12em] mb-1">Gross</p>
                    <p className="text-white font-mono-data text-xl font-bold">RM {results.grossMonthly.toFixed(0)}</p>
                  </div>
                  <div className="rounded-xl border border-crimson/25 bg-crimson/10 p-4">
                    <p className="text-crimson text-xs uppercase tracking-[0.12em] mb-1">Total outflow</p>
                    <p className="text-white font-mono-data text-xl font-bold">RM {totalOutflow.toFixed(0)}</p>
                  </div>
                  <div className="rounded-xl border border-emerald/25 bg-emerald/10 p-4">
                    <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-1">You keep</p>
                    <p className="text-white font-mono-data text-xl font-bold">{netItem.percent.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
                  <div className="rounded-2xl border border-navy-light bg-[#0B1830] p-4">
                    <p className="text-slate text-xs uppercase tracking-[0.12em] mb-3">Flow breakdown</p>
                    <div className="md:hidden flex flex-wrap gap-2 mb-3">
                      {flowItems.map((item) => (
                        <button
                          key={`chip-${item.key}`}
                          type="button"
                          onClick={() => handleFlowSelect(item.key)}
                          className={`min-h-10 px-3 rounded-full border text-xs font-semibold transition-all ${
                            highlightedFlow === item.key
                              ? 'border-gold/45 bg-navy-surface text-white'
                              : 'border-navy-light bg-navy text-slate'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {flowItems.map((item) => {
                        const width = Math.max(item.key === 'net' ? 18 : 10, Math.min(100, item.percent));
                        const isHighlighted = highlightedFlow === item.key;
                        return (
                          <button
                            key={`bar-${item.key}`}
                            type="button"
                            onMouseEnter={() => handleFlowHover(item.key)}
                            onFocus={() => handleFlowSelect(item.key)}
                            onClick={() => handleFlowSelect(item.key)}
                            className={`w-full text-left rounded-xl border px-4 py-4 transition-all duration-200 min-h-[84px] ${
                              isHighlighted ? 'border-gold/40 bg-navy-surface' : 'border-navy-light/80 bg-navy md:hover:border-gold/20'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <p className={`text-sm font-semibold ${item.key === 'net' ? 'text-emerald' : 'text-white'}`}>{item.label}</p>
                              <span className="text-white font-mono-data text-sm font-bold">{item.percent.toFixed(1)}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-navy-light overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${width}%`, backgroundColor: item.color }}
                              />
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <p className={`font-mono-data text-sm font-bold ${item.accent}`}>RM {item.amount.toFixed(0)}</p>
                              <p className="text-slate text-xs">{item.key === 'net' ? 'kept' : 'leaves your pay'}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="hidden md:block space-y-3">
                    <div className="rounded-2xl border border-gold/25 bg-navy-surface p-4">
                      <p className="text-slate text-xs uppercase mb-1">Focused explanation</p>
                      <p className={`text-base font-bold mb-1 ${highlightedItem.accent}`}>{highlightedItem.label} — {highlightedItem.percent.toFixed(1)}%</p>
                      <p className="text-slate text-sm leading-relaxed">{highlightedItem.description}</p>
                      <p className="text-white font-mono-data text-sm mt-3">RM {highlightedItem.amount.toFixed(0)} / month</p>
                    </div>
                    <div className="rounded-2xl border border-navy-light bg-navy-surface/70 p-4">
                      <p className="text-slate text-xs uppercase mb-2">Interaction</p>
                      <p className="text-white text-sm leading-relaxed">
                        Hover cards to preview details. Click any card to lock selection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 rounded-full bg-navy-light flex items-center justify-center mb-4">
                  <span className="text-3xl">🧪</span>
                </div>
                <p className="text-white text-base font-semibold mb-2">Your salary funnel will appear here</p>
                <p className="text-slate text-sm max-w-sm">
                  Enter a valid salary and the funnel will update live with clear labels, percentages, and the amount flowing out at each step.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

