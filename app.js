// app.js — Orchestrator: wires all modules together
// PLAYS and PLAYERS are globals loaded from plays.js (regular script)

import {
  state, getAnimStart, loadQueueState, loadPreferences, loadCustomPlays, loadSubstitutions,
  loadActivePlaySet, loadActivePlaySetTag, parseURLParams, getPlayerModePlays,
} from './modules/state.js';

import {
  initCanvas, resizeCanvas, drawFrame,
} from './modules/renderer.js';

import {
  startAnimation, updateTimer, togglePlayPause, replay,
  setUpdateTimerFn,
} from './modules/animation.js';

import {
  buildPlaySelector, buildPlayerFilter, buildControls, updateInfoPanel, applyModeVisibility,
  setSelectPlayFn as uiSetSelectPlay, showPlayerPicker,
} from './modules/ui.js';

import {
  setupCoachPanel, updateCoachRecs,
  setSelectPlayFn as coachSetSelectPlay,
} from './modules/coach.js';

import {
  renderQueue, markPlay, advanceQueue,
  setSelectPlayFn as queueSetSelectPlay,
  setBuildPlaySelectorFn,
} from './modules/queue.js';

import {
  setupTouch, setupKeyboard,
  setSelectPlayFn as touchSetSelectPlay,
} from './modules/touch.js';

import {
  buildEditToolbar, setupEditorCanvasEvents,
  setEditorCallbacks, handleEditToggle,
} from './modules/editor.js';

import {
  initRoster, setSelectPlayFn as rosterSetSelectPlay,
} from './modules/roster.js';

import {
  setupGamedayPanel, openGamedayPanel, closeGamedayPanel,
  setSelectPlayFn as gamedaySetSelectPlay,
} from './modules/gameday.js';

// ── selectPlay — central navigation function ──────────────────

