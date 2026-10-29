# Money Mirror — Quick Worksheet

The subsequent [Ink Blue theme review](ink-blue-review.md) records the selected production palette.

29 October 2026. The user selected proposal 2 from three interactive replacement designs. This change replaces the entire Money Mirror page rather than further compressing its former input rows.

## Shipped design

An off-white/graphite worksheet uses a serif heading, four underlined numeric inputs and citron highlights. Inputs form a compact two-by-two grid; live hourly pay, monthly take-home, working time and deductions follow immediately. Desktop places entry and results side by side. Enlarged text stacks fields when their available width is below 18rem. Dark mode follows the existing saved preference.

Fields start empty. Salary is required; a visible note explains the optional defaults of 44 working hours and zero costs/commute. Try an example reveals the three existing named scenarios. Selecting one labels the result as an example and returns focus to the example disclosure control. Typing recalculates without moving focus; invalid input removes the previous result. Worksheet fields validate during editing or submission, preventing a blur-time error from shifting the control being tapped. Other forms retain their existing validation mode. View my results remains an explicit focus/scroll shortcut, not a prerequisite for calculation.

Detailed deductions, the existing time illustration and an optional hours slider remain available as disclosures. Take-home explicitly includes work costs. The six calculation functions are byte-for-byte unchanged from the preceding implementation; inputs are not persisted. Obsolete Money Mirror CSS and its tablet dock reservation were removed. Wealth Thermometer and other lessons retain their own layouts. No application dependencies were added.

## Review and validation

UI UX Pro Max guided the selected prototype and implementation. Three user-requested agents contributed implementation, tests and a proposal review. They reached a usage limit before final review; the parent completed integration and final verification directly. No independent final-review clearance is claimed.

- Production build, changed-file ESLint, calculation suite and whitespace checks pass.
- Full browser regression verifies all nine lessons, four consultation stages, preserved financial results, session state, themes, history and product planning at 360, 390, 768 and 1280px.
- Mobile journeys verify 320×740, 375×812, 430×932, 667×375 landscape and 375×812 with 200% root text. Empty inputs, live results, focus retention, invalid input recovery, reflow and touch targets pass.
- The existing example model (salary 8000, 44 hours/week, 1.5 commute hours/day, costs 500) still yields RM27.42/hour and RM6,071.18 take-home.
- Ten automated WCAG A/AA scans across mobile/desktop, light/dark, empty/populated, details and error states report zero findings. Eighteen captures cover supported layouts, including enlarged text and landscape.
- The PWA test verifies cache v7→worksheet-v8, cached-resource refresh, offline restoration of visited Home/Compound/worksheet pages, and empty financial inputs after reload.

Generated screenshots and scan JSON are under `.impeccable/review/worksheet/` and excluded from Git. Checks use local Chromium, not physical Safari devices. No new Lighthouse score is claimed.
