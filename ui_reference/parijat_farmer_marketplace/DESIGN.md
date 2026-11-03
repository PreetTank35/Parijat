---
name: Parijat Farmer Marketplace
colors:
  surface: '#eefdf1'
  surface-dim: '#cfded2'
  surface-bright: '#eefdf1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e8f7eb'
  surface-container: '#e3f2e6'
  surface-container-high: '#ddece0'
  surface-container-highest: '#d7e6da'
  on-surface: '#121e17'
  on-surface-variant: '#3f4942'
  inverse-surface: '#26332b'
  inverse-on-surface: '#e5f5e8'
  outline: '#6f7a71'
  outline-variant: '#bfc9bf'
  surface-tint: '#186c44'
  primary: '#00512f'
  on-primary: '#ffffff'
  primary-container: '#176b43'
  on-primary-container: '#99e9b6'
  inverse-primary: '#88d7a6'
  secondary: '#296b38'
  on-secondary: '#ffffff'
  secondary-container: '#acf3b2'
  on-secondary-container: '#2f713d'
  tertiary: '#594300'
  on-tertiary: '#ffffff'
  tertiary-container: '#765a00'
  on-tertiary-container: '#ffd366'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a4f4c1'
  primary-fixed-dim: '#88d7a6'
  on-primary-fixed: '#002110'
  on-primary-fixed-variant: '#005230'
  secondary-fixed: '#acf3b2'
  secondary-fixed-dim: '#91d798'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#095222'
  tertiary-fixed: '#ffdf97'
  tertiary-fixed-dim: '#ecc156'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4400'
  background: '#eefdf1'
  on-background: '#121e17'
  surface-variant: '#d7e6da'
typography:
  headline-xl:
    fontFamily: Noto Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
  headline-xl-mobile:
    fontFamily: Noto Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-xl:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  label-xl:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  label-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  label-md:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
---

## Brand & Style

The design system is constructed for rural agricultural communities across Maharashtra and the broader Hindi belt. Its core users are smallholder farmers, custom hiring centers, and village-level agricultural service providers. Many users navigate interfaces with developing digital fluency, varying degrees of textual literacy, and outdoors under direct, harsh sunlight on low-cost Android smartphones.

The aesthetic philosophy centers on **Warm Tactile Clarity**:
- **Picture-First, Meaning-Forward**: Visual signifiers (photorealistic tool renders, physical crops, intuitive glyphs, and audio-first cues) precede textual descriptions. No technical jargon, nested settings, or enterprise SaaS conventions.
- **Physical Trust & Agricultural Vitality**: Drawing inspiration from the deep viridian of lush irrigated fields, the warm cream of sun-baked courtyards, and the golden amber of harvested mustard and wheat.
- **High Affordance & Generous Ergonomics**: Elements must look instantly touchable. Touch targets never dip below 48px (standardizing on 56px for critical interactions) to accommodate calloused hands, single-handed outdoor use, and varied motor precision.
- **Dignified Simplicity**: Rather than a stripped-down "basic" interface, the system delivers an editorial, crafted warmth that respects the farmer's time, livelihood, and intelligence without cognitive bloat.

## Colors

The palette balances intense outdoor visibility with organic earthiness, anchoring critical workflows in unmistakable functional states.

