/**
 * animations.js
 * -------------
 * Handles scroll-triggered fade-in animations and the hero entrance reveal.
 *
 * Features:
 *   - IntersectionObserver watches every .fade-up element and adds .visible
 *     when it scrolls into view, triggering the CSS transition in style.css.
 *   - Hero elements are revealed immediately on page load (after a short
 *     timeout to let the browser complete first paint).
 *
 * To animate any new element on scroll:
 *   Add class="fade-up" to the HTML element. That's it.
 *   To stagger siblings: add style="transition-delay: 0.15s" (or 0.2s, 0.3s).
 *
 * Example:
 *   <div class="fade-up" style="transition-delay: 0.2s">…</div>
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   SCROLL-TRIGGERED FADE-UP
   ══════════════════════════════════════════════════════════════ */

/**
 * threshold   – 10% of the element must be visible to trigger
 * rootMargin  – shrinks the detection zone by 40px at the bottom,
 *               so elements animate slightly before they'd naturally
 *               reach the viewport edge
 */
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed — no need to re-trigger
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold:  0.1,
    rootMargin: '0px 0px -40px 0px',
  }
);

// Attach the observer to every .fade-up element on the page
document.querySelectorAll('.fade-up').forEach(el => {
  scrollObserver.observe(el);
});


/* ══════════════════════════════════════════════════════════════
   HERO ENTRANCE — reveal on page load
   ══════════════════════════════════════════════════════════════ */

/**
 * Hero elements use the same .fade-up / .visible pair but need to
 * animate in immediately rather than on scroll. A 120ms delay ensures
 * the browser has completed its first paint before the transition fires,
 * so the animation is visible rather than skipped.
 */
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 120);
});
