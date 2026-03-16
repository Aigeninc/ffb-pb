# UX Audit: Flag Football Playbook App

**Date:** 2026-03-16  
**Auditor:** Lex (AI UX Analyst)  
**App:** https://aigeninc.github.io/ffb-pb/  
**Codebase:** ~6,800 lines across 14 files, zero dependencies  

---

## 1. Current State Inventory

### Top Area: Play Selector (`#play-selector`)

| Element | Location | What It Does | Who Uses It | Frequency |
|---------|----------|-------------|-------------|-----------|
| **Set Selector Row** (`.play-set-row`) | Row 1 | Horizontal scrollable pills: Core 5 ⭐, Extended 📈, 2-Back 🔀, NRZ 🚨, Exotic 🔮, All 📋, Custom ⚙️ | Coach (prep) | Once per game/practice |
| **Family Filter Row** (`.play-family-row`) | Row 2 | Horizontal scrollable pills: All, 🔵 Mesh, 🟢 Counter/Jet, 🔴 Quick Game, 🌊 Flood, ⚡ Shot Plays, 🟡 Misdirection, 🔄 RPO, 🟣 NRZ, 🔀 2-Back, 🔮 Exotic | Coach (game/prep) | Every few plays |
| **Separator** (`.play-selector-sep`) | Between rows 2–3 | 1px visual divider | — | — |
| **Play Button Row** (`.play-btn-row`) | Row 3 | Horizontal scrollable play buttons with name + tag dots + sub indicator (↔) + custom indicator (★) | Coach/Player | Every play |

**Total height consumed:** ~110px on a phone. That's ~18% of a 667px iPhone screen eaten before seeing the field.

### Player Color Filter (`#player-filter`)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| **Player dot buttons** (`.player-dot-btn`) | Single-tap: highlight/isolate one player's route. Double-tap: open substitution menu. Long-press/right-click: also opens sub menu | Coach (prep/game) | Every play to few times per game |
| **Reset button** (`↩ Reset`) | Clears per-play substitutions for current play | Coach (prep) | Rarely |

### Timer Bar (`#timer-container` → `#timer-bar`)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| **4-segment color bar** (`.timer-seg` green/yellow/orange/red) | Shows QUICK → MEDIUM → DEEP → NOW! timing windows | Coach/Player | Passive — always visible during animation |
| **Needle** (`#timer-needle`) | White vertical indicator tracking current animation time | — | Automatic |
| **Time label** (`#timer-time`) | Shows seconds elapsed or MOTION/SET state | Coach | Passive |
| **Read markers** (`.read-marker`) | Numbered circles (①②③④) that appear at read timing positions | Coach (QB study) | Passive |

### Canvas Area (`#field-container` → `#field-canvas`)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| **Animated field** | Green field with yard lines, LOS, player dots, animated routes, ball, defense, snap/motion indicators, special labels | Everyone | Every play |
| **Swipe left/right** | Navigate to next/previous play (touch.js) | Coach/Player | Every play |
| **Tap (in edit mode)** | Select player, add waypoint, etc. | Coach (prep) | During editing only |

### Controls Bar (`#controls`)

| Element | ID | Icon | What It Does | Who Uses It | Frequency |
|---------|------|------|-------------|-------------|-----------|
| Replay | `btn-replay` | 🔄 | Reset animation to start and auto-play | Everyone | Every play |
| Play/Pause | `btn-play` | ▶/⏸ | Toggle animation playback | Everyone | Every play |
| QB Study/Game Speed | `btn-mode` | 👁️/🏈 | Toggle staggered read vs simultaneous route reveal | Coach | Once per session |
| Ball Toggle | `btn-ball` | 🏈 | Show/hide ball flight animation | Coach | Once per session |
| QB Look-Off | `btn-qb` | 🎯 | Show simplified eyes/throw info in info panel | Coach | Once per session |
| Sunlight Mode | `btn-sun` | ☀️ | Thicker lines, larger dots for outdoor visibility | Coach | Once per game |
| Edit | `btn-edit` | ✏️ | Enter play editor mode | Coach (prep) | Rarely |
| Queue | `btn-queue` | 📋 | Toggle play queue panel | Coach (prep/game) | Once per game |
| Coach Sheet | `btn-coach` | 🧠 | Toggle coach call sheet (situation-based recommendations) | Coach (game) | Every few plays |
| Game Day | `btn-gameday` | 🎯 | Open game day bottom sheet | Coach (game) | Every game |
| Roster | `btn-roster` | 👥 | Open roster side panel | Coach (prep) | Once per session |
| **Speed: 0.25x** | `.speed-btn[data-speed="0.25"]` | 0.25x | Set animation speed to quarter | Everyone | Every play (should be default) |
| **Speed: 0.5x** | `.speed-btn[data-speed="0.5"]` | 0.5x | Set animation speed to half | Coach | Occasionally |
| **Speed: 1x** | `.speed-btn[data-speed="1"]` | 1x | Set animation speed to normal (DEFAULT — bad) | — | — |
| **Speed: 2x** | `.speed-btn[data-speed="2"]` | 2x | Set animation speed to double | — | Never useful for youth |

**Total buttons in controls bar: 15** (11 icon buttons + 4 speed buttons). On a phone with `flex-wrap`, this creates **2 rows** consuming another ~100px.

### Info Panel (`#info-panel`)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| **Formation label** (`#formation-label`) | "Play Name · Formation" (dimmed text) | Coach | Passive |
| **FAKE/EYES tag + text** (`#when-to-use`) | Shows the fake/misdirection element with red tag | Coach | Every play |
| **TARGET/THROW tag + text** (`#play-notes`) | Shows the real target with teal tag | Coach | Every play |