function selectPlay(idx) {
  state.currentPlayIdx = idx;
  state.animTime = getAnimStart(PLAYS[idx]);
  state.playing = false;
  state.highlightPlayer = null;
  state.lastFrameTs = null;

  const btn = document.getElementById('btn-play');
  if (btn) btn.textContent = '▶';

  buildPlaySelector();
  buildPlayerFilter();
  updateInfoPanel();
  drawFrame();
  updateTimer();

  const btns = document.querySelectorAll('.play-btn');
  if (btns[idx]) btns[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

  // Auto-play in coach and player modes
  if (state.appMode === 'coach' || state.appMode === 'player') {
    setTimeout(() => replay(), 200);
  }
}

// ── Coach & Queue panel accordion (mutually exclusive) ────────

function setupPanelToggles() {
  const queueBtn = document.getElementById('btn-queue');
  const queueBar = document.getElementById('queue-bar');

  queueBtn.addEventListener('click', () => {
    state.queueMode = !state.queueMode;
    queueBtn.style.opacity = state.queueMode ? '1' : '0.4';
    renderQueue();
    buildPlaySelector();
  });

  document.getElementById('queue-success').addEventListener('click', () => markPlay('success'));
  document.getElementById('queue-fail').addEventListener('click', () => markPlay('fail'));
  document.getElementById('queue-next').addEventListener('click', () => advanceQueue(1));
  document.getElementById('queue-prev').addEventListener('click', () => advanceQueue(-1));
  document.getElementById('queue-clear').addEventListener('click', () => {
    state.queue = [];
    state.queuePos = 0;
    try { localStorage.removeItem('playbook:queueState'); } catch (e) {}
    renderQueue();
  });
}

// ── Game Day button ───────────────────────────────────────────

function setupGamedayButton() {
  const gamedayBtn = document.getElementById('btn-gameday');
  if (!gamedayBtn) return;
  gamedayBtn.addEventListener('click', () => {
    const panel = document.getElementById('gameday-panel');
    if (panel && panel.classList.contains('open')) {
      closeGamedayPanel();
      gamedayBtn.style.opacity = '0.4';
    } else {
      openGamedayPanel();
      gamedayBtn.style.opacity = '1';
      setupCoachPanel();
      // Wire up situation section collapsible
      const sitToggle = document.getElementById('gd-sit-toggle');
      const sitBody = document.getElementById('gd-sit-body');
      if (sitToggle && sitBody && !sitToggle._wired) {
        sitToggle._wired = true;
        sitToggle.addEventListener('click', () => {
          sitBody.classList.toggle('collapsed');
          sitToggle.classList.toggle('collapsed');
        });
      }
    }
  });
}

// ── Edit button ───────────────────────────────────────────────

function setupEditButton() {
  const editBtn = document.getElementById('btn-edit');
  if (!editBtn) return;
  editBtn.addEventListener('click', () => {
    handleEditToggle();
  });
}

// ── Init ──────────────────────────────────────────────────────

function init() {
  // Parse URL params FIRST — sets appMode and overrides before anything else
  parseURLParams();
  document.body.dataset.mode = state.appMode;

  // Load saved preferences before rendering
  loadPreferences();
  loadQueueState();
  loadCustomPlays(); // Load custom plays from localStorage into PLAYS array
  loadSubstitutions();    // Load persisted per-play subs
  loadActivePlaySet();    // Load game day play filter (custom set)
  loadActivePlaySetTag(); // Load predefined set tag (core/extended/etc.)

  // Wire up selectPlay callbacks in each module
  uiSetSelectPlay(selectPlay);
  coachSetSelectPlay(selectPlay);
  queueSetSelectPlay(selectPlay);
  touchSetSelectPlay(selectPlay);
  rosterSetSelectPlay(selectPlay);
  gamedaySetSelectPlay(selectPlay);
  setBuildPlaySelectorFn(buildPlaySelector);

  // Pass updateTimer to animation loop
  setUpdateTimerFn(updateTimer);

  // QB Mode button
  const qbBtn = document.getElementById('btn-qb');
  if (qbBtn) {
    qbBtn.addEventListener('click', () => {
      state.qbMode = !state.qbMode;
      qbBtn.style.opacity = state.qbMode ? '1' : '0.4';
      updateInfoPanel();
    });
  }

  // Restore sunlight button opacity if mode was loaded
  if (state.sunlightMode) {
    const sunBtn = document.getElementById('btn-sun');
    if (sunBtn) sunBtn.style.opacity = '1';
  }

  initCanvas();

  // Wire up editor callbacks
  setEditorCallbacks(buildPlaySelector, updateInfoPanel, selectPlay);
  buildEditToolbar();
  setupEditorCanvasEvents(document.getElementById('field-canvas'));
  setupEditButton();

  applyModeVisibility();
  buildPlaySelector();
  buildPlayerFilter();
  buildControls();
  updateInfoPanel();
  updateTimer();
  setupTouch();
  setupKeyboard();
  setupPanelToggles();
  initRoster(); // Phase 3: initialize roster/lineup panel
  setupGamedayPanel(); // Phase 4: initialize game day call sheet
  setupGamedayButton(); // Phase 4: wire up 🎯 button

  window.addEventListener('resize', () => {
    resizeCanvas();
    updateTimer();
  });

  // Show player picker if in player mode with no name
  if (state.appMode === 'player' && !state.playerModeName) {
    const savedName = localStorage.getItem('playbook:playerName');
    if (savedName && PLAYERS[savedName]) {
      state.playerModeName = savedName;
    } else {
      showPlayerPicker();
    }
  }

  // Player mode: prev/next nav buttons
  if (state.appMode === 'player') {
    const navEl = document.getElementById('player-nav');
    if (navEl) navEl.style.display = '';

    const prevBtn = document.getElementById('btn-prev-play');
    const nextBtn = document.getElementById('btn-next-play');
    const playerPlays = getPlayerModePlays();

    if (prevBtn) prevBtn.addEventListener('click', () => {
      const currentIdx = playerPlays.findIndex(p => PLAYS.indexOf(p) === state.currentPlayIdx);
      const prevIdx = currentIdx > 0 ? currentIdx - 1 : playerPlays.length - 1;
      selectPlay(PLAYS.indexOf(playerPlays[prevIdx]));
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      const currentIdx = playerPlays.findIndex(p => PLAYS.indexOf(p) === state.currentPlayIdx);
      const nextIdx = currentIdx < playerPlays.length - 1 ? currentIdx + 1 : 0;
      selectPlay(PLAYS.indexOf(playerPlays[nextIdx]));
    });
  }

  // Start from pre-snap and auto-play
  state.animTime = getAnimStart(PLAYS[state.currentPlayIdx]);
  drawFrame();
  updateTimer();
  setTimeout(() => startAnimation(), 500);

  // Auto-play first animation in player mode
  if (state.appMode === 'player' && state.playerModeName) {
    setTimeout(() => replay(), 500);
  }
}

// Mode switcher
  const modeSwitchBtn = document.getElementById('btn-mode-switch');
  const modeOverlay = document.getElementById('mode-overlay');
  const modeClose = document.getElementById('mode-overlay-close');

  if (modeSwitchBtn) {
    modeSwitchBtn.addEventListener('click', () => {
      modeOverlay.style.display = '';
    });
  }

  if (modeClose) {
    modeClose.addEventListener('click', () => {
      modeOverlay.style.display = 'none';
    });
  }

  document.querySelectorAll('.mode-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.modeTarget;
      const url = new URL(window.location);
      url.searchParams.set('mode', target);
      if (target !== 'player') url.searchParams.delete('name');
      window.location.href = url.toString();
    });
  });

  // Triple-tap on canvas to reveal mode switcher in player mode
  if (state.appMode === 'player') {
    let tapCount = 0;
    let tapTimer = null;
    const canvas = document.getElementById('field-canvas');
    if (canvas) {
      canvas.addEventListener('click', () => {
        tapCount++;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tapCount = 0; }, 800);
        if (tapCount >= 3) {
          tapCount = 0;
          const switchBtn = document.getElementById('btn-mode-switch');
          if (switchBtn) {
            switchBtn.classList.add('revealed');
            setTimeout(() => switchBtn.classList.remove('revealed'), 5000);
          }
        }
      });
    }
  }

// Modules are always deferred; DOM is ready by the time this runs
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
