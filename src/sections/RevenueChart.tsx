import { useEffect, useRef, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { durationLabel, formatRinggit } from '../lib/repeatSales';
import type { Projection, PurchaseModel } from '../lib/repeatSales';
const shortMoney = (value: number) => new Intl.NumberFormat('en-MY', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export default function RevenueChart({ projection, months, model, rate }: { projection: Projection; months: number; model: PurchaseModel; rate: number }) {
  const [inspectedMonth, setInspectedMonth] = useState<number | null>(null);
  const selectedMonth = Math.min(months, inspectedMonth ?? months);
  const inspectedTotal = projection.categories.reduce((sum, group) => sum + group.cumulative[selectedMonth], 0);
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
  const inspect = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const fraction = ((event.clientX - box.left) * width / box.width - left) / plotWidth;
    setInspectedMonth(Math.round(Math.max(0, Math.min(1, fraction)) * months));
  };
  return (
    <div className="rs-chart-wrap" ref={chartRef}>
      <div className="rs-chart-plot" onPointerDown={inspect} onPointerMove={event => { if (event.buttons === 1) inspect(event); }}>
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
        {inspectedMonth !== null && <line x1={left + plotWidth * selectedMonth / months} x2={left + plotWidth * selectedMonth / months} y1={top} y2={height - bottom} className="rs-crosshair" />}{inspectedMonth !== null && <circle cx={left + plotWidth * selectedMonth / months} cy={y(inspectedTotal)} r="4" className="rs-chart-dot" />}
      </svg>
      </div>
      <output className="rs-chart-reading" aria-live="polite">{inspectedMonth === null ? 'Tap or drag to explore' : `${selectedMonth === 0 ? 'Today' : durationLabel(selectedMonth)} · RM ${formatRinggit(inspectedTotal)}`}</output>
      <details className="rs-chart-inspect"><summary>Monthly values</summary><label className="sr-only" htmlFor="rs-chart-month">Chart month</label><input id="rs-chart-month" type="range" min="0" max={months} value={selectedMonth} aria-valuetext={`${selectedMonth === 0 ? 'Today' : durationLabel(selectedMonth)}, RM ${formatRinggit(inspectedTotal)}`} onChange={event => setInspectedMonth(Number(event.target.value))} /></details>
      {projection.categories.length === 0 && <div className="rs-empty"><ShoppingBasket aria-hidden="true" size={28} /><p>Tick a product to begin.</p></div>}
    </div>
  );
}