### Coach Call Sheet (`#coach-panel`, hidden by default)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| **DOWN row** (1st/2nd/3rd/4th) | Select current down | Coach (game) | Every series |
| **FIELD row** (Open/Midfield/Red Zone/No-Run) | Select field position | Coach (game) | Every series |
| **THEY row** (Man/Zone/Rush/IDK) | Select defensive coverage type | Coach (game) | Every series |
| **Recommendations** (`#coach-recs`) | Ranked play list with scores and reasons | Coach (game) | Every few plays |

### Queue Bar (`#queue-bar`, hidden by default)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| Status + Score | "PLAY X of Y" + success/fail counts | Coach | During queue |
| Queue chips | Scrollable play sequence with result icons | Coach | During queue |
| ◀ / ❌ / ✅ / ▶ / 🗑️ | Navigate queue, mark results, clear queue | Coach | Each play in queue |

### Game Day Panel (`#gameday-panel`, bottom sheet, hidden)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| Header with "New Game" + close | Panel controls | Coach | Once per game |
| Situation tabs | 1st Down, Red Zone, Big Play, No-Run Zone, vs Man, vs Zone, vs Blitz | Coach | Every series |
| Play list with "Call" buttons | Ranked plays for situation, with success rates | Coach | Every play |
| Result prompt (✅ Worked / ❌ Didn't / ⏭️ Skip) | Track play outcomes | Coach | Every play |
| Last called ticker | Shows last 3 called plays with results | Coach | Passive |
| 📊 Stats / 🖨️ Wristband buttons | Open stats dashboard or generate wristband | Coach | Once per game |

### Roster Panel (`#roster-panel`, side panel, hidden)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| Starting Lineup grid (5 positions) | Visual position slots, tap to select for swap | Coach (prep) | Before game |
| Team Toggle (1st/2nd Team) | Switch between two lineup configurations | Coach (game) | Every few series |
| Bench list with edit buttons | See available subs, tap to assign to selected position | Coach (prep) | Before game |
| Add Player form | Name, number, position checkboxes | Coach (prep) | Once per season |
| My Routes section | Tap a player → see all plays they're in | Coach (prep) / Player | Occasionally |

### Edit Toolbar (`#edit-toolbar`, injected dynamically, hidden)

| Element | What It Does | Who Uses It | Frequency |
|---------|-------------|-------------|-----------|
| Play name input | Name the play | Coach (prep) | Per edit |
| 💾 Save / ✕ Cancel | Save or discard edits | Coach (prep) | Per edit |
| ＋ New / Formation select / Apply / ↩ Undo | Create, template, undo | Coach (prep) | Per edit |
| 📋 Duplicate / 🗑️ Delete / ⬇️ Export / ⬆️ Import | Play management | Coach (prep) | Rarely |
| Player panel (read order, dashed, label, clear route) | Edit individual player routes | Coach (prep) | Per edit |
| Notes input | When-to-use notes | Coach (prep) | Per edit |

---

## 2. Pain Points (Ranked by Severity)

### P0-1: Speed Default is Wrong
**Evidence:** `state.speed = 1` in `state.js` line ~38. The speed buttons in `index.html` show `class="active"` on `1x`. `loadPreferences()` in `state.js` only loads sunlight mode — **speed is never persisted or restored**.  
**Impact:** Every time the app opens, animation runs at 1x. At 1x, a 7-second play completes in 7 real seconds. Routes overlap, kids can't track, parent coaches see a blur. The only usable teaching speed (0.25x = 28 real seconds) must be manually selected every session.  
**Who suffers:** Everyone.

### P0-2: Control Overload — 15 Buttons Visible at All Times
**Evidence:** `#controls` in `index.html` contains 11 `ctrl-btn` elements + 4 `speed-btn` elements, all rendered inline. No mode-based visibility. `style.css` uses `flex-wrap: wrap` which creates a second row on phones.  
**Impact:** A parent coach opening the app for the first time sees: 🔄 ▶ 👁️ 🏈 🎯 ☀️ ✏️ 📋 🧠 🎯 👥 + 0.25x 0.5x 1x 2x. Most of these icons are meaningless without training. 🎯 appears TWICE (QB Look-Off and Game Day). The "cockpit" problem.  
**Who suffers:** Assistant coaches, players, anyone who isn't Keith.

### P0-3: No Mode System — Everything Always Visible
**Evidence:** No `mode` parameter parsing anywhere in the codebase. No conditional rendering based on user type. `app.js init()` always calls every module's setup function. All HTML is always in the DOM.  
**Impact:** An 8-year-old player and the head coach see the identical interface. There's no way to share a simplified view. The "send a link to a kid" use case is completely blocked.

### P0-4: Play Selector Consumes 18%+ of Screen
**Evidence:** Three scrollable rows (set selector ~34px, family filter ~30px, play buttons ~42px) plus the separator = ~110px minimum. On an iPhone 13 (390×844, ~667px usable after browser chrome), that's 16.5%. Add the player filter bar (~40px) and timer bar (~28px) = ~178px before the field canvas. That's 27% of the screen gone before seeing any football.  
**Impact:** The field canvas — the most important element — gets squeezed. On landscape phones it's worse. During a game, the coach needs the field large and the play name visible; the set selector and family filter are noise.

### P0-5: Duplicate Icons — 🎯 Used Twice
**Evidence:** `btn-qb` has title "QB Look-Off Mode" with 🎯. `btn-gameday` has title "Game Day Call Sheet" with 🎯. Both in `index.html`.  
**Impact:** Two buttons with the same icon do completely different things. Confusing even for the builder.

### P1-1: Speed Labels are Technical, Not Teaching-Oriented
**Evidence:** Speed buttons show `0.25x | 0.5x | 1x | 2x` as raw multipliers.  
**Impact:** A parent coach has no idea what "0.25x" means. They need to know "this is the slow teaching speed" vs "this is game speed." The current labels require understanding of playback rate mathematics.

### P1-2: Player Filter Double-Tap UX is Undiscoverable
**Evidence:** In `ui.js buildPlayerFilter()`, substitution menu opens on double-tap (350ms threshold) or right-click/long-press. Single-tap does highlight. No visual cue indicates double-tap functionality exists.  
**Impact:** The substitution feature (critical for game day) is completely hidden. No coach will discover it by accident. The 360ms setTimeout for distinguishing single vs double tap also creates a perceptible delay on single taps.

### P1-3: Info Panel FAKE/TARGET Tags are Coaching Jargon
**Evidence:** `updateInfoPanel()` in `ui.js` renders tags labeled "FAKE" and "TARGET" with color-coded badges.  
**Impact:** An 8-year-old doesn't know what "FAKE" means in this context. A parent coach might not either. These are power-user labels for someone who already understands offensive scheme concepts.

### P1-4: Touch Targets Borderline on Mobile
**Evidence:** `.ctrl-btn` min-width/height is 44px (meets Apple's 44pt minimum). But `.speed-btn` is also 44px with `gap: 4px` between them. With 4 speed buttons at 44px + 3 gaps = 188px. The 11 ctrl-btns need 11×44 + 10×6 = 544px, which wraps.  
**Impact:** The controls area works but is cramped. The wrapping creates visual chaos on phones <390px wide.

### P1-5: No Offline Mode Indicator
**Evidence:** `sw.js` exists for PWA caching, but there's no UI indicator showing offline status, cache state, or when content was last updated.  
**Impact:** Minor — the PWA works. But a coach at a field with no signal doesn't know if they're seeing cached content or if something failed to load.

### P1-6: Coach Panel and Queue are Mutually Exclusive but Non-Obvious
**Evidence:** In `app.js setupPanelToggles()`, opening Coach closes Queue and vice versa. Toggle is purely through opacity changes on the buttons (0.4 vs 1.0).  
**Impact:** Coach might not realize Queue disappeared when they opened Coach Sheet. No visual indication these are exclusive.

### P1-7: Game Day Panel Overlaps with Coach Call Sheet
**Evidence:** `#coach-panel` provides situation→recommendation (DOWN/FIELD/THEY selectors). `#gameday-panel` provides situation tabs (1st Down, Red Zone, etc.) → ranked plays. They do nearly the same thing but through different UI.  
**Impact:** Redundant features. The Game Day panel is the superior version (tracks results, has stats). The Coach panel is vestigial but still takes up a button.

### P2-1: Sunlight Mode is Minimal
**Evidence:** `body.sunlight` CSS only changes `--bg`, `--surface`, `--surface2` to slightly different dark values and adds `border: 2px solid #555` to timer bar. The renderer uses `state.sunlightMode` to increase dot radius (15→19), line width (4.5→7), and font size (9→11px).  
**Impact:** Still a dark theme in sunlight. True outdoor visibility needs a light background, maximum contrast, or auto-brightness detection.

### P2-2: Wristband Generator is Hardcoded
**Evidence:** `wristband.js selectWristbandPlays()` has a hardcoded `priorityPlays` array of 8 specific play names.  
**Impact:** Doesn't respect the active play set or family filter. Always generates the same 8 plays regardless of what the coach has configured for game day.

### P2-3: No Loading/Empty States
**Evidence:** When no plays match a filter combination, the play button row is simply empty with no message.  
**Impact:** Coach might think the app is broken rather than realizing their filter combination yielded no results.

---

## 3. Three-Mode Architecture Design

### Mode Detection & Switching

```
URL: ?mode=player&name=Greyson&family=mesh,counter-jet
URL: ?mode=coach
URL: ?mode=prep
URL: (no params) → defaults to coach mode
```

**Implementation:** Add `parseURLParams()` to `state.js` that runs in `app.js init()` before any rendering. Set `state.appMode` to `'player'|'coach'|'prep'`. All UI-building functions check `state.appMode` before rendering elements.

```js
// state.js additions
export const state = {
  // ... existing
  appMode: 'coach',        // 'player' | 'coach' | 'prep'
  playerModeName: null,     // e.g. 'Greyson'
  playerModeFamilies: null, // e.g. ['mesh', 'counter-jet'] or null for all
  playerModePlays: null,    // e.g. ['Mesh Left', 'Counter'] or null for all
};

export function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'player') {
    state.appMode = 'player';
    state.playerModeName = params.get('name');
    const families = params.get('family');
    if (families) state.playerModeFamilies = families.split(',');
    const plays = params.get('plays');
    if (plays) state.playerModePlays = plays.split(',');
  } else if (mode === 'prep') {
    state.appMode = 'prep';
  } else {
    state.appMode = 'coach';  // default
  }
}
```

---

### Player Mode (for 8–10 year olds)

**URL:** `?mode=player&name=Greyson` or `?mode=player&name=Greyson&family=mesh,counter-jet`

#### What They See

| Element | Visible? | Notes |
|---------|----------|-------|
| Play selector (set row) | ❌ Hidden | |
| Play selector (family row) | ❌ Hidden | |
| Play buttons | ✅ Simplified | Large buttons, play name only, filtered to their plays |
| Player filter | ❌ Hidden | Their player auto-highlighted |
| Timer bar | ✅ Simplified | Remove read markers, keep color segments for pacing feel |
| Canvas | ✅ Enhanced | Their dot is 1.5× larger with pulsing glow. Their name label is bigger. All other players still fully visible (not dimmed) so they understand the full play |
| Controls | ✅ Minimal | Only: ▶ Replay, ◀ Prev, ▶ Next. Speed locked to Teach (0.25x) |
| Info panel | ✅ Kid-friendly | Replaces FAKE/TARGET with "YOUR JOB: Run right, cut across the middle and catch the ball" |
| Coach sheet | ❌ Hidden | |
| Queue | ❌ Hidden | |
| Game Day | ❌ Hidden | |
| Roster | ❌ Hidden | |
| Editor | ❌ Hidden | |
| Speed buttons | ❌ Hidden | Locked to 0.25x |

#### How They Pick Their Player

On first load with `?mode=player` (no name):
1. Show a full-screen **player picker overlay** with large colored circles and names
2. Each circle is the player's dot color, 80px diameter, with their name below
3. Tap your name → app filters to your plays, your dot gets the glow treatment
4. The picked name gets stored in `localStorage` so they don't re-pick every visit

With `?mode=player&name=Greyson`: skip the picker, go straight to Greyson's view.

#### How Plays Are Presented

- **Auto-play on load** — animation starts immediately at teaching speed
- **Auto-advance** — when animation finishes, wait 3 seconds, show "Tap to see next play" button (not auto-advance, let the kid process)
- **Swipe left/right** still works for navigation
- Play buttons are large (min-height 48px, font-size 16px), showing just the play name

#### Their Route Emphasis

- Their player dot: radius increased from 15px to 24px
- Pulsing white glow ring around their dot (CSS animation on canvas, or canvas-drawn ring with `sin(time)` alpha)
- Their route line: 2px thicker than others
- Their route label: bold, slightly larger font
- **All other routes still fully visible at normal opacity** — kids need to see WHY they go where they go
- After animation completes, their route endpoint gets a star or checkmark icon with text like "CATCH HERE" or "BLOCK HERE"

#### Kid-Friendly Info Panel

Replace `FAKE`/`TARGET` with per-player instructions derived from the play data:

```js
function getPlayerInstruction(play, playerName) {
  const pd = play.players[playerName];
  if (!pd) return '';
  if (pd.read === 0 && playerName === 'Braelyn') return 'YOU ARE THE QB. Read the numbers!';
  if (pd.read === 0 && playerName === 'Lenox') return 'SNAP the ball, then run your route.';
  if (pd.label === 'MESH') return 'Run across the field. The ball is coming to you!';
  if (pd.label === 'FLAT') return 'Run to the flat (sideline). Be ready if QB looks your way.';
  // ... build a lookup from label/read/route shape to kid-friendly text
  return `Run your route! You are read #${pd.read}.`;
}
```

Display in the info panel as:
```
🏈 YOUR JOB
Run right, then cut hard left across the middle.
The QB will throw to you — CATCH IT!
```

#### Visual Treatment

- **Background:** Slightly lighter field green for better contrast on phone screens
- **Player names on dots:** Show first name only (already does this), font 12px instead of 9px on their dot
- **No opacity toggling** — everything is full opacity, full color
- **Sunlight mode auto-enabled** if device ambient light sensor is available (progressive enhancement)

---

### Coach Mode (sideline during a game)

**URL:** `?mode=coach` or default (no params)

#### What Stays vs. What Goes

| Element | Visible? | Notes |
|---------|----------|-------|
| Play selector (set row) | ❌ Hidden | Pre-configured in Prep mode |
| Play selector (family row) | ✅ **Primary navigation** | Prominently displayed, larger touch targets |
| Play buttons | ✅ Simplified | Play name only, no tag dots, no sub indicators |
| Player filter | ✅ Simplified | Tap-to-highlight only, no double-tap sub menu |
| Timer bar | ✅ Kept | |
| Canvas | ✅ Kept | |
| Controls | ✅ **Reduced** | Only: 🔄 Replay, ▶ Play/Pause, Speed selector |
| Speed buttons | ✅ **Redesigned** | `Teach | Walk | Run | Full` (see Section 5) |
| Info panel | ✅ Simplified | FAKE/TARGET format works for coaches |
| Coach sheet (🧠) | ❌ Hidden | Merged into Game Day |
| Queue (📋) | ❌ Hidden | Not needed sideline |
| Game Day (🎯) | ✅ Accessible | Via a single "📊" button or swipe-up gesture |
| Roster (👥) | ❌ Hidden | Pre-configured in Prep |
| Editor (✏️) | ❌ Hidden | |
| Sunlight (☀️) | ✅ Auto or one-tap | |
| QB Study (👁️) | ❌ Hidden | This is a prep tool |
| Ball toggle (🏈) | ❌ Hidden | Default to off in coach mode |
| QB Look-Off (🎯) | ❌ Hidden | |

**Total visible controls: 5** (Replay, Play/Pause, Speed selector, Sunlight, Game Day)

#### Family Filter as Primary Navigation

The family filter row becomes the **primary UI** in coach mode:

```
[ 🔵 Mesh (5) ] [ 🟢 Counter (4) ] [ 🔴 Quick (3) ] [ 🌊 Flood (3) ] ...
```

- **Larger pills:** min-height 40px (up from 26px), font-size 14px (up from 10px)
- **Tap a family → play buttons update → tap a play → animation plays at Teach speed**
- **2-tap play calling:** Tap family → Tap play. Done. Animation starts automatically.
- Count badges show how many plays are in each family
- The "All" filter is last (not first) — coaches think in families, not "all plays"

#### Speed Control Redesign

See Section 5 for full spec. Default: **Teach** (0.25x equivalent).

#### 2-Tap Play Calling Flow

1. Coach thinks "I need a mesh play"
2. **Tap 1:** 🔵 Mesh → play buttons filter to 5 mesh plays
3. **Tap 2:** Tap "Mesh Left" → animation immediately starts at Teach speed
4. Done. No extra taps needed.

Current flow requires: select family → select play → tap ▶ = 3 taps minimum (and speed might be wrong).

**Implementation:** In coach mode, `selectPlay()` should auto-call `startAnimation()` after a short delay (200ms for the canvas to render the first frame).

#### Game Day Stat Tracking

The Game Day bottom sheet stays but is simplified:
- Remove the situation tabs (redundant with family filter)
- Keep the result prompt (✅ Worked / ❌ Didn't) — show it as a **floating toast** after calling a play, not in the bottom sheet
- Stats accessible via a small "📊" button in the controls bar
- The "Call" button in Game Day is redundant with tapping a play — remove it, plays auto-animate on tap

---

### Prep Mode (at home, full toolbox)

**URL:** `?mode=prep`

#### Everything Unlocked

All current controls visible. This IS the current app, basically. The only changes:

1. **Set selector row** visible (for organizing play sets)
2. **Family filter row** visible
3. **All control buttons** visible: Replay, Play/Pause, QB Study, Ball, QB Look-Off, Sunlight, Editor, Queue, Coach Sheet, Game Day, Roster
4. **Speed control** with all options + user's last choice persisted
5. **Edit toolbar** accessible
6. **Roster panel** accessible with full CRUD
7. **Wristband generator** accessible
8. **Export/Import** accessible

#### How to Get Into It

1. **URL param:** `?mode=prep` — bookmarkable
2. **Settings toggle:** Add a small ⚙️ gear icon in the top-right corner of coach mode. Tapping it shows a mode switcher:
   ```
   ┌─────────────────────┐
   │  👶 Player Mode     │
   │  🏈 Coach Mode  ✓   │
   │  🔧 Prep Mode       │
   └─────────────────────┘
   ```
3. **Secret gesture (for Player Mode):** Triple-tap the app title or a hidden area to reveal the mode switcher (prevents kids from accidentally entering Prep mode)

**Implementation:** Add a `#mode-switcher` overlay div. In `app.js`, add a gear button rendered in coach/prep modes only. In player mode, hide it (or require a secret gesture).

---

## 4. Specific Recommendations

### R1: Add Mode System (P0)

**What:** Add `state.appMode` and URL parameter parsing. Conditionally render UI based on mode.  
**Why:** Without modes, the app is unusable for anyone except the builder. This is the #1 blocker to sharing with assistant coaches and players.  
**How:**
1. Add `parseURLParams()` to `state.js` (see Section 3)
2. Call it first in `app.js init()`, before `loadPreferences()`
3. In `buildPlaySelector()` (`ui.js`): skip set row if `appMode !== 'prep'`; skip family row if `appMode === 'player'`
4. In `buildControls()` (`ui.js`): conditionally render buttons based on `appMode`
5. In `index.html`: add `data-mode` attributes to control groups, use CSS `[data-mode]` selectors for show/hide
6. Add `#mode-switcher` overlay component
**Priority:** P0

### R2: Fix Speed Default + Persistence (P0)

**What:** Default speed to 0.25x. Persist speed choice in localStorage.  
**Why:** Every session starts at 1x, which is too fast for teaching. Coaches manually switch to 0.25x every time.  
**How:**
1. In `state.js`: change `speed: 1` to `speed: 0.25`
2. In `index.html`: move `class="active"` from the 1x button to the 0.25x button
3. In `loadPreferences()`: add `const savedSpeed = localStorage.getItem('playbook:speed'); if (savedSpeed) state.speed = parseFloat(savedSpeed);`
4. In `buildControls()` (`ui.js`): after speed button click, add `localStorage.setItem('playbook:speed', state.speed);`
5. In `buildControls()`: sync active class to `state.speed` on init (not just the hardcoded HTML)
**Priority:** P0

### R3: Rename Speed Labels (P0)

**What:** Replace `0.25x | 0.5x | 1x | 2x` with `Teach | Walk | Run | Full`.  
**Why:** Non-technical users don't understand multiplier labels.  
**How:**
1. In `index.html`: change button text content. Keep `data-speed` attribute unchanged.
2. Update CSS `.speed-btn` min-width to accommodate text (from 44px to ~60px).
3. Consider color-coding: Teach = green, Walk = yellow, Run = orange, Full = red — matching timer bar semantics.
**Priority:** P0

### R4: Reduce Controls Bar — Mode-Based Visibility (P0)

**What:** Show only mode-appropriate controls.  
**Why:** 15 buttons is a cockpit. Coach mode needs 5. Player mode needs 2-3.  
**How:**
1. Add `data-modes="coach,prep"` attributes to each `ctrl-btn` in `index.html`
2. In `buildControls()`: `document.querySelectorAll('.ctrl-btn').forEach(btn => { btn.style.display = btn.dataset.modes?.includes(state.appMode) ? '' : 'none'; });`
3. Player mode buttons: just Replay + Prev/Next navigation
4. Coach mode buttons: Replay, Play/Pause, Speed, Sunlight, Game Day
5. Prep mode: everything
**Priority:** P0

### R5: Fix Duplicate 🎯 Icon (P1)

**What:** Change QB Look-Off icon from 🎯 to 👀 (eyes, which is what the feature is about).  
**Why:** Two buttons with identical icons is confusing.  
**How:** In `index.html`, change `btn-qb` content from 🎯 to 👀. Update its title to "QB Look-Off — where to look vs where to throw."  
**Priority:** P1

### R6: Auto-Play on Play Selection in Coach Mode (P1)

**What:** When a play button is tapped in coach mode, auto-start animation.  
**Why:** Saves one tap per play call. Max 2 taps from "I need a play" to "animation playing."  
**How:** In `selectPlay()` in `app.js`, add:
```js
if (state.appMode === 'coach' || state.appMode === 'player') {
  setTimeout(() => startAnimation(), 300);
}
```
**Priority:** P1

### R7: Enlarge Family Filter Pills in Coach Mode (P1)

**What:** Increase touch targets for family pills when in coach mode.  
**Why:** Sideline, one-handed, sunlight — needs bigger targets.  
**How:** Add CSS rule:
```css
body[data-mode="coach"] .family-btn {
  min-height: 40px;
  font-size: 13px;
  padding: 6px 14px;
}
body[data-mode="coach"] .family-btn-emoji { font-size: 16px; }
```
Set `document.body.dataset.mode = state.appMode` in `init()`.  
**Priority:** P1

### R8: Merge Coach Sheet into Game Day Panel (P1)

**What:** Remove the standalone Coach Call Sheet (`#coach-panel`, `btn-coach`). Move its situation selectors (DOWN/FIELD/THEY) into the Game Day panel as a collapsible section.  
**Why:** They do the same thing — recommend plays based on situation. Two overlapping features confuses coaches.  
**How:**
1. In `index.html`: remove `#coach-panel` HTML and `btn-coach` button
2. In `gameday.js`: add the DOWN/FIELD/THEY selectors above the situation tabs
3. The situation tabs become presets (tap "Red Zone" = auto-set FIELD=rz)
4. Keep the scoring engine from `coach.js` — just move the UI
**Priority:** P1

### R9: Player Mode Glow Effect (P1)

**What:** In player mode, make the active player's dot larger with a pulsing glow.  
**Why:** Kids need to instantly find "themselves" on the field.  
**How:** In `renderer.js drawPlayers()`:
```js
if (state.appMode === 'player' && state.playerModeName) {
  const isActivePlayer = getDisplayName(name) === state.playerModeName || name === playerOrigNameForActivePlayer;
  if (isActivePlayer) {
    // Draw glow ring
    const pulse = 0.4 + 0.3 * Math.sin(state.animTime * 4);
    ctx.beginPath();
    ctx.arc(cx, cy, r + 10, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.globalAlpha = pulse;
    ctx.stroke();
    ctx.globalAlpha = 1;
    r *= 1.5; // bigger dot
  }
}
```
**Priority:** P1

### R10: Persist Speed to localStorage (P1)

**What:** Save and restore speed preference.  
**Why:** Users shouldn't have to re-select speed every session.  
**How:** In `ui.js buildControls()` speed button click handler, add:
```js
try { localStorage.setItem('playbook:speed', String(state.speed)); } catch(e) {}
```
In `state.js loadPreferences()`:
```js
const savedSpeed = localStorage.getItem('playbook:speed');
if (savedSpeed) state.speed = parseFloat(savedSpeed);
```
And sync the active button class in `buildControls()`.  
**Priority:** P1

### R11: Add Empty State for Filtered Plays (P2)

**What:** When no plays match the current filter combination, show a message.  
**Why:** Empty play row with no feedback looks like a bug.  
**How:** In `buildPlaySelector()` in `ui.js`, after `const visiblePlays = getFilteredPlays();`:
```js
if (visiblePlays.length === 0) {
  const empty = document.createElement('div');
  empty.style.cssText = 'color:#888;font-size:12px;padding:8px 12px;';
  empty.textContent = 'No plays match this filter';
  playRow.appendChild(empty);
}
```
**Priority:** P2

### R12: Wristband Should Use Active Play Set (P2)

**What:** `wristband.js selectWristbandPlays()` should use the configured game day play set instead of hardcoded names.  
**Why:** Coach configures their game day set; wristband should reflect that.  
**How:** In `selectWristbandPlays()`:
```js
if (state.activePlaySet) {
  return PLAYS.filter(p => state.activePlaySet.has(p.name)).slice(0, 8).map(p => ({ name: p.name, play: p }));
}
// fallback to current hardcoded list
```
**Priority:** P2

### R13: Add Mode Switcher UI (P1)

**What:** A small gear/mode toggle accessible from all modes (hidden in player mode behind a secret gesture).  
**Why:** Coaches need to switch between coach and prep mode without editing the URL.  
**How:** Add a floating button in the top-right corner:
```html
<button id="mode-toggle" class="mode-toggle-btn">⚙️</button>
```
On tap, show a 3-option overlay. Selecting a mode calls `window.history.replaceState()` to update the URL and re-initializes the UI.  
In player mode, hide the button. Reveal it via triple-tap on the field area.  
**Priority:** P1

---

## 5. Speed Control Redesign

### Current State

```
[ 0.25x ] [ 0.5x ] [ 1x ] [ 2x ]
           ↑ meaningless labels
```

- `state.speed` defaults to `1` (wrong)
- `0.25x` is 28 real seconds for a 7s play — the only usable teaching speed
- `1x` is 7 real seconds — too fast for kids, barely usable for experienced coaches
- `2x` is 3.5 real seconds — useless for youth football
- Speed is **not persisted** — resets to 1x on every reload

### Proposed Design

```
[ 🟢 Teach ] [ 🟡 Walk ] [ 🟠 Run ] [ 🔴 Full ]
```

| Label | Speed Value | Real Duration (7s play) | Use Case |
|-------|------------|------------------------|----------|
| **Teach** | 0.25x | 28 seconds | Teaching kids, showing parents, studying routes |
| **Walk** | 0.5x | 14 seconds | Walking through with light understanding |
| **Run** | 1x | 7 seconds | Coach reviewing plays they already know |
| **Full** | 2x | 3.5 seconds | Quick scan / comparison (power users only) |

### Color-Coded Buttons

Match the timer bar's color language (green = safe/slow → red = urgent/fast):

```css
.speed-btn[data-speed="0.25"] { border-color: #22c55e; }
.speed-btn[data-speed="0.25"].active { background: #22c55e; color: #000; }
.speed-btn[data-speed="0.5"] { border-color: #eab308; }
.speed-btn[data-speed="0.5"].active { background: #eab308; color: #000; }
.speed-btn[data-speed="1"] { border-color: #f97316; }
.speed-btn[data-speed="1"].active { background: #f97316; color: #000; }
.speed-btn[data-speed="2"] { border-color: #ef4444; }
.speed-btn[data-speed="2"].active { background: #ef4444; color: #fff; }
```

### Defaults Per Mode

| Mode | Default Speed | Can Change? |
|------|--------------|-------------|
| Player | Teach (0.25x) | **No** — locked, speed buttons hidden |
| Coach | Teach (0.25x) | **Yes** — all 4 options visible |
| Prep | User's last choice (persisted) | **Yes** — all 4 options visible |

### Implementation

1. **`index.html`:** Change button text:
```html
<div class="speed-group">
  <button class="speed-btn active" data-speed="0.25">Teach</button>
  <button class="speed-btn" data-speed="0.5">Walk</button>
  <button class="speed-btn" data-speed="1">Run</button>
  <button class="speed-btn" data-speed="2">Full</button>
</div>
```
2. **`state.js`:** Change default: `speed: 0.25`
3. **`ui.js buildControls()`:** Add persistence + mode-based visibility
4. **Player mode:** Hide `.speed-group` entirely via CSS/JS

---

## 6. Information Hierarchy

### Play Button Content Per Mode

| Mode | What's on the button | Example |
|------|---------------------|---------|
| **Player** | Play name only, large font | `Mesh Left` |
| **Coach** | Play name + family color dot | `🔵 Mesh Left` |
| **Prep** | Play name + tag dots + sub indicator + custom badge | `Mesh Left ↔ ★ 🟢🔴` |

**Implementation:** In `buildPlaySelector()`, check `state.appMode` to determine button content:
```js
if (state.appMode === 'player') {
  btn.innerHTML = `<span class="play-btn-name">${play.name}</span>`;
} else if (state.appMode === 'coach') {
  const familyEmoji = PLAY_FAMILIES.find(f => f.family === play.family)?.emoji || '';
  btn.innerHTML = `<span class="play-btn-name">${familyEmoji} ${play.name}</span>`;
} else {
  // prep mode — current full rendering
  btn.innerHTML = `<span class="play-btn-name">${play.name}${perPlaySubs ? ' ↔' : ''}${play.isCustom ? ' ★' : ''}</span>` + _tagDots(play);
}
```

### Info Panel Content Per Mode

| Mode | Line 1 | Line 2 | Line 3 |
|------|--------|--------|--------|
| **Player** | `🏈 YOUR JOB` | Kid-friendly instruction for their specific role | — |
| **Coach** | `Play Name · Formation` (dim) | `FAKE: [misdirection text]` | `TARGET: [actual target]` |
| **Prep** | `Play Name · Formation` (dim) | FAKE or EYES (QB mode dependent) | TARGET or THROW (QB mode dependent) |

### Progressive Disclosure

**Default visible (all modes):**
- Play name
- Animation
- Timer bar

**Tap play button or info panel to expand (coach/prep):**
- Formation name
- FAKE/TARGET text
- When-to-use notes (currently hidden — add a chevron to expand)

**Never visible in player mode:**
- Formation names
- FAKE/TARGET coaching terminology
- Tags, substitution indicators, custom badges
- Read order numbers (keep the visual read markers on the timer bar for coaches)

---

## 7. Icon & Visual Language Audit

### Current Icons

| Button | Icon | Meaning | Confusion Risk |
|--------|------|---------|----------------|
| `btn-replay` | 🔄 | Replay animation | Low — universally understood |
| `btn-play` | ▶/⏸ | Play/Pause | Low |
| `btn-mode` | 👁️/🏈 | QB Study / Game Speed toggle | **Medium** — 👁️ could mean "view" anything. Toggles between two icons, so the current state is ambiguous |
| `btn-ball` | 🏈 | Toggle ball animation | **High** — same football emoji as the mode toggle's alternate state. "Is this the ball? Is this the game mode?" |
| `btn-qb` | 🎯 | QB Look-Off Mode | **HIGH** — identical to Game Day icon |
| `btn-sun` | ☀️ | Sunlight mode | Low — clear metaphor |
| `btn-edit` | ✏️ | Play editor | Low |
| `btn-queue` | 📋 | Play queue | **Medium** — clipboard could mean many things |
| `btn-coach` | 🧠 | Coach call sheet | **Medium** — brain doesn't obviously mean "play recommendations" |
| `btn-gameday` | 🎯 | Game day call sheet | **HIGH** — identical to QB Look-Off |
| `btn-roster` | 👥 | Roster & lineup | Low — people = roster |

### Proposed Replacements

| Button | Current | Proposed | Rationale |
|--------|---------|----------|-----------|
| `btn-mode` | 👁️/🏈 | 📖/⚡ | Book = study mode, Lightning = game speed |
| `btn-ball` | 🏈 | ⚾→🏈 (toggle state shown) | Or just remove — ball toggle is niche. Default to off. |
| `btn-qb` | 🎯 | 👀 | Eyes = "where QB looks". Matches the feature (EYES/THROW labels) |
| `btn-queue` | 📋 | 📝 | Notepad with pen = "my play list" (slightly more active than clipboard) |
| `btn-coach` | 🧠 | **REMOVE** | Merge into Game Day (see R8) |
| `btn-gameday` | 🎯 | 📊 | Chart = stats/tracking. Distinct from all other icons |

### After Changes — Icon Set

```
🔄  ▶  📖  👀  ☀️  ✏️  📝  📊  👥
```

Each icon is now visually distinct. No duplicates. Meanings are more intuitive.

---

## 8. URL Parameter Spec

### Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `mode` | `player`, `coach`, `prep` | App mode. Default: `coach` |
| `name` | Player name string | Player mode: whose view. Triggers player picker if omitted in player mode |
| `family` | Comma-separated family slugs | Filter to specific play families. E.g., `mesh,counter-jet` |
| `plays` | Comma-separated play names (URL-encoded) | Filter to specific plays. E.g., `Mesh+Left,Counter` |
| `speed` | `teach`, `walk`, `run`, `full` | Override default speed |
| `sun` | `1` | Force sunlight mode on |
| `set` | `core`, `extended`, `2back`, `nrz`, `exotic`, `all` | Override play set tag |

### Example URLs

```
# Greyson's player view — all his plays
?mode=player&name=Greyson

# Greyson's player view — only mesh and counter-jet families
?mode=player&name=Greyson&family=mesh,counter-jet

# Greyson's player view — specific plays only
?mode=player&name=Greyson&plays=Mesh+Left,Counter,Jet+Sweep

# Player mode without name — shows player picker
?mode=player

# Coach sideline mode (default)
?mode=coach

# Coach mode with sunlight forced on
?mode=coach&sun=1

# Full prep mode
?mode=prep

# Default (no params) — coach mode
(no query string)
```

### Parsing Implementation

```js
// In state.js
export function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Mode
  const mode = params.get('mode');
  if (mode === 'player') state.appMode = 'player';
  else if (mode === 'prep') state.appMode = 'prep';
  else state.appMode = 'coach';
  
  // Player mode params
  state.playerModeName = params.get('name') || null;
  const familyParam = params.get('family');
  state.playerModeFamilies = familyParam ? familyParam.split(',').map(f => f.trim()) : null;
  const playsParam = params.get('plays');
  state.playerModePlays = playsParam ? playsParam.split(',').map(p => p.trim()) : null;
  
  // Speed override
  const speedMap = { teach: 0.25, walk: 0.5, run: 1, full: 2 };
  const speedParam = params.get('speed');
  if (speedParam && speedMap[speedParam]) state.speed = speedMap[speedParam];
  
  // Sunlight override
  if (params.get('sun') === '1') {
    state.sunlightMode = true;
    document.body.classList.add('sunlight');
  }
  
  // Play set override
  const setParam = params.get('set');
  if (setParam) state.activePlaySetTag = setParam;
}
```

### URL Generation Helper (for Prep Mode)

Add a "Share Link" feature in prep mode that builds the URL for coaches to share with players:

```js
function generateShareLink(mode, options = {}) {
  const base = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  params.set('mode', mode);
  if (options.name) params.set('name', options.name);
  if (options.families?.length) params.set('family', options.families.join(','));
  if (options.plays?.length) params.set('plays', options.plays.join(','));
  if (options.speed) params.set('speed', options.speed);
  if (options.sunlight) params.set('sun', '1');
  return base + '?' + params.toString();
}
```

This should be exposed in the roster panel's "My Routes" section — tap a player, see their plays, tap "📤 Share" to copy their personalized link.

---

## Summary: Implementation Priority

| Priority | Item | Effort |
|----------|------|--------|
| **P0** | R1: Mode system (URL params + conditional rendering) | Large — touches every module |
| **P0** | R2: Fix speed default + persistence | Small — 15 minutes |
| **P0** | R3: Rename speed labels | Small — HTML text change |
| **P0** | R4: Mode-based control visibility | Medium — add data attributes + CSS |
| **P1** | R5: Fix duplicate 🎯 icon | Tiny — one character change |
| **P1** | R6: Auto-play on selection in coach mode | Small — one line in selectPlay() |
| **P1** | R7: Enlarge family filter in coach mode | Small — CSS only |
| **P1** | R8: Merge coach sheet into game day | Medium — move HTML/JS |
| **P1** | R9: Player mode glow effect | Medium — renderer changes |
| **P1** | R10: Persist speed | Small — localStorage add |
| **P1** | R13: Mode switcher UI | Medium — new overlay component |
| **P2** | R11: Empty state for filters | Tiny |
| **P2** | R12: Wristband uses active set | Small |

**Suggested build order:**
1. R2 + R3 + R10 (speed fixes — instant win, 30 min)
2. R5 (icon fix — 2 min)
3. R1 + R4 (mode system — the big one, enables everything else)
4. R6 + R7 (coach mode polish)
5. R8 (coach/gameday merge)
6. R9 + R13 (player mode + mode switcher)
7. R11 + R12 (polish)
