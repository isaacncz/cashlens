import NumberField from '../app/NumberField';
import { numberError } from '../lib/numericInput';
import { scrollToContent } from '../lib/pageNavigation';
import { formatMoney } from '../lib/currency';
import { useEffect, useMemo, useRef, useState } from 'react';

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
  pcbMonthly: number;
  socsoEmployee: number;
  eisEmployee: number;
  workExpenses: number;
  netIncome: number;
}

type FlowKey = 'pcb' | 'epf' | 'socso' | 'eis' | 'expense' | 'net';
type InsightKey = 'rate' | 'keep' | 'time';

function calculateAnnualTax(chargeableAnnual: number): number {
  if (chargeableAnnual <= 0) return 0;
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

  let remaining = chargeableAnnual;
  let prevLimit = 0;

  for (const bracket of brackets) {
    const taxable = Math.min(Math.max(remaining, 0), bracket.limit - prevLimit);
    tax += taxable * bracket.rate;
    remaining -= taxable;
    prevLimit = bracket.limit;
    if (remaining <= 0) break;
  }

  if (remaining > 0) tax += remaining * 0.3;

  const rebate = chargeableAnnual <= 35000 ? 400 : 0;
  return Math.max(0, tax - rebate);
}

function calculateEPF(salary: number): { employee: number; employer: number } {
  const capped = Math.min(salary, 20000);
  return {
    employee: capped * 0.11,
    employer: capped * (salary <= 5000 ? 0.13 : 0.12),
  };
}

function calculateSOCSOEmployee(salary: number): number {
  const contributable = Math.min(salary, 5000);
  return contributable * 0.00495;
}

function calculateEISEmployee(salary: number): number {
  const contributable = Math.min(salary, 4950);
  return contributable * 0.002;
}

function calculatePCB(monthlySalary: number, epfEmployee: number): number {
  const annualGross = monthlySalary * 12;
  const epfRelief = Math.min(epfEmployee * 12, 4000);
  const personalRelief = 9000;
  const chargeableAnnual = Math.max(0, annualGross - epfRelief - personalRelief);
  return calculateAnnualTax(chargeableAnnual) / 12;
}

