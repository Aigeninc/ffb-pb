# Juke Moves Animation Module — Developer Spec

## Overview

This module renders animated footwork diagrams for 6 flag football juke moves. The target audience is youth players (ages 8-10) and their coaches. Each move is shown as a step-by-step footprint animation on a canvas, with force vector arrows, phase labels, and coaching cues.

**Data source:** `juke-moves-data.json` (same directory)

The JSON contains all movement data — positions, angles, timing, force vectors — so the developer does NOT need biomechanics knowledge. Just render what the data says.

---

## Architecture

```
┌─────────────────────────────────────┐
│           Move Selector UI          │
│  [Cut] [Drop] [Skinny] [Speed]     │
│  [Shimmy] [Spin]                    │
├─────────────────────────────────────┤
│                                     │
│         Animation Canvas            │
│                                     │
│   Footprints render step-by-step    │
│   Force arrows show on active step  │
│   Phase labels appear at top        │
│                                     │
├─────────────────────────────────────┤
│  Controls: [▶ Play] [Speed: Game/   │
│  Teach] [↺ Replay] [⏸ Pause]       │
│  Step indicator: ●●●○○○ (3/6)      │
└─────────────────────────────────────┘
```

---

## Data Structure Reference

### Top-Level JSON
```json
{
  "metadata": { ... },    // coordinate system info, angle conventions
  "moves": [ ... ]        // array of 6 move objects
}
```

### Each Move Object
```json
{
  "id": "cut-juke",           // unique ID for move selector
  "name": "Cut / Juke",       // display name
  "description": "...",       // short description shown below title
  "totalSteps": 6,            // total footprints in animation
  "approachDirection": "forward",
  "exitDirection": "45-degrees-right",
  "phases": [ ... ],          // array of phase objects
  "coachingCues": [ ... ],    // array of tip strings
  "commonMistakes": [ ... ]   // array of mistake strings
}
```

### Each Phase
```json
{
  "phase": "plant",           // phase name: approach, fake, plant, cut, drop, rotate, etc.
  "description": "...",       // what's happening in this phase
  "steps": [ ... ]            // array of step objects
}
```

### Each Step (the core animation data)
```json
{
  "stepNumber": 4,
  "foot": "left",             // "left" or "right"
  "position": { "x": -10, "y": 48 },  // position in inches
  "angle": -45,               // foot rotation in degrees
  "action": "plant",          // stride, plant, push-off, drag, shuffle, pivot, slide
  "weight": 0.9,              // 0-1, how much weight on this foot
  "emphasis": true,           // key moment — gets pulsing highlight
  "duration": 0.12,           // seconds at game speed
  "teachDuration": 1.0,       // seconds at teach speed
  "bodyAngle": -15,           // torso rotation
  "shoulderFake": null,       // "left", "right", or null
  "headDirection": "right",   // where eyes/head point
  "hipRotation": 0,           // hip angle
  "armPosition": "...",       // text description of arms
  "forceVector": { "angle": 250, "magnitude": 1.0 }
}
```

---

## Rendering Footprints

### Footprint Shape
Render each footprint as a simplified foot outline (oval with toe bump, or shoe-sole shape):
- **Width:** ~24px (scaled to canvas)
- **Length:** ~48px
- Slightly asymmetric (inner edge straighter than outer edge)
- Left and right feet should be mirror images

### Footprint Colors
| Foot | Base Color | Hex |
|------|-----------|-----|
| Left | Blue | `#3B82F6` |
| Right | Red | `#EF4444` |

### Opacity & State
| State | Opacity | Effect |
|-------|---------|--------|
| Not yet placed | 0 | Invisible |
| Active (current step) | 1.0 | Full color + glow effect |
| Placed (previous step) | 0.5 | Faded, no glow |
| Emphasis step (`emphasis: true`) | 1.0 | Pulsing glow ring animation |

### Emphasis Pulse Effect
When `emphasis: true`, add a pulsing ring around the footprint:
- Ring color: same as foot color but at 40% opacity
- Ring animates: scale 1.0 → 1.5 → 1.0, opacity 0.4 → 0 → 0.4
- Pulse cycle: 800ms
- Continues until next step is placed

