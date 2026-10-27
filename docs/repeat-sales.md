# The Power of Repeat Sales

A client-side lesson for people exploring an FMCG business, inserted after Income Engine. It retains Cashlens's navy/gold visual system and the approved basket-and-chart composition. Scoped styles live in `src/sections/RepeatSales.css`; no original brand tokens are replaced.

## Catalog provenance

The 28 Malaysia products are transcribed from **ABO Price List SA13, April 2026**, supplied as `ABO_Price_List_202604.pdf`. Nutrition: printed page 2. Personal care: pages 8–9. eSpring and its e3 Carbon Filter: page 9. Atmosphere appliances and filters: page 10. Home care: page 11.

`src/data/repeatSalesProducts.ts` keeps each SKU, pack size, AP, RP, source page, category, default selection, and example purchase interval. RP is customer sales revenue; AP is contextual purchase-price information, not earnings. Do not substitute BV or Brunei prices. Retain two decimal places.

## Model

`src/lib/repeatSales.ts` contains pure projection functions. The horizon spans 1–600 months. Customer count spans 1–10,000, and the convenience slider spans 1–1,000. Annual retention spans 0–100% and shrinks the original cohort at each 12-month boundary without adding customers.

Purchases within `[0, horizon)` are counted: consumables first at month 0, then at the chosen interval; appliances default to one purchase at month 0; filters first after their chosen interval. At 600 months an annual filter has 49 replacement purchases, with the initial appliance filter assumed included. Selecting a standalone filter also uses this delayed schedule. Actual replacement schedules depend on product instructions/indicators. Intervals can be edited, including a one-time purchase. No source-backed usage or dosage is inferred from these examples.

The chart stacks revenue by category and uses the same cumulative monthly arrays as the total. Recurring monthly average is steady-state RP divided by interval before retention, excluding one-time purchases. Values are expected averages; retain calculation precision until formatting. Fixed current prices, no inflation, new customers, or reinvestment. Revenue excludes expenses and is not profit; a 50-year scenario is not a forecast.

Default basket: toothpaste 200g every 3 months, Dish Drops 1L every 3 months, shampoo 280ml every 2 months. One customer at full retention generates RM150.70 in the first month, RM742.80 in one year, and RM37,140.00 in 50 years.

## Interaction and accessibility

Product selection, search, category filtering, selected-only view, editable intervals, clearing, and reset remain in memory. A visible selected-basket summary explains the initial scenario even when the selected rows are below the catalog fold. The catalog scroll is isolated from Lenis. Native form controls have labels and visible focus; total and product impact use polite live regions. Duration is represented in months with a human-readable `aria-valuetext`. Mobile layout stacks the basket and result; no backend, tracking, or stored customer data is added.

## Validation

Run `npm test`, `npm run build`, and `npm run lint`. Unit tests cover source price anchors, purchase boundaries, retention, devices/filters, customer scaling, changed intervals, chart totals, and empty/limit states. Existing repository-wide lint issues may require tracking separately; new lesson files should pass targeted ESLint. Check navigation, catalog scrolling, totals, long amounts, empty search, keyboard controls, and screenshots at desktop and mobile widths.
