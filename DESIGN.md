---
name: CashflowLens.MY — Pocket Coach
description: A welcoming field guide for the next small money decision.
colors:
  ground: rgb(247 244 235)
  surface: rgb(255 254 249)
  raised: rgb(233 238 227)
  ink: rgb(35 58 47)
  muted: rgb(89 100 84)
  accent: rgb(39 92 72)
  positive: rgb(35 106 71)
  negative: rgb(171 48 48)
  warning: rgb(142 95 33)
  info: rgb(52 94 123)
  line: rgb(214 217 202)
  control: rgb(116 133 113)
  on-accent: '#fffef9'
  coach-feature: '#275c48'
  coach-on-feature: '#fffef9'
  coach-feature-muted: '#dbe5d5'
  coach-button: '#e7eddb'
  coach-on-button: '#234532'
  coach-guide: '#eee8d8'
  dark-ground: rgb(18 28 23)
  dark-surface: rgb(26 39 31)
  dark-raised: rgb(36 53 42)
  dark-ink: rgb(238 244 239)
  dark-muted: rgb(182 201 187)
  dark-accent: rgb(160 209 178)
  dark-positive: rgb(142 218 171)
  dark-negative: rgb(255 168 163)
  dark-warning: rgb(232 198 129)
  dark-info: rgb(154 203 232)
  dark-line: rgb(61 82 68)
  dark-control: rgb(123 151 131)
  dark-on-accent: '#122018'
  dark-coach-feature: '#244b39'
  dark-coach-guide: '#303a2d'
typography:
  display:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: clamp(2rem, 4vw, 2.625rem)
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.035em
  feature:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: clamp(1.5rem, 3vw, 1.875rem)
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.025em
  consultation:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: clamp(1.75rem, 3vw, 2rem)
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.03em
  title:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.035em
  section:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1.5rem
  lead:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1.25rem
  subtitle:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1.125rem
  body:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.6
  small:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: 8px
  panel: 16px
  legacy-base: 0.75rem
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '6': 24px
  '8': 32px
  '12': 48px
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.on-accent}'
    rounded: '{rounded.control}'
    padding: 12px 20px
  button-feature:
    backgroundColor: '{colors.coach-button}'
    textColor: '{colors.coach-on-button}'
    rounded: '{rounded.control}'
    padding: 12px 20px
  button-link:
    textColor: '{colors.accent}'
    padding: 4px 0
  number-field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: 12px 14px
  tool-row:
    textColor: '{colors.ink}'
    padding: 20px 0
  tool-row-hover:
    backgroundColor: '{colors.raised}'
    textColor: '{colors.ink}'
  coach-task:
    backgroundColor: '{colors.coach-feature}'
    textColor: '{colors.coach-on-feature}'
    rounded: '{rounded.panel}'
    padding: 24px
  coach-guide:
    backgroundColor: '{colors.coach-guide}'
    textColor: '{colors.ink}'
    rounded: '{rounded.panel}'
    padding: 20px
  lesson-group:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.panel}'
  path-select:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: 10px 12px
    height: 48px
  theme-choice:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: 20px 4px
  theme-choice-selected:
    backgroundColor: '{colors.raised}'
    textColor: '{colors.accent}'
  bottom-navigation:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.muted}'
  projection-summary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.panel}'
    padding: 12px 16px
  first-sale:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.panel}'
    padding: 20px
---

# Design System: CashflowLens.MY — Pocket Coach

## Overview

**Creative North Star: "Pocket Coach"**

Pocket Coach makes financial education feel like a personal field guide. Warm ivory gives explanations room to breathe; forest panels frame the next useful task; sage actions and sand-toned guidance make the next small decision approachable. Inter, aligned monetary figures, thin boundaries, and familiar controls carry that character through lessons and calculators.

The system is mobile first. Useful titles lead into short explanations and visible actions. Home is a compact tool launcher with its main action inside the task panel. Phone tools use a back header and give their task the screen; form actions follow their inputs, while Compound preserves protected scrolling above one action bar. Complete navigation labels and wrapping result rows adapt to enlarged text. Empty results use a useful sentence, and native stage changes retain selector focus. Desktop adds a persistent sidebar and wider compositions. Theme changes preserve the same semantic relationships and readable hierarchy.