### Footprint Rotation
Apply `step.angle` as rotation to the footprint shape:
- 0° = toe pointing up (forward/Y-axis)
- Positive = clockwise rotation
- Negative = counter-clockwise rotation

### Coordinate Mapping
The data uses inches with Y-axis = forward, X-axis = lateral:
- Map the full range of positions to fit the canvas
- Add padding (~20% on each side)
- Y increases upward on canvas (or flip: Y increases downward and render top-to-bottom — either works, just be consistent)
- Recommended: show a center line (dashed, light gray) along x=0 to represent the approach line

---

## Force Vector Arrows

### When to Show
- Show force vector arrow ONLY on the **active** (current) step
- Arrow appears when step is placed, disappears when next step begins
- If `magnitude` is 0 or very small (< 0.1), don't show arrow

### Arrow Rendering
```
Origin: center of the active footprint
Direction: step.forceVector.angle (0=up/forward, 90=right, 180=down/backward, 270=left)
Length: step.forceVector.magnitude × baseLength (baseLength ≈ 40px)
```

- **Arrow color:** `#FBBF24` (amber/yellow) — contrasts with both foot colors
- **Arrow style:** solid line with arrowhead, 3px stroke
- **Arrowhead:** filled triangle, 10px wide
- **Label:** Show magnitude as percentage (e.g., "70%") next to arrowhead — optional, can omit for cleaner look

