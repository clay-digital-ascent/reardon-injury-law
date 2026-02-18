/**
 * accordion.js — Standalone FAQ accordion fix
 * MUST be loaded AFTER webflow.js to override Webflow Ix2 interference.
 * Uses event delegation on document so it's immune to element replacement.
 */
(function() {
  'use strict';

  function initAccordion() {
    // Use event delegation on document - immune to Webflow replacing elements
    document.addEventListener('click', function(e) {
      // Find if click was inside a .div-block-29 (the accordion header)
      var header = e.target.closest('.div-block-29');
      if (!header) return;

      // Find the parent .accordion-text-block
      var accordion = header.closest('.accordion-text-block');
      if (!accordion) return;

      // Prevent any default behavior
      e.preventDefault();
      e.stopPropagation();

      var isActive = accordion.classList.contains('active');

      // Close all other accordions (only-one-open behavior)
      var allAccordions = document.querySelectorAll('.accordion-text-block');
      allAccordions.forEach(function(item) {
        item.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        accordion.classList.add('active');
      }
    }, true); // Use capture phase to intercept before Webflow

    // Also strip data-w-id from accordion elements to reduce Webflow interference
    var accordionBlocks = document.querySelectorAll('.accordion-text-block, .accordion-text-block *');
    accordionBlocks.forEach(function(el) {
      if (el.hasAttribute('data-w-id')) {
        el.removeAttribute('data-w-id');
      }
    });

    // Force initial state: ensure all panels are collapsed
    var panels = document.querySelectorAll('.accordion-text-block .div-block-30');
    panels.forEach(function(panel) {
      panel.style.removeProperty('display');
      panel.style.removeProperty('height');
      panel.style.removeProperty('max-height');
    });

    // Remove any Webflow inline styles that might interfere
    var allAccordions = document.querySelectorAll('.accordion-text-block');
    allAccordions.forEach(function(acc) {
      acc.classList.remove('active');
    });

    console.log('[accordion.js] Initialized. Found ' + allAccordions.length + ' accordion items.');
  }

  // Run after a short delay to ensure webflow.js has finished
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initAccordion, 500);
    });
  } else {
    setTimeout(initAccordion, 500);
  }

  // Also re-run if Webflow re-initializes (MutationObserver as safety net)
  var faqContainer = null;
  var mutationTimeout = null;

  function setupMutationObserver() {
    faqContainer = document.querySelector('.faq-list-wrapper');
    if (!faqContainer) return;

    var mo = new MutationObserver(function(mutations) {
      // Debounce: only re-init once after a batch of mutations
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(function() {
        // Re-strip data-w-id attributes if Webflow re-added them
        var els = faqContainer.querySelectorAll('[data-w-id]');
        els.forEach(function(el) {
          el.removeAttribute('data-w-id');
        });
        console.log('[accordion.js] MutationObserver: re-stripped data-w-id from ' + els.length + ' elements');
      }, 200);
    });

    mo.observe(faqContainer, {
      attributes: true,
      attributeFilter: ['data-w-id', 'style'],
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(setupMutationObserver, 600);
    });
  } else {
    setTimeout(setupMutationObserver, 600);
  }
})();
