import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ThermometerResult {
  totalLiquid: number;
  monthlyPassive: number;
  monthlyExpenses: number;
  monthsFreedom: number;
  zone: 'crisis' | 'precarious' | 'freedom' | 'infinite';
}

const zoneConfig = {
  crisis: { label: 'Crisis', color: '#DC2626', message: 'One retrenchment away from disaster.', icon: '🔴' },
  precarious: { label: 'Precarious', color: '#FFD700', message: 'Can survive, can\'t thrive.', icon: '🟡' },
  freedom: { label: 'Freedom Money', color: '#10B981', message: 'You can quit your job.', icon: '🟢' },
  infinite: { label: 'Financially Free', color: '#FFD700', message: 'Dah cukup. Enough.', icon: '✨' },
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
  const [result, setResult] = useState<ThermometerResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const calculate = () => {
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

    const res = { totalLiquid, monthlyPassive, monthlyExpenses, monthsFreedom, zone };
    setResult(res);
    setShowResult(true);

    setTimeout(() => {
      if (resultRef.current) {
        const els = resultRef.current.querySelectorAll('[data-result]');
        gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 });
      }
    }, 100);
  };

  const inputClass = "w-full bg-navy-surface border border-navy-light rounded-lg px-4 py-3 text-white font-mono-data text-sm focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(255,215,0,0.15)] transition-all placeholder:text-navy-light";
  const labelClass = "block text-xs font-medium uppercase tracking-wider text-slate mb-2";

  const fillPercent = result
    ? result.zone === 'infinite'
      ? 100
      : Math.min(100, (result.monthsFreedom / 60) * 100)
    : 0;

  return (
    <section id="wealth-thermometer" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 07 / Wealth Thermometer
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Wealth Is Not A Number.{' '}
          <span className="text-gold">It Is A Countdown.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          How many months could you survive without working? Let's find out.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div data-reveal>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold" /> Liquid Assets (excludes EPF — locked until 55)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>ASB/ASNB Balance (RM)</label>
                    <input type="number" value={asb} onChange={e => setAsb(e.target.value)} placeholder="20000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Unit Trust (RM)</label>
                    <input type="number" value={unitTrust} onChange={e => setUnitTrust(e.target.value)} placeholder="10000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Savings Account (RM)</label>
                    <input type="number" value={savings} onChange={e => setSavings(e.target.value)} placeholder="5000" className={inputClass} />
                  </div>
                  <div className="flex items-end">
                    <p className="text-navy-light text-xs pb-3">EPF is NOT liquid — locked until 55/60</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-emerald font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald" /> Monthly Passive Income
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>ASB/ASN Dividends (RM/mo)</label>
                    <input type="number" value={dividends} onChange={e => setDividends(e.target.value)} placeholder="150" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Rental Income (RM/mo)</label>
                    <input type="number" value={rental} onChange={e => setRental(e.target.value)} placeholder="0" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Dividend Stocks (RM/mo)</label>
                    <input type="number" value={stockDividends} onChange={e => setStockDividends(e.target.value)} placeholder="0" className={inputClass} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-crimson font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-crimson" /> Monthly Expenses
                </h3>
                <div>
                  <label className={labelClass}>Total Monthly Expenses (RM)</label>
                  <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)} placeholder="3500" className={inputClass} />
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full py-4 bg-gold text-navy font-semibold rounded-lg hover:shadow-[0_4px_16px_rgba(255,215,0,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Calculate My Freedom
              </button>
            </div>
          </div>

          {/* Result Display */}
          <div ref={resultRef}>
            {showResult && result ? (
              <div className="space-y-6">
                {/* Thermometer */}
                <div data-result className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8 flex flex-col items-center">
                  <p data-result className="text-navy-light text-xs uppercase mb-2">Your Wealth Thermometer</p>
                  <p data-result className="text-3xl md:text-4xl font-bold font-mono-data mb-6" style={{ color: zoneConfig[result.zone].color }}>
                    {result.zone === 'infinite' ? 'Financially Free!' : `${result.monthsFreedom.toFixed(1)} months`}
                  </p>

                  <div className="flex items-start gap-8">
                    <div className="relative">
                      <div className="w-12 h-[300px] bg-navy-light rounded-full overflow-hidden relative">
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-full transition-all ease-out"
                          style={{
                            height: `${fillPercent}%`,
                            transitionDuration: '2000ms',
                            background: result.zone === 'infinite'
                              ? 'linear-gradient(to top, #10B981, #FFD700, #FFD700)'
                              : 'linear-gradient(to top, #DC2626, #FFD700, #10B981)',
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
                        { label: 'Infinite', sub: 'Financially Free', color: '#FFD700', threshold: Infinity },
                        { label: '5 years', sub: 'Freedom Money', color: '#10B981', threshold: 60 },
                        { label: '12 months', sub: 'Precarious', color: '#FFD700', threshold: 12 },
                        { label: '3 months', sub: 'Crisis', color: '#DC2626', threshold: 3 },
                      ].map((z, i) => {
                        const isActive = result.zone === 'infinite'
                          ? z.threshold === Infinity
                          : result.monthsFreedom >= z.threshold;
                        return (
                          <div key={i} className={`flex items-center gap-2 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                            <div>
                              <p className="text-white text-xs font-medium">{z.label}</p>
                              <p className="text-navy-light text-[10px]">{z.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div data-result className="grid grid-cols-3 gap-4 mt-8 w-full">
                    <div className="text-center">
                      <p className="text-navy-light text-xs uppercase">Liquid Assets</p>
                      <p className="text-gold font-mono-data text-lg font-bold">RM {result.totalLiquid.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-navy-light text-xs uppercase">Passive Income</p>
                      <p className="text-emerald font-mono-data text-lg font-bold">RM {result.monthlyPassive.toFixed(0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-navy-light text-xs uppercase">Expenses</p>
                      <p className="text-crimson font-mono-data text-lg font-bold">RM {result.monthlyExpenses.toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Zone Message */}
                <div data-result className="rounded-xl p-5 border" style={{ borderColor: zoneConfig[result.zone].color + '40', backgroundColor: zoneConfig[result.zone].color + '08' }}>
                  <p className="text-sm mb-1" style={{ color: zoneConfig[result.zone].color }}>
                    {zoneConfig[result.zone].icon} {zoneConfig[result.zone].label} Zone
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
              <div className="bg-navy-surface/50 border border-navy-light rounded-2xl p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-navy-light flex items-center justify-center mb-4">
                  <span className="text-3xl">🌡️</span>
                </div>
                <p className="text-navy-light text-sm text-center">Enter your financial details and click "Calculate My Freedom" to see your Wealth Thermometer.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
