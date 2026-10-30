import NumberField from '../app/NumberField';
import { numberError } from '../lib/numericInput';
import { scrollToContent } from '../lib/pageNavigation';
import { formatMoney } from '../lib/currency';
import { useState, useRef } from 'react';

interface ThermometerResult {
  totalLiquid: number;
  monthlyPassive: number;
  monthlyExpenses: number;
  monthsFreedom: number;
  zone: 'crisis' | 'precarious' | 'freedom' | 'infinite';
}

interface ExampleProfile {
  name: string;
  asb: string;
  unitTrust: string;
  savings: string;
  dividends: string;
  rental: string;
  stockDividends: string;
  expenses: string;
  description: string;
}

const zoneConfig = {
  crisis: { label: 'Crisis', color: 'var(--ledger-negative)', message: 'One retrenchment away from disaster.' },
  precarious: { label: 'Precarious', color: 'var(--ledger-accent)', message: 'Can survive, can\'t thrive.' },
  freedom: { label: 'Freedom Money', color: 'var(--ledger-positive)', message: 'You can quit your job.' },
  infinite: { label: 'Financially Free', color: 'var(--ledger-accent)', message: 'Dah cukup. Enough.' },
};

const actionSteps: Record<string, string[]> = {
  crisis: [
    'Open an ASB account today — start with RM 100/month',
    'Track every expense for 30 days. Cut one subscription.',
    'Build a RM 1,000 emergency fund as your first milestone.',
  ],
  precarious: [
    'Increase ASB contribution to RM 500/month',
    'Explore side income: freelance, tutoring, dropshipping',
    'Target: 6-month expense buffer in liquid savings.',
  ],
  freedom: [
    'Consider your first rental property investment',
    'Diversify into dividend stocks (Maybank, Public Bank)',
    'Plan your exit from full-time employment.',
  ],
  infinite: [
    'You made it. Teach someone else what you learned.',
    'Explore philanthropy or mentorship in your community.',
    'Optimize tax efficiency across your portfolio.',
  ],
};

const exampleProfiles: ExampleProfile[] = [
  {
    name: 'Starting Out',
    asb: '3000',
    unitTrust: '0',
    savings: '1500',
    dividends: '20',
    rental: '0',
    stockDividends: '0',
    expenses: '2800',
    description: 'Low liquidity and no meaningful passive income yet.',
  },
  {
    name: 'Buffer Builder',
    asb: '18000',
    unitTrust: '8000',
    savings: '12000',
    dividends: '120',
    rental: '0',
    stockDividends: '80',
    expenses: '3500',
    description: 'Emergency runway exists, but salary is still doing most of the work.',
  },
  {
    name: 'Cashflow Machine',
    asb: '80000',
    unitTrust: '30000',
    savings: '20000',
    dividends: '350',
    rental: '2200',
    stockDividends: '650',
    expenses: '3000',
    description: 'Multiple income streams are now carrying the lifestyle.',
  },
];

function calculateThermometerResult(
  asb: string,
  unitTrust: string,
  savings: string,
  dividends: string,
  rental: string,
  stockDividends: string,
  expenses: string,
): ThermometerResult {
  const totalLiquid = (parseFloat(asb) || 0) + (parseFloat(unitTrust) || 0) + (parseFloat(savings) || 0);
  const monthlyPassive = (parseFloat(dividends) || 0) + (parseFloat(rental) || 0) + (parseFloat(stockDividends) || 0);
  const monthlyExpenses = parseFloat(expenses) || 1;

  let monthsFreedom: number;
  let zone: ThermometerResult['zone'];

  if (monthlyPassive >= monthlyExpenses) {
    monthsFreedom = Infinity;
    zone = 'infinite';
  } else {
    const expenseCoverage = monthlyPassive > 0 ? totalLiquid / (monthlyExpenses - monthlyPassive) : totalLiquid / monthlyExpenses;
    monthsFreedom = expenseCoverage;
    if (monthsFreedom <= 3) zone = 'crisis';
    else if (monthsFreedom <= 12) zone = 'precarious';
    else zone = 'freedom';
  }

  return { totalLiquid, monthlyPassive, monthlyExpenses, monthsFreedom, zone };
}

