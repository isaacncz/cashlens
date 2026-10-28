import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Plus, RotateCcw, Search, ShoppingBasket } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import type { ProductCategory } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, DEFAULT_REPEAT_RATE, MAX_CUSTOMERS, MAX_MONTHS, NEW_CUSTOMERS_PER_YEAR, projectRepeatSales, PURCHASE_INTERVALS } from '../lib/repeatSales';
import type { PurchaseModel } from '../lib/repeatSales';
import { scrollToContent } from '../lib/pageNavigation';
import './RepeatSales.css';

const categories: ProductCategory[] = ['Personal care', 'Home care', 'Nutrition', 'Filters', 'Appliances'];
const presets = [1, 12, 60, 120, 300, 600];
const initialIds = repeatSalesProducts.filter(product => product.checked).map(product => product.id);
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : interval === 12 ? 'Every year' : `Every ${durationLabel(interval)}`;
const rangeStyle = (percentage: number): CSSProperties => ({ '--range-fill': `${percentage}%` } as CSSProperties);
const RevenueChart = lazy(() => import('./RevenueChart'));

export default function RepeatSales() {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [intervals, setIntervals] = useState<Record<string, number>>({});
  const [months, setMonths] = useState(MAX_MONTHS);
  const [customers, setCustomers] = useState(1);
  const [customerInput, setCustomerInput] = useState('1');
  const [rate, setRate] = useState(DEFAULT_REPEAT_RATE);
  const [purchaseModel, setPurchaseModel] = useState<PurchaseModel>('repeat-purchases');
  const [addCustomerEachYear, setAddCustomerEachYear] = useState(true);
  const [projectionInView, setProjectionInView] = useState(false);
  const projectionRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [activity, setActivity] = useState<{ id: string; kind: 'added' | 'removed' | 'updated' } | null>(null);
  const catalog = useMemo(() => repeatSalesProducts.map(product => ({ ...product, every: intervals[product.id] ?? product.every })), [intervals]);
  const selected = useMemo(() => catalog.filter(product => selectedIds.includes(product.id)), [catalog, selectedIds]);
  const projection = useMemo(() => projectRepeatSales(selected, months, customers, rate, purchaseModel, addCustomerEachYear), [selected, months, customers, rate, purchaseModel, addCustomerEachYear]);
  const firstOrder = useMemo(() => projectRepeatSales(selected, 1, 1, 100, 'repeat-purchases', false).total, [selected]);
  const query = search.trim().toLowerCase();
  const visible = catalog.filter(product => (category === 'All categories' || category === product.category)
    && (!selectedOnly || selectedIds.includes(product.id))
    && (!query || `${product.name} ${product.id} ${product.size}`.toLowerCase().includes(query)));
  const collapsedCatalog = !catalogExpanded && !query && category === 'All categories' && !selectedOnly;
  const mobileProductCount = collapsedCatalog ? Math.min(6, visible.length) : visible.length;
  const changedProduct = catalog.find(product => product.id === activity?.id);
  const contribution = changedProduct ? projectRepeatSales([changedProduct], months, customers, rate, purchaseModel, addCustomerEachYear).total : 0;
  const customerLabel = projection.customersAtEnd === customers ? `${customers} ${customers === 1 ? 'customer' : 'customers'}` : `${customers} starting, ${projection.customersAtEnd} total customers`;
  const invalidCustomers = customerInput === '' || Number(customerInput) < 1 || Number(customerInput) > MAX_CUSTOMERS || !Number.isInteger(Number(customerInput));

  useEffect(() => {
    const target = projectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setProjectionInView(entry.isIntersecting), {
      root: document.getElementById('main-content'), rootMargin: '0px 0px -25% 0px', threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const viewProjection = () => { if (projectionRef.current) scrollToContent(projectionRef.current); };
  const changeCustomers = (value: number) => {
    const next = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)));
    setCustomers(next); setCustomerInput(String(next));
  };
  const toggleProduct = (id: string) => {
    const removing = selectedIds.includes(id);
    setSelectedIds(previous => removing ? previous.filter(value => value !== id) : [...previous, id]);
    setActivity({ id, kind: removing ? 'removed' : 'added' });
  };
  const showCatalog = (basket: boolean) => {
    setSelectedOnly(basket); setSearch(''); setCategory('All categories');
    productsRef.current?.scrollTo({ top: 0 });
  };
  const reset = () => {
    setSelectedIds(initialIds); setIntervals({}); setMonths(MAX_MONTHS); changeCustomers(1);
    setRate(DEFAULT_REPEAT_RATE); setPurchaseModel('repeat-purchases'); setAddCustomerEachYear(true);
    setSearch(''); setCategory('All categories'); setSelectedOnly(false); setCatalogExpanded(false); setShowPricingDetails(false); setActivity(null);
    productsRef.current?.scrollTo({ top: 0 });
  };

  return <section id="repeat-sales" className="repeat-sales" aria-labelledby="repeat-sales-heading">
    <div className="rs-container">
      <header className="rs-intro"><div><h1 id="repeat-sales-heading">Repeat sales</h1><p>Build a basket. Explore its future.</p></div><button type="button" className="rs-text-button rs-reset" aria-label="Reset" title="Reset scenario" onClick={reset}><RotateCcw size={16} aria-hidden="true" />Reset</button></header>
      <div className={`rs-mobile-summary${projectionInView ? ' rs-summary-result' : ''}`}>
        <div className="rs-mobile-summary-copy"><span>{selected.length} {selected.length === 1 ? 'product' : 'products'} · {durationLabel(months)}</span>{projectionInView ? <p className="rs-edit-basket-label">Adjust your basket</p> : <p><span>RM </span>{formatRinggit(projection.total)}</p>}<span className="rs-summary-caption">{projectionInView ? customerLabel : 'Revenue before costs'}</span></div>
        <button type="button" aria-label={projectionInView ? 'Edit basket' : 'View projection'} onClick={() => { if (projectionInView) { const basket = document.getElementById('rs-basket'); if (basket) scrollToContent(basket); } else viewProjection(); }}>{projectionInView ? <ArrowUp size={20} aria-hidden="true" /> : <ArrowDown size={20} aria-hidden="true" />}</button>
      </div>
      <div className="rs-workspace">
        <div className="rs-basket" id="rs-basket" tabIndex={-1}>
          <div className="rs-basket-heading"><div><h2>Your products</h2><p className="rs-muted">Malaysia ABO prices · Apr 2026</p></div><ShoppingBasket size={22} strokeWidth={1.6} aria-hidden="true" /></div>
          <div className="rs-basket-value"><span>First order / customer</span><strong>RM {formatRinggit(firstOrder)}</strong></div>
          <div className="rs-catalog-tabs" role="group" aria-label="Product view"><button type="button" aria-pressed={!selectedOnly} onClick={() => showCatalog(false)}>All products <span>28</span></button><button type="button" aria-pressed={selectedOnly} onClick={() => showCatalog(true)}>My basket <span>{selected.length}</span></button></div>
          <div className="rs-catalog-tools"><div className="rs-search"><Search size={18} aria-hidden="true" /><input type="search" aria-label="Find a product" placeholder="Search products" value={search} onChange={event => setSearch(event.target.value)} /></div><select aria-label="Filter product category" value={category} onChange={event => setCategory(event.target.value)}><option>All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</select></div>
          <div className="rs-catalog-count"><span className="rs-count-desktop">{visible.length} {selectedOnly ? 'in your basket' : 'products · price low to high'}</span><span className="rs-count-mobile">{mobileProductCount} {selectedOnly ? 'in your basket' : 'of 28 products'}</span><span>ABO / pack</span></div>
          <div className="rs-products" ref={productsRef} tabIndex={0} role="region" aria-label="Product catalog, scroll for more products">
            {visible.map((product, index) => {
              const checked = selectedIds.includes(product.id);
              return <div key={product.id} className={`rs-product${checked ? ' rs-product-selected' : ''}${index >= 6 && collapsedCatalog ? ' rs-product-extra' : ''}`}>
                <label className="rs-pick-target"><input id={`rs-pick-${product.id}`} type="checkbox" checked={checked} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.name}, ${product.size}`} /></label>
                <div className="rs-product-copy"><label htmlFor={`rs-pick-${product.id}`}>{product.name}<span className="rs-product-meta">{product.size}{showPricingDetails && <> · {product.id} · p.{product.page}</>}</span></label>
                  {selectedOnly && <select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => { setIntervals(previous => ({ ...previous, [product.id]: Number(event.target.value) })); setActivity({ id: product.id, kind: 'updated' }); }}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select>}
                  {checked && !selectedOnly && <span className="rs-cycle-hint">{cycleLabel(product.every)}</span>}
                  {selectedOnly && product.type === 'filter' && product.every > 0 && <span className="rs-product-meta">First replacement after interval</span>}
                </div>
                <label className="rs-product-price" htmlFor={`rs-pick-${product.id}`}><strong>RM {formatRinggit(product.aboPrice)}</strong></label>
              </div>;
            })}
            {!visible.length && <div className="rs-no-results"><ShoppingBasket size={24} strokeWidth={1.6} aria-hidden="true" /><p>{selectedOnly && selected.length === 0 ? 'Your basket is empty.' : 'No matching products.'}</p><button type="button" className="rs-text-button" onClick={() => showCatalog(false)}>Browse all products</button></div>}
          </div>
          {!query && category === 'All categories' && !selectedOnly && <button className="rs-expand-products" type="button" aria-expanded={catalogExpanded} onClick={() => setCatalogExpanded(value => !value)}>{catalogExpanded ? 'Show fewer products' : 'Browse all 28 products'}</button>}
          <div className="rs-basket-footer"><span>{selected.length} selected</span><button className="rs-text-button" type="button" disabled={!selected.length} onClick={() => { setSelectedIds([]); setActivity(null); }}>Clear basket</button></div>
          <details className="rs-source"><summary>Price source<ChevronDown size={16} aria-hidden="true" /></summary><p className="rs-muted">Malaysia AP column · ABO Price List SA13, April 2026.</p><button type="button" className="rs-text-button" aria-pressed={showPricingDetails} onClick={() => setShowPricingDetails(value => !value)}>{showPricingDetails ? 'Hide source details' : 'Show source details'}</button></details>
        </div>
        <div className="rs-result" id="rs-projection" ref={projectionRef} tabIndex={-1} aria-label="Revenue projection">
          <div className="rs-result-top"><h2>Your projection</h2><select aria-label="Projection duration" value={months} onChange={event => setMonths(Number(event.target.value))}>{!presets.includes(months) && <option value={months}>{durationLabel(months)}</option>}{presets.map(preset => <option key={preset} value={preset}>{durationLabel(preset)}</option>)}</select></div>
          <p className="rs-revenue-label">Estimated revenue before costs</p>
          <p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM </span>{formatRinggit(projection.total)}</p>
          <p className="rs-context">{selected.length} {selected.length === 1 ? 'product' : 'products'} · {customerLabel} · ABO prices</p>
          <p className="rs-insight" role="status">{activity && changedProduct ? <>{activity.kind === 'removed' ? 'Removed' : activity.kind === 'updated' ? 'Updated' : 'Added'} {changedProduct.name} · <strong>{activity.kind === 'removed' ? '−' : activity.kind === 'added' ? '+' : ''}RM {formatRinggit(contribution)}</strong> over {durationLabel(months)}</> : <><Plus size={16} aria-hidden="true" />Tick a product to compare.</>}</p>
          <div className="rs-chart-heading"><h3>Revenue over time</h3><span>Cumulative · RM</span></div>
          <Suspense fallback={<div className="rs-chart-loading" role="status">Loading chart…</div>}><RevenueChart projection={projection} months={months} model={purchaseModel} rate={rate} /></Suspense>
          <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>
          <div className="rs-time-controls"><div className="rs-label-line"><label htmlFor="rs-months">Fine-tune duration</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" style={rangeStyle((months - 1) / (MAX_MONTHS - 1) * 100)} type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div></div>
          <div className="rs-scenario"><h3>Your scenario</h3><div className="rs-scenario-grid">
            <div className="rs-customer-control"><div className="rs-label-line"><label htmlFor="rs-customers">Starting customers</label><input id="rs-customers" type="number" min="1" max={MAX_CUSTOMERS} step="1" inputMode="numeric" aria-invalid={invalidCustomers} aria-describedby="rs-customer-help" value={customerInput} onChange={event => { const value = event.target.value; setCustomerInput(value); const number = Number(value); if (value !== '' && Number.isInteger(number) && number >= 1 && number <= MAX_CUSTOMERS) setCustomers(number); }} onBlur={() => changeCustomers(Number(customerInput))} onKeyDown={event => { if (event.key === 'Enter') changeCustomers(Number(customerInput)); }} /></div><input className="rs-range" type="range" aria-label="Starting customers, maximum 20" style={rangeStyle((customers - 1) / (MAX_CUSTOMERS - 1) * 100)} min="1" max={MAX_CUSTOMERS} value={customers} onChange={event => changeCustomers(Number(event.target.value))} /><div className="rs-range-ends"><span>1</span><span>20 maximum</span></div><label className="rs-growth-option" htmlFor="rs-add-customers"><input id="rs-add-customers" type="checkbox" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span>Add {NEW_CUSTOMERS_PER_YEAR} customer each year</span></label><p id="rs-customer-help" className="rs-customer-growth">{invalidCustomers ? 'Enter 1–20 customers. Values are clamped when you leave the field.' : addCustomerEachYear ? customers === MAX_CUSTOMERS ? '20-customer limit reached.' : 'Up to 20 total, each with their own buying cycle.' : 'Fixed starting group.'}</p></div>
            <div className="rs-repeat-control"><div className="rs-label-line"><label htmlFor="rs-repeat-rate">{purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate' : 'Annual customer retention'}</label><strong>{rate}%</strong></div><input id="rs-repeat-rate" className="rs-range" style={rangeStyle(rate)} type="range" min="0" max="100" value={rate} aria-valuetext={purchaseModel === 'repeat-purchases' ? `${rate}% expected to buy each repeat cycle` : `${rate}% of remaining customers return each year`} onChange={event => setRate(Number(event.target.value))} /><div className="rs-range-ends"><span>0%</span><span>100%</span></div><p className="rs-muted">{purchaseModel === 'repeat-purchases' ? 'First purchase in full. Later cycles use this rate.' : `${rate}% of each joining group’s remaining customers return each year.`}</p></div>
          </div></div>
          <details className="rs-retention"><summary>Advanced assumptions<ChevronDown size={16} aria-hidden="true" /></summary><fieldset className="rs-model-selector"><legend>Purchase model</legend><div>{([['repeat-purchases', 'Repeat purchases'], ['annual-attrition', 'Annual attrition']] as const).map(([value, label]) => <label key={value} data-selected={purchaseModel === value}><input type="radio" name="purchase-model" value={value} checked={purchaseModel === value} onChange={() => setPurchaseModel(value)} /><span>{label}</span></label>)}</div></fieldset><div className="rs-monthly"><span>Monthly basket / customer<br /><small>Before repeat rate</small></span><strong>RM {formatRinggit(projection.recurringMonthly / customers)}</strong></div></details>
        </div>
      </div>
        <div className="rs-below"><details className="rs-assumptions"><summary>Prices & assumptions</summary><p>Malaysia ABO prices (the AP column) are transcribed from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Turn on “Show source details” to see each product’s SKU and source page. All displayed prices, monthly values, chart values, and totals use the Malaysia AP column. Actual selling prices can differ.</p><p>Purchase intervals are editable scenario assumptions, not product usage advice. Consumables are purchased at the start, then at the chosen interval. Appliances default to one purchase. Filters start after one replacement interval, avoiding an additional charge for a filter included with a new appliance. Follow product instructions and indicators for actual replacement timing.</p><p>Prices stay fixed, with no inflation or reinvestment. When “Add 1 customer each year” is checked, one customer joins at the start of each year after the first, up to 20 total customers introduced. Uncheck it to keep the starting group fixed. Each new customer starts its own purchase and filter-replacement schedule. The default scenario applies the repeat-purchase rate to each later buying cycle, not as repeated annual customer loss. The optional annual-attrition stress test applies retention to each joining group’s remaining customers based on its own age. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><p>Repeat sales accumulate, and adding customers increases the repeat-sales base. Reinvestment returns are not assumed.</p></details></div>
    </div>
  </section>;
}
