---
name: The Idea Genealogist
description: A museum catalogue for the ancestry of ideas, set on a cool stone wall with one ultramarine thread.
colors:
  wall: "#e8eae6"
  ink: "#15181d"
  ink-muted: "#4a5058"
  rule: "#c3c7c1"
  plate: "#d9dcd6"
  ultramarine: "#2437cc"
  slab-ink: "#f4f5ff"
  rival-brick: "#a8321c"
  night-wall: "#0e1116"
  night-ink: "#e9e7e0"
  night-ink-muted: "#9ba2ad"
  night-rule: "#2a303a"
  night-plate: "#171c25"
  night-ultramarine-text: "#93a3ff"
  night-slab: "#2f43e0"
  night-rival-brick: "#f08a73"
typography:
  display:
    fontFamily: "Libre Caslon Display, Times New Roman, serif"
    fontSize: "clamp(3.75rem, 8vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Libre Caslon Display, Times New Roman, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Libre Caslon Display, Times New Roman, serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Libre Caslon Display, Times New Roman, serif"
    fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
spacing:
  sm: "16px"
  md: "24px"
  lg: "64px"
  xl: "96px"
components:
  search-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  action-link:
    textColor: "{colors.ultramarine}"
    typography: "{typography.label}"
  codifier-slab:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.slab-ink}"
    rounded: "{rounded.none}"
    padding: "64px 56px"
  plate:
    backgroundColor: "{colors.plate}"
    rounded: "{rounded.none}"
---

# Design System: The Idea Genealogist

## Overview

**Creative North Star: "The Museum Catalogue"**

The product is a printed catalogue for one idea at a time: a cool stone gallery wall, near-black ink, hairline rules, square plates with captions, and a single ultramarine thread running down the page. In dark mode the wall becomes a night-blue reading room; the same catalogue, lamp-lit. It replaces an earlier neon look entirely; nothing of that world is inherited.

Display type is a high-contrast Caslon set large and quiet; everything else is a plain grotesque doing label and reading work. Hierarchy comes from scale jumps and whitespace, not from boxes, tints, or effects. Ultramarine appears only where the lineage is being followed (the spine, links, the codifier slab, focus).

**Key Characteristics:**
- Flat: no shadows, gradients, glass, or pills.
- One accent, ultramarine, plus one counter-colour (brick) reserved for the rival.
- Square plates (4:5 portraits, 4:3 landscapes) with a muted monogram fallback.
- Hairline rules divide entries; the vertical spine is the page's organising device.
- Labels sit as small muted captions above their values, like object labels.

## Colors

A stone-and-ink neutral field with one saturated blue, mirrored for a night variant. Values are CSS custom properties on `:root` and `.dark` in `src/app/globals.css`; theme follows the system via class.

