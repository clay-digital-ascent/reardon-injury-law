# DESIGN SPEC V2: Client Feedback Implementation

This document outlines the specific code changes required to address the client feedback received for the Reardon Injury Law website.

---

## **Project Files:**

-   **HTML:** `index.html`, `about.html`, `practice-areas.html`
-   **CSS:** `css/enhancements.css`, `css/reardon-injury-law.webflow.css`
-   **JS:** `js/enhancements.js`

---

## **I. Homepage Issues (`index.html`, `css/enhancements.css`)**

### **1. Hero Box Not Dimmed**

-   **Issue:** The central hero box ("Hurt? We make it personal") is currently dimmed along with the background image.
-   **Fix:** The dimming is caused by a pseudo-element (`::after`) on the `.cover-image` container. The hero content (`.div-block-24`) needs a higher `z-index` to be placed above this dimming layer.

**File:** `css/enhancements.css`
**Add the following CSS:**

```css
.div-block-24 {
  position: relative; /* Ensure z-index is respected */
  z-index: 2;
}

.cover-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 21, 0.2) 0%,
    rgba(20, 20, 21, 0.5) 50%,
    rgba(20, 20, 21, 0.95) 100%
  );
  z-index: 1; /* Keep the overlay behind the content */
}
```

### **2. "Call Now" Button Link**

-   **Issue:** The "Call Now" button is not working.
-   **Fix:** The `href` attribute in `index.html` is already correct. This might have been a caching issue or was already fixed. The spec should confirm the correct implementation.

**File:** `index.html`
**Verify the following HTML:**

```html
<a href="tel:6575227122" class="button-3 w-button hero-entrance-delay-2">Call Now</a>
```

### **3. Top Navigation Menu Text Size**

-   **Issue:** The text in the top navigation menu is too small.
-   **Fix:** Increase the `font-size` for the `.nav-link` class.

**File:** `css/reardon-injury-law.webflow.css`
**Modify the `.nav-link` class:**

```css
/* FROM */
.nav-link {
  text-underline-offset: 0px;
  border-bottom: 1px solid #0000;
  padding-top: 18px;
  font-size: 22px; /* This is the old value */
  -webkit-text-decoration: underline #0000;
  text-decoration: underline #0000;
  transition: text-decoration-color .3s, text-underline-offset .3s;
}

/* TO */
.nav-link {
  text-underline-offset: 0px;
  border-bottom: 1px solid #0000;
  padding-top: 18px;
  font-size: 26px; /* Increased font size */
  -webkit-text-decoration: underline #0000;
  text-decoration: underline #0000;
  transition: text-decoration-color .3s, text-underline-offset .3s;
}
```

### **4. Hero Entrance Animation Flicker**

-   **Issue:** The hero entrance animation is flickering on page load.
-   **Fix:** This is likely a conflict between Webflow's default interactions and the smoother CSS keyframe animations. Remove the Webflow animation classes from the HTML and rely solely on the CSS animations defined in `enhancements.css`.

**File:** `index.html`
**Modify the hero elements:**

```html
<!-- FROM -->
<h1 class="heading-16 front-page hero-entrance">Hurt? We Make it Personal.</h1>
<div class="text-block-9 hero-entrance-delay-1">Speak with one of our attorneys today.</div>
<a href="tel:6575227122" class="button-3 w-button hero-entrance-delay-2">Call Now</a>

<!-- TO -->
<h1 class="heading-16 front-page">Hurt? We Make it Personal.</h1>
<div class="text-block-9">Speak with one of our attorneys today.</div>
<a href="tel:6575227122" class="button-3 w-button">Call Now</a>
```
**File:** `css/enhancements.css`
**Ensure these animations are present (they already are, just confirm):**

