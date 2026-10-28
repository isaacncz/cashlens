# Pocket Coach mobile redesign — PR #3

28 October 2026. This follow-up uses UI UX Pro Max to adapt the selected Pocket Coach direction for phones. The ivory, forest and sage palette remains the shared visual system.

## Changes

- **Home:** a labeled Money Mirror starting point, shorter task copy, 44px tool icon tiles, and one sand guide containing all three learning paths. The cashflow action stays inside the task panel.
- **Phone shell:** a 56px header and 72px navigation bar at default text size. The current destination highlights the whole link. Short viewports put icons beside labels. Safe-area offsets and protected scrolling remain in place.
- **Learn:** predictable two-column filters, with a single column when enlarged text needs more room. All nine lessons remain discoverable, with contextual result announcements and session-only Continue / Last opened context.
- **Lessons:** View path is an expandable control on phones, retaining all three path links without placing them ahead of every tool. Desktop retains its visible sequence. Money Mirror keeps numeric entry primary and exposes its synchronized hours slider on demand.
- **Compound:** a full-width Change action, a light product panel, then a forest first-sale amount with its ABO/before-costs qualification. At 375px and 430px the complete first-sale amount panel fits above the action bar on arrival. The 88px phone action bar replaces the previous 104px reservation. All four steps remain directly available.
- **Product sheet:** names and sizes lead, with prices below rather than squeezed into a narrow third column. Selection targets remain 44px. Native dialog focus protection, search, categories, Done and Escape remain available.
- **Text scaling:** header, navigation and action reservations use rem units on phones. Labels wrap and the filters stack at 200% text size.
- **Installed app:** worker cache v4 upgrades v3 installations and discards stale cached resources. Previously visited Home and Compound remain usable offline.

No financial formulas, ABO prices, customer caps, product scheduling, acquisition/attrition behavior or persistence rules changed. No application dependencies were added.

## Verification

| Check | Result |
| --- | --- |
| Production build, calculation suite, changed-file ESLint and whitespace checks | Pass |
| Full browser regression at 360, 390, 768 and 1280px | Pass; all nine lessons, forms/results, session values, consultation stages, scheduling, caps, charts, picker focus, history and preferences |
| Mobile checks at 320×740, 375×812 and 430×932 | Pass; no horizontal overflow, readable controls, working filters/path disclosure/product selection, and protected action bars |
| Landscape at 667×375 | Pass; compact navigation and usable content scroll area |
| 200% text at 375×812 (16px to 32px root text) | Pass; navigation labels reflow, filters stack, dialogs fit and focused controls stay reachable |
| Optional hours slider | Pass; keyboard focus reveals the complete 44px target and its value updates numeric entry |
| PWA update v3 → v4 | Pass; old cache removed, cached marker refreshed, ivory manifest retained, visited screens restored offline |
| Automated WCAG 2/2.1/2.2 A/AA | Zero findings across 16 screen/theme states, including the expanded, focused slider |
| Theme contrast | All 14 measured text/control pairs pass |

Production screenshots cover Home, Learn, Settings, Money Mirror, first sale, planner and picker at 390px / 1440px, plus dark mode. Additional captures cover 375px, landscape, enlarged text and the Home learning guide. Generated captures and audit reports live in `.impeccable/review/mobile/` and are excluded from Git.

These checks use Chromium emulation. They do not substitute for a physical-device Safari audit. Earlier Lighthouse measurements in the original Pocket Coach review apply to the preceding commit; no new Lighthouse score is asserted for this mobile follow-up.

## Reproduce

```sh
npm run build
npm test
npm run preview -- --port 3010
CASHLENS_TEST_URL=http://localhost:3010/ npm run test:browser
CASHLENS_TEST_URL=http://localhost:3010/ npm run test:mobile
npm run test:pwa
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using a system Chromium rather than Playwright's installed browser. The PWA test serves the production build on its own local port.
