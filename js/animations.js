/* =======================================
   SCROLL-TRIGGERED ANIMATIONS - WAVE 2
   js/animations.js
   ======================================= */

document.addEventListener('DOMContentLoaded', function() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // ---- 1. Hero Gold Line Flash ----
  const heroBox = document.querySelector('.div-block-24');
  if (heroBox) {
    const goldLine = document.createElement('span');
    goldLine.className = 'gold-line-flash';
    goldLine.setAttribute('aria-hidden', 'true');
    heroBox.appendChild(goldLine);
  }

  // ---- 2. Office Locations - Assign alternating fly-in classes ----
  const officeCards = document.querySelectorAll('.container-17 .office-locations');
  officeCards.forEach(function(card, index) {
    if (index % 2 === 0) {
      card.classList.add('anim-fly-left');
    } else {
      card.classList.add('anim-fly-right');
    }
  });

  // ---- 3. Testimonials - Add animation class ----
  const testimonialSection = document.querySelector('.sectionnn.client-test-section');
  if (testimonialSection) {
    const slider = testimonialSection.querySelector('.testimonial-slider');
    if (slider) {
      slider.classList.add('anim-fade-up');
    }
    // Also animate the section heading
    const heading = testimonialSection.querySelector('.text-headings');
    if (heading) {
      heading.classList.add('anim-fade-up');
    }
  }

  // ---- 4. Practice Area Cards - Add stagger classes ----
  const practiceGrid = document.querySelector('.sectionnn.practice-areas .stagger-container');
  if (!practiceGrid) {
    // Try alternate selector - the grid container holding practice-area-cards
    const altGrid = document.querySelector('.sectionnn.practice-areas [style*="grid"]');
    if (altGrid) {
      altGrid.classList.add('anim-stagger-parent');
      altGrid.querySelectorAll('.practice-area-card').forEach(function(card) {
        card.classList.add('anim-stagger-item');
      });
    }
  } else {
    practiceGrid.classList.add('anim-stagger-parent');
    practiceGrid.querySelectorAll('.practice-area-card').forEach(function(card) {
      card.classList.add('anim-stagger-item');
    });
  }

  // Also animate the Practice Areas section heading
  const practiceSection = document.querySelector('.sectionnn.practice-areas');
  if (practiceSection) {
    const heading = practiceSection.querySelector('.text-headings');
    if (heading) {
      heading.classList.add('anim-fade-up');
    }
  }

  // ---- 5. Intersection Observer for Scroll Triggers ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const animObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-visible');
        animObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  var animatedElements = document.querySelectorAll(
    '.anim-fly-left, .anim-fly-right, .anim-fade-up, .anim-stagger-parent'
  );
  animatedElements.forEach(function(el) {
    animObserver.observe(el);
  });
});
