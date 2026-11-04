import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronDown, CircleHelp, MoreHorizontal, Plus, RotateCcw, ShoppingBasket, UserRound, Repeat2 } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import { annualLayers, durationLabel, formatRinggit, formatTotal, DEFAULT_REPEAT_RATE, MAX_CUSTOMERS, MAX_MONTHS, projectRepeatSales } from '../lib/repeatSales';
import type { PurchaseModel } from '../lib/repeatSales';
import ProductPicker from './ProductPicker';
import ProductImage from './ProductImage';
import LayerChart from './LayerChart';
import ProductSheet from './ProductSheet';
import Stepper from './Stepper';
import './RepeatSales.css';
import './CompoundFlow.css';
import './CompoundStory.css';
import './CompoundLayers.css';

const FIRST_PRODUCT_ID = '124106';
const EXAMPLE_YEARS: Record<string, number> = { '124106': 1, '110488': 2, '126449': 2, '000100': 3 };
const periodPresets = [60, 120, 240, 360];
const startYears = Array.from({ length: 50 }, (_, index) => index + 1);
const steps = ['Year 1', 'Year 2', 'Year 3', 'My plan'];
const titles = ['Start with one useful product', 'Trust grows the basket', 'Small steps build momentum', 'Make the story your own'];
const descriptions = ['One customer. One product. A reason to come back.', 'Keep the toothpaste. Add two everyday products.', 'Earlier products keep repeating. Grow at your own pace.', 'Your choices carry forward. Adjust the pace to fit your plan.'];
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : interval === 12 ? 'Every year' : `Every ${durationLabel(interval)}`;
const rangeStyle = (percentage: number): CSSProperties => ({ '--range-fill': `${percentage}%` } as CSSProperties);
const RevenueChart = lazy(() => import('./RevenueChart'));
const wholeRinggit = (amount: number) => new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(amount);

