# PDA Your IEP - Watercolor Design System

A comprehensive design system inspired by watercolor paintings, featuring soft, organic aesthetics that create a warm and inviting user experience.

---

## Table of Contents

- [Color Palette](#color-palette)
- [Typography](#typography)
- [Backgrounds & Textures](#backgrounds--textures)
- [Watercolor Washes](#watercolor-washes)
- [Shadows](#shadows)
- [Borders](#borders)
- [Status Colors](#status-colors)
- [Cards](#cards)
- [Text Decorations](#text-decorations)
- [Animations](#animations)
- [Image Overlays](#image-overlays)
- [Usage Examples](#usage-examples)

---

## Color Palette

All colors are defined as CSS custom properties and can be used with `var(--token-name)`.

### Primary: Soft Blue
*Trust, calm, professional*

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-blue` | `#6B8FAD` | Primary color |
| `--wc-blue-light` | `#89A8C4` | Lighter variant |
| `--wc-blue-wash` | `#B8C5D1` | Very light backgrounds |
| `--wc-blue-pale` | `#E3EBF1` | Subtle backgrounds |
| `--wc-blue-dark` | `#4A6A87` | Text on light backgrounds (5.5:1 contrast) |

### Secondary: Warm Ochre
*Warmth, creativity, invitation*

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-ochre` | `#D4A574` | Secondary color |
| `--wc-ochre-light` | `#E5C4A0` | Lighter variant |
| `--wc-ochre-pale` | `#F5E6D8` | Subtle backgrounds |
| `--wc-ochre-dark` | `#8A6B48` | Buttons, darker accents |

### Accent: Golden Yellow
*Energy, positivity, hope*

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-gold` | `#E8C44A` | Accent color |
| `--wc-gold-light` | `#F2D87A` | Lighter variant |
| `--wc-gold-pale` | `#FBF3D9` | Subtle backgrounds |
| `--wc-gold-dark` | `#9A7F2E` | Text on gold backgrounds |

### Tertiary: Sage Green
*Growth, balance, nature*

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-sage` | `#7A9E7E` | Tertiary color |
| `--wc-sage-light` | `#A3BFA6` | Lighter variant |
| `--wc-sage-pale` | `#E0EDE1` | Subtle backgrounds |
| `--wc-sage-dark` | `#4A6A4E` | Text (5.8:1 contrast) |

### Neutral: Warm Brown
*Grounding, natural, readable*

| Token | Value | Usage | Contrast |
|-------|-------|-------|----------|
| `--wc-brown` | `#8B6F47` | Large text only | 4.2:1 on cream |
| `--wc-brown-light` | `#A99067` | Decorative only | - |
| `--wc-brown-muted` | `#C4B49A` | Decorative/disabled | - |
| `--wc-brown-dark` | `#5D4930` | **Body text** | 7.5:1 (AAA) |
| `--wc-brown-darker` | `#3D2F1D` | **Headings** | 12:1 (AAA) |

### Backgrounds: Paper Tones

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-cream` | `#F5F0E8` | Section backgrounds |
| `--wc-paper` | `#FDFCFA` | Card backgrounds |
| `--wc-ivory` | `#FFFEF9` | Brightest background |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--wc-success` | `#7A9E7E` | Success states |
| `--wc-success-dark` | `#4A6A4E` | Success text |
| `--wc-warning` | `#E8C44A` | Warning states |
| `--wc-warning-dark` | `#9A7F2E` | Warning text |
| `--wc-error` | `#C47A6E` | Error states |
| `--wc-error-dark` | `#8B4D43` | Error text |

---

## Typography

### Fonts

| Token | Font | Usage |
|-------|------|-------|
| `--font-nunito` | Nunito | Body text (default) |
| `--font-caveat` | Caveat | Display/headings (handwritten style) |
| `--font-geist-mono` | Geist Mono | Code/monospace |

### Font Classes

```html
<!-- Handwritten display font for special headings -->
<h1 class="font-display">Welcome</h1>

<!-- Body text uses Nunito by default -->
<p>This uses Nunito automatically</p>
```

### Text Color Classes

```html
<p class="text-warm">Warm brown text using --wc-brown</p>
<p class="text-warm-muted">Muted brown for secondary text</p>
```

### Default Heading Behavior

`h1`, `h2`, and `h3` elements automatically use the Caveat (handwritten) font.

---

## Backgrounds & Textures

### Paper Texture

```html
<!-- Soft white with subtle paper texture -->
<div class="wc-paper">Card content</div>
```

### Cream Background

```html
<!-- Warm cream for sections -->
<section class="wc-cream">Section content</section>
```

---

## Watercolor Washes

Gradient backgrounds that mimic the look of watercolor paint spreading on paper.

### Blue Wash
*Use for primary actions, headers*

```html
<div class="wc-wash-blue">Primary section</div>
```

### Ochre Wash
*Use for secondary, warm sections*

```html
<div class="wc-wash-ochre">Warm section</div>
```

### Gold Wash
*Use for highlights, success areas*

```html
<div class="wc-wash-gold">Highlighted section</div>
```

### Sage Wash
*Use for positive, growth-related content*

```html
<div class="wc-wash-sage">Growth section</div>
```

### Blend Wash
*Multi-color watercolor effect for hero backgrounds and large sections*

```html
<section class="wc-wash-blend">Hero content</section>
```

---

## Shadows

Warmer, more organic shadows using brown tones instead of gray.

| Class | Effect | Usage |
|-------|--------|-------|
| `.wc-shadow-sm` | Subtle shadow | Small elements |
| `.wc-shadow` | Standard shadow | Cards, buttons |
| `.wc-shadow-lg` | Pronounced shadow | Modals, floating elements |

```html
<div class="wc-shadow">Standard shadow</div>
<div class="wc-shadow-lg">Large shadow</div>
```

---

## Borders

Organic borders with slightly irregular, painted feel.

### Standard Border

```html
<!-- 2px ochre border with organic rounded corners -->
<div class="wc-border">Bordered element</div>
```

### Subtle Border

```html
<!-- 1px translucent border with gentle rounding -->
<div class="wc-border-subtle">Subtle bordered element</div>
```

---

## Status Colors

Semantic colors with watercolor styling for different states.

### Good/Success

```html
<div class="wc-status-good">
  <p>This is going well!</p>
</div>
```
*Sage green gradient with left border accent*

### Warning/Opportunity

```html
<div class="wc-status-warning">
  <p>Something to consider</p>
</div>
```
*Gold gradient with left border accent*

### Error/Remove

```html
<div class="wc-status-error">
  <p>Needs attention</p>
</div>
```
*Terracotta gradient with left border accent*

---

## Cards

Pre-composed card styles with paper texture, shadows, and borders.

### Basic Card

```html
<div class="wc-card p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Hoverable Card

```html
<div class="wc-card-hover p-6">
  <h3>Interactive Card</h3>
  <p>Lifts up on hover</p>
</div>
```
*Includes hover transition with shadow expansion and slight lift*

---

## Text Decorations

### Painted Underline

```html
<span class="wc-underline">Underlined text</span>
```
*Creates a hand-painted looking underline effect*

### Text Highlight

```html
<span class="wc-highlight">Highlighted text</span>
```
*Golden highlight behind text, like a highlighter marker*

---

## Animations

Subtle, organic movements that feel natural.

### Float Animation

```html
<div class="animate-wc-float">Gently floating element</div>
```
*6-second infinite loop with subtle up/down movement and tilt*

### Spread Animation

```html
<div class="animate-wc-spread">Appearing element</div>
```
*0.6-second entrance animation that fades in and scales up*

---

## Image Overlays

Apply watercolor effects over images.

### Basic Overlay

```html
<div class="wc-overlay">
  <img src="photo.jpg" alt="Photo" />
</div>
```
*Soft light blend with watercolor gradients*

### Strong Overlay

```html
<div class="wc-overlay wc-overlay-strong">
  <img src="photo.jpg" alt="Photo" />
</div>
```
*Multiply blend for more pronounced watercolor effect*

### Paper Texture Overlay

```html
<div class="wc-overlay wc-overlay-paper">
  <img src="photo.jpg" alt="Photo" />
</div>
```
*Adds paper texture grain over images*

---

## Usage Examples

### Hero Section

```html
<section class="wc-wash-blend min-h-[60vh] flex items-center">
  <div class="container">
    <h1 class="font-display text-5xl text-[var(--wc-brown-darker)]">
      Welcome to Our Site
    </h1>
    <p class="text-[var(--wc-brown-dark)]">
      Warm and inviting content here
    </p>
  </div>
</section>
```

### Feature Card

```html
<div class="wc-card-hover p-8">
  <div class="wc-wash-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
    <IconComponent class="text-[var(--wc-blue-dark)]" />
  </div>
  <h3 class="font-display text-2xl text-[var(--wc-brown-darker)] mb-2">
    Feature Title
  </h3>
  <p class="text-[var(--wc-brown-dark)]">
    Feature description text
  </p>
</div>
```

### Status Message

```html
<div class="wc-status-good p-4 rounded-lg">
  <p class="text-[var(--wc-sage-dark)] font-semibold">
    ✓ Everything looks great!
  </p>
</div>
```

### Navigation Bar

```html
<header class="bg-white border-b border-[var(--wc-ochre-pale)]">
  <nav class="container flex items-center justify-between py-4">
    <a href="/" class="font-display text-2xl text-[var(--wc-brown-darker)]">
      Logo
    </a>
    <div class="flex gap-6">
      <a href="/about" class="text-[var(--wc-brown-dark)] hover:text-[var(--wc-blue-dark)]">
        About
      </a>
    </div>
  </nav>
</header>
```

> [!NOTE]
> **Design Decision:** The navigation bar uses solid `bg-white` rather than semi-transparent backgrounds (like `bg-[var(--wc-paper)]/95`). This ensures the logo with a white background blends seamlessly regardless of page content scrolling behind the fixed header.

---

## Accessibility Notes

- **Body text** uses `--wc-brown-dark` which provides **7.5:1 contrast** (WCAG AAA)
- **Headings** use `--wc-brown-darker` which provides **12:1 contrast** (WCAG AAA)
- `--wc-brown` (4.2:1) should only be used for **large text** (18px+ or 14px+ bold)
- `--wc-brown-light` and `--wc-brown-muted` are for **decorative purposes only**
- Dark variants of semantic colors (`-dark` suffix) maintain accessible contrast ratios

---

## File Reference

All styles are defined in:
- `src/app/globals.css` - Main style definitions

Components using the design system:
- `src/components/navbar.tsx` - Navigation bar
- `src/components/ui/button.tsx` - Buttons (watercolor variant)
- All page files in `src/app/`
