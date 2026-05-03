# Project Guide

## 1. Overview

This is a static HTML/CSS/JS project built with a custom Gulp 5 pipeline. The project is used to convert design into a hand-coded HTML page. The SCSS architecture is designed to be modular, scalable, and responsive — built around a component registry pattern and the `include-media` library for breakpoints.

---

## 2. Build System

### Tech Stack
| Tool | Role |
|---|---|
| **Gulp 5** | Task runner |
| **gulp-sass** (Dart Sass) | SCSS → CSS compilation |
| **postcss + autoprefixer** | Vendor prefixing |
| **cssnano** | CSS minification (production) |
| **browserify + babelify** | JS bundling + ES6 transpilation |
| **browser-sync** | Local dev server with live reload |

### Commands
```bash
npm run dev          # Start dev server with file watching + live reload
npm run production   # Build + minify + zip for delivery
```

### Output
- SCSS compiles to `assets/css/style.css` (expanded) and `assets/css/style.min.css` (minified)
- JS compiles to `assets/js/script.js` and `assets/js/script.min.js`
- Source maps are generated alongside both output files

### Export / Production Build
Running `npm run production` also zips the project for delivery. The zip manifest is controlled by `export-manifest.json` at the root — it lists which files/directories are included and auto-increments the patch version on each run.

---

## 3. SCSS Architecture

### Entry Point
```
src/scss/style.scss
```
This is the single SCSS entry point. Everything is loaded here via `@include meta.load-css(...)`. The load order is:

```
1. partials/_css-variables.scss   ← CSS custom properties (:root vars)
2. partials/_globalimport.scss    ← Sass variables, mixins, mediaquery (makes them available)
3. partials/_normalize.scss       ← CSS reset
4. (box-sizing reset in style.scss itself)
5. components/utils/_utils.scss   ← Utility / helper classes
6. components/layout/_all.scss    ← Layout component registry
7. components/sections/_all.scss  ← Section-specific style registry
```

### `@scss` Path Alias
All SCSS files can import using the alias `@scss/` which resolves to `src/scss/`. This is configured in `gulpfile.js` via a custom Sass importer (`scssAliasImporter`).

```scss
// Example — import mediaquery from anywhere in the project:
@use '@scss/partials/mediaquery' as mq;
```

---

## 4. Partials Reference

### `src/scss/partials/_css-variables.scss`
Defines all CSS custom properties inside `:root {}`. This is where you register design tokens for the project — colors, spacing, font families, transitions, etc.

```scss
:root {
    --spc-color-white: #ffffff;
    --spc-color-gray: #b0b0b0;
    --spc-font-family-neue: 'Neue Haas Grotesk', sans-serif;
    --spc-container-side-gutter: 90px;
    /* etc. */
}
```

All components reference these vars. Never hard-code values that belong here.

### `src/scss/partials/_variables.scss`
Sass variables (not CSS custom properties). Used inside mixins and Sass-compile-time logic only. Currently holds basic typography and color seeds.

```scss
$fontSize: 16px;
$lineHeight: 22px;
$primaryColor: #077174;
```

### `src/scss/partials/_globalimport.scss`
Loaded early via `style.scss`. It `@use`s `_variables.scss`, `_mixin.scss`, and `_mediaquery.scss` — making those available to files that load after it via the `meta.load-css` cascade.

> **Note:** Individual component files that need the mediaquery mixin must still declare `@use '@scss/partials/mediaquery' as mq;` at the top — Sass modules are not globally injected.

### `src/scss/partials/_normalize.scss`
Standard CSS reset/normalize. Do not modify.

### `src/scss/mixins/_mixin.scss`
Collection of reusable Sass mixins. Import with:
```scss
@use '@scss/mixins/mixin' as mx;
```

Available mixins:

| Mixin | Signature | Purpose |
|---|---|---|
| `regularTextStyling` | `($fsize, $lheight, $fweight, $fontFamily)` | Standard font shorthand |
| `displayFlex` | `($alignItems, $justifyContent)` | Quick flex setup |
| `loadTransition` | `($easing)` | Single `.2s` transition |
| `loadTransitionAll` | `($easing)` | `transition: all .2s` |
| `addTransitionFor` | `($for, $duration, $easing)` | Targeted transition |
| `generateSpacingAttr` | `($type, $direction, $value)` | Padding/margin shorthand |
| `generateBorderAttr` | `($type, $width, $style, $color)` | Border shorthand |
| `resetListStyle` | — | Remove list bullets/padding |
| `calculateHeight` | `($init, $final, $operator)` | `calc()` height helper |

