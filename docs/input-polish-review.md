# Impeccable input polish

29 October 2026. Scope: phone numeric entry in Money Mirror and Wealth Thermometer. The preceding paired-hour layout saved space but forced empty label height, left inconsistent input alignment and oversized fields for short numbers.

## Resolution

Use a consistent vertical sequence of compact rows: label and existing guidance on the left, a right-aligned numeric value on the right. The input remains approximately 52px high and 16px text. Quiet rules group each label/value pair; fields retain their native number keyboard, label association and validation.

The layout depends on form width in rem, not only device width. At less than 18rem of available space (including 200% root text), labels and inputs stack. Error messages span the entire row. Desktop layouts, copy, formulas and optional controls are preserved.

In the 375×812 captures the Money Mirror result action moves from approximately y=595 to y=486: about 109px less scrolling distance, with all four fields still visible. Wealth Thermometer's primary action also fits in this viewport. This is a measured layout improvement, not a claim of tested human task-completion speed.

## Review and verification

Read Impeccable context, the polish playbook and craft floor, plus the existing design system and rendered forms. No current critique snapshot was found. The mechanical detector ran once and returned no findings. One batched visual inspection covered mobile/desktop, dark mode, landscape and enlarged text; no correction batch was required.

Production build, changed-file lint and whitespace checks pass. Existing mobile journey tests verify 320×740, 375×812, 430×932, landscape 667×375, and 200% root text. Form completion, result focus, hidden optional error recovery and reflow pass. Accessibility scans report zero automated WCAG A/AA findings in 20 light/dark states and 14 passing contrast pairs. PWA testing verifies cache v6→v7 and offline restoration.

Screenshots and generated reports are in `.impeccable/review/input-polish/` (gitignored). These are local Chromium checks, not physical-device Safari testing. Impeccable reported a pre-existing stale design sidecar and an unset landing/showcase build-path preference; neither was repaired as a side effect of this polish.
