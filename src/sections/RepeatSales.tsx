import { useMemo, useState } from 'react';
import { RotateCcw, Search, ShoppingBasket, TrendingUp } from 'lucide-react';
import { repeatSalesProducts } from '../data/repeatSalesProducts';
import type { ProductCategory } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, DEFAULT_RETENTION, MAX_CUSTOMERS, MAX_MONTHS, projectRepeatSales, PURCHASE_INTERVALS } from '../lib/repeatSales';
import type { Projection } from '../lib/repeatSales';
import './RepeatSales.css';

const categories: ProductCategory[] = ['Personal care', 'Home care', 'Nutrition', 'Filters', 'Appliances'];
const presets = [1, 12, 60, 120, 300, 600];
const initialIds = repeatSalesProducts.filter(product => product.checked).map(product => product.id);
const cycleLabel = (interval: number) => interval === 0 ? 'One-time purchase' : interval === 1 ? 'Every month' : `Every ${durationLabel(interval)}`;
const shortMoney = (value: number) => new Intl.NumberFormat('en-MY', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

function RevenueChart({ projection, months }: { projection: Projection; months: number }) {
  const width = 660, height = 270, left = 58, right = 20, top = 24, bottom = 35;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(projection.total, 1)));
  const maximum = Math.ceil(Math.max(projection.total, 1) / magnitude * 2) / 2 * magnitude;
  const y = (value: number) => top + plotHeight - plotHeight * value / maximum;
  const steps = Math.min(months, 100);
  const tickCount = months === 1 ? 2 : 6;
  const sampleMonths = Array.from({ length: steps + 1 }, (_, index) => Math.round(months * index / steps));
  const areas = projection.categories.map((group, groupIndex) => {
    const lower = sampleMonths.map(month => projection.categories.slice(0, groupIndex).reduce((sum, previous) => sum + previous.cumulative[month], 0));
    const cumulative = sampleMonths.map((month, index) => lower[index] + group.cumulative[month]);
    const upper = cumulative.map((value, index) => `${left + plotWidth * sampleMonths[index] / months},${y(value)}`);
    const under = lower.map((value, index) => `${left + plotWidth * sampleMonths[index] / months},${y(value)}`).reverse();
    return { ...group, area: `M${upper.join(' L')} L${under.join(' L')} Z`, line: `M${upper.join(' L')}` };
  });
  return (
    <div className="rs-chart-wrap">
      <svg className="rs-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="repeat-chart-title repeat-chart-description">
        <title id="repeat-chart-title">Cumulative sales revenue over {durationLabel(months)}</title>
        <desc id="repeat-chart-description">Stacked revenue by product category. Total RM{formatRinggit(projection.total)}. Values reflect purchase intervals and annual retention.</desc>
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
      {projection.categories.length === 0 && <div className="rs-empty"><ShoppingBasket aria-hidden="true" size={28} /><p>Your basket is empty.<br />Tick a product to start the story.</p></div>}
    </div>
  );
}

