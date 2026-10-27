import type { ProductCategory, RepeatSalesProduct } from '../data/repeatSalesProducts.ts';

export const MAX_MONTHS = 600;
export const MAX_CUSTOMERS = 20;
export const DEFAULT_REPEAT_RATE = 50;
export const PURCHASE_INTERVALS = [0, 1, 2, 3, 6, 12, 24, 60, 120] as const;
export type PurchaseModel = 'repeat-purchases' | 'annual-attrition';

export interface Projection {
  total: number;
  recurringMonthly: number;
  categories: { name: ProductCategory; color: string; cumulative: number[] }[];
}

/** Purchases within [0, months) are included. First consumable/device purchases
 * use the full chosen customer count; filters begin after their first interval.
 *
 * repeat-purchases: the same rate of the chosen group buys at each later cycle.
 * annual-attrition: a stress test where only the shrinking original cohort buys.
 * These distinct assumptions must never share an ambiguous "retention" label.
 * Fractional buyers express expected averages. Retain precision until display.
 */
export function projectRepeatSales(
  products: readonly RepeatSalesProduct[],
  requestedMonths: number,
  requestedCustomers: number,
  ratePercent: number = DEFAULT_REPEAT_RATE,
  model: PurchaseModel = 'repeat-purchases',
): Projection {
  const months = Math.min(MAX_MONTHS, Math.max(1, Math.round(Number.isFinite(requestedMonths) ? requestedMonths : 1)));
  const customers = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(requestedCustomers) ? requestedCustomers : 1)));
  const rate = Math.min(1, Math.max(0, Number.isFinite(ratePercent) ? ratePercent / 100 : DEFAULT_REPEAT_RATE / 100));
  const groups = new Map<ProductCategory, { color: string; purchases: number[] }>();
  let recurringMonthly = 0;
  for (const product of products) {
    let group = groups.get(product.category);
    if (!group) {
      group = { color: product.color, purchases: Array<number>(months).fill(0) };
      groups.set(product.category, group);
    }
    if (product.every === 0) {
      group.purchases[0] += product.aboPrice * customers;
      continue;
    }
    if (!PURCHASE_INTERVALS.includes(product.every as typeof PURCHASE_INTERVALS[number])) continue;
    recurringMonthly += product.aboPrice / product.every * customers;
    const first = product.type === 'filter' ? product.every : 0;
    for (let t = first; t < months; t += product.every) {
      const buyerShare = model === 'annual-attrition'
        ? rate ** Math.floor(t / 12)
        : t === 0 ? 1 : rate;
      group.purchases[t] += product.aboPrice * customers * buyerShare;
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