```css
/* Add these classes to the elements in index.html */
.heading-16.front-page {
  animation: heroFadeInUp 1s var(--transition-smooth) forwards;
  opacity: 0;
}
.text-block-9 {
  animation: heroFadeInUp 1s var(--transition-smooth) 0.2s forwards;
  opacity: 0;
}
.button-3.w-button {
  animation: heroFadeInUp 1s var(--transition-smooth) 0.4s forwards;
  opacity: 0;
}

@keyframes heroFadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
**Note for Wraith:** You will need to add the animation classes to the HTML elements as shown in the CSS block above.

### **5. "Locations throughout California" Section Styling**

-   **Issue:** FAQ boxes lack contrast, and the title's gold background makes the white text hard to read.
-   **Fix:**
    1.  Redesign the title (`.text-headings`) to use a dark background, white text, and a gold border.
    2.  Change the FAQ accordion (`.accordion-text-block`) styling to a dark background with a gold border for better contrast.

**File:** `css/enhancements.css`
**Modify/Add the following CSS:**

```css
/* Redesigned Section Headings (also addresses issue #6) */
.text-headings {
  font-size: 42px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  background-color: var(--dark-bg); /* Dark background */
  color: var(--text-light); /* White text */
  border: 2px solid var(--gold-primary); /* Gold border */
  border-radius: 12px;
  margin-bottom: 60px;
  padding: 20px 30px;
  position: relative;
  text-align: center;
}

