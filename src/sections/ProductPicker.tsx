import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, ShoppingBasket, X } from 'lucide-react';
import type { RepeatSalesProduct } from '../data/repeatSalesProducts';
import { formatRinggit } from '../lib/repeatSales';
import './ProductPicker.css';

interface ProductPickerProps {
  open: boolean;
  mode: 'first' | 'add';
  catalog: readonly RepeatSalesProduct[];
  selectedIds: readonly string[];
  firstId: string;
  total: number;
  months: number;
  showSource: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
  onChooseFirst: (id: string) => void;
}

export default function ProductPicker({ open, mode, catalog, selectedIds, firstId, showSource, onClose, onToggle, onChooseFirst }: ProductPickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All categories');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const selectedFilterRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  // A first sale is a consumable or appliance. Replacement filters remain in the full catalog.
  const available = mode === 'first' ? catalog.filter(product => product.type !== 'filter') : catalog;
  const categories = [...new Set(available.map(product => product.category))];
  const query = search.trim().toLowerCase();
  const isSelected = (id: string) => mode === 'first' ? firstId === id : selectedIds.includes(id);
  const selectedCount = available.filter(product => isSelected(product.id)).length;
  const visible = available.filter(product => (!selectedOnly || isSelected(product.id)) && (category === 'All categories' || product.category === category)
    && (!query || `${product.name} ${product.size} ${product.id}`.toLowerCase().includes(query)));
  const resetSearch = () => { setSearch(''); setCategory('All categories'); setSelectedOnly(false); };
  const keepFocusInPicker = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const targets = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = targets[0], last = targets.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return <dialog ref={dialogRef} className="rs-product-picker" aria-labelledby="rs-picker-title" aria-describedby="rs-picker-description" onKeyDown={keepFocusInPicker} onCancel={onClose} onClose={() => { onClose(); resetSearch(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
  }}>
    <div className="rs-picker-content">
      <header className="rs-picker-header"><div><h2 id="rs-picker-title">{mode === 'first' ? 'Choose a product' : 'Choose products'}</h2><p id="rs-picker-description">{mode === 'first' ? 'Select one item for your first sale.' : 'New products start in year 2.'}</p></div><button className="rs-icon-button" type="button" aria-label="Close product picker" onClick={onClose} autoFocus><X size={20} aria-hidden="true" /></button></header>
      <div className="rs-catalog-tools"><div className="rs-search"><Search size={18} aria-hidden="true" /><input type="search" aria-label="Find a product" placeholder="Search products" value={search} onChange={event => setSearch(event.target.value)} /></div><select aria-label="Filter product category" value={category} onChange={event => setCategory(event.target.value)}><option>All categories</option>{categories.map(name => <option key={name}>{name}</option>)}</select></div>
      <div className="rs-catalog-count"><div className="rs-catalog-views" role="group" aria-label="Catalog view"><button type="button" aria-pressed={!selectedOnly} onClick={() => setSelectedOnly(false)}>All products</button><button ref={selectedFilterRef} type="button" aria-pressed={selectedOnly} onClick={() => setSelectedOnly(true)}>Selected ({selectedCount})</button></div><span role="status">{visible.length} shown</span></div>
      <div className="rs-products" tabIndex={0} role="region" aria-label="Product catalog">
        {visible.map(product => {
          const checked = mode === 'first' ? firstId === product.id : selectedIds.includes(product.id);
          return <div key={product.id} className={`rs-product${checked ? ' rs-product-selected' : ''}`}>
            <label className="rs-pick-target"><input id={`rs-pick-${product.id}`} type={mode === 'first' ? 'radio' : 'checkbox'} name={mode === 'first' ? 'first-product' : undefined} checked={checked} onChange={() => { if (mode === 'first') onChooseFirst(product.id); else onToggle(product.id); if (selectedOnly && checked) requestAnimationFrame(() => selectedFilterRef.current?.focus({ preventScroll: true })); }} aria-label={`Select ${product.name}, ${product.size}`} /></label>
            <label className="rs-product-copy" htmlFor={`rs-pick-${product.id}`}>{product.name}<span className="rs-product-meta"><span>{product.size}{showSource && <> · {product.id} · p.{product.page}</>}</span><strong className="rs-product-price">RM {formatRinggit(product.aboPrice)}</strong></span></label>
          </div>;
        })}
        {!visible.length && <div className="rs-no-results"><ShoppingBasket size={24} aria-hidden="true" /><p>No matching products.</p><button className="rs-text-button" type="button" onClick={resetSearch}>Clear filters</button></div>}
      </div>
      <footer className="rs-picker-footer"><div role="status"><strong>{selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected</strong><small>{mode === 'first' ? 'One product for your first sale.' : 'Review your selected products after Done.'}</small></div><button className="primary-button" type="button" onClick={onClose}>Done</button></footer>
    </div>
  </dialog>;
}
