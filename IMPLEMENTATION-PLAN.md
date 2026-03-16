# Implementation Plan — UX Overhaul

Based on UX-AUDIT.md. Split into sequential waves to avoid file collisions.

**Key constraint:** Multiple agents CANNOT edit the same file at the same time. The files in this project are deeply interconnected — `state.js`, `ui.js`, `index.html`, `style.css`, and `app.js` are touched by nearly every change. Parallel agents would collide.

**Strategy:** Sequential waves, each handled by one Sonnet agent. Each wave builds on the previous one. Waves are ordered by dependency chain.

---

## Wave 1: Foundation (Speed + Icons + Cleanup)
**Time estimate:** 15 min  
**Agent:** 1 Sonnet  
**Risk:** Low — surgical changes, no structural refactor  

### Tasks
1. **R2: Fix speed default** — `state.js` change `speed: 1` → `speed: 0.25`
2. **R3: Rename speed labels** — `index.html` change button text from `0.25x|0.5x|1x|2x` to `Teach|Walk|Run|Full`
3. **R10: Persist speed** — `state.js` add to `loadPreferences()`, `ui.js` add `localStorage.setItem` in speed click handler
4. **R5: Fix duplicate icon** — `index.html` change `btn-qb` from 🎯 to 👀, change `btn-gameday` from 🎯 to 📊
5. **Speed color-coding** — `style.css` add colored borders/backgrounds per speed button
6. **Bust SW cache** — `sw.js` update version string

### Files Touched
- `index.html` (speed labels, icon changes)
- `state.js` (speed default, persistence in loadPreferences)
- `modules/ui.js` (speed persistence in click handler, sync active class on init)
- `style.css` (speed button colors)
- `sw.js` (cache bust)

### Verification
- App loads with Teach speed active (0.25x)
- Speed persists across reload
- No duplicate 🎯 icons
- Speed buttons have color coding (green→yellow→orange→red)

### Git
```
git commit -m "fix: speed default 0.25x, persist speed, rename labels, fix duplicate icons"
git push
```

---

## Wave 2: Mode System Core
**Time estimate:** 30-45 min  
**Agent:** 1 Sonnet  
**Depends on:** Wave 1 complete  
**Risk:** Medium — structural change, touches many files  

