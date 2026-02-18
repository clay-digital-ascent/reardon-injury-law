/* =======================================
   REARDON INJURY LAW - PREMIUM INTERACTIONS
   Simplified scroll animations + interactions
   ======================================= */

// Fix scroll restoration — prevent browser from restoring mid-page scroll on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

document.addEventListener('DOMContentLoaded', function() {
  
  // =======================================
  // INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
  // =======================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Handle stagger containers
        if (entry.target.classList.contains('stagger-container')) {
          entry.target.classList.add('visible');
        }
        
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements (HTML is source of truth)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-container');
  revealElements.forEach(el => revealObserver.observe(el));

  // =======================================
  // HERO PARALLAX EFFECT (SIMPLIFIED)
  // =======================================
  const coverImage = document.querySelector('.cover-image');
  if (coverImage && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const scale = 1 + (scrollY / 2000);
      if (scale < 1.5) {
        coverImage.style.backgroundSize = `${100 * scale}%`;
      }
    }, { passive: true });
  }

  // =======================================
  // NAVBAR SCROLL EFFECT
  // =======================================
  const navbar = document.querySelector('.navbar-2');
  let lastScrollY = window.scrollY;
  let navTicking = false;
  
  function updateNavbar() {
    const currentScrollY = window.scrollY;
    
    if (navbar) {
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    lastScrollY = currentScrollY;
    navTicking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(updateNavbar);
      navTicking = true;
    }
  }, { passive: true });

  // =======================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // =======================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // =======================================
  // STICKY CTA HIDE ON FORM VISIBLE
  // =======================================
  const stickyCta = document.querySelector('.sticky-mobile-cta');
  const contactForm = document.querySelector('.form');
  const footer = document.querySelector('.ril-footer');
  
  if (stickyCta) {
    const hideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyCta.classList.add('hidden');
        } else {
          stickyCta.classList.remove('hidden');
        }
      });
    }, { threshold: 0.2 });
    
    if (contactForm) hideObserver.observe(contactForm);
    if (footer) hideObserver.observe(footer);
  }

  // =======================================
  // TESTIMONIAL SLIDER AUTO-SLIDE & AUTO-PAUSE
  // =======================================
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    // Auto-slide functionality - force Webflow slider to advance
    let autoplayInterval;
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        const nextBtn = slider.querySelector('.w-slider-arrow-right');
        if (nextBtn && slider.getAttribute('data-autoplay') !== 'false') {
          nextBtn.click();
        }
      }, 4000); // 4000ms matches the data-delay attribute
    };
    
    const stopAutoplay = () => {
      clearInterval(autoplayInterval);
    };
    
    // Start autoplay on page load
    startAutoplay();
    
    slider.addEventListener('mouseenter', () => {
      slider.setAttribute('data-autoplay', 'false');
    });
    
    slider.addEventListener('mouseleave', () => {
      slider.setAttribute('data-autoplay', 'true');
    });
  }

  // =======================================
  // FORM INPUT ANIMATIONS
  // =======================================
  const formInputs = document.querySelectorAll('.text-field, .text-field-2');
  
  formInputs.forEach(input => {
    const label = input.previousElementSibling;
    if (label && label.classList.contains('field-label')) {
      input.addEventListener('focus', () => {
        label.style.color = 'var(--gold-primary)';
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          label.style.color = '';
        }
      });
    }
    
    input.addEventListener('input', () => {
      input.style.borderColor = 'var(--gold-primary)';
    });
  });

  // =======================================
  // LAZY LOAD IMAGES WITH FADE IN
  // =======================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.onload = () => {
              img.style.opacity = '1';
            };
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.5s ease';
      imageObserver.observe(img);
    });
  }

  // =======================================
  // MOBILE MENU ENHANCEMENT
  // =======================================
  const menuButton = document.querySelector('.w-nav-button');
  const navMenu = document.querySelector('.nav-menu-2');
  
  if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('w--open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  // =======================================
  // PRELOADER
  // =======================================
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger hero animations
    setTimeout(() => {
      const heroElements = document.querySelectorAll('.hero-entrance, .hero-entrance-delay-1, .hero-entrance-delay-2');
      heroElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 100);
  });

  // =======================================
  // PERFORMANCE: Cleanup on page hide
  // =======================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.add('animations-paused');
    } else {
      document.body.classList.remove('animations-paused');
    }
  });

});
