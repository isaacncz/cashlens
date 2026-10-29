# Ink Blue — selected worksheet theme

The subsequent [global rollout](global-ink-blue-review.md) applies this palette to the entire app.

The user selected option 1 from three UI UX Pro Max color proposals. Money Mirror now uses cool-white, navy text and a strong blue accent, with a matching navy/pale-blue dark theme. The worksheet header follows the selected palette while this route is active. Layout, input flow and calculations remain unchanged.

Actions, focus indicators, links and hourly pay use the accent. The live-estimate label uses a softer tint with primary text. Body, muted, action, status, link and error text meet 4.5:1 in the selected palette; control boundaries meet 3:1 (14 checked light/dark pairs). Exact tokens are documented in DESIGN.md and MoneyMirror.css.

Production build, changed-file lint and whitespace checks pass. Ten rendered worksheet WCAG A/AA scans report no findings across light/dark, phone/desktop, empty/result/details/error states. Mobile journeys pass at 320, 375 and 430px, landscape and 200% text. PWA testing verifies worksheet-v8 to ink-blue-v9 cache replacement and offline restoration. Generated captures are under `.impeccable/review/ink-blue/` (gitignored). These are Chromium checks, not physical Safari certification.
