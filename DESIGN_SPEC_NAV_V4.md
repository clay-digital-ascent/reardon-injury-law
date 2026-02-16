# DESIGN_SPEC_NAV_V4: Responsive Navigation Bar Fix

## Problem Description:
The current navigation bar implementation, specifically the logo and navigation links, is not fully responsive. While it functions correctly on wide screens, at narrower screen widths (likely tablet-sized breakpoints, e.g., 991px down to 768px), the navigation links are wrapping below the logo. This breaks the intended single-line layout of the header, which should persist until the mobile hamburger menu breakpoint is activated.

## Files Involved:
-   `/Users/digitalascent/.openclaw/workspace/reardon-injury-law/css/enhancements.css`
-   `/Users/digitalascent/.openclaw/workspace/reardon-injury-law/css/reardon-injury-law.webflow.css`

## Analysis of Current CSS:

### Key Observations from `enhancements.css`:
-   `.container-10.w-container`: Correctly uses `display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap;`. `flex-wrap: nowrap` is crucial for preventing wrapping.
-   `.ril-logo.w-nav-brand`: Set to `display: flex; align-items: center; flex-shrink: 0;`. `flex-shrink: 0` prevents the logo from shrinking, which can be problematic if the logo has a fixed large width.
-   `.nav-menu-2.w-nav-menu`: Set to `display: flex; align-items: center; margin-top: 0; padding-top: 0;`.
-   `.nav-link`: Has a relatively large `font-size: 26px` and `padding: 18px 20px`.

### Key Observations from `reardon-injury-law.webflow.css`:
-   `.container-10`: Has `max-width: 1500px;`.
-   `.ril-logo`: Has a fixed `width: 400px; height: 60px;`. This fixed large width is a major contributor to the wrapping issue at narrower screen sizes, as it doesn't allow the logo to shrink.
-   `.nav-menu-2`: Has `margin-top: 14px; padding-top: 9px;`, which conflicts with `enhancements.css` setting these to `0`. While not directly causing wrapping, it's a style inconsistency.
-   `.nav-link`: Confirms `font-size: 26px` and other styling.
-   `@media screen and (max-width: 991px)` and `(max-width: 767px)`: Existing media queries are present, which are suitable for implementing responsive adjustments.

### Root Cause of Wrapping:
The primary cause of the navigation links wrapping is the combination of:
1.  **Fixed `width: 400px` on `.ril-logo`**: This rigid width consumes significant horizontal space, especially on medium-sized screens (tablets, smaller desktops) where the total available width is reduced, but the mobile menu breakpoint hasn't been reached yet.
2.  **Large `font-size` and `padding` on `.nav-link`**: The generous spacing around each navigation link, when combined with the fixed-width logo, exhausts the available horizontal space within the `.container-10`, forcing the links to wrap.
3.  **`flex-shrink: 0` on `.ril-logo`**: While `flex-wrap: nowrap` prevents wrapping of the entire flex container, `flex-shrink: 0` on the logo prevents it from reducing its size, thus pushing other flex items (the navigation links) out of space, leading to overflow or pushing them to new lines if `flex-wrap` was `wrap`. Since it's `nowrap`, it creates overflow, which is visually similar to wrapping if the container is not wide enough.

## Proposed Solution:

The solution involves making the logo and navigation links more flexible and adaptive to varying screen widths above the mobile hamburger menu breakpoint (typically 767px in Webflow). We will leverage CSS media queries to adjust sizes and spacing.

**Objective:** Maintain a single-line layout for the logo and navigation links for all screen sizes greater than 767px.

### Implementation Details for `css/enhancements.css`:

Wraith should implement the following changes in `css/enhancements.css`.

