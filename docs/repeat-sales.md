# Repeat-sales consultation

A client-side experience for people exploring FMCG, in the **Compound** destination. The consultation begins with **one product and one customer**. All nine original lessons remain in Learn. Calculator inputs stay in session memory; no customer data is stored.

## Consultation flow

1. **First sale:** Glister Multi-Action Toothpaste 200g, Malaysia ABO RM29.50, one customer and one item. No chart or scenario controls appear yet. “Change” opens a single-product picker; consumables and appliances can start the consultation. Replacement filters are available in the full catalog at the basket stage.
2. **Repeat sales:** the same customer and product over 12 months, with an editable purchase cycle and a default 50% repeat-purchase assumption. The toothpaste example produces RM73.75. “Add products in year 2” moves to the two-year plan and opens the picker.
3. **Grow basket:** users tick additions from all 28 products. New additions default to year 2, and their Start year is editable from 1 to 50. Products are grouped by introduction year. The original first product stays in year 1. No additional customer is assumed.
4. **Long term:** the same plan can be explored from one month to 50 years. Presets cover 1 month and 1, 2, 5, 10, 25 and 50 years; Custom duration exposes the monthly slider. Customer count and optional yearly acquisition appear here. Acquisition is **off by default** and capped at 20 customers introduced in total.

The four consultation steps are clickable, so users can revisit an explanation or go directly to the full planner. Inputs remain intact between steps and app destinations. Returning to the first two steps isolates the original first-sale example; later additions remain in the full plan. Reset returns to the first sale with one toothpaste, one customer, 50% repeat purchasing, no acquisition, and a five-year starting preset for the later planner. A reload starts a fresh consultation.

## Catalog provenance

The 28 Malaysia products are transcribed from **ABO Price List SA13, April 2026**, supplied as `ABO_Price_List_202604.pdf`. Nutrition: printed page 2. Personal care: pages 8–9. eSpring and its e3 Carbon Filter: page 9. Atmosphere appliances and filters: page 10. Home care: page 11.

`src/data/repeatSalesProducts.ts` preserves each SKU, pack size, ABO price (`aboPrice`), source page, category, and example purchase interval. All prices, averages, chart values and totals use only Malaysia AP (ABO), never RP, BV or Brunei prices. The catalog contains no retail-price field. “Show source details” exposes SKU/page references in the plan and picker. The existing `checked` metadata identifies the three-product calculation reference basket; the consultation explicitly starts with SKU 124106 instead.

Purchase cycles and start years are scenario inputs, not source claims or usage instructions. Follow product instructions and indicators for actual replacement timing. The optional `startYear` field is a scenario override; absent or non-finite values mean year 1, and values are rounded and clamped to years 1–50.

## Purchase accounting

Purchases within `[0, horizon)` are counted, over a horizon clamped to 1–600 months. A year-2 introduction becomes available at month 12. A 12-month projection excludes purchases on that exact boundary; month 13 includes them.

Each customer group has its own joining date. A product's start year is on the **business calendar**, not relative to each customer's arrival. Its buying clock starts at `max(customerJoinedAt, (startYear - 1) * 12)`. Existing customers can first buy a new product when it is introduced; later arrivals begin buying it when they join. No purchases are backdated. New consumable first purchases are counted in full in the repeat-purchase model.

- **Repeat purchases (default):** first consumable purchases use the full group; each later scheduled purchase applies the selected rate, default 50%, without repeated annual decay. Fractional buyers are expected averages.
- **Annual attrition (advanced comparison):** purchase share is `(rate / 100) ** floor((purchaseMonth - customerJoinedAt) / 12)`. A later product introduction does not reset the customer's age or restore lost customers. This also applies to delayed one-time purchases.

Appliances default to one purchase per customer, when both customer and product are in the plan. Filters begin **one replacement interval after** that point, treating the initial filter as included. Later replacements follow the chosen cycle. In the repeat-purchase model, filter replacements use the repeat rate, including their first replacement. A one-time purchase does not use the repeat rate. Invalid intervals are ignored.

