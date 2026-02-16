# DESIGN SPEC: Reardon Injury Law Homepage Enhancements

**To:** Wraith (Developer)
**From:** Shade (Architect)
**RE:** Architecture Review and Implementation Plan

Here is the detailed design and implementation spec to elevate the Reardon Injury Law homepage from "okay" to "outstanding". Follow these instructions precisely.

---

## 1. Global Cleanup & File Consolidation

Our first step is to establish a single source of truth for styles and animations.

### 1.1. Consolidate CSS

The `index.html` file contains an embedded `<style>` block. This is bad practice.

**Action:**
1.  **Cut** the entire `<style>...</style>` block from the `<head>` of `index.html`.
2.  **Paste** its contents at the **end** of the `/css/enhancements.css` file.
3.  We will merge and de-duplicate these rules in the following sections.

### 1.2. Simplify JavaScript

The `/js/enhancements.js` file is trying to do too much, creating conflicts.

**Action:**
1.  **Delete** the entire `sectionsToAnimate` array and the `forEach` loop that follows it. The HTML should be the source of truth for which elements are animated.
2.  **Delete** the `updateParallax` function and its associated `scroll` event listener. We will replace this with a CSS-only solution and a simplified JS interaction for the background.
3.  **Delete** the "Magnetic Button Effect" section, including the `if (window.matchMedia...` block and its event listeners. This effect is subtle and not worth the performance cost.
4.  **Delete** the unused utility functions `debounce`, `throttle`, and `animateCounter`.

---

## 2. Color & Theme Correction

We will enforce a strict, consistent color palette. All colors should be driven by CSS variables.

**Action:**
Add these variables to the `:root` block at the top of `/css/enhancements.css`. This ensures the correct gold and dark colors are used everywhere.

```css
:root {
  --gold-primary: #eeba6b;
  --gold-light: #f0c86f;
  --gold-dark: #d4a84f;
  --dark-bg: #141415;
  --dark-card: #1e1e1f;
  --text-light: rgba(255, 255, 255, 0.9);
  --text-dark: #141415; /* Added for buttons */
  --transition-smooth: cubic-bezier(0.645, 0.045, 0.355, 1); /* New Easing */
  --shadow-gold: 0 10px 40px rgba(238, 186, 107, 0.15);
  --shadow-dark: 0 20px 60px rgba(0, 0, 0, 0.4);
}
```

Now, find and replace the following hardcoded colors throughout `enhancements.css`:

-   Replace `#eeba6b` with `var(--gold-primary)`
-   Replace `#d4a84f` with `var(--gold-dark)`
-   Replace `#141415` with `var(--dark-bg)` or `var(--text-dark)` depending on context.
-   Replace any `cubic-bezier(...)` with `var(--transition-smooth)`.

**Specifically, update the sticky mobile CTA styles (which you just pasted from the HTML):**

```css
/* Old */
.sticky-mobile-cta {
  background: linear-gradient(180deg, #eeba6b 0%, #d4a84f 100%);
}
.sticky-mobile-cta a {
  color: #141415;
}

/* New */
.sticky-mobile-cta {
  background: linear-gradient(180deg, var(--gold-primary) 0%, var(--gold-dark) 100%);
}
.sticky-mobile-cta a {
  color: var(--text-dark);
}
```

---

## 3. HTML & Typography Hierarchy

The current heading structure is incorrect and hurts SEO and accessibility.

### 3.1. Fix Heading Structure in `index.html`

**Action:**
In `index.html`, change the following `<h1>` elements to `<h2>` elements. There must only be **one** `<h1>` on the page (the hero headline).

1.  `h1.text-headings.locations-thour` should become `h2.text-headings.locations-thour`
2.  `h1.text-headings` (for "Our Practice Areas") should become `h2.text-headings`
3.  `h1.text-headings` (for "Client Testimonials") should become `h2.text-headings`
4.  `h1.text-headings` (for "Office Locations") should become `h2.text-headings`
5.  `h1.cta-headerr` (for "Contact us now!") should become `h2.cta-headerr`

### 3.2. Refine Typography Styles in CSS

**Action:**
Update the CSS in `/css/enhancements.css` to use a single, consistent class for section headings and remove `!important` where possible.

```css
/* Replace existing .text-headings rule */
.text-headings {
  font-size: 42px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  border-bottom: 4px solid var(--gold-primary);
  margin-bottom: 60px;
  padding-bottom: 20px;
  position: relative;
  /* Remove the border-right, padding, and hover effects for a cleaner look */
}

/* Adjust all h1, h2 font sizes to remove !important */
h1 {
  font-size: 56px;
  line-height: 1.1;
  padding-bottom: 40px;
  font-weight: 600;
}
/* etc. for h2 */
```

