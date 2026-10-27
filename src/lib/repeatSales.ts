import type { ProductCategory, RepeatSalesProduct } from '../data/repeatSalesProducts.ts';

export const MAX_MONTHS = 600;
export const MAX_CUSTOMERS = 10_000;
export const PURCHASE_INTERVALS = [0, 1, 2, 3, 6, 12, 24, 60, 120] as const;

export interface Projection {
  total: number;
  recurringMonthly: number;
  categories: { name: ProductCategory; color: string; cumulative: number[] }[];
}

/** Purchases at month t are included only after t: [0, months).
 * Filters start after their first interval; devices default to a single purchase.
 * Retention is annual, applied to the original cohort at each year boundary.
 * Fractional customers express expected averages. Keep precision until display.
 */
export function projectRepeatSales(
  products: readonly RepeatSalesProduct[],
  requestedMonths: number,
  requestedCustomers: number,
  annualRetention: number,
): Projection {
  const months = Math.min(MAX_MONTHS, Math.max(1, Math.round(Number.isFinite(requestedMonths) ? requestedMonths : 1)));
  const customers = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(requestedCustomers) ? requestedCustomers : 1)));
  const retention = Math.min(1, Math.max(0, Number.isFinite(annualRetention) ? annualRetention / 100 : 1));
  const groups = new Map<ProductCategory, { color: string; purchases: number[] }>();
  let recurringMonthly = 0;
  for (const product of products) {
    let group = groups.get(product.category);
    if (!group) {
      group = { color: product.color, purchases: Array<number>(months).fill(0) };
      groups.set(product.category, group);
    }
    if (product.every === 0) {
      group.purchases[0] += product.price * customers;
      continue;
    }
    if (!PURCHASE_INTERVALS.includes(product.every as typeof PURCHASE_INTERVALS[number])) continue;
    recurringMonthly += product.price / product.every * customers;
    const first = product.type === 'filter' ? product.every : 0;
    for (let t = first; t < months; t += product.every) {
      group.purchases[t] += product.price * customers * retention ** Math.floor(t / 12);
    }
  }
  const categories = [...groups].map(([name, group]) => {
    const cumulative = [0];
    group.purchases.forEach((value, index) => cumulative.push(cumulative[index] + value));
    return { name, color: group.color, cumulative };
  });
  return {
    total: categories.reduce((sum, group) => sum + group.cumulative[months], 0),
    recurringMonthly,
    categories,
  };
}

export function durationLabel(months: number): string {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return [years ? `${years} ${years === 1 ? 'year' : 'years'}` : '', remainder ? `${remainder} ${remainder === 1 ? 'month' : 'months'}` : ''].filter(Boolean).join(' ');
}

export const formatRinggit = (amount: number) => new Intl.NumberFormat('en-MY', {
  minimumFractionDigits: 2, maximumFractionDigits: 2,
}).format(amount);