/* Enhanced FAQ accordions */
.accordion-text-block {
  background: linear-gradient(145deg, #1a1a1b 0%, var(--dark-bg) 100%);
  border: 1px solid rgba(238, 186, 107, 0.2);
  border-radius: 12px;
  margin-top: 16px;
  padding: 20px 24px;
  transition: border-color 0.3s var(--transition-smooth), box-shadow 0.3s var(--transition-smooth), transform 0.3s var(--transition-smooth);
  cursor: pointer;
}
.accordion-text-block h2 {
    color: #fff;
}
```

### **6. All Squared-off Gold Title Boxes**

-   **Issue:** All `.text-headings` with gold backgrounds look bad.
-   **Fix:** The fix from issue #5 addresses this globally by changing the style of `.text-headings` to a dark background with a gold border.

### **7. Practice Areas Section**

-   **Issue:** No scroll animation, and only 3 of 6 practice areas are shown.
-   **Fix:**
    1.  Add the `reveal` class to each `.practice-area-card` for the animation.
    2.  Add the HTML for the three missing practice areas.

**File:** `index.html`
**Modify the `.practice-area-card` divs and add the new ones:**

```html
<div class="stagger-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; padding: 20px;">
  <!-- Existing Cards - Add reveal class -->
  <div class="practice-area-card stagger-item reveal">
    <h3>🚗 Car Accidents</h3>
    <p>Injured in a car accident? We fight to get you full compensation for medical bills, lost wages, and pain and suffering.</p>
    <a href="car-accidents.html">Learn More →</a>
  </div>
  <div class="practice-area-card stagger-item reveal">
    <h3>🏍️ Motorcycle Accidents</h3>
    <p>Motorcycle riders deserve aggressive representation. We understand the unique challenges bikers face after accidents.</p>
    <a href="practice-areas.html">Learn More →</a>
  </div>
  <div class="practice-area-card stagger-item reveal">
    <h3>🚛 Truck Accidents</h3>
    <p>Commercial truck accidents often cause catastrophic injuries. We take on trucking companies and their insurers.</p>
    <a href="practice-areas.html">Learn More →</a>
  </div>

  <!-- Add New Cards with reveal class -->
  <div class="practice-area-card stagger-item reveal">
    <h3> Rideshare Accidents</h3>
    <p>Accidents involving Uber and Lyft have unique insurance complexities. We navigate them to protect your rights.</p>
    <a href="practice-areas.html">Learn More →</a>
  </div>
  <div class="practice-area-card stagger-item reveal">
    <h3>🚶 Pedestrian Accidents</h3>
    <p>When a vehicle strikes a pedestrian, the injuries can be life-altering. We hold negligent drivers accountable.</p>
    <a href="practice-areas.html">Learn More →</a>
  </div>
  <div class="practice-area-card stagger-item reveal">
    <h3>🚲 Bicycle Accidents</h3>
    <p>Cyclists are vulnerable on the road. We fight to ensure your rights and safety are respected after a collision.</p>
    <a href="practice-areas.html">Learn More →</a>
  </div>
</div>
```

### **8. Client Testimonials Auto-Slide**

-   **Issue:** The client testimonial slider is not auto-sliding.
-   **Fix:** The slider component in `index.html` has `data-autoplay="true"`. Webflow's JavaScript (`webflow.js`) should handle this. If it's not working, it might be disabled by another script. Add a small script to `enhancements.js` to force it.

**File:** `js/enhancements.js`
**Add the following JavaScript:**

```javascript
$(document).ready(function() {
    // Force Webflow slider to start autoplaying
    var testimonialSlider = $('.testimonial-slider');
    if (testimonialSlider.length > 0) {
        setTimeout(function() {
            testimonialSlider.find('.w-slider-arrow-right').click();
        }, 4000); // 4000ms matches the data-delay attribute
    }
});
```

### **9. Office Locations Alternating Layout**

-   **Issue:** The office locations layout is broken and does not alternate.
-   **Fix:** Add a CSS rule to reverse the `flex-direction` for even-numbered `.office-locations` elements.

**File:** `css/enhancements.css`
**Add the following CSS:**

```css
.office-locations:nth-child(even) {
  flex-direction: row-reverse;
}
```

### **10. Footer White Separator Lines**

-   **Issue:** The footer has unwanted white separator lines between nav items.
-   **Fix:** The lines are `border-top` and `border-bottom` on `.div-block-23`. Remove them.

**File:** `css/reardon-injury-law.webflow.css`
**Modify the `.div-block-23` class:**

```css
/* FROM */
.div-block-23 {
  border-top: 1px solid #eeba6b;
  border-bottom: 1px solid #eeba6b;
  margin-top: 46px;
  margin-bottom: 52px;
}

/* TO */
.div-block-23 {
  border-top: none;
  border-bottom: none;
  margin-top: 46px;
  margin-bottom: 52px;
}
```

---

## **II. About Page (`about.html`)**

-   **Issue:** Content is overlapping the footer.
-   **Fix:** This is a `z-index` or layout issue. Without seeing `about.html`, the general solution is to ensure the main content wrapper does not have a fixed height and that the footer is not positioned absolutely without a relative parent. A common fix is to ensure the page wrapper uses flexbox to push the footer down.

**File:** `css/reardon-injury-law.webflow.css`
**Modify the `.page-wrapper` class (if not already set this way):**

```css
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.ril-footer {
  margin-top: auto; /* Pushes footer to the bottom */
}
```
**If the issue persists, a higher `z-index` on the footer might be needed.**
```css
.ril-footer {
  position: relative; /* z-index requires a non-static position */
  z-index: 10;
}
```

---

## **III. Practice Areas Page (`practice-areas.html`)**

-   **Issue:** The entire page turns gold on hover.
-   **Fix:** There is likely a broad `:hover` pseudo-class affecting a main container or the `body`. Find and remove it. It's likely on `.sectionnn.practice-areas:hover` or a similar class.

**File:** `css/reardon-injury-law.webflow.css`
**Modify/Remove the problematic hover effect:**

```css
/* FIND and REMOVE or COMMENT OUT a rule like this: */
.sectionnn.practice-areas:hover {
  border-color: #eeba6b00; /* This seems to be the culprit */
  /* Potentially other properties here causing a background change */
}

/* Or, more broadly, if a parent container is affected: */
.body:hover, .page-wrapper:hover {
    /* Look for background-color changes here */
}
```
The specific selector from the provided CSS is `.div-block-3:hover`. It changes the background color to gold.

**Modify `.div-block-3:hover`**
```css
/* FROM */
.div-block-3:hover {
  color: #eeba6b;
  background-color: #eeba6b;
  border-color: #eeba6b;
}

/* TO */
.div-block-3:hover {
  /* Style as desired, but do not change the entire background */
  border-color: #eeba6b;
}

```

---

This spec provides detailed, actionable steps for Wraith to implement all client feedback.
