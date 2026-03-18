// modules/ui.js — DOM building, player filter, substitutions, info panel

import {
  state, LOCKED_PLAYERS, ALL_ROSTER,
  getActiveSubs, getPerPlaySubs, getDisplayName, getAvailableSubs,
  saveSunlightMode, saveSubstitutions, saveActivePlaySet,
  saveActivePlaySetTag, getPlaysForTag,
  saveActiveFamily, getFilteredPlays, getPlayerModePlays, getLineupSubs,
  getPlayerPlaybookEntry, applyPlayerModeSubOverlay,
} from './state.js';
import { drawFrame } from './renderer.js';
import { togglePlayPause, replay, updateTimer } from './animation.js';

// selectPlay callback registered from app.js
let _selectPlay = null;
export function setSelectPlayFn(fn) { _selectPlay = fn; }

// ── Kid-Friendly Text (Player Mode) ──────────────────────────

const LABEL_TO_KID_TEXT = {
  'MESH':        'Run across the field. The ball is coming to you!',
  'MESH←':       'Run hard to the LEFT across the field. Catch the ball!',
  'MESH→':       'Run hard to the RIGHT across the field. Catch the ball!',
  'FLAT':        'Run to the sideline. Be ready — QB might throw to you!',
  'FLAT!':       'Run to the sideline. The ball IS coming to you!',
  'FLAT (safe)': 'Run to the sideline. You are the safe throw.',
  'GO!':         'Sprint as fast as you can straight downfield!',
  'GO DEEP!':    'Sprint as fast as you can straight downfield!',
  'CORNER':      'Run upfield, then break toward the corner.',
  'OUT':         'Run straight, then cut hard to the sideline.',
  'SLANT':       'Run 3 steps, then cut inside. Quick catch!',
  'CROSS!':      'Run across the middle of the field.',
  'DIG':         'Run upfield, then cut hard across the middle.',
  'HITCH':       'Run 5 yards, STOP, turn around. Ball coming!',
  'POST!':       'Run upfield, then angle toward the middle.',
  'DEEP POST!':  'Sprint deep, then cut to the middle. BIG PLAY!',
  'CHECK':       'Snap the ball, then run your route.',
  'CLEAR':       'Run your route to pull defenders away. You are a decoy!',
  'FAKE+PITCH':  'Take the fake handoff, then pitch it back to QB!',
  '1-ON-1!':     'You are alone against one defender. Beat them!',
  'WHEEL':       'Start toward the sideline, then turn upfield and GO!',
  'SWEEP':       'Take the handoff and sprint to the outside!',
  'DRAW':        'Wait for the fake, then burst through the middle!',
  'JET':         'Motion across, take the handoff at full speed!',
  'COUNTER':     'Fake one way, then take the handoff going the other!',
  'BLOCK HERE':  'Get in position and block your defender.',
  'SCREEN':      'Catch the quick pass and follow your blockers!',
};

function getPlayerInstruction(play, playerName) {
  let pd = play.players[playerName];

  // If player isn't directly in the play, check if they're subbed in
  if (!pd) {
    const playIdx = PLAYS.indexOf(play);
    const subs = state.substitutions[playIdx] || {};
    const lineupSubs = getLineupSubs();

    // Check per-play subs first
    for (const [origName, subName] of Object.entries(subs)) {
      if (subName === playerName) {
        pd = play.players[origName];
        break;
      }
    }
    // Check lineup subs if no per-play sub found
    if (!pd) {
      for (const [origName, subName] of Object.entries(lineupSubs)) {
        if (subName === playerName && play.players[origName]) {
          pd = play.players[origName];
          break;
        }
      }
    }
  }

  if (!pd) return "Watch the play and learn everyone's job!";

  // QB special case
  if (playerName === 'Braelyn') {
    if (play.qbLook) return play.qbLook.tip || play.qbLook.throw || "You are the QB. Deliver the ball!";
    return "You are the QB. Deliver the ball!";
  }

  // Center special case
  if (playerName === 'Lenox') {
    if (pd.label === 'CHECK') return "Snap the ball to the QB, then run your check-down route.";
    return "Snap the ball to the QB, then run your route.";
  }

  const text = LABEL_TO_KID_TEXT[pd.label];
  if (text) return text;

  if (pd.read === 0) return "Run your route to help the play work!";
  if (pd.read === 1) return "You are the first read — the ball is probably coming to you!";
  return "Run your route — the QB might throw to you!";
}

