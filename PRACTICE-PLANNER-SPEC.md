# PRACTICE PLANNER SPEC

**Status:** BUILT — 2026-03-17  
**Estimated new code:** ~1,100 lines (drill data ~300, module ~450, HTML ~50, CSS ~300)  
**Date:** 2026-03-17  
**Author:** UX Design Agent

---

## Table of Contents
1. [Architecture Decision](#1-architecture-decision)
2. [Data Structures](#2-data-structures)
3. [UI Wireframes](#3-ui-wireframes)
4. [User Flows](#4-user-flows)
5. [Component Breakdown](#5-component-breakdown)
6. [Integration Plan](#6-integration-plan)
7. [Implementation Plan](#7-implementation-plan)
8. [File Changes](#8-file-changes)

---

## 1. Architecture Decision

### Where It Lives
**Replace the existing Warmups panel (🏃)**. The warmups panel currently has 3 hardcoded exercises. The Practice Planner subsumes this entirely — warmups become one category within the drill library. The 🏃 button becomes the Practice Planner toggle.

**Why not a new mode?** The 3-mode system (Player/Coach/Prep) is well-established. Practice planning is a Prep activity, and running a practice plan is a Coach activity. Adding a 4th mode overcomplicates.

**Panel behavior:** Same as the existing warmups panel — side panel that slides in from the right with a backdrop. Uses the exact same `.side-panel` pattern as roster and warmups.

**Two sub-views within the panel:**
1. **Builder view** (Prep mode) — create/edit practice plans
2. **Run view** (Coach mode) — execute a practice plan on the field

Both modes show the 🏃 button. In Prep mode, it opens Builder. In Coach mode, it opens Run view (if a plan is loaded) or Builder (if not).

---

## 2. Data Structures

### 2a. Drill Library

```js
// Each drill object
const DRILL = {
  id: 'mirror-dodge',                    // kebab-case unique ID
  name: 'Mirror Dodge',                   // Display name
  category: 'evasion',                    // evasion|defense|receiving|throwing|warmup|scrimmage|team
  duration: 5,                            // Default minutes
  description: 'Pairs face each other, ball carrier jukes, defender mirrors.',
  setup: 'Pairs face each other 3 yards apart, cones as sideline boundaries (5-yard lane). ALL pairs go simultaneously.',
  coachingPoints: [
    'Watch for kids who only go one direction',
    'Force them to work both sides',
    'Teaches hesitation moves and reading defender hips',
  ],
  playerCount: { min: 2, ideal: 10 },     // min needed, ideal for max participation
  equipment: ['cones'],                    // cones|footballs|flags|none
  difficulty: 1,                           // 1=beginner, 2=intermediate, 3=advanced
  isCustom: false,                         // true for coach-created drills
};
```

### 2b. Complete Drill Library Data

```js
const DRILLS = [
  // ── WARMUP ──────────────────────────────────────
  {
    id: 'dynamic-warmup',
    name: 'Dynamic Warm-Up',
    category: 'warmup',
    duration: 7,
    description: 'Full movement prep: high knees, butt kicks, shuffles, sprints, flag-specific buzzes.',
    setup: 'Line up on sideline, go across and back (10-15 yards). All kids go simultaneously.',
    coachingPoints: [
      'We warm up like pros — no walking!',
      'Buzz feet = short choppy steps',
      'Include: high knees, butt kicks, Frankensteins, backpedal, side shuffle, sprints',
    ],
    playerCount: { min: 1, ideal: 10 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'defensive-shuffle',
    name: 'Defensive Shuffle',
    category: 'warmup',
    duration: 3,
    description: 'Side step skipping with arms wide for defense positioning.',
    setup: 'Line up on the sideline facing the field. Arms out wide — full wingspan.',
    coachingPoints: [
      'Stay low in athletic stance, knees bent',
      'Keep arms wide the ENTIRE time',
      'This is your defensive coverage zone',
    ],
    playerCount: { min: 1, ideal: 10 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'diamond-catch-high',
    name: 'Diamond Catch Circles (High)',
    category: 'warmup',
    duration: 2,
    description: 'Arm circles with diamond hand shape — teaches high catch technique.',
    setup: 'Stand with feet shoulder width apart. Make diamond with thumbs + index fingers touching.',
    coachingPoints: [
      'Diamond hands (thumbs together) for any ball ABOVE the chest',
      '10 circles forward, 10 circles backward',
      'Watch the diamond window — that\'s where the ball goes',
    ],
    playerCount: { min: 1, ideal: 10 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'pinky-catch-low',
    name: 'Pinky Catch Circles (Low)',
    category: 'warmup',
    duration: 2,
    description: 'Arm circles with pinkies crossed — teaches low catch technique.',
    setup: 'Stand with feet shoulder width apart. Cross pinky fingers, palms facing up (basket shape).',
    coachingPoints: [
      'Pinkies together for any ball BELOW the chest',
      '10 circles forward, 10 circles backward',
      'Watch the basket as it moves — that\'s where you scoop low balls',
    ],
    playerCount: { min: 1, ideal: 10 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },

  // ── EVASION ─────────────────────────────────────
  {
    id: 'mirror-dodge',
    name: 'Mirror Dodge',
    category: 'evasion',
    duration: 5,
    description: 'Pairs face each other, ball carrier jukes, defender mirrors. All pairs simultaneous.',
    setup: 'Pairs face each other 3 yards apart, cones as sideline boundaries (5-yard lane). ALL pairs go simultaneously.',
    coachingPoints: [
      'Watch for kids who only go one direction — force both sides',
      'Switch every 30 seconds',
      'Teaches hesitation moves and reading defender hips',
    ],
    playerCount: { min: 2, ideal: 10 },
    equipment: ['cones'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'gauntlet-run',
    name: 'Gauntlet Run',
    category: 'evasion',
    duration: 8,
    description: '4 defenders in boxes, runner chains juke moves past each one.',
    setup: '4 cones in a line, 5 yards apart. One defender at each cone (confined to 3-yard box). Run TWO parallel gauntlets.',
    coachingPoints: [
      'Don\'t use a move if you can just run past them — moves cost speed',
      'Chain moves: read the NEXT defender immediately',
      'After each run, runner replaces last defender, everyone shifts up',
    ],
    playerCount: { min: 5, ideal: 10 },
    equipment: ['cones'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: '1v1-open-field',
    name: '1v1 Open Field',
    category: 'evasion',
    duration: 5,
    description: 'One runner vs one flag puller in a 10×10 box. Tournament style.',
    setup: '10×10 yard box. Split into two groups. Pairs go simultaneously from each group.',
    coachingPoints: [
      'Attack space, not the defender',
      'Defender: Eyes-Buzz-Rip',
      'Losers do 2 push-ups. Winner stays.',
      'Keep it FAST — 10-second wait max between reps',
    ],
    playerCount: { min: 2, ideal: 10 },
    equipment: ['cones'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: 'cone-weave-relay',
    name: 'Cone Weave Relay',
    category: 'evasion',
    duration: 5,
    description: 'Relay race: weave through cones, dodge flag puller, sprint home.',
    setup: 'Two teams. 5 cones in zig-zag → one flag puller at the end → sprint to finish.',
    coachingPoints: [
      'Must touch each cone',
      'Flag puller rotates every 2 runners',
      'Teaches cutting + finishing when tired (4th quarter legs)',
    ],
    playerCount: { min: 6, ideal: 10 },
    equipment: ['cones'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'juke-relay',
    name: 'Juke Relay',
    category: 'evasion',
    duration: 5,
    description: 'Relay race with cone weaving + required juke moves at each station.',
    setup: 'Two teams. 4 cone stations, each requires a specific juke move (cut, drop, shimmy, spin). Sprint between stations.',
    coachingPoints: [
      'Call out which juke move at each station',
      'Must execute the move before advancing',
      'Team competition keeps energy high',
    ],
    playerCount: { min: 4, ideal: 10 },
    equipment: ['cones'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: 'follow-the-leader',
    name: 'Follow the Leader',
    category: 'evasion',
    duration: 5,
    description: 'Greyson leads, others mimic his cuts and moves in a line.',
    setup: 'Single file line, 2 yards between each player. Leader runs at 70% speed making cuts/moves.',
    coachingPoints: [
      'Rotate leaders every 60 seconds',
      'Keep spacing — don\'t bunch up',
      'Teaches reading body language and reactive cutting',
    ],
    playerCount: { min: 3, ideal: 8 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'sharks-and-minnows',
    name: 'Sharks & Minnows',
    category: 'evasion',
    duration: 8,
    description: 'Flag pulling + juke practice in a confined box. Sharks pull flags, minnows juke to survive.',
    setup: '20×15 yard box. 2 sharks in the middle, rest are minnows on one end line.',
    coachingPoints: [
      'Minnows must cross to the other side without losing a flag',
      'Tagged minnows become sharks',
      'Last minnow standing wins',
      'Teaches juking under pressure + flag pulling in traffic',
    ],
    playerCount: { min: 5, ideal: 10 },
    equipment: ['cones', 'flags'],
    difficulty: 1,
    isCustom: false,
  },

  // ── DEFENSE ─────────────────────────────────────
  {
    id: 'zone-drop-break',
    name: 'Zone Drop & Break',
    category: 'defense',
    duration: 8,
    description: 'Defenders read coach\'s eyes/arm, break on the ball. Progress from standing to routes.',
    setup: 'Split squad in half. 3 receivers stand at spots, 3 defenders in zone spots. Coach plays QB.',
    coachingPoints: [
      'Guard your grass, then GO when it\'s thrown',
      'Read coach\'s eyes and arm — not the receivers',
      'Quiz receivers not targeted: "Where was the open guy?"',
      'Rotate 1-2 kids per rep',
    ],
    playerCount: { min: 6, ideal: 10 },
    equipment: ['footballs', 'cones'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: 'shark-eyes',
    name: 'Shark Eyes',
    category: 'defense',
    duration: 5,
    description: 'Circle passing game, defender in middle reads eyes and jumps throws.',
    setup: 'Circle of 5-6 kids passing, one defender in middle. Run TWO circles if 10+ kids.',
    coachingPoints: [
      'Defender reads thrower\'s EYES, not the ball',
      'Rotate every INT or every 30 seconds',
      'Two circles = ALL kids active simultaneously',
    ],
    playerCount: { min: 5, ideal: 10 },
    equipment: ['footballs'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'angle-pursuit',
    name: 'Angle Pursuit',
    category: 'defense',
    duration: 5,
    description: 'Defender takes correct angle to cut off sideline runner.',
    setup: 'Runner on sideline, defender starts 5 yards inside. Run multiple pairs simultaneously.',
    coachingPoints: [
      'Don\'t chase — beat them to the spot',
      'Take the correct angle to cut off, NOT run behind',
      '3-4 pairs at a time across the width',
    ],
    playerCount: { min: 2, ideal: 10 },
    equipment: ['cones'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'game-interceptor',
    name: 'Game Interceptor',
    category: 'defense',
    duration: 8,
    description: 'Zone defense trainer — QB throws to receivers, interceptors read and jump routes from zones.',
    setup: '3 receivers run short routes. 3 defenders in zone spots. QB (coach or player) reads and throws. Defenders try to intercept.',
    coachingPoints: [
      'Defenders: eyes on the QB, not the receivers',
      'Break on the ball when you see the arm go forward',
      'Receivers: run crisp routes to make it realistic',
      'Rotate offense/defense every 3-4 plays',
    ],
    playerCount: { min: 6, ideal: 10 },
    equipment: ['footballs', 'cones'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: 'shadow-flag-pulling',
    name: 'Shadow Flag Pulling',
    category: 'defense',
    duration: 5,
    description: '4v4 matched pairs — each player tries to grab their opponent\'s flag.',
    setup: '20×15 yard box. 4v4, each player assigned an opponent. Both teams have flags.',
    coachingPoints: [
      'Stay with YOUR assigned player',
      'Pull their flag while protecting yours',
      'Teaches man coverage awareness + flag pulling at speed',
    ],
    playerCount: { min: 4, ideal: 8 },
    equipment: ['cones', 'flags'],
    difficulty: 2,
    isCustom: false,
  },

  // ── RECEIVING ───────────────────────────────────
  {
    id: 'quick-hands-triangle',
    name: 'Quick Hands Triangle',
    category: 'receiving',
    duration: 5,
    description: 'Groups of 3 in triangle, quick throws — catch and release under 2 seconds.',
    setup: 'Groups of 3, triangle formation, 5 yards apart. ALL groups go simultaneously.',
    coachingPoints: [
      'Catch and release in under 2 seconds',
      'Add a light defender in middle after comfortable',
      '10 kids = 3 groups of 3 + 1 rotating defender',
    ],
    playerCount: { min: 3, ideal: 10 },
    equipment: ['footballs'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'route-and-look',
    name: 'Route & Look',
    category: 'receiving',
    duration: 8,
    description: 'Receivers run routes, turn and find the ball at the break. Two lines simultaneous.',
    setup: 'Two lines of receivers, two QBs. Both lines run simultaneously to different sides.',
    coachingPoints: [
      'Must turn and find the ball at the break',
      'QB delivers on timing',
      'After catching, jog to back of opposite line',
      'This IS your passing offense — do it every practice',
    ],
    playerCount: { min: 4, ideal: 10 },
    equipment: ['footballs'],
    difficulty: 2,
    isCustom: false,
  },
  {
    id: 'crossing-route-catches',
    name: 'Crossing Route Catches',
    category: 'receiving',
    duration: 8,
    description: 'Receivers run crossing routes, catches at 5, 10, and 15 yards.',
    setup: 'Two lines on opposite sides. Receivers run crossing routes across the field. QB in center throws timing passes.',
    coachingPoints: [
      'Eyes on the ball through the catch — don\'t look upfield yet',
      'Progress distances: 5 yards → 10 yards → 15 yards',
      'Teaches catching while running laterally (hardest catch for kids)',
    ],
    playerCount: { min: 3, ideal: 10 },
    equipment: ['footballs', 'cones'],
    difficulty: 2,
    isCustom: false,
  },

  // ── THROWING ────────────────────────────────────
  {
    id: 'target-ladder',
    name: 'Target Ladder',
    category: 'throwing',
    duration: 5,
    description: '3 cones at 5/8/12 yards. Must complete 2/3 to advance. Track accuracy.',
    setup: '3 cones at 5, 8, 12 yards. Run 2-3 stations side by side. Every kid throws.',
    coachingPoints: [
      'Must complete 2/3 to "advance"',
      'Track accuracy across sessions',
      '7-second clock means QB must be accurate on short/medium — no deep bombs',
    ],
    playerCount: { min: 2, ideal: 10 },
    equipment: ['footballs', 'cones'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'moving-target',
    name: 'Moving Target',
    category: 'throwing',
    duration: 5,
    description: 'QB on the line, receivers jog across at 8 yards. Lead the throw. Continuous flow.',
    setup: 'QB on the line. Receivers line up, one at a time jogs across at 8 yards. Next receiver goes as soon as throw is made.',
    coachingPoints: [
      'Lead the receiver — hit them in stride',
      'Continuous flow, no breaks',
      'Each kid gets a rep every 15 seconds',
      'Teaches timing — #1 skill gap in youth QBs',
    ],
    playerCount: { min: 3, ideal: 10 },
    equipment: ['footballs'],
    difficulty: 2,
    isCustom: false,
  },

  // ── TEAM / SCRIMMAGE ────────────────────────────
  {
    id: 'play-walkthrough',
    name: 'Offensive Play Drills',
    category: 'team',
    duration: 10,
    description: 'Walk-through/run-through of specific plays from the playbook.',
    setup: 'Full team at line of scrimmage. Walk through at teach speed first, then progress to run speed.',
    coachingPoints: [
      'Walk first, then jog, then full speed',
      'Each player must know their assignment BEFORE lining up',
      'Run each play 3-4 times minimum before moving on',
      'Tie to specific plays from the app playbook',
    ],
    playerCount: { min: 5, ideal: 8 },
    equipment: ['footballs', 'cones'],
    difficulty: 1,
    isCustom: false,
    linkedPlays: true,  // Special flag: this drill supports linking to specific playbook plays
  },
  {
    id: 'scrimmage',
    name: 'Scrimmage',
    category: 'scrimmage',
    duration: 10,
    description: 'Full 5v5 scrimmage — situational or open.',
    setup: 'Full field or half field. 5v5 with subs rotating every series.',
    coachingPoints: [
      'Call specific situations: "3rd and long, red zone, etc."',
      'Rotate subs every series for equal playing time',
      'Coach BOTH sides — offense AND defense',
      'Stop and correct as needed, but keep it flowing',
    ],
    playerCount: { min: 8, ideal: 10 },
    equipment: ['footballs', 'cones', 'flags'],
    difficulty: 1,
    isCustom: false,
  },
  {
    id: 'cool-down',
    name: 'Cool Down & Team Talk',
    category: 'team',
    duration: 5,
    description: 'Light stretching, recap what we learned, homework reminder.',
    setup: 'Circle up. Light stretches while coach talks.',
    coachingPoints: [
      'Recap 1-2 key things from today',
      'Shout out who did well and why',
      'Homework: 10 push-ups, 10 jumping jacks, 10 squats, 2 min run',
      '"Champions work every day"',
    ],
    playerCount: { min: 1, ideal: 10 },
    equipment: [],
    difficulty: 1,
    isCustom: false,
  },
];
```

### 2c. Practice Plan Data Structure

```js
const PRACTICE_PLAN = {
  id: 'pp-1710730000000',          // 'pp-' + Date.now() at creation
  name: 'Week 4 Practice 1 — Defense Focus',
  totalMinutes: 75,                 // Target duration
  createdAt: 1710730000000,
  updatedAt: 1710730000000,
  blocks: [
    {
      drillId: 'dynamic-warmup',    // Reference to DRILLS entry (or custom drill)
      duration: 7,                  // Minutes (can differ from drill default)
      notes: '',                    // Coach notes for this block
      linkedPlays: [],              // Array of play names from playbook (for play-walkthrough type)
    },
    {
      drillId: 'mirror-dodge',
      duration: 5,
      notes: 'Focus on Jordy going left',
      linkedPlays: [],
    },
    {
      drillId: 'play-walkthrough',
      duration: 10,
      notes: '',
      linkedPlays: ['Mesh', 'Flood Right', 'Counter Jet'],
    },
    // ...
  ],
};
```

### 2d. State Additions (state.js)

```js
// Add to state object:
{
  // ── Practice Planner ──────────────────────────────
  practicePlans: [],           // Array of saved PRACTICE_PLAN objects
  activePracticePlan: null,    // Currently loaded plan (PRACTICE_PLAN object or null)
  practiceRunning: false,      // True when in "run" mode during practice
  practiceBlockIdx: 0,         // Current block index during run
  practiceTimerActive: false,  // Timer countdown active
  practiceTimerRemaining: 0,   // Seconds remaining for current block
}
```

### 2e. localStorage Keys

```
playbook:practicePlans    — JSON array of all saved practice plans
playbook:customDrills     — JSON array of coach-created custom drills
playbook:lastPracticePlan — ID of last opened plan (for quick re-open)
```

---

## 3. UI Wireframes

### 3a. Builder View (Prep Mode)

```
┌──────────────────────────────────┐
│ 🏃 Practice Planner           ✕ │  ← Panel header
├──────────────────────────────────┤
│ ┌────────────────────────────┐   │
│ │ Plan: [Week 4 — Defense  ▼]│   │  ← Plan name (tap to rename) + dropdown to load others
│ │ Time: [60] [75] [90] [___]│   │  ← Quick duration pills + custom input
│ └────────────────────────────┘   │
│ Used: 52 / 75 min  ████████░░   │  ← Time usage bar (green/yellow/red)
├──────────────────────────────────┤
│                                  │
│ ┌── 1. Dynamic Warm-Up ─── 7m ┐ │  ← Block cards (numbered, draggable)
│ │ 🏃 Warmup            [- +]  │ │  ← Category tag + time stepper
│ └──────────────────────────────┘ │
│                                  │
│ ┌── 2. Mirror Dodge ──────  5m ┐ │
│ │ 🏃 Evasion            [- +] │ │
│ │ 📝 Focus on Jordy left      │ │  ← Note preview (tap to expand)
│ └──────────────────────────────┘ │
│                                  │
│ ┌── 3. Play Install ──── 10m  ┐ │
│ │ 🏈 Team               [- +] │ │
│ │ Mesh, Flood Right, Counter   │ │  ← Linked play names
│ └──────────────────────────────┘ │
│                                  │
│ ┌── 4. Scrimmage ──────  10m  ┐ │
│ │ 🏟️ Scrimmage          [- +] │ │
│ └──────────────────────────────┘ │
│                                  │
│       [ + Add Drill ]            │  ← Opens drill picker
│                                  │
├──────────────────────────────────┤
│ [💾 Save] [📋 Duplicate] [🗑️]  │  ← Bottom action bar
│ [▶️ Run This Plan]               │  ← Big green CTA
├──────────────────────────────────┤
│ ── Saved Plans ──                │  ← Collapsible section
│ Week 3 Practice 2 (75 min)   ▸  │
│ Week 3 Practice 1 (60 min)   ▸  │
│ Preseason Week 1 (75 min)    ▸  │
└──────────────────────────────────┘
```

### 3b. Drill Picker (Overlay within panel)

```
┌──────────────────────────────────┐
│ ← Back         Add Drill         │
├──────────────────────────────────┤
│ [All] [Evasion] [Defense]        │  ← Category pills (scrollable)
│ [Receiving] [Throwing] [Team]    │
├──────────────────────────────────┤
│ ┌────────────────────────────┐   │
│ │ 🏃 Mirror Dodge         5m│   │  ← Tap to add
│ │ Pairs face each other...   │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🏃 Gauntlet Run         8m│   │
│ │ 4 defenders in boxes...    │   │
│ └────────────────────────────┘   │
│                                  │
│ ... (all drills in category)     │
│                                  │
│ ┌────────────────────────────┐   │
│ │ ＋ Create Custom Drill     │   │  ← At bottom of list
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

### 3c. Run View (Coach Mode — during practice)

```
┌──────────────────────────────────┐
│ 🏃 PRACTICE — Week 4 Def    ✕  │
├──────────────────────────────────┤
│                                  │
│          MIRROR DODGE            │  ← BIG current drill name
│           4:32 left              │  ← Timer (large, readable in sun)
│                                  │
│ ┌────────────────────────────┐   │
│ │ 🎯 COACHING POINTS         │   │  ← Expandable card
│ │ • Force both sides          │   │
│ │ • Switch every 30 sec       │   │
│ └────────────────────────────┘   │
│                                  │
│ ┌────────────────────────────┐   │
│ │ 📋 SETUP (tap to see)      │   │  ← Collapsed by default
│ └────────────────────────────┘   │
│                                  │
│ 📝 Focus on Jordy going left    │  ← Coach note if present
│                                  │
├──────────────────────────────────┤
│   ◀ Prev   [⏸ PAUSE]   Next ▶  │  ← Big tap targets (min 56px)
├──────────────────────────────────┤
│ ● ● ◉ ○ ○ ○ ○                   │  ← Progress dots (filled=done, ring=current)
│ 2/7 blocks · 52 min remaining   │
└──────────────────────────────────┘
```

**Key Run View UX decisions:**
- Timer is OPT-IN: defaults to showing time remaining but doesn't auto-advance. Coach taps Next when ready. This lets coaches run long on drills that are working and cut short drills that aren't.
- Timer can be toggled to countdown mode (auto-beep when time expires) via a small ⏱ icon next to the time display.
- Progress dots at bottom give at-a-glance position in practice.
- Linked plays in a "Play Install" block show tappable play names that open the main play viewer.

### 3d. Block Detail / Edit (inline expand in Builder)

```
┌── 2. Mirror Dodge ──────── 5m ──┐
│ 🏃 Evasion                      │
│                                  │
│ Time: [◀ 5 min ▶]               │  ← Stepper buttons (not typing)
│                                  │
│ 📝 Notes:                        │
│ ┌──────────────────────────┐     │
│ │ Focus on Jordy left      │     │  ← Text area (expands on tap)
│ └──────────────────────────┘     │
│                                  │
│ 🎯 Coaching Points:              │
│ • Force both sides               │  ← Read-only from drill library
│ • Switch every 30 sec            │
│                                  │
│ [↑ Move Up] [↓ Move Down]       │  ← Reorder (not drag — mobile-first)
│ [🗑️ Remove]                      │
└──────────────────────────────────┘
```

### 3e. Play Linker (for Play Install blocks)

```
┌── Play Install ─────────── 10m ─┐
│ 🏈 Team                         │
│                                  │
│ Linked Plays:                    │
│ [Mesh ✕] [Flood Right ✕]        │  ← Chips, tap ✕ to remove
│ [Counter Jet ✕]                  │
│                                  │
│ [ + Link a Play ]                │  ← Opens play selector
│                                  │
│ ┌────── Select a play ──────┐   │
│ │ ○ Mesh                    │   │  ← Scrollable play list
│ │ ○ Flood Right              │   │
│ │ ○ Counter Jet              │   │  ← Tap to add, auto-close
│ │ ○ Quick Slant              │   │
│ │ ...                        │   │
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

### 3f. Templates (from Plan Name area)

When the coach creates a "New Plan", show template picker:

```
┌──────────────────────────────────┐
│ Start from:                      │
│                                  │
│ ┌────────────────────────────┐   │
│ │ 📄 Blank (75 min)          │   │  ← Empty plan, just Warm-Up + Cool Down
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🅰️ Template A: Evasion+Def │   │  ← Pre-populated from PRACTICE-DRILL-PLAN.md templates
│ │   Mirror Dodge → Gauntlet   │   │
│ │   → 1v1 → Shark Eyes →     │   │
│ │   Zone Drop → Route & Look  │   │
│ │   → Scrimmage               │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🅱️ Template B: Passing+Rec │   │
│ │   Quick Hands → Route &     │   │
│ │   Look → Moving Target →    │   │
│ │   Target Ladder → Angle     │   │
│ │   Pursuit → Mirror Dodge    │   │
│ │   → Scrimmage               │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 🅲️ Template C: Game Prep   │   │
│ │   Mirror Dodge → Play Walk  │   │
│ │   → Zone Drop → Scrimmage   │   │
│ │   (heavy)                   │   │
│ └────────────────────────────┘   │
│ ┌────────────────────────────┐   │
│ │ 📋 Duplicate Existing...    │   │  ← Pick from saved plans to copy
│ └────────────────────────────┘   │
└──────────────────────────────────┘
```

---

## 4. User Flows

### Flow 1: Create a Practice Plan from Template

1. Coach opens app in Prep mode
2. Taps 🏃 button → Practice Planner panel slides in
3. Panel shows any previously loaded plan, or "New Plan" prompt
4. Coach taps "New Plan" (or "+" at bottom of saved plans)
5. Template picker overlay appears
6. Coach taps "Template A: Evasion + Defense"
7. Plan populates with Warm-Up → Mirror Dodge → Gauntlet → 1v1 → Shark Eyes → Zone Drop → Route & Look → Scrimmage → Cool Down
8. Duration auto-fills to 75 min
9. Time bar shows "Used: 58 / 75 min" — room to spare
10. Coach taps block 3 (1v1 Open Field) to expand it
11. Adjusts time from 5 to 3 min (tap ◀ button)
12. Adds a note: "Greyson vs Marshall bracket"
13. Collapses the block
14. Taps "+ Add Drill" between blocks 6 and 7
15. Drill picker opens, coach selects "Game Interceptor" from Defense category
16. New block appears at position 7 with default 8 min
17. Time bar updates: "Used: 66 / 75 min"
18. Coach taps "💾 Save" — prompted for name → "Week 4 Practice 1 — Defense Focus"
19. Plan saved to localStorage

### Flow 2: Run a Practice Plan

1. Coach switches to Coach mode (or stays in Prep)
2. Taps 🏃 → Practice Planner opens
3. If a plan is already loaded, shows Run View immediately
4. If not, shows saved plans list — coach taps one to load
5. Run View shows: "DYNAMIC WARM-UP" — "7:00 left"
6. Coach runs warm-up, when done taps "Next ▶"
7. View transitions to block 2: "MIRROR DODGE" — "5:00 left"
8. Coaching points visible: "Force both sides", etc.
9. Coach note shows: "Focus on Jordy going left"
10. Timer counts down (if enabled) but coach advances manually
11. At block 5 (Play Install), linked plays show as tappable chips
12. Coach taps "Mesh" → main play viewer loads Mesh behind the panel
13. Coach peeks at the play diagram, then closes or continues
14. Progress dots update as coach advances through blocks
15. Last block (Cool Down) — after advancing past it, shows "Practice Complete! 🎉"

### Flow 3: Add a Custom Drill

1. In Builder, coach taps "+ Add Drill"
2. Drill picker opens
3. Scrolls to bottom, taps "＋ Create Custom Drill"
4. Form appears: Name, Category (dropdown), Duration (stepper), Description (text area)
5. Coach fills in: "Flag Tag Game", Team, 8 min, "Free play flag tag in a box"
6. Taps Save — drill added to DRILLS array and saved to localStorage
7. New drill appears in picker under selected category
8. Coach taps it to add to current plan

### Flow 4: Quick Load Previous Plan

1. Coach taps 🏃 → panel opens
2. Scrolls to "Saved Plans" section at bottom
3. Taps "Week 3 Practice 2"
4. Confirmation: "Load this plan? Current unsaved changes will be lost."
5. Plan loads into Builder (Prep mode) or Run view (Coach mode)

---

## 5. Component Breakdown

### File: `modules/practice.js` (~450 lines)

| Function | Lines | Description |
|----------|-------|-------------|
| `DRILLS` const | ~10 | Reference to drills (drills imported from drills.js) |
| `TEMPLATES` const | ~40 | 3 template definitions (A/B/C) |
| `initPractice()` | ~25 | Wire up 🏃 button, backdrop, close, load saved data |
| `openPracticePanel()` | ~10 | Show panel + backdrop |
| `closePracticePanel()` | ~10 | Hide panel + backdrop |
| `renderBuilderView()` | ~80 | Render plan name, time bar, block cards, actions |
| `renderDrillPicker()` | ~60 | Category pills + drill cards for adding |
| `renderRunView()` | ~70 | Current drill, timer, coaching points, nav |
| `renderBlockCard(block, idx)` | ~40 | Single block card with expand/collapse |
| `renderBlockDetail(block, idx)` | ~50 | Expanded block: stepper, notes, coaching points, reorder/delete |
| `renderPlayLinker(block, idx)` | ~30 | Linked play chips + play selector for play-walkthrough |
| `renderTemplatesPicker()` | ~30 | Template selection overlay |
| `renderSavedPlansList()` | ~25 | List of saved plans with load/delete |
| `addBlock(drillId, afterIdx)` | ~10 | Add a drill block to current plan |
| `removeBlock(idx)` | ~8 | Remove a block |
| `moveBlock(idx, direction)` | ~10 | Reorder up/down |
| `updateBlockDuration(idx, delta)` | ~8 | Adjust time +/- 1 min |
| `createNewPlan(templateId)` | ~20 | Create plan from template or blank |
| `savePlan()` | ~15 | Save to localStorage |
| `loadPlan(planId)` | ~12 | Load from localStorage |
| `duplicatePlan(planId)` | ~10 | Deep copy + new ID |
| `deletePlan(planId)` | ~8 | Remove from localStorage |
| `startPracticeRun()` | ~12 | Switch to run view |
| `advancePracticeBlock(direction)` | ~15 | Next/prev block in run view |
| `togglePracticeTimer()` | ~15 | Start/stop countdown timer |
| `updatePracticeTimer()` | ~10 | requestAnimationFrame countdown |
| `getTimeUsed()` | ~5 | Sum of all block durations |
| `getDrillById(id)` | ~5 | Lookup in DRILLS + custom drills |
| `renderCustomDrillForm()` | ~35 | Form for creating custom drills |
| `saveCustomDrill(drill)` | ~10 | Save to localStorage + add to DRILLS |
| **Total** | **~450** | |

### File: `modules/drills.js` (~300 lines)

| Content | Lines | Description |
|---------|-------|-------------|
| `DRILLS` array | ~290 | All 24 drill definitions |
| `CATEGORY_META` | ~10 | Category display info (emoji, label, color) |
| **Total** | **~300** | |

### CSS additions to `style.css` (~300 lines)

| Section | Lines | Description |
|---------|-------|-------------|
| Practice panel layout | ~30 | Panel width, header |
| Time usage bar | ~20 | Progress bar styling |
| Block cards | ~60 | Card layout, expanded state, numbering |
| Drill picker | ~40 | Category pills, drill cards in picker |
| Run view | ~50 | Large drill name, timer, coaching points |
| Progress dots | ~15 | Dot indicators at bottom |
| Template picker | ~25 | Template option cards |
| Custom drill form | ~20 | Form inputs |
| Play linker | ~20 | Chips, play selector |
| Sunlight mode overrides | ~20 | All practice-related sunlight overrides |
| **Total** | **~300** | |

### HTML additions to `index.html` (~50 lines)

Replace the warmups panel HTML block with the practice panel:

```html
<!-- Practice Plan Panel Backdrop -->
<div id="practice-backdrop" class="panel-backdrop"></div>

<!-- Practice Plan Panel -->
<div id="practice-panel" class="side-panel practice-panel">
  <div class="panel-header">
    <span class="panel-title" id="practice-panel-title">🏃 Practice Planner</span>
    <button class="panel-close-btn" id="practice-close-btn" aria-label="Close">✕</button>
  </div>
  <div class="panel-body" id="practice-body">
    <!-- Rendered by practice.js -->
  </div>
</div>
```

---

## 6. Integration Plan

### 6a. Module Wiring (app.js)

```js
// Replace warmups import:
// import { initWarmups } from './modules/warmups.js';
import { initPractice, setSelectPlayFn as practiceSetSelectPlay } from './modules/practice.js';

// In init():
// Replace: initWarmups();
initPractice();
practiceSetSelectPlay(selectPlay);
```

### 6b. HTML Changes (index.html)

1. **Remove** the warmups panel HTML block:
   - Remove `#warmups-backdrop`
   - Remove `#warmups-panel`
2. **Add** the practice panel HTML (shown above) in the same location
3. **Keep** the `#btn-warmups` button — it becomes the practice planner toggle
   - Change `title` attribute from "Warm-Ups & Drills" to "Practice Planner"
   - The button ID stays the same for minimal wiring changes, OR rename to `btn-practice` and update references

### 6c. State.js Changes

Add the state fields listed in section 2d. Add persistence functions:

```js
export function savePracticePlans() {
  try {
    localStorage.setItem('playbook:practicePlans', JSON.stringify(state.practicePlans));
  } catch (e) {}
}

export function loadPracticePlans() {
  try {
    const raw = localStorage.getItem('playbook:practicePlans');
    if (raw) state.practicePlans = JSON.parse(raw);
  } catch (e) {}
}

export function saveCustomDrills() {
  try {
    const custom = /* imported DRILLS */.filter(d => d.isCustom);
    localStorage.setItem('playbook:customDrills', JSON.stringify(custom));
  } catch (e) {}
}

export function loadCustomDrills() {
  try {
    const raw = localStorage.getItem('playbook:customDrills');
    if (raw) {
      const drills = JSON.parse(raw);
      if (Array.isArray(drills)) drills.forEach(d => { d.isCustom = true; /* push to DRILLS */ });
    }
  } catch (e) {}
}
```

### 6d. Play Viewer Integration

When a linked play is tapped in Run View:
```js
function handleLinkedPlayTap(playName) {
  const playIdx = PLAYS.findIndex(p => p.name === playName);
  if (playIdx >= 0) {
    selectPlay(playIdx); // This function is passed via setSelectPlayFn
    // Don't close the practice panel — coach can peek at the play behind it
    // On mobile, the panel covers most of the screen anyway, so closing is an option
  }
}
```

### 6e. CSS Integration

- Practice panel reuses `.side-panel` base class — inherits all existing side panel behavior
- Add a `.practice-panel` modifier for width: `width: 360px` (same as warmups was)
- All new CSS classes prefixed with `pp-` to avoid conflicts
- Sunlight mode: add overrides under `body.sunlight .pp-*` selectors

### 6f. Button Change

The `#btn-warmups` button in `#controls`:
- Rename ID to `#btn-practice` (update all references in app.js)
- Keep `data-modes="coach,prep"` — visible in both modes
- Change title: `"Practice Planner"`
- Keep emoji: `🏃`

### 6g. Files to Delete

- `modules/warmups.js` — fully replaced by `modules/practice.js` + `modules/drills.js`

---

## 7. Implementation Plan

Ordered task list for a developer agent:

### Phase 1: Data Layer (drills.js + state additions)

1. **Create `modules/drills.js`**
   - Export `DRILLS` array with all 24 drill definitions from section 2b
   - Export `CATEGORY_META` object:
     ```js
     export const CATEGORY_META = {
       warmup:    { emoji: '🏃', label: 'Warm-Up', color: '#22c55e' },
       evasion:   { emoji: '💨', label: 'Evasion', color: '#f59e0b' },
       defense:   { emoji: '🛡️', label: 'Defense', color: '#ef4444' },
       receiving: { emoji: '🙌', label: 'Receiving', color: '#3b82f6' },
       throwing:  { emoji: '🎯', label: 'Throwing', color: '#8b5cf6' },
       team:      { emoji: '🏈', label: 'Team', color: '#14b8a6' },
       scrimmage: { emoji: '🏟️', label: 'Scrimmage', color: '#f97316' },
     };
     ```
   - Export `TEMPLATES` array with 3 templates (A, B, C) matching the drill catalog's Practice Rotation Templates

2. **Update `modules/state.js`**
   - Add `practicePlans`, `activePracticePlan`, `practiceRunning`, `practiceBlockIdx`, `practiceTimerActive`, `practiceTimerRemaining` to state object
   - Add `savePracticePlans()`, `loadPracticePlans()`, `saveCustomDrills()`, `loadCustomDrills()` functions
   - Add `saveLastPracticePlan()`, `loadLastPracticePlan()` functions

### Phase 2: HTML / Panel Shell

3. **Update `index.html`**
   - Remove warmups panel HTML (`#warmups-backdrop`, `#warmups-panel`)
   - Add practice panel HTML in same location (section 5 HTML)
   - Change `#btn-warmups` to `#btn-practice` (id and title)

4. **Update `app.js`**
   - Replace warmups import with practice import
   - Wire up `initPractice()` and `practiceSetSelectPlay(selectPlay)`
   - Update button reference from `btn-warmups` to `btn-practice`

5. **Delete `modules/warmups.js`**

### Phase 3: Builder View

6. **Create `modules/practice.js` — Builder scaffolding**
   - Import drills, state, category meta
   - Implement `initPractice()`, `openPracticePanel()`, `closePracticePanel()`
   - Implement `renderBuilderView()` — plan header, time bar, block list, action buttons
   - Implement `renderBlockCard()` — collapsed block card

7. **Block interactions**
   - Implement `renderBlockDetail()` — expanded view with time stepper, notes, coaching points
   - Implement `addBlock()`, `removeBlock()`, `moveBlock()`
   - Implement `updateBlockDuration()`
   - Block card tap-to-expand/collapse

8. **Drill picker**
   - Implement `renderDrillPicker()` — category pills, scrollable drill list
   - Tap drill → calls `addBlock()` → returns to builder view
   - "+ Add Drill" button between blocks (inserts at position)

9. **Plan management**
   - Implement `createNewPlan()` with template selection
   - Implement `renderTemplatesPicker()`
   - Implement `savePlan()`, `loadPlan()`, `duplicatePlan()`, `deletePlan()`
   - Implement `renderSavedPlansList()`
   - Plan name editing (tap name → inline input)

10. **Play linker (for play-walkthrough blocks)**
    - Implement `renderPlayLinker()` — chips for linked plays
    - Play selector: scrollable list of all plays from PLAYS array
    - Tap to add, ✕ to remove

### Phase 4: Run View

11. **Run view core**
    - Implement `renderRunView()` — big drill name, timer display, coaching points
    - Implement `startPracticeRun()` — switch from builder to run
    - Implement `advancePracticeBlock()` — next/prev with animation
    - Progress dots at bottom

12. **Timer + Stopwatch**
    - Two modes toggled by tapping the time display:
      - **Timer mode (⏱ countdown):** Counts DOWN from block duration. Flashes red/pulses when expired. Does NOT auto-advance — coach taps Next.
      - **Stopwatch mode (⏱ count-up):** Counts UP from 0:00. Shows elapsed time for the current drill. Useful when coach wants to see how long a drill actually takes without a preset limit.
    - Small mode indicator next to time: "⬇ Timer" or "⬆ Stopwatch" — tap to toggle
    - Implement `togglePracticeTimer()` — start/pause for both modes
    - Implement `updatePracticeTimer()` — requestAnimationFrame, direction based on mode
    - Implement `resetPracticeTimer()` — resets on block advance
    - State additions: add `practiceTimerMode: 'timer'` ('timer' | 'stopwatch') to state
    - Persist timer mode preference to localStorage (`playbook:practiceTimerMode`)
    - Visual states:
      - Timer running: green text
      - Timer paused: yellow text  
      - Timer expired (countdown hit 0): red pulsing text, stays at 0:00
      - Stopwatch running: blue text
      - Stopwatch paused: yellow text
    - When advancing to next block: timer auto-resets to new block's duration (timer mode) or 0:00 (stopwatch mode)
    - Pause button (⏸/▶) in the nav bar controls both timer and stopwatch

13. **Linked play interaction in run view**
    - Tappable play name chips → call `selectPlay()` to load play in main viewer
    - Works behind the panel (coach can peek)

### Phase 5: Custom Drills

14. **Custom drill creation**
    - Implement `renderCustomDrillForm()` — name, category, duration, description
    - Implement `saveCustomDrill()` — persist to localStorage, add to DRILLS array
    - Show custom drills in picker with a ✨ badge

### Phase 6: CSS

15. **Add all CSS to `style.css`**
    - Practice panel specific styles (`.practice-panel`, `.pp-*`)
    - Time usage bar (`.pp-time-bar`, `.pp-time-fill`)
    - Block cards (`.pp-block`, `.pp-block.expanded`, `.pp-block-header`)
    - Drill picker (`.pp-drill-picker`, `.pp-drill-card`)
    - Run view (`.pp-run-drill-name`, `.pp-run-timer`, `.pp-run-points`)
    - Progress dots (`.pp-progress-dots`, `.pp-dot`, `.pp-dot.current`, `.pp-dot.done`)
    - Template picker cards
    - Custom drill form
    - Play linker chips
    - Sunlight mode overrides for all above

### Phase 7: Polish & Test

16. **Verify all flows**
    - Create plan from template
    - Add/remove/reorder blocks
    - Set custom times
    - Add notes
    - Link plays to play-walkthrough blocks
    - Save/load/duplicate/delete plans
    - Run view navigation
    - Timer functionality
    - Linked play tap opens play viewer
    - Custom drill creation
    - Sunlight mode rendering
    - Coach mode vs Prep mode behavior

17. **Deploy**
    - `git add -A && git commit -m "feat: Practice Plan Builder — replaces warmups panel" && git push`

---

## 8. File Changes Summary

| File | Action | What Changes |
|------|--------|-------------|
| `modules/drills.js` | **CREATE** | 24 drill definitions, category metadata, 3 templates (~300 lines) |
| `modules/practice.js` | **CREATE** | Full practice planner module (~450 lines) |
| `modules/warmups.js` | **DELETE** | Replaced entirely by practice.js |
| `modules/state.js` | **MODIFY** | Add 6 state fields + 6 persistence functions (~40 lines) |
| `index.html` | **MODIFY** | Replace warmups HTML with practice HTML, rename button (~50 line change) |
| `app.js` | **MODIFY** | Replace warmups import/init with practice (~8 line change) |
| `style.css` | **MODIFY** | Remove warmups CSS (~100 lines), add practice CSS (~300 lines) |

### CSS Class Naming Convention

All new classes use the `pp-` prefix:

```
.practice-panel        — Panel modifier (extends .side-panel)
.pp-plan-header        — Plan name + duration row
.pp-time-bar           — Time usage progress bar container
.pp-time-fill          — Fill element inside time bar
.pp-time-label         — "Used: 52 / 75 min" text
.pp-duration-pills     — Duration quick-select pills container
.pp-duration-pill      — Individual 60/75/90 pill
.pp-duration-pill.active
.pp-blocks             — Block cards container
.pp-block              — Individual block card
.pp-block.expanded     — Expanded state
.pp-block-header       — Block header (number, name, time, category tag)
.pp-block-num          — Block number circle
.pp-block-name         — Drill name
.pp-block-time         — Time display
.pp-block-cat          — Category emoji + label tag
.pp-block-note-preview — Note preview line
.pp-block-detail       — Expanded detail area
.pp-time-stepper       — Time +/- controls
.pp-step-btn           — Stepper +/- button (reuse .gd-step-btn sizing)
.pp-notes-input        — Note text area
.pp-block-points       — Coaching points list in detail
.pp-block-actions      — Move up/down/remove buttons
.pp-add-drill-btn      — "+ Add Drill" button between blocks
.pp-drill-picker       — Drill picker overlay container
.pp-drill-picker-header — Back button + title
.pp-drill-card         — Drill card in picker (tappable)
.pp-drill-card-name    — Drill name in picker
.pp-drill-card-meta    — Duration + category tag in picker
.pp-drill-card-desc    — Description preview
.pp-custom-drill-btn   — "+ Create Custom Drill" button
.pp-custom-form        — Custom drill creation form
.pp-run-view           — Run view container
.pp-run-drill-name     — BIG current drill name
.pp-run-timer          — Timer display (large)
.pp-run-timer.expired  — Timer expired state (red flash)
.pp-run-points         — Coaching points card in run
.pp-run-setup          — Setup instructions (collapsible)
.pp-run-note           — Coach note display
.pp-run-nav            — Prev/Pause/Next bar
.pp-run-nav-btn        — Navigation buttons
.pp-run-nav-btn.pause  — Pause/Resume toggle
.pp-progress-dots      — Progress indicator container
.pp-dot                — Individual dot
.pp-dot.done           — Completed block
.pp-dot.current        — Current block (ring/pulse)
.pp-progress-label     — "2/7 blocks · 52 min remaining"
.pp-templates          — Template picker container
.pp-template-card      — Template option card
.pp-template-name      — Template name
.pp-template-drills    — Preview of drills in template
.pp-saved-plans        — Saved plans list section
.pp-saved-plan-row     — Individual saved plan row
.pp-saved-plan-name    — Plan name
.pp-saved-plan-meta    — Duration + date info
.pp-action-bar         — Bottom action bar (Save/Duplicate/Delete)
.pp-action-btn         — Action buttons in bar
.pp-action-btn.primary — "Run This Plan" green CTA
.pp-play-chips         — Linked play chips container
.pp-play-chip          — Individual play chip
.pp-play-chip-remove   — ✕ remove button on chip
.pp-play-selector      — Play selector list for linking
.pp-play-option        — Play option row in selector
.pp-complete           — Practice complete celebration screen
```

### Template Definitions

```js
export const TEMPLATES = [
  {
    id: 'template-a',
    name: 'Template A: Evasion + Defense',
    emoji: '🅰️',
    totalMinutes: 75,
    drills: [
      { drillId: 'dynamic-warmup', duration: 7 },
      { drillId: 'mirror-dodge', duration: 5 },
      { drillId: 'gauntlet-run', duration: 8 },
      { drillId: '1v1-open-field', duration: 5 },
      { drillId: 'shark-eyes', duration: 5 },
      { drillId: 'zone-drop-break', duration: 8 },
      { drillId: 'route-and-look', duration: 8 },
      { drillId: 'scrimmage', duration: 10 },
      { drillId: 'cool-down', duration: 5 },
    ],
  },
  {
    id: 'template-b',
    name: 'Template B: Passing + Receiving',
    emoji: '🅱️',
    totalMinutes: 75,
    drills: [
      { drillId: 'dynamic-warmup', duration: 7 },
      { drillId: 'quick-hands-triangle', duration: 5 },
      { drillId: 'route-and-look', duration: 8 },
      { drillId: 'moving-target', duration: 5 },
      { drillId: 'target-ladder', duration: 5 },
      { drillId: 'angle-pursuit', duration: 5 },
      { drillId: 'mirror-dodge', duration: 5 },
      { drillId: 'scrimmage', duration: 12 },
      { drillId: 'cool-down', duration: 5 },
    ],
  },
  {
    id: 'template-c',
    name: 'Template C: Game Prep',
    emoji: '🅲️',
    totalMinutes: 75,
    drills: [
      { drillId: 'dynamic-warmup', duration: 7 },
      { drillId: 'mirror-dodge', duration: 5 },
      { drillId: 'play-walkthrough', duration: 15, linkedPlays: [] },
      { drillId: 'zone-drop-break', duration: 8 },
      { drillId: 'scrimmage', duration: 20 },
      { drillId: 'cool-down', duration: 5 },
    ],
  },
];
```

### Mobile-First Design Principles Applied

1. **No drag-and-drop** — Up/Down arrow buttons for reordering (reliable on touch)
2. **Stepper buttons for time** — No keyboard typing required for duration changes
3. **Min touch target: 44px** (per Apple HIG), run view nav buttons: 56px
4. **Category pills** for filtering (not dropdown menus)
5. **Tap to expand/collapse** block cards (accordion pattern)
6. **Large text in Run View** — drill name 24px, timer 32px (readable in sunlight)
7. **Progress dots** — instant visual position without reading text
8. **No horizontal scrolling** in block list — vertical stack only
9. **Panel auto-height** — scrollable content, fixed header/footer
10. **Sunlight mode** — all new components have explicit sunlight overrides (higher contrast, thicker borders)

---

*End of spec. A developer agent can implement this without asking questions.*