export default function WealthThermometer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [asb, setAsb] = useState('');
  const [unitTrust, setUnitTrust] = useState('');
  const [savings, setSavings] = useState('');
  const [dividends, setDividends] = useState('');
  const [rental, setRental] = useState('');
  const [stockDividends, setStockDividends] = useState('');
  const [expenses, setExpenses] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const values = [asb, unitTrust, savings, dividends, rental, stockDividends, expenses];
  const valid = !values.some(value => numberError(value)) && !numberError(expenses, .01, undefined, true);
  const result = valid ? calculateThermometerResult(asb, unitTrust, savings, dividends, rental, stockDividends, expenses) : null;
  const showResult = valid;
  const viewResults = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!valid) {
      const invalid = event.currentTarget.querySelector<HTMLElement>('[aria-invalid=true], input:invalid');
      invalid?.closest('details')?.setAttribute('open', '');
      invalid?.focus();
      return;
    }
    const target = resultRef.current;
    if (target) {
      scrollToContent(target);
    }
  };

  const fillPercent = result
    ? result.zone === 'infinite'
      ? 100
      : Math.min(100, (result.monthsFreedom / 60) * 100)
    : 0;
  const selectedProfileMeta = exampleProfiles.find((profile) => profile.name === selectedProfile);
  const freedomScore = result
    ? result.zone === 'infinite'
      ? 100
      : Math.min(99, Math.round((fillPercent + (result.monthlyPassive / Math.max(result.monthlyExpenses, 1)) * 30)))
    : 0;

  const applyProfile = (profile: ExampleProfile) => {
    setSelectedProfile(profile.name);
    setAsb(profile.asb);
    setUnitTrust(profile.unitTrust);
    setSavings(profile.savings);
    setDividends(profile.dividends);
    setRental(profile.rental);
    setStockDividends(profile.stockDividends);
    setExpenses(profile.expenses);
  };

  return (
    <section id="wealth-thermometer" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: 'var(--ledger-ground)' }} aria-labelledby="wealth-thermometer-heading">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <header className="lesson-intro">
          <h1 id="wealth-thermometer-heading">Wealth is not a number. It is a countdown.</h1>
          <p>How many months could you survive without working? Let's find out.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div data-reveal>

            <form className="wealth-form space-y-5" noValidate onSubmit={viewResults}>
              <h2 className="form-group-heading">Liquid assets</h2>
              <NumberField id="wt-asb" label="ASB / ASNB balance (RM)" value={asb} onChange={setAsb} placeholder="0" submitted={submitted} />
              <NumberField id="wt-unit-trust" label="Unit trusts (RM)" value={unitTrust} onChange={setUnitTrust} placeholder="0" submitted={submitted} />
              <NumberField id="wt-savings" label="Savings account (RM)" value={savings} onChange={setSavings} placeholder="0" hint="Exclude EPF and other funds you cannot access now." submitted={submitted} />
              <h2 className="form-group-heading">Monthly spending</h2>
              <NumberField id="wt-expenses" label="Total monthly expenses (RM)" value={expenses} onChange={setExpenses} min={.01} required placeholder="3500" submitted={submitted} />
              <details className="optional-income"><summary>Monthly passive income<span>{[dividends, rental, stockDividends].some(value => Number(value) !== 0) ? `RM ${formatMoney((Number(dividends) || 0) + (Number(rental) || 0) + (Number(stockDividends) || 0))} / month` : 'Optional'}</span></summary><div>
              <NumberField id="wt-dividends" label="ASB / ASN dividends (RM)" value={dividends} onChange={setDividends} placeholder="0" submitted={submitted} />
              <NumberField id="wt-rental" label="Rental income (RM)" value={rental} onChange={setRental} placeholder="0" submitted={submitted} />
              <NumberField id="wt-stock" label="Stock dividends (RM)" value={stockDividends} onChange={setStockDividends} placeholder="0" submitted={submitted} />
