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

### ✅ DONE: Speed Control (Wave 5)
- Speed labels renamed to `Teach | Walk | Run | Full Speed`
- Default speed is Teach (0.25x) on app load

### ✅ DONE: Control Overload (Waves 3-4)
- Three-mode architecture separates concerns:
  - **Player Mode** — zero coach controls, kid-friendly
  - **Coach Mode** — sideline essentials only
  - **Prep Mode** — full toolbox

### ✅ DONE: Player Mode (Waves 4-5 + Sub-Aware)
- Player picks name → sees only their plays
- Routes highlighted/bold, pulsing glow, kid-friendly instructions
- Sub-aware: Jordy/Zeke see plays they're subbed into
- Share link: `?mode=player&name=Greyson`

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

## Three-Mode System (Wave 2-4)

The app supports three modes, controlled via URL parameter `?mode=`:

### Player Mode (`?mode=player`)
- **Audience:** Kids (8-10 year olds)
- **URL params:** `name=Greyson`, `family=mesh`, `plays=Mesh,Flood Right`, `speed=teach`, `sun=1`
- **Features:** Player picker overlay, filtered play list, kid-friendly instructions ("🏈 YOUR JOB"), pulsing glow on active player, auto-play, prev/next nav buttons
- **Controls shown:** Replay, Play/Pause only
- **Speed:** Locked to Teach (0.25x)

#### Sub-Aware Player Mode
Player mode is substitution-aware. When a coach subs Jordy in for Cooper on specific plays (via Prep mode roster panel), `?mode=player&name=Jordy` will:
- Show only the plays Jordy is subbed into
- Highlight Jordy's dot with the pulsing glow effect
- Show Jordy's route (inherited from the player they replaced) with thicker line
- Display kid-friendly instructions for Jordy's assigned role in each play

This means the coach workflow is:
1. In Prep mode, sub Jordy in for Cooper on 2-3 plays
2. Tap 📤 next to Jordy's name in the roster panel
3. Send the link to Jordy's parents
4. Jordy opens the link and sees exactly his plays with his routes highlighted

### Coach Mode (`?mode=coach` or default)
- **Audience:** Coach on sideline
- **Features:** Family filter navigation, auto-play on selection, Game Day panel with merged situation engine
- **Controls shown:** Replay, Play/Pause, Sunlight, Game Day, Speed buttons

### Prep Mode (`?mode=prep`)
- **Audience:** Coach during practice/planning
- **Features:** Full toolbox — all controls, play editor, queue system, roster management, wristband generator
- **Controls shown:** Everything

### Mode Switcher
- ⚙️ gear icon (top-right) in Coach/Prep modes
- Hidden in Player mode — reveal via triple-tap on field canvas
- Navigates via URL change (full page reload to reinitialize)

### Share Links
- In Roster panel (Prep mode), each player has a 📤 button
- Copies personalized player mode URL to clipboard
- Example: `https://site.com/?mode=player&name=Greyson`