// ── Play Set Definitions ──────────────────────────────────────

const PLAY_SETS = [
  { tag: 'core',     label: 'Core 5',   emoji: '⭐' },
  { tag: 'extended', label: 'Extended', emoji: '📈' },
  { tag: '2back',    label: '2-Back',   emoji: '🔀' },
  { tag: 'nrz',      label: 'NRZ',      emoji: '🚨' },
  { tag: 'exotic',   label: 'Exotic',   emoji: '🔮' },
  { tag: 'all',      label: 'All',      emoji: '📋' },
  { tag: 'custom',   label: 'Custom',   emoji: '⚙️'  },
];

// ── Play Family Definitions ───────────────────────────────────

const PLAY_FAMILIES = [
  { family: 'all',          label: 'All',          emoji: '📋' },
  { family: 'mesh',         label: 'Mesh',         emoji: '🔵' },
  { family: 'counter-jet',  label: 'Counter/Jet',  emoji: '🟢' },
  { family: 'quick',        label: 'Quick Game',   emoji: '🔴' },
  { family: 'flood',        label: 'Flood',        emoji: '🌊' },
  { family: 'shot',         label: 'Shot Plays',   emoji: '⚡' },
  { family: 'misdirection', label: 'Misdirection', emoji: '🟡' },
  { family: 'rpo',          label: 'RPO',          emoji: '🔄' },
  { family: 'nrz',          label: 'NRZ',          emoji: '🟣' },
  { family: '2back',        label: '2-Back',       emoji: '🔀' },
  { family: 'exotic',       label: 'Exotic',       emoji: '🔮' },
];

// Tag accent colors — used for play-btn tag dots
const TAG_COLORS = {
  core:     '#22c55e',
  extended: '#2dd4bf',
  '2back':  '#f59e0b',
  nrz:      '#ef4444',
  exotic:   '#8b5cf6',
};

// ── Mode Visibility ───────────────────────────────────────────

export function applyModeVisibility() {
  document.querySelectorAll('#controls [data-modes]').forEach(el => {
    const modes = el.dataset.modes.split(',');
    el.style.display = modes.includes(state.appMode) ? '' : 'none';
  });

  // Player mode: force teaching speed
  if (state.appMode === 'player') {
    state.speed = 0.25;
  }
}

// ── Play Selector ─────────────────────────────────────────────

