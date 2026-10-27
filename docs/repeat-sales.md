# The Power of Repeat Sales

A client-side calculator for people exploring an FMCG business, available in its own **Compounding** tab. The **Learn** tab contains the original nine financial lessons. It retains Cashlens's navy/gold visual system and the approved basket-and-chart composition. Scoped styles live in `src/sections/RepeatSales.css`; no original brand tokens are replaced.

## Catalog provenance

The 28 Malaysia products are transcribed from **ABO Price List SA13, April 2026**, supplied as `ABO_Price_List_202604.pdf`. Nutrition: printed page 2. Personal care: pages 8–9. eSpring and its e3 Carbon Filter: page 9. Atmosphere appliances and filters: page 10. Home care: page 11.

`src/data/repeatSalesProducts.ts` keeps each SKU, pack size, AP, RP, source page, category, default selection, and example purchase interval. RP is customer sales revenue; AP is contextual purchase-price information, not earnings. Do not substitute BV or Brunei prices. Retain two decimal places.

## Model

`src/lib/repeatSales.ts` contains pure projection functions. The horizon spans 1–600 months. Both customer controls span 1–20, enforced again in the projection model. Annual retention defaults to 50% and remains adjustable from 0–100% and shrinks the original cohort at each 12-month boundary without adding customers.

Purchases within `[0, horizon)` are counted: consumables first at month 0, then at the chosen interval; appliances default to one purchase at month 0; filters first after their chosen interval. At 600 months an annual filter has 49 replacement purchases, with the initial appliance filter assumed included. Selecting a standalone filter also uses this delayed schedule. Actual replacement schedules depend on product instructions/indicators. Intervals can be edited, including a one-time purchase. No source-backed usage or dosage is inferred from these examples.

The chart stacks revenue by category and uses the same cumulative monthly arrays as the total. Recurring monthly average is steady-state RP divided by interval before retention, excluding one-time purchases. Values are expected averages; retain calculation precision until formatting. Fixed current prices, no inflation, new customers, or reinvestment. Revenue excludes expenses and is not profit; a 50-year scenario is not a forecast.

Default basket: toothpaste 200g every 3 months, Dish Drops 1L every 3 months, shampoo 280ml every 2 months. At the default 50% annual retention, one starting customer generates RM150.70 in the first month, RM742.80 in one year, and RM1,485.60 over 50 years. Reset returns to one customer and 50% retention. At an explicitly selected 100% retention, the same basket generates RM37,140.00 over 50 years.

## Interaction and accessibility

Product selection, search, category filtering, selected-only view, editable intervals, clearing, and reset remain in memory. “Show selected” opens the selected basket. Price details (AP, SKU, source page) are available on demand to keep the default catalog concise. On desktop the catalog has an isolated scroll region and the result stays beside it. On mobile six products appear initially with a control to expand all 28; the page scrolls naturally. A sticky live revenue summary remains below the header while selecting products, with a jump to the full projection. Native form controls have labels and visible focus; total and product impact use polite live regions. Duration is represented in months with a human-readable `aria-valuetext`. The two page tabs use hash URLs (`#learn`, `#compounding`, with `#repeat-sales` kept as an alias), support browser history and arrow-key navigation, and keep both panels mounted so inputs survive tab changes. The learning header has an accessible lesson menu with Escape/outside-click dismissal. Touch devices and reduced-motion users use native scrolling; desktop Lenis is resized on tab changes. Mobile layout stacks the basket and result; no backend, tracking, or stored customer data is added.

## Validation

Run `npm test`, `npm run build`, and `npm run lint`. For browser regression checks, start `npm run dev`, then run `npm run test:browser` (install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to an installed binary). The optional `CASHLENS_TEST_URL` changes the default `http://localhost:3000/`. Unit tests cover source price anchors, purchase boundaries, retention, devices/filters, customer scaling, changed intervals, chart totals, and empty/limit states. Existing repository-wide lint issues may require tracking separately; new lesson files should pass targeted ESLint. Check navigation, catalog scrolling, totals, long amounts, empty search, keyboard controls, and screenshots at desktop and mobile widths.
