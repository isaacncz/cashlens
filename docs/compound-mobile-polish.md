# Compound mobile polish and 100% repeat default

Impeccable's polish review found that padding and stacked result headings pushed the chart below the phone viewport, while the repeat assumption was only visible in editing. Results now uses a flatter composition, tighter spacing and a 190px phone chart. The plan-duration row wraps inline. Reset retains its visible label. A bordered direct percentage entry complements the existing slider, and the result explicitly states the active rate.

The user requested a 100% repeat-purchase default. Initialization, reset and invalid-rate fallback follow that default; users can still edit 0–100%. This is an editable assumption, not a forecast. First sale remains RM29.50, the yearly toothpaste example is RM118, and toothpaste plus Dish Drops/shampoo introduced in year 2 total RM712 over two years. Tests preserve explicit 50% scheduling, acquisition and attrition cases.

Production build, calculation suite, changed-file lint and whitespace checks pass. Full browser regression passes at 360/390/768/1280px. Mobile tests cover 320/375/430px, landscape and 200% text, including direct 50% entry and returning to 100%. PWA tests cover global-blue-v10→compound-v11. Twenty automated WCAG A/AA scans show no findings and fourteen measured contrast pairs pass. Captures under `.impeccable/review/compound-polish/` are ignored by Git; tests use Chromium emulation.

The detector ran once. Its thick-border warning points to the existing underlined view switch, whose corner radius is zero; remaining radius/type advisories predate this polish. Existing Impeccable metadata drift was not repaired. Desktop/phone/light/dark captures informed one small correction to the numeric input boundary, followed by confirmation.
