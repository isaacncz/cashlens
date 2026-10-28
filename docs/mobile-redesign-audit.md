# CashflowLens.MY mobile redesign baseline

Audit: 375 × 812 CSS pixels, touch viewport, reduced motion enabled; 27 October 2026.

## Repository scope

React 19, TypeScript, Vite and Tailwind. Existing functionality: nine financial education lessons (Money Mirror, Asset vs Liability, Cashflow Quadrant, Income Engine, Rat Race, Debt Visualizer, Salary vs Wealth, Wealth Thermometer, Literacy Playbook), plus the Compounding product/repeat-sales calculator. No transaction data model, transaction entry, transaction reports, or settings route exists. The user subsequently delegated the decision: preserve the existing educational features and provide Home, Learn, Compound and Settings. No transaction tracker or transaction reports are invented.

## Observed issues

| Area | Before / evidence | Required change |
| --- | --- | --- |
| Navigation | Tab strip starts 54px from the top; primary destinations require reaching upward. | Mobile bottom navigation with safe-area padding; desktop navigation at wider breakpoints. |
| First screen | Large learning introduction precedes the first calculator; its form is below the first viewport. | Compact dashboard with direct access to existing tools. |
| Text | Many body paragraphs and controls render at 12–14px despite a 16px body default. | At least 16px body and editable input text; deliberate readable metadata. |
| Financial inputs | Eleven visible numeric inputs across the learning page render at 14px; no inputMode is set. | At least 16px; decimal/numeric keyboards, associated labels, bounds and inline validation. |
| Labels | Money Mirror and Wealth Thermometer labels lack htmlFor/id associations. | Programmatic label associations and linked validation messages. |
| Charts | Compounding is responsive, but has no tap tooltip; some lesson diagrams have 9–11px SVG labels before scaling. | Responsive labels and keyboard/touch inspection. |
| Loading | App.tsx eagerly imports and mounts every lesson, the game, and Compounding. | Split by destination; defer charts and preserve scenario state deliberately. |
| Motion | Native touch scrolling and reduced-motion handling exist in useLenis; useScrollReveal still hides and animates all reveal targets. | Respect reduced motion in all animation paths and keep content visible without animation. |
| Theme | Forced dark class, hardcoded navy and accent colors across Tailwind, SVG and components; no system light-mode theme. | Central Calm Ledger tokens, theme-aware components and system color scheme. |
| Currency | Multiple local formatters mix spaces, whole amounts, decimals and locale defaults. | Shared MYR/RM formatter with explicit display conventions. |
| Safe area | Top safe area supported; viewport lacks viewport-fit=cover; no bottom-navigation inset. | Full safe-area handling and content clearance for fixed controls. |
| Tables | No table elements in existing screens. | Apply stacked cards/sticky-column scrolling if transaction reports are added. |
| Horizontal overflow | None detected on either current destination at 375px. | Retain this at 360, 390, 768 and 1280px, plus zoom and landscape. |

Checkbox/radio glyphs are smaller than 44px, but associated product and option labels enlarge many hit areas. The redesign should measure the complete interactive target rather than treating the glyph size alone as a failure.

## Theme file proposal

Use one `src/styles/theme.css` for semantic color roles, typography, spacing, radii, focus styles, safe-area offsets and light/dark values. Keep component CSS for layout and behavior. Exact values were initially absent; the user then delegated token and visual decisions. The selected forest/paper light and dark palette, self-hosted Inter scale, 4px spacing rhythm, 8px controls and 16px panels are implemented in that file. DESIGN.md records the final system.

## Verification plan

Capture before/after views at 360, 390, 768 and 1280px. Exercise navigation, form validation, numeric keyboards, chart tap/keyboard inspection, empty states, repeat-sales options and state preservation. Run the existing calculation and browser regressions, production build, changed-file lint, and Lighthouse mobile performance/accessibility against the production preview. No ≥90 score will be claimed without a measured report. Use a temporary Lighthouse CLI without adding application dependencies.

## After

- Four destinations replace the two top tabs: Home, Learn, Compound and Settings. Mobile navigation and primary actions sit in the bottom thumb zone; desktop uses a 232px sidebar. The content scrollport explicitly reserves all navigation and action space.
- All nine lessons open as individual lazily loaded screens. Previously visited tools retain session inputs. Compounding and its responsive chart are separate lazy chunks. The entry JavaScript is about 207KB, down from 530KB uncompressed (about 65.7KB versus 156.3KB gzip). No application dependencies were added.
- Numeric forms use associated labels, 16px inputs, decimal/numeric input modes, nonnegative bounds, inline errors and primary result buttons. Zero/negative expenses do not produce a misleading infinite-freedom result.
- The chart supports touch inspection, a crosshair and keyboard-accessible monthly inspection. ABO prices, defaults, 20-customer cap and yearly acquisition logic are preserved.
- Light/dark/system appearance and reduced-motion preferences are local to this device. Calculator values remain in session memory. External font stylesheets and entrance-animation runtimes are removed from the rendered app. Inter is self-hosted with a local preload, optional display, and OFL license.
- Navigation caches refresh online while retaining offline shell access; stale cache-first HTML no longer pins an old design.

### Responsive evidence

Captured Home, Learn, Money Mirror, Compounding and Settings at **360, 390, 768 and 1280px** with no horizontal content overflow. Automated browser checks cover all nine lesson routes, form errors and result focus, retained session state, repeat-sales modes and customer caps, tap/keyboard chart inspection, safe action docks, browser history, theme switching, system scheme changes and stored preferences.

### Before / after measurements

Lighthouse uses the production preview, default mobile throttling, Chromium and Lighthouse 12.8.2. Scores are local lab measurements, not field performance.

| Measurement | Before Home | After Home |
| --- | ---: | ---: |
| Performance | 68 | 97 |
| Accessibility | 96 | 100 |
| LCP | 3.4s | 2.1s |
| TBT | 590ms | 130ms |
| CLS | 0.001 | 0 |

The independent Impeccable finish reviewer scored the four listed finish fixes resolved and returned a scoped **ship** verdict. This does not replace functional or accessibility testing.

Release Compounding measured 97 performance / 100 accessibility, with 2.2s LCP, 140ms TBT and zero CLS. Money Mirror measured 97 performance, 98 accessibility in the final semantic scan, and zero CLS. Its remaining automated finding treats SPA destination links as in-page skip links; those destinations are loaded and focused by the router and are covered by the browser regression.

Design documentation was completed in-thread after the documentation worker became unavailable. DESIGN.md and the schemaVersion 2 sidecar were checked against the implementation.
