# The Power of Repeat Sales

A client-side calculator for people exploring an FMCG business, available in its own **Compounding** tab. **Learn** contains the original nine financial lessons. The calculator retains the approved navy/gold basket-and-chart design and stores no customer data.

## Catalog provenance

The 28 Malaysia products are transcribed from **ABO Price List SA13, April 2026**, supplied as `ABO_Price_List_202604.pdf`. Nutrition: printed page 2. Personal care: pages 8–9. eSpring and its e3 Carbon Filter: page 9. Atmosphere appliances and filters: page 10. Home care: page 11.

`src/data/repeatSalesProducts.ts` keeps each SKU, pack size, ABO price (`aboPrice`), source page, category, default selection, and example purchase interval. All visible product prices, monthly averages, chart values, and totals use only the Malaysia AP (ABO price) column. The active catalog contains no retail-price field. SKU and source page appear under “Show source details.” Do not substitute BV, RP, or Brunei prices. Purchase cycles are editable examples, not dosage or usage advice. Follow product instructions and indicators for actual replacement timing.

## Two distinct buying assumptions

The previous default applied 50% **annual attrition** to the same original cohort indefinitely. This was mathematically consistent with that assumption but unsuitable as the default repeat-business story: the customer group became 1, 0.5, 0.25, and so on, so cumulative sales approached a finite ceiling. The default must not silently label that as ongoing repeat purchasing.

`src/lib/repeatSales.ts` now exposes two explicit modes:

- **Repeat purchases (default):** the initial consumable purchase uses the full selected group. Every subsequent scheduled purchase uses the same repeat-purchase rate, default 50%, applied to that joining group. There is no repeated annual decay. New customer acquisition is controlled by the checkbox described below. Fractional buyers represent an expected average. Future scheduled purchases continue to add revenue at a positive rate.
- **Annual attrition (comparison stress test):** each joining group’s remaining customers are multiplied by the selected annual retention rate, starting from its own joining date. At 50%, each group shrinks exponentially; revenue may eventually level off after the customer-acquisition cap is reached. Both the control label and explanation change when this mode is chosen.

Both modes support 1–600 months and a starting group between 1 and 20. “Add 1 customer each year” is checked by default and can be unchecked to compare a fixed starting group. Checked, one customer joins at months 12, 24, 36, and so on, until 20 customers have joined in total. The cap is on total customers introduced, not a fresh allowance for each group or each year. A horizon ending exactly at month 12 excludes the new arrival at month 12; month 13 includes that arrival. Reset restores one starting customer, annual acquisition checked, 50% repeat purchasing, the 50-year horizon, and the starter basket. Users may adjust the rate between 0% and 100%. With acquisition off, a zero repeat rate or a basket containing only one-time goods can correctly produce a flat line after the first purchase. With acquisition on, new first purchases continue until the 20-customer cap; the chart must not fabricate continued growth.

## Purchase accounting

Purchases within `[0, horizon)` are counted. Each joining group has its own purchase clock; revenue before its joining date is never counted. Consumables start at each joining group’s arrival month, then repeat at the chosen interval. Appliances default to one purchase per customer when they join. Filters start after their chosen interval, treating the initial appliance filter as included. Over 600 months an initial customer has 49 annual filter replacements; later customers have fewer, based on their joining dates. Standalone filters also use this delayed replacement schedule, relative to each joining date. One-time goods are never multiplied by the repeat rate.

In repeat-purchase mode, purchase share is `1` at each group’s joining month and `rate / 100` at each later scheduled purchase. In annual-attrition mode it is `(rate / 100) ** floor(monthsSinceJoining / 12)`. Each purchase is Malaysia ABO price (AP) × customers in that joining group × purchase share, summed across all joining groups. Keep precision until display.

The chart and headline use the same cumulative monthly arrays, stacked by category. The full-basket monthly average is ABO price divided by the interval, per customer, before the scenario's repeat/attrition rate. Prices stay fixed: no inflation, reinvestment, or assumed compound investment returns. Customer acquisition is explicitly modeled only when the checkbox is checked. Revenue is before expenses and is not profit. A 50-year scenario explores assumptions; it is not a forecast.

## Independently checked fixed-group examples

Basket: toothpaste 200g every 3 months, Dish Drops 1L every 3 months, shampoo 280ml every 2 months.

The first purchase is RM29.50 + RM35.00 + RM56.00 = **RM120.50**. At 100% purchasing, the full basket generates RM594.00 annually or RM29,700.00 over 50 years. At 50% repeat purchasing, total = first purchase + 50% × all later purchases:

