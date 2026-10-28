import type { ProductCategory, RepeatSalesProduct } from '../data/repeatSalesProducts.ts';

export const MAX_MONTHS = 600;
export const MAX_CUSTOMERS = 20;
export const DEFAULT_REPEAT_RATE = 50;
export const NEW_CUSTOMERS_PER_YEAR = 1;
export const PURCHASE_INTERVALS = [0, 1, 2, 3, 6, 12, 24, 60, 120] as const;
export type PurchaseModel = 'repeat-purchases' | 'annual-attrition';

export interface Projection {
  total: number;
  recurringMonthly: number;
  startingCustomers: number;
  customersAtEnd: number;
  categories: { name: ProductCategory; color: string; cumulative: number[] }[];
}

/** Purchases within [0, months) are included. Each joining cohort has its own
 * first purchase and repeat/replacement schedule. A product's optional startYear
 * is on the business calendar, not the customer's age. Buying starts at the later
 * of product introduction and customer arrival. One new customer joins every
 * 12 months, capped at 20 total customers introduced (not 20 per cohort).
 * Repeat purchase rate stays constant per cycle; annual attrition is applied
 * to each cohort's own age. Fractional buyers are expected averages.
 * includeAnnualAcquisition=false supports fixed-group reference calculations.
 */
export function projectRepeatSales(
  products: readonly RepeatSalesProduct[],
  requestedMonths: number,
  requestedCustomers: number,
  ratePercent: number = DEFAULT_REPEAT_RATE,
  model: PurchaseModel = 'repeat-purchases',
  includeAnnualAcquisition = true,
): Projection {
  const months = Math.min(MAX_MONTHS, Math.max(1, Math.round(Number.isFinite(requestedMonths) ? requestedMonths : 1)));
  const customers = Math.min(MAX_CUSTOMERS, Math.max(1, Math.round(Number.isFinite(requestedCustomers) ? requestedCustomers : 1)));
  const rate = Math.min(1, Math.max(0, Number.isFinite(ratePercent) ? ratePercent / 100 : DEFAULT_REPEAT_RATE / 100));
  const cohorts = [{ joinedAt: 0, count: customers }];
  let customersAtEnd = customers;
  if (includeAnnualAcquisition) {
    for (let joinedAt = 12; joinedAt < months && customersAtEnd < MAX_CUSTOMERS; joinedAt += 12) {
      const count = Math.min(NEW_CUSTOMERS_PER_YEAR, MAX_CUSTOMERS - customersAtEnd);
      cohorts.push({ joinedAt, count });
      customersAtEnd += count;
    }
  }
  const groups = new Map<ProductCategory, { color: string; purchases: number[] }>();
  let recurringMonthly = 0;
  for (const product of products) {
    if (!PURCHASE_INTERVALS.includes(product.every as typeof PURCHASE_INTERVALS[number])) continue;
    const startYear = Math.min(50, Math.max(1, Math.round(Number.isFinite(product.startYear) ? product.startYear! : 1)));
    const availableAt = (startYear - 1) * 12;
    if (availableAt >= months) continue;
    let group = groups.get(product.category);
    if (!group) {
      group = { color: product.color, purchases: Array<number>(months).fill(0) };
      groups.set(product.category, group);
    }
    if (product.every > 0) recurringMonthly += product.aboPrice / product.every * customers;
    for (const cohort of cohorts) {
      const startsAt = Math.max(cohort.joinedAt, availableAt);
      const retentionAt = (month: number) => model === 'annual-attrition'
        ? rate ** Math.floor((month - cohort.joinedAt) / 12) : 1;
      if (product.every === 0) {
        group.purchases[startsAt] += product.aboPrice * cohort.count * retentionAt(startsAt);
        continue;
      }
      const firstPurchase = startsAt + (product.type === 'filter' ? product.every : 0);
      for (let month = firstPurchase; month < months; month += product.every) {
        const buyerShare = model === 'annual-attrition'
          ? retentionAt(month)
          : month === startsAt ? 1 : rate;
        group.purchases[month] += product.aboPrice * cohort.count * buyerShare;
      }
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
    startingCustomers: customers,
    customersAtEnd,
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