**Key Characteristics:**

- Warm ivory reading surfaces with forest task panels and sage actions.
- Direct, conversational headings and a readable single-family hierarchy.
- Flat tonal guidance, quiet link rows, and ordered learning paths.
- Visible navigation, protected fixed actions, and aligned monetary figures.
- Restrained state changes that respect device and saved motion preferences.

Implementation authority: `src/styles/theme.css` owns palette, type sizes, spacing, and radii. `src/styles/app.css`, `src/styles/mobile.css`, `src/sections/Navigation.css`, and `src/sections/RepeatSales.css` apply those roles. The tokens above record the implementation rather than defining an independent theme.

## Colors

Forest and sage establish the action hierarchy within warm ivory and sand neutrals. Unprefixed colors describe light mode; `dark-` entries record theme overrides.

### Primary

- **Forest Accent:** primary controls, selected navigation, meaningful icons, chart emphasis, and keyboard focus. Its dark-mode counterpart is pale sage.
- **On Accent:** the foreground paired with accent-filled controls; dark mode uses dark ink.
- **Coach Feature / On Feature / Feature Muted:** a forest task surface, warm light headings, and pale supporting text. Home and the phone first-sale receipt share these roles. Dark mode deepens the feature surface while preserving both foreground roles.
- **Coach Button / On Button:** the sage action and dark forest foreground inside the Home task panel. These roles remain stable across themes.

Positive, negative, warning, and information colors retain financial and chart meaning. Always carry that meaning in a label or explanation as well as color.

### Neutral

- **Warm Ground:** the app canvas, top bar, and desktop sidebar; dark mode uses a deep green-black ground.
- **Surface:** warm light forms, grouped lessons, mobile navigation, consultation panels, and projection summaries.
- **Raised:** selected options, navigation markers, and hover surfaces. The phone first-sale amount uses the forest feature role.
- **Coach Guide:** sand-toned guidance in the privacy panel in Settings. Its dark override is muted olive-green.
- **Ink / Muted:** primary reading text and supporting explanations. Placeholders use the muted role at full opacity.
- **Line / Control:** thin dividers and quiet panel boundaries versus stronger field and selection boundaries.

**The Semantic Pair Rule.** Resolve every foreground and surface through the current theme; keep coach feature, feature text, and feature action roles paired rather than substituting ordinary accent roles independently.

Legacy Tailwind names such as gold, navy, slate, emerald, and crimson map to semantic roles in `tailwind.config.js`. They are compatibility names, not extra brand colors. New UI uses the ledger and coach properties directly.

## Typography

**Display Font:** Inter, with UI and system sans-serif fallbacks.

**Body Font:** Inter, using the same stack.

**Character:** One variable family combines conversational headings with practical controls. Tight heading tracking contrasts with open body leading. Monetary values use tabular numerals rather than a separate display or monospace face.

The local Latin variable font lives at `public/fonts/inter-latin-variable.woff2`, is preloaded by `index.html`, and uses `font-display: optional`. Its license remains at `public/fonts/Inter-OFL.txt`.

### Hierarchy

- **Display / Feature:** retained responsive size tokens; the compact Home launcher currently uses Title for its introduction and Lead for its task heading, rather than these larger scales.
- **Consultation:** Compound titles, responsive from 28px to 32px above 767px with weight 600 and leading 1.25; phone consultation titles use 24px.
- **Title:** ordinary page headings and the Home introduction, reduced to 24px with leading 1.25 on phones. Existing lesson headings retain their separate responsive 24–32px range and leading 1.25.
- **Section / Lead / Subtitle:** smaller section headings, basket headings, and learning-path titles. Weights and leading follow their component context; grouped lesson titles use body size and weight 600.
- **Body / Label:** prose, primary form labels, and inputs. Body and inputs use 16px; labels use weight 500 and primary actions weight 600.
- **Small / Caption:** metadata, chart context, filter labels, navigation captions, and supporting status. They do not replace body text or primary input labels.

Introductory prose is capped at 50ch and task descriptions at 42ch; longer assumptions can reach 70ch. Projection amounts have their own responsive 32–42px treatment; the first-sale amount reaches 40–52px. Keep currency context and before-costs qualifications visible.

