# CLAUDE.md

This file provides context for AI assistants (Claude Code and others) working on this codebase.
Read it before writing any code, modifying styles, or adding components.

---

## Project Overview

A minimal, no-framework HTML/CSS/JS starter for building small websites and web applications.
The design system is token-driven. Styles are organised into CSS Cascade Layers.
JavaScript is vanilla ES modules — no build step required for development.

---

## File Structure

```
/
├── index.html                  # Home / component showcase
├── pages/
│   ├── landing.html            # Marketing landing page layout
│   ├── article.html            # Long-form prose layout with TOC
│   ├── sidebar.html            # Content listing with filter sidebar
│   └── full-width.html         # App shell / dashboard layout
├── css/
│   ├── main.css                # Entry point — declares layer order, imports partials
│   ├── tokens.css              # Design tokens (primitives → semantic → component)
│   ├── reset.css               # Opinionated modern reset
│   ├── base.css                # Global element styles
│   ├── components.css          # Reusable UI component classes
│   └── utilities.css           # Single-purpose utility classes
└── js/
    └── main.js                 # Theme toggle, mobile nav, scroll utilities
```

---

## CSS Architecture

### Layer Order

Layer precedence is declared once at the top of `css/main.css`:

```css
@layer reset, tokens, base, components, utilities;
```

**Never change this order.** Higher layers (later in the declaration) win over lower ones
regardless of specificity. Utilities always beat components. Components always beat base.

| Layer        | Purpose                                        | Who wins over it? |
|--------------|------------------------------------------------|-------------------|
| `reset`      | Browser default normalisation                  | Everyone          |
| `tokens`     | CSS custom property definitions                | base, components, utilities |
| `base`       | Element-level defaults (h1, p, a, input…)     | components, utilities |
| `components` | Semantic component classes (.card, .btn…)     | utilities         |
| `utilities`  | Single-purpose overrides (.flex, .mt-8…)       | Nothing           |

### Adding styles

- **New component?** Add it to `css/components.css` inside the `@layer components { }` block.
- **New utility?** Add it to `css/utilities.css` inside the `@layer utilities { }` block.
- **New global element style?** Add it to `css/base.css` inside `@layer base { }`.
- **Never write styles outside a layer block** — unlayered styles beat all layers and
  will cause unexpected overrides.
- **Never use `!important`** — if you feel the need, you're in the wrong layer.

---

## Design Token System

Three-tier hierarchy defined in `css/tokens.css`:

### Tier 1 — Primitives
Raw values with no semantic meaning. **Never reference primitives in components or utilities.**

```css
--color-amber-500: #d97706;
--size-sm: 1rem;
--space-4: 1rem;
```

### Tier 2 — Semantic tokens
Purpose-named tokens that reference primitives. **Always use these in components.**

```css
--text-primary:    var(--color-gray-950);
--surface-page:    var(--color-gray-50);
--accent-default:  var(--color-amber-500);
--border-subtle:   var(--color-gray-200);
```

**Key semantic token groups:**
- `--surface-*` — background colors (page, raised, overlay, sunken, invert)
- `--text-*` — text colors (primary, secondary, tertiary, disabled, invert, on-accent)
- `--border-*` — border colors (subtle, default, strong, invert)
- `--accent-*` — accent/brand colors (default, hover, subtle, muted)
- `--interactive-*` — interactive element colors
- `--shadow-*` — box shadows (sm, md, lg, xl)
- `--focus-ring` — focus indicator color

### Tier 3 — Component tokens (when needed)
Scoped tokens for complex components. Prefix with the component name:

```css
.card {
  --card-padding: var(--space-6);
  --card-radius: var(--radius-lg);
}
```

### Dark mode
Dark mode is a semantic token concern, not a component concern.

- Default light mode tokens are on `:root` and `[data-theme="light"]`
- Dark mode overrides are on `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`
  and `[data-theme="dark"]`
- Components and utilities never contain dark-mode overrides — they only reference
  semantic tokens, which handle theming transparently

**Never do this:**
```css
/* WRONG — colour concern in the component layer */
.card {
  background: white;
}
[data-theme="dark"] .card {
  background: #1c1c1c;
}
```

**Always do this:**
```css
/* CORRECT — semantic token handles both modes */
.card {
  background-color: var(--surface-raised);
}
```

---

## Naming Conventions

### CSS classes

Use **BEM-style** for components: `block__element--modifier`

```css
.card              /* Block */
.card__body        /* Element */
.card__title       /* Element */
.card--interactive /* Modifier */
.card--featured    /* Modifier */
```

### State classes

Use `is-` prefix for JS-driven state:

```css
.is-active
.is-open
.is-visible
.is-loading
```

### Data attributes

Use `data-` attributes for JS hooks. Never use component classes as JS selectors.

```html
<!-- JS targets data-reveal, not .card -->
<div class="card" data-reveal data-reveal-delay="80">
```

---

## Typography

### Font families

```css
var(--font-serif)  /* Instrument Serif — headings, display text, quotes */
var(--font-sans)   /* Outfit — body text, UI labels, metadata */
var(--font-mono)   /* JetBrains Mono — code, technical content */
```

### Scale

Major Third scale (1.25x ratio). Use the named sizes:

```css
var(--size-3xs)  /* ~8px  */
var(--size-2xs)  /* ~10px */
var(--size-xs)   /* ~13px */
var(--size-sm)   /* 16px — base body size */
var(--size-md)   /* 20px */
var(--size-lg)   /* 25px */
var(--size-xl)   /* 31px */
var(--size-2xl)  /* 39px */
var(--size-3xl)  /* 49px */
var(--size-4xl)  /* 61px */
var(--size-5xl)  /* 76px */
```

