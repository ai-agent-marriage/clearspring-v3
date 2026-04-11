# Design System Document: The Breath of Silence

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Digital Sanctuary."** Unlike standard utility-driven apps, this system is designed to evoke the stillness of a mountain temple and the precision of a scientific journal. We move beyond "mobile templates" by embracing high negative space, intentional asymmetry, and an editorial rhythm that allows content to breathe.

The goal is to create a "Signature Experience"—one that feels curated rather than generated. We achieve this by breaking the rigid grid through overlapping ink-wash textures and a typographic scale that values "the pause" as much as the information.

---

## 2. Colors: Tonal Depth & Tactility
We utilize a palette rooted in nature (Forest, Gold, Rice) to create a sense of organic permanence. 

### Palette Tokens
*   **Primary (`#334537` / `primary-container: #4A5D4E`):** The depth of a forest at dusk. Reserved for grounding elements and primary CTAs.
*   **Secondary (`#6e5e00` / `secondary-container: #C9B037`):** Matte Gold. Used sparingly for milestones, "Enlightenment" moments, and sacred accents.
*   **Tertiary (`#533d20` / `tertiary-container: #A68966`):** Warm Brown. The earth beneath the forest. Used for secondary metadata and grounding UI.
*   **Universal Base (`#FAF9F4` / `#EFEEE9`):** Rice White. This is not "white," but a textured, warm neutral that reduces eye strain and feels like handmade paper.

### The "No-Line" Rule
**Explicit Instruction:** Linear borders (1px solid) are strictly prohibited for sectioning. Boundaries must be defined through:
1.  **Background Shifts:** Using `surface-container-low` components on a `surface` background.
2.  **Tonal Transitions:** Soft ink-wash gradients that fade from one area to another.
3.  **Negative Space:** Using the spacing scale to create a "void" that acts as a natural separator.

### Surface Hierarchy & Nesting
Treat the UI as stacked sheets of fine Xuan paper. 
*   **Deep Layer:** `surface-dim` or `surface-variant` for the furthest background.
*   **Content Layer:** `surface-container` for standard cards.
*   **Interactive Layer:** `surface-container-lowest` (pure white) for elements that require the highest focus, creating a "lifting" effect without traditional shadows.

### Glassmorphism & Texture
Floating action buttons or header overlays should utilize **Glassmorphism**:
*   `surface-tint` at 40% opacity + `backdrop-filter: blur(12px)`.
*   This allows the underlying ink-wash graphics to bleed through, softening the interface's edges.

---

## 3. Typography: The Editorial Voice
Our typography balance is a dialogue between the classical (`Noto Serif`) and the contemporary (`Plus Jakarta Sans`).

*   **Display & Headline (Noto Serif):** Used for titles and poetic quotes. High-contrast sizing (e.g., `display-lg` at 3.5rem) should be used to create focal points in a "minimalist void."
*   **Body & Labels (Plus Jakarta Sans):** Used for scientific descriptions, data, and navigation. This sans-serif provides the "scientific" clarity required by the brand personality.
*   **Hierarchy as Identity:** Always lead with a large Serif headline to establish the "Zen" atmosphere, followed by generously spaced Sans-serif body text for readability.

---

## 4. Elevation & Depth
In this system, depth is a feeling, not a structure. We use **Tonal Layering** to convey hierarchy.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. The subtle contrast in "warmth" creates a natural lift.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use a "Whisper Shadow":
    *   `box-shadow: 0 12px 40px rgba(74, 93, 78, 0.06);` (A tinted shadow using the Primary Forest Green color).
*   **The Ghost Border:** For high-density data where separation is vital, use the `outline-variant` token at **15% opacity**. This creates a suggestion of a boundary rather than a hard wall.

---

## 5. Components: Refined Primitives

### Buttons: The "Pebble" Style
*   **Primary:** Solid `primary-container` with `on-primary` text. Medium rounded corners (`8rpx`).
*   **Secondary:** Matte Gold (`secondary-container`) with `on-secondary-container`. Use for high-reward actions (e.g., "Claim Certificate").
*   **Tertiary:** Ghost style. No background, `primary` text, and a subtle `surface-variant` hover state.

### Cards: The "Xuan Paper" Container
*   **Style:** No borders. Use `surface-container-low` for the base.
*   **Content:** High internal padding (`40rpx`). Forbid the use of divider lines; use vertical white space or a change in typography weight to separate header from body.

### Chips: The "Organic" Filter
*   **Selected:** Solid `secondary-container` (Matte Gold) to signify value.
*   **Unselected:** `surface-variant` background with `on-surface-variant` text.

### Inputs: The "Scientific" Ledger
*   **Style:** A single bottom line using `outline-variant` at 40% opacity, or a fully enclosed `surface-container-high` box with no border.
*   **Focus State:** The bottom line transitions to `primary` (Forest Green) with a 2px stroke.

### Specialized Component: The "Ink Wash Background"
A dynamic container that injects a randomized, low-opacity CSS gradient or SVG asset mimicking a Chinese mountain range. This should be used behind `display` typography to anchor the "Zen" aesthetic.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical layouts where text is weighted to one side, leaving "The Void" (negative space) on the other.
*   **Do** use `Noto Serif` for any text that is meant to be felt or reflected upon.
*   **Do** use 2px stroke icons (Linear) to maintain the "lightness" of the UI.
*   **Do** allow images of nature or wildlife to "break the container," overlapping into the margins.

### Don't:
*   **Don't** use pure black (`#000000`). Use `on-surface` or `primary` for all "black" text to maintain tonal warmth.
*   **Don't** use standard 1px grey dividers (`#EEEEEE`). They shatter the "Zen" immersion.
*   **Don't** crowd the screen. If you feel like you need more content, you likely need more padding instead.
*   **Don't** use vibrant, high-saturation colors for errors. Use `error_container` (soft red/coral) to remain within the "Calm" brand pillar.