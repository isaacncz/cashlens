import { formatMoney } from '../lib/currency';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type QuadrantLevel = 0 | 1 | 2 | 3;

const quadrantLabels = ['E — Employee', 'S — Self-employed', 'B — Business Owner', 'I — Investor'];
const quadrantMessages = [
  'As an Employee, ALL debt crushes you. You have no asset income to cover the payments. A car loan is a chain, not a tool.',
  'As Self-employed, you earn more but have no safety net. Debt is risky — one bad month and everything unravels.',
  'As a Business Owner, debt becomes leverage. Your business income covers the loans, and the assets appreciate in your name.',
  'As an Investor, debt AMPLIFIES your returns. An ASB loan at 5% earning 5.5% is free money working for you while you sleep.',
];

export default function DebtVisualizer() {
  const [sliderValue, setSliderValue] = useState<QuadrantLevel>(0);



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
      goodTone: rentalSurplus > 0 ? 'tone-good' : 'tone-warn',
      helper: 'Does the debt put more money in than it takes out each month?',
    },
    {
      title: 'Asset backing',
      badDebt: 'Weak',
      goodDebt: 'Strong',
      goodTone: 'tone-good',
      helper: 'Is there a cash-producing asset behind the loan?',
    },
    {
      title: 'Time freedom',
      badDebt: 'More work needed',
      goodDebt: sliderValue >= 2 ? 'Improves freedom' : 'Needs skill first',
      goodTone: sliderValue >= 2 ? 'tone-good' : 'tone-warn',
      helper: 'Does this debt reduce dependence on your salary over time?',
    },
  ];

  return (
    <section id="debt" className="lesson" aria-labelledby="debt-heading">
      <header className="lesson-intro">
        <h1 id="debt-heading">Not all debt is equal.</h1>
        <p>Pick your quadrant. Watch the same two loans change direction.</p>
      </header>

      <div className="lesson-stack">
        <fieldset className="segmented-field">
          <legend>Your quadrant</legend>
          <div className="segmented">
            {quadrantLabels.map((label, i) => (
              <label key={label}>
                <input type="radio" name="debt-quadrant" value={i} checked={sliderValue === i} onChange={() => setSliderValue(i as QuadrantLevel)} aria-label={label} />
                <span aria-hidden="true">{label.split(' — ')[0]}</span>
              </label>
            ))}
          </div>
          <p className="segmented-caption">{quadrantLabels[sliderValue]}</p>
        </fieldset>

        <section className="lesson-card" aria-label="Monthly result" aria-live="polite">
          <dl className="lesson-rows">
            <div><dt>Car loan <small>Bad debt drag</small></dt><dd className="tone-bad">- RM {formatMoney(carMonthlyCost)}</dd></div>
            <div><dt>Rental property <small>Good debt output</small></dt><dd className="tone-good">+ RM {formatMoney(rentalSurplus)}</dd></div>
          </dl>
          <div className="lesson-total"><span>Live leverage swing</span><strong className={leverageSwing >= 0 ? 'tone-good' : 'tone-bad'}>{leverageSwing >= 0 ? '+' : '-'} RM {Math.abs(leverageSwing).toFixed(0)}</strong></div>
          <p className="lesson-muted">{quadrantMessages[sliderValue]}</p>
          <p className="lesson-muted">The higher your quadrant, the more likely debt is backed by cash-producing assets instead of wages alone.</p>
        </section>

        <div className="lesson-disclosures">
          <details className="lesson-disclosure">
            <summary><span><span>Bad debt examples</span><span>Car loan · PTPTN</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <div>
                <h3>Car Loan — Honda Civic</h3>
                <p>RM 100K. Loses 20% value when driven out.</p>
                <dl className="lesson-rows">
                  <div><dt>Monthly payment + costs</dt><dd className="tone-bad">RM {formatMoney(carMonthlyCost)}</dd></div>
                  <div><dt>Total paid over 7 years</dt><dd className="tone-bad">RM {formatMoney(carTotalPaid)}</dd></div>
                  <div><dt>Car value at end</dt><dd>~RM 30,000</dd></div>
                </dl>
                <p className="lesson-quote">"The car makes you look rich. It makes you poor."</p>
              </div>
              <div>
                <h3>PTPTN — Education Debt</h3>
                <p>RM 30K. Service charge. No asset backing.</p>
                <dl className="lesson-rows">
                  <div><dt>Debt remaining</dt><dd className="tone-bad">RM {formatMoney(ptptnBurden)}</dd></div>
                </dl>
                <p>417,000+ defaulters in Malaysia</p>
                <p className="lesson-quote">"You paid for a degree that trades time for money."</p>
              </div>
            </div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>Good debt examples</span><span>Rental property · ASB loan</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <div>
                <h3>Rental Property Loan</h3>
                <p>RM 500K. Tenant pays your mortgage.</p>
                <dl className="lesson-rows">
                  <div><dt>Monthly rental income</dt><dd className="tone-good">RM {formatMoney(rentalIncome)}</dd></div>
                  <div><dt>Mortgage payment</dt><dd>RM 1,800</dd></div>
                  <div><dt>Monthly surplus</dt><dd className="tone-good">+ RM {formatMoney(rentalSurplus)}</dd></div>
                </dl>
                <p><strong>RPGT Timer:</strong> Sell after year 6 = 0% tax. Before = 15%.</p>
                <p className="lesson-quote">"Tenant pays your debt. Property appreciates."</p>
              </div>
              <div>
                <h3>ASB Loan</h3>
                <p>Borrow to invest. Dividend covers interest.</p>
                <dl className="lesson-rows">
                  <div><dt>Loan interest</dt><dd>~5% p.a.</dd></div>
                  <div><dt>ASB dividend yield</dt><dd className="tone-good">~5.50 sen/unit</dd></div>
                  <div><dt>Net effect</dt><dd className="tone-good">Positive spread</dd></div>
                </dl>
                <p className="lesson-quote">"The bank's money works for you."</p>
              </div>
            </div>
          </details>
          <details className="lesson-disclosure">
            <summary><span><span>Before you borrow</span><span>A 3-question check</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
            <div>
              <p>This teaches a reusable rule, not just a single example: debt should improve cashflow, be backed by an asset, and move you closer to time freedom.</p>
              {debtRules.map(rule => (
                <div key={rule.title}>
                  <h3>{rule.title}</h3>
                  <p>{rule.helper}</p>
                  <dl className="lesson-rows">
                    <div><dt>Bad debt</dt><dd className="tone-bad">{rule.badDebt}</dd></div>
                    <div><dt>Good debt</dt><dd className={rule.goodTone}>{rule.goodDebt}</dd></div>
                  </dl>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      <p className="lesson-quote">"In Malaysia, banks love to lend you money for cars and credit cards. They rarely promote ASB loans. <strong>Ask why.</strong>"</p>
    </section>
  );
}