### Tasks
1. **R1: Add `parseURLParams()` to `state.js`** — parse `mode`, `name`, `family`, `plays`, `speed`, `sun` params
2. **Add `state.appMode`** — default `'coach'`, `state.playerModeName`, `state.playerModeFamilies`, `state.playerModePlays`
3. **Call `parseURLParams()` first in `app.js init()`** — before any rendering
4. **R4: Mode-based control visibility** — add `data-modes` attributes to all `.ctrl-btn` in `index.html`, add JS in `ui.js` to show/hide based on `state.appMode`
5. **Set `document.body.dataset.mode = state.appMode`** in `app.js init()` for CSS targeting
6. **Conditional play selector rendering** — in `buildPlaySelector()`:
   - Player mode: hide set row, hide family row, show simplified play buttons (name only, filtered to player's plays)
   - Coach mode: hide set row, show family row (enlarged), show play buttons (name + family emoji)
   - Prep mode: show everything (current behavior)
7. **R6: Auto-play on selection** — in `selectPlay()` in `app.js`, auto-start animation in coach/player modes
8. **R7: Enlarge family filter in coach mode** — CSS using `body[data-mode="coach"]`
9. **Player mode play filtering** — filter PLAYS array by `playerModeName` (player appears in play), `playerModeFamilies`, `playerModePlays`
10. **Player mode speed lock** — hide `.speed-group` in player mode, force `state.speed = 0.25`

### Files Touched
- `state.js` (new state fields, parseURLParams, play filtering)
- `app.js` (call parseURLParams, set body data-mode, auto-play logic)
- `index.html` (data-modes attributes on ctrl-btns)
- `modules/ui.js` (conditional rendering in buildPlaySelector, buildControls, buildPlayerFilter)
- `style.css` (mode-specific CSS rules)
- `sw.js` (cache bust)

### Implementation Details

**data-modes mapping for ctrl-btns:**
| Button | data-modes |
|--------|-----------|
| btn-replay | player,coach,prep |
| btn-play | player,coach,prep |
| btn-mode (QB Study) | prep |
| btn-ball | prep |
| btn-qb (QB Look-Off) | prep |
| btn-sun | coach,prep |
| btn-edit | prep |
| btn-queue | prep |
| btn-coach | prep |
| btn-gameday | coach,prep |
| btn-roster | prep |
| speed-group | coach,prep |

**Player mode play filtering logic:**
```js
function getPlayerModePlays() {
  let pool = PLAYS;
  
  // Filter to plays this player appears in
  if (state.playerModeName) {
    pool = pool.filter(p => 
      Object.keys(p.players).some(name => 
        name === state.playerModeName || getDisplayName(name) === state.playerModeName
      )
    );
  }
  
  // Filter by families if specified
  if (state.playerModeFamilies) {
    pool = pool.filter(p => state.playerModeFamilies.includes(p.family));
  }
  
  // Filter by specific play names if specified
  if (state.playerModePlays) {
    pool = pool.filter(p => state.playerModePlays.includes(p.name));
  }
  
  return pool;
}
```

### Verification
- `?mode=player&name=Greyson` shows only Greyson's plays, minimal controls, teaching speed
- `?mode=player&name=Greyson&family=mesh` further filters to mesh family
- `?mode=coach` shows family filter + simplified controls
- `?mode=prep` shows everything (current app)
- Default (no params) → coach mode
- Auto-play works in coach/player mode on play selection
- Family pills are larger in coach mode

### Git
```
git commit -m "feat: three-mode architecture (player/coach/prep) with URL params"
git push
```

---

## Wave 3: Player Mode Polish
**Time estimate:** 30 min  
**Agent:** 1 Sonnet  
**Depends on:** Wave 2 complete  
**Risk:** Medium — renderer changes need careful testing  

### Tasks
1. **R9: Player glow effect** — in `renderer.js drawPlayers()`, when `state.appMode === 'player'` and player matches `state.playerModeName`:
   - Draw pulsing white/color glow ring (use `Math.sin(animTime * 4)` for pulse)
   - Increase dot radius by 1.5x
   - Make their route line 2px thicker
   - Make their name label larger (12px instead of 9px)
2. **Kid-friendly info panel** — in `ui.js updateInfoPanel()`, when `state.appMode === 'player'`:
   - Replace FAKE/TARGET with "🏈 YOUR JOB" header
   - Generate player-specific instruction from play data (route label → kid text mapping)
   - Show simple, encouraging language
3. **Player picker overlay** — when `?mode=player` has no `name` param:
   - Show full-screen overlay with large colored circles (80px) for each player
   - Tap to select → store in localStorage → filter plays
   - Skip if name is in URL or localStorage
4. **Auto-play on load** — in player mode, start animation automatically after first render
5. **"Next Play" prompt** — after animation ends, show a friendly "Tap for next play →" button instead of auto-advancing
6. **Prev/Next navigation buttons** — add visible ◀ ▶ buttons for player mode (in addition to swipe)

### Files Touched
- `modules/renderer.js` (glow effect, larger dot, thicker route)
- `modules/ui.js` (kid-friendly info panel, player picker overlay)
- `modules/animation.js` (auto-play on load, end-of-animation prompt)
- `index.html` (player picker overlay HTML, prev/next buttons)
- `style.css` (player picker styles, glow animation, prev/next button styles)
- `sw.js` (cache bust)

### Kid-Friendly Instruction Mapping
```js
const LABEL_TO_KID_TEXT = {
  'MESH':       'Run across the field. The ball is coming to you!',
  'MESH←':      'Run hard to the LEFT across the field. Catch the ball!',
  'MESH→':      'Run hard to the RIGHT across the field. Catch the ball!',
  'FLAT':       'Run to the sideline. Be ready — QB might throw to you!',
  'FLAT!':      'Run to the sideline. The ball IS coming to you!',
  'GO!':        'Sprint as fast as you can straight downfield. DEEP BALL!',
  'GO DEEP!':   'Sprint as fast as you can straight downfield. DEEP BALL!',
  'CORNER':     'Run upfield, then break toward the corner of the field.',
  'OUT':        'Run straight, then cut hard to the sideline.',
  'SLANT':      'Run 3 steps, then cut inside. Quick catch!',
  'CROSS!':     'Run across the middle of the field through traffic.',
  'DIG':        'Run upfield, then cut hard across the middle.',
  'HITCH':      'Run 5 yards, STOP, turn around. Ball is coming right now!',
  'POST!':      'Run upfield, then angle toward the middle for the deep ball.',
  'DEEP POST!': 'Sprint deep, then cut to the middle. BIG PLAY!',
  'CHECK':      'Snap the ball, then run your route as a safety valve.',
  'CLEAR':      'Run your route to pull defenders away. You are a decoy!',
  'FAKE+PITCH': 'Take the fake handoff, then IMMEDIATELY pitch it back to QB!',
  'BLOCK HERE': 'Get in position and block your defender.',
  '1-ON-1!':    'You are alone against one defender. Win your matchup!',
  'FLAT (safe)':'Run to the sideline. You are the safe throw if nothing else is open.',
  'CROSS LOW':  'Run a low crossing route through the middle.',
  'WHEEL':      'Start toward the sideline, then turn upfield and GO!',
  // Run plays
  'SWEEP':      'Take the handoff and sprint to the outside edge!',
  'DRAW':       'Wait for the fake, then burst through the middle!',
  'JET':        'Motion across, take the handoff at full speed, hit the edge!',
};

// Fallback for unlisted labels
function getPlayerInstruction(play, playerName) {
  const pd = play.players[playerName];
  if (!pd) return "Watch the play and learn everyone's job!";
  
  // QB special case
  if (playerName === 'Braelyn' || pd.read === 0 && pd.route.length === 0) {
    if (play.qbLook) return play.qbLook.tip;
    return "You are the QB. Deliver the ball!";
  }
  
  // Center special case
  if (playerName === 'Lenox' && pd.label === 'CHECK') {
    return "Snap the ball to the QB, then run your check-down route.";
  }
  
  const text = LABEL_TO_KID_TEXT[pd.label];
  if (text) return text;
  
  if (pd.read === 0) return "Run your route to help the play work!";
  return `You are read #${pd.read}. Run your route — the QB might throw to you!`;
}
```

### Verification
- `?mode=player` shows player picker overlay
- `?mode=player&name=Greyson` skips picker, shows Greyson's plays
- Greyson's dot pulses with glow, is larger, route is thicker
- Info panel shows "🏈 YOUR JOB: Run across the field. The ball is coming to you!"
- Animation auto-plays on load
- "Tap for next play →" appears after animation ends
- ◀ ▶ buttons visible and functional

### Git
```
git commit -m "feat: player mode polish — glow effect, kid-friendly text, player picker, auto-play"
git push
```

---

## Wave 4: Coach Mode Polish + Merge
**Time estimate:** 30 min  
**Agent:** 1 Sonnet  
**Depends on:** Wave 3 complete  
**Risk:** Medium — merging coach panel into gameday is structural  

### Tasks
1. **R8: Merge Coach Sheet into Game Day** 
   - Move DOWN/FIELD/THEY selectors from `#coach-panel` into `#gameday-panel` as a collapsible section at top
   - Remove `#coach-panel` HTML and `btn-coach` button
   - Keep scoring engine from `coach.js` — just rewire the UI
   - Situation tabs become presets that auto-set the selectors