### Color Tokens & Assignments
- **Primary (`#176B43` - Deep Banyan Green)**: The anchor of authority, reliability, and completion. Used for primary CTA buttons, selected navigation states, verified farmer badges, and confirmed booking states. Meets AAA contrast against `#FAF8F1` and `#FFFFFF`.
- **Secondary (`#65A86E` - Foliage Leaf Green)**: Used for progressive disclosure, secondary accents, active state outlines, toggles, and status markers indicating active equipment availability.
- **Tertiary (`#F4C95D` - Harvest Mustard Yellow)**: An evocative, high-attention warmth token. Used for critical alerts, pending rental confirmations, weather warning highlights, call-out badges, and star ratings. Paired strictly with `#26332B` text for contrast compliance.
- **Neutral Primary (`#26332B` - Deep Forest Charcoal)**: Replaces stark pitch black. Used for all primary textual content, Devanagari numerals, and prominent iconography, ensuring extreme contrast without glare.
- **Neutral Subtle (`#58685E` - Weathered Silt)**: Secondary text, measurement units (उदा. /एकर, /तास), and non-critical captions.
- **Background Base (`#FAF8F1` - Warm Raw Cream)**: Canvas wash that cuts screen glare under open skies while preventing the clinical coldness of pure white.
- **Surface Elevation (`#EAF5E9` - Sprout Mist)**: Subtle functional container surface, table headers, audio prompt banners, and active filter chip fills.
- **Card Surface (`#FFFFFF` - Crisp White)**: Dedicated crisp base for cards, modals, and input fields to isolate interactive zones from the cream canvas.
- **Error / Urgent Alert (`#C8382B` - Terracotta Red)**: For machine breakdown alerts, cancellation notices, and emergency support triggers.

## Typography

The design system standardizes on **Noto Sans** (inclusive of its complete, native Devanagari script integration) across all typographic roles. Noto Sans Devanagari provides optimal matra placement, balanced conjuncts, and uncompromised legibility at varying viewing angles and smaller screen sizes.

### Typographic Guidelines
- **Bilingual Equilibrium**: Marathi and Hindi conjuncts demand greater vertical line-height than standard Latin text. A minimum line-height multiplier of `1.4x` to `1.55x` is strictly enforced to prevent vowel sign (`matra`) clipping.
- **Weight as Legibility**: Thin weights (<400) are eliminated. The system deploys `400 (Regular)`, `500 (Medium)`, `600 (SemiBold)`, and `700 (Bold)`.
- **Numerals**: Equipment rates (उदा. ₹८००/तास or ₹800/hr) must render at `label-xl` or `headline-md` weights to ensure financial terms are never misread. Both international Latin numerals and Devanagari numerals are supported symmetrically.
- **Minimum Type Threshold**: No text element may drop below `13px` (`label-md`). Fine print and disclaimers are eliminated in favor of direct, plain-language audio-assisted summaries.

## Layout & Spacing

The layout philosophy follows a mobile-first, single-column stack optimized for handheld usage in outdoor physical environments, expanding to a structural grid on tablet kiosks and desktop community access centers.

### Form Factors & Adaptation
- **Mobile (< 640px)**: 4-column fluid layout. Canvas outer margin is `1rem (16px)`. Critical interactions live in the "Thumb Zone" (lower 40% of the screen), anchored by a persistent, high-contrast bottom action dock.
- **Tablet / Kiosk (640px - 1024px)**: 8-column layout with `1.5rem (24px)` gutters and `2rem (32px)` margins. Used by village Panchayat centers or agricultural input shops acting as booking hubs. Split-pane layout puts equipment photos on the left and booking calendars/audio walkthroughs on the right.
- **Desktop (>= 1025px)**: 12-column centered layout constrained to a maximum content width of `1180px`.

### Spacing Principles
- Visual hierarchy relies on distinct grouping blocks rather than paper-thin separator lines.
- Internal component padding never cramps content: cards maintain an internal padding of `space-md` (16px) to `space-lg` (24px) to preserve breathing room between touch targets.

## Elevation & Depth

This design system avoids multi-tiered, complex drop shadows that wash out under sunlight or render poorly on budget GPU chipsets. Depth is established through **Tonal Layering combined with Warm Structural Shadows**.

### Depth Layers
- **Ground (`Level 0`)**: The warm canvas (`#FAF8F1`). All default layouts rest directly on this natural earth tone.
- **Raised (`Level 1`)**: Cards, equipment tiles, and list modules rendered in `#FFFFFF`. Visual separation is achieved with a 1px border of `#E5E0D3` and a soft, warm ambient shadow: `0 2px 6px rgba(38, 51, 43, 0.06)`.
- **Interactive Floating (`Level 2`)**: Active date pickers, equipment booking sheets, and bottom sheets. Casts a grounded shadow: `0 8px 24px rgba(23, 107, 67, 0.12), 0 2px 6px rgba(38, 51, 43, 0.08)`.
- **Top Utility (`Level 3`)**: Audio assistance pill and call-to-action bar: `0 -4px 16px rgba(38, 51, 43, 0.10)`.

