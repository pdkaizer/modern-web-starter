# Web Starter

A lean, opinionated HTML/CSS/JS starter for building small websites and web applications.
No frameworks. No build step required to get going. Strong architectural opinions baked in.

---

## What's included

- **CSS Cascade Layers** — explicit layer order eliminates specificity conflicts
- **Three-tier design token system** — primitives → semantic → component tokens
- **Light & dark mode** — respects `prefers-color-scheme`; persistent manual override
- **Fluid typography** — `clamp()`-based heading scale across viewport widths
- **Semantic HTML** — accessible, meaningful markup on every page
- **Four page layouts** — home, landing, article, sidebar, full-width/dashboard
- **Vanilla JS** — theme toggle, mobile nav, scroll-triggered reveal animations
- **Open Graph tags** — `og:type`, `og:url`, `og:title`, `og:description`, `og:image` on every page
- **CLAUDE.md** — comprehensive context file for AI-assisted development

---

## File structure

```
/
├── index.html                  # Home / component showcase
├── pages/
│   ├── landing.html            # Marketing landing page layout
│   ├── article.html            # Long-form prose layout with TOC
│   ├── sidebar.html            # Content listing with filter sidebar
│   └── full-width.html         # App shell / dashboard layout
├── css/
│   ├── main.css                # Entry point — layer order, imports
│   ├── tokens.css              # Design tokens (primitives → semantic → component)
│   ├── reset.css               # Opinionated modern reset
│   ├── base.css                # Global element styles
│   ├── components.css          # Reusable UI component classes
│   └── utilities.css           # Single-purpose utility classes
├── js/
│   └── main.js                 # Theme toggle, mobile nav, scroll utilities
└── images/                     # Static image assets (og-image.png, favicons, etc.)
```

---

## Getting started

No build step required for development. Open directly in a browser:

```bash
git clone https://github.com/your-handle/web-starter.git
cd web-starter
open index.html   # or use a local dev server
```

For a better local dev experience with live reload:

```bash
npx serve .
# or
npx browser-sync start --server --files "**/*.html, css/*.css, js/*.js"
```

---

## CSS architecture

Layer order is declared once in `css/main.css`:

```css
@layer reset, tokens, base, components, utilities;
```

Later layers win over earlier ones, regardless of specificity. This means utilities
always override components, which always override base styles — by rule, not by accident.

```
css/
├── main.css        ← Entry point. Declares layer order, imports all partials.
├── tokens.css      ← All CSS custom properties. Three-tier hierarchy.
├── reset.css       ← Modern browser reset.
├── base.css        ← Semantic element defaults (h1, p, a, input, table…).
├── components.css  ← Reusable UI patterns (.card, .btn, .site-nav, .prose…).
└── utilities.css   ← Single-purpose helpers (.flex, .mt-8, .text-secondary…).
```

### Extending the styles

New **components** go in `components.css`, inside `@layer components { }`.
New **utilities** go in `utilities.css`, inside `@layer utilities { }`.
Never write styles outside a layer block — unlayered styles beat everything.

---

## Design tokens

All tokens are CSS custom properties defined in `css/tokens.css`.

**Primitive tokens** hold raw values:
```css
--color-amber-500: #d97706;
--space-4: 1rem;
```

**Semantic tokens** map purpose to primitives — these are what you use everywhere:
```css
--text-primary:    var(--color-gray-950);
--surface-page:    var(--color-gray-50);
--accent-default:  var(--color-amber-500);  /* decorative only */
--accent-fg:       var(--color-amber-700);  /* text/interactive — passes 4.5:1 */
```

**Dark mode** is handled entirely in the token layer. Components reference semantic tokens
only — they have no knowledge of which theme is active.

---

## Theming

Dark mode is set via a `data-theme` attribute on `<html>`:

```html
<html data-theme="dark">
```

The JavaScript in `js/main.js` manages this automatically:

- **Default:** reads `prefers-color-scheme` from the OS
- **Override:** user's manual choice is persisted to `localStorage`
- **Anti-flash:** a small inline `<script>` in each page's `<head>` applies the theme
  before the page renders — preventing a flash of the wrong theme

---

## Page layouts