</div></details>
              <div className="lesson-action"><button type="submit" className="primary-button">View my breathing room</button></div>
              <p className="field-hint">Results update as you type. No numbers are saved.</p>
            </form>
            <details className="example-presets mb-6"><summary>Try an example profile</summary>
              <div className="flex flex-wrap gap-2">
                {exampleProfiles.map((profile) => (
                  <button
                    key={profile.name}
                    aria-pressed={selectedProfile === profile.name}
                    onClick={() => applyProfile(profile)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all duration-200 ${
                      selectedProfile === profile.name
                        ? 'bg-gold text-navy border-gold'
                        : 'bg-navy-surface border-navy-light text-white hover:border-gold/50'
                    }`}
                  >
                    {profile.name}
                  </button>
                ))}
              </div>
              {selectedProfileMeta && (
                <p className="text-slate text-sm mt-3">{selectedProfileMeta.description}</p>
              )}
            </details>
          </div>

          {/* Result Display */}
          <div ref={resultRef} id="wealth-results" tabIndex={-1} aria-label="Your financial breathing room">
            {showResult && result ? (
              <div className="space-y-6">
                {/* Thermometer */}
                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8 flex flex-col items-center">
                  <p data-result className="text-slate text-xs uppercase mb-2">Your Wealth Thermometer</p>
                  <p data-result className="text-3xl md:text-4xl font-bold font-mono-data mb-6" style={{ color: zoneConfig[result.zone].color }}>
                    {result.zone === 'infinite' ? 'Financially Free!' : `${result.monthsFreedom.toFixed(1)} months`}
                  </p>
                  <div data-result className="mb-5 px-4 py-3 rounded-xl border border-gold/20 bg-gold/10 text-center">
                    <p className="text-gold text-xs uppercase tracking-[0.12em] mb-1">Freedom score</p>
                    <p className="text-white font-mono-data text-2xl font-bold">{freedomScore}/100</p>
                  </div>

                  <div className="flex items-start gap-8">
                    <div className="relative">
                      <div className="w-12 h-[300px] bg-navy-light rounded-full overflow-hidden relative">
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-full transition-all ease-out"
                          style={{
                            height: `${fillPercent}%`,
                            transitionDuration: '2000ms',
                            background: result.zone === 'infinite'
                              ? 'linear-gradient(to top, var(--ledger-positive), var(--ledger-accent), var(--ledger-accent))'
                              : 'linear-gradient(to top, var(--ledger-negative), var(--ledger-accent), var(--ledger-positive))',
                          }}
                        >
                          {/* Wave effect at top */}
                          <svg className="absolute -top-1 left-0 w-full" height="6" viewBox="0 0 48 6" preserveAspectRatio="none">
                            <path d="M0,3 Q12,0 24,3 T48,3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1">
                              <animate attributeName="d" values="M0,3 Q12,0 24,3 T48,3;M0,3 Q12,6 24,3 T48,3;M0,3 Q12,0 24,3 T48,3" dur="2s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        </div>
                        {result.zone === 'infinite' && (
                          <div className="absolute inset-0 bg-gold/10 animate-pulse rounded-full" />
                        )}
                      </div>
                    </div>

                    {/* Zone Labels */}
                    <div className="flex flex-col justify-between h-[300px] py-2">
                      {[
                        { label: 'Infinite', sub: 'Financially Free', color: 'var(--ledger-accent)', threshold: Infinity },
                        { label: '5 years', sub: 'Freedom Money', color: 'var(--ledger-positive)', threshold: 60 },
                        { label: '12 months', sub: 'Precarious', color: 'var(--ledger-accent)', threshold: 12 },
                        { label: '3 months', sub: 'Crisis', color: 'var(--ledger-negative)', threshold: 3 },
                      ].map((z, i) => {
                        const isActive = result.zone === 'infinite'
                          ? z.threshold === Infinity
                          : result.monthsFreedom >= z.threshold;
                        return (
                          <div key={i} className={`flex items-center gap-2 transition-opacity duration-500 ${isActive ? 'font-medium' : 'text-slate'}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                            <div>
                              <p className="text-white text-xs font-medium">{z.label}</p>
                              <p className="text-slate text-sm">{z.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div data-result className="grid grid-cols-3 gap-4 mt-8 w-full">
                    <div className="text-center">
                      <p className="text-slate text-xs uppercase">Liquid Assets</p>
                      <p className="text-gold font-mono-data text-lg font-bold">RM {formatMoney(result.totalLiquid)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate text-xs uppercase">Passive Income</p>
                      <p className="text-emerald font-mono-data text-lg font-bold">RM {formatMoney(result.monthlyPassive)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate text-xs uppercase">Expenses</p>
                      <p className="text-crimson font-mono-data text-lg font-bold">RM {formatMoney(result.monthlyExpenses)}</p>
                    </div>
                  </div>
                </div>

                {/* Zone Message */}
                <div data-result className="rounded-xl p-5 border" style={{ borderColor: `color-mix(in srgb, ${zoneConfig[result.zone].color} 25%, transparent)`, backgroundColor: `color-mix(in srgb, ${zoneConfig[result.zone].color} 3%, transparent)` }}>
                  <p className="text-sm mb-1" style={{ color: zoneConfig[result.zone].color }}>
                    {zoneConfig[result.zone].label} Zone
                  </p>
                  <p className="text-slate text-sm">{zoneConfig[result.zone].message}</p>
                </div>

                {/* Action Steps */}
                <div data-result className="space-y-3">
                  <p className="text-white text-sm font-semibold">Your Next Steps:</p>
                  {actionSteps[result.zone].map((step, i) => (
                    <div key={i} className="flex items-start gap-3 bg-navy-surface border border-navy-light rounded-xl p-4">
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-gold text-xs font-bold">{i + 1}</span>
                      </div>
                      <p className="text-slate text-sm">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Celebration */}
                {result.zone === 'infinite' && (
                  <div data-result className="text-center py-6">
                    <p className="text-gold text-2xl font-bold animate-pulse">Dah cukup. Enough.</p>
                    <p className="text-slate text-sm mt-2">You have achieved financial freedom.</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="field-hint">Enter your monthly expenses to see your breathing room.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