### Primary
- **Ultramarine** (#2437cc): spine progress line, links and "Trace" actions, focus rings, section/entry markers, the diagram's codifier square, text selection. In dark mode, text/line use **Night Ultramarine Text** (#93a3ff); the slab itself uses **Night Slab** (#2f43e0) so white-ish text stays legible.

### Secondary
- **Rival Brick** (#a8321c; dark #f08a73): the rival section marker, the dashed rival line in the diagram, error text. Nothing else.

### Neutral
- **Stone Wall** (#e8eae6; dark #0e1116): page background.
- **Ink** (#15181d; dark #e9e7e0): body text, the search underline at rest.
- **Muted Ink** (#4a5058; dark #9ba2ad): captions, labels, notes, supporting copy.
- **Hairline** (#c3c7c1; dark #2a303a): rules between entries, the resting spine.
- **Plate Stone** (#d9dcd6; dark #171c25): image placeholder and monogram ground.
- **Slab Ink** (#f4f5ff): text on the ultramarine slab.

### Named Rules
**The One Thread Rule.** Ultramarine marks the path being followed: spine, links, slab, focus. It is never used as decoration, a fill for ordinary cards, or a background tint.

**The Rival Apart Rule.** Brick belongs to the rival and to errors only, so opposition reads as a different voice.

## Typography

**Display Font:** Libre Caslon Display (with Times New Roman, serif), weight 400 only
**Body Font:** Hanken Grotesk (with ui-sans-serif, system-ui)

**Character:** A Caslon that reads like a catalogue title page against a neutral grotesque that stays out of its way. Headings are never bold; weight comes from size.

### Hierarchy
- **Display** (400, 60px mobile / 96px at md, 1.05): the page h1 (hero line, searched concept).
- **Headline** (400, 36px / 60px, 1.05): section heads ("Where it came from"), rival name.
- **Title** (400, 30px / 48px, 1.05): entry names (h3); also the input text (28-36px).
- **Lede** (Caslon, 24px / 30px, ~1.375): the summary, era, defining work, rival argument.
- **Body** (Hanken 400, 17px, 1.6): all running copy, capped at `max-w-prose`.
- **Label** (Hanken 14px, 1.5; "Trace" action at weight 500): captions above facts, notes, example links. Sentence case; no tracking beyond a light `tracking-wide` on the submit action.

### Named Rules
**The Caslon Is Display Rule.** Caslon only at 24px and up. Below that, use Hanken.

**The Balanced Headline Rule.** Headings use `text-wrap: balance` and prose uses `pretty`; long concept names get `break-words`.

## Layout

Single column `max-w-6xl` (72rem) with 24px side padding. The hero is a 1.4fr/1fr grid (title and search beside the schematic) from md up. The result opens with a header grid (concept and summary beside a 22rem portrait plate), then the lineage sits inside a left-padded track (32px mobile, 56px md) that carries the spine. Roots entries are a three-column row (9rem era, text, 8rem plate) that collapses to stacked with a 96px plate on mobile; branches are a two-column grid with 40px column gaps. Rhythm is generous and coarse: 96-128px between sections, 40px padding on entries, 32-64px inside the slab. The top header (not sticky) holds wordmark, a compact search once results exist, and the theme toggle.

## Elevation & Depth

None. The system has no shadows, blur, or gradients. Depth is conveyed by hairline rules, the flat ultramarine slab against stone, and the plate's tonal ground.

### Named Rules
**The Flat Wall Rule.** Surfaces are flat at all times, including hover and focus. State changes are colour shifts (ink to ultramarine) and underline, never lift.

## Shapes

Square and ruled. Plates, the slab, and the search field have 0 radius. The only round forms are spine markers: a 15px solid dot per section and a 9px ringed dot per entry (2px accent border on wall colour), plus 5px circles in the diagram. Dividers are 1px; the spine is 1px with a scroll-drawn ultramarine overlay (scaled from the top, fixed full under reduced motion). The diagram uses 1px strokes, with the active spine at 2px and the rival dashed.

## Components

### Search field
Underline-only: a Caslon input (title size, 28-36px; compact 24px) on a 1px ink bottom border that turns ultramarine on focus-within, with a text "Trace" action plus a 16px outline arrow at the right. Disabled at 40-60% opacity. No box, no fill.

### Action links
"Trace [term]" with a 16px arrow-up-right: Hanken 14px, weight 500, ultramarine, underline on hover (on the slab, slab ink). Example concepts are plain underlined text that turns ultramarine on hover.

### Plate
A square-cornered image on Plate Stone, object-fit cover, ratios 4:5 (people) or 4:3 (branches). On missing or failed images it shows a 48px Caslon monogram in muted ink. Captions sit below in 14px muted ink with underlined source link.

### Codifier slab
The one filled block: a flat ultramarine rectangle (no radius, 64px 56px padding at md) holding the key figure in headline-plus scale, the defining work in Caslon, and a two-column fact pair divided by a 30%-opacity slab-ink rule. The portrait plate here has no monogram fallback (omitted when missing).

### Lineage entry
A hairline top rule, then era (Caslon) with location beneath in muted label, name as Title, facts as dt/dd pairs, and a Trace action. Markers sit on the spine.

### Schematic
Authored SVG of the four stages (Roots, Codifier, Branches, Rival) in 1px ink strokes, spine in ultramarine, rival dashed in brick.

## Do's and Don'ts

### Do:
- **Do** separate entries with 1px Hairline rules and 64-128px of space.
- **Do** keep ultramarine to the spine, links, focus, slab, and selection.
- **Do** give every image a square plate with a muted caption or a monogram fallback.
- **Do** put labels above values in 14px muted ink (object-label style).
- **Do** keep the dark theme a re-mapping of the same roles (night-blue wall, warm paper ink), not a new palette.
- **Do** keep a 2px ultramarine focus outline with 3px offset on all interactive elements.

### Don't:
- **Don't** add shadows, gradients, glass, blur, or pill shapes; the wall is flat.
- **Don't** introduce a second accent or colour the rival in ultramarine.
- **Don't** set headings bold or use Caslon below 24px.
- **Don't** box ordinary content in cards; use rules and whitespace.
- **Don't** reintroduce the earlier neon "cyber" look (glow, dark-only chrome, neon accents).
