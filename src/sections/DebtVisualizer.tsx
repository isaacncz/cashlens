import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type QuadrantLevel = 0 | 1 | 2 | 3;

const quadrantLabels = ['E — Employee', 'S — Self-employed', 'B — Business Owner', 'I — Investor'];
const quadrantColors = ['#DC2626', '#8892B0', '#10B981', '#FFD700'];

export default function DebtVisualizer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sliderValue, setSliderValue] = useState<QuadrantLevel>(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(els, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  const multiplier = 1 + sliderValue * 0.5; // 1x to 2.5x
  const carMonthlyCost = 1500 * multiplier;
  const carTotalPaid = 126000 * multiplier;
  const ptptnBurden = 30000 * multiplier;
  const rentalIncome = 2000 * multiplier;
  const rentalSurplus = rentalIncome - 1800;
  const leverageSwing = rentalSurplus - carMonthlyCost;
  const debtRules = [
    {
      title: 'Cashflow test',
      badDebt: 'Fails',
      goodDebt: rentalSurplus > 0 ? 'Passes' : 'Borderline',
      goodTone: rentalSurplus > 0 ? 'text-emerald' : 'text-gold',
      helper: 'Does the debt put more money in than it takes out each month?',
    },
    {
      title: 'Asset backing',
      badDebt: 'Weak',
      goodDebt: 'Strong',
      goodTone: 'text-emerald',
      helper: 'Is there a cash-producing asset behind the loan?',
    },
    {
      title: 'Time freedom',
      badDebt: 'More work needed',
      goodDebt: sliderValue >= 2 ? 'Improves freedom' : 'Needs skill first',
      goodTone: sliderValue >= 2 ? 'text-emerald' : 'text-gold',
      helper: 'Does this debt reduce dependence on your salary over time?',
    },
  ];

  return (
    <section id="debt" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 06 / Debt Visualizer
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Not All Debt{' '}
          <span className="text-gold">Is Created Equal.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          Slide to see how the same debt crushes or amplifies, depending on your quadrant.
        </p>

        <div data-reveal className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-crimson/10 border border-crimson/30 rounded-2xl p-5">
            <p className="text-crimson text-xs uppercase tracking-[0.12em] mb-2">Bad debt drag</p>
            <p className="text-white text-2xl font-bold font-mono-data">- RM {carMonthlyCost.toFixed(0)}</p>
            <p className="text-slate text-sm mt-2">Car debt pulls cash out of your pocket every month.</p>
          </div>
          <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-5">
            <p className="text-emerald text-xs uppercase tracking-[0.12em] mb-2">Good debt output</p>
            <p className="text-white text-2xl font-bold font-mono-data">+ RM {rentalSurplus.toFixed(0)}</p>
            <p className="text-slate text-sm mt-2">Rental debt can create monthly surplus instead of monthly stress.</p>
          </div>
          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5">
            <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Live leverage swing</p>
            <p className={`text-2xl font-bold font-mono-data ${leverageSwing >= 0 ? 'text-emerald' : 'text-crimson'}`}>
              {leverageSwing >= 0 ? '+' : '-'} RM {Math.abs(leverageSwing).toFixed(0)}
            </p>
            <p className="text-slate text-sm mt-2">The same borrowed money changes direction based on how you use it.</p>
          </div>
        </div>

        {/* Two Cards */}
        <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Bad Debt Card */}
          <div className="bg-navy-surface border-2 border-crimson rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center">
                <span className="text-crimson text-lg">⚠</span>
              </div>
              <div>
                <h3 className="text-crimson font-bold text-xl uppercase tracking-wider">Bad Debt</h3>
                <p className="text-slate text-sm">Makes you look rich. Makes you poor.</p>
              </div>
            </div>

            {/* Car Loan */}
            <div className="mb-6 bg-navy/50 rounded-xl p-5 border border-crimson/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="text-white font-medium">Car Loan — Honda Civic</p>
                  <p className="text-slate text-xs">RM 100K. Loses 20% value when driven out.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly payment + costs</span>
                  <span className="text-crimson font-mono-data font-bold">RM {carMonthlyCost.toFixed(0)}</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 30 * multiplier)}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Total paid over 7 years</span>
                  <span className="text-crimson font-mono-data">RM {carTotalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Car value at end</span>
                  <span className="text-slate font-mono-data">~RM 30,000</span>
                </div>
              </div>
              <p className="text-crimson text-xs italic mt-3">"The car makes you look rich. It makes you poor."</p>
            </div>

            {/* PTPTN */}
            <div className="bg-navy/50 rounded-xl p-5 border border-crimson/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-white font-medium">PTPTN — Education Debt</p>
                  <p className="text-slate text-xs">RM 30K. Service charge. No asset backing.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Debt remaining</span>
                  <span className="text-crimson font-mono-data font-bold">RM {ptptnBurden.toLocaleString()}</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 50 * multiplier)}%` }} />
                </div>
                <p className="text-slate text-xs">417,000+ defaulters in Malaysia</p>
              </div>
              <p className="text-crimson text-xs italic mt-3">"You paid for a degree that trades time for money."</p>
            </div>
          </div>

          {/* Good Debt Card */}
          <div className="bg-navy-surface border-2 border-emerald rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
                <span className="text-emerald text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-emerald font-bold text-xl uppercase tracking-wider">Good Debt</h3>
                <p className="text-slate text-sm">The bank's money works for you.</p>
              </div>
            </div>

            {/* Rental Property */}
            <div className="mb-6 bg-navy/50 rounded-xl p-5 border border-emerald/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="text-white font-medium">Rental Property Loan</p>
                  <p className="text-slate text-xs">RM 500K. Tenant pays your mortgage.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly rental income</span>
                  <span className="text-emerald font-mono-data font-bold">RM {rentalIncome.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Mortgage payment</span>
                  <span className="text-slate font-mono-data">RM 1,800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly surplus</span>
                  <span className="text-emerald font-mono-data font-bold">+ RM {rentalSurplus.toFixed(0)}</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-emerald h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 25 * multiplier)}%` }} />
                </div>
                <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 mt-2">
                  <p className="text-gold text-xs">
                    <span className="font-bold">RPGT Timer:</span> Sell after year 6 = 0% tax. Before = 15%.
                  </p>
                </div>
              </div>
              <p className="text-emerald text-xs italic mt-3">"Tenant pays your debt. Property appreciates."</p>
            </div>

            {/* ASB Loan */}
            <div className="bg-navy/50 rounded-xl p-5 border border-emerald/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="text-white font-medium">ASB Loan</p>
                  <p className="text-slate text-xs">Borrow to invest. Dividend covers interest.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Loan interest</span>
                  <span className="text-slate font-mono-data">~5% p.a.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">ASB dividend yield</span>
                  <span className="text-emerald font-mono-data">~5.50 sen/unit</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Net effect</span>
                  <span className="text-emerald font-mono-data font-bold">Positive spread</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-emerald h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 20 * multiplier)}%` }} />
                </div>
              </div>
              <p className="text-emerald text-xs italic mt-3">"The bank's money works for you."</p>
            </div>
          </div>
        </div>

        {/* Leverage Lever Slider */}
        <div data-reveal className="bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-5">
            <div>
              <p className="text-white text-sm font-medium">Your Quadrant</p>
              <p className="text-slate text-xs mt-1">Move the slider and watch the monthly impact update immediately.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold w-fit" style={{ backgroundColor: quadrantColors[sliderValue] + '30', color: quadrantColors[sliderValue] }}>
              {quadrantLabels[sliderValue]}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={sliderValue}
            onChange={e => setSliderValue(parseInt(e.target.value) as QuadrantLevel)}
            className="w-full h-3 rounded-full appearance-none cursor-pointer mb-4"
            style={{ background: `linear-gradient(to right, #DC2626, #8892B0, #10B981, #FFD700)` }}
            aria-label="Debt leverage by quadrant"
          />
          <div className="flex justify-between text-xs text-slate mb-6">
            {quadrantLabels.map((label, i) => (
              <span key={i} className={i === sliderValue ? 'font-bold' : ''} style={{ color: i === sliderValue ? quadrantColors[i] : undefined }}>
                {label.split(' — ')[0]}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-navy/50 rounded-xl p-4 border border-crimson/20">
              <p className="text-slate text-xs uppercase mb-1">Bad debt result</p>
              <p className="text-crimson font-mono-data text-lg font-bold">RM {carMonthlyCost.toFixed(0)} out</p>
            </div>
            <div className="bg-navy/50 rounded-xl p-4 border border-emerald/20">
              <p className="text-slate text-xs uppercase mb-1">Good debt result</p>
              <p className="text-emerald font-mono-data text-lg font-bold">RM {rentalSurplus.toFixed(0)} in</p>
            </div>
            <div className="bg-navy/50 rounded-xl p-4 border border-gold/20">
              <p className="text-slate text-xs uppercase mb-1">What changes</p>
              <p className="text-white text-sm leading-relaxed">The higher your quadrant, the more likely debt is backed by cash-producing assets instead of wages alone.</p>
            </div>
          </div>

          {/* Dynamic Insight */}
          <div className="bg-navy/50 rounded-xl p-5 border" style={{ borderColor: quadrantColors[sliderValue] + '40' }}>
            <p className="text-sm" style={{ color: quadrantColors[sliderValue] }}>
              {sliderValue === 0 && "As an Employee, ALL debt crushes you. You have no asset income to cover the payments. A car loan is a chain, not a tool."}
              {sliderValue === 1 && "As Self-employed, you earn more but have no safety net. Debt is risky — one bad month and everything unravels."}
              {sliderValue === 2 && "As a Business Owner, debt becomes leverage. Your business income covers the loans, and the assets appreciate in your name."}
              {sliderValue === 3 && "As an Investor, debt AMPLIFIES your returns. An ASB loan at 5% earning 5.5% is free money working for you while you sleep."}
            </p>
          </div>
        </div>

        <div data-reveal className="mt-8 bg-navy-surface border border-navy-light rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
            <div>
              <p className="text-gold text-xs uppercase tracking-[0.12em] mb-2">Debt literacy checklist</p>
              <h3 className="text-white text-xl font-bold">Before you borrow, ask these 3 questions.</h3>
            </div>
            <p className="text-slate text-sm max-w-md">This teaches a reusable rule, not just a single example: debt should improve cashflow, be backed by an asset, and move you closer to time freedom.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {debtRules.map((rule) => (
              <div key={rule.title} className="bg-navy/50 border border-navy-light rounded-xl p-5">
                <p className="text-white font-semibold mb-2">{rule.title}</p>
                <p className="text-slate text-sm mb-4">{rule.helper}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-crimson/10 border border-crimson/20 px-3 py-2">
                    <span className="text-crimson text-sm font-medium">Bad debt</span>
                    <span className="text-crimson text-sm font-bold">{rule.badDebt}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-emerald/10 border border-emerald/20 px-3 py-2">
                    <span className="text-emerald text-sm font-medium">Good debt</span>
                    <span className={`text-sm font-bold ${rule.goodTone}`}>{rule.goodDebt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div data-reveal className="mt-10 text-center">
          <p className="text-slate text-lg italic max-w-2xl mx-auto">
            "In Malaysia, banks love to lend you money for cars and credit cards. They rarely promote ASB loans. <span className="text-gold">Ask why.</span>"
          </p>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFD700;
          border: 3px solid #0A192F;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(255,215,0,0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FFD700;
          border: 3px solid #0A192F;
          cursor: pointer;
          box-shadow: 0 0 12px rgba(255,215,0,0.5);
        }
      `}</style>
    </section>
  );
}

