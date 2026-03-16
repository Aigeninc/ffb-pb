# Play Audit Report
**Date:** 2026-03-16
**Plays audited:** 44

---

## 🔴 Critical Issues (animation doesn't match play concept)

### Jet Sweep (#17)
- **Issue:** 6 players defined on field in a 5v5 game
- **Expected:** Maximum 5 players on field (Braelyn, Lenox, + 3 skill players)
- **Actual:** Braelyn, Lenox, Greyson, Marshall, Cooper, AND Mason are all in the play with positions and routes
- **Fix:** Remove one player. If Mason (FAKE RB) is needed, swap him in for Cooper or Marshall. The "GO (pull safety)" and "GO (clear)" roles are redundant — one WR decoy is enough. Simplest fix: remove Cooper (his `GO (clear)` at [31,8] is redundant with Marshall's clearing route) or replace Cooper with Mason in the lineup.

### Fake Jet Draw (#25)
- **Issue:** 6 players defined on field in a 5v5 game (same problem as Jet Sweep)
- **Expected:** Maximum 5 players on field
- **Actual:** Braelyn, Lenox, Greyson, Marshall, Cooper, AND Mason all have positions and routes
- **Fix:** Remove one player. Mason is the ball carrier here (DRAW up middle), so he must stay. Remove either Marshall or Cooper — both are running identical `GO (decoy)` routes to y=14. Keep one decoy, drop the other. Suggestion: remove Cooper since Marshall's left-side decoy at [3,0] creates better misdirection paired with the rightward jet fake.

### RPO Slant (#5)
- **Issue:** `qbLook.throw` says 'Greyson' but `ballPath` shows handoff to Marshall — animation sends ball to wrong player
- **Expected:** Ball should go to Greyson (the slant, read 1) since `qbLook.throw = 'Greyson'`
- **Actual:** `ballPath` is `snap → handoff Braelyn→Marshall at 0.5s`. A kid watching the animation sees the ball go to Marshall on a run, but the play description/qbLook says throw to Greyson on the slant.
- **Fix:** Change `ballPath` to show the pass option: `{ from: 'Braelyn', to: 'Greyson', time: 1.0, type: 'throw' }`. OR add a second ballPath option for RPO plays. OR change `qbLook.throw` to `'Marshall'` if the run is the intended default animation. The current state is contradictory — the play SAYS "throw to Greyson" but SHOWS "handoff to Marshall."

### Double Go (#42)
- **Issue:** `qbLook.throw` says 'Marshall' but `ballPath` throws to Greyson — animation contradicts the throw target
- **Expected:** Ball should go to Marshall (since `qbLook.throw = 'Marshall'`) OR qbLook should match ballPath
- **Actual:** `ballPath` throws from `Braelyn → Greyson at 2.5s`. The tip text says "Throw RIGHT to Marshall if his DB is beat" but the animation always throws LEFT to Greyson.
- **Fix:** Either (a) change `ballPath` to `{ from: 'Braelyn', to: 'Marshall', time: 2.5, type: 'throw' }` to match qbLook.throw, OR (b) change `qbLook.throw` to `'Greyson'` and update the tip text. Since the concept is "pick the 1v1 winner," the play could go either way, but the data must be internally consistent. Currently it's not — a kid sees the ball go to Greyson but the play card says the target is Marshall.

---

## 🟡 Minor Issues (cosmetic or non-blocking)

### Play Action Boot (#28)
- **Issue:** `whenToUse` third entry says "ONE read — **Marshall** flat on bootleg side" but the flat target is actually **Cooper**
- **Fix:** Change the `whenToUse` text from "Marshall flat" to "Cooper flat." The notes, qbLook, and ballPath all correctly reference Cooper as the flat target — only the `whenToUse` hint text is wrong.

### Wildcat (#36)
- **Issue:** `isRunPlay: true` but `ballPath` shows a throw (Greyson → Braelyn at 1.5s)
- **Fix:** Either remove `isRunPlay: true` (since the default animation shows a pass), or change `ballPath` to show Greyson running (no throw) and move the throw option to notes/specialLabels only. The `isRunPlay` flag may affect how the renderer handles the play (e.g., no throw arc animation expected for run plays). If the renderer doesn't key on this flag, it's cosmetic only.

### I-Bone (#30)
- **Issue:** Has a pass option (Cooper slant, `read: 2`, `timing: {2: 1.5}`) but no `qbLook` defined
- **Fix:** Add `qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Read defense: hand to Greyson RIGHT if edge open → 🏈 OR hand to Marshall LEFT → OR throw Cooper slant' }` or similar. Since `isRunPlay: true` and the primary action is a handoff, this is minor — the animation works fine without qbLook. But adding it would complete the play data for the info panel display.

---

## 🟢 Clean Plays (no issues found)

1. Mesh
2. Flood Fake
3. Flood Right
4. Reverse
5. Quick Slants NRZ
6. Flat-Wheel
7. Braelyn Lateral
8. Flood Left
9. Hitch & Go
10. Screen
11. Reverse Fake
12. Fade
13. Mesh Wheel
14. Slant & Go
15. Screen Fake Post
16. RB Draw
17. End Around
18. RPO Flood
19. Triple Option
20. Bubble Screen
21. Quick Hitch
22. Jet Bubble
23. Counter Sweep
24. Counter Left
25. Hook & Ladder
26. Speed Pitch
27. Split Sweep
28. Counter Pass
29. Dual Wheel
30. Split Back Screen
31. Swinging Gate
32. Bunch Goal Line
33. Mesh Left
34. Mesh Right
35. Mesh Deep
36. Flea Flicker
37. Flat Dump

---

## Detailed Audit Notes

### Route-Label Verification (all 44 plays)
Every route was checked against its label. All route waypoints match their labels:
- **SLANT** routes correctly move from outside → inside (x converges toward center)
- **CORNER** routes go upfield then break toward sideline
- **GO** routes run straight deep along a sideline
- **FLAT** routes go toward sideline at shallow depth
- **MESH** routes cross the field horizontally at 5-6yd depth
- **WHEEL** routes start flat then turn upfield (Flat-Wheel, Mesh Wheel, Dual Wheel all correct)
- **POST** routes go upfield then break inside toward center
- **HITCH** routes go upfield 3-5 steps then turn back
- **SCREEN/BUBBLE** routes stay at or behind LOS initially
- **DRAW** routes have delayed start then run up middle
- **FADE** route runs deep along far sideline

### Concept Verification
- **Flood plays** (Flood Right, Flood Left, Flood Fake, RPO Flood): All have 3 levels on the same side (corner deep, out mid, flat short) ✓
- **Mesh plays** (Mesh, Mesh Left, Mesh Right, Mesh Deep, Mesh Wheel): All have two receivers crossing at similar depth (y=5-6) ✓
- **Screen plays** (Screen, Bubble Screen, Split Back Screen): Routes stay shallow/behind LOS ✓
- **RPO plays** (RPO Slant, RPO Flood, Triple Option): All have both run and pass options ✓
- **Wheel routes** (Flat-Wheel, Mesh Wheel, Dual Wheel): All start flat then go vertical ✓

### Ball Path Completeness
- All 44 plays have a snap (Lenox → Braelyn in 43 plays, Lenox → Greyson in Wildcat) ✓
- All passing plays have snap + throw ✓
- All run plays have snap + handoff (or lateral for Speed Pitch) ✓
- Trick plays have complete ball transfer chains:
  - Reverse: snap → handoff → lateral (3 transfers) ✓
  - Braelyn Lateral: snap → lateral → throw (3 transfers) ✓
  - Flea Flicker: snap → handoff → lateral → throw (4 transfers) ✓
  - Hook & Ladder: snap → throw → lateral (3 transfers) ✓
  - Play Action Boot: snap → fake handoff → throw (3 transfers) ✓

### Formation Verification
All starting positions match their formation names:
- **Spread**: Players spread wide (Greyson/Marshall near sidelines, Cooper in backfield) ✓
- **Twins Right/Left**: Two receivers stacked on one side ✓
- **Double-Back**: Two RBs behind QB ✓
- **Stack / I-Bone**: Backs stacked in I-formation ✓
- **Wildcat**: Direct snap alignment ✓
- **Swinging Gate**: Cluster formation with isolated receiver ✓
- **Bunch Right**: 3 receivers bunched on one side ✓

### Timing Consistency
All ballPath throw times match the timing entry for the target's read number. No timing mismatches found across all 44 plays.

---

## Summary
- **Total plays:** 44
- **Critical issues:** 4
- **Minor issues:** 3
- **Clean:** 37
