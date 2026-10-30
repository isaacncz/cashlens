import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronDown, Plus, RotateCcw, ShoppingBasket, UserRound, Repeat2 } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, DEFAULT_REPEAT_RATE, MAX_CUSTOMERS, MAX_MONTHS, projectRepeatSales, PURCHASE_INTERVALS } from '../lib/repeatSales';
import type { PurchaseModel } from '../lib/repeatSales';
import ProductPicker from './ProductPicker';
import ProductImage from './ProductImage';
import './RepeatSales.css';
import './CompoundFlow.css';
import './CompoundStory.css';

const FIRST_PRODUCT_ID = '124106';
const EXAMPLE_YEARS: Record<string, number> = { '124106': 1, '110488': 2, '126449': 2, '000100': 3 };
const presets = [1, 12, 24, 36, 48, 60, 120, 240, 300, 600];
const startYears = Array.from({ length: 50 }, (_, index) => index + 1);
const steps = ['Year 1', 'Year 2', 'Year 3', 'My plan'];
const titles = ['Start with one useful product', 'Trust grows the basket', 'Small steps build momentum', 'Make the story your own'];
const descriptions = ['One customer. One product. A reason to come back.', 'Keep the toothpaste. Add two everyday products.', 'Earlier products keep repeating. Grow at your own pace.', 'Your choices carry forward. Adjust the pace to fit your plan.'];
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : interval === 12 ? 'Every year' : `Every ${durationLabel(interval)}`;
const rangeStyle = (percentage: number): CSSProperties => ({ '--range-fill': `${percentage}%` } as CSSProperties);
const RevenueChart = lazy(() => import('./RevenueChart'));

