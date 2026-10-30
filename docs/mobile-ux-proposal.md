# Mobile UI/UX review and proposal

Audit: 390 × 844, touch, reduced motion, production build (`vite preview`), light and dark; 30 October 2026.

## Verdict

The app shell (bottom nav, back header, Home, Settings) is solid. The problem is the nine lessons: each still carries its original desktop layout, so phone users get long scrolls, buried interactions, three competing form styles and nested tinted cards. Compound has too many navigation layers.

## Evidence

| Lesson | Length (screens) | First control (px from top) | Card nesting | Background colours | Emoji icons |
| --- | --- | --- | --- | --- | --- |
| Money Mirror | 1.2 | 173 | 1 | 0 | 0 |
| Wealth Thermometer | 1.6 | 209 | 1 | 2 | 0 |
| Assets & liabilities | 2.0 | 429 | 2 | 7 | 1 |
| Cashflow Quadrant | 2.6 | 160 | 2 | 1 | 0 |
| Literacy Playbook | 2.6 | 894 | 3 | 4 | 0 |
| Rat Race | 3.7 | 1111 | 3 | 11 | 2 |
| Salary & wealth | 3.8 | 647 | 3 | 5 | 0 |
| Income Engine | 5.1 | none | 4 | 12 | 0 |
| Debt Visualizer | 6.0 | 2588 | 4 | 11 | 5 |

Viewport inside the lesson scrollport is 788px. "Next lesson" sits at the very end of every lesson (Debt: 4655px).

## Findings

### System

1. **Three form patterns.** Money Mirror: underline fields, 2 columns, Georgia serif. Wealth Thermometer: boxed, right-aligned value column. Salary & wealth / Debt: sliders with heavy grey tracks. One user, three mental models.
2. **Card-in-card-in-card.** Debt and Income Engine nest 4 levels of rounded, tinted panels (pink, green, blue). 11–12 background colours per screen. Visual noise; semantic red/green loses meaning.
3. **Headline style clash.** Shell uses sentence case ("Learn at your pace."). Lessons use title-case two-colour slogans ("Wealth Is Not A Number. It Is A Countdown.").
4. **Mixed iconography.** Emoji (🏦 🎓 🚗 🏠) beside Lucide icons.
5. **Small metadata.** Money Mirror hints and privacy line render at 12px; labels at 14px semibold.
6. **Privacy note repeated** on Home, Learn, Money Mirror, Wealth Thermometer and Settings.

### Lessons

7. **Interaction buried.** Debt's only control is 3.3 screens down; Rat Race choices sit under a decorative wheel; Income Engine has no interaction at all, only 4,000px of reading.
8. **Triple footer.** Path accordion + "All lessons" + "Next:" text links. The main forward action is a plain link at the bottom of a long scroll.
9. **No progress in focus mode.** The back header shows only a title; "Lesson 2 of 3" is hidden in the footer accordion.
10. **Results leave the screen.** In Money Mirror, results render below the inputs; with the keyboard open, the live number is off-screen.
11. **Assets & liabilities.** Two empty 270px drop zones dominate; "Swipe Left / Asset" buttons wrap to two lines.

### Destinations

12. **Compound: 3 nav layers.** Native `<select>` stepper, Products/Settings/Results tabs, and a dock CTA whose label changes per step ("Add products in year 2", "View results", "Edit plan").
13. **Learn.** A native select filter duplicates the visible path headings; no completion state per lesson.
14. **Home.** Shows 3 of 10 tools; no "continue where you left off"; the H1 and subtitle use space without adding information.
15. **Settings.** 1.4 screens for 3 preferences; "Reduce motion" uses a 28px checkbox instead of a switch row.

Dark mode contrast and safe-area handling look correct. No horizontal overflow at 390px.

## Proposal: one lesson template, one component set

### A. Mobile lesson template (P0)