**The Reading Floor Rule.** Body text and inputs stay at 16px; reserve 14px and 12px for metadata and compact supporting labels.

**The Direct Heading Rule.** Begin a screen or section with its useful title; do not prepend decorative eyebrow labels.

## Layout

The rhythm starts at 4px. Reused gaps and insets come from the frontmatter scale; observed control and page insets also include 20px and 28px. App pages center within 1100px; Settings narrows to 840px from 768px. Phone pages and tools use 16px gutters and 20px top padding. At 768px, page padding becomes 40px vertically and 32px horizontally; desktop app pages begin 44px below the scrollport top.

On phones below 768px, a fixed header occupies 3.5rem (56px at default text size) plus the top safe area. Home, Learn, and Settings show four labeled destinations in a 4.5rem (72px) bottom bar plus the bottom safe area. The navigation observes label fit and changes from four columns to two when enlarged labels need more width; labels stay whole. The phone brand header omits currency context and keeps .MY intact. Opening any lesson or Compound replaces the brand header with a back link and tool title and removes the destination bar. These reservations grow with text size. Short phone viewports use a 3rem header and 3.5rem navigation with icons beside labels. From 768–1023px, the header and navigation retain their 64px and 68px sizes. From 1024px, a 232px sidebar replaces the bottom bar. Header, navigation, dialogs, and fixed actions account for safe-area insets.

The main element is the vertical scroll container, ending above destination navigation where present. Home has no fixed action dock: its sage action remains inside the forest task panel. Phone lesson workspaces extend to the bottom safe area, with Money Mirror and Wealth Thermometer actions after their fields in document flow. Compound alone reserves 4.75rem (76px) for its phone action bar above the bottom safe area, with no destination bar beneath it. The action switches between results, editing, and the next stage according to the current view. From 768px, Compound reserves 104px for its 88px summary positioned 8px above navigation; Money Mirror and Wealth Thermometer retain 84px lesson actions through 1023px. At 1024px, lesson actions return to document flow; Compound retains its summary until 1200px, then uses inline next actions.

Home stacks its short cashflow task and full-width action on phones; from 768px, they share a row. Task padding grows from 20px on phones to 32px and then 36px 40px at desktop. Two plain secondary rows open breathing room and repeat sales directly, followed by a Browse all 9 lessons link. Tool links form two columns from 768px.

Learning uses one labeled native path selector before compact lesson rows in three ordered path containers. Paths become three columns at 1200px; selecting one path keeps a single column within 720px. Continue is a plain link and Last opened a compact badge; both identify session context, never completion. Lesson workspaces place optional examples and their collapsed phone path navigation after the tool.

Compound's first-sale panel uses the app's 1100px maximum. Product story and amount stack below 1200px. On phones, a full-width Change control and customer context sit in a light product panel, followed by a forest amount panel and the next question. At 768–1199px the amount uses a raised panel. At 1200px, a 1.15:1 composition places story beside the amount; a vertical divider replaces the raised amount fill and a compact facts list becomes visible. A native stage selector replaces the four numbered step buttons on phones; all four stages remain directly accessible. Later phone stages show one of Edit plan or Results at a time. Wider screens show both panels in normal flow; the 1280px workspace becomes a 360px editor beside flexible results from 1200px, growing to 400px with a 32px gap at 1440px. Long-term scenario controls precede products in the editor, with assumptions below them.

The searchable native product dialog is a bottom sheet on phones and a centered panel up to 720px from 768px. Its list scrolls between stable controls and footer. Phone product rows place the price beneath the name and size; the 44px selection target spans the row. Charts grow from 210px to 270px high when their own container reaches 480px.

**The Protected Scrollport Rule.** End the content viewport above every fixed action dock and navigation bar; adding bottom padding alone does not establish this relationship.

## Elevation & Depth

Flat tonal surfaces and thin boundaries carry the visual structure. Forest task panels, sand guides, lesson groups, consultation panels, and the Compound summary use no decorative elevation. Appearance selection uses `inset 0 0 0 1px var(--ledger-accent)` as a selection stroke. The native product dialog dims its backdrop with `rgb(var(--ledger-ink-rgb) / .36)`. Existing lesson shadow effects are suppressed by the app stylesheet.