### Fluid headings

`h1`–`h3` use `clamp()` for fluid sizing. Maintain this pattern for new display text:

```css
font-size: clamp(var(--size-xl), 3vw, var(--size-3xl));
```

---

## Layout

### Containers

```html
<div class="container">        <!-- max 1280px -->
<div class="container--wide">  <!-- max 1024px -->
<div class="container--narrow"><!-- max 760px  -->
```

### Layout tokens

```css
var(--layout-max-width)      /* 1280px */
var(--layout-content-width)  /* 760px — prose/article */
var(--layout-wide-width)     /* 1024px */
var(--layout-sidebar-width)  /* 280px */
var(--layout-section-gap)    /* 5rem — between page sections */
var(--nav-height)            /* 4rem — sticky nav reference */
```

### Spacing

Use spacing tokens, not arbitrary values. The base grid is 4px.

```css
var(--space-1)   /* 4px  */
var(--space-2)   /* 8px  */
var(--space-3)   /* 12px */
var(--space-4)   /* 16px */
var(--space-5)   /* 20px */
var(--space-6)   /* 24px */
var(--space-8)   /* 32px */
var(--space-10)  /* 40px */
var(--space-12)  /* 48px */
var(--space-16)  /* 64px */
var(--space-20)  /* 80px */
var(--space-24)  /* 96px */
var(--space-32)  /* 128px */
```

---

## JavaScript

`js/main.js` exports four items:

```js
import { Theme, Nav, debounce, delegate } from './js/main.js';
```

- **`Theme`** — `.init()`, `.toggle()`, `.getActive()`, `.set('dark'|'light')`
- **`Nav`** — `.init()` — active link highlighting, mobile toggle
- **`debounce(fn, delay)`** — utility
- **`delegate(selector, event, handler, root?)`** — event delegation utility

### Theme initialisation

The theme must be applied **before** `<body>` renders to prevent flash of wrong theme.
Each page includes this inline script in `<head>`:

```html
<script>
  (function () {
    var stored = null;
    try { stored = localStorage.getItem('theme-preference'); } catch (e) {}
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

**Do not remove or move this script.**

### Reveal animations

Add `data-reveal` to any element to trigger a fade-in + translate on scroll.
Control stagger timing with `data-reveal-delay="80"` (milliseconds).

```html
<div class="card" data-reveal data-reveal-delay="0">…</div>
<div class="card" data-reveal data-reveal-delay="80">…</div>
<div class="card" data-reveal data-reveal-delay="160">…</div>
```

---

## Accessibility Requirements

- Every page must have a `<a class="skip-link" href="#main">Skip to content</a>` as the first focusable element
- All `<img>` must have descriptive `alt` attributes, or `alt=""` for decorative images
- `aria-hidden="true"` on all decorative SVG icons
- Interactive elements must be reachable and operable via keyboard
- Never remove `outline` from focused elements without providing an equivalent `focus-visible` style
- Use `aria-label` on icon-only buttons
- Use `aria-current="page"` on the active navigation link
- Use semantic HTML elements: `<nav>`, `<main>`, `<article>`, `<aside>`, `<section>`, `<header>`, `<footer>`
- Colour contrast: text must meet WCAG AA (4.5:1 for body text, 3:1 for large text)

---

## What Not to Do

- **No utility framework CSS** (no Tailwind, no Bootstrap) — use semantic component classes and the utilities layer
- **No CSS-in-JS** — all styles live in the `css/` directory
- **No framework JS** (no React, no Vue) unless the project scope changes significantly
- **No `!important`** — solve it with layers instead
- **No inline styles** for design decisions — use tokens and component classes
- **Exception — data-driven custom properties:** when a value comes from data rather than a design decision (e.g. a chart bar's height), set it as a CSS custom property inline and resolve it in the stylesheet. This keeps the design concern in CSS while allowing the value to vary per-element:
  ```html
  <!-- HTML: data value as a custom property -->
  <div class="sparkline__bar" style="--bar-height: 72%"></div>
  ```
  ```css
  /* CSS: design decision stays in the stylesheet */
  .sparkline__bar { height: var(--bar-height, 50%); }
  ```
- **No hardcoded colours** — always reference a token
- **No specificity hacks** (`.foo.foo`, `#app .component`) — layers solve this
- **No styles outside a layer block** in any of the CSS partials

---

## Adding a New Page

1. Copy the closest existing page template from `pages/`
2. Update `<title>` and `<meta name="description">`
3. Add the page to the nav links in all pages (including `index.html`)
4. Set `aria-current="page"` on the matching nav link (JS does this automatically)
5. Include the theme-init inline script in `<head>` (copy from an existing page)
6. Reference the correct relative path for `css/main.css` and `js/main.js`

---

## Adding a New Component

1. Add the component's HTML to the relevant page(s)
2. Add its CSS to `css/components.css` **inside** `@layer components { }`
3. Name the block class semantically (`.component-name`)
4. Reference only semantic tokens — no primitives, no hardcoded values
5. Document any component-level CSS custom properties at the top of the block
6. Add an example to `index.html` in the component showcase section if it's reusable

---

## Production Considerations

- Replace native CSS `@import` in `main.css` with `postcss-import` for production builds
  (avoids render-blocking sequential HTTP requests)
- Consider adding a `vite.config.js` or similar bundler config
- Generated CSS build artifacts should be in `.gitignore` if using a build pipeline
- The JS uses ES module syntax — add `type="module"` attribute is already on all `<script>` tags