## Plan: SPC Migration Blueprint

Prepare and execute a safe, reversible migration from a single embedded Elementor payload into a structured local architecture: exact source markup preserved, raw snapshot backups captured in client files, SCSS split into layout/sections partials, and JS moved into a dedicated module. Use `.spc-` for newly introduced project-level utilities/components while keeping source section classes (`hero`, `intro`, etc.) unchanged unless technically required.

**Steps**
1. Phase 1 — Pre-flight and Watch Setup
- [x] Start `gulp watch` and keep it running during migration for live browser feedback.
- [x] Confirm compile targets and that only `style.scss` + `script.js` are build entry points.

2. Phase 2 — Root Execution Checklist File
- [x] Create root `plan.md` (workspace file) as execution checklist.
- [x] Include task sequence, section inventory, planned SCSS file mapping, migration status checkboxes.

3. Phase 3 — Source Snapshot (Fallback Safety)
- [x] Extract CSS from source payload into `src/scss/client.scss` as raw CSS only (no style tags, no SCSS conversion).
- [x] Extract JS from source payload into `src/js/client.js` as raw JS only (no script tags).
- [x] Keep indentation normalized to 4 spaces where formatting is touched.

4. Phase 4 — HTML Foundation in index.html
- [x] Populate `index.html` with the exact source wrapper + section markup in original order.
- [x] Preserve class names and IDs exactly (`hero`, `intro`, `whatis`, `itin-intro#itinerary`, `itinerary`, `included#included`, `fit`, `final-cta`).
- [x] Format to 4-space indentation without semantic changes.

5. Phase 5 — SCSS Architecture Split (Structured)
- [x] Move shared/global payload styles into layout partials (new files, registered in layout `_all.scss`).
- [x] Move section-specific styles into `components/sections/*` partials and register in sections `_all.scss`:
    - [x] `_hero.scss`
    - [x] `_intro.scss`
    - [x] `_whatis.scss`
    - [x] `_itin-intro.scss`
    - [x] `_itinerary.scss`
    - [x] `_included.scss`
    - [x] `_fit.scss`
    - [x] `_final-cta.scss`
- [x] Convert CSS syntax to SCSS syntax as needed in section/layout partials, keeping behavior unchanged first pass.

6. Phase 6 — JS Migration into Runtime Entry
- [x] Port logic from `client.js` snapshot into modular runtime structure in `src/js/script.js`, preserving behavior.
- [x] Keep `client.js` as untouched backup reference.

7. Phase 7 — Namespace and Guide Alignment
- [x] Update `Guide.md` to `.spc-` project convention and clarify `.gp-` is historical reference only.
- [x] Preserve note that original section class names from source remain intact for fidelity.

8. Phase 8 — Validation and Regression Check
- [x] Verify Gulp watch builds without errors.
- [x] Run one clean build (`npx gulp`) to confirm outputs.
- [x] Manual checks at desktop + responsive breakpoints (especially <=920px logic and overlay header behavior).
- [x] Validate CTA links, video, and poster references.

**Validation Results (Desktop 1086px)**
- [x] All 8 sections render (hero, intro, whatis, itin-intro, itinerary, included, fit, final-cta)
- [x] Hero section displays with video background (16:9, desktop video loading)
- [x] Video controls stripped (controls attribute false, no visible controls UI)
- [x] Video poster set to Google Drive thumbnail (valid URL)
- [x] Hero meta grid displays 4 columns (212px each)
- [x] Journey path SVG visible on desktop
- [x] Section padding/margins correct (140px, 120px, 160px, 80px as designed)
- [x] Reveal animation classes applied (.reveal class present on 14 elements)
- [x] Intersection observer triggering on scroll (threshold: 0.15)
- [x] CTA links functional:
  - [x] "Reserve a Cabin" → https://secure.sailpercabin.com/request-booking-call
  - [x] "Download Charter Guide" → https://free-download.sailpercabin.com/
- [x] Button hover states working (gradient button, ghost button styles)
- [x] Body.spc-page-overlay-header class added by JS
- [x] Compiled CSS includes all media queries (@media max-width: 920px)
- [x] Mobile media query rules present:
  - [x] Journey path display: none on mobile
  - [x] Hero min-height: 640px on mobile
  - [x] Hero padding: 80px 24px 50px on mobile
  - [x] Meta grid columns adjusts for mobile

**Build Status**
- [x] SCSS compiles: 9.48ms (no errors)
- [x] JavaScript compiles: 9.68ms (no errors)
- [x] Source maps generated
- [x] Output files verified in assets/css and assets/js

**Section Inventory (Source Order)**
1. `hero`
2. `intro`
3. `whatis`
4. `itin-intro` (`id="itinerary"`)
5. `itinerary`
6. `included` (`id="included"`)
7. `fit`
8. `final-cta`

**Planned SCSS File Map**
- Layout
    - `src/scss/components/layout/_spc-base.scss`
    - `src/scss/components/layout/_spc-typography.scss`
    - `src/scss/components/layout/_spc-buttons.scss`
    - `src/scss/components/layout/_spc-wordpress-overrides.scss`
    - `src/scss/components/layout/_spc-animations.scss`
- Sections
    - `src/scss/components/sections/_hero.scss`
    - `src/scss/components/sections/_intro.scss`
    - `src/scss/components/sections/_whatis.scss`
    - `src/scss/components/sections/_itin-intro.scss`
    - `src/scss/components/sections/_itinerary.scss`
    - `src/scss/components/sections/_included.scss`
    - `src/scss/components/sections/_fit.scss`
    - `src/scss/components/sections/_final-cta.scss`

**Notes**
- Keep source section class names unchanged unless a technical blocker requires change.
- `client.scss` and `client.js` are raw backup snapshots only.
- `REPLACE_WITH_MOBILE_STATIC_IMAGE_URL` placeholder will be preserved unless you provide final URL.
