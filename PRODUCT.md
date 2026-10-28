# CashflowLens.MY

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Malaysians learning about personal cashflow and people exploring FMCG repeat-sales businesses, primarily using a phone with one hand.

## Product Purpose
Make financial concepts tangible through nine interactive lessons and an ABO product repeat-sales calculator. Preserve all existing calculations, lessons, game choices and simulator controls.

## Capabilities and Constraints
React, TypeScript, Vite and Tailwind. No new application dependencies. Malaysia MYR currency. Compounding uses April 2026 Malaysia ABO/AP prices for 28 products, a 1-month to 50-year horizon, a maximum of 20 customers, a default 50% repeat-purchase rate, optional annual attrition, and optional one-customer-per-year acquisition. Financial inputs stay in memory; theme/accessibility preferences may stay on this device. No existing transaction ledger or transaction reports; this redesign preserves educational tools rather than inventing a new financial product.

## Brand Commitments
CashflowLens.MY; Calm Ledger. The user delegated visual and screen-structure decisions after the referenced token values were absent. Implement a quiet, readable, mobile-first identity with light and dark themes.

## Accessibility & Inclusion
WCAG AA contrast, semantic navigation and forms, visible keyboard focus, 44px touch targets, 16px body/input text, safe-area insets, system color scheme and reduced motion. Bottom navigation on phones and sidebar navigation on desktop. Target Lighthouse mobile performance and accessibility scores of at least 90, measured against production.

Light is the default theme for new visitors, including dark-mode devices. Explicit stored Light, Dark and Device selections are respected. Learning offers three ordered paths with three lessons each and a session-only last-opened lesson shortcut.

Compound opens as a consultation: one toothpaste (ABO RM29.50), one customer, then repeat sales over a year. Users add products from year 2 with editable business-calendar start years and explore up to 50 years. Optional yearly customer acquisition starts off; the cap remains 20 and the repeat-purchase default remains 50%. The four stages can be visited directly, and calculator inputs remain ephemeral.