```css
/* =======================================
   NAVBAR ENHANCEMENTS (REVISED)
   ======================================= */

/* Ensure the main navbar container uses flexbox correctly
   and prevents wrapping of its direct children (logo and nav menu). */
.container-10.w-container {
  display: flex;
  justify-content: space-between; /* Distribute space between logo and nav menu */
  align-items: center;            /* Vertically center items */
  flex-wrap: nowrap;              /* IMPORTANT: Prevent elements from wrapping to a new line */
}

/* RIL Logo - Make it responsive and prevent excessive shrinking/growing */
.ril-logo.w-nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;   /* Prevent logo from shrinking below its content size */
  flex-grow: 0;     /* Prevent logo from growing unnecessarily */
  max-width: 250px; /* Set a maximum width for the logo on larger screens */
  width: 100%;      /* Allow the logo to scale down proportionally */
  height: auto;     /* Maintain aspect ratio */
}

/* Navigation Menu - Allow it to shrink and grow, and push links to the right */
.nav-menu-2.w-nav-menu {
  display: flex;
  align-items: center;
  margin-top: 0;    /* Override conflicting Webflow styles */
  padding-top: 0;   /* Override conflicting Webflow styles */
  flex-shrink: 1;   /* Allow the nav menu to shrink if space is limited */
  flex-grow: 1;     /* Allow the nav menu to grow to fill available space */
  justify-content: flex-end; /* Align nav links to the right within the nav menu */
}

/* Individual Navigation Links - Adjust for flexibility */
.nav-link {
  position: relative;
  font-size: 26px; /* Original size, will be adjusted in media queries */
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 18px 20px; /* Original padding, will be adjusted in media queries */
  transition: color 0.3s ease;
  white-space: nowrap; /* Prevent individual link text from wrapping */
}

/* =======================================
   RESPONSIVE BREAKPOINTS (ADDITIONS FOR NAVBAR)
   ======================================= */

/* Tablet and smaller desktop screens (e.g., 992px to 768px) */
/* At this breakpoint, the navbar should still be a single line,
   but elements need to be more compact. */
@media screen and (max-width: 991px) {
  .ril-logo.w-nav-brand {
    max-width: 180px; /* Reduce logo size further for tablets */
  }

  .nav-link {
    font-size: 16px;      /* Significantly reduce font size for more space */
    padding: 10px 12px;   /* Reduce padding around links */
  }
}

/* Mobile Screens (e.g., 767px and below) */
/* At this breakpoint, Webflow typically activates the hamburger menu.
   These styles are for the expanded mobile menu, ensuring a clean vertical stack. */
@media screen and (max-width: 767px) {
  .ril-logo.w-nav-brand {
    max-width: 150px; /* Smallest logo size for mobile */
  }

  /* When the hamburger menu is active, stack nav items vertically */
  .nav-menu-2.w-nav-menu {
    flex-direction: column;    /* Stack links vertically */
    align-items: flex-start;   /* Align links to the left */
    width: 100%;               /* Make menu take full width */
    /* Existing background and padding from current enhancements.css are suitable here */
  }

  .nav-link {
    width: 100%;               /* Ensure each link takes full width in mobile menu */
    text-align: left;          /* Align text to the left */
    font-size: 18px;           /* Adjust font size for mobile readability */
    padding: 15px 10px;        /* Consistent padding for mobile links */
    white-space: normal;       /* Allow link text to wrap if it's very long */
    /* Existing border-bottom from current enhancements.css is suitable */
  }
  
  /* Remove border from the last nav link in the mobile menu for a cleaner look */
  .nav-link:last-child {
    border-bottom: none;
  }
}
```

## Instructions for Wraith:

1.  **Locate `css/enhancements.css`**: Open the file `/Users/digitalascent/.openclaw/workspace/reardon-injury-law/css/enhancements.css`.
2.  **Replace/Update Navbar Section**:
    *   Find the `/* NAVBAR ENHANCEMENTS */` section.
    *   Replace the existing CSS rules for `.container-10.w-container`, `.ril-logo.w-nav-brand`, `.nav-menu-2.w-nav-menu`, and `.nav-link` with the provided "NAVBAR ENHANCEMENTS (REVISED)" block.
3.  **Add Responsive Breakpoints**:
    *   Locate the `/* RESPONSIVE BREAKPOINTS (CONSOLIDATED) */` section or a suitable area for new media queries.
    *   Add the new `@media screen and (max-width: 991px)` and `@media screen and (max-width: 767px)` blocks exactly as provided under "RESPONSIVE BREAKPOINTS (ADDITIONS FOR NAVBAR)". Ensure these are added *after* any existing media queries in `enhancements.css` to ensure proper cascading.
4.  **Testing**: After implementation, thoroughly test the navigation bar on various screen widths:
    *   **Wide screens:** (e.g., 1200px and up) - Ensure logo and nav links are on one line, well-spaced.
    *   **Tablet/Smaller Desktop screens:** (e.g., 992px down to 768px) - Crucially, ensure the logo and nav links remain on a single line, becoming more compact as the screen narrows. No wrapping should occur.
    *   **Mobile screens:** (e.g., 767px and below) - Verify that the hamburger menu appears and, when opened, the navigation links stack vertically and are readable.

This spec provides a robust solution to ensure the navigation bar remains stable and aesthetically pleasing across all required screen sizes.