export function buildPlaySelector() {
  const container = document.getElementById('play-selector');
  container.innerHTML = '';

  const isPlayer = state.appMode === 'player';
  const isCoach = state.appMode === 'coach';
  const isPrep = state.appMode === 'prep';

  // ── Row 1: Set Selector buttons (prep only) ───────────────
  if (isPrep) {
    const setRow = document.createElement('div');
    setRow.className = 'play-set-row';

    PLAY_SETS.forEach(({ tag, label, emoji }) => {
      const visiblePlays = getPlaysForTag(tag);
      const count = tag === 'custom' ? null : visiblePlays.length;

      const btn = document.createElement('button');
      const isActive = state.activePlaySetTag === tag;
      btn.className = 'set-btn' + (isActive ? ' active' : '');
      btn.dataset.tag = tag;
      btn.innerHTML =
        `<span class="set-btn-emoji">${emoji}</span>` +
        `<span class="set-btn-label">${label}</span>` +
        (count !== null ? `<span class="set-btn-count">${count}</span>` : '');

      btn.addEventListener('click', () => {
        if (tag === 'custom') {
          state.activePlaySetTag = 'custom';
          state.activePlaySetEditing = true;
          saveActivePlaySetTag();
          buildPlaySelector();
        } else {
          state.activePlaySetTag = tag;
          state.activePlaySetEditing = false;
          saveActivePlaySetTag();
          buildPlaySelector();
        }
      });
      setRow.appendChild(btn);
    });

    container.appendChild(setRow);
  }

  // ── Row 2: Family Filter Row (coach and prep only) ────────
  if (isCoach || isPrep) {
    const familyRow = document.createElement('div');
    familyRow.className = 'play-family-row';

    // Compute the tag-filtered plays (without family filter) for accurate counts
    const tagFilteredForCount = state.activePlaySetTag === 'custom' && state.activePlaySet
      ? PLAYS.filter(p => state.activePlaySet.has(p.name))
      : getPlaysForTag(state.activePlaySetTag);

    PLAY_FAMILIES.forEach(({ family, label, emoji }) => {
      const count = family === 'all'
        ? tagFilteredForCount.length
        : tagFilteredForCount.filter(p => p.family === family).length;

      // Skip families with 0 plays in current tag filter (except 'all')
      if (family !== 'all' && count === 0) return;

      const btn = document.createElement('button');
      const isActive = state.activeFamily === family;
      btn.className = 'family-btn' + (isActive ? ' active' : '');
      btn.dataset.family = family;
      btn.innerHTML =
        `<span class="family-btn-emoji">${emoji}</span>` +
        `<span class="family-btn-label">${label}</span>` +
        `<span class="family-btn-count">${count}</span>`;

      btn.addEventListener('click', () => {
        state.activeFamily = family;
        saveActiveFamily();
        buildPlaySelector();
      });
      familyRow.appendChild(btn);
    });

    container.appendChild(familyRow);
  }

  // ── Separator ─────────────────────────────────────────────
  if (isCoach || isPrep) {
    const sep = document.createElement('div');
    sep.className = 'play-selector-sep';
    container.appendChild(sep);
  }

  // ── Row 3: Play buttons in a horizontal scrollable sub-row ──
  const playRow = document.createElement('div');
  playRow.className = 'play-btn-row';

  // Custom pick mode (prep only)
  if (isPrep && state.activePlaySetEditing && state.activePlaySetTag === 'custom') {
    const activeSet = state.activePlaySet || new Set();
    PLAYS.forEach((play, i) => {
      const isSelected = activeSet.has(play.name);
      const btn = document.createElement('button');
      btn.className = 'play-btn' + (isSelected ? ' active' : '') + (play.isCustom ? ' custom' : '');
      btn.innerHTML =
        `<span class="play-btn-name">${isSelected ? '✅ ' : '⬜ '}${play.name}</span>` +
        _tagDots(play);
      btn.addEventListener('click', () => {
        if (activeSet.has(play.name)) activeSet.delete(play.name);
        else activeSet.add(play.name);
        state.activePlaySet = activeSet.size > 0 ? activeSet : null;
        buildPlaySelector();
      });
      playRow.appendChild(btn);
    });

    const doneBtn = document.createElement('button');
    doneBtn.className = 'play-btn active';
    doneBtn.style.cssText = 'background:#2d7d2d;flex-shrink:0;';
    doneBtn.textContent = `✅ Done (${activeSet.size})`;
    doneBtn.addEventListener('click', () => {
      state.activePlaySetEditing = false;
      saveActivePlaySet();
      buildPlaySelector();
    });
    playRow.appendChild(doneBtn);
    container.appendChild(playRow);
    return;
  }

  if (isPlayer) {
    // Player mode: simplified play buttons, filtered to this player's plays
    const playerPlays = getPlayerModePlays();
    playerPlays.forEach(play => {
      const i = PLAYS.indexOf(play);
      const btn = document.createElement('button');
      btn.className = 'play-btn player-mode-btn' + (i === state.currentPlayIdx ? ' active' : '');
      btn.innerHTML = `<span class="play-btn-name">${play.name}</span>`;
      btn.addEventListener('click', () => { if (_selectPlay) _selectPlay(i); });
      playRow.appendChild(btn);
    });
  } else if (isCoach) {
    // Coach mode: family emoji + play name, no tag dots, no sub indicators
    const familyEmojiMap = {};
    PLAY_FAMILIES.forEach(({ family, emoji }) => { familyEmojiMap[family] = emoji; });

    const visiblePlays = getFilteredPlays();
    visiblePlays.forEach(play => {
      const i = PLAYS.indexOf(play);
      const emoji = familyEmojiMap[play.family] || '';
      const btn = document.createElement('button');
      btn.className = 'play-btn' + (i === state.currentPlayIdx ? ' active' : '');
      btn.innerHTML = `<span class="play-btn-name">${emoji} ${play.name}</span>`;
      btn.addEventListener('click', () => { if (_selectPlay) _selectPlay(i); });
      playRow.appendChild(btn);
    });
  } else {
    // Prep mode: full behavior with tag dots, subs, etc.
    const visiblePlays = getFilteredPlays();
    visiblePlays.forEach(play => {
      const i = PLAYS.indexOf(play);
      const perPlaySubs = state.substitutions[i] && Object.keys(state.substitutions[i]).length > 0;
      const btn = document.createElement('button');
      let cls = 'play-btn' + (i === state.currentPlayIdx ? ' active' : '');
      if (play.isCustom) cls += ' custom';
      btn.className = cls;
      btn.innerHTML =
        `<span class="play-btn-name">${play.name}${perPlaySubs ? ' ↔' : ''}${play.isCustom ? ' ★' : ''}</span>` +
        _tagDots(play);

      btn.addEventListener('click', () => {
        if (state.editorActive) return;
        if (state.queueMode) {
          state.queue.push({ playIdx: i, result: null });
          state.queuePos = state.queue.length - 1;
          if (_selectPlay) _selectPlay(i);
        } else {
          if (_selectPlay) _selectPlay(i);
        }
      });
      playRow.appendChild(btn);
    });
  }

  if (playRow.children.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-state';
    if (isPlayer && state.playerModeName) {
      emptyMsg.textContent = `No plays found for ${state.playerModeName}. Try removing the family filter.`;
    } else {
      emptyMsg.textContent = 'No plays match this filter combination. Try changing the set or family filter.';
    }
    playRow.appendChild(emptyMsg);
  }

  container.appendChild(playRow);
}

