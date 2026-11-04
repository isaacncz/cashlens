import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { formatRinggit } from '../lib/repeatSales';
import type { YearLayer } from '../lib/repeatSales';

const wholeMoney = (value: number) => new Intl.NumberFormat('en-MY', { maximumFractionDigits: 0 }).format(value);
const shortMoney = (value: number) => new Intl.NumberFormat('en-MY', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
/** A round gridline step (1, 2, 2.5 or 5 × 10ⁿ) with at most four steps. */
const niceStep = (value: number) => {
  const raw = Math.max(value, 1) / 4, magnitude = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 2.5, 5, 10].find(step => step * magnitude >= raw) ?? 10) * magnitude;
};
/** Labels every year when there are few bars, otherwise year 1 and every fifth year. */
const yearTicks = (count: number) => count <= 6 ? Array.from({ length: count }, (_, index) => index + 1)
  : [1, ...Array.from({ length: Math.floor(count / 5) }, (_, index) => (index + 1) * 5)].filter((year, index, all) => year <= count && all.indexOf(year) === index);

interface LayerChartProps {
  layers: YearLayer[];
  /** Years after this are drawn faint: not reached yet in the story. */
  reached: number;
  current?: number;
  variant: 'story' | 'plan';
  label: string;
}

export default function LayerChart({ layers, reached, current, variant, label }: LayerChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(variant === 'story' ? 320 : 600);
  const [inspected, setInspected] = useState<number | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => { if (entry.contentRect.width > 0) setWidth(Math.max(220, Math.round(entry.contentRect.width))); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const story = variant === 'story';
  const height = story ? 132 : width < 480 ? 200 : 250;
  const left = story ? 4 : width < 480 ? 40 : 48, right = 4, top = story ? 22 : 12, bottom = 24;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const peak = Math.max(1, ...layers.map(layer => layer.original + layer.added)), step = niceStep(peak), maximum = Math.ceil(peak / step) * step;
  const gridValues = Array.from({ length: Math.round(maximum / step) + 1 }, (_, index) => index * step);
  const y = (value: number) => top + plotHeight - plotHeight * value / maximum;
  const slot = plotWidth / Math.max(1, layers.length), barWidth = Math.max(2, slot * (story ? .6 : .68));
  const ticks = new Set(yearTicks(layers.length));
  const selected = inspected === null ? null : layers[inspected];
  const inspect = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - box.left) * width / box.width - left) / slot);
    setInspected(Math.max(0, Math.min(layers.length - 1, index)));
  };
  return <div className="rs-layer-chart" data-variant={variant} ref={ref}>
    <div onPointerDown={story ? undefined : inspect} onPointerMove={story ? undefined : event => { if (event.buttons === 1) inspect(event); }}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
        {!story && gridValues.map(value => <g key={value}><line className="rs-gridline" x1={left} x2={width - right} y1={y(value)} y2={y(value)} /><text x={left - 8} y={y(value) + 4} textAnchor="end">{shortMoney(value)}</text></g>)}
        {layers.map((layer, index) => {
          const x = left + index * slot + (slot - barWidth) / 2, total = layer.original + layer.added, lit = layer.year <= reached;
          const radius = Math.min(3, barWidth / 4);
          return <g key={layer.year} data-year={layer.year} data-state={lit ? 'reached' : 'later'}>
            {lit ? <>
              <rect className="rs-layer-original" x={x} y={y(layer.original)} width={barWidth} height={Math.max(0, y(0) - y(layer.original))} />
              {layer.added > 0 && <rect className="rs-layer-added" x={x} y={y(total)} width={barWidth} height={Math.max(0, y(layer.original) - y(total))} rx={radius} />}
            </> : <rect className="rs-layer-later" x={x} y={y(total)} width={barWidth} height={Math.max(0, y(0) - y(total))} rx={radius} />}
            {(current === layer.year || inspected === index) && <rect className="rs-layer-focus" x={x - 2} y={y(total) - 3} width={barWidth + 4} height={Math.max(0, y(0) - y(total)) + 3} rx={radius + 1} />}
            {story && lit && <text className="rs-layer-value" x={x + barWidth / 2} y={y(total) - (current === layer.year ? 9 : 6)} textAnchor="middle">{wholeMoney(total)}</text>}
            {ticks.has(layer.year) && <text className={current === layer.year ? 'rs-layer-current' : undefined} x={x + barWidth / 2} y={height - 6} textAnchor="middle">{story ? `Year ${layer.year}` : layer.year === 1 ? 'Year 1' : layer.year}</text>}
          </g>;
        })}
      </svg>
    </div>
    {!story && <output className="rs-chart-reading" aria-live="polite">{selected ? `Year ${selected.year}${selected.months < 12 ? ` (${selected.months} mo)` : ''} · RM ${formatRinggit(selected.original + selected.added)} · starting customers RM ${formatRinggit(selected.original)} · added customers RM ${formatRinggit(selected.added)}` : 'Tap a bar to see that year'}</output>}
  </div>;
}