```
┌──────────────────────────────┐
│ ←  Debt Visualizer      2/3  │  back · title · path progress
│ ▓▓▓▓▓▓▓▓▓▓░░░░░              │  thin progress bar (tap → path sheet)
├──────────────────────────────┤
│ One-line question (H1)       │  sentence case, Inter, ≤2 lines
│ One-line context             │
│ ┌──────────────────────────┐ │
│ │ INTERACTIVE CORE         │ │  inputs / slider / game, above the fold
│ └──────────────────────────┘ │
│ Key takeaway (1 card)        │
│ ▸ Why it works               │  accordions: stats, quotes, checklists
│ ▸ Malaysian example          │
│ ▸ Try this week              │
├──────────────────────────────┤
│ RM 1,500 out · −RM 200 net   │  sticky live-result strip (calculators)
│ [        Next lesson  →    ] │  sticky primary action
└──────────────────────────────┘
```

Rules:
- The first control sits within the first 788px viewport.
- Default (collapsed) length: 2.5 screens or less.
- Use the existing `--lesson-dock-height` dock pattern from Wealth Thermometer for the sticky footer.
- The path list moves into a bottom sheet opened from the header progress, replacing the footer accordion and "All lessons" link.

### B. Component consolidation (P0)

| Element | Standard |
| --- | --- |
| Number input | Label above, boxed 52px field, `RM` prefix adornment, right-aligned tabular digits, hint at 14px |
| Slider | 4px track, 28px thumb, value bubble, min/max labels |
| Card | One level only; surface + 1px line; no tinted nesting |
| Semantic colour | Red/green only on numbers and status chips, never on whole panels |
| Icons | Lucide only; replace emoji |
| Headings | Sentence case; single colour; accent only on one key word if at all |
| Type floor | 14px for metadata, 16px for body and inputs |
| Privacy note | Once: Settings + Home footer |

### C. Per-screen changes

| Screen | Change | Priority |
| --- | --- | --- |
| Debt Visualizer | Move the quadrant slider to the top; collapse bad/good debt examples and checklist into accordions | P0 |
| Income Engine | Add one interaction (stream mix slider showing payer-dependence %); collapse the four explainer cards | P0 |
| Rat Race | Hide the wheel on phone; choices first, in a bottom sheet; stats as a compact sticky HUD | P0 |
| Money Mirror | Sticky "RM/hour" result strip; single-column boxed inputs | P0 |
| Salary & wealth | Segmented control (Dr. Lim / Kumar / Aisyah) instead of three stacked tall cards; fix slider track | P1 |
| Assets & liabilities | Replace drop zones with two compact counters + recent list; single-line button labels | P1 |
| Compound | Replace the `<select>` with a 4-dot stepper in the header; keep the tabs; dock = fixed Back / Next pair | P1 |
| Learn | Drop the select filter; per-lesson "done" ticks and path progress (session-only) | P1 |
| Home | "Continue" card when a lesson was opened; 2-column grid of all paths | P2 |
| Settings | Switch row for reduce motion; compact theme segmented control | P2 |

### D. Phasing

1. **P0:** tokens and components (B), lesson template (A), the four heaviest lessons.
2. **P1:** remaining lessons, Compound stepper, Learn progress.
3. **P2:** Home and Settings polish.

Each phase extends `tests/mobile.browser.mjs` with checks for first control in viewport, collapsed length, sticky Next and 14px minimum text.

## Constraints kept

No new dependencies. Calculations, ABO prices, 20-customer cap, 100% repeat default, Ink Blue palette, themes and session-only inputs are unchanged (PRODUCT.md).

## Decisions needed

1. **Money Mirror Quick Worksheet.** It was user-selected on 29 October 2026 (serif, underline fields). Should it stay an exception, or move to the shared component set?
2. **Lesson content.** May long explanatory copy (Debt, Income Engine) move into collapsed accordions, or must it stay always visible?
3. **Progress ticks.** Session-only (current privacy model), or stored on this device?
