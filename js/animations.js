/* =======================================
   SCROLL-LINKED PROGRESSIVE ANIMATIONS
   js/animations.js
   ======================================= */

(function() {
  'use strict';

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll(
      '.anim-fly-left, .anim-fly-right, .anim-fade-up, .anim-stagger-item, .reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-container .stagger-item'
    ).forEach(function(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ---- 1. Hero Gold Line Flash ----
  var heroBox = document.querySelector('.div-block-24');
  if (heroBox) {
    var goldLine = document.createElement('span');
    goldLine.className = 'gold-line-flash';
    goldLine.setAttribute('aria-hidden', 'true');
    heroBox.appendChild(goldLine);
    goldLine.addEventListener('animationend', function() {
      goldLine.remove();
    });
  }

  // ---- 2. Office Locations - Assign alternating fly-in classes ----
  var officeCards = document.querySelectorAll('.container-17 .office-locations');
  officeCards.forEach(function(card, index) {
    if (index % 2 === 0) {
      card.classList.add('anim-fly-left');
    } else {
      card.classList.add('anim-fly-right');
    }
  });

  // ---- 3. Testimonials - Add animation class ----
  var testimonialSection = document.querySelector('.sectionnn.client-test-section');
  if (testimonialSection) {
    var slider = testimonialSection.querySelector('.testimonial-slider');
    if (slider) {
      slider.classList.add('anim-fade-up');
    }
    // Also animate the section heading
    var heading = testimonialSection.querySelector('.text-headings');
    if (heading) {
      heading.classList.add('anim-fade-up');
    }
  }

  // ---- 4. Practice Area Cards - Add stagger classes ----
  var practiceGrid = document.querySelector('.sectionnn.practice-areas .stagger-container');
  if (!practiceGrid) {
    // Try alternate selector - the grid container holding practice-area-cards
    var altGrid = document.querySelector('.sectionnn.practice-areas [style*="grid"]');
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
  var practiceSection = document.querySelector('.sectionnn.practice-areas');
  if (practiceSection) {
    var practiceHeading = practiceSection.querySelector('.text-headings');
    if (practiceHeading) {
      practiceHeading.classList.add('anim-fade-up');
    }
  }

  // ============================================
  // SCROLL-LINKED ANIMATION ENGINE
  // ============================================
  var ANIMATION_CONFIG = {
    'anim-fly-left': { prop: 'translateX', from: -80, to: 0, unit: 'px' },
    'anim-fly-right': { prop: 'translateX', from: 80, to: 0, unit: 'px' },
    'anim-fade-up': { prop: 'translateY', from: 40, to: 0, unit: 'px' },
    'anim-stagger-item': { prop: 'translateY', from: 50, to: 0, unit: 'px', scale: { from: 0.97, to: 1 } },
    'reveal': { prop: 'translateY', from: 50, to: 0, unit: 'px' },
    'reveal-left': { prop: 'translateX', from: -60, to: 0, unit: 'px' },
    'reveal-right': { prop: 'translateX', from: 60, to: 0, unit: 'px' },
    'reveal-scale': { prop: 'scale', from: 0.95, to: 1, unit: '' }
  };

  var animatedElements = [];

  function collectElements() {
    Object.keys(ANIMATION_CONFIG).forEach(function(className) {
      document.querySelectorAll('.' + className).forEach(function(el) {
        var staggerDelay = 0;
        if (className === 'anim-stagger-item' || className === 'stagger-item') {
          var parent = el.parentElement;
          if (parent) {
            var siblings = Array.from(parent.children).filter(function(child) {
              return child.classList.contains(className);
            });
            var index = siblings.indexOf(el);
            staggerDelay = index * 0.08;
          }
        }

        animatedElements.push({
          el: el,
          config: ANIMATION_CONFIG[className],
          className: className,
          staggerDelay: staggerDelay,
          completed: false
        });
      });
    });

    document.querySelectorAll('.stagger-container .stagger-item').forEach(function(el) {
      if (animatedElements.find(function(item) { return item.el === el; })) {
        return;
      }
      var parent = el.parentElement;
      var siblings = parent ? Array.from(parent.children).filter(function(child) {
        return child.classList.contains('stagger-item');
      }) : [];
      var index = siblings.indexOf(el);
      animatedElements.push({
        el: el,
        config: ANIMATION_CONFIG['reveal'],
        className: 'stagger-item',
        staggerDelay: index * 0.08,
        completed: false
      });
    });
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function getScrollProgress(el) {
    var rect = el.getBoundingClientRect();
    var windowHeight = window.innerHeight;
    var startTrigger = windowHeight * 0.85;
    var endTrigger = windowHeight * 0.35;
    var range = startTrigger - endTrigger;
    var progress = (startTrigger - rect.top) / range;
    return Math.max(0, Math.min(1, progress));
  }

  function applyAnimation(item, rawProgress) {
    var adjustedProgress = Math.max(0, Math.min(1, (rawProgress - item.staggerDelay) / (1 - item.staggerDelay)));
    var progress = easeOutCubic(adjustedProgress);
    var config = item.config;
    var opacity = progress;
    var transform = '';

    if (config.prop === 'scale') {
      var scaleValue = config.from + (config.to - config.from) * progress;
      transform = 'scale(' + scaleValue + ')';
    } else if (config.prop === 'translateX') {
      var translateXValue = config.from + (config.to - config.from) * progress;
      transform = 'translateX(' + translateXValue + config.unit + ')';
      if (config.scale) {
        var scaleXValue = config.scale.from + (config.scale.to - config.scale.from) * progress;
        transform += ' scale(' + scaleXValue + ')';
      }
    } else if (config.prop === 'translateY') {
      var translateYValue = config.from + (config.to - config.from) * progress;
      transform = 'translateY(' + translateYValue + config.unit + ')';
      if (config.scale) {
        var scaleYValue = config.scale.from + (config.scale.to - config.scale.from) * progress;
        transform += ' scale(' + scaleYValue + ')';
      }
    }

    item.el.style.opacity = opacity;
    item.el.style.transform = transform;
    item.el.style.transition = 'none';

    if (progress >= 1 && !item.completed) {
      item.completed = true;
      item.el.classList.add('anim-visible', 'visible');
      var parent = item.el.closest('.anim-stagger-parent, .stagger-container');
      if (parent) {
        parent.classList.add('anim-visible', 'visible');
      }
    }
  }

  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        animatedElements.forEach(function(item) {
          if (item.completed) {
            return;
          }
          var progress = getScrollProgress(item.el);
          applyAnimation(item, progress);
        });
        ticking = false;
      });
      ticking = true;
    }
  }

  function init() {
    collectElements();
    animatedElements.forEach(function(item) {
      item.el.style.transition = 'none';
    });
    animatedElements.forEach(function(item) {
      var progress = getScrollProgress(item.el);
      applyAnimation(item, progress);
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