const SALARY_MIN = 1000;
const SALARY_MAX = 50000;
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
  const socsoEmployee = calculateSOCSOEmployee(salary);
  const eisEmployee = calculateEISEmployee(salary);
  const pcbMonthly = calculatePCB(salary, epf.employee);
  const netIncome = salary - epf.employee - socsoEmployee - eisEmployee - pcbMonthly - expenses;
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
    pcbMonthly,
    socsoEmployee,
    eisEmployee,
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
  const [submitted, setSubmitted] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [highlightedFlow, setHighlightedFlow] = useState<FlowKey>('net');
  const [activeInsight, setActiveInsight] = useState<InsightKey>('rate');
  const [supportsHover, setSupportsHover] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateHoverSupport = () => setSupportsHover(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateHoverSupport);
    return () => mediaQuery.removeEventListener('change', updateHoverSupport);
  }, []);

  const salaryValue = salary === '' ? Number.NaN : parseFloat(salary);
  const salaryHasInput = salary.trim().length > 0;
  const salaryIsValid = salaryHasInput && salaryValue >= SALARY_MIN && salaryValue <= SALARY_MAX;
  const hoursValue = hours === '' ? 44 : Math.min(HOURS_MAX, Math.max(HOURS_MIN, parseFloat(hours) || 44));
  const selectedPresetMeta = presets.find((preset) => preset.name === selectedPreset);

  const calculated = salaryIsValid && !numberError(hours, HOURS_MIN, HOURS_MAX) && !numberError(commute, 0, 24) && !numberError(expenses);
  const results = useMemo(() => computeMoneyMirrorResults(
    calculated ? Number(salary) : 0, hours === '' ? 44 : Number(hours), Number(commute) || 0, Number(expenses) || 0,
  ), [calculated, salary, hours, commute, expenses]);
  const viewResults = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!calculated) {
      event.currentTarget.querySelector<HTMLElement>('[aria-invalid=true], input:invalid')?.focus();
      return;
    }
    const target = resultsRef.current;
    if (target) {
      scrollToContent(target);
    }
  };

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
        key: 'pcb' as const,
        label: 'PCB tax',
        amount: results.pcbMonthly,
        percent: (results.pcbMonthly / gross) * 100,
        color: 'var(--ledger-negative)',
        accent: 'text-crimson',
        description: 'Estimated monthly tax deduction (PCB).',
      },
      {
        key: 'epf' as const,
        label: 'EPF',
        amount: results.epfEmployee,
        percent: (results.epfEmployee / gross) * 100,
        color: 'var(--ledger-accent)',
        accent: 'text-gold',
        description: 'Employee EPF contribution.',
      },
      {
        key: 'socso' as const,
        label: 'SOCSO',
        amount: results.socsoEmployee,
        percent: (results.socsoEmployee / gross) * 100,
        color: 'var(--ledger-info)',
        accent: 'text-white',
        description: 'PERKESO employee contribution.',
      },
      {
        key: 'eis' as const,
        label: 'EIS',
        amount: results.eisEmployee,
        percent: (results.eisEmployee / gross) * 100,
        color: 'var(--ledger-muted)',
        accent: 'text-slate',
        description: 'Employment Insurance System contribution.',
      },
      {
        key: 'expense' as const,
        label: 'Work costs',
        amount: results.workExpenses,
        percent: (results.workExpenses / gross) * 100,
        color: 'var(--ledger-negative)',
        accent: 'text-crimson',
        description: 'Petrol, tolls, food, parking, uniforms, commute friction.',
      },
      {
        key: 'net' as const,
        label: 'Keep',
        amount: results.netIncome,
        percent: (results.netIncome / gross) * 100,
        color: 'var(--ledger-positive)',
        accent: 'text-emerald',
        description: 'This is what is truly left for living, saving, or investing.',
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
      value: `RM ${formatMoney(results.trueHourly)}/hr`,
      detail: hourlyInsight.body,
      tone: hourlyInsight.tone,
    },
    {
      key: 'keep' as const,
      label: 'Keep rate',
      value: `${netItem.percent.toFixed(1)}%`,
      detail: `From RM ${formatMoney(results.grossMonthly)}, you keep RM ${formatMoney(netItem.amount)} after PCB, EPF, SOCSO, EIS, and work costs.`,
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
    <section id="money-mirror" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: 'var(--ledger-ground)' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h1 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: 'var(--ledger-ink)' }}>
              What Is Your Time{' '}
              <span className="text-gold">Really Worth?</span>
            </h1>
            <p data-reveal className="text-slate text-base md:text-lg mb-8 leading-relaxed">
              Enter monthly numbers and see where your salary actually goes.
            </p>

            <details className="example-presets mb-6"><summary>Try an example</summary>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    aria-pressed={selectedPreset === preset.name}
                    onClick={() => applyPreset(preset)}
                    className={`text-left rounded-xl border p-3 transition-all duration-200 min-h-[82px] ${
                      selectedPreset === preset.name
                        ? 'bg-gold/15 border-gold/50'
                        : 'bg-navy-surface border-navy-light text-white hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="preset-mark" aria-hidden="true" />
                      <span className="text-sm uppercase tracking-[0.12em] text-slate">{preset.badge}</span>
                    </div>
                    <p className={`mt-2 text-sm font-semibold ${selectedPreset === preset.name ? 'text-gold' : 'text-white'}`}>{preset.name}</p>
                  </button>
                ))}
              </div>
              {selectedPresetMeta && (
                <p className="text-slate text-sm mt-3 rounded-xl border border-navy-light bg-navy-surface/40 px-3 py-2">{selectedPresetMeta.description}</p>
              )}
            </details>

            <form className="money-form space-y-5 mb-8" noValidate onSubmit={viewResults}>
              <NumberField id="mm-salary" label="Monthly salary (RM)" value={salary} onChange={setSalary} min={SALARY_MIN} max={SALARY_MAX} required placeholder="8000" hint="Before tax and employee deductions." submitted={submitted} />
              <div>
                <NumberField id="mm-hours" label="Work hours / week" value={hours} onChange={setHours} min={HOURS_MIN} max={HOURS_MAX} placeholder="44" hint="Leave blank to use 44 hours." inputMode="numeric" submitted={submitted} />
                <input type="range" min={HOURS_MIN} max={HOURS_MAX} step="1" value={hoursValue} onChange={event => setHours(event.target.value)} aria-label="Hours worked per week" className="lesson-range" />
              </div>
              <NumberField id="mm-commute" label="Daily commute (hours)" value={commute} onChange={setCommute} max={24} placeholder="0" submitted={submitted} />
              <NumberField id="mm-expenses" label="Monthly work costs (RM)" value={expenses} onChange={setExpenses} placeholder="0" hint="Petrol, tolls, food, parking, and uniforms." submitted={submitted} />
              <div className="lesson-action"><button type="submit" className="primary-button">View my results</button></div>
              <p className="field-hint">Results update as you type. No numbers are saved.</p>
            </form>

            {calculated && (
              <div ref={resultsRef} id="money-mirror-results" tabIndex={-1} aria-label="Your cashflow results" className="mt-8 space-y-4">
                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-6">
                  <p className="text-slate text-sm mb-1">True Hourly Rate</p>
                  <p className="text-gold font-mono-data text-4xl md:text-5xl font-bold">
                    RM {formatMoney(results.trueHourly)}
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
                        aria-pressed={activeInsight === item.key}
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

          <details className="money-breakdown"><summary>Where your salary goes</summary>
          <div data-reveal className="bg-navy-surface/30 rounded-2xl border border-navy-light/50 p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Salary funnel</p>
                <h2 className="text-white text-xl font-bold">From gross income to what you actually keep</h2>
              </div>
              <div className="bg-emerald/10 border border-emerald/20 rounded-xl px-4 py-3">
                <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-1">You keep</p>
                <p className="text-white font-mono-data text-2xl font-bold">{takeHomePercent.toFixed(0)}%</p>
              </div>
            </div>

            {calculated ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl border border-gold/25 bg-gold/10 p-4">
                    <p className="text-gold text-xs uppercase tracking-[0.12em] mb-1">Gross</p>
                    <p className="text-white font-mono-data text-xl font-bold">RM {formatMoney(results.grossMonthly)}</p>
                  </div>
                  <div className="rounded-xl border border-crimson/25 bg-crimson/10 p-4">
                    <p className="text-crimson text-xs uppercase tracking-[0.12em] mb-1">Statutory</p>
                    <p className="text-white font-mono-data text-xl font-bold">RM {formatMoney(results.pcbMonthly + results.epfEmployee + results.socsoEmployee + results.eisEmployee)}</p>
                  </div>
                  <div className="rounded-xl border border-crimson/25 bg-crimson/10 p-4">
                    <p className="text-crimson text-xs uppercase tracking-[0.12em] mb-1">Total outflow</p>
                    <p className="text-white font-mono-data text-xl font-bold">RM {formatMoney(totalOutflow)}</p>
                  </div>
                  <div className="rounded-xl border border-emerald/25 bg-emerald/10 p-4">
                    <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-1">You keep</p>
                    <p className="text-white font-mono-data text-xl font-bold">{netItem.percent.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-navy-light bg-navy-surface p-4">
                    <p className="text-slate text-xs uppercase tracking-[0.12em] mb-3">Flow breakdown</p>
                    <div className="md:hidden flex flex-wrap gap-2 mb-3">
                      {flowItems.map((item) => (
                        <button
                          key={`chip-${item.key}`}
                          type="button"
                          aria-pressed={highlightedFlow === item.key}
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
                    <div className="rounded-lg bg-navy p-2 mb-3 flex h-3 overflow-hidden">
                      {flowItems.map((item) => (
                        <div key={`stack-${item.key}`} style={{ width: `${Math.max(2, item.percent)}%`, backgroundColor: item.color }} />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {flowItems.map((item) => {
                        const width = Math.max(item.key === 'net' ? 18 : 6, Math.min(100, item.percent));
                        const isHighlighted = highlightedFlow === item.key;
                        return (
                          <button
                            key={`bar-${item.key}`}
                            type="button"
                            onMouseEnter={() => handleFlowHover(item.key)}
                            onFocus={() => handleFlowSelect(item.key)}
                            aria-pressed={highlightedFlow === item.key}
                          onClick={() => handleFlowSelect(item.key)}
                            className={`w-full text-left rounded-lg border px-3 py-3 transition-all duration-200 ${
                              isHighlighted ? 'border-gold/40 bg-navy-light' : 'border-navy-light/80 bg-navy-surface md:hover:border-gold/20'
                            }`}
                          >
                            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 mb-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                                <p className={`text-sm font-semibold truncate ${item.key === 'net' ? 'text-emerald' : 'text-white'}`}>{item.label}</p>
                              </div>
                              <span className={`font-mono-data text-xs font-bold ${item.accent}`}>RM {formatMoney(item.amount)}</span>
                              <span className="text-white font-mono-data text-sm font-bold">{item.percent.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-navy-light overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${width}%`, backgroundColor: item.color }}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-end">
                              <p className="text-slate text-sm">{item.key === 'net' ? 'kept' : 'deduction'}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gold/25 bg-navy-surface p-4">
                      <p className="text-slate text-xs uppercase mb-1">Focused explanation</p>
                      <p className={`text-base font-bold mb-1 ${highlightedItem.accent}`}>{highlightedItem.label} — {highlightedItem.percent.toFixed(1)}%</p>
                      <p className="text-slate text-sm leading-relaxed">{highlightedItem.description}</p>
                      <p className="text-white font-mono-data text-sm mt-2">RM {formatMoney(highlightedItem.amount)} / month</p>
                    </div>
                    <div className="rounded-xl border border-navy-light bg-navy-surface/70 p-4">
                      <p className="text-slate text-xs uppercase mb-2">Tax model note</p>
                      <p className="text-white text-sm leading-relaxed">
                        PCB is estimated from Malaysian progressive tax with personal relief + EPF relief cap, then converted to monthly deduction.
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
          </details>
        </div>
      </div>
    </section>
  );
}

