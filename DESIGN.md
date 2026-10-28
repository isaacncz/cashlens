---
name: "CashflowLens.MY — Calm Ledger"
description: "A quiet, readable space for Malaysian financial education."
colors:
  ground: "rgb(246 248 250)"
  surface: "rgb(255 255 255)"
  raised: "rgb(237 243 239)"
  ink: "rgb(24 40 33)"
  muted: "rgb(79 97 86)"
  accent: "rgb(33 100 71)"
  positive: "rgb(35 106 71)"
  negative: "rgb(171 48 48)"
  warning: "rgb(131 89 17)"
  info: "rgb(40 94 124)"
  line: "rgb(211 222 216)"
  control: "rgb(117 138 125)"
  on-accent: "#ffffff"
  dark-ground: "rgb(18 28 23)"
  dark-surface: "rgb(26 39 31)"
  dark-raised: "rgb(36 53 42)"
  dark-ink: "rgb(238 244 239)"
  dark-muted: "rgb(182 201 187)"
  dark-accent: "rgb(160 209 178)"
  dark-positive: "rgb(142 218 171)"
  dark-negative: "rgb(255 168 163)"
  dark-warning: "rgb(232 198 129)"
  dark-info: "rgb(154 203 232)"
  dark-line: "rgb(61 82 68)"
  dark-control: "rgb(123 151 131)"
  dark-on-accent: "#122018"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  section:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 550
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 550
    lineHeight: 1.6
    letterSpacing: "-0.02em"
  subtitle:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 550
    lineHeight: 1.6
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.6
  small:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "8px"
  panel: "16px"
  legacy-base: "0.75rem"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  button-link:
    textColor: "{colors.accent}"
    padding: "4px 0"
  number-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  tool-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  tool-card-hover:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
  filter-chip:
    textColor: "{colors.accent}"
    rounded: "{rounded.control}"
    padding: "4px 12px"
  filter-chip-selected:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.accent}"
  theme-choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "20px 4px"
  theme-choice-selected:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.accent}"
  bottom-navigation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
  projection-summary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
---

# Design System: CashflowLens.MY — Calm Ledger

## Overview

**Creative North Star: "Calm Ledger"**

Calm Ledger makes financial education feel like a usable personal space. Green-tinted paper, forest ink, aligned monetary figures, and quiet surface steps give calculators the readability of a well-kept notebook. Direct titles introduce the task; short explanations and familiar controls keep the next action clear.

The system is mobile first. Its signature is a protected scrolling area above a reachable action dock: a primary action must never cover the content it acts on. Desktop adds a persistent sidebar and room for side-by-side tools while keeping the same hierarchy. Light and dark themes preserve these roles rather than introducing a separate visual identity.

**Key Characteristics:**

- Paper-like tonal surfaces with restrained forest accents.
- Direct headings, readable controls, and aligned monetary figures.
- Protected content above thumb actions and persistent navigation.
- Quiet state changes that respect device and user motion preferences.

Implementation authority: `src/styles/theme.css` owns palette, type sizes, spacing, and radii. `src/styles/app.css`, `src/sections/Navigation.css`, and `src/sections/RepeatSales.css` apply those roles. The YAML above records the shipped values; it does not introduce a second implementation theme.

## Colors

The palette uses a single forest accent within green-tinted neutrals, with distinct semantic colors for financial signals and chart series. Frontmatter colors without a prefix describe light mode; `dark-` entries are their dark-mode counterparts.

### Primary

- **Forest Accent:** actions, selected navigation, meaningful icons, chart emphasis, and keyboard focus. Dark mode uses a pale sage equivalent so the role stays legible.
- **On Accent:** content on filled accent controls. Use the paired token for the active theme; dark filled controls use dark ink.

Positive, negative, warning, and information colors communicate outcomes or distinguish labeled data series. Keep meaning visible in text as well as color. The illustrative salary breakdown uses warning for deductions, information for work costs, and accent for what remains.

### Neutral

- **Paper Ground:** the app canvas, top bar, and desktop sidebar; **Night Ground** is its dark counterpart.
- **Surface:** cards, inputs, mobile navigation, and the projection summary.
- **Raised:** task panels, selected options, active navigation markers, and hover surfaces. This is a tonal step, not a promise of shadow elevation.
- **Ink / Muted:** primary reading text and supporting explanations respectively. Muted text remains readable; it is not a disabled state.
- **Line / Control:** quiet separators and panel borders versus stronger input and selection boundaries.

**The Semantic Pair Rule.** Resolve every foreground and surface through the current theme; never carry a light-mode fill or its foreground into dark mode on its own.

Legacy Tailwind names such as gold, navy, slate, emerald, and crimson map to these roles in `tailwind.config.js`. They are compatibility aliases, not additional brand colors. New UI uses the semantic ledger properties.