---

## 5. Responsive Design — `include-media`

### How It Works
The project uses the [`include-media`](https://eduardoboucas.github.io/include-media/) Sass library, located at `src/scss/partials/_mediaquery.scss`.

Import it in any component file:
```scss
@use '@scss/partials/mediaquery' as mq;
```

Then use the `mq.media()` mixin:
```scss
.my-element {
    font-size: 24px;

    @include mq.media('<=767px') {
        font-size: 16px;
    }
}
```

### Operators
| Operator | Meaning |
|---|---|
| `>=` | min-width (inclusive) |
| `>` | min-width (exclusive) |
| `<=` | max-width (inclusive) |
| `<` | max-width (exclusive) |

### Named Breakpoints (`$breakpoints`)
Defined in `_mediaquery.scss`. Use label names as shorthand:
```scss
@include mq.media('>=tablet') { ... }
@include mq.media('<desktop') { ... }
```

> Check `_mediaquery.scss` for the full list of named breakpoints.

### Device-Specific Expressions (`$media-expressions`)
For targeting specific devices by exact viewport, use named expressions:
```scss
@include mq.media('iphonex')     { ... }
@include mq.media('galaxys')     { ... }
@include mq.media('galaxyzfold') { ... }
@include mq.media('ipadpro')     { ... }
```

### Range Queries
Combine two conditions:
```scss
@include mq.media('>=768px', '<=1024px') { ... }
@include mq.media('>767px', '<=990px')   { ... }
```

---

## 6. Naming Convention

### Class Prefix
All project-level components and utilities use the `.spc-` prefix (stands for "Sail Per Cabin"). Keep this consistent on all new components.

**Note:** Section class names (`hero`, `intro`, `whatis`, etc.) are preserved exactly from the source HTML for fidelity. Component and layout classes use `.spc-` prefix.

### BEM-like Structure
```
.spc-[component]
.spc-[component]-[element]          ← modifier with dash
.spc-[component]__[element]         ← sub-element with double underscore
.spc-[component]__[element]--[mod]  ← element modifier
.-[modifier]                        ← state/utility modifier (leading dash)
```

### SCSS Nesting Example
```scss
.spc-card {
    $base: &;

    &__title { ... }
    &__body  { ... }

    &.-featured {
        #{$base}__title { color: red; }
    }
}
```

### State/Utility Modifiers
Single-dash classes like `.-start`, `.-visible`, `.-active` are state modifiers applied via JS or HTML conditionally. They never carry standalone layout — only overrides.

---

7. Adding a Layout Component

Layout components are structural, reusable elements that appear across sections (e.g., header, footer, a card grid, an image frame).

1. Create a new file in `src/scss/components/layout/`:
   ```
   src/scss/components/layout/_spc-my-component.scss
   ```

2. Inside the file, use the standard structure:
   ```scss
   @use '@scss/partials/mediaquery' as mq;

   .spc-my-component {
       // styles

       @include mq.media('<=767px') {
           // mobile overrides
       }
   }
   ```

3. Register it in `src/scss/components/layout/_all.scss`:
   ```scss
   @use "sass:meta";

   @include meta.load-css('./_spc-my-component.scss');
   ```

---

## 8. Adding a Section

Section styles are specific to a named page section (e.g., hero, about, itinerary). Each section gets its own file.

1. Create a new file in `src/scss/components/sections/`:
   ```
   src/scss/components/sections/_hero.scss
   ```

2. Style the section inside, scoped to a wrapper class:
   ```scss
   @use '@scss/partials/mediaquery' as mq;

   .spc-hero {
       // hero styles

       @include mq.media('<=767px') {
           // mobile overrides
       }
   }
   ```

3. Register it in `src/scss/components/sections/_all.scss`:
   ```scss
   @use "sass:meta";

   @include meta.load-css('./_hero.scss');
   ```

---

## 9. Utility Classes (`_utils.scss`)

The file `src/scss/components/utils/_utils.scss` is intentionally blank. Only add utility classes here when a pattern is genuinely reused across multiple sections or components. Do not pre-populate speculatively.

Example of what belongs here:
```scss
@use '@scss/partials/mediaquery' as mq;

.-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
}

.-text-center { text-align: center; }
.-text-left   { text-align: left; }
.-text-right  { text-align: right; }
```

---

## 10. JavaScript Architecture

### Entry Point
```
src/js/script.js
```
All JS starts here inside a `DOMContentLoaded` listener:
```js
document.addEventListener('DOMContentLoaded', () => {
    // init code here
});
```

### Directory Structure
| Path | Purpose |
|---|---|
| `src/js/script.js` | Entry point |
| `src/js/classes/` | ES6 classes (e.g., `Slider.js`, `Modal.js`) |
| `src/js/utils/` | Utility/helper functions (e.g., `debounce.js`, `getEl.js`) |

Import into `script.js`:
```js
import Slider from './classes/Slider.js';
import { debounce } from './utils/debounce.js';
```

Browserify + Babelify handles bundling and ES6 transpilation automatically.

---

## 11. HTML Structure Convention

The HTML lives in `index.html` at the project root. Browser-sync watches it and reloads on change.

General structure to follow:
```html
<body>
    <header class="spc-header"> ... </header>

    <main class="site-content">
        <div class="page-container">

            <section class="spc-section spc-hero">
                <div class="spc-section__inner"> ... </div>
            </section>

            <!-- more sections -->

        </div>
    </main>

    <footer class="spc-footer"> ... </footer>
</body>
```

- `spc-section` = base section wrapper (handles negative gutters)
- `spc-section__inner` = content container with max-width and padding
- `page-container` = outer page padding shell

---

## 12. CSS Custom Properties vs Sass Variables

| Use Case | Which to Use |
|---|---|
| Values consumed by CSS at runtime (theming, responsive overrides via `--var` reassignment inside media queries) | CSS custom property in `_css-variables.scss` |
| Values only needed at Sass compile-time (inside mixins, `@each`, `@if`, calculations) | Sass variable in `_variables.scss` |

CSS custom properties can be overridden inside media queries or child selectors, making them ideal for responsive values:
```scss
.spc-section__inner {
    padding-top: var(--spc-section-pt, 80px);

    @include mq.media('<=767px') {
        --spc-section-pt: 40px;
    }
}
```

---

## 13. File Structure Reference

```
site/
├── index.html                        ← HTML entry point
├── gulpfile.js                       ← Gulp build config
├── package.json                      ← Dependencies & scripts
├── export-manifest.json              ← Controls production zip output
├── Guide.md                          ← This file
├── assets/
│   ├── css/
│   │   ├── style.css                 ← Compiled CSS (dev)
│   │   └── style.min.css             ← Minified CSS (production)
│   ├── js/
│   │   ├── script.js                 ← Compiled JS (dev)
│   │   └── script.min.js             ← Minified JS (production)
│   └── media/                        ← Images, videos, fonts
└── src/
    ├── js/
    │   ├── script.js                 ← JS entry point
    │   ├── classes/                  ← ES6 class files
    │   └── utils/                    ← JS utility functions
    └── scss/
        ├── style.scss                ← SCSS entry point
        ├── client.scss               ← (reserved for client-specific overrides)
        ├── mixins/
        │   └── _mixin.scss           ← Reusable Sass mixins
        ├── partials/
        │   ├── _css-variables.scss   ← CSS custom properties (:root)
        │   ├── _variables.scss       ← Sass compile-time variables
        │   ├── _globalimport.scss    ← Imports variables + mixin + mediaquery
        │   ├── _normalize.scss       ← CSS reset
        │   └── _mediaquery.scss      ← include-media library + breakpoints
        └── components/
            ├── utils/
            │   └── _utils.scss       ← Utility classes (add only when needed)
            ├── layout/
            │   └── _all.scss         ← Layout component registry
            └── sections/
                └── _all.scss         ← Section style registry
```