// Build the colored set-membership dot strip for a play button
function _tagDots(play) {
  if (!play.tags || play.tags.length === 0) return '';
  const dots = play.tags
    .filter(t => TAG_COLORS[t])
    .map(t => `<span class="play-tag-dot" style="background:${TAG_COLORS[t]}" title="${t}"></span>`)
    .join('');
  return dots ? `<span class="play-tag-dots">${dots}</span>` : '';
}

// ── Player Filter ─────────────────────────────────────────────

export function buildPlayerFilter() {
  const container = document.getElementById('player-filter');
  container.innerHTML = '';
  const play = PLAYS[state.currentPlayIdx];
  const subs = getActiveSubs();

  for (const origName of Object.keys(play.players)) {
    const dispName = subs[origName] || origName;
    const p = PLAYERS[dispName] || state.roster?.find(r => r.name === dispName);
    if (!p) continue;
    const isLocked = LOCKED_PLAYERS.includes(origName);
    // Show sub indicator if different from ORIGINAL name (lineup or per-play sub)
    const isSub = dispName !== origName;

    const dotColor = p.color || '#999';
    const btn = document.createElement('button');
    btn.className = 'player-dot-btn' + (state.highlightPlayer === origName ? ' active' : '');
    btn.innerHTML = `<span class="dot" style="background:${dotColor}${isSub ? ';box-shadow:0 0 4px 2px #fff' : ''}"></span><span class="name">${dispName}${isSub ? '↔' : ''}</span>`;

    let lastTap = 0;
    btn.addEventListener('click', (e) => {
      const now = Date.now();
      if (!isLocked && now - lastTap < 350) {
        e.preventDefault();
        state.highlightPlayer = null;
        openSubMenu(origName);
        lastTap = 0;
        return;
      }
      lastTap = now;
      setTimeout(() => {
        if (lastTap === now) {
          state.highlightPlayer = state.highlightPlayer === origName ? null : origName;
          closeSubMenu();
          buildPlayerFilter();
          drawFrame();
        }
      }, 360);
    });

    if (!isLocked) {
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        openSubMenu(origName);
      });
    }
    container.appendChild(btn);
  }

  // Show reset only if there are per-play subs (not just lineup subs)
  const perPlaySubs = getPerPlaySubs();
  if (Object.keys(perPlaySubs).length > 0) {
    const resetBtn = document.createElement('button');
    resetBtn.className = 'player-dot-btn';
    resetBtn.innerHTML = '<span class="name" style="font-size:11px">↩ Reset</span>';
    resetBtn.style.opacity = '0.7';
    resetBtn.addEventListener('click', () => {
      delete state.substitutions[state.currentPlayIdx];
      saveSubstitutions();
      closeSubMenu();
      buildPlayerFilter();
      drawFrame();
      buildPlaySelector();
    });
    container.appendChild(resetBtn);
  }
}

// ── Sub Menu ──────────────────────────────────────────────────