## Typography

**Display Font:** Inter, with UI and system sans-serif fallbacks.

**Body Font:** Inter, using the same stack.

**Character:** A single variable family supplies a systematic, approachable hierarchy. Moderately tight headings contrast with open body leading; numeric results use tabular figures rather than a separate display or monospace face.

The local Latin variable font lives at `public/fonts/inter-latin-variable.woff2` (48,256 bytes), is preloaded by `index.html`, and uses `font-display: optional`. Its license is retained at `public/fonts/Inter-OFL.txt`.

### Hierarchy

- **Display:** the Home introduction; responsive size and tight tracking are recorded in the frontmatter.
- **Title:** ordinary page headings. Lesson headings use a separate responsive range (`clamp(24px, 4vw, 32px)`) with compact leading (1.25).
- **Section:** the main task-panel heading. Smaller sections and lesson titles use the subtitle role, with weight 600 for section labels and 550 for lesson titles.
- **Lead:** basket headings and compact projection emphasis.
- **Body / Label:** prose and all primary form labels and inputs. Primary buttons and card titles use weight 600; field labels use weight 500.
- **Small / Caption:** metadata, chart labels, navigation captions, and supporting status. They do not replace body text or input labels.

Introductory copy is capped at 50ch; task descriptions at 42ch. Longer assumptions can reach 70ch. Use tabular figures for monetary results, prices, and chart readouts; keep currency context visible.

**The Reading Floor Rule.** Body text and inputs stay at 16px; reserve 14px and 12px for metadata and compact supporting labels.

**The Direct Heading Rule.** Begin a screen or section with its useful title; do not prepend decorative eyebrow labels.

## Layout

The spatial rhythm starts at 4px. Reused gaps and insets come from the frontmatter scale; observed page and control insets also include 20px and 28px. Pages are centered within a maximum width (1100px); Settings narrows to 840px from tablet size. Mobile page gutters are 20px, narrowing to 16px below 381px. From 768px, gutters become 32px and page padding becomes 40px; desktop begins its main content at 44px from the top of the scrollport.

The fixed top bar is 64px plus the top safe-area inset. Below 1024px, four equal bottom destinations—Home, Learn, Compound, Settings—occupy 68px plus the bottom safe-area inset. From 1024px, navigation becomes a 232px sidebar and the content area begins to its right. Labels remain visible in both forms. Top bar, navigation, and docks account for device safe areas.

The main element is the vertical scroll container. Its bottom edge stops above navigation, rather than letting the document scroll underneath it. Home, Money Mirror, and Wealth Thermometer reserve an additional 84px for their action dock. Compound reserves 104px for its summary. Primary action buttons sit 12px above bottom navigation; the 88px Compound summary sits 8px above it. At desktop size, ordinary action docks return to document flow; Compound retains its summary reserve until 1200px.

Home tools become two columns at 768px. Learning uses three ordered paths, each with three compact lesson rows; path groups become three columns at 1200px. Topic filters keep any one path available on its own. The illustrative salary breakdown also appears alongside the task description. Compound begins with a focused first-sale panel within 900px. Its four consultation stages reveal repeat purchasing, year-based product additions and the longer-term plan. At 1200px, the later stages use a 360px product plan beside a flexible result panel, separated by 24px; from 1440px the plan grows to 400px with a 32px gap. Both panels flow normally so all controls remain reachable, and desktop next actions replace the mobile dock. The searchable catalog uses a native modal bottom sheet on phones and a centered 720px panel from 768px, with a scrolling list between fixed controls and its footer. The chart grows from 210px to 270px high when its own container reaches 480px.

**The Protected Scrollport Rule.** End the content viewport above every fixed action dock and navigation bar; adding bottom padding alone does not establish this relationship.

## Elevation & Depth

Tonal surfaces and thin boundaries provide most depth. Panels and the Compound summary are flat. The mobile primary-action dock uses one soft separation shadow (`0 4px 16px rgb(var(--ledger-ink-rgb) / .12)`), removed when it returns to desktop flow. A selected appearance option uses an inset accent stroke (`inset 0 0 0 1px var(--ledger-accent)`), which expresses selection rather than elevation. Existing lesson shadow effects are suppressed by the app stylesheet.

**The Quiet Depth Rule.** Use surface tone and borders for structure; reserve the soft dock shadow for a floating primary action.

## Shapes

Controls use restrained corners (8px); task panels, tool cards, lesson cards, and results use softer corners (16px). The legacy radius base remains 12px for Tailwind compatibility. Thin borders (1px) separate panels and strengthen around controls. Circles belong to radio controls, chart keys, status dots, and range handles; they do not replace the panel silhouette. Mobile navigation uses a small rounded marker around the active icon.

