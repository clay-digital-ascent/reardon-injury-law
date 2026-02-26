/**
 * reveal.js — Scroll-triggered reveal animation system
 * 
 * Classes observed:
 *   .sr-up      — slides up into view
 *   .sr-left    — slides in from left
 *   .sr-right   — slides in from right
 *   .sr-stagger — container; children with .sr-child animate in sequence
 *
 * Trigger class added: .is-revealed
 * Each element is unobserved after reveal (one-shot).
 *
 * Tuning: adjust :root vars in reardon-injury-law.webflow.css:
 *   --sr-duration     (default 0.8s)
 *   --sr-easing       (default cubic-bezier(0.645, 0.045, 0.355, 1))
 *   --sr-distance     (default 60px)
 *   --sr-stagger-gap  (default 120ms)
 */
(function () {
  'use strict';

  // Bail out if IntersectionObserver is not supported (very old browsers)
  if (!('IntersectionObserver' in window)) {
    // Immediately reveal everything
    document.querySelectorAll('.sr-up, .sr-left, .sr-right, .sr-stagger').forEach(function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  // Respect prefers-reduced-motion
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    document.querySelectorAll(
      '.sr-up, .sr-left, .sr-right, .sr-stagger, .sr-child, ' +
      '.reveal, .reveal-left, .reveal-right, .stagger-item'
    ).forEach(function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  // Observer options
  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // trigger slightly before fully in view
    threshold: 0.15
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target); // one-shot
      }
    });
  }, observerOptions);

  // Observe all sr-* and reveal-* elements
  var targets = document.querySelectorAll(
    '.sr-up, .sr-left, .sr-right, .sr-stagger, .sr-child, ' +
    '.reveal, .reveal-left, .reveal-right, .stagger-item'
  );
  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
