# DESIGN SPEC V3 - Final Client Feedback Resolution

**Project:** Reardon Injury Law  
**Date:** February 2, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

This spec addresses the final round of client feedback. I've performed a root cause analysis on each issue and provided specific, copy-pasteable fixes for Wraith.

---

## Issue 1: Top Nav Menu Text Size Still Too Small

### Root Cause Analysis
The `.nav-link` font size is set to `25px` in `reardon-injury-law.webflow.css` (line ~243), but is **overridden to `15px`** in `enhancements.css` (line ~423). The client wants it noticeably larger.

### Fix Location
**File:** `css/enhancements.css`

### Current Code (around line 423)
```css
.nav-link {
  position: relative;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 10px 16px;
  transition: color 0.3s ease;
}
```

### Replace With
```css
.nav-link {
  position: relative;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 18px 20px;
  transition: color 0.3s ease;
}
```

### Changes Made
- `font-size`: `15px` → `30px` (doubled)
- `font-weight`: `600` → `700` (bolder)
- `padding`: Increased for better spacing

---

## Issue 2: Section Title Boxes (`.text-headings`) - White Text on Gold Background

### Root Cause Analysis
**THIS IS THE CRITICAL BUG.** At the bottom of `enhancements.css` (around line 590), there's a "WEBFLOW OVERRIDES" section that **incorrectly** forces `.text-headings` to have a gold background:

```css
/* Gold color (#eeba6b) overrides - use CSS variable --gold-primary */
.button-primary,
/* ... many classes ... */
.text-headings,  /* <-- BUG: This should NOT be here! */
/* ... more classes ... */
{
  background-color: var(--gold-primary) !important;
}
```

The `.text-headings` class is being caught in a blanket `!important` override meant for buttons and other elements. This is overriding the correct dark background styling earlier in the file.

### Fix Location
**File:** `css/enhancements.css`

### Fix Part 1: Remove `.text-headings` from the gold override list

Find this block (around line 590-620):
```css
/* Gold color (#eeba6b) overrides - use CSS variable --gold-primary */
.button-primary,
.button-3,
.button-4,
.card-top-bar,
.div-block-3:hover,
.div-block-9,
.div-block-10,
.div-block-24,
.navbar-2,
.navbar-3,
.nav-link:hover,
.icon:hover,
.dropdown-toggle:hover,
.quick-stack-2,
.section,
.text-block-6,
.heading-9,
.div-block-4,
.div-block-6,
.div-block-8.bg,
.div-block-8.contact-us-now,
.div-block-8.sep,
.practice-areas:hover,
.text-headings,
.practice-fields-grid:hover,
.text-center,
.div-block-23,
.ril-footer,
.submit-button:hover,
.accordion-text-block {
  background-color: var(--gold-primary) !important;
}
```

**Remove `.text-headings,` from this list completely.**

### Fix Part 2: Remove `.text-headings` from the border override list

Find this block (around line 625-640):
```css
/* Border color overrides with gold */
.button-3,
.button-3:hover,
.button-4,
.button-4:hover,
.div-block-6,
.div-block-24,
.navbar-2,
.navbar-3,
.practice-fields-grid:hover,
.text-headings,
.testimonial-slider,
.div-block-23,
.submit-button,
.code-embed,
.div-block-3 {
  border-color: var(--gold-primary) !important;
}
```

**Remove `.text-headings,` from this list as well.**

### Fix Part 3: Ensure correct `.text-headings` styling (around line 55-70)

The correct styling is already defined earlier in `enhancements.css`. To ensure it wins, update it:

**Find this block (around line 55):**
```css
/* Section headings - elegant underline treatment */
.text-headings {
  font-size: 42px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  background-color: var(--dark-bg);
  color: var(--text-light);
  border: 2px solid var(--gold-primary);
  border-radius: 12px;
  margin-bottom: 60px;
  padding: 20px 30px;
  position: relative;
  text-align: center;
}
```