---

## 4. Animation and Interaction Polish

This is the most critical section. These changes will fix the janky and incorrect animations.

### 4.1. Fix Reveal Animations

The `transition: all` property is inefficient. We will target only the properties we want to animate.

**Action:**
In `/css/enhancements.css`, replace all `reveal-*` class definitions with these improved versions.

```css
/* Base animation classes */
.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-container .stagger-item {
  opacity: 0;
  transition: opacity 0.8s var(--transition-smooth), transform 0.8s var(--transition-smooth);
}

.reveal {
  transform: translateY(50px);
}

.reveal-left {
  transform: translateX(-60px);
}

.reveal-right {
  transform: translateX(60px);
}

.reveal-scale {
  transform: scale(0.95);
}

.stagger-container .stagger-item {
  transform: translateY(40px);
}

/* Visible states */
.reveal.visible,
.reveal-left.visible,
.reveal-right.visible,
.reveal-scale.visible,
.stagger-container.visible .stagger-item {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}
```

### 4.2. Fix Hero Parallax

We will simplify the parallax effect to be CSS-driven where possible, removing the JS conflicts.

**Action 1:** In `/css/enhancements.css`, modify the `.cover-image` style. Remove the `transform` and `transition` properties. We no longer need to scale it here. The `background-attachment: fixed` does the main work on desktop.

```css
/* Old */
.cover-image {
  /* ... */
  transform: scale(1.1);
  transition: transform 0.1s linear;
}

/* New */
.cover-image {
  /* ... */
  /* REMOVE transform and transition */
  background-attachment: fixed !important;
  background-position: center !important;
  background-size: cover !important;
}
```

**Action 2:** In `/js/enhancements.js`, add this new, simplified scroll listener to create a subtle background parallax zoom effect without interfering with the hero text. **Make sure you deleted the old `updateParallax` function.**

```javascript
// Add this to js/enhancements.js inside the DOMContentLoaded listener

const coverImage = document.querySelector('.cover-image');
if (coverImage && window.matchMedia('(min-width: 768px)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const scale = 1 + (scrollY / 2000); // Adjust divisor for more/less zoom
    if (scale < 1.5) { // Cap the zoom
      coverImage.style.backgroundSize = `${100 * scale}%`;
    }
  }, { passive: true });
}
```

### 4.3. Fix Accordion (FAQ) Animation

We will replace the JS-driven height animation with a smoother, more reliable CSS `max-height` transition.

**Action 1:** In `/js/enhancements.js`, find the `accordions.forEach` loop and **delete** the entire block of code that sets the `content.style.height`. We only want to toggle the `active` class.

The simplified JS should look like this:
```javascript
accordions.forEach(accordion => {
    const header = accordion.querySelector('.div-block-29');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = accordion.classList.contains('active');
        
        // Close all others
        accordions.forEach(other => {
          if (other !== accordion) other.classList.remove('active');
        });
        
        // Toggle current
        if (!isActive) {
          accordion.classList.add('active');
        } else {
          accordion.classList.remove('active');
        }
      });
    }
  });
```

**Action 2:** In `/css/enhancements.css`, add these rules to control the accordion's open/close animation.

```css
/* Find .div-block-30 and replace its rules */
.div-block-30 {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s var(--transition-smooth), padding 0.5s var(--transition-smooth);
}

.accordion-text-block.active .div-block-30 {
  max-height: 300px; /* A value larger than any possible content height */
  padding-top: 15px; /* Add some space when open */
}

/* Remove the inline style="height:0px" from the .text-block-17 divs in index.html */
```

---

## 5. Layout & Responsive Cleanup

Finally, let's consolidate the responsive rules.

**Action:**
1.  You have already pasted the responsive overrides from the `<style>` block into `enhancements.css`.
2.  Go through the `@media` blocks at the end of `enhancements.css` and merge any duplicate selectors. For example, rules for `h1` and `.heading-16.front-page` were defined in both places. Combine them into a single definition within the appropriate media query.
3.  Ensure the `.ril-footer` has `padding-bottom: 100px;` inside the `@media screen and (max-width: 767px)` block to avoid being covered by the sticky CTA.

This spec provides a clear path to resolving all client-reported issues. Execute these changes, and the site's polish will increase dramatically.

-Shade
