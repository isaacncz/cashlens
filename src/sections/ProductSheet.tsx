import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { RepeatSalesProduct } from '../data/repeatSalesProducts';
import { durationLabel, formatRinggit, PURCHASE_INTERVALS } from '../lib/repeatSales';
import ProductImage from './ProductImage';

type Product = RepeatSalesProduct & { startYear: number };
interface ProductSheetProps {
  product: Product | null;
  cycleLabel: (interval: number) => string;
  /** Start-year choices; omitted in the guided story, where timing is fixed. */
  startYears?: readonly number[];
  fixedStart: boolean;
  canRemove: boolean;
  showSource: boolean;
  onInterval: (id: string, every: number) => void;
  onStartYear: (id: string, year: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

/** One product's timing in a native modal sheet, so the basket rows stay compact. */
export default function ProductSheet({ product, cycleLabel, startYears, fixedStart, canRemove, showSource, onInterval, onStartYear, onRemove, onClose }: ProductSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (product && !dialog.open) dialog.showModal();
    if (!product && dialog.open) dialog.close();
  }, [product]);
  return <dialog ref={dialogRef} className="rs-product-sheet" aria-labelledby="rs-sheet-title" onCancel={onClose} onClose={onClose} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
  }}>
    {product && <div className="rs-sheet-content">
      <header className="rs-sheet-header"><ProductImage id={product.id} /><div><h2 id="rs-sheet-title">Edit {product.name}</h2><p>{product.size} · RM {formatRinggit(product.aboPrice)} / pack</p></div><button className="rs-icon-button" type="button" aria-label="Close product editor" onClick={onClose}><X size={20} aria-hidden="true" /></button></header>
      <div className="rs-sheet-controls">
        <label>Buy again<select aria-label={`Purchase interval for ${product.name}, ${product.size}`} value={product.every} onChange={event => onInterval(product.id, Number(event.target.value))}>{PURCHASE_INTERVALS.map(interval => <option key={interval} value={interval}>{cycleLabel(interval)}</option>)}</select></label>
        {startYears && <label>Starts buying{fixedStart ? <span className="rs-fixed-year">Year 1 · your first product</span> : <select id={`rs-start-${product.id}`} aria-label={`Start year for ${product.name}, ${product.size}`} value={product.startYear} onChange={event => onStartYear(product.id, Number(event.target.value))}>{startYears.map(value => <option key={value} value={value}>Year {value}</option>)}</select>}</label>}
        {product.type === 'filter' && product.every > 0 && <p className="rs-muted">First replacement after {durationLabel(product.every)}.</p>}
        {showSource && <p className="rs-muted">SKU {product.id} · source p.{product.page}</p>}
      </div>
      <footer className="rs-sheet-footer">{canRemove ? <button className="rs-text-button rs-sheet-remove" type="button" onClick={() => onRemove(product.id)} aria-label={`Remove product: ${product.name}, ${product.size}`}>Remove product</button> : <span />}<button className="primary-button" type="button" onClick={onClose}>Done</button></footer>
    </div>}
  </dialog>;
}
