import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronDown, Plus, RotateCcw, ShoppingBasket, UserRound, X } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, DEFAULT_REPEAT_RATE, MAX_CUSTOMERS, MAX_MONTHS, projectRepeatSales, PURCHASE_INTERVALS } from '../lib/repeatSales';
import type { PurchaseModel } from '../lib/repeatSales';
import { scrollToContent } from '../lib/pageNavigation';
import ProductPicker from './ProductPicker';
import './RepeatSales.css';

const FIRST_PRODUCT_ID = '124106';
const presets = [1, 12, 24, 60, 120, 300, 600];
const startYears = Array.from({ length: 50 }, (_, index) => index + 1);
const steps = ['First sale', 'Repeat sales', 'Grow basket', 'Long term'];
const titles = ['One product. One customer.', 'One sale becomes repeat sales.', 'Grow the basket in year 2.', 'See what time can build.'];
const descriptions = ['Start with a simple first sale.', 'See what the same customer could buy again.', 'Keep the customer. Add another product.', 'Explore your plan over the next 50 years.'];
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : interval === 12 ? 'Every year' : `Every ${durationLabel(interval)}`;
const rangeStyle = (percentage: number): CSSProperties => ({ '--range-fill': `${percentage}%` } as CSSProperties);
const RevenueChart = lazy(() => import('./RevenueChart'));