When acquisition is selected, one new customer joins at months 12, 24, 36, and so on, until 20 have been introduced in total. The starting group is clamped to 1–20. Acquisition is independent of product introductions. In attrition mode, introduced customers are not the expected number still buying. The sixth `projectRepeatSales` argument controls acquisition; its existing default remains enabled for backward compatibility, while the UI passes its explicit checkbox state.

The headline and chart share cumulative category arrays. The default chart draws one total-revenue line. By category optionally reveals stacked category areas and their legend. Year markers indicate product introductions; all monthly points are retained so introduction boundaries remain visible. The active monthly basket average uses products introduced within the chosen horizon, at ABO price divided by their interval, per starting customer and before the repeat rate.

Prices are fixed: no inflation, reinvestment, or compound investment returns are assumed. Revenue is before expenses and is not profit. A 50-year scenario explores assumptions; it is not a forecast. Zero repeats, one-time goods or future products can legitimately produce a flat line.

## Independently checked examples

**Opening toothpaste:** ABO RM29.50, every 3 months, one fixed customer, 50% repeat purchasing.

- First sale: **RM29.50**.
- Year 1: RM29.50 + 3 × RM14.75 = **RM73.75**.

**Staggered three-product plan:** toothpaste in year 1; Dish Drops 1L (RM35, every 3 months) and Satinique Smooth Moisture Shampoo 280ml (RM56, every 2 months) from year 2.

- Year 1 remains **RM73.75**.
- Year 2 adds RM59 toothpaste + RM87.50 Dish Drops + RM196 shampoo = RM342.50.
- Cumulative 2 years: **RM416.25**, with one customer.
- Cumulative 50 years: **RM14,672.25**, with one customer. This comprises 200 toothpaste cycles, 196 Dish Drops cycles, and 294 shampoo cycles, with each first purchase in full and later cycles at 50%.
- With optional annual acquisition, 50 years introduces 20 customers and totals **RM241,537.00**.
- Moving the shampoo start to year 3 removes its contribution from the two-year horizon, leaving **RM220.25**.

**All three products from year 1:** the original reference cases remain unchanged. At 50%, the fixed-customer totals are RM357.25 for 12 months, RM7,276.50 for 291 months, and RM14,910.25 for 600 months. Annual acquisition gives RM241,775 over 600 months. Starting with 20 customers gives RM298,205. Each later full year adds RM297 per fixed customer. The 50% annual-attrition reference approaches RM1,188 for the fixed group.

## Responsive behavior and accessibility

The first sale uses a focused single panel. Later steps use a product plan and normal-flow result panel; from 1200px they sit side by side with a 360px plan, increasing to 400px from 1440px. Products are grouped by start year with purchase-cycle editors beside their start-year controls.

A native dialog presents the searchable catalog as a bottom sheet on phones and a centered panel from 768px. Its header, filters and live total/Done footer stay outside the scrolling product list. It supports keyboard focus containment, Escape/backdrop dismissal and focus return. Start-year edits restore focus after a product moves to another year group.

Mobile retains the protected action dock above four-item navigation. It shows the live amount and the consultation's next action; the long-term planner switches between View projection and Edit basket. The main scrollport reserves the dock's entire footprint, including safe areas. Controls are at least 44px; text-entry and select controls use 16px text. Theme tokens, visible focus and reduced motion remain respected.

Charts load only after the first-sale step. Their container determines plot height, label density and loading height. Tap/drag reveals a crosshair and total; Monthly values provides a keyboard-accessible month slider. By category is a native checkbox. Full scenario explanations, source details and annual attrition remain in a collapsed disclosure.

## Validation

Run `npm test`, `npm run build`, and targeted ESLint on changed source files. `npm run lint` also reports unrelated existing repository issues. For UI checks, run `npm run dev`, then `npm run test:browser`; set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for a system Chromium and `CASHLENS_TEST_URL` to change the default `http://localhost:3010/`.

The 22 calculation tests cover ABO-only pricing, both buying models, fixed and growing customers, limits, independent clocks, introduction boundaries, year 50, delayed appliances/filters and chart totals. Browser regression covers the consultation and existing nine lessons at 360, 390, 768 and 1280px, including source prices, picker keyboard behavior, start-year edits, retained inputs, mobile docks, touch inspection, form validation, history and saved theme choices.