export default function RepeatSales() {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [intervals, setIntervals] = useState<Record<string, number>>({});
  const [months, setMonths] = useState(MAX_MONTHS);
  const [customers, setCustomers] = useState(1);
  const [customerInput, setCustomerInput] = useState('1');
  const [retention, setRetention] = useState(DEFAULT_RETENTION);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [catalogExpanded, setCatalogExpanded] = useState(false);
  const [showPricingDetails, setShowPricingDetails] = useState(false);
  const [lastProductId, setLastProductId] = useState<string | null>(null);
  const catalog = useMemo(() => repeatSalesProducts.map(product => ({ ...product, every: intervals[product.id] ?? product.every })), [intervals]);
  const selected = useMemo(() => catalog.filter(product => selectedIds.includes(product.id)), [catalog, selectedIds]);
  const projection = useMemo(() => projectRepeatSales(selected, months, customers, retention), [selected, months, customers, retention]);
  const query = search.trim().toLowerCase();
  const visible = catalog.filter(product => (category === 'All categories' || category === product.category)
    && (!selectedOnly || selectedIds.includes(product.id))
    && (!query || `${product.name} ${product.id} ${product.size}`.toLowerCase().includes(query)));
  const focusProduct = catalog.find(product => product.id === lastProductId) ?? selected[selected.length - 1];
  const focusRevenue = focusProduct ? projectRepeatSales([focusProduct], months, customers, retention).total : 0;
  const isRemoved = focusProduct && !selectedIds.includes(focusProduct.id);
  const monthlyPerCustomer = projection.recurringMonthly / customers;

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
    setRetention(DEFAULT_RETENTION); setSearch(''); setCategory('All categories'); setSelectedOnly(false); setCatalogExpanded(false); setShowPricingDetails(false); setLastProductId(null);
  };

  return (
    <section id="repeat-sales" className="repeat-sales" aria-labelledby="repeat-sales-heading">
      <div className="rs-container">
        <div className="rs-intro">
          <div><h1 id="repeat-sales-heading">Everyday products.<br /><em>Decades of possibility.</em></h1><p className="rs-lesson-name">The Power of Repeat Sales</p></div>
          <p>Choose everyday products. See what repeat purchases could generate over months, years, and decades.</p>
        </div>
        <div className="rs-mobile-summary">
          <div><span>{selected.length} products · {durationLabel(months)}</span><button type="button" onClick={() => document.getElementById('rs-projection')?.scrollIntoView({ behavior: 'instant', block: 'start' })}>View projection</button></div>
          <p><span>RM</span>{formatRinggit(projection.total)}</p>
          <span className="rs-summary-caption">Estimated revenue · {customers.toLocaleString('en-MY')} {customers === 1 ? 'customer' : 'customers'}</span>
        </div>
        <div className="rs-workspace">
          <div className="rs-basket">
            <div className="rs-basket-heading"><div><h3>Build a repeat basket</h3><p className="rs-muted">28 products · Retail prices in RM</p></div><button type="button" className="rs-text-button" onClick={reset}><RotateCcw size={13} aria-hidden="true" />Reset</button></div>
            <div className="rs-catalog-tools"><div className="rs-search"><Search size={15} aria-hidden="true" /><input type="search" aria-label="Find a product" placeholder="Find a product…" value={search} onChange={event => setSearch(event.target.value)} /></div><select aria-label="Filter product category" value={category} onChange={event => setCategory(event.target.value)}><option>All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</select></div>
            <div className="rs-basket-actions"><button className="rs-text-button" type="button" aria-pressed={selectedOnly} onClick={() => setSelectedOnly(value => !value)}>{selectedOnly ? 'Show all products' : `Show selected (${selected.length})`}</button><button className="rs-text-button" type="button" disabled={selected.length === 0} onClick={() => { setSelectedIds([]); setLastProductId(null); }}>Clear basket</button></div>
            <div className="rs-catalog-options"><span className="rs-muted">Malaysia · Apr 2026</span><button type="button" className="rs-text-button" aria-pressed={showPricingDetails} onClick={() => setShowPricingDetails(value => !value)}>{showPricingDetails ? 'Hide price details' : 'Show price details'}</button></div>
            <p className="rs-muted">Showing {visible.length} of 28 · sorted by retail price</p>
            <div className="rs-products" data-lenis-prevent tabIndex={0} role="region" aria-label="Product catalog, scroll for more products">
              {visible.map((product, index) => {
                const checked = selectedIds.includes(product.id);
                return <div key={product.id} className={`rs-product${checked ? ' rs-product-selected' : ''}${index >= 6 && !catalogExpanded && !query && category === 'All categories' && !selectedOnly ? ' rs-product-extra' : ''}`}>
                  <input id={`rs-pick-${product.id}`} type="checkbox" checked={checked} onChange={() => toggleProduct(product.id)} aria-label={`Select ${product.name}, ${product.size}`} />
                  <div className="rs-product-copy"><label htmlFor={`rs-pick-${product.id}`}>{product.name}</label><span className="rs-product-meta">{product.size}{showPricingDetails && <> · {product.id} · p.{product.page}</>}</span><select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => { setIntervals(previous => ({ ...previous, [product.id]: Number(event.target.value) })); setLastProductId(product.id); }}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select>{product.type === 'filter' && product.every > 0 && <span className="rs-product-meta">First replacement after interval</span>}</div>
                  <div className="rs-product-price" style={{ color: product.color }}><strong>RM{formatRinggit(product.price)}</strong><span>per pack</span>{showPricingDetails && <span>AP RM{formatRinggit(product.ap)}</span>}</div>
                </div>;
              })}
              {!visible.length && <p className="rs-no-results">No matching products. Try another name or category, or show all products.</p>}
            </div>
            {!query && category === 'All categories' && !selectedOnly && <button className="rs-expand-products" type="button" aria-expanded={catalogExpanded} onClick={() => setCatalogExpanded(value => !value)}>{catalogExpanded ? 'Show fewer products' : 'Browse all 28 products'}</button>}
            <p className="rs-muted rs-catalog-note">Prices per pack. Purchase cycles are editable examples. Choose products suited to your customer.</p>
            <div className="rs-monthly"><span>Recurring monthly average<br /><small>Per customer, before retention</small></span><strong>RM{formatRinggit(monthlyPerCustomer)}</strong></div>
            <div className="rs-customer-control"><div className="rs-label-line"><label htmlFor="rs-customers">Starting customers</label><input id="rs-customers" type="number" min="1" max={MAX_CUSTOMERS} step="1" inputMode="numeric" value={customerInput} onChange={event => { const value = event.target.value; setCustomerInput(value); const number = Number(value); if (value !== '' && Number.isInteger(number) && number >= 1 && number <= MAX_CUSTOMERS) setCustomers(number); }} onBlur={() => changeCustomers(Number(customerInput))} onKeyDown={event => { if (event.key === 'Enter') changeCustomers(Number(customerInput)); }} /></div><input className="rs-range" type="range" aria-label="Starting customers, maximum 20" min="1" max={MAX_CUSTOMERS} value={customers} onChange={event => changeCustomers(Number(event.target.value))} /><div className="rs-range-ends"><span>1 customer</span><span>{MAX_CUSTOMERS} customers maximum</span></div></div>
          </div>
          <div className="rs-result" id="rs-projection">
            <div className="rs-result-top"><h3>Estimated cumulative revenue</h3><span>Over {durationLabel(months)}</span></div>
            <p className="rs-revenue" aria-live="polite" aria-atomic="true"><span>RM</span>{formatRinggit(projection.total)}</p>
            <p className="rs-context">{customers.toLocaleString('en-MY')} starting {customers === 1 ? 'customer' : 'customers'} · {selected.length} {selected.length === 1 ? 'product' : 'products'} · RP sales before costs</p>
            <RevenueChart projection={projection} months={months} />
            <div className="rs-legend">{projection.categories.map(group => <span key={group.name}><i style={{ backgroundColor: group.color }} aria-hidden="true" />{group.name}</span>)}</div>
            <div className="rs-time-controls"><div className="rs-label-line"><label htmlFor="rs-months">Let time do its work</label><strong>{durationLabel(months)}</strong></div><input id="rs-months" className="rs-range" type="range" min="1" max={MAX_MONTHS} value={months} aria-valuetext={durationLabel(months)} onChange={event => setMonths(Number(event.target.value))} /><div className="rs-range-ends"><span>1 month</span><span>50 years</span></div><div className="rs-presets" aria-label="Projection duration">{presets.map(preset => <button key={preset} type="button" aria-pressed={months === preset} onClick={() => setMonths(preset)}>{durationLabel(preset)}</button>)}</div></div>
            <p className="rs-insight" role="status">{!selected.length ? 'Every repeat sale starts with a product. Choose one to begin.' : focusProduct ? <>{isRemoved ? `Removing ${focusProduct.name} reduces this scenario by ` : `${focusProduct.name} alone contributes `}<strong>RM{formatRinggit(focusRevenue)}</strong> over {durationLabel(months)}. {focusProduct.every === 0 ? 'One purchase, counted once.' : focusProduct.type === 'filter' ? 'Replacement revenue begins after its first interval.' : 'Same customer group. Repeat purchases.'}</> : null}</p>
            <div className="rs-retention"><div className="rs-label-line"><label htmlFor="rs-retention">Annual customer retention</label><strong>{retention}%</strong></div><input id="rs-retention" className="rs-range" type="range" min="0" max="100" value={retention} aria-valuetext={`${retention}% of customers return each year`} onChange={event => setRetention(Number(event.target.value))} /><div className="rs-range-ends"><span>0% return next year</span><span>100% stay</span></div><p className="rs-muted">{retention === 100 ? 'Every starting customer keeps buying for the full period. Lower retention to see the difference.' : `${retention}% of the previous year’s customers return each year. No new customers are added; fractional customers represent an expected average.`}</p></div>
          </div>
        </div>
        <div className="rs-below"><div className="rs-lesson-note"><TrendingUp size={23} aria-hidden="true" /><h3>A small basket can go a long way.</h3><p>More products increase basket value. Repeat purchases extend customer value. Keeping customers is what connects the two.</p></div><details className="rs-assumptions"><summary>Prices, purchase cycles, and how this model works</summary><p>Malaysia AP (ABO purchase price) and RP (retail price) are transcribed from <cite>ABO Price List SA13, April 2026</cite>, pages 2 and 8–11. Turn on “Show price details” to see each product’s AP, SKU, and source page. Revenue uses RP; AP is shown for comparison. Actual selling prices can differ.</p><p>Purchase intervals are editable scenario assumptions, not product usage advice. Consumables are purchased at the start, then at the chosen interval. Appliances default to one purchase. Filters start after one replacement interval, avoiding an additional charge for a filter included with a new appliance. Follow product instructions and indicators for actual replacement timing.</p><p>Prices stay fixed, with no inflation, new customers, or reinvestment. Retention applies annually to the original customer group. Revenue is before costs and is not profit. A 50-year scenario explores assumptions; it is not a forecast.</p><p>Repeat sales accumulate. Compounding would also require growth, such as reinvesting profit to acquire more customers.</p></details></div>
      </div>
    </section>
  );
}