- 1 year: RM120.50 + (RM594.00 − RM120.50) × 0.5 = **RM357.25**.
- 24 years 3 months (the reported screenshot): **RM7,276.50**.
- 50 years: RM120.50 + (RM29,700.00 − RM120.50) × 0.5 = **RM14,910.25**.
- 20 customers over 50 years: **RM298,205.00**.
- Every full later year, including year 50, adds **RM297.00 per customer**.

With acquisition unchecked, the annual-attrition comparison at 50% approaches RM1,188.00 over 50 years, reproducing the old flat curve’s shape using ABO prices.

## Annual customer acquisition examples

With the default one starting customer and acquisition checked, years 1–20 have 1, 2, …, 20 customers introduced; no more are added once 20 have joined. New customers buy the same selected basket, with first purchases and delayed filters scheduled from their own joining dates. The interface shows starting and total introduced counts; in attrition mode, the total introduced is not the expected number still buying.

At 50% repeat purchasing:

- 12 months: 1 customer introduced, RM357.25.
- 13 months: 2 customers introduced, RM538.00.
- 24 months: 2 customers introduced, RM1,011.50.
- 24 years 3 months: 20 customers introduced, RM89,100.00.
- 50 years: 20 customers introduced, RM241,775.00.

For the 50-year total, the 20 groups have purchase histories of 50, 49, …, 31 full years. Their ages sum to 810. Each group’s value is RM297 × years + RM60.25, so total = RM297 × 810 + RM60.25 × 20 = **RM241,775.00**. Unchecking acquisition gives the fixed-one-customer total RM14,910.25. Starting with 20 customers gives RM298,205.00 with either checkbox state, because the cap is already reached.

The optional sixth `projectRepeatSales` argument disables annual acquisition for fixed-group reference calculations; the UI passes the checkbox state explicitly. Model metadata includes the clamped starting count and total introduced by the selected horizon.

## Mobile, navigation, and accessibility

The mobile catalog initially shows six products, with an option to browse all 28. Its count reflects the actual visible rows. A compact sticky total remains available while browsing products. An IntersectionObserver hides that extra total when the projection enters the main viewing area, so it cannot cover the projection heading, amount, or chart as in the reported screenshot. Space remains reserved to avoid a scroll jump. “View projection” scrolls below the measured header and moves focus to the result; a hiding summary cannot retain keyboard focus.

The header publishes its actual height through a ResizeObserver, including safe-area padding. Anchor scrolling uses that measurement. Controls have labels, visible focus, and 44px control areas; mobile text-entry controls use 16px text. Product names and pack sizes share a checkbox label. Price details remain available on demand. Scoped slider tracks prevent style leakage from the older learning modules.

Learn and Compounding use hash links (`#learn`, `#compounding`, legacy alias `#repeat-sales`), browser history, and arrow-key tab navigation. Both panels remain mounted so inputs survive tab changes. The learning menu dismisses with Escape or outside click. Touch and reduced-motion users get native scrolling. Desktop Lenis is resized when switching tabs.

## Validation

Run `npm test`, `npm run build`, and targeted ESLint on changed files. `npm run lint` also reports existing unrelated repository issues. For UI regression checks, start `npm run dev`, then run `npm run test:browser`. Install Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. `CASHLENS_TEST_URL` optionally changes the default `http://localhost:3000/`.

Tests distinguish the two scenario formulas, verify a positive year-49-to-50 revenue increment, preserve legitimate flat one-time/zero-repeat cases, and check ABO-only prices (including a regression that injects an ignored retail-price property), purchase boundaries, filters, limits, and chart totals. Additional tests cover the checkbox, anniversary boundary, 20-customer global cap, new customers’ independent purchase/filter schedules, and retention by joining-group age. Browser checks cover the exact screenshot horizon, both scenario labels, cap/default/reset behavior, navigation, touch layouts, and the summary/projection overlap regression.

### Compact mobile interface

The calculator opens with a short title, live revenue, search, and product checkboxes. On mobile, purchase intervals appear when a product is selected. Category filtering, selected-only mode, clear basket, and SKU/page references remain available under **Filters & source**. The repeat rate, annual-attrition comparison, and monthly basket average are under **Repeat settings**, collapsed by default with the current rate visible in its summary. Detailed methodology remains under **Prices & assumptions**. Starting customers and the optional yearly-customer checkbox remain visible. This removes repeated instructions without changing the projection or ABO pricing.