## Components

### Buttons

Calm, legible actions with generous touch space.

- **Primary:** accent fill, paired on-accent text, control corners, and padding from the component tokens. Minimum height is 52px; icon and label have a 12px gap.
- **Hover / Focus:** primary hover uses `brightness(.92)`; keyboard focus uses a 3px accent outline with 4px offset. Disabled buttons reduce opacity and lose the pointer cursor.
- **Text:** accent-colored controls retain a minimum 44px target. Compound text buttons underline on hover; filters and secondary expansion controls add a control-colored border.

### Chips

Compound uses four numbered, clickable consultation steps with aria-current="step". The initial selection is one product and one customer. The searchable product picker keeps category filters visible; its checkbox mode grows the plan, and its radio mode changes the first product. Product rows are grouped by Start year, with native year and purchase-cycle selects. The long-term horizon uses a labeled native select; Custom duration reveals a range for any month. Total revenue is the default chart, with an optional By category checkbox.

### Cards / Containers

Tool and lesson links combine a surface background, line border, panel corners, a meaningful outline icon, and a directional arrow. Tool cards use 20px padding; lesson cards use 20px vertical and 16px horizontal padding. Hover moves to the raised surface and strengthens the border. The Home task card instead uses a raised background with 24px padding on phones and 32px from tablet size.

### Inputs / Fields

Number fields have an explicit label, surface fill, control border, tabular figures, and a minimum 52px height. Error borders use the negative role and an associated readable message. `aria-invalid` and `aria-describedby` connect state and help text. Hints and validation text remain body size. Compound search and number controls use a 48px minimum; range inputs provide a 44px interaction track area with a visible accent handle.

### Navigation

The mobile bar shows four icon-and-label links. Inactive links use muted text; the current destination uses accent text and a raised icon marker. The desktop sidebar uses the same destinations in horizontal rows, with a raised full-row active state. Use semantic navigation and `aria-current="page"`. A keyboard-visible skip link leads to the focusable main scroll container. Route changes reset that container to the top and move focus to it.

### Appearance Choices

Light is the default for new visits, independent of device appearance. Saved Device and Dark choices remain valid. Three equal native radio labels offer Device, Light, and Dark. Each has a control border, surface fill, 20px vertical padding, and a meaningful icon. Selection adds a raised fill and accent inset stroke; focus within adds the shared visible outline. Reduced motion uses a native checkbox with a large clickable label. Only theme and motion preferences persist on the device.

### Projection Summary

A compact, flat summary sits above mobile navigation and carries the live amount plus a labeled action with a minimum 56px height. Its amount uses tabular figures and a smaller currency label. The amount remains visible while its action advances the consultation. In the final planner, its action switches between View projection and Edit basket according to the visible panel. It disappears at the two-column desktop breakpoint, where the consultation next action appears in normal flow. Results, examples, and estimates must be labeled according to their actual meaning; an illustrative salary breakdown is not a personal account balance.

Motion is supporting behavior. Device reduced motion and the saved preference both shorten CSS animation and transition duration to .01ms, limit animations to one iteration, disable smooth scrolling, and pause SVG animation. There is no separate shared entrance-animation system to copy.

### Learning paths

Learning is organized into Understand your money (Money Mirror, Assets & liabilities, Cashflow Quadrant), Build breathing room (Debt Visualizer, Salary & wealth, Wealth Thermometer), and Put it into practice (Income Engine, Rat Race, money playbook). Rows show order within a path, not completion. A session-only Continue link resumes the last-opened tool. Each lesson has a three-step navigation bar and a next lesson in the learning sequence. No visit is presented as completed study.

The salary breakdown remains interactive inside a native disclosure. Forms use white surfaces and visible input boundaries in light mode; the page ground is neutral and selection uses the raised green surface. Semantic information blue replaces the old pale cyan on light surfaces.

## Do's and Don'ts

### Do:

- **Do** use the ledger theme properties for every foreground, surface, boundary, and state.
- **Do** keep body and input text at 16px and interactive targets at least 44px.
- **Do** preserve the protected scrollport when adding or resizing a fixed action.
- **Do** align monetary figures with tabular numerals and show their currency context.
- **Do** pair semantic color with text and label examples and estimates clearly.
- **Do** respect device theme and reduced-motion preferences alongside the user's settings.

### Don't:

- **Don't** add decorative eyebrow labels above useful headings.
- **Don't** treat legacy gold, navy, or white utility names as literal brand colors.
- **Don't** place fixed actions over scrollable content or remove safe-area allowances.
- **Don't** introduce decorative panel shadows or hard offset shadows into this quiet surface system.
- **Don't** present an illustrative financial value as a user's balance.
- **Don't** persist calculator inputs alongside appearance preferences.
