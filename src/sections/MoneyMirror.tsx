import NumberField from '../app/NumberField';
import { numberError } from '../lib/numericInput';
import { scrollToContent } from '../lib/pageNavigation';
import { formatMoney } from '../lib/currency';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUp, ChevronDown } from 'lucide-react';
import './MoneyMirror.css';

interface MoneyMirrorPreset {
  name: string;
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
    badge: 'Starter',
    salary: '3500',
    hours: '45',
    commute: '2',
    expenses: '450',
    description: 'Salary looks fine, but time freedom is tight.',
  },
  {
    name: 'Urban Commuter',
    badge: 'Busy city',
    salary: '8000',
    hours: '55',
    commute: '3',
    expenses: '900',
    description: 'Higher pay, but long hours and transport costs eat the upside.',
  },
  {
    name: 'Disciplined Saver',
    badge: 'Lean spender',
    salary: '5000',
    hours: '42',
    commute: '1',
    expenses: '300',
    description: 'Lower lifestyle drag leaves more room to build wealth.',
  },
];

const findDockSlot = () => document.getElementById('lesson-dock-money-mirror');

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
  const resultsRef = useRef<HTMLDivElement>(null);
  const examplesButtonRef = useRef<HTMLButtonElement>(null);
  const [salary, setSalary] = useState('');
  const [hours, setHours] = useState('');
  const [commute, setCommute] = useState('');
  const [expenses, setExpenses] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [examplesOpen, setExamplesOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  // The app shell renders this lesson's dock slot; a result only exists after typing, by which point the slot is mounted.
  const dockSlot = findDockSlot();
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsPhone(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const salaryIsValid = salary.trim() !== '' && !numberError(salary, SALARY_MIN, SALARY_MAX, true);
  const calculated = salaryIsValid && !numberError(hours, HOURS_MIN, HOURS_MAX) && !numberError(commute, 0, 24) && !numberError(expenses);
  const hoursValue = hours === '' ? 44 : Math.min(HOURS_MAX, Math.max(HOURS_MIN, Number(hours) || 44));
  const results = useMemo(() => computeMoneyMirrorResults(
    calculated ? Number(salary) : 0, hours === '' ? 44 : Number(hours), Number(commute) || 0, Number(expenses) || 0,
  ), [calculated, salary, hours, commute, expenses]);
  const deductions = results.pcbMonthly + results.epfEmployee + results.socsoEmployee + results.eisEmployee;
  const hasInvalidInput = !!numberError(salary, SALARY_MIN, SALARY_MAX) || !!numberError(hours, HOURS_MIN, HOURS_MAX) || !!numberError(commute, 0, 24) || !!numberError(expenses);
  const selectedPresetMeta = presets.find(preset => preset.name === selectedPreset);
  const edit = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setSelectedPreset(null);
  };
  const applyPreset = (preset: MoneyMirrorPreset) => {
    setSalary(preset.salary);
    setHours(preset.hours);
    setCommute(preset.commute);
    setExpenses(preset.expenses);
    setSelectedPreset(preset.name);
    setSubmitted(false);
    setExamplesOpen(false);
    examplesButtonRef.current?.focus({ preventScroll: true });
  };
  const viewResults = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!calculated) {
      const invalidId = !salaryIsValid ? 'mm-salary' : numberError(expenses) ? 'mm-expenses' : numberError(hours, HOURS_MIN, HOURS_MAX) ? 'mm-hours' : 'mm-commute';
      document.getElementById(invalidId)?.focus();
      return;
    }
    if (resultsRef.current) scrollToContent(resultsRef.current);
  };
  const showResults = () => {
    if (resultsRef.current) scrollToContent(resultsRef.current);
  };
  const editNumbers = () => {
    const salaryInput = document.getElementById('mm-salary');
    if (salaryInput) scrollToContent(salaryInput);
  };
  const deductionRows = [
    { label: 'PCB tax', amount: results.pcbMonthly, note: 'Estimated monthly income tax.' },
    { label: 'Employee EPF', amount: results.epfEmployee, note: 'Your contribution, deducted from salary.' },
    { label: 'SOCSO', amount: results.socsoEmployee, note: 'PERKESO employee contribution.' },
    { label: 'EIS', amount: results.eisEmployee, note: 'Employment Insurance System contribution.' },
    { label: 'Work costs', amount: results.workExpenses, note: 'Travel, meals, parking and uniforms.' },
  ];

  return <section id="money-mirror" className="mm-worksheet" aria-labelledby="mm-heading">
    <div className="mm-page">
      <header className="mm-intro">
        <h1 id="mm-heading">Your pay, minus the guesswork.</h1>
        <p>Four numbers. The full picture.</p>
      </header>
      <div className="mm-workspace">
        <div className="mm-entry">
          <form className="money-form" noValidate onSubmit={viewResults} aria-label="Your pay and working time">
            <div className="mm-fields">
              <NumberField validationMode="change" id="mm-salary" label="Monthly salary" prefix="RM" value={salary} onChange={edit(setSalary)} min={SALARY_MIN} max={SALARY_MAX} required placeholder="e.g. 8000" submitted={submitted} />
              <NumberField validationMode="change" id="mm-expenses" label="Work costs per month" prefix="RM" value={expenses} onChange={edit(setExpenses)} placeholder="0" submitted={submitted} />
              <div className="mm-hours-field">
                <NumberField validationMode="change" id="mm-hours" label="Work hours / week" value={hours} onChange={edit(setHours)} min={HOURS_MIN} max={HOURS_MAX} placeholder="44" inputMode="numeric" suffix="hrs" submitted={submitted} />
                <details className="hours-slider">
                  <summary>Use slider<ChevronDown size={17} aria-hidden="true" /></summary>
                  <input type="range" min={HOURS_MIN} max={HOURS_MAX} step="1" value={hoursValue} onChange={event => edit(setHours)(event.target.value)} aria-label="Hours worked per week" aria-valuetext={`${hoursValue} hours per week`} className="lesson-range" />
                  <p>{hoursValue} hours / week</p>
                </details>
              </div>
              <NumberField validationMode="change" id="mm-commute" label="Commute hours / day" value={commute} onChange={edit(setCommute)} max={24} placeholder="0" suffix="hrs" submitted={submitted} />
            </div>
            <p className="mm-defaults">Use salary before deductions. Blank fields use 44 work hours and zero costs or commute.</p>
            <div className="mm-form-actions">
              <button type="submit" className="mm-text-action">View my results<ArrowRight size={17} aria-hidden="true" /></button>
              <button ref={examplesButtonRef} type="button" className="mm-text-action" aria-expanded={examplesOpen} aria-controls="mm-examples" onClick={() => setExamplesOpen(value => !value)}>Try an example<ChevronDown size={16} aria-hidden="true" /></button>
            </div>
          </form>
          <div id="mm-examples" className="mm-examples" hidden={!examplesOpen}>
            <p>Choose example numbers to explore.</p>
            <div>{presets.map(preset => <button key={preset.name} type="button" aria-pressed={selectedPreset === preset.name} onClick={() => applyPreset(preset)}><span>{preset.name}</span><small aria-hidden="true">{preset.badge}</small></button>)}</div>
          </div>
        </div>
        <div className="mm-output">
          {calculated ? <div id="money-mirror-results" ref={resultsRef} tabIndex={-1} aria-label="Your cashflow results" className="mm-result">
            <p className="mm-status" role="status">{selectedPreset ? `Example · ${selectedPreset}` : 'Your numbers · live estimate'}</p>
            <div className="mm-rate"><h2>What an hour<br />is worth</h2><p className="mm-amount"><span>RM</span> {formatMoney(results.trueHourly)}</p></div>
            <dl className="mm-receipt">
              <div><dt>Monthly take-home*</dt><dd>RM {formatMoney(results.netIncome)}</dd></div>
              <div><dt>Work + travel / month</dt><dd>{(results.annualHours / 12).toFixed(1)} hours</dd></div>
              <div><dt>Estimated deductions</dt><dd>RM {formatMoney(deductions)}</dd></div>
            </dl>
            <p className="mm-footnote">*After work costs of RM {formatMoney(results.workExpenses)}.</p>
            <button type="button" className="mm-edit-action" onClick={editNumbers}>Adjust my numbers<ArrowUp size={18} aria-hidden="true" /></button>
            {selectedPresetMeta && <p className="mm-example-note">{selectedPresetMeta.description}</p>}
          </div> : <div className="mm-result mm-empty" aria-live="polite">
            <h2>{hasInvalidInput ? 'Check the highlighted field.' : 'Enter salary to see your estimate.'}</h2>
          </div>}
          <details className="mm-deductions">
            <summary>Deductions &amp; calculation<ChevronDown size={17} aria-hidden="true" /></summary>
            {calculated && <>
              <dl className="mm-breakdown-list"><div><dt>Gross monthly salary</dt><dd>RM {formatMoney(results.grossMonthly)}</dd></div>{deductionRows.map(row => <div key={row.label}><dt>{row.label}<small>{row.note}</small></dt><dd>RM {formatMoney(row.amount)}</dd></div>)}<div className="mm-total"><dt>What you keep</dt><dd>RM {formatMoney(results.netIncome)}</dd></div></dl>
              <p>You keep {(results.netIncome / results.grossMonthly * 100).toFixed(1)}% of gross salary after deductions and work costs. Your employer’s estimated EPF contribution is RM {formatMoney(results.epfEmployer)}; it is not deducted from take-home pay.</p>
            </>}
            <p>We subtract estimated PCB, employee EPF, SOCSO, EIS and work costs from salary, then divide by work and commute hours. The time model uses 4.3 weeks per month and five commute days per week.</p>
            <p>PCB uses Malaysian progressive tax with personal relief and the EPF relief cap. These are estimates, not a replacement for your payslip.</p>
          </details>
          {calculated && <details className="mm-time-details">
            <summary>What your time adds up to<ChevronDown size={17} aria-hidden="true" /></summary>
            <dl className="mm-breakdown-list"><div><dt>Annual hours traded</dt><dd>{results.annualHours.toFixed(0)} hours</dd></div><div><dt>Equivalent full days</dt><dd>{Math.round(results.annualHours / 24)} days</dd></div><div><dt>Modelled survival without work</dt><dd>{results.monthsSurvival.toFixed(1)} months</dd></div></dl>
            <p>The survival illustration assumes six months of net income set aside, with monthly spending at 70% of gross salary. It is not based on your actual savings. When work costs are zero, this illustration returns zero.</p>
          </details>}
        </div>
      </div>
    </div>
    {isPhone && calculated && dockSlot && createPortal(<button type="button" className="mm-dock-result" onClick={showResults}><span>An hour of work is worth</span><strong>RM {formatMoney(results.trueHourly)}</strong><span className="sr-only">Show the breakdown</span></button>, dockSlot)}
  </section>;
}
