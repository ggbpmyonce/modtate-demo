# Modtate Design System

The design system for **Modtate** — a commercial office-leasing platform (商辦租賃平台) for the Taipei market, operated under **CyCatena** (`cycatena.com`). Internally the component library is versioned as **"CyCatena Webkit 1.0."** This system gives design agents the tokens, components, and product surfaces needed to build on-brand interfaces for the platform.

> **Brand naming.** "Modtate" is the product/platform name; "CyCatena" is the operating company. Both appear in product copy. The webkit label ("CyCatena Webkit 1.0") is the internal version string.

## Sources
- `uploads/Design System.dc.html` — the original component-library spec (colors, type, buttons, forms, selectors, alerts, badges, menus, table, icons). This single file is the source of truth; **no codebase, Figma, or slide deck was provided.** All tokens and component behaviours below are derived from it.

If you have access to the live product or a Figma file, add the links here so future iterations can cross-reference.

---

## Content Fundamentals — how Modtate writes

The product is **bilingual (English + Traditional Chinese)**. UI labels are concise English; descriptive and domain content carries Traditional Chinese alongside (e.g. `268 坪`, `商辦租賃平台`, `信義貿易大樓`).

- **Voice:** plain, transactional, confident. Short noun-phrase labels — "Browse", "My Assets", "Enquire now", "Top up". No marketing fluff inside the app.
- **Person:** addresses the user as **you** ("leased on your terms", "Welcome back"); the user's own things are **My** ("My Assets", "My Wallet").
- **Casing:** **Sentence case** for body and helper text; **Title Case** for short nav and button labels. No ALL-CAPS in content — caps are reserved for tiny overline/eyebrow labels (`01 · FOUNDATION`) with wide tracking.
- **Numbers & units:** Taiwanese conventions — area in `坪` (ping), currency as `NT$` with thousands separators, rent quoted `/ 坪 / 月`. IDs are monospace (`A-2048`).
- **Status language:** a fixed lexicon — **Open · Upcoming · Ended · Sold Out** for listings; **Active · Pending · Closed** for owned assets.
- **Tone of system messages:** factual and reassuring — "Enquiry sent — our agent will reply within 1 business day." Errors are direct and actionable — "Payment failed — check your wallet balance."
- **Emoji:** none. The brand never uses emoji in UI or content.
- **Punctuation:** em dash `—` for asides; middle dot `·` as a compact separator in meta rows.

---

## Visual Foundations

The system is **monochrome-first and quiet**. Hue is reserved almost entirely for status; the brand "accent" is *value* (black on white), not color.

- **Color:** Near-black `#1A1A1A` is the primary across fills, text and active states. A 9-step gray scale carries all structure (borders, surfaces, secondary text). Status families (Error / Info / Warning / Success) appear *only* to communicate state — never as decoration. No gradients in UI chrome; the only large dark field is the login brand panel and the app header.
- **Type:** Inter (Latin) + Noto Sans TC (繁中) as one sans voice; JetBrains Mono for IDs and code-like values. Headings are bold and tightly tracked (`-1px` on display sizes); body runs generous (1.7 line-height) for bilingual readability. Display 1 is the one *light* (300) weight.
- **Spacing:** 4px base grid. Cards breathe (`36px` interior padding); controls are compact (`10px 22px` buttons). Sections separate by `32px`.
- **Backgrounds:** flat. App canvas is a very light gray `#F4F5F6`; cards are pure white. No textures, patterns, or hand-drawn illustration. Imagery is **real photography only** — office buildings and interiors, shot bright and neutral (cool-to-neutral white balance, no heavy grain or filters).
- **Corners:** a deliberate radius ladder — `4px` checkboxes, `8px` inputs, `12px` tiles/dropdowns, `16px` cards, fully-pill (`999px`) buttons/badges/toggles. The pill button is the single most recognisable shape in the system.
- **Cards:** white, `16px` radius, `1px` `--gray-200` border, and a *very* soft resting shadow (`0 1px 3px rgba(16,24,40,.06)`). Interactive cards lift `-2px` with a deeper popover shadow on hover.
- **Shadows:** three rungs only — card (resting), dropdown (menus), popover (selects/dialogs). All are low-spread, cool, low-opacity. Elevation is subtle; the system leans on borders more than shadows.
- **Borders:** structure comes from hairline borders. `--border-strong` (`#D5D7DA`) on inputs, `--border-default` (`#E9EAEB`) on cards, `--border-subtle` (`#F3F4F6`) for table rows.
- **Hover states:** primary buttons darken (`#1A1A1A → #3A3A3A`); outline/text/menu items gain a light `--primary-100` (`#F3F3F3`) wash; list cards lift.
- **Press states:** buttons scale to `0.97`. Quick and physical.
- **Focus:** a `3px` soft black ring (`rgba(26,26,26,.1)`) plus a black border on inputs/selects; error focus uses a red ring.
- **Transparency / blur:** used sparingly — translucent white scrims behind labels on photos, semi-opaque white icon buttons over imagery. No glassmorphism / backdrop-blur in chrome.
- **Animation:** restrained. `120–140ms ease` color/shadow transitions; no bounces, no looping or decorative motion. Motion confirms interaction, never entertains.

---

## Iconography

- **Style:** a single **line-icon** family — `1.5px` stroke, round caps and joins, on a `24px` grid, drawn in `currentColor` (near-black at rest, white on dark fills). Matches the stroke icons in the original spec (search, building, calendar, user, chevrons, trash, etc.).
- **Source / substitution:** the original spec hand-draws its glyphs inline; **no icon font or sprite was shipped.** The kit ships a small matched set in `ui_kits/leasing/icons.jsx` (`window.Icons`). For broader coverage, use **[Lucide](https://lucide.dev)** from CDN — it shares the same 1.5px round-stroke, 24px-grid construction, so it drops in cleanly. *(Substitution flagged: Lucide is a stand-in for a missing first-party icon set.)*
- **Format:** inline SVG (stroke). No PNG icons, no emoji, no Unicode glyphs-as-icons. The middle dot `·` and chevron `›` are used as text separators, not icons.
- **Logo:** **no logotype asset exists on file.** A type-only `Wordmark` (`window.Wordmark`) stands in across the kit — flag for replacement when a real logo is supplied.

---

## Index / Manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill manifest for downloadable use.

**`tokens/`** — `fonts.css` · `colors.css` · `typography.css` · `spacing.css` · `radii.css`

**`guidelines/foundations/`** — specimen cards: color (base, gray, primary, status), type (families, headings, body, weights), spacing (scale, radii, elevation).

**`components/`** (namespace `window.ModtateDesignSystem_410f4d`)
- `forms/` — **Button, Input, Select, Checkbox, Radio + RadioGroup, Switch**
- `feedback/` — **Alert, Badge**
- `navigation/` — **Tabs, Pagination, Breadcrumbs**
- `layout/` — **Card**

Each directory has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and a `*.card.html` specimen.

**`ui_kits/leasing/`** — full office-leasing marketplace recreation (login, browse, listing detail, My Assets dashboard). See its `README.md`.

**Starting points:** `Button`, `Card` (Core) and the Leasing Platform screen.
