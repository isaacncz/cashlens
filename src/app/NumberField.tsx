import { useState } from 'react';
import { numberError } from '../lib/numericInput';
export default function NumberField({ id, label, value, onChange, min = 0, max, required = false, placeholder, hint, submitted = false, inputMode = 'decimal', validationMode = 'blur' }: {
  id: string; label: string; value: string; onChange: (value: string) => void; min?: number; max?: number; required?: boolean; placeholder?: string; hint?: string; submitted?: boolean; inputMode?: 'decimal' | 'numeric'; validationMode?: 'blur' | 'change';
}) {
  const [touched, setTouched] = useState(false);
  const error = numberError(value, min, max, required);
  const showError = !!error && (touched || submitted || value !== '');
  return <div className="number-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} name={id} type="number" inputMode={inputMode} min={min} max={max} step={inputMode === 'numeric' ? 1 : 'any'} required={required} value={value} onChange={event => { if (validationMode === 'change') setTouched(true); onChange(event.target.value); }} onBlur={() => { if (validationMode === 'blur') setTouched(true); }} placeholder={placeholder} aria-invalid={showError} aria-describedby={`${id}-help`} />
    <div id={`${id}-help`}>{showError ? <p className="inline-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}</div>
  </div>;
}
