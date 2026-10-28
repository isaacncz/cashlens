const formatter = new Intl.NumberFormat('en-MY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const formatMoney = (value: number): string => formatter.format(Number.isFinite(value) ? value : 0);
export const formatMYR = (value: number): string => `RM ${formatMoney(value)}`;
