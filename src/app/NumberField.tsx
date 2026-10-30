import { useState } from 'react';
import { numberError } from '../lib/numericInput';
export default function NumberField({ id, label, value, onChange, min = 0, max, required = false, placeholder, hint, submitted = false, inputMode = 'decimal', validationMode = 'blur', prefix, suffix }: {
  id: string; label: string; value: string; onChange: (value: string) => void; min?: number; max?: number; required?: boolean; placeholder?: string; hint?: string; submitted?: boolean; inputMode?: 'decimal' | 'numeric'; validationMode?: 'blur' | 'change'; prefix?: string; suffix?: string;
}) {
  const [touched, setTouched] = useState(false);
  const error = numberError(value, min, max, required);
  const showError = !!error && (touched || submitted || value !== '');
  const input = <input id={id} name={id} type="number" inputMode={inputMode} min={min} max={max} step={inputMode === 'numeric' ? 1 : 'any'} required={required} value={value} onChange={event => { if (validationMode === 'change') setTouched(true); onChange(event.target.value); }} onBlur={() => { if (validationMode === 'blur') setTouched(true); }} placeholder={placeholder} aria-invalid={showError} aria-describedby={`${id}-help`} />;
  return <div className="number-field">
    <label htmlFor={id}>{label}{prefix && <span className="sr-only"> ({prefix})</span>}</label>
    {prefix || suffix ? <div className="number-input" data-invalid={showError}>{prefix && <span aria-hidden="true">{prefix}</span>}{input}{suffix && <span aria-hidden="true">{suffix}</span>}</div> : input}
    <div id={`${id}-help`}>{showError ? <p className="inline-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}</div>
  </div>;
}