export default function RepeatSales() {
  const [step, setStep] = useState(0);
  const isPlan = step === 3;
  const [mobileView, setMobileView] = useState<'products' | 'settings' | 'results'>('settings');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [isPhone, setIsPhone] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [firstId, setFirstId] = useState(FIRST_PRODUCT_ID);
  const [selectedIds, setSelectedIds] = useState<string[]>(Object.keys(EXAMPLE_YEARS));
  const [intervals, setIntervals] = useState<Record<string, number>>({});
  const [productYears, setProductYears] = useState<Record<string, number>>(EXAMPLE_YEARS);
  const [months, setMonths] = useState(240);
  const [customers, setCustomers] = useState(1);
  const [customerInput, setCustomerInput] = useState('1');
  const [rate, setRate] = useState(DEFAULT_REPEAT_RATE);
  const [purchaseModel, setPurchaseModel] = useState<PurchaseModel>('repeat-purchases');
  const [addCustomerEachYear, setAddCustomerEachYear] = useState(true);
  const [customersPerYear, setCustomersPerYear] = useState(1);
  const [showCategories, setShowCategories] = useState(false);
  const [showSource, setShowSource] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'first' | 'add'>('first');
  const [reviewYear, setReviewYear] = useState(3);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const catalog = useMemo(() => repeatSalesProducts.map(product => ({ ...product, every: intervals[product.id] ?? product.every, startYear: product.id === firstId ? 1 : productYears[product.id] ?? (isPlan ? reviewYear : step + 1) })), [intervals, productYears, firstId, isPlan, reviewYear, step]);
  const firstProduct = catalog.find(product => product.id === firstId)!;
  const selected = useMemo(() => catalog.filter(product => selectedIds.includes(product.id)).sort((a, b) => a.startYear - b.startYear || a.aboPrice - b.aboPrice), [catalog, selectedIds]);
  const year = isPlan ? Math.min(reviewYear, Math.ceil(months / 12)) : step + 1;
  const products = useMemo(() => isPlan ? selected : selected.filter(product => product.startYear <= step + 1), [isPlan, selected, step]);
  const horizon = isPlan ? months : year * 12;
  const startingCustomers = isPlan ? customers : 1;
  const acquisition = step >= 2 && addCustomerEachYear;
  const projection = useMemo(() => projectRepeatSales(products, horizon, startingCustomers, rate, purchaseModel, acquisition, isPlan ? customersPerYear : 1), [products, horizon, startingCustomers, rate, purchaseModel, acquisition, isPlan, customersPerYear]);
  const priorTotal = isPlan || year === 1 ? 0 : projectRepeatSales(products, (year - 1) * 12, 1, rate, purchaseModel, acquisition, 1).total;
  const annualRevenue = projection.total - priorTotal;
  const singleCustomerAnnual = projectRepeatSales(products, year * 12, 1, rate, purchaseModel, false).total - (year === 1 ? 0 : projectRepeatSales(products, (year - 1) * 12, 1, rate, purchaseModel, false).total);
  const continuing = products.filter(product => product.startYear < year);
  const introduced = products.filter(product => product.startYear === year);
  const future = products.filter(product => product.startYear > year);
  const introductions = [...new Set(products.map(product => product.startYear))].sort((a, b) => a - b);
  const invalidCustomers = customerInput === '' || Number(customerInput) < 1 || Number(customerInput) > MAX_CUSTOMERS || !Number.isInteger(Number(customerInput));
  const nextLabel = ['Grow the basket in year 2', 'See what year 3 could bring', 'Explore my 20-year plan'][step];

  useEffect(() => {
    if (previousStep.current !== step && headingRef.current) {
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
      headingRef.current.focus({ preventScroll: true });
    }
    previousStep.current = step;
  }, [step]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsPhone(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const goToStep = (value: number) => { setStep(value); setExpandedProduct(null); };
  const showView = (value: 'products' | 'settings' | 'results') => {
    setMobileView(value);
    requestAnimationFrame(() => {
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById(value === 'products' ? 'rs-plan-panel' : value === 'settings' ? 'rs-settings-panel' : 'rs-projection')?.focus({ preventScroll: true });
    });
  };
  const openPicker = (mode: 'first' | 'add') => { setPickerMode(mode); setPickerOpen(true); };
  const changeCustomers = (value: number) => {
    const next = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)));
    setCustomers(next); setCustomerInput(String(next));
  };
  const toggleProduct = (id: string) => {
    if (!selectedIds.includes(id)) setProductYears(previous => ({ ...previous, [id]: year }));
    setSelectedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  };
  const chooseFirst = (id: string) => {
    setSelectedIds(previous => [id, ...previous.filter(value => value !== firstId && value !== id)]);
    setFirstId(id);
  };
  const changeStartYear = (id: string, value: number) => {
    setProductYears(previous => ({ ...previous, [id]: value }));
    requestAnimationFrame(() => document.getElementById(`rs-start-${id}`)?.focus({ preventScroll: true }));
  };
  const reset = () => {
    goToStep(0); setFirstId(FIRST_PRODUCT_ID); setSelectedIds(Object.keys(EXAMPLE_YEARS)); setIntervals({}); setProductYears(EXAMPLE_YEARS);
    setMonths(240); changeCustomers(1); setRate(DEFAULT_REPEAT_RATE); setPurchaseModel('repeat-purchases'); setAddCustomerEachYear(true);
    setCustomersPerYear(1); setReviewYear(3); setShowCategories(false); setShowSource(false); setPickerOpen(false); setMobileView('settings');
  };
  const scenarioControls = (<>
        <div className="rs-scenario"><h3>Plan settings</h3>{isPlan && <div className="rs-duration"><label htmlFor="rs-duration">Time period</label><select id="rs-duration" aria-label="Time period" value={months} onChange={event => setMonths(Number(event.target.value))}>{!presets.includes(months) && <option value={months}>{durationLabel(months)}</option>}{presets.map(preset => <option key={preset} value={preset}>{durationLabel(preset)}</option>)}</select></div>}<div className={`rs-scenario-grid${!isPlan ? ' rs-one-scenario' : ''}`}>
          {isPlan && <div className="rs-customer-control"><div className="rs-label-line"><label htmlFor="rs-customers">Starting customers</label><input id="rs-customers" type="number" min="1" max={MAX_CUSTOMERS} step="1" inputMode="numeric" aria-invalid={invalidCustomers} aria-describedby="rs-customer-help" value={customerInput} onChange={event => { const value = event.target.value; setCustomerInput(value); const number = Number(value); if (value !== '' && Number.isInteger(number) && number >= 1 && number <= MAX_CUSTOMERS) setCustomers(number); }} onBlur={() => changeCustomers(Number(customerInput))} onKeyDown={event => { if (event.key === 'Enter') changeCustomers(Number(customerInput)); }} /></div><input className="rs-range" type="range" aria-label="Starting customers, maximum 20" style={rangeStyle((customers - 1) / (MAX_CUSTOMERS - 1) * 100)} min="1" max={MAX_CUSTOMERS} value={customers} onChange={event => changeCustomers(Number(event.target.value))} /><label className="rs-growth-option" htmlFor="rs-add-customers"><input id="rs-add-customers" type="checkbox" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span>Add customers each year</span></label>{addCustomerEachYear && <label className="rs-label-line" htmlFor="rs-customers-per-year">Customers to add each year<select id="rs-customers-per-year" value={customersPerYear} onChange={event => setCustomersPerYear(Number(event.target.value))}>{Array.from({ length: MAX_CUSTOMERS }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count}</option>)}</select></label>}<p id="rs-customer-help" className="rs-muted">{invalidCustomers ? 'Enter a whole number from 1 to 20.' : addCustomerEachYear ? `Up to 20 customers total. ${customers === MAX_CUSTOMERS ? 'Limit reached.' : 'New customers join from year 2.'}` : 'Keep this group fixed. Maximum 20 customers.'}</p></div>}
          <div className="rs-repeat-control"><div className="rs-label-line"><label htmlFor="rs-repeat-rate">{purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate' : 'Annual customer retention'}</label><div className="rs-rate-entry"><input type="number" inputMode="numeric" min="0" max="100" step="1" aria-label={purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate percent' : 'Annual customer retention percent'} value={rate} onChange={event => setRate(Math.max(0, Math.min(100, Number(event.target.value) || 0)))} /><span aria-hidden="true">%</span></div></div><input id="rs-repeat-rate" className="rs-range" style={rangeStyle(rate)} type="range" min="0" max="100" value={rate} aria-valuetext={purchaseModel === 'repeat-purchases' ? `${rate}% expected to buy each repeat cycle` : `${rate}% of remaining customers return each year`} onChange={event => setRate(Number(event.target.value))} /><p className="rs-muted">{purchaseModel === 'repeat-purchases' ? 'Share expected to buy again each cycle. The first purchase is paid in full.' : `${rate}% of each joining group’s remaining customers return each year.`}</p></div>
        </div>{isPlan && <details className="rs-time-controls"><summary>Custom duration<ChevronDown size={16} aria-hidden="true" /></summary><div className="rs-label-line"><label htmlFor="rs-months">Duration</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" style={rangeStyle((months - 1) / (MAX_MONTHS - 1) * 100)} type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div></details>}</div>

  </>);
  const assumptions = (<>
        <details className="rs-retention"><summary>Assumptions & price source<ChevronDown size={16} aria-hidden="true" /></summary><fieldset className="rs-model-selector"><legend>Purchase model</legend><div>{([['repeat-purchases', 'Repeat purchases'], ['annual-attrition', 'Annual attrition']] as const).map(([value, label]) => <label key={value} data-selected={purchaseModel === value}><input type="radio" name="purchase-model" value={value} checked={purchaseModel === value} onChange={() => setPurchaseModel(value)} /><span>{label}</span></label>)}</div></fieldset><div className="rs-monthly"><span>Active monthly basket / customer<br /><small>Before repeat rate</small></span><strong>RM {formatRinggit(projection.recurringMonthly / startingCustomers)}</strong></div>
          <p>Start years refer to the business calendar. Each customer starts buying a product when both the customer and product have joined the plan. Repeat purchasing applies the rate to later cycles; fractional buyers are expected averages. Annual attrition instead reduces each group by its age since joining.</p>
          <p>Intervals are editable examples, not usage advice. Appliances default to one purchase. Filters start one replacement interval after the product becomes available to that customer, treating the initial filter as included. Follow product instructions and indicators.</p>
          <p>All prices and estimates use Malaysia ABO/AP prices from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Actual selling prices can differ. Prices stay fixed, with no inflation or reinvestment. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><button className="rs-text-button" type="button" aria-pressed={showSource} onClick={() => setShowSource(value => !value)}>{showSource ? 'Hide source details' : 'Show source details'}</button>
        </details>
  </>);

  const productRow = (product: typeof catalog[number]) => <details className="rs-story-product" key={product.id} data-product-id={product.id} open={expandedProduct === product.id}>
    <summary onClick={event => { event.preventDefault(); setExpandedProduct(previous => previous === product.id ? null : product.id); }}>
      <ProductImage key={product.id} id={product.id} eager={step === 0} />
      <span className="rs-story-product-copy"><strong>{product.name}</strong><small>{product.size} · RM {formatRinggit(product.aboPrice)} / pack</small><span className="rs-story-cadence"><Repeat2 size={14} aria-hidden="true" />{cycleLabel(product.every)}</span></span>
      <span className="rs-story-product-end">{product.startYear === year && year > 1 && <span className="rs-new-label">New</span>}<ChevronDown size={18} aria-hidden="true" /></span>
    </summary>
    <div className="rs-story-product-controls">
      <label>Buy again<select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => setIntervals(previous => ({ ...previous, [product.id]: Number(event.target.value) }))}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select></label>
      {isPlan && <label>Starts buying{product.id === firstId ? <span className="rs-fixed-year">Year 1</span> : <select id={`rs-start-${product.id}`} aria-label={`Start year for ${product.name}, ${product.size}`} value={product.startYear} onChange={event => changeStartYear(product.id, Number(event.target.value))}>{startYears.map(value => <option key={value} value={value}>Year {value}</option>)}</select>}</label>}
      {product.type === 'filter' && product.every > 0 && <p className="rs-muted">First replacement after {durationLabel(product.every)}.</p>}
      {showSource && <p className="rs-muted">SKU {product.id} · source p.{product.page}</p>}
      {(isPlan || product.startYear === year && year > 1) && <button className="rs-text-button" type="button" onClick={() => { toggleProduct(product.id); setExpandedProduct(null); }} aria-label={`Remove product: ${product.name}, ${product.size}`}>Remove product</button>}
    </div>
  </details>;
  const basket = <>
    {isPlan && <><div className="rs-year-review"><label htmlFor="rs-review-year">Basket in year</label><select id="rs-review-year" value={year} onChange={event => { setReviewYear(Number(event.target.value)); setExpandedProduct(null); }}>{startYears.filter(value => value <= Math.ceil(months / 12)).map(value => <option value={value} key={value}>Year {value}</option>)}</select></div><p className="rs-muted">{continuing.length + introduced.length} products available this year. Open a product to edit its timing.</p></>}
    {continuing.length > 0 && <div className="rs-story-group"><h2>Continuing from earlier years <span>{continuing.length}</span></h2>{continuing.map(productRow)}</div>}
    {introduced.length > 0 && <div className="rs-story-group"><h2>{year === 1 ? 'Your starting product' : `New in year ${year}`}<span>{introduced.length}</span></h2>{introduced.map(productRow)}</div>}
    {!continuing.length && !introduced.length && <div className="rs-no-results"><ShoppingBasket size={28} aria-hidden="true" /><p>No products in this year yet.</p></div>}
    {isPlan && future.length > 0 && <div className="rs-story-group rs-story-future"><h2>Planned for later <span>{future.length}</span></h2>{future.map(productRow)}</div>}
    <button className="rs-story-add" type="button" onClick={() => openPicker(step === 0 ? 'first' : 'add')}>{step === 0 ? 'Choose a different starting product' : <><Plus size={18} aria-hidden="true" />{isPlan ? `Add products for year ${year}` : `Choose products for year ${year}`}</>}</button>
    {!isPlan && step > 0 && <p className="rs-story-takeaway"><ShoppingBasket size={20} aria-hidden="true" /><span><strong>{continuing.length} → {continuing.length + introduced.length} products</strong><small>The earlier basket carries forward.</small></span></p>}
    {isPlan && <div className="rs-basket-footer"><span>{selected.length} products across your plan</span><button className="rs-text-button" type="button" disabled={!selected.length} onClick={() => setSelectedIds([])}>Clear basket</button></div>}
  </>;

  return <section id="repeat-sales" className="repeat-sales rs-narrative" aria-labelledby="repeat-sales-heading">
    <div className="rs-story-top"><button type="button" className="rs-text-button" onClick={reset} aria-label="Reset"><RotateCcw size={16} aria-hidden="true" />Reset</button></div>
    <nav className="rs-chapters" aria-label="Consultation chapters"><ol>{steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} onClick={() => goToStep(index)}>{label}</button></li>)}</ol></nav>
    <header className="rs-intro rs-story-intro"><div><h1 id="repeat-sales-heading" ref={headingRef} tabIndex={-1}>{titles[step]}</h1><p>{step === 1 && firstId !== FIRST_PRODUCT_ID ? 'Keep your first product. Add everyday essentials.' : descriptions[step]}</p></div>{!isPlan && <button type="button" className="rs-text-button rs-skip" onClick={() => goToStep(3)}>Build my own plan<ArrowRight size={16} aria-hidden="true" /></button>}</header>
    {!isPlan ? <>
      <div className="rs-story-layout">
        <div className="rs-story-basket">{basket}
          {step === 2 && <div className="rs-story-growth"><label className="rs-growth-option" htmlFor="rs-story-growth"><input id="rs-story-growth" type="checkbox" role="switch" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span><strong>Now add one new customer a year</strong><small>Starting in year 2, up to 20 customers. Each can buy the available basket.</small></span></label></div>}
        </div>
        <div className="rs-story-receipt" aria-live="polite" aria-atomic="true">
          <h2>Year {year} revenue</h2><p className="rs-story-amount"><span>RM </span>{formatRinggit(annualRevenue)}</p>
          <p className="rs-story-facts"><UserRound size={18} aria-hidden="true" />{projection.customersAtEnd} {projection.customersAtEnd === 1 ? 'customer' : 'customers'} · {products.length} {products.length === 1 ? 'product' : 'products'}</p>
          {step === 0 ? <dl className="rs-story-math"><div><dt>First purchase</dt><dd>RM {formatRinggit(projectRepeatSales([firstProduct], 1, 1, rate, purchaseModel, false).total)}</dd></div><div><dt>Later purchases this year</dt><dd>RM {formatRinggit(Math.max(0, annualRevenue - projectRepeatSales([firstProduct], 1, 1, rate, purchaseModel, false).total))}</dd></div></dl> : <dl className="rs-story-math"><div><dt>Original customer’s basket</dt><dd>RM {formatRinggit(singleCustomerAnnual)}</dd></div>{acquisition && <div><dt>From new customers</dt><dd>RM {formatRinggit(annualRevenue - singleCustomerAnnual)}</dd></div>}<div><dt>Total through year {year}</dt><dd>RM {formatRinggit(projection.total)}</dd></div></dl>}
          <p className="rs-story-note">{step === 0 ? 'One sale can become a buying habit.' : step === 1 ? 'The same customer. A broader basket.' : 'Basket growth and customer growth work together.'}</p>
          <p className="rs-muted">Revenue before costs · not profit<br />Editable example · {rate}% {purchaseModel === 'repeat-purchases' ? 'repeat purchase assumption' : 'annual customer retention'}</p>
          <button className="primary-button rs-story-next" type="button" onClick={() => goToStep(step + 1)}>{nextLabel}<ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <details className="rs-story-assumptions"><summary>How this example works<ChevronDown size={16} aria-hidden="true" /></summary><p>Products join in the year shown, then repeat at their chosen interval. The first two chapters keep one customer so you can see basket growth on its own. Year 3 introduces optional yearly customer growth from year 2.</p><p>Prices use Malaysia ABO/AP prices from April 2026. Purchase intervals are editable examples, not usage advice. These are sales estimates before costs, not earnings or guaranteed growth. Adjust repeat rate, customer retention and timing in My plan.</p></details>
    </> : <>
      <div className="rs-view-switch rs-section-switch" role="group" aria-label="Consultation view"><button type="button" aria-controls="rs-plan-panel" aria-pressed={mobileView === 'products'} onClick={() => showView('products')}>Products <span>{products.length}</span></button><button type="button" aria-controls="rs-settings-panel" aria-pressed={mobileView === 'settings'} onClick={() => showView('settings')}>Settings</button><button type="button" aria-controls="rs-projection" aria-pressed={mobileView === 'results'} onClick={() => showView('results')}>Results</button></div>
      <div className="rs-workspace">
        <div className="rs-editor">
          <div id="rs-plan-panel" className="rs-plan-panel rs-story-plan-basket" role="region" aria-label="Products in your plan" tabIndex={-1} hidden={isPhone && mobileView !== 'products'}>
            <h2>Your year-by-year basket</h2><p className="rs-muted">Malaysia ABO prices · Apr 2026</p>{basket}
            <details className="rs-year-overview"><summary>See how your basket grows<ChevronDown size={16} aria-hidden="true" /></summary>{startYears.filter(value => value <= Math.ceil(months / 12)).map(value => <button type="button" key={value} onClick={() => { setReviewYear(value); setExpandedProduct(null); document.getElementById('rs-review-year')?.focus(); }}><span>Year {value}</span><span>{selected.filter(product => product.startYear <= value).length} products<small>{selected.filter(product => product.startYear === value).length} new</small></span><ArrowRight size={16} aria-hidden="true" /></button>)}</details>
          </div>
          <div id="rs-settings-panel" className="rs-plan-panel rs-settings-panel" role="region" aria-label="Plan settings" tabIndex={-1} hidden={isPhone && mobileView !== 'settings'}>{scenarioControls}{assumptions}</div>
        </div>
        <div className="rs-result" id="rs-projection" tabIndex={-1} hidden={isPhone && mobileView !== 'results'} aria-label="Revenue projection">
          <div className="rs-result-top"><h2>Revenue over {durationLabel(horizon)}</h2></div><p className="rs-revenue-label">Revenue before costs · not profit</p><p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM </span>{formatRinggit(projection.total)}</p><p className="rs-context">{products.filter(product => (product.startYear - 1) * 12 < horizon).length} active products · {projection.customersAtEnd} customers introduced</p>
          {products.some(product => (product.startYear - 1) * 12 >= horizon) && <p className="rs-muted">Some products start after this period. Extend the duration to include them.</p>}
          <p className="rs-result-assumption">{purchaseModel === 'repeat-purchases' ? `Repeat purchase assumption: ${rate}%` : `Annual customer retention: ${rate}%`}</p>
          <div className="rs-chart-heading"><h3>Total revenue over time</h3><label className="rs-breakdown"><input type="checkbox" checked={showCategories} onChange={event => setShowCategories(event.target.checked)} />By category</label></div>
          <Suspense fallback={<div className="rs-chart-loading" role="status">Loading chart…</div>}><RevenueChart projection={projection} months={horizon} model={purchaseModel} rate={rate} showCategories={showCategories} introductions={introductions} emptyMessage={products.length ? `Your products start in year ${Math.min(...products.map(product => product.startYear))}.` : 'Add a product to begin.'} /></Suspense>
          {showCategories && <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>}
          <details className="rs-year-revenue"><summary>Revenue by year<ChevronDown size={16} aria-hidden="true" /></summary><table><caption>Annual revenue and running total, before costs</caption><thead><tr><th scope="col">Year</th><th scope="col">This year (RM)</th><th scope="col">Total (RM)</th></tr></thead><tbody>{Array.from({ length: Math.ceil(months / 12) }, (_, index) => { const end = Math.min(months, (index + 1) * 12); const at = (month: number) => projection.categories.reduce((sum, group) => sum + group.cumulative[month], 0); return <tr key={index}><th scope="row">{index + 1}{end % 12 > 0 ? ` (${end % 12} mo)` : ''}</th><td>{formatRinggit(at(end) - at(index * 12))}</td><td>{formatRinggit(at(end))}</td></tr>; })}</tbody></table></details>
        </div>
      </div>
    </>}
    <div className={`rs-mobile-summary${!isPlan ? ' rs-story-dock' : ''}`} data-view={mobileView}>{!isPlan ? <><div className="rs-mobile-summary-copy"><p><span>RM </span>{formatRinggit(annualRevenue)}</p><span>Year {year} · before costs</span></div><button type="button" onClick={() => goToStep(step + 1)}>{['Next: year 2', 'Next: year 3', 'My 20-year plan'][step]}<ArrowRight size={18} aria-hidden="true" /></button></> : <><div className="rs-mobile-summary-copy"><span>{durationLabel(months)}</span><p><span>RM </span>{formatRinggit(projection.total)}</p><span>Revenue before costs</span></div><button type="button" onClick={() => showView(mobileView === 'results' ? 'products' : 'results')}>{mobileView === 'results' ? 'Edit my basket' : 'View my projection'}<ArrowRight size={18} aria-hidden="true" /></button></>}</div>
    <ProductPicker open={pickerOpen} mode={pickerMode} catalog={isPlan || pickerMode === 'first' ? catalog : catalog.filter(product => product.startYear <= year || !selectedIds.includes(product.id))} selectedIds={selectedIds} firstId={firstId} startYear={year} lockedIds={!isPlan ? continuing.map(product => product.id) : []} showSource={showSource} onClose={() => setPickerOpen(false)} onToggle={toggleProduct} onChooseFirst={chooseFirst} />
  </section>;
}