**The Quiet Depth Rule.** Use tone, spacing, and thin boundaries for structure; selection strokes and dialog dimming express state rather than decorative elevation.

## Shapes

Controls use restrained corners (8px); task panels, guides, grouped lessons, consultation panels, and results use softer corners (16px). The legacy radius base remains 12px for Tailwind compatibility. Thin borders (1px) separate panels and strengthen around fields. Circles belong to radio controls, numbered consultation markers, chart keys, status dots, and range handles. Phone navigation uses a raised full-link current marker; tablet navigation uses a marker around the active icon.

## Components

### Buttons

Legible, familiar actions with generous touch space.

- **Primary:** accent fill, paired on-accent text, control corners, a minimum 52px height, 12px icon gap, and padding from the component tokens.
- **Feature action:** the Home primary action uses sage fill and its dedicated dark foreground within the forest task panel. It is full width on phones and inline beside the copy from 768px.
- **Hover / Focus:** primary hover uses `brightness(.92)`; keyboard focus uses a 3px theme-aware accent outline with 4px offset. Disabled controls reduce opacity and lose the pointer cursor.
- **Text / Icon:** secondary text and icon actions retain a 44px target. Text actions underline on hover; icon actions gain a raised surface.

### Selectors and Context

Learning uses one associated native select with surface fill, control boundaries, 8px corners, 16px text, and a 48px minimum height. A Last opened badge uses the raised surface and accent foreground; it reports session context rather than progress.

Compound uses a native stage select on phones, paired with Step n of 4. Changing its value retains selector focus while returning the main scroll container to the top. Above 767px, four numbered buttons align horizontally with `aria-current="step"` on the current stage. All four stages can be visited directly. Later phone stages use two 48px Edit plan / Results buttons with `aria-pressed`, a raised selected surface, and an accent boundary; the selected panel alone is visible.

### Cards / Containers

The forest Home task uses coach feature colors and 16px corners and contains its sage action. Settings' privacy panel uses the sand-toned coach guide role. Learn's Continue shortcut is a plain text link.

Home tools are quiet link rows with horizontal rules, outline icons, and an arrow. They use no resting panel fill or rounded card shell. Grouped learning cards use a surface background, thin outer boundary, panel corners, and internal dividers. Their lesson rows use 16px padding on phones and 20px vertical / 16px horizontal padding on wider screens, with a raised hover surface. Focus draws inside the clipped group so it remains visible.

Money Mirror has its own user-selected Quick Worksheet page design; see the page override below. Wealth Thermometer retains compact label-and-value rows on phones, stacking for enlarged text. Phone Compound retains concise stage introductions and an underlined Edit plan / Results switch.

Wealth Thermometer's empty result is one useful sentence prompting monthly expenses; zone labels use text and semantic color.

### Inputs / Fields

Number fields have associated labels, surface fill, control boundaries, tabular figures, and a minimum 52px height. Error boundaries use the negative role with readable messages, `aria-invalid`, and associated help. Hints and validation remain body size. Compound search is at least 48px high; native selects and number controls are at least 44px. Range inputs retain a 44px interaction area and visible accent handle. Search focus outlines its containing field; placeholders use muted text at full opacity.

### Navigation

Destination screens show four icon-and-label links. Inactive destinations use muted text; the current destination uses accent text and a raised full-link marker on phones (an icon marker at tablet widths). Phone labels do not break inside words; measured label fit switches the bar to two columns when needed. The two-row bar reserves at least 128px and grows with text size. Phone tools replace the bar with a back header: lessons return to Learn, and Compound returns to Home. The back target is at least 44px and the title can wrap. Desktop uses the four destinations in sidebar rows with a raised full-row current state. Use semantic navigation and `aria-current="page"`. A visible-on-focus skip link reaches the focusable main scroll container; route changes reset that container and move focus to it.

### Appearance Choices

Three equal native radio labels offer Device, Light, and Dark. Surface fill, control boundaries, icons, and 20px vertical padding make them familiar controls. Selection adds raised fill and an accent inset stroke; keyboard focus uses the shared outline. Reduced motion is a native checkbox with a large clickable label. Light is the default; stored Light, Dark, and Device choices remain respected. Only appearance and motion preferences persist.

### First-sale Consultation

