// plays.js — 44 flag football plays (25 base + 5 double-back + 5 2-back + 3 exotic + 6 new concept plays)
// Coordinates: X = 0-35 (sideline to sideline), Y = negative behind LOS, positive downfield
// LOS is at Y=0

const PLAYERS = {
  'Braelyn':  { color: '#1a1a1a', role: 'QB',     border: '#ffffff' },
  'Lenox':    { color: '#8b5cf6', role: 'Center' },
  'Greyson':  { color: '#dc2626', role: 'WR/RB' },
  'Marshall': { color: '#f59e0b', role: 'WR/RB' },  // Yellow - TALL, 2nd QB
  'Cooper':   { color: '#2dd4bf', role: 'WR/RB' },
  'Jordy':    { color: '#2563eb', role: 'Sub' },
  'Zeke':     { color: '#ff6600', role: 'Sub' },
  'Mason':    { color: '#22c55e', role: 'RB/Decoy' },
};

const PLAYS = [
  // ── 1. MESH ────────────────────────────────────────────────────────────
  {
    name: 'Mesh',
    formation: 'Spread',
    tags: ["core","nrz"],
    family: 'mesh',
    fake:   "Looks like a crossing route RIGHT — QB eyes locked on Marshall going right",
    target: "Greyson crossing LEFT — defenders follow QB eyes, Greyson pops free on opposite cross",
    whenToUse: [
      'Man coverage — crossing creates natural picks',
      'Need a quick, safe completion',
      'Defense is tight on outside routes'
    ],
    notes: 'SUB: Jordy can replace Cooper at RB (flat)',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall crossing RIGHT → 🏈 Throw to Greyson crossing LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[22, 3], [27, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 5], [32, 5]], label: 'MESH', read: 1, dashed: false },
      Marshall: { pos: [24, -1],    route: [[24, 6], [3, 6]], label: 'MESH', read: 2, dashed: false,
                  motion: { from: [31, -1], to: [24, -1] } },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [6, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 5], [17.5, 8], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.5, 2: 2.0, 3: 3.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.5, type: 'throw' },
    ],
  },

  // ── 2. FLOOD FAKE (replaces Quick Out) ──────────────────────────────────
  // MIRROR OF: Flood Right — identical formation + first 1 sec, then Cooper burns deep
  {
    name: 'Flood Fake',
    formation: 'Twins Right',
    tags: [],
    family: 'flood',
    fake:   "Looks EXACTLY like Flood Right — same formation, same Twins Right alignment, same QB eye set toward corner",
    target: "Cooper deep post LEFT — defense cheats hard right covering the corner, entire left side opens",
    whenToUse: [
      'After running Flood Right 2-3 times — defense cheats right',
      'Need a big play — Cooper deep post',
      'Defense is jumping the flat/corner combo'
    ],
    notes: 'LOOKS LIKE Flood Right for 1 sec! Cooper fakes flat then burns deep. MIRROR PLAY.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Stare at Greyson on corner RIGHT → 🏈 Throw to Cooper on deep post LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [27, 0],    route: [[27, 6], [33, 16]], label: 'CORNER', read: 2, dashed: false },
      Marshall: { pos: [32, 0],    route: [[32, 8], [34, 8]], label: 'OUT', read: 3, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[22, -2], [30, 1], [25, 6], [17.5, 14]], label: 'POST!', read: 1, dashed: false },
    },
    defense: [[8, 7], [17, 7], [26, 5], [10, 14], [28, 12]],
    timing: { 1: 2.0, 2: 1.0, 3: 2.5, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 2.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: 16, text: '★ WIDE OPEN\nDEFENSE CHEATED RIGHT', color: '#2dd4bf' },
    ],
  },

  // ── 3. FLOOD RIGHT ─────────────────────────────────────────────────────
  {
    name: 'Flood Right',
    formation: 'Twins Right',
    tags: ["core"],
    family: 'flood',
    fake:   "Looks like a quick out to Marshall — QB stares at Marshall on the short out route",
    target: "Greyson deep corner — Marshall freezes the flat defender, corner route breaks open behind him",
    whenToUse: [
      '1st down — safe, high-percentage',
      'Zone defense — 3 levels beat zone',
      'Need to move the chains'
    ],
    notes: 'SUB: Jordy can replace Cooper at RB (flat)',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall on out RIGHT → 🏈 Throw to Greyson on corner DEEP' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [27, 0],    route: [[27, 6], [33, 16]], label: 'CORNER', read: 1, dashed: false },
      Marshall: { pos: [32, 0],    route: [[32, 8], [34, 8]], label: 'OUT', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[22, -2], [32, 2]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[8, 7], [17, 7], [26, 5], [10, 14], [28, 12]],
    timing: { 1: 1.0, 2: 2.0, 3: 3.5, 4: 4.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.0, type: 'throw' },
    ],
  },

  // ── 4. REVERSE ─────────────────────────────────────────────────────────
  {
    name: 'Reverse',
    formation: 'Spread',
    tags: ["extended"],
    family: 'misdirection',
    fake:   "Looks like a run right — Braelyn fake handoff to Marshall going right, everyone flows right",
    target: "Greyson taking reverse left — defense crashes right on fake, entire left edge vacated",
    whenToUse: [
      'Defense is crashing to one side',
      "They're keying on receivers — trick them",
      'Need a big misdirection play'
    ],
    notes: 'SUB: Jordy can replace Cooper (decoy WR2). RUN PLAY — no read progression.',
    isRunPlay: true,
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[21, -4]], label: 'HANDOFF', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: 'CHECK', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],    route: [[31, 18]], label: 'GO (decoy)', read: 0, dashed: false },
      Marshall: { pos: [17.5, -5.5], route: [[21, -4], [26, -3.5]], label: 'RUN RIGHT', read: 0, dashed: true },
      Greyson:  { pos: [26, -1],     route: [[20, -3], [15, -5], [10, -4], [5, -2], [2, 2], [1, 8], [2, 18]],
                  label: 'REVERSE!', read: 0, dashed: false,
                  motion: { from: [4, -1], to: [26, -1] } },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [7, 12], [28, 12]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 0.5, type: 'handoff' },
      { from: 'Marshall', to: 'Greyson', time: 1.5, type: 'lateral' },
    ],
    specialLabels: [
      { x: 15, y: -5, text: 'PITCH', color: '#ff6600' },
      { x: 3, y: 19, text: '★ BALL CARRIER', color: '#dc2626' },
    ],
  },

  // ── 5. RPO SLANT ───────────────────────────────────────────────────────
  {
    name: 'RPO Slant',
    formation: 'Spread',
    tags: ["core"],
    family: 'rpo',
    fake:   "Looks like a run — Marshall in backfield, Braelyn at mesh point for live handoff read",
    target: "Greyson slant — linebackers step up for run, vacate slant window behind them",
    whenToUse: [
      'Want Braelyn to have a run option',
      'Defense is predictable — make them guess',
      'Mix up the look — run AND pass threat'
    ],
    notes: 'SUB: Zeke can play RB here when ahead',
    qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Glance at Cooper clearing RIGHT → 🏈 Throw to Greyson slant (or hand to Marshall run)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[19, -4]], label: '', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: 'CHECK', read: 2, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 2], [14, 7]], label: 'SLANT', read: 1, dashed: false },
      Cooper:   { pos: [31, 0],    route: [[31, 14]], label: 'GO (clear)', read: 0, dashed: false },
      Marshall: { pos: [17.5, -5.5], route: [[19, -4], [26, -1]], label: 'RUN?', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 6], [25, 5], [7, 12], [28, 12]],
    timing: { 1: 1.0, 2: 2.0, 3: 3.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 27, y: 1, text: 'OPT 1: RUN', color: '#f59e0b' },
      { x: 10, y: 10, text: 'OPT 2: SLANT or\nBRAELYN RUNS', color: '#2dd4bf' },
      { x: 26, y: -1, text: 'PITCH BACK', color: '#ff6600' },
    ],
  },

  // ── 6. QUICK SLANTS NRZ ────────────────────────────────────────────────
  {
    name: 'Quick Slants NRZ',
    formation: 'Spread',
    tags: ["extended","nrz"],
    family: 'nrz',
    fake:   "Looks like a pass to Marshall slanting right — QB eye lock right",
    target: "Greyson slanting left — defender bites on QB eyes, opposite slant opens immediately",
    showNRZ: true,
    whenToUse: [
      'NO-RUN ZONE — must pass!',
      'Near midfield or goal line (5yd out)',
      'Need the fastest possible throw'
    ],
    notes: 'SUB: Jordy can replace Cooper at RB (flat)',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall slanting RIGHT → 🏈 Quick throw to Greyson slanting LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 2], [12, 5]], label: 'SLANT', read: 1, dashed: false },
      Marshall: { pos: [31, 0],    route: [[31, 2], [23, 5]], label: 'SLANT', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [28, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 4], [17.5, 6], [25, 4], [8, 9], [27, 9]],
    timing: { 1: 0.8, 2: 1.0, 3: 2.0, 4: 3.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.8, type: 'throw' },
    ],
  },

  // ── 7. FLAT-WHEEL ──────────────────────────────────────────────────────
  {
    name: 'Flat-Wheel',
    formation: 'RB Offset Right',
    tags: ["extended"],
    family: 'nrz',
    fake:   "Looks like a flat pass to Cooper right — QB locks eyes on Cooper releasing to flat",
    target: "Marshall wheeling deep up sideline — corner abandons deep to cover flat, wheel goes untouched",
    showNRZ: true,
    whenToUse: [
      'Need a BIG play — deep shot',
      'Goal line — wheel beats flat coverage',
      'Defense is sitting on short stuff'
    ],
    notes: 'SUB: Zeke can replace Cooper (flat decoy) when ahead',
    qbLook: { eyes: 'Cooper', throw: 'Marshall', tip: '👀 Stare at Cooper flat RIGHT → 🏈 Throw to Marshall wheeling DEEP up sideline' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 2], [12, 6]], label: 'SLANT', read: 2, dashed: false },
      Marshall: { pos: [31, 0],    route: [[33, 2], [33, 8], [33, 16]], label: 'WHEEL!', read: 1, dashed: false,
                  fakeSegment: [[31, 0], [33, 2]] },
      Cooper:   { pos: [22, -5],     route: [[22, -2], [32, 2]], label: 'FLAT (decoy)', read: 3, dashed: false },
    },
    defense: [[10, 3], [17.5, 5], [25, 3], [6, 10], [29, 10]],
    timing: { 1: 2.0, 2: 1.5, 3: 1.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 2.0, type: 'throw' },
    ],
  },

  // ── 8. BRAELYN LATERAL ─────────────────────────────────────────────────
  {
    name: 'Braelyn Lateral',
    formation: 'Spread (Marshall offset)',
    tags: ["extended"],
    family: 'quick',
    fake:   "Looks like a normal pass play — defense keys Braelyn as QB, assigns pass coverage",
    target: "Braelyn becomes a RECEIVER — nobody covers the QB going out for a pass because it never happens",
    whenToUse: [
      'Surprise play — Braelyn becomes a RECEIVER',
      'Defense keying on Braelyn as passer all game',
      'Need a mismatch — nobody expects QB to run a route'
    ],
    notes: '⚠ RUSH IS LIVE after lateral — ball out in 1.5 sec! TRICK PLAY — max 2-3x per game.',
    qbLook: { eyes: 'Cooper', throw: 'Braelyn', tip: '👀 Marshall: stare at Cooper go RIGHT → 🏈 Throw to Braelyn on flat (she is your receiver!)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -3], [20, -2], [25, 4]], label: 'FLAT', read: 1, dashed: false,
                  lateralTo: [22, -5] },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 3], [14, 8]], label: 'SLANT', read: 2, dashed: false },
      Cooper:   { pos: [31, 0],    route: [[31, 18]], label: 'GO (clear)', read: 3, dashed: false },
      Marshall: { pos: [22, -5],     route: [], label: '2nd QB — THROW', read: 0, dashed: false },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [7, 13], [28, 13]],
    timing: { 1: 1.5, 2: 2.0, 3: 3.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 0.5, type: 'lateral' },
      { from: 'Marshall', to: 'Braelyn', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: -3, text: 'LATERAL', color: '#ff6600', toX: 22, toY: -5 },
    ],
  },

  // ── 9. FLOOD LEFT ──────────────────────────────────────────────────────
  {
    name: 'Flood Left',
    formation: 'Twins Left',
    tags: [],
    family: 'flood',
    fake:   "Looks like a quick out to Marshall left — QB stares at Marshall on the short out",
    target: "Greyson deep corner left — defense cheated right all game, left corner breaks wide open",
    whenToUse: [
      'Defense overplays RIGHT side',
      'Mirror of Flood Right — keep them guessing',
      'Zone defense — 3 levels beat zone'
    ],
    notes: 'SUB: Jordy can replace Cooper at RB (flat)',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall out LEFT → 🏈 Throw to Greyson corner DEEP LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [8, 0],     route: [[8, 6], [2, 16]], label: 'CORNER', read: 1, dashed: false },
      Marshall: { pos: [3, 0],     route: [[3, 8], [1, 8]], label: 'OUT', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[13, -2], [3, 2]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[8, 5], [17, 7], [27, 7], [7, 12], [25, 14]],
    timing: { 1: 1.0, 2: 2.0, 3: 3.5, 4: 4.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.0, type: 'throw' },
    ],
  },

  // ── 10. HITCH & GO ─────────────────────────────────────────────────────
  {
    name: 'Hitch & Go',
    formation: 'Spread',
    tags: [],
    family: 'shot',
    fake:   "Looks like a hitch route — Greyson takes 3 steps, hesitates, DB's eyes light up and he bites",
    target: "Greyson burning deep — DB's momentum carries him toward LOS, Greyson's already gone",
    whenToUse: [
      'Defense jumping short routes all game',
      'Counter after running Quick Out / Mesh',
      'Need a deep shot — DB bites on fake hitch'
    ],
    notes: 'Greyson fakes hitch then explodes deep. Marshall motions in for hitch. No subs on WR1.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall hitch → 🏈 Throw to Greyson burning DEEP (fake hitch then go!)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[22, 3], [28, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 5], [4, 4], [3.5, 3.5], [4, 4], [4, 5], [4, 20]], label: 'GO!', read: 1, dashed: false,
                  fakeSegment: [[4, 0], [4, 5]], fakeLabel: 'FAKE HITCH' },
      Marshall: { pos: [11, -1],    route: [[11, 5]], label: 'HITCH', read: 2, dashed: false,
                  motion: { from: [31, -1], to: [11, -1] } },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [6, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 4], [17.5, 7], [25, 4], [8, 12], [27, 12]],
    timing: { 1: 3.0, 2: 1.5, 3: 2.5, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 3.0, type: 'throw' },
    ],
  },

  // ── 11. SCREEN ─────────────────────────────────────────────────────────
  {
    name: 'Screen',
    formation: 'Spread',
    tags: ["core"],
    family: 'misdirection',
    fake:   "Looks like a deep pass play — pump fake deep, WRs run full go routes to clear defenders",
    target: "Cooper screen right — rush defense flies past QB, Cooper has open field with nobody between him and the end zone",
    whenToUse: [
      'Aggressive rush — let them fly by, dump underneath',
      'Defense playing tight man — clear them deep',
      'Need yards after catch — RB in space'
    ],
    notes: 'SUB: Jordy can replace Greyson/Marshall as go-route decoy',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Pump fake deep to Greyson → 🏈 Dump short to Cooper on screen RIGHT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'PUMP FAKE', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 2, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 18]], label: 'GO (sell deep)', read: 0, dashed: true },
      Marshall: { pos: [31, 0],    route: [[31, 18]], label: 'GO (sell deep)', read: 0, dashed: true },
      Cooper:   { pos: [24, -4],     route: [[24, -3], [28, -1], [33, 3]], label: 'SCREEN!', read: 1, dashed: false,
                  motion: { from: [17.5, -5.5], to: [24, -4] }, delay: 1.0 },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 19.5, y: -1, text: 'PUMP FAKE', color: '#1a1a1a' },
    ],
  },

  // ── 12. REVERSE FAKE (replaces Drag Cross) ──────────────────────────────
  // MIRROR OF: Reverse — same formation + motion, NO handoff, hit vacated side
  {
    name: 'Reverse Fake',
    formation: 'Spread',
    tags: [],
    family: 'misdirection',
    fake:   "Looks EXACTLY like Reverse — same Cooper motion across formation, same fake handoff pump",
    target: "Greyson slant RIGHT — defense sprints left chasing fake reverse, right side wide open",
    whenToUse: [
      'After running Reverse 1-2 times — defense crashes on motion',
      'Defense chasing Cooper across — leave the other side empty',
      'Need chunk yardage from misdirection'
    ],
    notes: 'LOOKS LIKE Reverse! Same motion. Braelyn pump fakes handoff, hits Greyson slant.',
    qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Pump fake to Cooper (fake reverse) → 🏈 Throw to Greyson slant RIGHT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'PUMP FAKE', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [31, 0],    route: [[31, 3], [23, 8]], label: 'SLANT!', read: 1, dashed: false },
      Marshall: { pos: [17.5, -5.5], route: [[21, -4], [26, -3.5]], label: 'FAKE RUN', read: 0, dashed: true },
      Cooper:   { pos: [26, -1],     route: [[20, -3], [15, -4], [10, -3], [5, 1], [3, 5]],
                  label: 'FAKE REVERSE', read: 2, dashed: true,
                  motion: { from: [4, -1], to: [26, -1] } },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [7, 12], [28, 12]],
    timing: { 1: 1.5, 2: 2.5, 3: 3.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: -5, text: 'FAKE HANDOFF', color: '#ff6600' },
      { x: 23, y: 10, text: '★ DEFENSE CRASHES LEFT\nGREYSON WIDE OPEN RIGHT', color: '#dc2626' },
    ],
  },

  // ── 13. FADE ───────────────────────────────────────────────────────────
  {
    name: 'Fade',
    formation: 'Spread',
    tags: [],
    family: 'shot',
    fake:   "Looks like a slant route to Greyson — QB stares at Greyson setting up inside",
    target: "Marshall fade to back corner — slant look holds inside defender, fade opens to back pylon",
    showNRZ: true,
    whenToUse: [
      'Goal line / NO-RUN ZONE',
      'Need a TD — lob to back corner',
      '50/50 ball to tallest kid (Marshall)'
    ],
    notes: 'Always give fade to Marshall (tallest). No subs on WR1.',
    qbLook: { eyes: 'Greyson', throw: 'Marshall', tip: '👀 Stare at Greyson slant LEFT → 🏈 Lob to Marshall fading DEEP RIGHT corner' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Marshall: { pos: [31, 0],    route: [[33, 5], [34, 14]], label: 'FADE!', read: 1, dashed: false },
      Greyson:  { pos: [4, 0],     route: [[4, 2], [12, 6]], label: 'SLANT', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [28, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 4], [17.5, 6], [25, 4], [8, 9], [27, 9]],
    timing: { 1: 2.0, 2: 1.5, 3: 2.5, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 2.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 34, y: 16, text: '★ TALLEST KID\nBACK CORNER', color: '#f59e0b' },
    ],
  },

  // ── 14. MESH WHEEL ─────────────────────────────────────────────────────
  // MIRROR OF: Mesh — same motion from Cooper, but Cooper wheels deep instead of crossing
  {
    name: 'Mesh Wheel',
    formation: 'Spread',
    tags: [],
    family: 'mesh',
    fake:   "Looks EXACTLY like Mesh — same Cooper motion from right, same crossing action from Greyson",
    target: "Cooper wheel deep up sideline — DB bites inside expecting the cross, Cooper turns it upfield untouched",
    whenToUse: [
      'After running Mesh 2-3 times — DB expects crossing route',
      'Defense jumping the mesh crossing — Cooper fakes cross, wheels deep',
      'Need a big play off a familiar look'
    ],
    notes: 'LOOKS LIKE Mesh! Cooper fakes the cross, wheels up sideline. DB bites inside = TD.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Stare at Greyson crossing (mesh) → 🏈 Throw to Cooper wheeling DEEP up sideline' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[22, 3], [27, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 5], [32, 5]], label: 'MESH', read: 2, dashed: false },
      Cooper:   { pos: [24, -1],    route: [[24, 3], [22, 4], [23, 5], [24, 6], [26, 10], [27, 16]], label: 'WHEEL!', read: 1, dashed: false,
                  motion: { from: [31, -1], to: [24, -1] } },
      Marshall: { pos: [17.5, -5.5], route: [[17.5, -3.5], [6, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 5], [17.5, 8], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.5, 2: 1.5, 3: 3.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 22, y: 4, text: 'FAKE CROSS', color: '#2dd4bf' },
      { x: 27, y: 17, text: '★ DB BITES INSIDE\nCOOPER GONE', color: '#2dd4bf' },
    ],
  },

  // ── 15. SLANT & GO ─────────────────────────────────────────────────────
  // MIRROR OF: Quick Slants NRZ — same formation, Greyson fakes slant then goes deep
  {
    name: 'Slant & Go',
    formation: 'Spread',
    tags: [],
    family: 'shot',
    fake:   "Looks like Quick Slants NRZ — Greyson takes hard slant angle for 3 yards, DB commits inside",
    target: "Greyson turning the slant into a go route — DB's inside momentum makes him un-catchable going outside",
    whenToUse: [
      'After running Quick Slants — DB jumping the slant inside',
      'Defense cheating inside on slant routes',
      'Need a deep shot from a familiar look'
    ],
    notes: 'LOOKS LIKE Quick Slants! Greyson fakes slant at 3yd then explodes deep outside. COUNTER PLAY.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall slant RIGHT → 🏈 Throw to Greyson going DEEP LEFT (fake slant then go!)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 2], [8, 3], [6, 4], [4, 5], [2, 10], [1, 16]], label: 'GO!', read: 1, dashed: false },
      Marshall: { pos: [31, 0],    route: [[31, 2], [23, 5]], label: 'SLANT', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [28, 1]], label: 'FLAT', read: 3, dashed: false },
    },
    defense: [[10, 4], [17.5, 6], [25, 4], [8, 9], [27, 9]],
    timing: { 1: 2.5, 2: 1.0, 3: 2.0, 4: 3.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 8, y: 3, text: 'FAKE SLANT', color: '#dc2626' },
      { x: 1, y: 17, text: '★ DB BITES SLANT\nGREYSON GONE', color: '#dc2626' },
    ],
  },

  // ── 17. JET SWEEP ──────────────────────────────────────────────────────
  // KEY play for new misdirection offense — Greyson motions L→R, takes handoff, sprints right edge
  {
    name: 'Jet Sweep',
    formation: 'Spread',
    tags: ["core"],
    family: 'counter-jet',
    fake:   "Looks like an inside run — Mason fakes up middle, Marshall pulls safety deep",
    target: "Greyson on right edge — inside fake pulls defenders in, Greyson hits wide-open perimeter",
    isRunPlay: true,
    whenToUse: [
      'KEY misdirection run — new offense',
      'Defense over-pursuing or crashing inside',
      'Greyson speed on right edge — nobody can catch him'
    ],
    notes: 'Greyson motions L→R pre-snap. Mason fakes up middle. Marshall go route pulls safety. SPRINT to edge.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -2]], label: 'HANDOFF', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: '', read: 0, dashed: true },
      Greyson:  { pos: [21, -2],   route: [[26, -1], [33, 2], [35, 10]], label: 'JET SWEEP!', read: 0, dashed: false,
                  motion: { from: [4, -1], to: [21, -2] } },
      Marshall: { pos: [3, 0],     route: [[3, 18]], label: 'GO (pull safety)', read: 0, dashed: false },
      Mason:    { pos: [21, -6],   route: [[17.5, -3], [17.5, 5]], label: 'FAKE RB', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.5, type: 'handoff' },
    ],
    specialLabels: [
      { x: 17.5, y: 4, text: 'FAKE UP MIDDLE', color: '#22c55e' },
      { x: 35, y: 11, text: '★ GREYSON\nRIGHT EDGE', color: '#dc2626' },
    ],
  },

  // ── 18. RB DRAW ────────────────────────────────────────────────────────
  // Misdirection run: everything looks like pass, middle vacated, Greyson delayed handoff
  {
    name: 'RB Draw',
    formation: 'Spread',
    tags: [],
    family: 'misdirection',
    fake:   "Looks like a deep pass play — Braelyn full drop-back, WRs sprint go routes, everyone sells pass",
    target: "Greyson delayed draw up middle — pass rush over-commits hard, entire middle lane vacated",
    isRunPlay: true,
    whenToUse: [
      'Defense in all-out pass rush — nobody home in middle',
      'Everything looks like a pass → middle vacated',
      'Counter after throwing a lot — make them pay for rushing'
    ],
    notes: 'Braelyn FAKES drop-back pass. Marshall + Cooper sell go routes. Greyson DELAYED handoff up middle.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[17.5, -6]], label: 'FAKE PASS', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [21, -5],   route: [[18, -3], [17.5, 2], [17.5, 12]], label: 'DRAW!', read: 0, dashed: false, delay: 1.5 },
      Marshall: { pos: [3, 0],     route: [[3, 18]], label: 'GO (sell pass)', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],    route: [[31, 18]], label: 'GO (sell pass)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.5, type: 'handoff' },
    ],
    specialLabels: [
      { x: 17.5, y: -7, text: 'FAKE DROP BACK', color: '#1a1a1a' },
      { x: 17.5, y: 13, text: '★ MIDDLE VACATED\nGREYSON UNTOUCHED', color: '#f59e0b' },
    ],
  },

  // ── 19. END AROUND ─────────────────────────────────────────────────────
  // Cooper motions behind QB pre-snap, takes handoff, runs right edge
  {
    name: 'End Around',
    formation: 'Spread',
    tags: [],
    family: 'misdirection',
    fake:   "Looks like a run or pass going left — Cooper and Marshall both take steps toward left side",
    target: "Greyson end around right edge — defense follows fake left flow, entire right perimeter opens",
    isRunPlay: true,
    whenToUse: [
      'Defense over-pursues left side',
      'Counter after running Reverse — keeps defense honest',
      "Greyson is fastest — get him the ball on the edge"
    ],
    notes: 'Greyson motions from right BEHIND QB pre-snap. Marshall + Cooper sell fake LEFT. Greyson takes handoff RIGHT edge.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -4]], label: 'HANDOFF', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [[23, 3], [28, 5]], label: '', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],    route: [[31, 5], [25, 2]], label: 'FAKE LEFT', read: 0, dashed: true },
      Marshall: { pos: [3, 0],     route: [[3, 5], [8, 2]], label: 'FAKE LEFT', read: 0, dashed: true },
      Greyson:  { pos: [20, -4],   route: [[26, -3], [33, -1], [35, 5], [34, 14]], label: 'END AROUND!', read: 0, dashed: false,
                  motion: { from: [31, -1], to: [20, -4] } },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.5, type: 'handoff' },
    ],
    specialLabels: [
      { x: 3, y: 7, text: 'FAKE LEFT', color: '#ff6600' },
      { x: 34, y: 16, text: '★ GREYSON\nRIGHT EDGE', color: '#dc2626' },
    ],
  },

  // ── 20. RPO FLOOD ──────────────────────────────────────────────────────
  // Run-pass option: Greyson run right OR keep/throw flood (Marshall corner, Cooper out)
  {
    name: 'RPO Flood',
    formation: 'Twins Right',
    tags: [],
    family: 'rpo',
    fake:   "Looks like a run right — Greyson in sweep path, Braelyn at mesh point ready to give",
    target: "Live read: give Greyson run if edge open, OR keep and throw Marshall corner — defense is wrong either way",
    whenToUse: [
      'Run OR pass — force defense to choose',
      'Zone defense — flood combination beats zone',
      'Want Braelyn making live reads at the mesh point'
    ],
    notes: 'OPT 1: Give to Greyson → run right. OPT 2: Keep → read Flood. Marshall corner deep, Cooper out mid.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Read: hand to Greyson if edge open → 🏈 OR keep and throw Marshall corner DEEP' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [22, -5],   route: [[26, -3], [33, 0], [35, 8]], label: 'RUN RIGHT', read: 0, dashed: false },
      Marshall: { pos: [27, 0],    route: [[27, 6], [33, 16]], label: 'CORNER', read: 1, dashed: false },
      Cooper:   { pos: [33, 0],    route: [[33, 5], [35, 5]], label: 'OUT', read: 2, dashed: false },
    },
    defense: [[8, 7], [17, 7], [26, 5], [10, 14], [28, 12]],
    timing: { 1: 1.0, 2: 2.0, 3: 3.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.3, type: 'handoff' },
    ],
    specialLabels: [
      { x: 33, y: 9, text: 'OPT 1: GIVE\nGREYSON RUN', color: '#dc2626' },
      { x: 33, y: 17, text: 'OPT 2: KEEP\nMARSHALL CORNER', color: '#f59e0b' },
      { x: 35, y: 6, text: 'OPT 3: COOPER OUT', color: '#2dd4bf' },
    ],
  },

  // ── 21. TRIPLE OPTION ──────────────────────────────────────────────────
  // Max flexibility: run right → lateral back → pass Cooper deep or Marshall out
  {
    name: 'Triple Option',
    formation: 'Spread',
    tags: [],
    family: 'rpo',
    fake:   "Looks like a run right — Greyson in sweep path forces defense to commit to run or pass",
    target: "Three answers: Greyson run, Marshall deep, or Cooper out — defense must be wrong because one is always open",
    whenToUse: [
      'Maximum flexibility — 3 answers on every snap',
      'Defense is guessing — make them wrong every time',
      'Greyson healthy and fast for perimeter threat'
    ],
    notes: 'OPT 1: Greyson run right. If stopped → lateral back to Braelyn. OPT 2: Marshall go deep. OPT 3: Cooper out 8yd.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Read edge: hand to Greyson RIGHT if open → 🏈 OR keep, throw Marshall deep' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[14, -2], [10, -2]], label: 'READS', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [22, -5],   route: [[26, -3], [33, 0], [35, 8]], label: 'RUN RIGHT', read: 0, dashed: false },
      Marshall: { pos: [31, 0],    route: [[31, 18]], label: 'GO DEEP', read: 1, dashed: false },
      Cooper:   { pos: [3, 0],     route: [[3, 8], [5, 8]], label: 'OUT 8yd', read: 2, dashed: false },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 0.5, 2: 2.0, 3: 2.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.3, type: 'handoff' },
    ],
    specialLabels: [
      { x: 33, y: 9, text: 'OPT 1: RUN', color: '#dc2626' },
      { x: 10, y: -1, text: 'LATERAL BACK\nIF STOPPED', color: '#ff6600' },
      { x: 31, y: 19, text: 'OPT 2: GO DEEP', color: '#f59e0b' },
      { x: 5, y: 9, text: 'OPT 3: OUT 8yd', color: '#2dd4bf' },
    ],
  },

  // ── 22. BUBBLE SCREEN ──────────────────────────────────────────────────
  // Short pass behind LOS — almost a handoff through the air
  {
    name: 'Bubble Screen',
    formation: 'Spread',
    tags: ["nrz"],
    family: 'quick',
    fake:   "Looks like a deep pass — Greyson and Marshall sprint full go routes to clear all defenders deep",
    target: "Cooper bubble right — defenders sucked deep on go routes, catch behind LOS and run in space",
    whenToUse: [
      'Defense pressing tight coverage — give them the yards',
      'Need a quick gain in space — catch and run',
      "Get Cooper or Greyson the ball immediately with blockers ahead"
    ],
    notes: 'Fastest completion — almost a handoff through air. Cooper catches 2yd behind LOS. Greyson + Marshall clear space.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Glance at Greyson deep LEFT → 🏈 Quick throw to Cooper bubble RIGHT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [4, 0],     route: [[4, 18]], label: 'GO (clear)', read: 0, dashed: true },
      Marshall: { pos: [31, 0],    route: [[31, 10]], label: 'GO (clear)', read: 0, dashed: true },
      Cooper:   { pos: [27, -2],   route: [[27, -2], [32, 2], [34, 8]], label: 'BUBBLE!', read: 1, dashed: false,
                  motion: { from: [33, 0], to: [27, -2] } },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 0.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 0.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 28, y: -3, text: '★ CATCH BEHIND LOS\nRUN IN SPACE', color: '#2dd4bf' },
    ],
  },

  // ── 23. QUICK HITCH ────────────────────────────────────────────────────
  // 3 steps upfield, turn — Braelyn delivers on 1-count
  {
    name: 'Quick Hitch',
    formation: 'Spread',
    tags: ["nrz"],
    family: 'quick',
    fake:   "Looks like a flat pass to Cooper — QB glances right before looking back left",
    target: "Greyson 3-step hitch — safety frozen by flat glance, throw before corner can close",
    whenToUse: [
      'Need a guaranteed completion',
      'Greyson 1-on-1 — 1-count beats any coverage',
      'Short yardage — pick up 5-6 yards quickly'
    ],
    notes: 'Greyson takes 3 steps upfield, TURNS. Braelyn delivers immediately — 1-count throw.',
    qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Glance at Cooper flat → 🏈 Quick throw to Greyson on hitch (3 steps, turn, CATCH)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 5], [4, 4]], label: 'HITCH', read: 1, dashed: false },
      Marshall: { pos: [31, 0],    route: [[31, 14]], label: 'GO (clear)', read: 0, dashed: true },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [28, 1]], label: 'FLAT (clear)', read: 2, dashed: true },
    },
    defense: [[10, 4], [17.5, 6], [25, 4], [8, 9], [27, 9]],
    timing: { 1: 1.0, 2: 2.0, 3: 3.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 4, y: 6, text: '★ 3 STEPS\nTURN & CATCH', color: '#dc2626' },
    ],
  },

  // ── 24. JET BUBBLE ─────────────────────────────────────────────────────
  // LOOKS LIKE Jet Sweep! Greyson motions right, defense chases, ball goes LEFT to Cooper bubble
  {
    name: 'Jet Bubble',
    formation: 'Spread',
    tags: [],
    family: 'counter-jet',
    fake:   "Looks EXACTLY like Jet Sweep — Greyson full speed motion right, defense sprints right with him",
    target: "Cooper bubble LEFT — defense is running right, entire left side wide open on quick screen",
    whenToUse: [
      'After Jet Sweep — defense chasing Greyson motion hard',
      'Defense overcommits to motion side',
      'Misdirection combo — motion right, ball goes LEFT'
    ],
    notes: 'LOOKS LIKE Jet Sweep! Greyson motions L→R. Defense chases RIGHT. Braelyn throws Bubble to Cooper going LEFT.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Stare RIGHT at Greyson jet motion → 🏈 Throw LEFT to Cooper on bubble' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [21, -2],   route: [[26, -1], [33, 2]], label: 'JET FAKE', read: 0, dashed: true,
                  motion: { from: [4, -1], to: [21, -2] } },
      Marshall: { pos: [3, 0],     route: [[3, 14]], label: 'GO (clear)', read: 0, dashed: true },
      Cooper:   { pos: [8, -2],    route: [[8, -2], [3, 2], [1, 8]], label: 'BUBBLE!', read: 1, dashed: false,
                  motion: { from: [14, 0], to: [8, -2] } },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 0.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 0.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 28, y: 3, text: 'DEFENSE\nCHASES RIGHT →', color: '#ff6600' },
      { x: 1, y: 9, text: '★ BALL GOES LEFT\nCOOPER WIDE OPEN', color: '#2dd4bf' },
    ],
  },

  // ── 25. FAKE JET DRAW ──────────────────────────────────────────────────
  // LOOKS LIKE Jet Sweep! Greyson motions + fake handoff, Mason draws up vacated middle
  {
    name: 'Fake Jet Draw',
    formation: 'Spread',
    tags: [],
    family: 'counter-jet',
    fake:   "Looks EXACTLY like Jet Sweep — same Greyson motion, same Braelyn fake handoff at mesh point",
    target: "Mason draw up middle — every defender sprints right chasing Greyson, middle completely empty",
    isRunPlay: true,
    whenToUse: [
      'After Jet Sweep — defense crashes hard on Greyson motion',
      'Middle is wide open — everyone committed to edge',
      'Mason big body sells the delay perfectly'
    ],
    notes: 'LOOKS LIKE Jet Sweep! Greyson motions, Braelyn FAKES handoff. Mason delayed DRAW up middle. Everyone chases Greyson = untouched.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -2]], label: 'FAKE HANDOFF', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [21, -2],   route: [[26, -1], [33, 2]], label: 'FAKE JET!', read: 0, dashed: true,
                  motion: { from: [4, -1], to: [21, -2] },
                  fakeSegment: [[21, -2], [26, -1]] },
      Marshall: { pos: [3, 0],     route: [[3, 14]], label: 'GO (decoy)', read: 0, dashed: true },
      Mason:    { pos: [17.5, -6], route: [[17.5, -3], [17.5, 2], [17.5, 12]], label: 'DRAW!', read: 0, dashed: false, delay: 1.5 },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Mason', time: 1.5, type: 'handoff' },
    ],
    specialLabels: [
      { x: 20, y: -2, text: 'FAKE JET\nHANDOFF', color: '#ff6600' },
      { x: 17.5, y: 13, text: '★ MASON UNTOUCHED\nMIDDLE VACATED', color: '#22c55e' },
    ],
  },

  // ── 26. COUNTER SWEEP ─────────────────────────────────────────────────
  // Double-Back: Marshall fakes LEFT, Greyson takes real handoff RIGHT
  {
    name: 'Counter Sweep',
    formation: 'Double-Back',
    tags: ["extended","2back"],
    family: 'counter-jet',
    fake:   "Looks like a run left — Marshall sells fake hard going left, linebackers follow",
    target: "Greyson right edge — defense bites left on Marshall fake, right edge opens immediately",
    isRunPlay: true,
    whenToUse: [
      'Double-Back base misdirection run',
      'Defense cheating left — hit them right',
      'Sell the fake to Marshall, Greyson hits the vacated edge'
    ],
    notes: 'Marshall SELLS fake going left. Braelyn fakes handoff to Marshall, hands REAL ball to Greyson right. WR decoy clears safety.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[15, -4]], label: 'FAKE + HAND', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[16, -3], [22, -1], [29, 1], [33, 6]], label: 'BALL CARRIER', read: 0, dashed: false },
      Marshall: { pos: [23, -5],     route: [[18, -3], [12, -1], [7, 1]], label: 'FAKE LEFT', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],      route: [[31, 18]], label: 'GO (decoy)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.6, type: 'handoff' },
    ],
    specialLabels: [
      { x: 10, y: 1, text: 'FAKE', color: '#ff6600' },
      { x: 33, y: 7, text: '★ BALL CARRIER\nRIGHT EDGE', color: '#dc2626' },
    ],
  },

  // ── 27. COUNTER LEFT ──────────────────────────────────────────────────
  // Mirror of Counter Sweep — Greyson fakes RIGHT, Marshall takes handoff LEFT
  {
    name: 'Counter Left',
    formation: 'Double-Back',
    tags: ["2back"],
    family: 'counter-jet',
    fake:   "Looks like Counter Sweep going right — Greyson sells fake hard going right",
    target: "Marshall left edge — mirror of Counter Sweep, defense bites right and Marshall has the whole left",
    isRunPlay: true,
    whenToUse: [
      'Defense cheating right — hit them left',
      'Mirror of Counter Sweep — keep defense honest',
      'Marshall as ball carrier going left edge'
    ],
    notes: 'Mirror of Counter Sweep. Greyson SELLS fake going right. Marshall takes REAL handoff going left edge.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -4]], label: 'FAKE + HAND', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[17, -3], [23, -1], [28, 1]], label: 'FAKE RIGHT', read: 0, dashed: true },
      Marshall: { pos: [23, -5],     route: [[19, -3], [13, -1], [6, 1], [2, 6]], label: 'BALL CARRIER', read: 0, dashed: false },
      Cooper:   { pos: [4, 0],       route: [[4, 18]], label: 'GO (decoy)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 0.6, type: 'handoff' },
    ],
    specialLabels: [
      { x: 25, y: 1, text: 'FAKE', color: '#ff6600' },
      { x: 2, y: 7, text: '★ BALL CARRIER\nLEFT EDGE', color: '#f59e0b' },
    ],
  },

  // ── 28. PLAY ACTION BOOT ───────────────────────────────────────────────
  // Double-Back: fake handoff Greyson right, Braelyn boots LEFT, throws Marshall flat
  {
    name: 'Play Action Boot',
    formation: 'Double-Back',
    tags: ["2back"],
    family: 'counter-jet',
    fake:   "Looks EXACTLY like Counter Sweep — full double-back run action to Greyson going right",
    target: "Cooper flat left on bootleg — defense crashes right on run fake, entire boot side opens",
    whenToUse: [
      'After Counter Sweep — defense biting on fake',
      'Double-Back pass off run action',
      'ONE read — Cooper flat on bootleg side. Pre-determined throw.'
    ],
    notes: 'SELL fake to Greyson right. Braelyn rolls out LEFT. Cooper releases to flat on left — ONLY target. Marshall clears with go route. ONE DECISION.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Sell fake handoff to Greyson RIGHT → 🏈 Boot left, throw to Cooper flat LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[20, -4], [15, -2], [8, 2]], label: 'BOOT LEFT', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[18, -3], [24, -1]], label: 'FAKE CARRY', read: 0, dashed: true },
      Cooper:   { pos: [23, -5],     route: [[20, -3], [13, -1], [6, 2], [3, 4]], label: 'FLAT!', read: 1, dashed: false },
      Marshall: { pos: [4, 0],       route: [[4, 18]], label: 'GO (clear)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.4, type: 'handoff', fake: true },
      { from: 'Braelyn', to: 'Cooper', time: 2.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 22, y: -2, text: 'FAKE HANDOFF', color: '#ff6600' },
      { x: 3, y: 5, text: '★ COOPER OPEN\nFLAT ON BOOT SIDE', color: '#2dd4bf' },
    ],
  },

  // ── 29. HOOK & LADDER ─────────────────────────────────────────────────
  // Foundation play: Greyson hook 5-6yd, catch, IMMEDIATE lateral to Marshall
  {
    name: 'Hook & Ladder',
    formation: 'Double-Back',
    tags: ["2back"],
    family: 'misdirection',
    fake:   "Looks like a normal short hook pass to Greyson — 5 yards, routine completion",
    target: "Marshall trailing behind — defense closes hard on Greyson at hook, he immediately laterals to Marshall in open field",
    whenToUse: [
      'Any down — surprise change-of-direction play',
      'Defense closes on Greyson hook — Marshall takes lateral into open field',
      '"Foundation of flag offense" — multiple coaches say this is THE play'
    ],
    notes: 'Greyson runs 5-6yd hook (turns BACK to QB). Braelyn throws immediately. Greyson catches and LATERALS to Marshall trailing behind. NO HESITATION on lateral.',
    qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Look off Cooper deep → 🏈 Throw to Greyson hook (Greyson laterals to Marshall!)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[12, -2], [12, 2], [12, 0]], label: 'CATCH + LATERAL', read: 1, dashed: false },
      Marshall: { pos: [23, -5],     route: [[20, -3], [14, -1], [9, 0], [5, 3], [2, 8]], label: 'OPEN FIELD', read: 0, dashed: false },
      Cooper:   { pos: [31, 0],      route: [[31, 18]], label: 'GO (clear)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.2 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.2, type: 'throw' },
      { from: 'Greyson', to: 'Marshall', time: 1.8, type: 'lateral' },
    ],
    specialLabels: [
      { x: 12, y: 3, text: 'CATCH + LATERAL', color: '#dc2626' },
      { x: 2, y: 9, text: '★ OPEN FIELD\nMARSHALL GONE', color: '#f59e0b' },
    ],
  },

  // ── 30. I-BONE ─────────────────────────────────────────────────────────
  // Stack formation RPO: backs diverge, QB reads which side defense commits
  {
    name: 'I-Bone',
    formation: 'Stack / I-Bone',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks like a run play — both backs stacked in I-formation, defense must pick a gap to fill",
    target: "Whichever back defense ignores — backs split opposite directions, one is always unaccounted for",
    isRunPlay: true,
    whenToUse: [
      'Defense uncertain — make them guess run direction',
      'True RPO — backs split both ways simultaneously',
      'Greyson and Marshall create a binary read for Braelyn'
    ],
    notes: 'Stack formation: Greyson directly behind Braelyn, Marshall behind Greyson. At snap — Greyson RIGHT, Marshall LEFT. Braelyn reads where defense commits, hands to open back. OR throws Cooper slant if both covered.',
    qbLook: { eyes: 'Greyson', throw: 'Greyson', tip: '👀 Read the edge → 🏈 Hand to Greyson RIGHT (or Marshall LEFT, or throw Cooper slant)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'READ + HAND', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [17.5, -5],   route: [[22, -3], [28, -1], [33, 3]], label: 'RIGHT', read: 0, dashed: false },
      Marshall: { pos: [17.5, -8],   route: [[13, -5], [7, -2], [2, 2]], label: 'LEFT', read: 0, dashed: false },
      Cooper:   { pos: [31, 0],      route: [[31, 2], [26, 5]], label: 'SLANT (if covered)', read: 2, dashed: false },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 2: 1.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.4, type: 'handoff' },
    ],
    specialLabels: [
      { x: 33, y: 4, text: 'OPT 1: GREYSON\nD GOES LEFT', color: '#dc2626' },
      { x: 2, y: 3, text: 'OPT 2: MARSHALL\nD GOES RIGHT', color: '#f59e0b' },
      { x: 24, y: 7, text: 'OPT 3: COOPER SLANT\nIF BOTH COVERED', color: '#2dd4bf' },
    ],
  },

  // ── 31. SPEED PITCH ────────────────────────────────────────────────────
  // Double-Back: Quick pitch to Greyson on the edge — the breakaway TD play
  {
    name: 'Speed Pitch',
    formation: 'Double-Back',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks like a run left — Marshall sells hard fake going left, backside defender freezes",
    target: "Greyson speed pitch right edge — fastest ball delivery possible, edge open before defense reacts",
    isRunPlay: true,
    whenToUse: [
      'Need a quick perimeter run — ball out FAST',
      'Defense crashing inside or stacking the middle',
      'Greyson speed advantage on the edge — let him run'
    ],
    notes: 'FASTEST run play. Braelyn catches snap, IMMEDIATE pitch to Greyson going right. Marshall fakes left to hold backside. Cooper clears with go route.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[19, -3]], label: 'PITCH', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[17, -3], [24, -1], [30, 1], [34, 5], [35, 14]], label: 'SPEED!', read: 0, dashed: false },
      Marshall: { pos: [23, -5],     route: [[18, -3], [12, -1], [7, 1]], label: 'FAKE LEFT', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],      route: [[31, 18]], label: 'GO (clear)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.3, type: 'lateral' },
    ],
    specialLabels: [
      { x: 7, y: 1, text: 'FAKE LEFT\nHOLDS BACKSIDE', color: '#ff6600' },
      { x: 35, y: 15, text: '★ GREYSON\nOUTRUNS EVERYONE', color: '#dc2626' },
    ],
  },

  // ── 32. SPLIT SWEEP ───────────────────────────────────────────────────
  // Double-Back: Both backs go RIGHT — Marshall leads as decoy, Greyson follows with ball
  {
    name: 'Split Sweep',
    formation: 'Double-Back',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks like Marshall is the ball carrier — he leads the sweep, defense keys on him first",
    target: "Greyson following 2 yards behind — defense commits to Marshall, Greyson slips into open lane",
    isRunPlay: true,
    whenToUse: [
      'Defense spread out — overwhelm one side with 2 backs',
      'Marshall as lead decoy draws the first defender',
      'Counter after running Counter Sweep — both go same way'
    ],
    notes: 'BOTH backs go right. Marshall leads as first decoy (defense keys on him). Greyson follows 2 yards behind with the ball. WR clears deep.',
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [[19, -4]], label: 'HANDOFF', read: 0, dashed: true },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Marshall: { pos: [23, -5],     route: [[26, -3], [30, -1], [33, 2], [35, 6]], label: 'LEAD (decoy)', read: 0, dashed: true },
      Greyson:  { pos: [12, -5],     route: [[17, -4], [23, -2], [28, 0], [33, 4], [35, 10]], label: 'FOLLOW!', read: 0, dashed: false },
      Cooper:   { pos: [31, 0],      route: [[31, 18]], label: 'GO (clear)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: {},
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.6, type: 'handoff' },
    ],
    specialLabels: [
      { x: 35, y: 7, text: 'MARSHALL DRAWS\nFIRST DEFENDER', color: '#f59e0b' },
      { x: 35, y: 11, text: '★ GREYSON FOLLOWS\nINTO OPEN LANE', color: '#dc2626' },
    ],
  },

  // ── 33. COUNTER PASS ──────────────────────────────────────────────────
  // Double-Back: Fake counter run action, then Braelyn throws deep to WR on post
  {
    name: 'Counter Pass',
    formation: 'Double-Back',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks EXACTLY like Counter Sweep — full double-back run fake, both backs sell the run hard",
    target: "Cooper deep post — defense bites hard on run action, deep middle completely vacated",
    whenToUse: [
      'After running Counter Sweep — defense biting HARD on run fakes',
      'Defense crashes on Greyson run — leaves deep middle open',
      'Need a big play off run-action misdirection'
    ],
    notes: 'LOOKS LIKE Counter Sweep! Both backs fake run action. Defense crashes. Braelyn pulls ball and throws to Cooper on post route. ONE READ.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Sell fake counter to Greyson RIGHT → 🏈 Throw to Cooper deep post MIDDLE' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'FAKE + THROW', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[16, -3], [22, -1], [26, 1]], label: 'FAKE RUN', read: 0, dashed: true },
      Marshall: { pos: [23, -5],     route: [[18, -3], [12, -1]], label: 'FAKE LEFT', read: 0, dashed: true },
      Cooper:   { pos: [31, 0],      route: [[31, 4], [25, 10], [20, 16]], label: 'POST!', read: 1, dashed: false },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 2.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 22, y: 1, text: 'FAKE COUNTER', color: '#ff6600' },
      { x: 20, y: 17, text: '★ COOPER POST\nDEFENSE BIT ON RUN', color: '#2dd4bf' },
    ],
  },

  // ── 34. DUAL WHEEL ────────────────────────────────────────────────────
  // Double-Back: Both backs release into routes — wheel + flat, flood the right side
  {
    name: 'Dual Wheel',
    formation: 'Double-Back',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks like a run play — both backs start in run alignment, defense readies for run",
    target: "Greyson wheel deep up sideline — defense in run-stop mode, backs leak out into pass routes undetected",
    whenToUse: [
      'Defense focused on stopping the run — backs leak out',
      'Flood one side with 2 backs as receivers',
      'Greyson wheel deep + Marshall flat = high-low read'
    ],
    notes: 'Both backs release into pass routes after a count. Greyson swings right and wheels up sideline DEEP. Marshall releases to flat SHORT. High-low read for Braelyn.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall flat SHORT → 🏈 Throw to Greyson wheeling DEEP up sideline' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[12, -3], [16, -1], [24, 1], [29, 4], [32, 8], [33, 16]], label: 'WHEEL!', read: 1, dashed: false },
      Marshall: { pos: [23, -5],     route: [[23, -3], [28, -1], [33, 2]], label: 'FLAT', read: 2, dashed: false },
      Cooper:   { pos: [4, 0],       route: [[4, 18]], label: 'GO (clear left)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.5, 2: 1.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 33, y: 17, text: '★ GREYSON DEEP\nWHEEL UP SIDELINE', color: '#dc2626' },
      { x: 33, y: 3, text: 'MARSHALL FLAT\nSHORT OPTION', color: '#f59e0b' },
    ],
  },

  // ── 35. SPLIT BACK SCREEN ─────────────────────────────────────────────
  // Double-Back: Fake to Greyson going right, screen pass to Marshall behind LOS going left
  {
    name: 'Split Back Screen',
    formation: 'Double-Back',
    tags: ["2back"],
    family: '2back',
    fake:   "Looks like Counter Sweep going right — Greyson sells fake right, defense chases",
    target: "Marshall screen LEFT — opposite direction, defense all wrong side, entire left open for Marshall",
    whenToUse: [
      'Defense over-pursuing Greyson on run plays',
      'Need to get Marshall the ball in space',
      'Counter misdirection — fake right, screen left'
    ],
    notes: 'FAKE handoff to Greyson going right (defense chases). Marshall delays, drifts LEFT behind LOS. Braelyn dumps quick screen. Marshall has the entire left side open.',
    qbLook: { eyes: 'Greyson', throw: 'Marshall', tip: '👀 Fake to Greyson RIGHT → 🏈 Dump to Marshall screen LEFT' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'PUMP + DUMP', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -5],     route: [[16, -3], [22, -1], [28, 1]], label: 'FAKE RUN', read: 0, dashed: true },
      Marshall: { pos: [23, -5],     route: [[20, -5], [14, -4], [8, -2], [4, 2], [2, 8]], label: 'SCREEN!', read: 1, dashed: false, delay: 1.0 },
      Cooper:   { pos: [4, 0],       route: [[4, 14]], label: 'GO (clear)', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 26, y: 1, text: 'DEFENSE CHASES\nGREYSON RIGHT →', color: '#ff6600' },
      { x: 2, y: 9, text: '★ MARSHALL OPEN\nENTIRE LEFT SIDE', color: '#f59e0b' },
    ],
  },

  // ── 16. SCREEN FAKE POST ───────────────────────────────────────────────
  // MIRROR OF: Screen — same formation + pump fake, but instead of dumping short, go deep
  {
    name: 'Screen Fake Post',
    formation: 'Spread',
    tags: [],
    family: 'shot',
    fake:   "Looks EXACTLY like Screen — same pump fake, same Cooper bubble motion, same pre-snap look",
    target: "Greyson deep post — defense crashes screen hard, deep middle completely vacated",
    whenToUse: [
      'After running Screen — defense crashes on Cooper',
      'Defense selling out to stop the screen',
      'Need the big play — Greyson/Marshall wide open deep'
    ],
    notes: 'LOOKS LIKE Screen! Pump fake, but Greyson runs a real post. Defense crashes screen = TD.',
    qbLook: { eyes: 'Cooper', throw: 'Greyson', tip: '👀 Pump fake to Cooper screen → 🏈 Throw to Greyson deep post (defense crashes screen!)' },
    players: {
      Braelyn:  { pos: [17.5, -3],   route: [], label: 'PUMP FAKE', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 6], [12, 14]], label: 'POST!', read: 1, dashed: false },
      Marshall: { pos: [31, 0],    route: [[31, 6], [28, 14]], label: 'POST', read: 2, dashed: false },
      Cooper:   { pos: [24, -4],     route: [[24, -3], [28, -1], [33, 3]], label: 'SCREEN (decoy)', read: 0, dashed: true,
                  motion: { from: [17.5, -5.5], to: [24, -4] }, delay: 1.0 },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.5, 2: 2.5, 3: 3.5, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 19.5, y: -1, text: 'PUMP FAKE\n(sell screen)', color: '#1a1a1a' },
      { x: 12, y: 16, text: '★ DEFENSE CRASHES SCREEN\nGREYSON WIDE OPEN', color: '#dc2626' },
    ],
  },

  // ── 36. WILDCAT ────────────────────────────────────────────────────────
  // Exotic: Direct snap to Greyson. Braelyn splits wide as receiver.
  // Defense has NO idea who the QB is — creates instant scheme confusion.
  {
    name: 'Wildcat',
    formation: 'Wildcat (Direct Snap)',
    tags: ['exotic'],
    family: 'exotic',
    fake:   "Looks like a normal play — defense keys on Braelyn at QB position, assigns coverage based on her",
    target: "GREYSON gets the direct snap and is actually the QB — defense is in wrong assignment when fastest player gets ball",
    whenToUse: [
      "Defense keying on Braelyn — she never gets the snap!",
      'Need to totally surprise the defense pre-snap',
      'Greyson as QB: run right edge OR quick throw to Braelyn flat',
    ],
    notes: '⚠ PRACTICE FIRST! Lenox snaps DIRECTLY to Greyson. Braelyn lines up far right as a RECEIVER. Greyson reads: run right OR dump to Braelyn flat. Defense has zero film on this.',
    qbLook: { eyes: 'Marshall', throw: 'Braelyn', tip: '👀 Greyson: stare deep at Marshall → 🏈 Run right OR dump to Braelyn flat (she is open every time)' },
    players: {
      Braelyn:  { pos: [33, 0],    route: [[33, 3], [34, 7]], label: 'FLAT!', read: 1, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [17.5, -5], route: [[22, -4], [28, -2], [34, 3], [35, 12]], label: 'RUN!', read: 0, dashed: false },
      Marshall: { pos: [4, 0],     route: [[4, 18]], label: 'GO (decoy)', read: 0, dashed: true },
      Cooper:   { pos: [26, 0],    route: [[26, 10]], label: 'CLEAR', read: 0, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.5 },
    ballPath: [
      { from: 'Lenox', to: 'Greyson', time: 0, type: 'snap' },
      { from: 'Greyson', to: 'Braelyn', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: -7, text: '★ GREYSON IS QB!\nDEFENSE CONFUSED', color: '#dc2626' },
      { x: 35, y: 8, text: 'OPT 2: THROW\nBRAELYN FLAT', color: '#2dd4bf' },
    ],
  },

  // ── 37. SWINGING GATE ──────────────────────────────────────────────────
  // Exotic: All 4 skill players cluster LEFT of center. Cooper isolated far RIGHT.
  // Snap quickly before defense adjusts. Cooper is wide open 1-on-1 on empty side.
  {
    name: 'Swinging Gate',
    formation: 'Swinging Gate (Cluster Left)',
    tags: ['exotic'],
    family: 'exotic',
    fake:   "Looks like all action is coming from the left cluster — defense scrambles to align to bunch left",
    target: "Cooper isolated 1-on-1 far right — defense followed the bunch, entire right side abandoned before they can adjust",
    whenToUse: [
      'Defense scrambling to align — snap IMMEDIATELY',
      'Isolate Cooper 1-on-1 on empty right side',
      'After timeout — exotic look catches defense mid-adjustment',
    ],
    notes: '⚠ SNAP FAST before defense adjusts! All bunch LEFT of Lenox. Cooper alone far RIGHT. Quick snap → instant throw to Cooper. He is always open if you snap before defense sets.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Look LEFT at bunch (sell it) → 🏈 Snap and immediately throw to Cooper isolated RIGHT' },
    players: {
      Braelyn:  { pos: [9, -3],   route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [9, 0],    route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [5, 0],    route: [[5, 6], [9, 10]], label: 'OUT (sell)', read: 2, dashed: false },
      Marshall: { pos: [12, 0],   route: [[12, 8], [16, 6]], label: 'HITCH', read: 3, dashed: false },
      Cooper:   { pos: [32, 0],   route: [[32, 4], [34, 8]], label: '1-ON-1!', read: 1, dashed: false },
    },
    defense: [[9, 5], [16, 7], [24, 5], [7, 13], [26, 13]],
    timing: { 1: 0.8, 2: 2.0, 3: 2.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 0.8, type: 'throw' },
    ],
    specialLabels: [
      { x: 9, y: 0, text: 'BUNCH LEFT\nDEFENSE FOLLOWS →', color: '#ff6600' },
      { x: 32, y: 10, text: '★ COOPER ALONE\n1-ON-1 FAR SIDE', color: '#2dd4bf' },
    ],
  },

  // ── 38. BUNCH GOAL LINE ────────────────────────────────────────────────
  // Exotic + NRZ: 3 receivers bunch right — crossing picks create separation WITHOUT height.
  // No fade, no jump balls — pure scheme separation in tight space.
  {
    name: 'Bunch Goal Line',
    formation: 'Bunch Right (Goal Line)',
    tags: ['exotic', 'nrz'],
    family: 'nrz',
    fake:   "Looks like a 3-receiver bunch route going right — defenders follow receivers into bunch traffic",
    target: "Whoever pops free from the natural picks — defenders tangle with each other, one receiver always breaks clean",
    showNRZ: true,
    whenToUse: [
      'NO-RUN ZONE — create separation through traffic, NOT height',
      'Man coverage — 3 receivers bunch = 3 natural picks in tight space',
      'Goal line stand — rub routes, first open man wins',
    ],
    notes: 'NO fade, NO jump balls — this is SCHEME separation! All 3 receivers bunch right. Greyson crosses LOW, Marshall crosses MID, Cooper pops to flat. Defenders tangle with each other. Hit first open man.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall crossing AWAY → 🏈 First open man: Greyson cross, Cooper flat, or Marshall dig' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [26, 0],    route: [[26, 2], [26, 4], [19, 6]], label: 'CROSS!', read: 1, dashed: false },
      Marshall: { pos: [29, 0],    route: [[29, 3], [29, 6], [22, 8]], label: 'DIG', read: 2, dashed: false },
      Cooper:   { pos: [23, 0],    route: [[23, 2], [28, 3], [33, 5]], label: 'FLAT!', read: 3, dashed: false },
    },
    defense: [[10, 4], [17.5, 6], [25, 4], [8, 9], [27, 9]],
    timing: { 1: 0.8, 2: 1.5, 3: 2.5 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.8, type: 'throw' },
    ],
    specialLabels: [
      { x: 27, y: 0, text: 'BUNCH — 3 PICKS\nNO HEIGHT NEEDED', color: '#2dd4bf' },
      { x: 18, y: 7, text: '★ SCHEME SEP\nOPEN BY DESIGN', color: '#22c55e' },
    ],
  },

  // ── 39. MESH LEFT (Predetermined) ──────────────────────────────────────
  // Braelyn's eyes lock RIGHT on Marshall. Throw goes LEFT to Greyson.
  // Her staring tendency IS the play design — holds defenders right, Greyson pops free left.
  {
    name: 'Mesh Left',
    formation: 'Spread',
    tags: ['core'],
    family: 'mesh',
    fake:   "QB eyes locked RIGHT on Marshall crossing right — defense follows her eyes",
    target: "Greyson crossing LEFT — defenders pulled right by QB eyes, entire left side opens",
    whenToUse: [
      'Man coverage — crossing creates natural picks',
      'Default mesh call — predetermined throw LEFT',
      'Braelyn staring tendency weaponized as a look-off',
    ],
    notes: 'PRE-DETERMINED throw LEFT. Braelyn told in huddle: eyes RIGHT, throw LEFT. Her natural stare-down becomes a built-in look-off.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Lock eyes RIGHT on Marshall → 🏈 Throw LEFT to Greyson crossing' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[22, 3], [27, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [28, 0],    route: [[28, 5], [4, 5]], label: 'MESH←', read: 1, dashed: false },
      Marshall: { pos: [7, 0],     route: [[7, 6], [31, 6]], label: 'MESH→', read: 0, dashed: false,
                  motion: { from: [3, 0], to: [7, 0] } },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [6, 1]], label: 'FLAT', read: 2, dashed: true },
    },
    defense: [[10, 5], [17.5, 8], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.5, 2: 3.0, 3: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 28, y: 2, text: '👀 EYES HERE\nHOLD DEFENSE →', color: '#f59e0b' },
      { x: 4, y: 7, text: '★ THROW HERE\nGREYSON OPEN', color: '#dc2626' },
    ],
  },

  // ── 40. MESH RIGHT (Predetermined) ─────────────────────────────────────
  // Mirror of Mesh Left. Eyes lock LEFT on Greyson, throw RIGHT to Marshall.
  {
    name: 'Mesh Right',
    formation: 'Spread',
    tags: ['core'],
    family: 'mesh',
    fake:   "QB eyes locked LEFT on Greyson crossing left — defense follows her eyes",
    target: "Marshall crossing RIGHT — defenders pulled left by QB eyes, entire right side opens",
    whenToUse: [
      'Man coverage — crossing creates natural picks',
      'Default mesh call — predetermined throw RIGHT',
      'Mirror of Mesh Left — keeps defense guessing which side',
    ],
    notes: 'PRE-DETERMINED throw RIGHT. Mirror of Mesh Left. Eyes LEFT, throw RIGHT.',
    qbLook: { eyes: 'Greyson', throw: 'Marshall', tip: '👀 Lock eyes LEFT on Greyson → 🏈 Throw RIGHT to Marshall crossing' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [7, 0],     route: [[7, 6], [31, 6]], label: 'MESH→', read: 0, dashed: false },
      Marshall: { pos: [28, 0],    route: [[28, 5], [4, 5]], label: 'MESH←', read: 1, dashed: false,
                  motion: { from: [32, 0], to: [28, 0] } },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [29, 1]], label: 'FLAT', read: 2, dashed: true },
    },
    defense: [[10, 5], [17.5, 8], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 1.5, 2: 3.0, 3: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Marshall', time: 1.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 7, y: 2, text: '👀 EYES HERE\n← HOLD DEFENSE', color: '#dc2626' },
      { x: 31, y: 7, text: '★ THROW HERE\nMARSHALL OPEN', color: '#f59e0b' },
    ],
  },

  // ── 41. MESH DEEP ──────────────────────────────────────────────────────
  // Mesh crossing at 5yd holds defenders + Cooper streaks vertical behind them.
  // Punishes defense for cheating on short mesh crosses.
  {
    name: 'Mesh Deep',
    formation: 'Spread',
    tags: [],
    family: 'mesh',
    fake:   "Looks like standard mesh — two crossers at 5 yards, defense cheats up to jump the short throw",
    target: "Cooper deep post — while defense bites on mesh crossers, Cooper runs behind everyone",
    whenToUse: [
      'Defense cheating up on mesh crosses — punish them deep',
      'After running Mesh Left/Right 3+ times — they expect short',
      'Need a big play from the mesh formation look',
    ],
    notes: 'Set up by running Mesh Left/Right first. When DBs jump the 5yd crossers, Cooper is gone behind them. Braelyn stares at mesh, then throws deep.',
    qbLook: { eyes: 'Greyson', throw: 'Cooper', tip: '👀 Eyes on mesh crossers (sell it!) → 🏈 Throw deep to Cooper when DB bites on cross' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[22, 3], [27, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [4, 0],     route: [[4, 5], [32, 5]], label: 'MESH', read: 2, dashed: false },
      Marshall: { pos: [24, -1],   route: [[24, 6], [3, 6]], label: 'MESH', read: 3, dashed: false,
                  motion: { from: [31, -1], to: [24, -1] } },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3], [17.5, 5], [14, 12], [17.5, 18]], label: 'DEEP POST!', read: 1, dashed: false },
    },
    defense: [[10, 5], [17.5, 8], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 2.5, 2: 1.5, 3: 2.0, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Cooper', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: 5, text: 'MESH HOLDS D\nBITE ON SHORT →', color: '#f59e0b' },
      { x: 17.5, y: 19, text: '★ COOPER DEEP\nWIDE OPEN', color: '#2dd4bf' },
    ],
  },

  // ── 42. DOUBLE GO ──────────────────────────────────────────────────────
  // Both outside WRs streak deep. QB picks the better 1v1 matchup. Cooper dumps to flat as safety valve.
  {
    name: 'Double Go',
    formation: 'Spread',
    tags: [],
    family: 'shot',
    fake:   "Looks like a deep ball right — QB eyes locked on Marshall going deep RIGHT, holds safety on that side",
    target: "Greyson going deep LEFT — single coverage, QB eyes drew safety to Marshall's side, Greyson wins 1v1",
    whenToUse: [
      'Defense cheating up on short routes (mesh, slants, bubble)',
      'Need 15+ yards — shot play opportunity',
      'Speedster vs slow DB matchup identified',
    ],
    notes: 'Pick the 1v1 matchup pre-snap. If both covered, dump to Cooper in the flat. Only throw deep if someone is OPEN.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Stare at Marshall going deep RIGHT → 🏈 Throw to Greyson going deep LEFT (he has single coverage)' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 5]], label: 'CHECK', read: 4, dashed: true },
      Greyson:  { pos: [5, 0],     route: [[5, 5], [5, 12], [5, 20]], label: 'GO!', read: 1, dashed: false },
      Marshall: { pos: [30, 0],    route: [[30, 5], [30, 12], [30, 20]], label: 'GO!', read: 2, dashed: false },
      Cooper:   { pos: [17.5, -5.5], route: [[17.5, -3.5], [8, 1]], label: 'FLAT (safe)', read: 3, dashed: true },
    },
    defense: [[8, 5], [17.5, 7], [27, 5], [5, 14], [30, 14]],
    timing: { 1: 2.5, 2: 2.5, 3: 1.5, 4: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 2.5, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: 20, text: '🎯 PICK THE\n1-ON-1 WINNER', color: '#22c55e' },
    ],
  },

  // ── 43. FLEA FLICKER ───────────────────────────────────────────────────
  // Fake handoff to Greyson → Greyson pitches back → QB throws deep while defense bites on run.
  {
    name: 'Flea Flicker',
    formation: 'Spread',
    tags: ['exotic'],
    family: 'shot',
    fake:   "Looks like a run — handoff to Greyson, defense crashes forward to pull flags",
    target: "Marshall deep — defense bit on run fake, secondary vacated, Marshall sprinting behind everyone",
    whenToUse: [
      'Defense crashing on run plays — punish with play action deep',
      'Once per game MAX — trick play, save for the right moment',
      'Need a momentum-shifting big play',
    ],
    notes: '⚠ ONCE PER GAME MAX. Fake handoff to Greyson → Greyson pitches back to Braelyn → throw deep to Marshall. Greyson must lateral IMMEDIATELY, no hesitation.',
    qbLook: { eyes: 'Greyson', throw: 'Marshall', tip: '👀 Sell the handoff to Greyson → 🏈 Get pitch back → throw deep to Marshall' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [[17.5, -3], [14, -3], [14, -3]], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [], label: '', read: 0, dashed: false },
      Greyson:  { pos: [12, -2],   route: [[17.5, -2], [20, -1], [20, -1]], label: 'FAKE+PITCH', read: 0, dashed: false },
      Marshall: { pos: [30, 0],    route: [[30, 6], [30, 12], [27, 20]], label: 'GO DEEP!', read: 1, dashed: false },
      Cooper:   { pos: [5, 0],     route: [[5, 6], [5, 12], [8, 18]], label: 'GO DEEP!', read: 2, dashed: false },
    },
    defense: [[10, 4], [17.5, 7], [25, 4], [8, 13], [27, 13]],
    timing: { 1: 3.0, 2: 3.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.5, type: 'handoff' },
      { from: 'Greyson', to: 'Braelyn', time: 1.2, type: 'lateral' },
      { from: 'Braelyn', to: 'Marshall', time: 3.0, type: 'throw' },
    ],
    specialLabels: [
      { x: 17.5, y: -1, text: '🔄 FAKE RUN\nPITCH BACK', color: '#dc2626' },
      { x: 28, y: 20, text: '★ MARSHALL DEEP\nD BIT ON RUN', color: '#f59e0b' },
    ],
  },

  // ── 44. FLAT DUMP ──────────────────────────────────────────────────────
  // Simplest play in the book. Snap, dump to Greyson in the flat, let him run.
  // 1-count throw. Anti-blitz, confidence builder, gets ball to your best player.
  {
    name: 'Flat Dump',
    formation: 'Spread',
    tags: ['core'],
    family: 'quick',
    fake:   "Looks like a pass play developing — WRs running routes pulls defenders deep",
    target: "Greyson in the flat — catch in space with room to run, WR routes clear out defenders",
    whenToUse: [
      'Get ball to Greyson in space — let the athlete do the work',
      'Defense blitzing — ball out in 1 second',
      'Need a safe, easy completion to build confidence',
      'First play of a drive — high percentage, no risk',
    ],
    notes: 'THE simplest play. Snap → dump to Greyson. 1 count. WRs run clearing routes to pull defenders away. Greyson catches in space and makes plays.',
    qbLook: { eyes: 'Marshall', throw: 'Greyson', tip: '👀 Glance RIGHT at Marshall → 🏈 Immediately dump LEFT to Greyson in flat' },
    players: {
      Braelyn:  { pos: [17.5, -3], route: [], label: '', read: 0, dashed: false },
      Lenox:    { pos: [17.5, 0],  route: [[12, 3], [7, 6]], label: 'CHECK', read: 3, dashed: true },
      Greyson:  { pos: [10, -2],   route: [[6, 0], [3, 3]], label: 'FLAT!', read: 1, dashed: false },
      Marshall: { pos: [30, 0],    route: [[30, 6], [30, 14]], label: 'CLEAR', read: 0, dashed: false },
      Cooper:   { pos: [5, 0],     route: [[5, 6], [5, 14]], label: 'CLEAR', read: 2, dashed: true },
    },
    defense: [[10, 5], [17.5, 7], [25, 5], [8, 13], [27, 13]],
    timing: { 1: 0.8, 2: 3.0, 3: 4.0 },
    ballPath: [
      { from: 'Lenox', to: 'Braelyn', time: 0, type: 'snap' },
      { from: 'Braelyn', to: 'Greyson', time: 0.8, type: 'throw' },
    ],
    specialLabels: [
      { x: 3, y: 5, text: '★ GREYSON\nIN SPACE', color: '#dc2626' },
      { x: 28, y: 14, text: 'CLEARING\nROUTES →', color: '#666' },
    ],
  },
];