**Replace with (adding `!important` for safety):**
```css
/* Section headings - elegant underline treatment */
.text-headings {
  font-size: 42px;
  line-height: 1.3;
  font-weight: 600;
  letter-spacing: -0.01em;
  background-color: var(--dark-bg) !important;
  color: var(--text-light) !important;
  border: 2px solid var(--gold-primary) !important;
  border-radius: 12px;
  margin-bottom: 60px;
  padding: 20px 30px;
  position: relative;
  text-align: center;
}
```

### Expected Result
- **Background:** Dark (#141415)
- **Text:** White/light
- **Border:** Gold 2px solid
- **Appearance:** Dark box with gold border (readable, professional)

---

## Issue 3: FAQ Accordion Buttons - Black Arrows on Dark Background

### Root Cause Analysis
The FAQ accordion arrows use `<img>` tags pointing to `images/faq-icon.svg`. Since it's an `<img>`, we cannot style the fill color with CSS. The icon is black and blends into the dark background.

### Fix Location
**File:** `index.html` (5 occurrences in the FAQ section)

### Current Code (example from one accordion)
```html
<div class="div-block-29">
  <h2 class="heading-22">What types of cases does Reardon Injury Law handle?</h2>
  <img src="images/faq-icon.svg" loading="lazy" width="24" alt="" class="questions-button">
</div>
```

### Replace Each `<img>` With This Inline SVG
```html
<div class="div-block-29">
  <h2 class="heading-22">What types of cases does Reardon Injury Law handle?</h2>
  <svg class="questions-button" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>
```

**Note:** This is a plus (+) icon. Replace ALL 5 occurrences in the FAQ section.

### CSS Addition
**File:** `css/enhancements.css`  
**Location:** Add after the `.questions-button` existing rule (or create new)

```css
/* FAQ Accordion Icon - Gold on dark background */
svg.questions-button {
  width: 24px;
  height: 24px;
  color: var(--gold-primary);
  transition: transform 0.3s ease, color 0.3s ease;
  flex-shrink: 0;
}

svg.questions-button:hover {
  color: var(--gold-light);
}

.accordion-text-block.active svg.questions-button {
  transform: rotate(45deg);
  color: var(--gold-light);
}
```

### Expected Result
- Icon is **gold** colored and visible against dark background
- Rotates 45° when accordion is open (+ becomes ×)
- Smooth transition animation

---

## Issue 4: "Locations Throughout California" Section Redesign

### Root Cause Analysis
The current layout with the floating California map and FAQs side-by-side feels disjointed. The map is positioned absolutely which causes layout issues.

### Proposed Redesign
Transform this into a more cohesive "Service Area + FAQ" section with:
1. A cleaner heading treatment
2. Map as a contained, centered element
3. FAQ list below with better spacing
4. Optional: Add location pins/badges to highlight service areas

### Fix Location
**File:** `css/enhancements.css`

### Add New CSS (append to file or replace existing `.sectionnn.image` rules)

```css
/* =======================================
   CALIFORNIA SERVICE AREA SECTION - REDESIGN
   ======================================= */

.sectionnn.image {
  height: auto;
  min-height: auto;
  padding: 80px 40px 100px;
  margin: 0 0 60px 0;
  background: linear-gradient(180deg, var(--dark-bg) 0%, #0f0f10 100%);
  position: relative;
}

/* Container for the map/FAQ section */
.container-24 {
  max-width: 1400px;
  margin: 0 auto;
}

/* Two-column layout wrapper */
.page-wrapperr {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  min-height: auto;
  height: auto;
}

/* Map container */
.locations-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(145deg, #1a1a1b 0%, var(--dark-bg) 100%);
  border: 1px solid rgba(238, 186, 107, 0.2);
  border-radius: 20px;
  position: relative;
}

.locations-wrapper::before {
  content: 'SERVING ALL OF CALIFORNIA';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark-bg);
  color: var(--gold-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 4px 16px;
  border: 1px solid var(--gold-primary);
  border-radius: 20px;
}

/* Map image */
.image-9 {
  position: relative;
  width: 100%;
  max-width: 450px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: transform 0.5s ease, filter 0.5s ease;
}

.image-9:hover {
  transform: scale(1.03);
  filter: drop-shadow(0 20px 50px rgba(238, 186, 107, 0.15));
}

/* FAQ list wrapper */
.faq-list-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Section heading override for this section */
.text-headings.locations-thour {
  margin-left: 0;
  margin-bottom: 50px;
  font-size: 38px;
}

/* Responsive: Stack on tablet */
@media screen and (max-width: 991px) {
  .page-wrapperr {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .locations-wrapper {
    order: 2;
  }
  
  .faq-list-wrapper {
    order: 1;
  }
  
  .image-9 {
    max-width: 350px;
    margin: 0 auto;
  }
}

@media screen and (max-width: 767px) {
  .sectionnn.image {
    padding: 60px 20px 80px;
  }
  
  .text-headings.locations-thour {
    font-size: 28px;
  }
}
```

### Expected Result
- Clean grid layout (map left, FAQs right)
- Map contained in a bordered card with "SERVING ALL OF CALIFORNIA" badge
- Responsive stacking on mobile (FAQs first, then map)
- Consistent spacing and alignment

---

## Issue 5: Inconsistent Section Spacing (Large Gap Before Office Locations)

### Root Cause Analysis
In `reardon-injury-law.webflow.css` (line ~422), the `.sectionnn.client-test-section` has:
```css
.sectionnn.client-test-section {
  margin-bottom: 402px;
}
```

This 402px margin creates a huge gap before "Office Locations".

### Fix Location
**File:** `css/enhancements.css`

### Add This Override (creates consistent spacing for all sections)

```css
/* =======================================
   CONSISTENT SECTION SPACING
   ======================================= */

/* Base section spacing */
.sectionnn {
  margin-top: 0;
  margin-bottom: 80px;
  padding-bottom: 60px;
}

/* Remove the excessive margin from testimonials section */
.sectionnn.client-test-section {
  margin-bottom: 80px !important;
}

/* Ensure Office Locations section aligns properly */
.container-17 {
  margin-top: 40px;
}

/* Consistent spacing for section headers */
.container-18 {
  margin-top: 0;
  margin-bottom: 60px;
}
```

### Expected Result
- All sections have consistent 80px bottom margin
- No more 402px gap before Office Locations
- Clean, professional rhythm between sections

---

## Issue 6: Office Locations Alternating Layout Not Working

### Root Cause Analysis
The CSS rule in `enhancements.css` uses:
```css
.office-locations:nth-child(even) {
  flex-direction: row-reverse;
}
```

However, the `.office-locations` elements are **direct children** of `.container-17`, so the `nth-child` selector should work. The issue is that the `reardon-injury-law.webflow.css` defines inline ordering for some items (Silicon Valley has text THEN image in the HTML itself).

Looking at `index.html`:
- **Orange County:** Image → Text (correct)
- **Silicon Valley:** Text → Image (hardcoded in HTML - already alternates!)
- **Inland Empire:** Image → Text (correct)
- **San Diego:** Text → Image (hardcoded in HTML - already alternates!)
- **Los Angeles:** Image → Text (correct)

**The HTML already alternates!** The CSS `row-reverse` is actually UN-doing the correct alternation.

### Fix Location
**File:** `css/enhancements.css`

### Current Code (around line 352)
```css
.office-locations:nth-child(even) {
  flex-direction: row-reverse;
}
```

### Replace With
```css
/* Office Locations - Remove nth-child override since HTML already alternates */
.office-locations {
  flex-direction: row;
}

/* Optional: Add subtle visual distinction for alternating rows */
.office-locations:nth-child(even) {
  /* Already reversed in HTML - no CSS reversal needed */
}
```

### Alternative Fix (If Client Wants CSS-Controlled Alternation)
If the client wants ALL image-first, then CSS-alternate, the HTML needs fixing. But the easiest solution is to **remove the `nth-child(even)` rule entirely** since the HTML already has the correct alternating order.

### Recommended Fix
Simply **delete or comment out** this rule:
```css
/* REMOVE THIS - HTML already alternates the layout */
/* 
.office-locations:nth-child(even) {
  flex-direction: row-reverse;
}
*/
```

---

## Issue 7: Practice Areas Page Turns Gold on Hover

### Root Cause Analysis
**THE BUG IS IN THE WEBFLOW OVERRIDES SECTION.**

At the bottom of `enhancements.css` (around line 602), the class `.practice-areas:hover` is included in the gold background override:

```css
.practice-areas:hover,
```

The problem is `.practice-areas` is **ALSO the class name of the entire section** (`<section class="sectionnn practice-areas">`), not just the practice area cards. So hovering ANYWHERE on the section turns the entire thing gold!

### Fix Location
**File:** `css/enhancements.css`

### Fix: Remove `.practice-areas:hover` from the override list

Find this block (around line 590-620):
```css
/* Gold color (#eeba6b) overrides - use CSS variable --gold-primary */
.button-primary,
.button-3,
.button-4,
.card-top-bar,
.div-block-3:hover,
.div-block-9,
.div-block-10,
.div-block-24,
.navbar-2,
.navbar-3,
.nav-link:hover,
.icon:hover,
.dropdown-toggle:hover,
.quick-stack-2,
.section,
.text-block-6,
.heading-9,
.div-block-4,
.div-block-6,
.div-block-8.bg,
.div-block-8.contact-us-now,
.div-block-8.sep,
.practice-areas:hover,   /* <-- REMOVE THIS LINE */
.text-headings,
.practice-fields-grid:hover,
.text-center,
.div-block-23,
.ril-footer,
.submit-button:hover,
.accordion-text-block {
  background-color: var(--gold-primary) !important;
}
```

**Remove the line `.practice-areas:hover,` completely.**

### Expected Result
- Section no longer turns gold when hovering anywhere
- Individual `.practice-area-card` elements still have their proper hover effects (defined elsewhere in enhancements.css)

---

## Summary of All Changes

| Issue | File | Action |
|-------|------|--------|
| 1. Nav text size | `css/enhancements.css` | Change `.nav-link` font-size to `30px`, font-weight to `700` |
| 2. Text headings gold bg | `css/enhancements.css` | Remove `.text-headings` from override lists; add `!important` to correct styles |
| 3. FAQ arrow icons | `index.html` + `css/enhancements.css` | Replace `<img>` with inline SVG; add gold color styles |
| 4. Map/FAQ section | `css/enhancements.css` | Add new grid-based layout CSS |
| 5. Section spacing | `css/enhancements.css` | Override `.sectionnn.client-test-section` margin to `80px` |
| 6. Office locations | `css/enhancements.css` | Remove/comment out `nth-child(even)` rule |
| 7. Practice areas gold | `css/enhancements.css` | Remove `.practice-areas:hover` from override list |

---

## Implementation Order (Recommended)

1. **Issues 2 & 7 first** - They're both caused by the same "WEBFLOW OVERRIDES" section
2. **Issue 1** - Quick font-size change
3. **Issue 5** - Quick margin fix
4. **Issue 6** - Quick CSS removal
5. **Issue 3** - HTML + CSS changes (more involved)
6. **Issue 4** - Section redesign (most involved)

---

## Testing Checklist

After implementation, verify:

- [ ] Navigation links are larger and bolder
- [ ] Section headings have dark background with gold border (not gold background)
- [ ] FAQ arrows are visible (gold) on dark background
- [ ] Map/FAQ section is properly laid out with reasonable spacing
- [ ] No huge gap between Testimonials and Office Locations
- [ ] Office locations alternate image/text correctly
- [ ] Practice Areas page does NOT turn gold on hover
- [ ] All changes work on mobile (responsive)

---

*Spec prepared by Shade for Wraith implementation*
