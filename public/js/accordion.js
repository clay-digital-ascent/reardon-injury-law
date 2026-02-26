/**
 * accordion.js — FAQ accordion
 * data-w-id is stripped from accordion elements BEFORE webflow.js loads (see inline script in HTML).
 * This script purely handles open/close toggling.
 */
(function () {
  'use strict';

  function initAccordion() {
    var container = document.querySelector('.faq-list-wrapper');
    if (!container) return;

    container.addEventListener('click', function (e) {
      var header = e.target.closest('.div-block-29');
      if (!header) return;

      var accordion = header.closest('.accordion-text-block');
      if (!accordion) return;

      e.preventDefault();
      e.stopPropagation();

      var isActive = accordion.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-text-block').forEach(function (item) {
        item.classList.remove('active');
      });

      // Open clicked one if it wasn't already open
      if (!isActive) {
        accordion.classList.add('active');
      }
    });

    console.log('[accordion.js] Ready. Items:', document.querySelectorAll('.accordion-text-block').length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})();