export function openSubMenu(targetOrigName) {
  closeSubMenu();
  state.subMenuTarget = targetOrigName;
  const available = getAvailableSubs(targetOrigName);
  if (!available.length) return;

  const menu = document.createElement('div');
  menu.id = 'sub-menu';
  menu.style.cssText = 'position:fixed;bottom:120px;left:50%;transform:translateX(-50%);background:#1a1a2e;border:2px solid #f59e0b;border-radius:12px;padding:8px;display:flex;gap:8px;z-index:100;box-shadow:0 4px 20px rgba(0,0,0,0.5);';

  const header = document.createElement('div');
  header.style.cssText = 'color:#f59e0b;font-size:11px;font-weight:bold;padding:4px 8px;white-space:nowrap;display:flex;align-items:center;';
  header.textContent = `SUB ${getDisplayName(targetOrigName)}:`;
  menu.appendChild(header);

  for (const subName of available) {
    const p = PLAYERS[subName];
    const btn = document.createElement('button');
    btn.style.cssText = `background:${p.color};color:${(p.color === '#2dd4bf' || p.color === '#f59e0b') ? '#000' : '#fff'};border:2px solid #fff;border-radius:8px;padding:6px 12px;font-size:13px;font-weight:bold;min-width:44px;min-height:44px;cursor:pointer;`;
    btn.textContent = subName;
    btn.addEventListener('click', () => makeSub(targetOrigName, subName));
    menu.appendChild(btn);
  }

  const cancelBtn = document.createElement('button');
  cancelBtn.style.cssText = 'background:#333;color:#fff;border:1px solid #666;border-radius:8px;padding:6px 10px;font-size:12px;min-height:44px;cursor:pointer;';
  cancelBtn.textContent = '✕';
  cancelBtn.addEventListener('click', closeSubMenu);
  menu.appendChild(cancelBtn);

  document.body.appendChild(menu);
  state.subMenuOpen = true;
}

export function closeSubMenu() {
  const menu = document.getElementById('sub-menu');
  if (menu) menu.remove();
  state.subMenuOpen = false;
  state.subMenuTarget = null;
}

export function makeSub(origName, replacementName) {
  if (!state.substitutions[state.currentPlayIdx]) {
    state.substitutions[state.currentPlayIdx] = {};
  }
  state.substitutions[state.currentPlayIdx][origName] = replacementName;
  saveSubstitutions(); // Persist per-play subs across refresh
  closeSubMenu();
  buildPlayerFilter();
  buildPlaySelector();
  drawFrame();
}

// ── Controls setup ────────────────────────────────────────────

export function buildControls() {
  document.getElementById('btn-play').addEventListener('click', togglePlayPause);
  document.getElementById('btn-replay').addEventListener('click', replay);

  const modeBtn = document.getElementById('btn-mode');
  modeBtn.addEventListener('click', () => {
    state.viewMode = state.viewMode === 'qb' ? 'game' : 'qb';
    modeBtn.textContent = state.viewMode === 'qb' ? '👁️' : '🏈';
    modeBtn.title = state.viewMode === 'qb' ? 'QB Study Mode' : 'Game Speed';
    const label = state.viewMode === 'qb' ? 'QB STUDY MODE' : 'GAME SPEED';
    document.getElementById('play-notes').textContent = label;
    setTimeout(() => {
      updateInfoPanel(); // restore fake/target display after mode flash
    }, 1500);
    drawFrame();
  });

  // Defense toggle removed — defenseMode stays 'off' for simplified youth coaching UI
  // Data preserved in play definitions for future use

  const ballBtn = document.getElementById('btn-ball');
  ballBtn.style.opacity = '0.4';
  ballBtn.addEventListener('click', () => {
    state.showBall = !state.showBall;
    ballBtn.style.opacity = state.showBall ? '1' : '0.4';
    drawFrame();
  });

  // Sunlight mode toggle
  const sunBtn = document.getElementById('btn-sun');
  if (sunBtn) {
    sunBtn.style.opacity = state.sunlightMode ? '1' : '0.4';
    sunBtn.addEventListener('click', () => {
      state.sunlightMode = !state.sunlightMode;
      sunBtn.style.opacity = state.sunlightMode ? '1' : '0.4';
      document.body.classList.toggle('sunlight', state.sunlightMode);
      saveSunlightMode();
      drawFrame();
    });
  }

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.speed = parseFloat(btn.dataset.speed);
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      try { localStorage.setItem('playbook:speed', String(state.speed)); } catch(e) {}
    });
  });
  // Sync active class to state.speed (e.g. after loadPreferences restores a saved speed)
  document.querySelectorAll('.speed-btn').forEach(b => {
    b.classList.toggle('active', parseFloat(b.dataset.speed) === state.speed);
  });
}

