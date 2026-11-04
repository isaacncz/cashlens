import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  describedBy?: string;
  onChange: (value: number) => void;
  /** Reports whether the typed text is a whole number within range. */
  onValidity?: (valid: boolean) => void;
}

/** A −/+ stepper with a typed value. Typing commits valid whole numbers; blur or Enter clamps. */
export default function Stepper({ id, label, value, min, max, describedBy, onChange, onValidity }: StepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? String(value);
  const number = Number(text);
  const valid = text !== '' && Number.isInteger(number) && number >= min && number <= max;
  const commit = (next: number) => {
    const clamped = Math.min(max, Math.max(min, Math.round(Number.isFinite(next) ? next : min)));
    setDraft(null); onValidity?.(true); onChange(clamped);
  };
  return <div className="rs-stepper">
    <button type="button" aria-label={`Decrease ${label.toLowerCase()}`} disabled={value <= min} onClick={() => commit(value - 1)}><Minus size={18} aria-hidden="true" /></button>
    <input id={id} type="number" inputMode="numeric" min={min} max={max} step="1" aria-invalid={!valid} aria-describedby={describedBy} value={text}
      onChange={event => { const next = event.target.value, parsed = Number(next); const ok = next !== '' && Number.isInteger(parsed) && parsed >= min && parsed <= max; setDraft(next); onValidity?.(ok); if (ok) onChange(parsed); }}
      onBlur={() => { if (draft !== null) commit(Number(draft)); }}
      onKeyDown={event => { if (event.key === 'Enter' && draft !== null) commit(Number(draft)); }} />
    <button type="button" aria-label={`Increase ${label.toLowerCase()}`} disabled={value >= max} onClick={() => commit(value + 1)}><Plus size={18} aria-hidden="true" /></button>
  </div>;
}
