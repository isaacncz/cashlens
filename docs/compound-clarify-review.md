# Compound mobile clarification

Impeccable clarify reviewed the complete phone flow for learners unfamiliar with revenue modelling. Results now says “Revenue over [period]” rather than “Your projection”, keeps “Revenue before costs · not profit” beside the amount, and explicitly labels the repeat percentage as an assumption. Product/customer context no longer repeats the period. “Total revenue over time” identifies the chart as cumulative.

The editor uses “Time period”, “Plan settings”, “Your products” and “Buy again”. The time-period accessible name matches the visible label. The stage is “More products” to distinguish it from the Add products action. Repeat help explains the expected share buying again each cycle and the full first purchase. No model, price or default changed; repeat purchases remain editable at 100% by default.

On phones the chart heading wraps independently from its category toggle, with readable line spacing for assumptions and context. Existing touch targets, Ink Blue themes and fixed-action clearance remain.

Validation: production build, changed-file ESLint and whitespace pass; browser/mobile journeys, including landscape and 200% text, verify the clarified controls. PWA upgrades compound-v11→clarify-v12. Twenty light/dark WCAG A/AA scans report no findings; fourteen measured contrast pairs pass. Generated screenshots are under `.impeccable/review/compound-clarify/` (ignored by Git). These are local Chromium checks. Detector advisories concern pre-existing view-switch/radius/type styles; no unrelated metadata repairs were made.
