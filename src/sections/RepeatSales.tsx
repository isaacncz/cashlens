import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowDown, ChevronDown, RotateCcw, Search, ShoppingBasket } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import type { ProductCategory } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, DEFAULT_REPEAT_RATE, MAX_CUSTOMERS, MAX_MONTHS, NEW_CUSTOMERS_PER_YEAR, projectRepeatSales, PURCHASE_INTERVALS } from '../lib/repeatSales';
import type { Projection, PurchaseModel } from '../lib/repeatSales';
import { getHeaderOffset } from '../lib/pageNavigation';
import './RepeatSales.css';

const categories: ProductCategory[] = ['Personal care', 'Home care', 'Nutrition', 'Filters', 'Appliances'];
const presets = [1, 12, 60, 120, 300, 600];
const initialIds = repeatSalesProducts.filter(product => product.checked).map(product => product.id);
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : interval === 12 ? 'Every year' : `Every ${durationLabel(interval)}`;
const rangeStyle = (percentage: number): CSSProperties => ({ '--range-fill': `${percentage}%` } as CSSProperties);
const shortMoney = (value: number) => new Intl.NumberFormat('en-MY', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

function RevenueChart({ projection, months, model, rate }: { projection: Projection; months: number; model: PurchaseModel; rate: number }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(660);
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(Math.max(240, Math.round(entry.contentRect.width)));
    });
    observer.observe(chart);
    return () => observer.disconnect();
  }, []);
  const compact = width < 480;
  const height = compact ? 210 : 270, left = compact ? 48 : 58, right = 10, top = 20, bottom = 32;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(projection.total, 1)));
  const maximum = Math.ceil(Math.max(projection.total, 1) / magnitude * 2) / 2 * magnitude;
  const y = (value: number) => top + plotHeight - plotHeight * value / maximum;
  const steps = Math.min(months, 100);
  const tickCount = Math.min(months + 1, compact ? 4 : 6);
  const sampleMonths = Array.from({ length: steps + 1 }, (_, index) => Math.round(months * index / steps));
  const areas = projection.categories.map((group, groupIndex) => {
    const lower = sampleMonths.map(month => projection.categories.slice(0, groupIndex).reduce((sum, previous) => sum + previous.cumulative[month], 0));
    const cumulative = sampleMonths.map((month, index) => lower[index] + group.cumulative[month]);
    const upper = cumulative.map((value, index) => `${left + plotWidth * sampleMonths[index] / months},${y(value)}`);
    const under = lower.map((value, index) => `${left + plotWidth * sampleMonths[index] / months},${y(value)}`).reverse();
    return { ...group, area: `M${upper.join(' L')} L${under.join(' L')} Z`, line: `M${upper.join(' L')}` };
  });
  return (
    <div className="rs-chart-wrap" ref={chartRef}>
      <svg className="rs-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="repeat-chart-title repeat-chart-description">
        <title id="repeat-chart-title">Cumulative sales revenue over {durationLabel(months)}</title>
        <desc id="repeat-chart-description">Stacked revenue by product category using Malaysia ABO prices (AP). Total RM{formatRinggit(projection.total)}. The customer count starts at {projection.startingCustomers} and reaches {projection.customersAtEnd} total joined. Values reflect purchase intervals and {model === 'repeat-purchases' ? `${rate}% repeat purchasing each cycle` : `${rate}% annual retention of each joining group`}.</desc>
        {[0, 1, 2, 3, 4].map(index => {
          const value = maximum * index / 4;
          return <g key={index}><line x1={left} y1={y(value)} x2={width - right} y2={y(value)} className="rs-gridline" /><text x={left - 10} y={y(value) + 4} textAnchor="end">{shortMoney(value)}</text></g>;
        })}
        {areas.map(group => <g key={group.name}><path d={group.area} fill={group.color} fillOpacity=".22" /><path d={group.line} fill="none" stroke={group.color} strokeWidth="2" strokeLinejoin="round" /></g>)}
        {Array.from({ length: tickCount }, (_, index) => {
          const fraction = index / (tickCount - 1), month = Math.round(months * fraction);
          const label = month === 0 ? 'Today' : months < 60 ? `${month}m` : `${Number((month / 12).toFixed(1))}y`;
          return <text key={index} x={left + plotWidth * fraction} y={height - 10} textAnchor={index === 0 ? 'start' : index === tickCount - 1 ? 'end' : 'middle'}>{label}</text>;
        })}
      </svg>
      {projection.categories.length === 0 && <div className="rs-empty"><ShoppingBasket aria-hidden="true" size={28} /><p>Tick a product to begin.</p></div>}
    </div>
  );
}

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
  const summaryRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [lastProductId, setLastProductId] = useState<string | null>(null);
  const catalog = useMemo(() => repeatSalesProducts.map(product => ({ ...product, every: intervals[product.id] ?? product.every })), [intervals]);
  const selected = useMemo(() => catalog.filter(product => selectedIds.includes(product.id)), [catalog, selectedIds]);
  const projection = useMemo(() => projectRepeatSales(selected, months, customers, rate, purchaseModel, addCustomerEachYear), [selected, months, customers, rate, purchaseModel, addCustomerEachYear]);
  const query = search.trim().toLowerCase();
  const visible = catalog.filter(product => (category === 'All categories' || category === product.category)
    && (!selectedOnly || selectedIds.includes(product.id))
    && (!query || `${product.name} ${product.id} ${product.size}`.toLowerCase().includes(query)));
  const collapsedCatalog = !catalogExpanded && !query && category === 'All categories' && !selectedOnly;
  const mobileProductCount = collapsedCatalog ? Math.min(6, visible.length) : visible.length;
  const focusProduct = catalog.find(product => product.id === lastProductId) ?? selected[selected.length - 1];
  const focusRevenue = focusProduct ? projectRepeatSales([focusProduct], months, customers, rate, purchaseModel, addCustomerEachYear).total : 0;
  const isRemoved = focusProduct && !selectedIds.includes(focusProduct.id);
  const customerLabel = projection.customersAtEnd === customers ? `${customers} ${customers === 1 ? 'customer' : 'customers'}` : `${customers} starting, ${projection.customersAtEnd} total customers`;

  useEffect(() => {
    const target = projectionRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      setProjectionInView(entry.isIntersecting);
      // The jump control must not retain focus when its sticky summary hides.
      if (entry.isIntersecting && summaryRef.current?.contains(document.activeElement)) {
        target.focus({ preventScroll: true });
      }
    }, { rootMargin: '0px 0px -35% 0px', threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const viewProjection = () => {
    const target = projectionRef.current;
    if (target) {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(), behavior: 'instant' });
      target.focus({ preventScroll: true });
    }
  };

  const toggleProduct = (id: string) => {
    setSelectedIds(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
    setLastProductId(id);
  };
  const changeCustomers = (value: number) => {
    const next = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(value) ? value : 1)));
    setCustomers(next);
    setCustomerInput(String(next));
  };
  const reset = () => {
    setSelectedIds(initialIds); setIntervals({}); setMonths(MAX_MONTHS); changeCustomers(1);
    setRate(DEFAULT_REPEAT_RATE); setPurchaseModel('repeat-purchases'); setAddCustomerEachYear(true); setSearch(''); setCategory('All categories'); setSelectedOnly(false); setCatalogExpanded(false); setShowPricingDetails(false); setLastProductId(null);
  };

  return (
    <section id="repeat-sales" className="repeat-sales" aria-labelledby="repeat-sales-heading">
      <div className="rs-container">
        <div className="rs-intro"><h1 id="repeat-sales-heading">Repeat sales</h1><p>Tick products. Watch revenue grow.</p></div>
        <div ref={summaryRef} className={`rs-mobile-summary${projectionInView ? ' rs-summary-hidden' : ''}`} aria-hidden={projectionInView}>
          <div className="rs-mobile-summary-copy">
            <span>{selected.length} {selected.length === 1 ? 'product' : 'products'} · {durationLabel(months)}</span>
            <p><span>RM</span>{formatRinggit(projection.total)}</p>
            <span className="rs-summary-caption">Revenue before costs</span>
          </div>
          <button type="button" aria-label="View projection" title="View projection" tabIndex={projectionInView ? -1 : 0} onClick={viewProjection}><ArrowDown size={19} aria-hidden="true" /></button>
        </div>
        <div className="rs-workspace">
          <div className="rs-basket">
            <div className="rs-basket-heading"><div><h2>Your basket</h2><p className="rs-muted">Malaysia ABO · Apr 2026</p></div><button type="button" className="rs-text-button" onClick={reset}><RotateCcw size={13} aria-hidden="true" />Reset</button></div>
            <div className="rs-catalog-tools"><div className="rs-search"><Search size={15} aria-hidden="true" /><input type="search" aria-label="Find a product" placeholder="Find a product…" value={search} onChange={event => setSearch(event.target.value)} /></div></div><details className="rs-catalog-details"><summary>Filters &amp; source<ChevronDown size={16} aria-hidden="true" /></summary><select aria-label="Filter product category" value={category} onChange={event => setCategory(event.target.value)}><option>All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</select>
            <div className="rs-basket-actions"><button className="rs-text-button rs-filter-toggle" type="button" aria-pressed={selectedOnly} onClick={() => setSelectedOnly(value => !value)}>{selectedOnly ? 'Show all products' : `Show selected (${selected.length})`}</button><button className="rs-text-button" type="button" disabled={selected.length === 0} onClick={() => { setSelectedIds([]); setLastProductId(null); }}>Clear basket</button></div>
            <div className="rs-catalog-options">
              <p className="rs-muted" title="Sorted by ABO price"><span className="rs-count-desktop">Showing {visible.length} of 28</span><span className="rs-count-mobile">Showing {mobileProductCount} of 28</span></p>
              <button type="button" className="rs-text-button" aria-pressed={showPricingDetails} onClick={() => setShowPricingDetails(value => !value)}>{showPricingDetails ? 'Hide source details' : 'Show source details'}</button>
            </div>
            </details>
            <div className="rs-products" data-lenis-prevent tabIndex={0} role="region" aria-label="Product catalog, scroll for more products">
              {visible.map((product, index) => {
                const checked = selectedIds.includes(product.id);
                return <div key={product.id} className={`rs-product${checked ? ' rs-product-selected' : ''}${index >= 6 && collapsedCatalog ? ' rs-product-extra' : ''}`}>
                  <input id={`rs-pick-${product.id}`} type="checkbox" checked={checked} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.name}, ${product.size}`} />
                  <div className="rs-product-copy"><label htmlFor={`rs-pick-${product.id}`}>{product.name}<span className="rs-product-meta">{product.size}{showPricingDetails && <> · {product.id} · p.{product.page}</>}</span></label><select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => { setIntervals(previous => ({ ...previous, [product.id]: Number(event.target.value) })); setLastProductId(product.id); }}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select>{product.type === 'filter' && product.every > 0 && <span className="rs-product-meta">First replacement after interval</span>}</div>
                  <label className="rs-product-price" htmlFor={`rs-pick-${product.id}`}><strong>RM{formatRinggit(product.aboPrice)}</strong><span>ABO</span></label>
                </div>;
              })}
              {!visible.length && <p className="rs-no-results">No matching products. Try another name or category, or show all products.</p>}
            </div>
            {!query && category === 'All categories' && !selectedOnly && <button className="rs-expand-products" type="button" aria-expanded={catalogExpanded} onClick={() => setCatalogExpanded(value => !value)}>{catalogExpanded ? 'Show fewer products' : 'Browse all 28 products'}</button>}
            <div className="rs-customer-control"><div className="rs-label-line"><label htmlFor="rs-customers">Starting customers</label><input id="rs-customers" type="number" min="1" max={MAX_CUSTOMERS} step="1" inputMode="numeric" value={customerInput} onChange={event => { const value = event.target.value; setCustomerInput(value); const number = Number(value); if (value !== '' && Number.isInteger(number) && number >= 1 && number <= MAX_CUSTOMERS) setCustomers(number); }} onBlur={() => changeCustomers(Number(customerInput))} onKeyDown={event => { if (event.key === 'Enter') changeCustomers(Number(customerInput)); }} /></div><input className="rs-range" type="range" aria-label="Starting customers, maximum 20" style={rangeStyle((customers - 1) / (MAX_CUSTOMERS - 1) * 100)} min="1" max={MAX_CUSTOMERS} value={customers} onChange={event => changeCustomers(Number(event.target.value))} /><div className="rs-range-ends"><span>1 customer</span><span>{MAX_CUSTOMERS} customers maximum</span></div><label className="rs-growth-option" htmlFor="rs-add-customers"><input id="rs-add-customers" type="checkbox" checked={addCustomerEachYear} onChange={event => setAddCustomerEachYear(event.target.checked)} /><span>Add {NEW_CUSTOMERS_PER_YEAR} customer each year</span></label><p className="rs-customer-growth">{addCustomerEachYear ? customers === MAX_CUSTOMERS ? '20-customer limit reached.' : 'Up to 20 total. Each starts their own buying cycle.' : 'Fixed starting group.'}</p></div>
          </div>
          <div className="rs-result" id="rs-projection" ref={projectionRef} tabIndex={-1} aria-label="Revenue projection">
            <div className="rs-result-top"><h2>Total revenue</h2><span>Over {durationLabel(months)}</span></div>
            <p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM</span>{formatRinggit(projection.total)}</p>
            <p className="rs-context">{customerLabel} · {selected.length} {selected.length === 1 ? 'product' : 'products'} · ABO prices · before costs</p>
            <p className="rs-scenario-caption">{rate}% {purchaseModel === 'repeat-purchases' ? 'repeat purchases each cycle' : 'annual retention per joining group'}</p>
            <RevenueChart projection={projection} months={months} model={purchaseModel} rate={rate} />
            <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>
            <div className="rs-time-controls"><div className="rs-label-line"><label htmlFor="rs-months">Duration</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" style={rangeStyle((months - 1) / (MAX_MONTHS - 1) * 100)} type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div><div className="rs-presets" aria-label="Projection duration">{presets.map(preset => <button key={preset} type="button" aria-pressed={months === preset} onClick={() => setMonths(preset)}>{durationLabel(preset)}</button>)}</div></div>
            <p className="rs-insight" role="status">{!selected.length ? 'Tick a product to begin.' : focusProduct ? <>{isRemoved ? 'Removed' : 'Selected'}: {focusProduct.name} · <strong>RM{formatRinggit(focusRevenue)}</strong>{isRemoved ? ' less' : ' total'}</> : null}</p>
            <details className="rs-retention"><summary>Repeat settings <span>{rate}% · {purchaseModel === 'repeat-purchases' ? 'per cycle' : 'annual retention'}</span><ChevronDown size={16} aria-hidden="true" /></summary>
              <div className="rs-monthly"><span>Monthly basket / customer<br /><small>Before repeat rate</small></span><strong>RM{formatRinggit(projection.recurringMonthly / customers)}</strong></div>
              <fieldset className="rs-model-selector">
                <legend>Purchase model</legend>
                <div>{([['repeat-purchases', 'Repeat purchases'], ['annual-attrition', 'Annual attrition']] as const).map(([value, label]) => <label key={value} data-selected={purchaseModel === value}><input type="radio" name="purchase-model" value={value} checked={purchaseModel === value} onChange={() => setPurchaseModel(value)} /><span>{label}</span></label>)}</div>
              </fieldset>
              <div className="rs-label-line"><label htmlFor="rs-repeat-rate">{purchaseModel === 'repeat-purchases' ? 'Repeat purchase rate' : 'Annual customer retention'}</label><strong>{rate}%</strong></div>
              <input id="rs-repeat-rate" className="rs-range" style={rangeStyle(rate)} type="range" min="0" max="100" value={rate} aria-valuetext={purchaseModel === 'repeat-purchases' ? `${rate}% expected to buy each repeat cycle` : `${rate}% of remaining customers return each year`} onChange={event => setRate(Number(event.target.value))} />
              <div className="rs-range-ends"><span>{purchaseModel === 'repeat-purchases' ? '0% buy again' : '0% return next year'}</span><span>{purchaseModel === 'repeat-purchases' ? '100% buy again' : '100% stay'}</span></div>
              <p className="rs-muted">{purchaseModel === 'repeat-purchases' ? 'First purchase in full; repeat cycles use the rate above.' : `${rate}% of each joining group’s remaining customers return each year.`}</p>
            </details>
          </div>
        </div>
        <div className="rs-below"><details className="rs-assumptions"><summary>Prices & assumptions</summary><p>Malaysia ABO prices (the AP column) are transcribed from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Turn on “Show source details” to see each product’s SKU and source page. All displayed prices, monthly values, chart values, and totals use the Malaysia AP column. Actual selling prices can differ.</p><p>Purchase intervals are editable scenario assumptions, not product usage advice. Consumables are purchased at the start, then at the chosen interval. Appliances default to one purchase. Filters start after one replacement interval, avoiding an additional charge for a filter included with a new appliance. Follow product instructions and indicators for actual replacement timing.</p><p>Prices stay fixed, with no inflation or reinvestment. When “Add 1 customer each year” is checked, one customer joins at the start of each year after the first, up to 20 total customers introduced. Uncheck it to keep the starting group fixed. Each new customer starts its own purchase and filter-replacement schedule. The default scenario applies the repeat-purchase rate to each later buying cycle, not as repeated annual customer loss. The optional annual-attrition stress test applies retention to each joining group’s remaining customers based on its own age. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><p>Repeat sales accumulate, and adding customers increases the repeat-sales base. Reinvestment returns are not assumed.</p></details></div>
      </div>
    </section>
  );
}