2. **R13: Mode switcher UI**
   - Add floating ⚙️ button (top-right, small)
   - On tap: show overlay with Player/Coach/Prep options
   - In player mode: hidden, reveal via triple-tap on field
   - Mode switch updates URL via `history.replaceState()` and reinitializes
3. **Game Day result toast** — after calling a play in coach mode, show floating ✅/❌ prompt instead of requiring the bottom sheet
4. **"Share Link" in Prep mode** — in roster panel "My Routes" section, add 📤 button per player that copies their personalized URL
5. **Icon cleanup** — apply remaining icon changes from audit (btn-mode: 👁️→📖/⚡, btn-queue: 📋→📝)

### Files Touched
- `index.html` (remove coach panel, add mode switcher overlay, icon changes)
- `modules/coach.js` (rewire to render inside gameday panel)
- `modules/gameday.js` (add situation selectors, result toast)
- `modules/ui.js` (mode switcher, share link button)
- `modules/roster.js` (share link in My Routes)
- `app.js` (mode switcher init, triple-tap handler)
- `style.css` (mode switcher styles, toast styles)
- `sw.js` (cache bust)

### Verification
- 🧠 Coach Sheet button is gone
- DOWN/FIELD/THEY selectors appear in Game Day panel
- Mode switcher works (gear icon → overlay → switch modes)
- Triple-tap reveals mode switcher in player mode
- Result toast appears after play selection in coach mode
- Share link copies correct URL for each player
- All icons are unique and distinct

