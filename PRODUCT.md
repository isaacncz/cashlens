# CashflowLens.MY

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Malaysians learning about personal cashflow and people exploring FMCG repeat-sales businesses, primarily using a phone with one hand.

## Product Purpose
Make financial concepts tangible through nine interactive lessons and an ABO product repeat-sales calculator. Preserve all existing calculations, lessons, game choices and simulator controls.

## Capabilities and Constraints
React, TypeScript, Vite and Tailwind. No new application dependencies. Malaysia MYR currency. Compounding uses April 2026 Malaysia ABO/AP prices for 28 products, a 1-month to 50-year horizon, a maximum of 20 customers, a default 100% repeat-purchase rate, optional annual attrition, and optional one-customer-per-year acquisition. Financial inputs stay in memory; theme/accessibility preferences may stay on this device. No existing transaction ledger or transaction reports; this redesign preserves educational tools rather than inventing a new financial product.

## Brand Commitments
CashflowLens.MY; Pocket Coach. The user selected proposal 2 from three UI UX Pro Max / Impeccable directions on 28 October 2026. Use warm ivory, forest task panels, sage actions, readable type and a guided learning flow. Preserve light/dark themes, familiar navigation and all existing educational tools.

## Accessibility & Inclusion
WCAG AA contrast, semantic navigation and forms, visible keyboard focus, 44px touch targets, 16px body/input text, safe-area insets, system color scheme and reduced motion. Bottom navigation on phone destination screens and sidebar navigation on desktop. Phone tools use a back header and a full-height workspace, with a single action bar for Compound. Target Lighthouse mobile performance and accessibility scores of at least 90, measured against production.

Light is the default theme for new visitors, including dark-mode devices. Explicit stored Light, Dark and Device selections are respected. Learning offers three ordered paths with three lessons each and a session-only last-opened lesson shortcut.

Compound tells a guided, editable example across Year 1, Year 2, Year 3 and My plan. One customer starts with toothpaste; dishwashing liquid and shampoo join in year 2, and multi-purpose cleaner joins in year 3. Earlier products carry forward. The first two chapters isolate basket growth; year 3 introduces optional annual customer acquisition from year 2. Story chapters emphasize annual revenue and distinguish original-customer basket revenue from new-customer revenue. My plan retains the example choices and exposes the full calculator, defaulting to 20 years with yearly customer acquisition enabled. The cap stays at 20 customers and repeat purchase rate starts at 100%. Inputs stay in memory. Official Amway product photos are bundled locally as optimized WebP thumbnails, with source URLs in public/products/SOURCES.md.

Money Mirror uses the user-selected Quick Worksheet page direction (29 October 2026): an editorial cool-white/navy worksheet with Ink Blue highlights, four compact inputs and immediate live results. This page-specific replacement supersedes its previous Pocket Coach form styling while retaining the shared app navigation, themes, privacy and exact financial calculations.

Ink Blue is now the app-wide color authority, including Home, all nine lessons, Learn, Settings, Compound, navigation, dialogs and browser/install chrome in both themes. Earlier Pocket Coach color commitments are superseded; its layouts and the selected Quick Worksheet layout remain. Positive financial outcomes retain semantic green.

Compound now separates mobile Products, Settings and Results, uses a compact full-screen product catalog and lets users build a full product plan directly. Closing product selection returns to the selected list for review; timing controls are disclosed per product. Keep all existing financial/model capabilities available.

On 30 October 2026 the user approved the mobile UI/UX proposal and mockup (`docs/mobile-ux-proposal.md`). All lessons share one phone template: header path progress with a path sheet, interaction first, explanations in disclosures and a sticky Next dock. Money Mirror moves from the Quick Worksheet styling to this shared template; its calculations and behaviour are unchanged. Visited-lesson progress is session-only, like calculator inputs.
