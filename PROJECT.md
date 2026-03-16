# Flag Football Playbook — Project Overview

**Repo:** [Aigeninc/ffb-pb](https://github.com/Aigeninc/ffb-pb)  
**Live:** [aigeninc.github.io/ffb-pb](https://aigeninc.github.io/ffb-pb/)  
**Deploy:** GitHub Pages (push to `main` auto-deploys)  
**Stack:** Vanilla JS (ES modules), HTML5 Canvas, CSS — zero dependencies  
**PWA:** Yes — installable via `manifest.json` + `sw.js` (service worker)

---

## What It Is

Interactive coaching tool for **5v5 youth flag football**. Animated play diagrams with route visualization, read progressions, game day tracking, and roster management. Designed to be used sideline on a phone in sunlight.

## Team Roster (hardcoded defaults)

| Player   | Color   | Role       | Notes |
|----------|---------|------------|-------|
| Braelyn  | Black   | QB         | Locked position |
| Lenox    | Purple  | Center     | Locked position |
| Greyson  | Red     | WR/RB      | |
| Marshall | Yellow  | WR/RB      | Tall, 2nd QB |
| Cooper   | Teal    | WR/RB      | |
| Jordy    | Blue    | Sub        | |
| Zeke     | Orange  | Sub        | |
| Mason    | Green   | RB/Decoy   | |

## Architecture

```
index.html          Single-page app shell (all UI structure)
app.js              Orchestrator — wires modules, defines selectPlay()
plays.js            Play data (30 plays) + PLAYERS object (loaded as global <script>)
style.css           All styling (1543 lines, dark theme + sunlight mode)
manifest.json       PWA manifest
sw.js               Service worker for offline caching

modules/
  state.js          Shared state object, constants, localStorage load/save helpers
  renderer.js       Canvas rendering engine (field, players, routes, ball, defense)
  animation.js      Animation loop (requestAnimationFrame, play/pause, speed control)
  ui.js             Play selector bar, player color filter, info panel, controls
  coach.js          Coach call sheet — situation-based play recommendations (down/field/defense)
  queue.js          Play queue — sequence plays, track success/fail
  gameday.js        Game Day call sheet — situational tabs, play tracking, stats, game history
  editor.js         Play editor — create/edit plays with canvas route drawing
  roster.js         Roster management, lineup builder, per-play substitutions, "My Routes"
  touch.js          Touch/swipe and keyboard input handlers
  wristband.js      Printable wristband play sheet generator (opens in new window)
```

**Total:** ~6,800 lines across all files.

## Key Concepts

### Coordinate System
- Field X: 0–35 (sideline to sideline)
- Field Y: negative = behind LOS, positive = downfield
- LOS (line of scrimmage) is at Y=0

### Play Data Structure (`plays.js`)
Each play in the `PLAYS` array is an object:
```js
{
  name: 'Mesh',
  formation: 'Spread',
  whenToUse: ['Man coverage — crossing creates natural picks', ...],
  notes: 'SUB: Jordy can replace Cooper at RB',
  players: {
    PlayerName: {
      pos: [x, y],           // Starting position
      route: [[x,y], ...],   // Route waypoints
      label: 'MESH',         // Route label on field
      read: 1,               // QB read order (0=no read, 1=first look)
      dashed: false,         // Dashed line = checkdown/secondary
      motion: { from: [x,y], to: [x,y] }  // Optional pre-snap motion
    }
  },
  defense: [[x,y], ...],     // 5 defender positions
  timing: { 1: 1.5, 2: 2.0 }, // Read timing windows (seconds)
  ballPath: [                 // Ball animation path
    { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
    { from: 'Braelyn', to: 'Greyson', time: 1.5, type: 'throw' },
  ],
  specialLabels: [...]        // Optional field annotations
}
```

### State Management
All in `modules/state.js`. Uses a single `state` object (not reactive). Persisted to `localStorage`:
- Custom plays (`playbook:customPlays`)
- Queue state (`playbook:queueState`)
- Preferences — speed, sunlight mode, play mode (`playbook:prefs`)
- Per-play substitutions (`playbook:subs`)
- Active play set filter (`playbook:activePlaySet`)
- Game day data (`playbook:gameday`)
- Roster (`playbook:roster`)

### Rendering
Canvas-based with `requestAnimationFrame`. The renderer draws:
- Green field with yard lines and LOS
- Player dots (color-coded) with name labels
- Animated routes (solid/dashed) with direction arrows
- Ball flight animation (snap, throw, handoff, lateral, carry)
- Defense positions (gray dots)
- Timer bar (Quick → Medium → Deep → NOW! segments)
- QB read progression numbers

### Formations (Editor Templates)
Spread, Twins Right/Left, Trips Right/Left, Bunch Right/Left, Stack, Empty, RB Offset Right/Left

## Features

1. **Animated Play Diagrams** — watch routes develop in real-time with adjustable speed (0.25x–2x)
2. **QB Study Mode** — step through read progressions manually
3. **Ball Animation** — toggle realistic ball flight (snap → throw → catch)
4. **Coach Call Sheet** — filter plays by down, field position, defense type; scores/ranks recommendations
5. **Game Day Call Sheet** — situational tabs (1st Down, Red Zone, Big Play, No-Run Zone, vs Man/Zone/Blitz), track results per play, game stats
6. **Play Queue** — build a sequence of plays, mark success/fail, track hit rate
7. **Play Editor** — create custom plays by drawing routes on canvas, pick formations, set reads
8. **Roster & Lineup** — manage players, assign starting 5, handle per-play substitutions, view "My Routes" per player
9. **Wristband Generator** — printable play sheet sized for QB wristband
10. **Sunlight Mode** — thicker lines, larger dots for outdoor visibility
11. **Player Filter** — tap player colors to highlight/isolate individual routes
12. **Offline PWA** — installable, works without internet after first load

## How to Work on This

- **No build step.** Edit files, push to `main`, GitHub Pages deploys.
- **Test locally:** Just open `index.html` in a browser (or `python3 -m http.server` for module loading).
- **Add a play:** Add an entry to the `PLAYS` array in `plays.js` following the structure above.
- **Styling:** All in `style.css`. Dark theme base (`#1a1a2e`), sunlight mode overrides via `.sunlight-mode` class.
- **New features:** Add a module in `modules/`, import/wire in `app.js`.

## Known UX Issues (2026-03-16)

### P0: Speed Control
- 0.25x is the ONLY usable speed for teaching kids plays
- Should be the default speed on app load
- Rename speed labels to teaching-oriented language: `Teach | Walk | Run | Full Speed`
- Current `0.25x | 0.5x | 1x | 2x` means nothing to a parent coach

### P0: Control Overload
- 12 modules, growing control surface — too many icons, similar styling
- Only Keith (the builder) can navigate it; fails the "hand to another coach" test
- Need clear separation between:
  - **GAME MODE** (sideline during a game): play selector, family filter, animation, speed — NOTHING ELSE
  - **PREP MODE** (at home before practice): editor, roster, wristband, queue, game day setup
- First-time user should see 3-4 controls max, not a cockpit
- Icons need to be visually distinct — current set uses similar shapes/sizes

### P0: Player Mode (Kid-Friendly View)
- End goal: send a clean version to 8-10 year old players so THEY can learn plays
- Player opens app → picks their name/avatar → sees ONLY plays they're in
- Each play shows: FULL play animation with their route highlighted/bold + simple text instruction ("Run right, cut across left")
- Other players' routes still visible (not dimmed) so kids understand the whole play and WHY they go where they go
- Their player dot/name is larger/glowing so they can track themselves in the full picture
- Coach controls which plays/families each player sees — curated assignment, not full playbook
- Share link like `?mode=player&name=Greyson&family=mesh,counter-jet` — kid only sees assigned families
- Coach can also assign specific plays: `?plays=Mesh+Left,Counter,Jet+Sweep`
- ZERO coaching controls visible — no editor, no roster, no game day, no queue
- Animation at teaching speed only (0.25x), auto-plays
- Big friendly buttons, minimal text, maybe position-specific labels ("YOUR JOB: catch the ball here")
- The player filter (tap color to isolate) is the seed — wrap it in a kid-friendly shell
- This is the version that gets shared with the team

### P1: Three-Mode Architecture
- **Player Mode** — kid-friendly, pick your name, see your routes (DEFAULT when shared)
- **Coach Mode** — sideline game day, family filter, play calling, speed control
- **Prep Mode** — editor, roster, wristband, queue, game day setup, full toolbox
- URL param or toggle to switch: `?mode=player&name=Greyson`
- Player Mode should be the default shareable link

### P1: Information Hierarchy
- Play names, tags, families, dots, subs indicators — too much info per button
- On a phone in sunlight, coach needs: play name + family color. That's it.
- Everything else is progressive disclosure (tap for details)

## Deployment

GitHub Pages from `main` branch. No CI/CD pipeline — just push.

```bash
cd ~/projects/ffb-pb
git add -A && git commit -m "description" && git push
```

Live at: https://aigeninc.github.io/ffb-pb/