export default function RepeatSales() {
  const [step, setStep] = useState(0);
  const [mobileView, setMobileView] = useState<'plan' | 'results'>('results');
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [firstId, setFirstId] = useState(FIRST_PRODUCT_ID);
  const [selectedIds, setSelectedIds] = useState<string[]>([FIRST_PRODUCT_ID]);
  const [intervals, setIntervals] = useState<Record<string, number>>({});
  const [productYears, setProductYears] = useState<Record<string, number>>({});
  const [months, setMonths] = useState(60);
  const [customers, setCustomers] = useState(1);
  const [customerInput, setCustomerInput] = useState('1');
  const [rate, setRate] = useState(DEFAULT_REPEAT_RATE);
  const [purchaseModel, setPurchaseModel] = useState<PurchaseModel>('repeat-purchases');
  const [addCustomerEachYear, setAddCustomerEachYear] = useState(false);
  const [customersPerYear, setCustomersPerYear] = useState(1);
  const [showCategories, setShowCategories] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'first' | 'add'>('first');
  const [activity, setActivity] = useState<{ id: string; kind: 'added' | 'removed' | 'updated' } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectionRef = useRef<HTMLDivElement>(null);
  const basketRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const previousStep = useRef(step);
  const focusStepHeading = useRef(true);
  const catalog = useMemo(() => repeatSalesProducts.map(product => ({ ...product, every: intervals[product.id] ?? product.every, startYear: product.id === firstId ? 1 : productYears[product.id] ?? 2 })), [intervals, productYears, firstId]);
  const firstProduct = catalog.find(product => product.id === firstId)!;
  const selected = useMemo(() => catalog.filter(product => selectedIds.includes(product.id)).sort((a, b) => a.startYear - b.startYear || a.aboPrice - b.aboPrice), [catalog, selectedIds]);
  const products = useMemo(() => step < 2 ? [firstProduct] : selected, [step, firstProduct, selected]);
  const horizon = step === 0 ? 1 : step === 1 ? 12 : step === 2 ? 24 : months;
  const startingCustomers = step < 3 ? 1 : customers;
  const acquisition = step === 3 && addCustomerEachYear;
  const projection = useMemo(() => projectRepeatSales(products, horizon, startingCustomers, rate, purchaseModel, acquisition, customersPerYear), [products, horizon, startingCustomers, rate, purchaseModel, acquisition, customersPerYear]);
  const firstOrder = useMemo(() => projectRepeatSales(products, 1, 1, 100, 'repeat-purchases', false).total, [products]);
  const introductions = [...new Set(products.map(product => product.startYear))].sort((a, b) => a - b).map(year => ({ year, count: products.filter(product => product.startYear === year).length }));
  const activeCount = products.filter(product => (product.startYear - 1) * 12 < horizon).length;
  const changedProduct = catalog.find(product => product.id === activity?.id);
  const contribution = changedProduct ? projectRepeatSales([changedProduct], horizon, startingCustomers, rate, purchaseModel, acquisition, customersPerYear).total : 0;
  const customerLabel = `${projection.customersAtEnd} ${purchaseModel === 'annual-attrition' ? 'customers introduced' : projection.customersAtEnd === 1 ? 'customer' : 'customers'}`;
  const invalidCustomers = customerInput === '' || Number(customerInput) < 1 || Number(customerInput) > MAX_CUSTOMERS || !Number.isInteger(Number(customerInput));
  const nextLabel = step === 0 ? 'See repeat sales' : step === 1 ? 'Add products in year 2' : 'Explore long term';

  useEffect(() => {
    if (previousStep.current !== step && headingRef.current) {
      if (focusStepHeading.current) scrollToContent(headingRef.current);
      else document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
    }
    previousStep.current = step;
  }, [step]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsPhone(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const goToStep = (value: number, focusHeading = true) => { focusStepHeading.current = focusHeading; setMobileView(value === 2 ? 'plan' : 'results'); setStep(value); };
  const showView = (value: 'plan' | 'results') => {
    setMobileView(value);
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById(value === 'plan' ? 'rs-plan-panel' : 'rs-projection')?.focus({ preventScroll: true });
    });
  };
  const openPicker = (mode: 'first' | 'add') => { setPickerMode(mode); setPickerOpen(true); };
  const advance = () => { goToStep(Math.min(3, step + 1)); if (step === 1) openPicker('add'); };

  const changeCustomers = (value: number) => {
    const next = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)));
    setCustomers(next); setCustomerInput(String(next));
  };
  const toggleProduct = (id: string) => {
    const removing = selectedIds.includes(id);
    setSelectedIds(previous => removing ? previous.filter(value => value !== id) : [...previous, id]);
    setActivity({ id, kind: removing ? 'removed' : 'added' });
  };
  const chooseFirst = (id: string) => {
    setSelectedIds(previous => [id, ...previous.filter(value => value !== firstId && value !== id)]);
    setFirstId(id); setActivity(null);
  };
  const removeProduct = (id: string) => {
    toggleProduct(id);
    requestAnimationFrame(() => addButtonRef.current?.focus({ preventScroll: true }));
  };
  const changeStartYear = (id: string, year: number) => {
    setProductYears(previous => ({ ...previous, [id]: year }));
    setActivity({ id, kind: 'updated' });
    // Regrouping by year remounts this row; keep the edited control in keyboard focus.
    requestAnimationFrame(() => document.getElementById(`rs-start-${id}`)?.focus({ preventScroll: true }));
  };
  const reset = () => {
    setCustomersPerYear(1); goToStep(0); setFirstId(FIRST_PRODUCT_ID); setSelectedIds([FIRST_PRODUCT_ID]); setIntervals({}); setProductYears({}); setMonths(60); changeCustomers(1);
    setRate(DEFAULT_REPEAT_RATE); setPurchaseModel('repeat-purchases'); setAddCustomerEachYear(false); setShowCategories(false); setShowSource(false); setActivity(null); setPickerOpen(false);
    if (headingRef.current) scrollToContent(headingRef.current);
  };

  const scenarioControls = (<>
        <div className="rs-scenario"><h3>Your scenario</h3>{step === 3 && <div className="rs-duration"><label htmlFor="rs-duration">Plan duration</label><select id="rs-duration" aria-label="Projection duration" value={months} onChange={event => setMonths(Number(event.target.value))}>{!presets.includes(months) && <option value={months}>{durationLabel(months)}</option>}{presets.map(preset => <option key={preset} value={preset}>{durationLabel(preset)}</option>)}</select></div>}<div className={`rs-scenario-grid${step < 3 ? ' rs-one-scenario' : ''}`}>
          {step === 3 && <div className="rs-customer-control"><div className="rs-label-line"><label htmlFor="rs-customers">Starting customers</label><input id="rs-customers" type="number" min="1" max={MAX_CUSTOMERS} step="1" inputMode="numeric" aria-invalid={invalidCustomers} aria-describedby="rs-customer-help" value={customerInput} onChange={event => { const value = event.target.value; setCustomerInput(value); const number = Number(value); if (value !== '' && Number.isInteger(number) && number >= 1 && number <= MAX_CUSTOMERS) setCustomers(number); }} onBlur={() => changeCustomers(Number(customerInput))} onKeyDown={event => { if (event.key === 'Enter') changeCustomers(Number(customerInput)); }} /></div><input className="rs-range" type="range" aria-label="Starting customers, maximum 20" style={rangeStyle((customers - 1) / (MAX_CUSTOMERS - 1) * 100)} min="1" max={MAX_CUSTOMERS} value={customers} onChange={event => changeCustomers(Number(event.target.value))} /><label className="rs-growth-option" htmlFor="rs-add-customers"><input id="rs-add-customers" type="checkbox" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span>Add customers each year</span></label>{addCustomerEachYear && <label className="rs-label-line" htmlFor="rs-customers-per-year">Customers to add each year<select id="rs-customers-per-year" value={customersPerYear} onChange={event => setCustomersPerYear(Number(event.target.value))}>{Array.from({ length: MAX_CUSTOMERS }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count}</option>)}</select></label>}<p id="rs-customer-help" className="rs-muted">{invalidCustomers ? 'Enter a whole number from 1 to 20.' : addCustomerEachYear ? `Up to 20 customers total. ${customers === MAX_CUSTOMERS ? 'Limit reached.' : 'New customers join from year 2.'}` : 'Keep this group fixed. Maximum 20 customers.'}</p></div>}
          <div className="rs-repeat-control"><div className="rs-label-line"><label htmlFor="rs-repeat-rate">{purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate' : 'Annual customer retention'}</label><div className="rs-rate-entry"><input type="number" inputMode="numeric" min="0" max="100" step="1" aria-label={purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate percent' : 'Annual customer retention percent'} value={rate} onChange={event => setRate(Math.max(0, Math.min(100, Number(event.target.value) || 0)))} /><span aria-hidden="true">%</span></div></div><input id="rs-repeat-rate" className="rs-range" style={rangeStyle(rate)} type="range" min="0" max="100" value={rate} aria-valuetext={purchaseModel === 'repeat-purchases' ? `${rate}% expected to buy each repeat cycle` : `${rate}% of remaining customers return each year`} onChange={event => setRate(Number(event.target.value))} /><p className="rs-muted">{purchaseModel === 'repeat-purchases' ? 'First purchase in full. Later cycles use this rate.' : `${rate}% of each joining group’s remaining customers return each year.`}</p></div>
        </div>{step === 3 && <details className="rs-time-controls"><summary>Custom duration<ChevronDown size={16} aria-hidden="true" /></summary><div className="rs-label-line"><label htmlFor="rs-months">Duration</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" style={rangeStyle((months - 1) / (MAX_MONTHS - 1) * 100)} type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div></details>}</div>

  </>);
  const assumptions = (<>
        <details className="rs-retention"><summary>Assumptions & price source<ChevronDown size={16} aria-hidden="true" /></summary><fieldset className="rs-model-selector"><legend>Purchase model</legend><div>{([['repeat-purchases', 'Repeat purchases'], ['annual-attrition', 'Annual attrition']] as const).map(([value, label]) => <label key={value} data-selected={purchaseModel === value}><input type="radio" name="purchase-model" value={value} checked={purchaseModel === value} onChange={() => setPurchaseModel(value)} /><span>{label}</span></label>)}</div></fieldset><div className="rs-monthly"><span>Active monthly basket / customer<br /><small>Before repeat rate</small></span><strong>RM {formatRinggit(projection.recurringMonthly / startingCustomers)}</strong></div>
          <p>Start years refer to the business calendar. Each customer starts buying a product when both the customer and product have joined the plan. Repeat purchasing applies the rate to later cycles; fractional buyers are expected averages. Annual attrition instead reduces each group by its age since joining.</p>
          <p>Intervals are editable examples, not usage advice. Appliances default to one purchase. Filters start one replacement interval after the product becomes available to that customer, treating the initial filter as included. Follow product instructions and indicators.</p>
          <p>All prices and estimates use Malaysia ABO/AP prices from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Actual selling prices can differ. Prices stay fixed, with no inflation or reinvestment. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><button className="rs-text-button" type="button" aria-pressed={showSource} onClick={() => setShowSource(value => !value)}>{showSource ? 'Hide source details' : 'Show source details'}</button>
        </details>
  </>);

  return <section id="repeat-sales" className={`repeat-sales${step === 0 ? ' rs-opening' : ''}`} aria-labelledby="repeat-sales-heading">
    <header className="rs-intro"><div><h1 id="repeat-sales-heading" ref={headingRef} tabIndex={-1}>{isPhone ? ['Start with one sale', 'Turn sales into a habit', 'Build your basket', 'Plan your growth'][step] : titles[step]}</h1><p>{isPhone ? ['One product. One customer.', 'See what repeat purchases can add up to.', 'Add products from year 2.', 'Adjust your customers, timing and repeat rate.'][step] : descriptions[step]}</p></div><button type="button" className="rs-text-button rs-reset" aria-label="Reset" title="Restart consultation" onClick={reset}><RotateCcw size={16} aria-hidden="true" />Reset</button></header>
    <div className="rs-step-select"><label htmlFor="rs-step">Step {step + 1} of 4</label><select id="rs-step" value={step} onChange={event => goToStep(Number(event.target.value), false)}>{steps.map((label, index) => <option key={label} value={index}>{label}</option>)}</select></div>
    <nav className="rs-steps" aria-label="Consultation steps"><ol>{steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} onClick={() => goToStep(index)}><span aria-hidden="true">{index + 1}</span><span className="rs-step-label">{label}</span></button></li>)}</ol></nav>

    {step === 0 ? <div className="rs-first-sale rs-basket" id="rs-basket" ref={basketRef} tabIndex={-1}>
      <div className="rs-sale-story">
        <div className="rs-sale-product"><ShoppingBasket size={28} strokeWidth={1.5} aria-hidden="true" /><div><h2>{firstProduct.name}</h2><p>{firstProduct.size} · RM {formatRinggit(firstProduct.aboPrice)} ABO</p></div><button type="button" className="rs-text-button" onClick={() => openPicker('first')}>Change</button></div>
        <div className="rs-one-customer"><UserRound size={20} aria-hidden="true" /><span>1 customer buys 1 item</span></div>
      </div>
      <div className="rs-first-receipt"><h2>Your first sale</h2><p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM </span>{formatRinggit(projection.total)}</p><p className="rs-muted">Malaysia ABO price · before costs</p><dl className="rs-first-facts"><div><dt>Product quantity</dt><dd>1 item</dd></div><div><dt>Customer</dt><dd>1 person</dd></div><div><dt>Price source</dt><dd>Apr 2026 · ABO</dd></div></dl></div>
      <div className="rs-sale-next"><p className="rs-sale-question">What if this customer comes back?<span>Next, explore a year of repeat sales.</span></p><button type="button" className="primary-button rs-desktop-next" onClick={advance}>{nextLabel}<ArrowRight size={18} aria-hidden="true" /></button></div>
    </div> : <>
      <div className="rs-view-switch" role="group" aria-label="Consultation view"><button type="button" aria-controls="rs-plan-panel" aria-pressed={mobileView === 'plan'} onClick={() => showView('plan')}>Edit plan</button><button type="button" aria-controls="rs-projection" aria-pressed={mobileView === 'results'} onClick={() => showView('results')}>Results</button></div>
      <div className="rs-workspace">
      <div id="rs-plan-panel" className="rs-plan-panel" role="region" aria-label="Edit revenue plan" tabIndex={-1} hidden={isPhone && mobileView !== 'plan'}>
      {step === 3 && scenarioControls}
      <div className="rs-basket" id="rs-basket" ref={basketRef} tabIndex={-1}>
        <div className="rs-basket-heading"><div><h2>{step === 1 ? 'Your one product' : 'Your product plan'}</h2><p className="rs-muted">Malaysia ABO prices · Apr 2026</p></div>{step === 1 && <button type="button" className="rs-text-button" onClick={() => openPicker('first')}>Change</button>}</div>
        {step >= 2 && <button type="button" ref={addButtonRef} className="rs-add-products" onClick={() => openPicker('add')}><Plus size={18} aria-hidden="true" />Add products</button>}
        <div className="rs-plan">
          {introductions.map(({ year, count }) => <div className="rs-plan-year" key={year}><h3 className="rs-year-heading">Year {year}<span>{count} {count === 1 ? 'product' : 'products'}{year > 1 ? ' added' : ''}</span></h3>
            {products.filter(product => product.startYear === year).map(product => <article className="rs-plan-product" key={product.id}>
              <div className="rs-plan-product-heading"><h4>{product.name}</h4>{step >= 2 && <button className="rs-icon-button" type="button" aria-label={`Remove ${product.name}, ${product.size}`} onClick={() => removeProduct(product.id)}><X size={18} aria-hidden="true" /></button>}</div>
              <div className="rs-plan-product-meta"><span>{product.size}</span><strong>RM {formatRinggit(product.aboPrice)}</strong></div>
              {showSource && <p className="rs-muted">SKU {product.id} · source p.{product.page}</p>}
              <div className={`rs-product-controls${step === 1 ? ' rs-single-control' : ''}`}>
                {step >= 2 && <label>Start year{product.id === firstId ? <span className="rs-fixed-year">Year 1</span> : <select id={`rs-start-${product.id}`} aria-label={`Start year for ${product.name}, ${product.size}`} value={product.startYear} onChange={event => changeStartYear(product.id, Number(event.target.value))}>{startYears.map(year => <option key={year} value={year}>Year {year}</option>)}</select>}</label>}
                <label>Purchase cycle<select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => { setIntervals(previous => ({ ...previous, [product.id]: Number(event.target.value) })); setActivity({ id: product.id, kind: 'updated' }); }}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select></label>
              </div>
              {product.type === 'filter' && product.every > 0 && <p className="rs-muted rs-filter-note">First replacement after {durationLabel(product.every)}.</p>}
            </article>)}
          </div>)}
          {!products.length && <div className="rs-no-results"><ShoppingBasket size={24} aria-hidden="true" /><p>Your basket is empty.</p><button type="button" className="rs-text-button" onClick={() => openPicker('add')}>Add a product</button></div>}
        </div>
        {step >= 2 && <><div className="rs-basket-value"><span>Year 1 first order / customer</span><strong>RM {formatRinggit(firstOrder)}</strong></div><div className="rs-basket-footer"><span>{selected.length} in your plan</span><button className="rs-text-button" type="button" disabled={!selected.length} onClick={() => { setSelectedIds([]); setActivity(null); }}>Clear basket</button></div></>}
      </div>
      {step < 3 && scenarioControls}
      {assumptions}
      </div>
      <div className="rs-result" hidden={isPhone && mobileView !== 'results'} id="rs-projection" ref={projectionRef} tabIndex={-1} aria-label="Revenue projection">
        <div className="rs-result-top"><h2>{step === 1 ? 'One customer, one year' : 'Your projection'}</h2><span>{durationLabel(horizon)}</span></div>
        <p className="rs-revenue-label">Estimated revenue · before costs</p>
        <p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM </span>{formatRinggit(projection.total)}</p>
        <p className="rs-result-assumption">{purchaseModel === 'repeat-purchases' ? `${rate}% repeat purchases each cycle` : `${rate}% annual customer retention`}</p>
        <p className="rs-context">{products.length} {products.length === 1 ? 'product' : 'products'} · {customerLabel} · {durationLabel(horizon)}</p>
        {activeCount !== products.length && <p className="rs-muted rs-future-note">{products.length - activeCount} {products.length - activeCount === 1 ? 'product starts' : 'products start'} after this period.</p>}
        {step >= 2 && activity && changedProduct && <p className="rs-insight" role="status"><span>{activity.kind === 'removed' ? 'Product removed' : activity.kind === 'updated' ? 'Product updated' : 'Product added'}<span className="sr-only">: {changedProduct.name}, {changedProduct.size}.</span></span><strong>{activity.kind === 'removed' ? '−' : activity.kind === 'added' ? '+' : ''}RM {formatRinggit(contribution)}</strong><small>{activity.kind === 'updated' ? 'Contribution · ' : ''}From year {changedProduct.startYear} · {durationLabel(horizon)}</small></p>}
        <div className="rs-chart-heading"><h3>Revenue over time</h3><label className="rs-breakdown"><input type="checkbox" checked={showCategories} onChange={event => setShowCategories(event.target.checked)} />By category</label></div>
        <Suspense fallback={<div className="rs-chart-loading" role="status">Loading chart…</div>}><RevenueChart projection={projection} months={horizon} model={purchaseModel} rate={rate} showCategories={showCategories} introductions={introductions.map(({ year }) => year)} emptyMessage={products.length ? `Your products start in year ${Math.min(...products.map(product => product.startYear))}.` : 'Add a product to begin.'} /></Suspense>
        {showCategories && <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>}
        {step < 3 && <button type="button" className="primary-button rs-desktop-next" onClick={advance}>{nextLabel}<ArrowRight size={18} aria-hidden="true" /></button>}


      </div>
    </div></>}
    <div className="rs-mobile-summary" data-view={mobileView}><div className="rs-mobile-summary-copy"><span>{step === 0 ? '1 item · 1 customer' : `${products.length} ${products.length === 1 ? 'product' : 'products'} · ${durationLabel(horizon)}`}</span><p><span>RM </span>{formatRinggit(projection.total)}</p><span>{step === 0 ? 'First sale · before costs' : 'Revenue before costs'}</span></div><button type="button" onClick={() => step === 0 ? advance() : mobileView === 'plan' ? showView('results') : step < 3 ? advance() : showView('plan')}><span>{step === 0 ? nextLabel : mobileView === 'plan' ? 'View results' : step < 3 ? nextLabel : 'Edit plan'}</span><ArrowRight size={18} aria-hidden="true" /></button></div>
    <ProductPicker open={pickerOpen} mode={pickerMode} catalog={catalog} selectedIds={selectedIds} firstId={firstId} total={pickerMode === 'first' ? firstProduct.aboPrice : projection.total} months={horizon} showSource={showSource} onClose={() => { setPickerOpen(false); if (pickerMode === 'add') setMobileView('results'); }} onToggle={toggleProduct} onChooseFirst={chooseFirst} />
  </section>;
}