A light, flat panel pairs one product and one customer with a qualified first-sale amount. The product story retains its Change action and conversational next question. On phones, the forest receipt follows the light product story, before the next question. The Change action spans the product panel width. From 1200px, it becomes a side-by-side amount area with a divider and a facts list; those redundant facts stay hidden on smaller screens. Monetary amounts remain tabular and the Malaysia ABO / before-costs qualification stays adjacent.

The protected phone action bar is 76px at default text size and carries an action at least 52px high. In Edit plan, a live amount and qualification accompany View results. In Results, the action spans the bar and advances the early stages or returns to Edit plan in the final stage. Tablet summaries retain the amount and a 56px action; at 1200px, inline next actions replace the summary. The product picker uses native radio selection for changing the first product and checkbox selection for growing a basket.

### Learning Paths and Motion

Three ordered paths group nine lessons. Order is instructional; visits do not imply completed study. Keep the session-only Continue link, Last opened context, native path selector, three-step lesson navigation, and next-lesson link explicit. The path sequence follows the tool and starts collapsed behind View path on phones; wider screens show its three links. Native disclosures keep optional examples, Money Mirror's salary breakdown and hour slider, Wealth Thermometer's passive income, and Compound's assumptions available without overwhelming the main task.

State changes use color, boundary, or brightness rather than layout movement. Shared color transitions use 160ms ease-out. Device reduced motion and the saved preference reduce CSS animations and transitions to .01ms, limit animations to one iteration, and disable smooth scrolling; the existing runtime also pauses SVG animation. There is no shared entrance-animation system to copy.

## Do's and Don'ts

### Do:

- **Do** use ledger and coach theme roles for every foreground, surface, boundary, and state.
- **Do** keep body and input text at 16px and interactive targets at least 44px.
- **Do** keep the Home action inside its forest task panel, phone form actions after their fields, and protected scrolling above the Compound action bar.
- **Do** align monetary figures with tabular numerals and retain currency and before-costs context.
- **Do** pair semantic color with text and identify session context without implying completion.
- **Do** respect device theme and reduced-motion preferences alongside saved appearance settings.

### Don't:

- **Don't** add decorative eyebrow labels above useful headings.
- **Don't** treat legacy gold, navy, or white utility names as literal brand colors.
- **Don't** place fixed actions over scrollable content or remove safe-area allowances.
- **Don't** add decorative panel shadows or hard offset shadows to these flat tonal surfaces.
- **Don't** substitute an invented account balance or completion metric for educational examples and session context.
- **Don't** persist calculator inputs alongside appearance preferences.


## Page override: Money Mirror — Quick Worksheet

The user selected proposal 2 for a complete Money Mirror rewrite on 29 October 2026. This override supersedes its earlier Pocket Coach form layout; other screens retain the shared system above. Implementation lives in `src/sections/MoneyMirror.tsx` and `src/sections/MoneyMirror.css`.

The page uses an editorial off-white and graphite worksheet with a Georgia serif title, Inter controls, underlined numeric fields, thin receipt rules and citron result/action highlights. Light page colors are ground `#faf9f5`, ink `#242623`, muted `#62645c`, control `#81867b` and highlight `#e9ef9f`. Dark mode uses ground `#20231f`, ink `#f4f3e9`, muted `#c2c6b8`, control `#9aa48d` and highlight `#dce895`. The existing navigation shell and saved theme choice remain.

Four inputs form a two-by-two worksheet, followed immediately by the live result and a short receipt. Fields begin empty. Salary is required; clearly stated optional defaults are 44 work hours, zero commute and zero work costs. Try an example reveals three named scenarios; choosing one labels the output as an example and returns focus to the disclosure control. Editing clears the example designation. View my results moves focus to the result without requiring submission for calculation. Invalid values remove the stale result.

Compact field labels use 14px; input values use 22px with at least 48px targets. Below 18rem of form width the grid stacks, including at enlarged text sizes. Monetary results can wrap. At 1000px viewport width the input worksheet and result use two columns. All actions are in document flow, including on tablets; Money Mirror reserves no extra fixed-action dock.

Detailed deductions, time illustrations and the optional hours slider follow as disclosures. The receipt explicitly qualifies take-home as after work costs. All six calculation functions and the three example data sets are preserved; no new dependencies or persistent financial storage are introduced.