| File | Layout pattern |
|------|----------------|
| `index.html` | Home page with hero, feature grid, component showcase |
| `pages/landing.html` | Marketing landing with hero, features, testimonials, pricing |
| `pages/article.html` | Long-form prose with reading progress, TOC, author card |
| `pages/sidebar.html` | Content listing with sticky filter sidebar |
| `pages/full-width.html` | App shell with sidebar nav and data table |

---

## JavaScript

`js/main.js` is a vanilla ES module. No dependencies.

```js
import { Theme, Nav, debounce, delegate } from './js/main.js';
```

Key exports:
- **`Theme`** — `.toggle()`, `.getActive()`, `.set('dark'|'light')`
- **`Nav`** — active link highlighting, mobile menu toggle
- **`debounce(fn, delay)`** — standard debounce utility
- **`delegate(selector, event, handler)`** — event delegation helper

### Scroll-triggered reveals

Any element with `data-reveal` will animate in when it enters the viewport.
Use `data-reveal-delay` (milliseconds) to stagger groups:

```html
<div class="card" data-reveal data-reveal-delay="0">First</div>
<div class="card" data-reveal data-reveal-delay="80">Second</div>
<div class="card" data-reveal data-reveal-delay="160">Third</div>
```

---

## SEO and Open Graph

Every page includes a full set of Open Graph meta tags immediately after `<meta name="description">`:

```html
<meta property="og:type" content="website">
<meta property="og:url" content="https://example.com/">
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description.">
<meta property="og:image" content="https://example.com/og-image.png">
```

`pages/article.html` uses `og:type="article"`. All other pages use `og:type="website"`.

**Before deploying**, replace the placeholder values:
- `og:url` — set to the canonical URL for each page
- `og:image` — point to your OG image in the `images/` directory (recommended size: 1200×630px)

The `images/` directory is the intended home for the OG image, favicons, and any other
static assets referenced in HTML.

---

## Production build

For production, replace native CSS `@import` in `main.css` with PostCSS:

```bash
npm install -D vite   # or postcss-import
```

A `vite.config.js` config is intentionally not included — add one to match your deployment
target. The JS already uses ES module syntax and will work with any modern bundler.

---

## Accessibility

Targets **WCAG 2.1 AA / Section 508** compliance.

- Skip-to-content link on every page
- Semantic HTML throughout (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`, `<footer>`)
- `aria-current="page"` set automatically by JS on active nav links
- `aria-label` on all icon-only interactive elements
- `aria-hidden="true"` on all decorative SVGs
- `focus-visible` styles on all interactive elements — focus ring at 7.25:1 (light) / 8:1 (dark) contrast

**Colour contrast** — all text and interactive foreground meets WCAG AA 4.5:1 minimum:

| Token | Light | Dark | Contrast |
|-------|-------|------|----------|
| `--text-primary` | gray-950 | gray-50 | >15:1 |
| `--text-secondary` | gray-700 | gray-300 | >7:1 |
| `--text-tertiary` | gray-600 | gray-400 | >5:1 |
| `--accent-fg` | amber-700 | amber-400 | 7.25:1 / 8:1 |

The amber design uses two separate tokens: `--accent-fg` (amber-700 light / amber-400 dark) for any amber text, icons, or button backgrounds; and `--accent-default` (amber-500) for decorative uses only (borders, backgrounds, sparklines) where contrast is not a text requirement.

**Reduced motion** — disabled at both levels:
- CSS: `reset.css` zeroes all transition and animation durations via `prefers-reduced-motion: reduce`
- JS: reveal animations skip entirely (elements remain visible); smooth scroll falls back to instant scroll

---

## AI-assisted development

This repo includes a `CLAUDE.md` file at the root. It documents every architectural
convention, naming rule, token tier, and prohibited pattern. When using Claude Code
or any AI assistant, point it at this file as the first context source.

The CLAUDE.md covers:
- Layer architecture and where to add styles
- Token tier rules and how dark mode works
- Naming conventions (BEM, `is-` state classes, `data-` JS hooks)
- Accessibility requirements
- What not to do
- Step-by-step guides for adding pages and components

---

## Browser support

Targets all modern browsers (Chrome/Edge 99+, Firefox 97+, Safari 15.4+).
Features used: CSS Cascade Layers, CSS Custom Properties, Container Queries (where noted),
`clamp()`, `color-mix()`, `dvh` units, ES Modules.

---

## License

[OSAASY](https://osaasy.dev)
