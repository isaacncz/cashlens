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

  return (
    <section id="debt" ref={sectionRef} className="w-full py-24 md:py-32" style={{ background: '#0A192F' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p data-reveal className="text-gold text-xs font-medium tracking-[0.1em] uppercase mb-4">
          Module 05 / Debt Visualizer
        </p>
        <h2 data-reveal className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4" style={{ color: '#E6F1FF' }}>
          Not All Debt{' '}
          <span className="text-gold">Is Created Equal.</span>
        </h2>
        <p data-reveal className="text-slate text-base md:text-lg mb-10 max-w-xl">
          Slide to see how the same debt crushes or amplifies, depending on your quadrant.
        </p>

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
                  <p className="text-navy-light text-xs">RM 100K. Loses 20% value when driven out.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly payment + costs</span>
                  <span className="text-crimson font-mono-data font-bold">RM {(1500 * multiplier).toFixed(0)}</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 30 * multiplier)}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Total paid over 7 years</span>
                  <span className="text-crimson font-mono-data">RM {(126000 * multiplier).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Car value at end</span>
                  <span className="text-navy-light font-mono-data">~RM 30,000</span>
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
                  <p className="text-navy-light text-xs">RM 30K. Service charge. No asset backing.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Debt remaining</span>
                  <span className="text-crimson font-mono-data font-bold">RM {(30000 * multiplier).toLocaleString()}</span>
                </div>
                <div className="w-full bg-navy-light rounded-full h-2">
                  <div className="bg-crimson h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, 50 * multiplier)}%` }} />
                </div>
                <p className="text-navy-light text-xs">417,000+ defaulters in Malaysia</p>
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
                  <p className="text-navy-light text-xs">RM 500K. Tenant pays your mortgage.</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly rental income</span>
                  <span className="text-emerald font-mono-data font-bold">RM {(2000 * multiplier).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Mortgage payment</span>
                  <span className="text-slate font-mono-data">RM 1,800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Monthly surplus</span>
                  <span className="text-emerald font-mono-data font-bold">+ RM {((2000 * multiplier) - 1800).toFixed(0)}</span>
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
                  <p className="text-navy-light text-xs">Borrow to invest. Dividend covers interest.</p>
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
          <div className="flex items-center gap-4 mb-4">
            <p className="text-white text-sm font-medium">Your Quadrant:</p>
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: quadrantColors[sliderValue] + '30', color: quadrantColors[sliderValue] }}>
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
          />
          <div className="flex justify-between text-xs text-navy-light mb-6">
            {quadrantLabels.map((label, i) => (
              <span key={i} className={i === sliderValue ? 'font-bold' : ''} style={{ color: i === sliderValue ? quadrantColors[i] : undefined }}>
                {label.split(' — ')[0]}
              </span>
            ))}
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