### Git
```
git commit -m "feat: merge coach into gameday, mode switcher, share links, icon cleanup"
git push
```

---

## Wave 5: Polish & Edge Cases
**Time estimate:** 15 min  
**Agent:** 1 Sonnet  
**Depends on:** Wave 4 complete  
**Risk:** Low  

### Tasks
1. **R11: Empty state** — show "No plays match this filter" message when filter combo yields zero plays
2. **R12: Wristband uses active set** — `selectWristbandPlays()` respects `state.activePlaySet`
3. **Sunlight mode improvements** — auto-enable in player mode, ensure all new UI elements respect sunlight mode
4. **localStorage cleanup** — ensure `playbook:appMode` isn't persisted (mode comes from URL), but `playbook:playerName` IS persisted for the player picker
5. **Update PROJECT.md** — document the three-mode system, new URL params, family system, and updated architecture
6. **Test all modes end-to-end** — player/coach/prep, verify each URL param works
7. **Final SW cache bust**

### Files Touched
- `modules/ui.js` (empty state)
- `modules/wristband.js` (active set)
- `style.css` (sunlight mode additions)
- `state.js` (playerName persistence)
- `PROJECT.md` (documentation update)
- `sw.js` (final cache bust)

### Git
```
git commit -m "polish: empty states, wristband fix, sunlight mode, docs update"
git push
```

---

## Execution Timeline

| Wave | What | Agent | Est. Time | Depends On |
|------|------|-------|-----------|------------|
| 1 | Speed + Icons | Sonnet | 15 min | Nothing |
| 2 | Mode System Core | Sonnet | 45 min | Wave 1 |
| 3 | Player Mode Polish | Sonnet | 30 min | Wave 2 |
| 4 | Coach Mode + Merge | Sonnet | 30 min | Wave 3 |
| 5 | Polish & Edge Cases | Sonnet | 15 min | Wave 4 |

**Total estimated: ~2.5 hours of agent time, sequential**

### Why Sequential, Not Parallel?

Every wave touches `state.js`, `ui.js`, `index.html`, `style.css`, and `app.js`. These 5 files are the backbone. Two agents editing `ui.js` simultaneously = guaranteed merge conflicts and broken code. The waves are designed so each one lands clean before the next starts.

The trade-off: slower wall clock time, but zero collision risk and each wave is independently testable/deployable. Every push to main is a working app.

---

## Agent Briefing Template

Each agent gets:
1. This wave's section from IMPLEMENTATION-PLAN.md (tasks, files, verification, git)
2. Full PROJECT.md for context
3. Full UX-AUDIT.md for reference
4. Instruction: "Read ALL files in the project before editing. Follow the verification checklist. Push when done."