export default function RepeatSales() {
  const [step, setStep] = useState(0);
  const isPlan = step === 3;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customPeriod, setCustomPeriod] = useState(false);
  const [customersValid, setCustomersValid] = useState(true);
  const [firstId, setFirstId] = useState(FIRST_PRODUCT_ID);
  const [selectedIds, setSelectedIds] = useState<string[]>(Object.keys(EXAMPLE_YEARS));
  const [intervals, setIntervals] = useState<Record<string, number>>({});
  const [productYears, setProductYears] = useState<Record<string, number>>(EXAMPLE_YEARS);
  const [months, setMonths] = useState(240);
  const [customers, setCustomers] = useState(1);
  const [rate, setRate] = useState(DEFAULT_REPEAT_RATE);
  const [purchaseModel, setPurchaseModel] = useState<PurchaseModel>('repeat-purchases');
  const [addCustomerEachYear, setAddCustomerEachYear] = useState(true);
  const [customersPerYear, setCustomersPerYear] = useState(1);
  const [showCategories, setShowCategories] = useState(false);
  const [chartMode, setChartMode] = useState<'bars' | 'line'>('bars');
  const [showSource, setShowSource] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'first' | 'add'>('first');
  const [reviewYear, setReviewYear] = useState(3);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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
  // Story chapters preview five years so later bars show where the basket is heading.
  const storyMonths = 60;
  const storyLayers = useMemo(() => isPlan ? [] : annualLayers(projectRepeatSales(products, storyMonths, 1, rate, purchaseModel, acquisition, 1), projectRepeatSales(products, storyMonths, 1, rate, purchaseModel, false), storyMonths), [isPlan, products, rate, purchaseModel, acquisition]);
  const planLayers = useMemo(() => isPlan ? annualLayers(projection, projectRepeatSales(products, horizon, startingCustomers, rate, purchaseModel, false), horizon) : [], [isPlan, projection, products, horizon, startingCustomers, rate, purchaseModel]);
  const previousYear = !isPlan && year > 1 ? storyLayers[year - 2] : null;
  const previousRevenue = previousYear ? previousYear.original + previousYear.added : 0;
  const continuing = products.filter(product => product.startYear < year);
  const introduced = products.filter(product => product.startYear === year);
  const introductions = [...new Set(products.map(product => product.startYear))].sort((a, b) => a - b);
  const planYears = Math.ceil(months / 12);
  const newPerYear = addCustomerEachYear ? customersPerYear : 0;
  const capYear = newPerYear > 0 && customers < MAX_CUSTOMERS ? Math.ceil((MAX_CUSTOMERS - customers) / newPerYear) + 1 : null;
  // A plain-language reading of the plan's bars: when the starting basket levels off and what grows after.
  const insight = useMemo(() => {
    if (!isPlan || planLayers.length < 3) return '';
    const full = planLayers.filter(layer => layer.months === 12);
    const lastChange = full.reduce((last, layer, index) => index > 0 && Math.abs(layer.original - full[index - 1].original) > 0.005 ? index : last, -1);
    const plateau = full[Math.max(0, lastChange)];
    const parts: string[] = [];
    if (plateau && lastChange < full.length - 2 && plateau.original > 0) parts.push(`From year ${plateau.year}, your starting ${startingCustomers === 1 ? 'customer’s basket holds' : 'customers’ baskets hold'} at RM ${wholeRinggit(plateau.original)} a year.`);
    if (acquisition && newPerYear > 0) {
      const growthYears = full.slice((plateau?.year ?? 2) - 1, capYear ?? full.length);
      const step = growthYears.length > 1 ? (growthYears.at(-1)!.added - growthYears[0].added) / (growthYears.length - 1) : 0;
      if (step > 0.5) parts.push(`${parts.length ? 'After that, new' : 'New'} customers add about RM ${wholeRinggit(step)} more each year.`);
      if (capYear !== null && capYear <= planYears) parts.push(`Growth stops at the ${MAX_CUSTOMERS}-customer cap in year ${capYear}.`);
    }
    return parts.join(' ');
  }, [isPlan, planLayers, startingCustomers, acquisition, newPerYear, capYear, planYears]);
  const isCustomPeriod = customPeriod || !periodPresets.includes(months);
  const startGroups = [...new Set(selected.map(product => product.startYear))].sort((a, b) => a - b);
  const editing = catalog.find(product => product.id === editingId && selectedIds.includes(product.id)) ?? null;
  const nextLabel = ['Grow the basket in year 2', 'See what year 3 could bring', 'Explore my 20-year plan'][step];

  useEffect(() => {
    if (previousStep.current !== step && headingRef.current) {
      document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'instant' });
      headingRef.current.focus({ preventScroll: true });
    }
    previousStep.current = step;
  }, [step]);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        if (event instanceof KeyboardEvent) menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [menuOpen]);
  const goToStep = (value: number) => { setStep(value); setEditingId(null); setMenuOpen(false); };
  const showExplanation = () => {
    setMenuOpen(false);
    const details = document.querySelector<HTMLDetailsElement>(isPlan ? '.rs-retention' : '.rs-story-assumptions');
    if (!details) return;
    details.open = true;
    details.scrollIntoView({ behavior: 'instant', block: 'start' });
    details.querySelector('summary')?.focus({ preventScroll: true });
  };
  const showProjection = () => {
    const result = document.getElementById('rs-projection');
    result?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    result?.focus({ preventScroll: true });
  };
  const openPicker = (mode: 'first' | 'add') => { setPickerMode(mode); setPickerOpen(true); };
  const changeCustomers = (value: number) => setCustomers(Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(value) ? value : 1))));
  const changeNewPerYear = (value: number) => { setAddCustomerEachYear(value > 0); if (value > 0) setCustomersPerYear(value); };
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
  };
  const reset = () => {
    goToStep(0); setFirstId(FIRST_PRODUCT_ID); setSelectedIds(Object.keys(EXAMPLE_YEARS)); setIntervals({}); setProductYears(EXAMPLE_YEARS);
    setMonths(240); setCustomPeriod(false); changeCustomers(1); setCustomersValid(true); setRate(DEFAULT_REPEAT_RATE); setPurchaseModel('repeat-purchases'); setAddCustomerEachYear(true);
    setCustomersPerYear(1); setReviewYear(3); setShowCategories(false); setShowSource(false); setPickerOpen(false); setChartMode('bars'); setEditingId(null);
  };
  const repeatControl = <div className="rs-repeat-control"><div className="rs-label-line"><label htmlFor="rs-repeat-rate">{purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate' : 'Annual customer retention'}</label><div className="rs-rate-entry"><input type="number" inputMode="numeric" min="0" max="100" step="1" aria-label={purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate percent' : 'Annual customer retention percent'} value={rate} onChange={event => setRate(Math.max(0, Math.min(100, Number(event.target.value) || 0)))} /><span aria-hidden="true">%</span></div></div><input id="rs-repeat-rate" className="rs-range" style={rangeStyle(rate)} type="range" min="0" max="100" value={rate} aria-valuetext={purchaseModel === 'repeat-purchases' ? `${rate}% expected to buy each repeat cycle` : `${rate}% of remaining customers return each year`} onChange={event => setRate(Number(event.target.value))} /><p className="rs-muted">{purchaseModel === 'repeat-purchases' ? 'Share expected to buy again each cycle. The first purchase is paid in full.' : `${rate}% of each joining group’s remaining customers return each year.`}</p></div>;
  const scenarioControls = <div className="rs-scenario rs-levers"><h3>Plan settings</h3>
    <fieldset className="rs-lever"><legend>Time period</legend><div className="rs-segmented">{periodPresets.map(preset => <label key={preset}><input type="radio" name="rs-period" aria-label={durationLabel(preset)} checked={!isCustomPeriod && months === preset} onChange={() => { setCustomPeriod(false); setMonths(preset); }} /><span aria-hidden="true">{preset / 12}y</span></label>)}<label><input type="radio" name="rs-period" checked={isCustomPeriod} onChange={() => setCustomPeriod(true)} /><span>Custom</span></label></div>
      {isCustomPeriod && <div className="rs-time-controls"><div className="rs-label-line"><label htmlFor="rs-months">Duration</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" style={rangeStyle((months - 1) / (MAX_MONTHS - 1) * 100)} type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div></div>}
    </fieldset>
    <div className="rs-lever rs-lever-row"><label htmlFor="rs-customers">Starting customers</label><Stepper id="rs-customers" label="Starting customers" value={customers} min={1} max={MAX_CUSTOMERS} describedBy="rs-customer-help" onChange={changeCustomers} onValidity={setCustomersValid} /><p id="rs-customer-help" className="rs-muted">{customersValid ? `Maximum ${MAX_CUSTOMERS} customers in total.` : `Enter a whole number from 1 to ${MAX_CUSTOMERS}.`}</p></div>
    <div className="rs-lever rs-lever-row"><label htmlFor="rs-customers-per-year">New customers a year</label><Stepper id="rs-customers-per-year" label="New customers a year" value={newPerYear} min={0} max={MAX_CUSTOMERS} describedBy="rs-growth-help" onChange={changeNewPerYear} /><p id="rs-growth-help" className="rs-muted">{newPerYear === 0 ? 'Growth is off. Your starting customers stay fixed.' : customers >= MAX_CUSTOMERS ? 'You already have the 20-customer maximum.' : capYear !== null && capYear <= planYears ? `New customers join from year 2. You reach ${MAX_CUSTOMERS} customers in year ${capYear}.` : `New customers join from year 2. 0 turns growth off.`}</p></div>
    <div className="rs-lever">{repeatControl}</div>
  </div>;
  const assumptions = (<>
        <details className="rs-retention"><summary>Assumptions & price source<ChevronDown size={16} aria-hidden="true" /></summary><fieldset className="rs-model-selector"><legend>Purchase model</legend><div>{([['repeat-purchases', 'Repeat purchases'], ['annual-attrition', 'Annual attrition']] as const).map(([value, label]) => <label key={value} data-selected={purchaseModel === value}><input type="radio" name="purchase-model" value={value} checked={purchaseModel === value} onChange={() => setPurchaseModel(value)} /><span>{label}</span></label>)}</div></fieldset><div className="rs-monthly"><span>Active monthly basket / customer<br /><small>Before repeat rate</small></span><strong>RM {formatRinggit(projection.recurringMonthly / startingCustomers)}</strong></div>
          <p>Start years refer to the business calendar. Each customer starts buying a product when both the customer and product have joined the plan. Repeat purchasing applies the rate to later cycles; fractional buyers are expected averages. Annual attrition instead reduces each group by its age since joining.</p>
          <p>Intervals are editable examples, not usage advice. Appliances default to one purchase. Filters start one replacement interval after the product becomes available to that customer, treating the initial filter as included. Follow product instructions and indicators.</p>
          <p>All prices and estimates use Malaysia ABO/AP prices from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Actual selling prices can differ. Prices stay fixed, with no inflation or reinvestment. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><button className="rs-text-button" type="button" aria-pressed={showSource} onClick={() => setShowSource(value => !value)}>{showSource ? 'Hide source details' : 'Show source details'}</button>
        </details>
  </>);

  const productRow = (product: typeof catalog[number]) => <div className="rs-story-product" key={product.id} data-product-id={product.id}>
    <button type="button" className="rs-product-row" aria-haspopup="dialog" onClick={() => setEditingId(product.id)}>
      <ProductImage key={product.id} id={product.id} eager={step === 0} />
      <span className="rs-story-product-copy"><strong>{product.name}</strong><small>{product.size} · RM {formatRinggit(product.aboPrice)} · <span className="rs-story-cadence"><Repeat2 size={14} aria-hidden="true" />{cycleLabel(product.every)}</span></small></span>
      <span className="rs-story-product-end">{!isPlan && product.startYear === year && year > 1 && <span className="rs-new-label">New</span>}<span className="rs-row-edit">Edit</span></span>
    </button>
  </div>;
  const storyBasket = <>
    {continuing.length > 0 && <div className="rs-story-group"><h2>Continuing from earlier years <span>{continuing.length}</span></h2>{continuing.map(productRow)}</div>}
    {introduced.length > 0 && <div className="rs-story-group"><h2>{year === 1 ? 'Your starting product' : `New in year ${year}`}<span>{introduced.length}</span></h2>{introduced.map(productRow)}</div>}
    <button className="rs-story-add" type="button" onClick={() => openPicker(step === 0 ? 'first' : 'add')}>{step === 0 ? 'Choose a different starting product' : <><Plus size={18} aria-hidden="true" />{`Choose products for year ${year}`}</>}</button>
    {step > 0 && <p className="rs-story-takeaway"><ShoppingBasket size={20} aria-hidden="true" /><span><strong>{continuing.length} → {continuing.length + introduced.length} products</strong><small>The earlier basket carries forward.</small></span></p>}
  </>;
  const addInYear = (value: number) => { setReviewYear(value); openPicker('add'); };
  const planBasket = <>
    {startGroups.map(start => { const group = selected.filter(product => product.startYear === start); const later = (start - 1) * 12 >= months; return <div className="rs-story-group rs-plan-year" data-year={start} data-later={later || undefined} key={start}>
      <h2>Year {start}<span>{start === 1 ? group.length : `+${group.length}`} {group.length === 1 ? 'product' : 'products'}</span></h2>
      {later && <p className="rs-muted">Starts after this {durationLabel(months)} plan.</p>}
      {group.map(productRow)}
      {!later && <button className="rs-text-button rs-add-in-year" type="button" onClick={() => addInYear(start)}><Plus size={16} aria-hidden="true" />Add to year {start}</button>}
    </div>; })}
    {!selected.length && <div className="rs-no-results"><ShoppingBasket size={28} aria-hidden="true" /><p>No products yet.</p></div>}
    <div className="rs-add-year"><label htmlFor="rs-add-year">Add products starting in</label><select id="rs-add-year" value={year} onChange={event => setReviewYear(Number(event.target.value))}>{startYears.filter(value => value <= planYears).map(value => <option value={value} key={value}>Year {value}</option>)}</select><button className="rs-story-add" type="button" onClick={() => openPicker('add')}><Plus size={18} aria-hidden="true" />Add products</button></div>
    <div className="rs-basket-footer"><span>{selected.length} products across your plan</span><button className="rs-text-button" type="button" disabled={!selected.length} onClick={() => setSelectedIds([])}>Clear basket</button></div>
  </>;

  return <section id="repeat-sales" className="repeat-sales rs-narrative" aria-labelledby="repeat-sales-heading">
    <div className="rs-story-top">
      <nav className="rs-chapters" aria-label="Consultation chapters"><ol>{steps.map((label, index) => <li key={label}><button type="button" aria-current={step === index ? 'step' : undefined} data-done={index < step || undefined} onClick={() => goToStep(index)}><span className="rs-chapter-bar" aria-hidden="true" />{label}</button></li>)}</ol></nav>
      <div className="rs-more" ref={menuRef}><button type="button" className="rs-icon-button" aria-label="More options" aria-haspopup="menu" aria-expanded={menuOpen} aria-controls="rs-more-menu" onClick={() => setMenuOpen(value => !value)}><MoreHorizontal size={22} aria-hidden="true" /></button>
        {menuOpen && <div className="rs-more-menu" id="rs-more-menu" role="menu" aria-label="More options"><button type="button" role="menuitem" autoFocus onClick={() => { setMenuOpen(false); reset(); }}><RotateCcw size={18} aria-hidden="true" />Reset example</button><button type="button" role="menuitem" onClick={showExplanation}><CircleHelp size={18} aria-hidden="true" />{isPlan ? 'Assumptions & price source' : 'How this example works'}</button></div>}
      </div>
    </div>
    <header className="rs-intro rs-story-intro"><div><h1 id="repeat-sales-heading" ref={headingRef} tabIndex={-1}>{titles[step]}</h1><p>{step === 1 && firstId !== FIRST_PRODUCT_ID ? 'Keep your first product. Add everyday essentials.' : descriptions[step]}</p></div>{!isPlan && <button type="button" className="rs-text-button rs-skip" onClick={() => goToStep(3)}>Build my own plan<ArrowRight size={16} aria-hidden="true" /></button>}</header>
    {!isPlan ? <>
      <div className="rs-story-layout">
        <div className="rs-story-receipt" aria-live="polite" aria-atomic="true">
          <h2>Year {year} revenue</h2><p className="rs-story-amount"><span>RM </span>{formatTotal(annualRevenue)}</p>
          {previousYear ? <p className="rs-story-delta">{annualRevenue >= previousRevenue ? '+' : '−'}RM {formatRinggit(Math.abs(annualRevenue - previousRevenue))} vs year {year - 1}{previousRevenue > 0 && annualRevenue > previousRevenue ? ` · ${(annualRevenue / previousRevenue).toFixed(1)}×` : ''}</p> : <p className="rs-story-facts"><UserRound size={18} aria-hidden="true" />{projection.customersAtEnd} {projection.customersAtEnd === 1 ? 'customer' : 'customers'} · {products.length} {products.length === 1 ? 'product' : 'products'}</p>}
          <LayerChart variant="story" layers={storyLayers} reached={year} current={year} label={`Revenue for years 1 to 5. ${storyLayers.filter(layer => layer.year <= year).map(layer => `Year ${layer.year}: RM ${formatRinggit(layer.original + layer.added)}`).join('. ')}. Later years are faint previews.`} />
          <p className="rs-layer-legend"><span><i className="rs-key-original" aria-hidden="true" />{year === 1 ? 'Your customer' : 'Original customer'}</span>{acquisition && <span><i className="rs-key-added" aria-hidden="true" />New customers</span>}<span><i className="rs-key-later" aria-hidden="true" />Later years</span></p>
          {step === 0 ? <dl className="rs-story-math"><div><dt>First purchase</dt><dd>RM {formatRinggit(projectRepeatSales([firstProduct], 1, 1, rate, purchaseModel, false).total)}</dd></div><div><dt>Later purchases this year</dt><dd>RM {formatRinggit(Math.max(0, annualRevenue - projectRepeatSales([firstProduct], 1, 1, rate, purchaseModel, false).total))}</dd></div></dl> : <dl className="rs-story-math"><div><dt>Original customer’s basket</dt><dd>RM {formatRinggit(singleCustomerAnnual)}</dd></div>{acquisition && <div><dt>From {projection.customersAtEnd - 1} new {projection.customersAtEnd === 2 ? 'customer' : 'customers'}</dt><dd>RM {formatRinggit(annualRevenue - singleCustomerAnnual)}</dd></div>}<div><dt>Total through year {year}</dt><dd>RM {formatRinggit(projection.total)}</dd></div></dl>}
          <p className="rs-story-note">{step === 0 ? 'One sale can become a buying habit.' : step === 1 ? 'The same customer. A broader basket.' : 'Basket growth and customer growth work together.'}</p>
          <p className="rs-muted">Revenue before costs · not profit<br />Editable example · {rate}% {purchaseModel === 'repeat-purchases' ? 'repeat purchase assumption' : 'annual customer retention'}</p>
          <button className="primary-button rs-story-next" type="button" onClick={() => goToStep(step + 1)}>{nextLabel}<ArrowRight size={18} aria-hidden="true" /></button>
        </div>
        <div className="rs-story-basket">
          {step === 2 && <div className="rs-story-growth"><label className="rs-growth-option" htmlFor="rs-story-growth"><input id="rs-story-growth" type="checkbox" role="switch" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span><strong>Now add one new customer a year</strong><small>Starting in year 2, up to 20 customers. Each can buy the available basket.</small></span></label></div>}
          {storyBasket}
        </div>
      </div>
      <details className="rs-story-assumptions"><summary>How this example works<ChevronDown size={16} aria-hidden="true" /></summary><p>Products join in the year shown, then repeat at their chosen interval. The first two chapters keep one customer so you can see basket growth on its own. Year 3 introduces optional yearly customer growth from year 2.</p><p>Prices use Malaysia ABO/AP prices from April 2026. Purchase intervals are editable examples, not usage advice. These are sales estimates before costs, not earnings or guaranteed growth. Adjust repeat rate, customer retention and timing in My plan.</p></details>
    </> : <>
      <div className="rs-workspace">
        <div className="rs-result" id="rs-projection" tabIndex={-1} aria-label="Revenue projection">
          <div className="rs-result-top"><h2>Revenue over {durationLabel(horizon)}</h2></div><p className="rs-revenue-label">Revenue before costs · not profit</p><p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM </span>{formatTotal(projection.total)}</p><p className="rs-context">{products.filter(product => (product.startYear - 1) * 12 < horizon).length} active products · {projection.customersAtEnd} customers introduced</p>
          {products.some(product => (product.startYear - 1) * 12 >= horizon) && <p className="rs-muted">Some products start after this period. Extend the duration to include them.</p>}
          <p className="rs-result-assumption">{purchaseModel === 'repeat-purchases' ? `Repeat purchase assumption: ${rate}%` : `Annual customer retention: ${rate}%`}</p>
          <div className="rs-chart-heading"><h3>{chartMode === 'bars' ? 'Revenue each year' : 'Total revenue over time'}</h3><div className="rs-chart-mode" role="group" aria-label="Chart type"><button type="button" aria-pressed={chartMode === 'bars'} onClick={() => setChartMode('bars')}>Each year</button><button type="button" aria-pressed={chartMode === 'line'} onClick={() => setChartMode('line')}>Running total</button></div></div>
          {chartMode === 'bars' ? <>
            {products.length ? <LayerChart variant="plan" layers={planLayers} reached={planLayers.length} label={`Revenue each year for ${durationLabel(horizon)}, split into starting customers and customers added later. Year 1: RM ${formatRinggit(planLayers[0] ? planLayers[0].original + planLayers[0].added : 0)}. Final year: RM ${formatRinggit(planLayers.at(-1) ? planLayers.at(-1)!.original + planLayers.at(-1)!.added : 0)}.`} /> : <div className="rs-no-results"><ShoppingBasket size={28} aria-hidden="true" /><p>Add a product to begin.</p></div>}
            <p className="rs-layer-legend"><span><i className="rs-key-original" aria-hidden="true" />{startingCustomers === 1 ? 'Starting customer' : `${startingCustomers} starting customers`}</span>{acquisition && <span><i className="rs-key-added" aria-hidden="true" />Customers added later</span>}</p>
            {insight && <p className="rs-insight">{insight}</p>}
          </> : <>
            <label className="rs-breakdown"><input type="checkbox" checked={showCategories} onChange={event => setShowCategories(event.target.checked)} />By category</label>
            <Suspense fallback={<div className="rs-chart-loading" role="status">Loading chart…</div>}><RevenueChart projection={projection} months={horizon} model={purchaseModel} rate={rate} showCategories={showCategories} introductions={introductions} emptyMessage={products.length ? `Your products start in year ${Math.min(...products.map(product => product.startYear))}.` : 'Add a product to begin.'} /></Suspense>
            {showCategories && <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>}
          </>}
          <details className="rs-year-revenue"><summary>Revenue by year<ChevronDown size={16} aria-hidden="true" /></summary><table><caption>Annual revenue and running total, before costs</caption><thead><tr><th scope="col">Year</th><th scope="col">This year (RM)</th><th scope="col">Total (RM)</th></tr></thead><tbody>{Array.from({ length: Math.ceil(months / 12) }, (_, index) => { const end = Math.min(months, (index + 1) * 12); const at = (month: number) => projection.categories.reduce((sum, group) => sum + group.cumulative[month], 0); return <tr key={index}><th scope="row">{index + 1}{end % 12 > 0 ? ` (${end % 12} mo)` : ''}</th><td>{formatRinggit(at(end) - at(index * 12))}</td><td>{formatRinggit(at(end))}</td></tr>; })}</tbody></table></details>
        </div>
        <div className="rs-editor">
          <div id="rs-settings-panel" className="rs-plan-panel rs-settings-panel" role="region" aria-label="Plan settings" tabIndex={-1}>{scenarioControls}</div>
          <div id="rs-plan-panel" className="rs-plan-panel rs-story-plan-basket" role="region" aria-label="Products in your plan" tabIndex={-1}>
            <h2>Your basket by start year</h2><p className="rs-muted">Malaysia ABO prices · Apr 2026 · Tap a product to edit its timing.</p>{planBasket}
          </div>
          <div className="rs-plan-panel rs-assumptions-panel">{assumptions}</div>
        </div>
      </div>
    </>}
    <div className={`rs-mobile-summary${!isPlan ? ' rs-story-dock' : ''}`}>{!isPlan ? <><div className="rs-mobile-summary-copy"><p><span>RM </span>{formatTotal(annualRevenue)}</p><span>Year {year} · before costs</span></div><button type="button" onClick={() => goToStep(step + 1)}>{['Next: year 2', 'Next: year 3', 'My 20-year plan'][step]}<ArrowRight size={18} aria-hidden="true" /></button></> : <><div className="rs-mobile-summary-copy"><span>{durationLabel(months)}</span><p><span>RM </span>{formatTotal(projection.total)}</p><span>Revenue before costs</span></div><button type="button" onClick={showProjection}>See the chart<ArrowRight size={18} aria-hidden="true" /></button></>}</div>
    <ProductSheet product={editing} cycleLabel={cycleLabel} startYears={isPlan ? startYears : undefined} fixedStart={editing?.id === firstId} canRemove={!!editing && (isPlan || editing.startYear === year && year > 1)} showSource={showSource} onInterval={(id, every) => setIntervals(previous => ({ ...previous, [id]: every }))} onStartYear={changeStartYear} onRemove={id => { toggleProduct(id); setEditingId(null); }} onClose={() => setEditingId(null)} />
    <ProductPicker open={pickerOpen} mode={pickerMode} catalog={isPlan || pickerMode === 'first' ? catalog : catalog.filter(product => product.startYear <= year || !selectedIds.includes(product.id))} selectedIds={selectedIds} firstId={firstId} startYear={year} lockedIds={!isPlan ? continuing.map(product => product.id) : []} showSource={showSource} onClose={() => setPickerOpen(false)} onToggle={toggleProduct} onChooseFirst={chooseFirst} />
  </section>;
}
