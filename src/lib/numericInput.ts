export function numberError(value: string, min = 0, max = Number.MAX_SAFE_INTEGER, required = false): string {
  if (value.trim() === '') return required ? 'Enter a value to continue.' : '';
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Enter a valid number.';
  if (number < min || number > max) return max === Number.MAX_SAFE_INTEGER ? `Enter ${min} or more.` : `Enter a value from ${min.toLocaleString('en-MY')} to ${max.toLocaleString('en-MY')}.`;
  return '';
}
