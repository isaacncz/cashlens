# Pocket Coach mobile journey review — PR #3

28 October 2026. Impeccable's mobile adaptation and Operate guidance informed this update. The priority is reaching a tool, completing its inputs, and understanding the result with less scrolling and fewer competing controls.

## Result

Home is a task launcher. Cashflow, financial breathing room, repeat sales and the lesson browser are all visible without scrolling on a standard 375×812 or 430×932 phone. The forest cashflow panel, ivory canvas, sage action, Inter and light/dark themes preserve the selected Pocket Coach identity.

Learn uses one native path selector rather than a duplicate starting panel and four large filters. Its three groups retain every lesson, outcome description, contextual count, session-only Continue link and Last opened marker. The first three lessons fit in the initial phone viewport.

A phone lesson opens in a full-height workspace with a back header. Its form comes before optional examples and path navigation; the result action follows the inputs. On the 375px capture, Money Mirror salary entry begins at approximately 263px from the viewport top. Its secondary result facts become wrapping rows, including with 200% text. Wealth Thermometer keeps optional passive income behind a disclosure, shows entered income in its summary, and reveals a hidden invalid field before focusing it.

Compound uses a native selector for its four stages, then separate Edit plan and Results views on phones. Long-term scenario inputs appear before the product list. Editing and reading no longer require scrolling through each other; one action shows the revised result. Product scheduling, values and assumptions survive view changes. Wider screens retain simultaneous editor and result panels.

Compound has one protected 76px action bar. The destination bar is replaced by a back header while a tool is open. At 375×812 with default text and emulated zero safe-area insets, this gives the consultation 680px of content height, compared with 596px in the preceding layout: 84px recovered from fixed controls. Enlarged destination labels use two columns with a minimum 128px reservation and keep words intact.

All nine lessons, 28-product ABO catalog, formulas, prices, product start years, acquisition/attrition modes, one-month-to-50-year range, 20-customer cap, chart inspection and persistence rules remain available. Calculator values stay in session memory. No application dependencies were added.

## Verification

| Check | Result |
| --- | --- |
| Production build, calculation suite, changed-file ESLint, whitespace | Pass |
| Full functional regression at 360, 390, 768, 1280px | Pass; nine lessons, forms/results, retained values, consultation stages, schedules, customer limits, chart/picker access, history, themes and preferences |
| Mobile journeys at 320×740, 375×812, 430×932 | Pass; direct task access, visible salary entry, native path selection, edit/results switching, product selection and retained inputs |
| Landscape at 667×375 | Pass; useful scroll area and reachable actions |
| 200% root text at 375×812 | Pass; intact navigation, form completion, results, product sheet and optional-field recovery |
| Hidden optional income error | Pass; submit opens its disclosure and focuses the invalid field |
| Stage-selector focus | Pass; changing a stage retains the native selector focus |
| PWA upgrade v4 → v5 | Pass; old cache removed, cached marker refreshed, ivory manifest retained, visited Home/Compound restored offline |
| WCAG 2/2.1/2.2 A/AA automated scans | Zero findings across 20 screen/theme states |
| Theme contrast | All 14 measured text/control pairs pass |

Thirty-five production captures cover phone, tablet and desktop entry screens, both Compound panels, the picker, dark mode, landscape and enlarged text. An additional populated Money Mirror result capture verifies the corrected 200% text layout: content width and scroll width are both 375px. Generated captures and reports are excluded from Git under `.impeccable/review/journey/`.

The mechanical detector ran once. Its advisory radius and amount-size differences predate this flow update; no unrelated design-system drift was repaired. The decorative salary eyebrow and emoji empty-state/zone markers in the touched tools were removed.

These are Chromium emulations and automated checks, not a physical-device Safari audit or a complete manual accessibility certification.

## Production measurements

Lighthouse 12.8.2, local production preview, default mobile throttling:

| Screen | Performance | Accessibility | LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| Home | 99 | 100 | 2.01s | 0 |
| Compound entry | 99 | 100 | 2.05s | 0 |

These local lab measurements apply to the opening screens, not every interactive state or field performance.

## Impeccable review

The independent finish reviewer validated all 20 supplied required captures and requested three material fixes: populated Money Mirror reflow at 200% text, complete enlarged Home navigation/brand labels, and source-backed design documentation. All three were corrected. Its follow-up returned `disposition: ship` scoped to the scored fixes, with no visible correction-batch regressions. DESIGN.md and its sidecar record the current interaction patterns.

Impeccable also reported an unset optional preview-workflow setting for future landing/showcase surfaces. App screens use code previews; no unrelated configuration was changed.

## Reproduce

```sh
npm run build
npm test
```

Start `npm run preview -- --port 3010` in another terminal, then run:

```sh
CASHLENS_TEST_URL=http://localhost:3010/ npm run test:browser
CASHLENS_TEST_URL=http://localhost:3010/ npm run test:mobile
npm run test:pwa
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` when using a system Chromium. The PWA test serves the production build on its own local port.