### Important Note on Force Direction
The `forceVector.angle` represents force applied TO THE GROUND. The player moves in the OPPOSITE direction (Newton's third law). The animation shows the ground force arrow — this is standard in biomechanics visualization.

---

## Body Position Indicator (Optional Enhancement)

If implementing body position visualization:
- Show a small circle (torso) at the centroid of the last 2 footprints
- Rotate based on `bodyAngle`
- Show a line from torso indicating `headDirection`
- Show shoulder angle if `shoulderFake` is active

This is optional — footprints + force vectors are the core visualization.

---

## Animation Timing

### Speed Modes
| Mode | Uses field | Description |
|------|-----------|-------------|
| Game Speed | `step.duration` | Real-time speed (~0.1-0.25s per step) |
| Teach Speed | `step.teachDuration` | Slowed down for learning (~0.5-1.2s per step) |

### Animation Sequence
1. Canvas shows center line and phase label
2. Phase label appears: e.g., "APPROACH"
3. Steps within phase render one at a time:
   a. Footprint fades in at position (200ms fade)
   b. Footprint becomes active (full opacity + glow)
   c. Force vector arrow appears
   d. Wait for `duration` (or `teachDuration`)
   e. Previous footprint fades to 0.5 opacity
   f. Force vector disappears
4. When phase changes, update phase label
5. After all steps: show "coaching cues" panel
6. Auto-pause at end (don't loop automatically)

### Transitions Between Phases
- Brief pause (300ms at game speed, 600ms at teach speed) between phases
- Phase label crossfades to new phase name

---

## UI Components

### Move Selector
- 6 buttons in a row (or 2 rows of 3 on mobile)
- Each button shows move name
- Active move button is highlighted
- Clicking a move resets the animation to the beginning of that move

### Speed Toggle
- Two-state toggle: **Game Speed** / **Teach Speed**
- Default: Teach Speed (since target audience is learning)
- Changing speed mid-animation: recalculate remaining step durations

### Playback Controls
- **Play/Pause** button (▶ / ⏸)
- **Replay** button (↺) — resets to step 1
- **Step Forward** button (⏭) — advance one step manually
- **Step Back** button (⏮) — go back one step

### Step Indicator
- Show dots for each step: ● = completed, ○ = upcoming
- Current step dot is larger / highlighted
- Example: `●●●◉○○` (step 4 of 6 active)

### Phase Label
- Large text above the canvas showing current phase
- e.g., "APPROACH", "FAKE", "PLANT", "CUT", "ACCELERATION"
- Phase description text below in smaller font

### Info Panel
After animation completes (or accessible via tab/toggle):
- **Coaching Cues** — bulleted list from `coachingCues` array
- **Common Mistakes** — bulleted list from `commonMistakes` array
- These are critical for the learning purpose of this tool

---

## Canvas Layout

### Dimensions
- Recommended canvas size: 400×600px (portrait orientation — most moves go forward)
- The approach line runs vertically (bottom to top)
- Scale coordinates: 1 inch in data ≈ 5-7px on canvas (adjust to fit)

### Grid & Reference Lines
- **Center line:** dashed vertical line at x=0, light gray (#E5E7EB)
- **No grid squares** — keep it clean
- **Direction arrow:** small "↑ FORWARD" label at top of canvas

### Background
- Dark background recommended: `#1F2937` (slate-800)
- This makes the colored footprints pop
- Alternative: light background `#F9FAFB` with darker foot colors

---

## Scale Conversion

To convert data coordinates (inches) to canvas pixels:

```javascript
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PADDING = 60; // px on each side

function getScaleFactor(move) {
  // Find the bounding box of all step positions
  const allSteps = move.phases.flatMap(p => p.steps);
  const xs = allSteps.map(s => s.position.x);
  const ys = allSteps.map(s => s.position.y);
  
  const xRange = Math.max(...xs) - Math.min(...xs);
  const yRange = Math.max(...ys) - Math.min(...ys);
  
  const availW = CANVAS_WIDTH - 2 * PADDING;
  const availH = CANVAS_HEIGHT - 2 * PADDING;
  
  // Use the smaller scale to fit both dimensions
  const scale = Math.min(availW / Math.max(xRange, 1), availH / Math.max(yRange, 1));
  
  return {
    scale,
    offsetX: CANVAS_WIDTH / 2,  // center horizontally
    offsetY: CANVAS_HEIGHT - PADDING  // start from bottom
  };
}

function toCanvas(position, scaleFactor) {
  return {
    x: scaleFactor.offsetX + position.x * scaleFactor.scale,
    y: scaleFactor.offsetY - position.y * scaleFactor.scale  // flip Y
  };
}
```

---

## Move Summary Table

| Move | Steps | Key Mechanic | Exit Direction |
|------|-------|-------------|----------------|
| Cut / Juke | 6 | Plant-and-cut with head/shoulder fake | 45° right |
| Drop | 5 | Dead leg + shoulder dip | 30° left |
| Get Skinny | 5 | Body rotation to narrow profile | Forward |
| Speed Change | 6 | Decelerate then explode | Forward |
| Shimmy | 7 | Rapid stutter steps then burst | Forward-left |
| Spin | 5 | 360° pivot on outside foot | Forward-left |

---

## Action Type Visual Hints (Optional)

Different step `action` values can have subtle visual differences:

| Action | Visual Hint |
|--------|-------------|
| `stride` | Normal footprint |
| `plant` | Thick border, slight "pressed into ground" shadow |
| `push-off` | Motion lines trailing behind foot |
| `drag` | Dashed/dotted outline (light contact) |
| `shuffle` | Smaller footprint (choppy step) |
| `pivot` | Circular arrow around foot (rotation indicator) |
| `slide` | Elongated footprint shape |

---

## Implementation Priority

### MVP (Phase 1)
1. ✅ Load JSON data
2. ✅ Move selector (6 buttons)
3. ✅ Canvas with center line
4. ✅ Footprint rendering (left=blue, right=red)
5. ✅ Step-by-step animation with timing
6. ✅ Play/Pause/Replay controls
7. ✅ Speed toggle (game/teach)

### Enhanced (Phase 2)
1. Force vector arrows
2. Phase labels with descriptions
3. Step indicator dots
4. Emphasis pulse effect
5. Coaching cues / mistakes panel

### Polish (Phase 3)
1. Action-type visual hints
2. Body position indicator
3. Smooth footprint transitions
4. Mobile-responsive layout
5. Keyboard shortcuts (space=play/pause, arrow keys=step)

---

## Technology Notes

- Canvas can be implemented with HTML5 Canvas, SVG, or a framework like PixiJS
- For simplicity with the existing stack, **HTML5 Canvas** with `requestAnimationFrame` is recommended
- All timing/positioning data is pre-computed in the JSON — the renderer just plays it back
- No physics simulation needed — this is a choreographed animation

---

## File References

- **Move data:** `./juke-moves-data.json` — all 6 moves with complete footwork sequences
- **This spec:** `./JUKE-MOVES-SPEC.md` — rendering and UI specification
