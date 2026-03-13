/**
 * main.js
 * Core site functionality — theme toggle, mobile nav, scroll behaviors.
 * Pure vanilla JS, no dependencies required.
 */


/* =============================================================================
   THEME MANAGEMENT
   Persists user preference in localStorage; respects OS preference as default.
   ============================================================================= */

const Theme = (() => {
  const STORAGE_KEY = 'theme-preference';
  const DARK = 'dark';
  const LIGHT = 'light';

  /** Returns the stored preference, or null if not set */
  function getStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  /** Returns the OS-level preference */
  function getOSPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  /** Returns the active theme ('dark' | 'light') */
  function getActive() {
    return getStored() ?? getOSPreference();
  }

  /** Applies the theme to the document */
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Also mark the html element with OS preference for CSS icon switching
    const osIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('os-dark', osIsDark);
  }

  /** Persists and applies a theme */
  function set(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors (private browsing, etc.)
    }
    apply(theme);
  }

  /** Toggles between dark and light */
  function toggle() {
    const current = getActive();
    set(current === DARK ? LIGHT : DARK);
  }

  /** Initialises theme on page load — call immediately */
  function init() {
    apply(getActive());

    // Listen for OS-level changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!getStored()) {
        apply(getOSPreference());
      }
    });
  }

  return { init, toggle, getActive, set };
})();


/* =============================================================================
   NAVIGATION
   Mobile nav toggle, active link highlighting.
   ============================================================================= */

const Nav = (() => {
  function highlightActive() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.site-nav__link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Exact match for root, prefix match for sections
      const isActive =
        (href === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
        (href !== '/' && currentPath.startsWith(href));

      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function initMobileToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.site-nav__links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  function init() {
    highlightActive();
    initMobileToggle();
  }

  return { init };
})();


/* =============================================================================
   THEME TOGGLE BUTTON
   Wires up all .theme-toggle buttons on the page.
   ============================================================================= */

function initThemeToggles() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      Theme.toggle();
      // Update aria-label for screen readers
      const isDark = Theme.getActive() === 'dark';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });

    // Set initial aria-label
    const isDark = Theme.getActive() === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}


/* =============================================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================================= */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
        10
      ) || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${id}`);
    });
  });
}


/* =============================================================================
   INTERSECTION OBSERVER — Fade-in on scroll
   Targets elements with [data-reveal] attribute.
   ============================================================================= */

function initRevealAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] {
      opacity: 0;
      translate: 0 1.5rem;
      transition:
        opacity 0.5s cubic-bezier(0.0, 0.0, 0.2, 1),
        translate 0.5s cubic-bezier(0.0, 0.0, 0.2, 1);
    }
    [data-reveal].is-visible {
      opacity: 1;
      translate: 0 0;
    }
  `;
  document.head.appendChild(style);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay ?? '0';
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}


/* =============================================================================
   UTILITIES
   ============================================================================= */

/**
 * Debounce a function
 * @param {Function} fn
 * @param {number} delay
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Simple event delegation helper
 * @param {string} selector
 * @param {string} event
 * @param {Function} handler
 * @param {Element} root
 */
function delegate(selector, event, handler, root = document) {
  root.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && root.contains(target)) {
      handler(e, target);
    }
  });
}


/* =============================================================================
   INIT
   ============================================================================= */

// Theme must be initialised as early as possible (ideally inline before <body>)
// but also safe to call here.
Theme.init();

document.addEventListener('DOMContentLoaded', () => {
  Nav.init();
  initThemeToggles();
  initSmoothScroll();
  initRevealAnimations();
});

// Export for module usage
export { Theme, Nav, debounce, delegate };
