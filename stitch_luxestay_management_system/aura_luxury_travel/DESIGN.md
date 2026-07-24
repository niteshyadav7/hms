---
name: Aura Luxury Travel
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display:
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is engineered for high-end hospitality and bespoke travel experiences. It evokes a sense of effortless exclusivity, blending modern technical precision with the ethereal quality of luxury service. 

The aesthetic leverages **Glassmorphism** and **Minimalism** to create a UI that feels like a premium lens—transparent, light-filled, and focused. The target audience is the discerning traveler who values efficiency, clarity, and a sophisticated digital environment that mirrors the physical quality of a five-star lounge.

## Colors
The palette is anchored by a deep **Indigo** primary, symbolizing the "blue hour" of travel—that transition between day and night. 

- **Primary Indigo:** Used for calls to action, active states, and brand-critical accents.
- **Surface Strategy:** In light mode, surfaces are pure white to maintain an airy feel. In dark mode, surfaces use a deep navy-charcoal to reduce eye strain while maintaining depth.
- **Glass Accents:** Semi-transparent versions of these colors should be used for overlays and navigation bars to provide the glassmorphic effect.

## Typography
The system utilizes **Inter** exclusively to maintain a clean, systematic, and highly legible interface. 

- **Hierarchy:** High contrast is achieved through aggressive weight stepping. 
- **Display Type:** For luxury hero sections, use the `display` token with tight tracking.
- **Labels:** Use the `label-md` token for small metadata, destination tags, or price indicators, always in uppercase to create a distinct visual rhythm from body copy.

## Layout & Spacing
This design system employs a **fluid grid** with significant breathing room to emphasize the "luxury of space."

- **Grid:** Use a 12-column grid for desktop with 24px gutters.
- **Margins:** Generous outer margins (48px) ensure content feels centered and prestigious. 
- **Reflow:** On mobile, margins shrink to 16px, and multi-column card layouts collapse into a single-column vertical stack to preserve legibility of travel details.

## Elevation & Depth
Depth is created through a combination of **Glassmorphism** and soft, ambient shadows.

- **The Aura Shadow:** Elements use a signature soft shadow: `0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06)`. This provides a "lift" without creating harsh edges.
- **Backdrop Blurs:** Navigation bars, modals, and sticky headers must use a `blur(12px)` background with a semi-transparent surface color (e.g., `rgba(255, 255, 255, 0.7)` in light mode).
- **Z-Index Tiers:** 
  - Level 0: Background
  - Level 1: Cards & Content Blocks
  - Level 2: Glass Overlays & Navigation
  - Level 3: Modals & Tooltips

## Shapes
The shape language is "Softly Geometric." While most elements follow the `roundedness: 2` (0.5rem) logic, specific luxury components utilize custom radii for a more tailored appearance.

- **Cards:** 9px radius provides a modern, crisp container for travel photography.
- **Buttons:** 5px radius creates a more professional, precise "button" feel than a standard pill, suggesting reliability.
- **Chips:** Always pill-shaped to contrast against the sharper cards.

## Components

### Dark Mode Toggle
A custom switch with an icon-only interface. In light mode, it displays a subtle sun icon; in dark mode, a moon. The toggle itself should utilize a glassmorphic background to blend into the header.

### Buttons
- **Primary:** Solid Indigo background, 5px radius, white text. No border.
- **Ghost/Glass:** Transparent background with a `1px` border of the primary color or a backdrop blur if placed over images.

### Travel Cards
The primary content vehicle. Features 9px corners, the "Aura Shadow," and a subtle `1px` inner border for definition. Text should be bottom-aligned over a 40% black gradient if placed over imagery.

### Form Inputs
Minimalist style. `1px` border using the system border color, 5px radius. On focus, the border transitions to Primary Indigo with a soft outer glow.

### Status Chips
Used for booking statuses (e.g., "Confirmed", "Pending"). Backgrounds should be 10% opacity of the status color (Emerald, Crimson, etc.) with 100% opacity text for high legibility and a sophisticated, non-aggressive look.