// ── Info Panel ────────────────────────────────────────────────

export function updateInfoPanel() {
  const play = PLAYS[state.currentPlayIdx];

  // Player mode: show kid-friendly instruction
  if (state.appMode === 'player' && state.playerModeName) {
    const instruction = getPlayerInstruction(play, state.playerModeName);
    const formEl = document.getElementById('formation-label');
    const wtuEl = document.getElementById('when-to-use');
    const notesEl = document.getElementById('play-notes');
    if (formEl) formEl.textContent = play.name;
    if (wtuEl) wtuEl.innerHTML = `<span style="font-size:18px;font-weight:bold;color:#22c55e;">🏈 YOUR JOB</span>`;
    if (notesEl) notesEl.innerHTML = `<span style="font-size:15px;color:#e0e0e0;line-height:1.4;">${instruction}</span>`;

    // Show position badge from playbook entry
    const playIdx = PLAYS.indexOf(play);
    const entry = getPlayerPlaybookEntry(state.playerModeName, playIdx);
    const badge = document.getElementById('player-position-badge');
    if (badge) {
      if (entry && entry.position) {
        badge.textContent = `📍 Line up as: ${entry.position}`;
        badge.style.display = '';
      } else {
        badge.style.display = 'none';
      }
    }
    return;
  }

  // Hide position badge in non-player modes
  const badge = document.getElementById('player-position-badge');
  if (badge) badge.style.display = 'none';

  // formation-label: always show play name + formation (dimmed, compact)
  document.getElementById('formation-label').textContent = play.name + ' · ' + play.formation;

  if (state.qbMode && (play.qbLook || play.isRunPlay)) {
    // QB mode — show eyes/throw read cue
    const look = play.qbLook;
    if (look) {
      document.getElementById('when-to-use').innerHTML =
        `<span class="info-tag fake-tag">EYES</span><span class="info-text-main">→ ${look.eyes}</span>`;
      document.getElementById('play-notes').innerHTML =
        `<span class="info-tag target-tag">THROW</span><span class="info-text-main">→ ${look.throw}</span>`;
    } else {
      // Run play with no qbLook
      document.getElementById('when-to-use').innerHTML =
        `<span class="info-tag fake-tag">SELL</span><span class="info-text-main">${play.fake || 'Sell the fake'}</span>`;
      document.getElementById('play-notes').innerHTML =
        `<span class="info-tag target-tag">BALL</span><span class="info-text-main">${play.target || 'Hand off and trust the play'}</span>`;
    }
  } else {
    // Normal / coach view — FAKE and TARGET are the primary display
    document.getElementById('when-to-use').innerHTML =
      `<span class="info-tag fake-tag">FAKE</span><span class="info-text-main">${play.fake || ''}</span>`;
    document.getElementById('play-notes').innerHTML =
      `<span class="info-tag target-tag">TARGET</span><span class="info-text-main">${play.target || ''}</span>`;
  }
}

// ── Player Picker Overlay ─────────────────────────────────────

export function showPlayerPicker() {
  const overlay = document.getElementById('player-picker');
  const grid = document.getElementById('player-picker-grid');
  if (!overlay || !grid) return;

  grid.innerHTML = '';

  // Show all non-sub players (the main roster)
  const mainPlayers = ['Braelyn', 'Lenox', 'Greyson', 'Marshall', 'Cooper', 'Jordy', 'Zeke', 'Mason'];

  mainPlayers.forEach(name => {
    const playerData = PLAYERS[name];
    if (!playerData) return;

    const btn = document.createElement('button');
    btn.className = 'player-picker-btn';
    btn.innerHTML = `
      <div class="picker-dot" style="background:${playerData.color}${name === 'Braelyn' ? ';border-color:#fff' : ''}"></div>
      <span class="picker-name">${name}</span>
    `;
    btn.addEventListener('click', () => {
      state.playerModeName = name;
      try { localStorage.setItem('playbook:playerName', name); } catch(e) {}
      // Apply playbook sub overlay for this player
      applyPlayerModeSubOverlay(name);
      overlay.style.display = 'none';
      buildPlaySelector();
      // Select first play and auto-replay
      const playerPlays = getPlayerModePlays();
      if (playerPlays.length > 0) {
        const idx = PLAYS.indexOf(playerPlays[0]);
        if (_selectPlay) _selectPlay(idx);
      }
    });
    grid.appendChild(btn);
  });

  overlay.style.display = '';
}