### Border Integrity
To maintain visual clarity regardless of screen contrast calibration, interactive cards use a faint organic boundary: `1px solid rgba(38, 51, 43, 0.08)`. Hover or focus states shift this outline directly to `2px solid #176B43`.

## Shapes

The shape rhythm leverages a roundedness value of `2` (`0.5rem / 8px` base, scaling to `1rem / 16px` on structural containers). 

- **Cards and Containers**: Use `rounded-lg` (`1rem / 16px`) to produce friendly, approachable shapes reminiscent of natural contours without wasting usable display real estate.
- **Buttons and Primary Interactive Chips**: Use full pill rounding (`9999px`) for quick tactile identification. A pill button signifies an immediate touch action (उदा. "आता बुक करा" / "Book Now" or "कॉल करा" / "Call Owner").
- **Visual Media & Equipment Tiles**: Image containers use `rounded-lg` with subtle inset borders to blend photographic equipment imagery cleanly into card headers.
- **Badges and Status Strips**: Tag indicators use `rounded-md` (`0.5rem / 8px`) for compact legibility.

## Components

### 1. Buttons
- **Primary Action (Direct Rental / Confirm)**: Min-height `56px`. Full pill-radius (`9999px`). Background `#176B43`, text `#FFFFFF`, font `label-xl`. Includes an integrated primary action icon on the left (उदा. tractor icon, phone receiver, or green checkmark).
- **Secondary Action (Call Owner / Details)**: Min-height `52px`. Outlined with `2px solid #176B43`, background `#FFFFFF`, text `#176B43`.
- **Assistance Button (Audio Guide / Bol Kar Samjhein)**: Min-height `48px`. Background `#F4C95D`, text `#26332B`, bold icon showing a pulsating speaker or microphone. Always visible or anchored to major workflow steps.

### 2. Equipment Cards
- White `#FFFFFF` card with `16px` corner radius and `1px solid rgba(38, 51, 43, 0.08)` outline.
- **Image Header**: High-contrast, clean 4:3 ratio photo of the tractor/harvester/rotavator with clean cutout or real-field background.
- **Meta Content**: Equipment name in `headline-md`, followed by location distance badge (उदा. "२ किमी अंतर" / "2 km away") in Sprout Mist surface (`#EAF5E9`).
- **Pricing Anchor**: Rent rate displayed prominently (उदा. `₹७५० / तास`) using `headline-lg` in `#176B43`.
- **Bottom Card Action**: Dual button pair: direct call button (with phone icon) and "Book" button.

### 3. Chips & Category Selectors
- **Large Visual Category Chips**: Horizontally scrollable or 2x2 grid. Size `72px x 80px`. Contains a high-fidelity tool illustration above a bold 1-line label (उदा. "ट्रॅक्टर", "पेरणी यंत्र", "हार्वेस्टर").
- **Filter Chips**: Height `44px`. Default state has `#FFFFFF` fill with `#58685E` text. Selected state has `#176B43` fill with crisp `#FFFFFF` text and a distinct checkmark icon.

### 4. Input Fields & Form Controls
- **Text & Number Inputs**: Minimum height `56px`. Font size `18px` to ensure readable input for phone numbers, OTPs, and land area (उदा. एकर).
- **Voice-Assisted Input**: Every form input is accompanied by a dedicated mic button within the trailing edge of the field, enabling spoken Hindi/Marathi inputs.
- **Checkboxes & Radios**: Minimum visual footprint `28px x 28px` with an expanded interactive touch area of `48px x 48px`. Active radio displays an unmistakable solid dot of `#176B43` with a thick boundary.

### 5. Audio Help Floating Pill (Vernacular Assistant)
- Floating bottom-right or docked above the primary CTA. 
- Features a speaker symbol, text: "ऐका आणि समजून घ्या" (Listen & Understand), and an animated sound wave indicator. Tapping plays high-clarity voice instructions in the farmer's selected dialect explaining the current screen.