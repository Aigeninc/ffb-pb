// modules/practice.js — Practice Plan Builder module
// Replaces warmups.js entirely

import { DRILLS, CUSTOM_DRILLS, TEMPLATES, CATEGORY_META, getDrillById, getAllDrills } from './drills.js';
import {
  state,
  savePracticePlans, loadPracticePlans,
  saveCustomDrillsToStorage, loadCustomDrillsFromStorage,
  saveLastPracticePlan, loadLastPracticePlan,
  savePracticeTimerMode, loadPracticeTimerMode,
} from './state.js';

// ── Module-level state ────────────────────────────────────────
let selectPlayFn = null;
let timerRAF = null;
let timerLastTs = null;
let drillPickerInsertAfter = -1; // index to insert after (-1 = end)
let drillPickerCategory = 'all';
let expandedBlockIdx = null;
let showTemplates = false;
let showSavedPlans = false;
let showCustomDrillForm = false;
let playLinkTarget = null; // block idx whose play selector is open

// ── Public API ────────────────────────────────────────────────

export function setSelectPlayFn(fn) {
  selectPlayFn = fn;
}

export function initPractice() {
  // Load persisted data
  loadPracticePlans();
  loadPracticeTimerMode();

  // Load custom drills into the registry
  const savedCustom = loadCustomDrillsFromStorage();
  savedCustom.forEach(d => {
    d.isCustom = true;
    if (!CUSTOM_DRILLS.find(x => x.id === d.id)) {
      CUSTOM_DRILLS.push(d);
    }
  });

  // Restore last active plan
  const lastId = loadLastPracticePlan();
  if (lastId && !state.activePracticePlan) {
    const found = state.practicePlans.find(p => p.id === lastId);
    if (found) state.activePracticePlan = JSON.parse(JSON.stringify(found));
  }

  // Wire up the button
  const btn = document.getElementById('btn-practice');
  if (btn) {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('practice-panel');
      if (panel && panel.classList.contains('open')) {
        closePracticePanel();
        btn.style.opacity = '0.4';
      } else {
        openPracticePanel();
        btn.style.opacity = '1';
      }
    });
  }

  const closeBtn = document.getElementById('practice-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    closePracticePanel();
    const b = document.getElementById('btn-practice');
    if (b) b.style.opacity = '0.4';
  });

  const backdrop = document.getElementById('practice-backdrop');
  if (backdrop) backdrop.addEventListener('click', () => {
    closePracticePanel();
    const b = document.getElementById('btn-practice');
    if (b) b.style.opacity = '0.4';
  });
}

export function openPracticePanel() {
  const panel = document.getElementById('practice-panel');
  const backdrop = document.getElementById('practice-backdrop');
  if (!panel) return;
  // Reset sub-views
  showTemplates = false;
  showCustomDrillForm = false;
  playLinkTarget = null;
  drillPickerInsertAfter = -2; // sentinel: not in picker mode
  renderPanel();
  panel.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
}

export function closePracticePanel() {
  const panel = document.getElementById('practice-panel');
  const backdrop = document.getElementById('practice-backdrop');
  if (!panel) return;
  panel.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
  stopTimer();
}

// ── Main render router ────────────────────────────────────────

function renderPanel() {
  const body = document.getElementById('practice-body');
  if (!body) return;

  if (drillPickerInsertAfter >= -1) {
    body.innerHTML = renderDrillPicker();
    wireDrillPicker(body);
    return;
  }

  if (showCustomDrillForm) {
    body.innerHTML = renderCustomDrillForm();
    wireCustomDrillForm(body);
    return;
  }

  if (showTemplates) {
    body.innerHTML = renderTemplatePicker();
    wireTemplatePicker(body);
    return;
  }

  if (state.practiceRunning && state.activePracticePlan) {
    body.innerHTML = renderRunView();
    wireRunView(body);
    return;
  }

  body.innerHTML = renderBuilderView();
  wireBuilderView(body);
}

// ── Builder View ──────────────────────────────────────────────

function renderBuilderView() {
  const plan = state.activePracticePlan;
  const hasplan = !!plan;
  const used = hasplan ? getTimeUsed(plan) : 0;
  const total = hasplan ? plan.totalMinutes : 75;
  const pct = total > 0 ? Math.min(100, Math.round(used / total * 100)) : 0;
  const barColor = pct > 100 ? '#ef4444' : pct > 85 ? '#f59e0b' : '#22c55e';

  let headerHtml = `<div class="pp-plan-header">`;

  if (hasplan) {
    headerHtml += `
      <div class="pp-plan-name-row">
        <input class="pp-plan-name-input" id="pp-plan-name" value="${escHtml(plan.name)}" placeholder="Plan name...">
        <button class="pp-new-plan-btn" id="pp-new-plan">＋ New</button>
      </div>
      <div class="pp-duration-row">
        <span class="pp-dur-label">Target:</span>
        ${[60,75,90].map(m => `<button class="pp-duration-pill${plan.totalMinutes===m?' active':''}" data-mins="${m}">${m}m</button>`).join('')}
        <input class="pp-duration-custom" id="pp-dur-custom" type="number" min="30" max="180" value="${plan.totalMinutes}" style="width:44px">
      </div>
      <div class="pp-time-bar-row">
        <div class="pp-time-bar">
          <div class="pp-time-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <span class="pp-time-label">${used} / ${total} min</span>
      </div>
    `;
  } else {
    headerHtml += `
      <div class="pp-no-plan">
        <div class="pp-no-plan-msg">No practice plan loaded</div>
        <button class="pp-action-btn pp-action-primary" id="pp-new-plan">＋ Create New Plan</button>
      </div>
    `;
  }
  headerHtml += `</div>`;

  let blocksHtml = '';
  if (hasplan && plan.blocks.length > 0) {
    blocksHtml = `<div class="pp-blocks">`;
    plan.blocks.forEach((block, idx) => {
      blocksHtml += renderBlockCard(block, idx, plan.blocks.length);
    });
    blocksHtml += `</div>`;
  }

  let addDrillBtn = hasplan
    ? `<button class="pp-add-drill-btn" data-after="${(plan.blocks.length - 1)}">＋ Add Drill</button>`
    : '';

  let actionBar = '';
  if (hasplan) {
    actionBar = `
      <div class="pp-action-bar">
        <div class="pp-action-row">
          <button class="pp-action-btn" id="pp-save">💾 Save</button>
          <button class="pp-action-btn" id="pp-duplicate">📋 Copy</button>
          <button class="pp-action-btn pp-action-danger" id="pp-delete-plan">🗑️</button>
        </div>
        <button class="pp-action-btn pp-action-primary pp-run-btn" id="pp-run">▶ Run This Plan</button>
      </div>
    `;
  }

  let savedPlansHtml = renderSavedPlansList();

  return headerHtml + blocksHtml + addDrillBtn + actionBar + savedPlansHtml;
}

function renderBlockCard(block, idx, total) {
  const drill = getDrillById(block.drillId);
  if (!drill) return '';
  const cat = CATEGORY_META[drill.category] || { emoji: '📋', label: drill.category, color: '#888' };
  const isExpanded = expandedBlockIdx === idx;
  const hasNote = block.notes && block.notes.trim();
  const hasLinkedPlays = block.linkedPlays && block.linkedPlays.length > 0;

  let detail = '';
  if (isExpanded) {
    const pts = drill.coachingPoints.map(p => `<li>${escHtml(p)}</li>`).join('');
    const equipment = drill.equipment && drill.equipment.length
      ? `<div class="pp-block-equip">🎒 ${drill.equipment.join(', ')}</div>` : '';

    let playLinkerHtml = '';
    if (drill.linkedPlays === true) {
      playLinkerHtml = renderPlayLinker(block, idx);
    }

    detail = `
      <div class="pp-block-detail">
        <div class="pp-block-setup">${escHtml(drill.setup)}</div>
        <div class="pp-time-stepper">
          <span class="pp-step-label">Duration:</span>
          <button class="pp-step-btn" data-action="dec" data-idx="${idx}">−</button>
          <span class="pp-step-val">${block.duration} min</span>
          <button class="pp-step-btn" data-action="inc" data-idx="${idx}">＋</button>
        </div>
        <textarea class="pp-notes-input" data-idx="${idx}" placeholder="Coach notes for this block...">${escHtml(block.notes || '')}</textarea>
        ${playLinkerHtml}
        <ul class="pp-block-points">${pts}</ul>
        ${equipment}
        <div class="pp-block-actions">
          ${idx > 0 ? `<button class="pp-block-act-btn" data-action="up" data-idx="${idx}">↑ Up</button>` : ''}
          ${idx < total - 1 ? `<button class="pp-block-act-btn" data-action="down" data-idx="${idx}">↓ Down</button>` : ''}
          <button class="pp-block-act-btn pp-act-danger" data-action="remove" data-idx="${idx}">🗑️ Remove</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="pp-block${isExpanded ? ' expanded' : ''}" data-idx="${idx}">
      <div class="pp-block-header" data-expand="${idx}">
        <span class="pp-block-num">${idx + 1}</span>
        <span class="pp-block-name">${escHtml(drill.name)}${drill.isCustom ? ' ✨' : ''}</span>
        <span class="pp-block-time">${block.duration}m</span>
        <span class="pp-block-cat" style="background:${cat.color}22;color:${cat.color}">${cat.emoji} ${cat.label}</span>
        <span class="pp-block-chevron">${isExpanded ? '▲' : '▼'}</span>
      </div>
      ${!isExpanded && hasNote ? `<div class="pp-block-note-preview">📝 ${escHtml(block.notes)}</div>` : ''}
      ${!isExpanded && hasLinkedPlays ? `<div class="pp-block-note-preview">🏈 ${block.linkedPlays.join(', ')}</div>` : ''}
      ${detail}
    </div>
  `;
}

function renderPlayLinker(block, idx) {
  const linkedPlays = block.linkedPlays || [];
  const chips = linkedPlays.map(name => `
    <span class="pp-play-chip">
      ${escHtml(name)}
      <button class="pp-play-chip-remove" data-blockidx="${idx}" data-play="${escHtml(name)}">✕</button>
    </span>
  `).join('');

  let selectorHtml = '';
  if (playLinkTarget === idx) {
    const allPlays = (typeof PLAYS !== 'undefined') ? PLAYS : [];
    const opts = allPlays.filter(p => !linkedPlays.includes(p.name)).map(p => `
      <div class="pp-play-option" data-blockidx="${idx}" data-play="${escHtml(p.name)}">${escHtml(p.name)}</div>
    `).join('');
    selectorHtml = `<div class="pp-play-selector">${opts || '<div class="pp-play-option-empty">No plays available</div>'}</div>`;
  }

  return `
    <div class="pp-play-linker">
      <div class="pp-play-linker-label">🏈 Linked Plays:</div>
      <div class="pp-play-chips">${chips}</div>
      <button class="pp-add-play-link-btn" data-blockidx="${idx}">＋ Link a Play</button>
      ${selectorHtml}
    </div>
  `;
}

function renderSavedPlansList() {
  const plans = state.practicePlans;
  if (plans.length === 0) return '';

  const currentId = state.activePracticePlan ? state.activePracticePlan.id : null;

  const rows = plans.map(p => {
    const used = getTimeUsed(p);
    const date = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    const isActive = p.id === currentId;
    return `
      <div class="pp-saved-plan-row${isActive ? ' active' : ''}">
        <div class="pp-saved-plan-info" data-load="${p.id}">
          <span class="pp-saved-plan-name">${escHtml(p.name)}</span>
          <span class="pp-saved-plan-meta">${used} min · ${date}</span>
        </div>
        <button class="pp-saved-plan-del" data-del="${p.id}">🗑️</button>
      </div>
    `;
  }).join('');

  return `
    <div class="pp-saved-plans">
      <div class="pp-saved-plans-title">── Saved Plans ──</div>
      ${rows}
    </div>
  `;
}

// ── Drill Picker ──────────────────────────────────────────────

function renderDrillPicker() {
  const cats = ['all', ...Object.keys(CATEGORY_META)];
  const pills = cats.map(c => {
    const meta = CATEGORY_META[c] || { emoji: '', label: 'All' };
    const label = c === 'all' ? 'All' : `${meta.emoji} ${meta.label}`;
    return `<button class="pp-cat-pill${drillPickerCategory === c ? ' active' : ''}" data-cat="${c}">${label}</button>`;
  }).join('');

  const allDrills = getAllDrills();
  const filtered = drillPickerCategory === 'all'
    ? allDrills
    : allDrills.filter(d => d.category === drillPickerCategory);

  const drillCards = filtered.map(d => {
    const cat = CATEGORY_META[d.category] || { emoji: '📋', label: d.category, color: '#888' };
    return `
      <div class="pp-drill-card" data-drillid="${d.id}">
        <div class="pp-drill-card-top">
          <span class="pp-drill-card-name">${escHtml(d.name)}${d.isCustom ? ' ✨' : ''}</span>
          <span class="pp-drill-card-dur">${d.duration}m</span>
        </div>
        <div class="pp-drill-card-meta">
          <span class="pp-drill-cat-tag" style="background:${cat.color}22;color:${cat.color}">${cat.emoji} ${cat.label}</span>
        </div>
        <div class="pp-drill-card-desc">${escHtml(d.description)}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="pp-drill-picker">
      <div class="pp-drill-picker-header">
        <button class="pp-back-btn" id="pp-picker-back">← Back</button>
        <span class="pp-picker-title">Add Drill</span>
      </div>
      <div class="pp-cat-pills">${pills}</div>
      <div class="pp-drill-list">
        ${drillCards}
        <div class="pp-custom-drill-btn" id="pp-custom-drill-btn">＋ Create Custom Drill</div>
      </div>
    </div>
  `;
}

// ── Template Picker ───────────────────────────────────────────

function renderTemplatePicker() {
  const cards = TEMPLATES.map(t => `
    <div class="pp-template-card" data-templateid="${t.id}">
      <div class="pp-template-name">${t.emoji} ${escHtml(t.name)}</div>
      <div class="pp-template-drills">${t.drills.map(b => {
        const d = getDrillById(b.drillId);
        return d ? escHtml(d.name) : b.drillId;
      }).join(' → ')}</div>
    </div>
  `).join('');

  return `
    <div class="pp-templates">
      <div class="pp-drill-picker-header">
        <button class="pp-back-btn" id="pp-template-back">← Back</button>
        <span class="pp-picker-title">New Plan</span>
      </div>
      <div class="pp-template-list">
        ${cards}
      </div>
    </div>
  `;
}

// ── Custom Drill Form ─────────────────────────────────────────

function renderCustomDrillForm() {
  const cats = Object.entries(CATEGORY_META).map(([k, v]) =>
    `<option value="${k}">${v.emoji} ${v.label}</option>`
  ).join('');

  return `
    <div class="pp-custom-form">
      <div class="pp-drill-picker-header">
        <button class="pp-back-btn" id="pp-custom-back">← Back</button>
        <span class="pp-picker-title">Create Custom Drill</span>
      </div>
      <div class="pp-form-body">
        <label class="pp-form-label">Drill Name</label>
        <input class="pp-form-input" id="pp-custom-name" placeholder="e.g. Flag Tag Game" maxlength="50">

        <label class="pp-form-label">Category</label>
        <select class="pp-form-input" id="pp-custom-cat">${cats}</select>

        <label class="pp-form-label">Default Duration (min)</label>
        <div class="pp-time-stepper">
          <button class="pp-step-btn" id="pp-cust-dec">−</button>
          <span class="pp-step-val" id="pp-cust-dur-val">5 min</span>
          <button class="pp-step-btn" id="pp-cust-inc">＋</button>
          <input type="hidden" id="pp-custom-dur" value="5">
        </div>

        <label class="pp-form-label">Description</label>
        <textarea class="pp-form-input pp-form-textarea" id="pp-custom-desc" placeholder="What happens in this drill?" rows="3"></textarea>

        <label class="pp-form-label">Setup</label>
        <textarea class="pp-form-input pp-form-textarea" id="pp-custom-setup" placeholder="How to set up..." rows="2"></textarea>

        <button class="pp-action-btn pp-action-primary" id="pp-custom-save">💾 Save Custom Drill</button>
      </div>
    </div>
  `;
}

// ── Run View ──────────────────────────────────────────────────

function renderRunView() {
  const plan = state.activePracticePlan;
  if (!plan || !plan.blocks.length) return '<div class="pp-run-empty">No blocks in plan.</div>';

  const idx = state.practiceBlockIdx;
  const block = plan.blocks[idx];
  if (!block) return '<div class="pp-run-empty">Invalid block.</div>';

  const drill = getDrillById(block.drillId);
  if (!drill) return '<div class="pp-run-empty">Drill not found.</div>';

  const cat = CATEGORY_META[drill.category] || { emoji: '📋', label: drill.category, color: '#888' };

  // Timer display
  const mode = state.practiceTimerMode;
  const isTimer = mode === 'timer';
  const secs = isTimer ? state.practiceTimerRemaining : state.practiceTimerElapsed;
  const m = Math.floor(secs / 60);
  const s = String(Math.floor(secs % 60)).padStart(2, '0');
  const timeStr = `${m}:${s}`;

  const timerClass = (() => {
    if (!state.practiceTimerActive && secs === 0 && isTimer) return 'pp-run-timer expired';
    if (state.practiceTimerActive) return isTimer ? 'pp-run-timer running' : 'pp-run-timer stopwatch';
    return 'pp-run-timer paused';
  })();

  const modeLabel = isTimer ? '⬇ Timer' : '⬆ Stopwatch';

  // Coaching points
  const pts = drill.coachingPoints.map(p => `<li>${escHtml(p)}</li>`).join('');

  // Coach note
  const noteHtml = block.notes
    ? `<div class="pp-run-note">📝 ${escHtml(block.notes)}</div>`
    : '';

  // Linked plays in run view
  let linkedPlaysHtml = '';
  if (drill.linkedPlays === true && block.linkedPlays && block.linkedPlays.length > 0) {
    const chips = block.linkedPlays.map(name =>
      `<button class="pp-run-play-chip" data-play="${escHtml(name)}">${escHtml(name)}</button>`
    ).join('');
    linkedPlaysHtml = `<div class="pp-run-linked"><span class="pp-run-linked-label">🏈 Plays:</span><div class="pp-run-play-chips">${chips}</div></div>`;
  }

  // Progress dots
  const dots = plan.blocks.map((b, i) => {
    const d = getDrillById(b.drillId);
    const cls = i < idx ? 'pp-dot done' : i === idx ? 'pp-dot current' : 'pp-dot';
    const title = d ? escHtml(d.name) : '';
    return `<span class="${cls}" title="${title}"></span>`;
  }).join('');

  const remainingBlocks = plan.blocks.length - idx - 1;
  const remainingMins = plan.blocks.slice(idx + 1).reduce((sum, b) => sum + b.duration, 0);

  const isLast = idx >= plan.blocks.length - 1;
  const isFirst = idx === 0;

  return `
    <div class="pp-run-view">
      <div class="pp-run-cat-tag" style="background:${cat.color}22;color:${cat.color}">${cat.emoji} ${cat.label}</div>
      <div class="pp-run-drill-name">${escHtml(drill.name)}</div>

      <div class="pp-run-timer-area">
        <div class="${timerClass}" id="pp-run-timer" title="Tap to toggle timer/stopwatch">${timeStr}</div>
        <button class="pp-timer-mode-btn" id="pp-timer-mode-btn">${modeLabel}</button>
      </div>

      <div class="pp-run-points-card">
        <div class="pp-run-points-title">🎯 Coaching Points</div>
        <ul class="pp-run-points">${pts}</ul>
      </div>

      <details class="pp-run-setup-details">
        <summary class="pp-run-setup-summary">📋 Setup (tap to see)</summary>
        <div class="pp-run-setup">${escHtml(drill.setup)}</div>
      </details>

      ${noteHtml}
      ${linkedPlaysHtml}

      <div class="pp-run-nav">
        <button class="pp-run-nav-btn" id="pp-run-prev" ${isFirst ? 'disabled' : ''}>◀ Prev</button>
        <button class="pp-run-nav-btn pp-run-pause" id="pp-run-pause">${state.practiceTimerActive ? '⏸' : '▶'}</button>
        <button class="pp-run-nav-btn" id="pp-run-next">${isLast ? 'Finish ✓' : 'Next ▶'}</button>
      </div>

      <div class="pp-progress-area">
        <div class="pp-progress-dots">${dots}</div>
        <div class="pp-progress-label">${idx + 1}/${plan.blocks.length} blocks · ${remainingMins} min left</div>
      </div>

      <button class="pp-exit-run-btn" id="pp-exit-run">← Edit Plan</button>
    </div>
  `;
}

// ── Wire-up functions ─────────────────────────────────────────

function wireBuilderView(body) {
  const plan = state.activePracticePlan;

  // New plan button
  const newPlanBtn = body.querySelector('#pp-new-plan');
  if (newPlanBtn) {
    newPlanBtn.addEventListener('click', () => {
      showTemplates = true;
      renderPanel();
    });
  }

  if (!plan) return;

  // Plan name edit
  const nameInput = body.querySelector('#pp-plan-name');
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      plan.name = nameInput.value;
    });
    nameInput.addEventListener('blur', () => {
      plan.name = nameInput.value.trim() || 'Untitled Plan';
    });
  }

  // Duration pills
  body.querySelectorAll('.pp-duration-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      plan.totalMinutes = parseInt(pill.dataset.mins);
      renderPanel();
    });
  });

  // Custom duration input
  const durInput = body.querySelector('#pp-dur-custom');
  if (durInput) {
    durInput.addEventListener('change', () => {
      const v = parseInt(durInput.value);
      if (v >= 10 && v <= 300) {
        plan.totalMinutes = v;
        renderPanel();
      }
    });
  }

  // Block expand/collapse
  body.querySelectorAll('[data-expand]').forEach(header => {
    header.addEventListener('click', () => {
      const idx = parseInt(header.dataset.expand);
      expandedBlockIdx = expandedBlockIdx === idx ? null : idx;
      playLinkTarget = null;
      renderPanel();
    });
  });

  // Time steppers
  body.querySelectorAll('.pp-step-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const delta = btn.dataset.action === 'inc' ? 1 : -1;
      updateBlockDuration(idx, delta);
    });
  });

  // Notes textarea
  body.querySelectorAll('.pp-notes-input').forEach(ta => {
    ta.addEventListener('input', () => {
      const idx = parseInt(ta.dataset.idx);
      if (plan.blocks[idx]) plan.blocks[idx].notes = ta.value;
    });
    ta.addEventListener('click', e => e.stopPropagation());
  });

  // Block actions (up/down/remove)
  body.querySelectorAll('.pp-block-act-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.idx);
      const action = btn.dataset.action;
      if (action === 'remove') removeBlock(idx);
      else if (action === 'up') moveBlock(idx, -1);
      else if (action === 'down') moveBlock(idx, 1);
    });
  });

  // Add drill buttons
  body.querySelectorAll('.pp-add-drill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      drillPickerInsertAfter = parseInt(btn.dataset.after);
      drillPickerCategory = 'all';
      renderPanel();
    });
  });

  // Play linker — chip remove
  body.querySelectorAll('.pp-play-chip-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const bidx = parseInt(btn.dataset.blockidx);
      const play = btn.dataset.play;
      if (plan.blocks[bidx]) {
        plan.blocks[bidx].linkedPlays = (plan.blocks[bidx].linkedPlays || []).filter(p => p !== play);
        renderPanel();
      }
    });
  });

  // Play linker — open selector
  body.querySelectorAll('.pp-add-play-link-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const bidx = parseInt(btn.dataset.blockidx);
      playLinkTarget = playLinkTarget === bidx ? null : bidx;
      renderPanel();
    });
  });

  // Play linker — select a play
  body.querySelectorAll('.pp-play-option').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      const bidx = parseInt(opt.dataset.blockidx);
      const play = opt.dataset.play;
      if (plan.blocks[bidx]) {
        if (!plan.blocks[bidx].linkedPlays) plan.blocks[bidx].linkedPlays = [];
        if (!plan.blocks[bidx].linkedPlays.includes(play)) {
          plan.blocks[bidx].linkedPlays.push(play);
        }
        playLinkTarget = null;
        renderPanel();
      }
    });
  });

  // Save
  const saveBtn = body.querySelector('#pp-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => savePlan());
  }

  // Duplicate
  const dupBtn = body.querySelector('#pp-duplicate');
  if (dupBtn) {
    dupBtn.addEventListener('click', () => {
      if (plan) duplicatePlan(plan.id);
    });
  }

  // Delete plan
  const delPlanBtn = body.querySelector('#pp-delete-plan');
  if (delPlanBtn) {
    delPlanBtn.addEventListener('click', () => {
      if (plan && confirm(`Delete "${plan.name}"?`)) {
        deletePlan(plan.id);
      }
    });
  }

  // Run
  const runBtn = body.querySelector('#pp-run');
  if (runBtn) {
    runBtn.addEventListener('click', () => startPracticeRun());
  }

  // Saved plans — load
  body.querySelectorAll('[data-load]').forEach(el => {
    el.addEventListener('click', () => {
      const planId = el.dataset.load;
      const found = state.practicePlans.find(p => p.id === planId);
      if (found) {
        if (state.activePracticePlan && state.activePracticePlan.id !== planId) {
          if (!confirm('Load this plan? Unsaved changes will be lost.')) return;
        }
        loadPlan(planId);
      }
    });
  });

  // Saved plans — delete
  body.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const planId = btn.dataset.del;
      const found = state.practicePlans.find(p => p.id === planId);
      if (found && confirm(`Delete "${found.name}"?`)) {
        deletePlan(planId);
      }
    });
  });
}

function wireDrillPicker(body) {
  // Back button
  const backBtn = body.querySelector('#pp-picker-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      drillPickerInsertAfter = -2;
      renderPanel();
    });
  }

  // Category pills
  body.querySelectorAll('.pp-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      drillPickerCategory = pill.dataset.cat;
      renderPanel();
    });
  });

  // Drill cards — tap to add
  body.querySelectorAll('.pp-drill-card').forEach(card => {
    card.addEventListener('click', () => {
      const drillId = card.dataset.drillid;
      addBlock(drillId, drillPickerInsertAfter);
      drillPickerInsertAfter = -2;
      renderPanel();
    });
  });

  // Create custom drill
  const customBtn = body.querySelector('#pp-custom-drill-btn');
  if (customBtn) {
    customBtn.addEventListener('click', () => {
      showCustomDrillForm = true;
      drillPickerInsertAfter = -2; // stay in picker flow
      renderPanel();
    });
  }
}

function wireTemplatePicker(body) {
  const backBtn = body.querySelector('#pp-template-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showTemplates = false;
      renderPanel();
    });
  }

  body.querySelectorAll('.pp-template-card').forEach(card => {
    card.addEventListener('click', () => {
      createNewPlan(card.dataset.templateid);
      showTemplates = false;
      renderPanel();
    });
  });
}

function wireCustomDrillForm(body) {
  const backBtn = body.querySelector('#pp-custom-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showCustomDrillForm = false;
      drillPickerInsertAfter = -1; // return to drill picker
      renderPanel();
    });
  }

  // Duration stepper
  const durInput = body.querySelector('#pp-custom-dur');
  const durVal = body.querySelector('#pp-cust-dur-val');
  let customDur = 5;

  const decBtn = body.querySelector('#pp-cust-dec');
  const incBtn = body.querySelector('#pp-cust-inc');

  if (decBtn) decBtn.addEventListener('click', () => {
    customDur = Math.max(1, customDur - 1);
    if (durVal) durVal.textContent = `${customDur} min`;
    if (durInput) durInput.value = customDur;
  });
  if (incBtn) incBtn.addEventListener('click', () => {
    customDur = Math.min(60, customDur + 1);
    if (durVal) durVal.textContent = `${customDur} min`;
    if (durInput) durInput.value = customDur;
  });

  const saveBtn = body.querySelector('#pp-custom-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = (body.querySelector('#pp-custom-name')?.value || '').trim();
      const cat = body.querySelector('#pp-custom-cat')?.value || 'team';
      const dur = parseInt(body.querySelector('#pp-custom-dur')?.value || '5');
      const desc = (body.querySelector('#pp-custom-desc')?.value || '').trim();
      const setup = (body.querySelector('#pp-custom-setup')?.value || '').trim();

      if (!name) { alert('Please enter a drill name.'); return; }

      saveCustomDrill({
        id: 'custom-' + Date.now(),
        name,
        category: cat,
        duration: dur || 5,
        description: desc || name,
        setup: setup || 'Set up as needed.',
        coachingPoints: [],
        playerCount: { min: 1, ideal: 10 },
        equipment: [],
        difficulty: 1,
        isCustom: true,
      });

      showCustomDrillForm = false;
      drillPickerInsertAfter = -1; // go back to picker so they can add it
      renderPanel();
    });
  }
}

function wireRunView(body) {
  // Timer tap-to-toggle mode
  const timerEl = body.querySelector('#pp-run-timer');
  if (timerEl) {
    timerEl.addEventListener('click', () => {
      toggleTimerMode();
    });
  }

  // Mode button
  const modeBtnEl = body.querySelector('#pp-timer-mode-btn');
  if (modeBtnEl) {
    modeBtnEl.addEventListener('click', () => {
      toggleTimerMode();
    });
  }

  // Pause/Resume
  const pauseBtn = body.querySelector('#pp-run-pause');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      togglePracticeTimer();
    });
  }

  // Prev
  const prevBtn = body.querySelector('#pp-run-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      advancePracticeBlock(-1);
    });
  }

  // Next / Finish
  const nextBtn = body.querySelector('#pp-run-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const plan = state.activePracticePlan;
      if (!plan) return;
      if (state.practiceBlockIdx >= plan.blocks.length - 1) {
        // Practice complete
        completePractice();
      } else {
        advancePracticeBlock(1);
      }
    });
  }

  // Exit run view
  const exitBtn = body.querySelector('#pp-exit-run');
  if (exitBtn) {
    exitBtn.addEventListener('click', () => {
      stopTimer();
      state.practiceRunning = false;
      state.practiceTimerActive = false;
      renderPanel();
    });
  }

  // Linked play chips
  body.querySelectorAll('.pp-run-play-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const playName = chip.dataset.play;
      if (selectPlayFn && typeof PLAYS !== 'undefined') {
        const idx = PLAYS.findIndex(p => p.name === playName);
        if (idx >= 0) selectPlayFn(idx);
      }
    });
  });
}

// ── Plan operations ───────────────────────────────────────────

function createNewPlan(templateId) {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const now = Date.now();
  const plan = {
    id: 'pp-' + now,
    name: template.name.replace(/^Template [A-C]: /, '').replace(/^Blank.*/, 'New Practice Plan'),
    totalMinutes: template.totalMinutes,
    createdAt: now,
    updatedAt: now,
    blocks: template.drills.map(b => ({
      drillId: b.drillId,
      duration: b.duration,
      notes: '',
      linkedPlays: b.linkedPlays ? [...b.linkedPlays] : [],
    })),
  };
  state.activePracticePlan = plan;
  expandedBlockIdx = null;
}

function savePlan() {
  const plan = state.activePracticePlan;
  if (!plan) return;
  plan.updatedAt = Date.now();
  const existingIdx = state.practicePlans.findIndex(p => p.id === plan.id);
  const saved = JSON.parse(JSON.stringify(plan));
  if (existingIdx >= 0) {
    state.practicePlans[existingIdx] = saved;
  } else {
    state.practicePlans.unshift(saved);
  }
  savePracticePlans();
  saveLastPracticePlan(plan.id);
  renderPanel();
  showToast('Plan saved ✓');
}

function loadPlan(planId) {
  const found = state.practicePlans.find(p => p.id === planId);
  if (!found) return;
  state.activePracticePlan = JSON.parse(JSON.stringify(found));
  expandedBlockIdx = null;
  saveLastPracticePlan(planId);
  renderPanel();
}

function duplicatePlan(planId) {
  const found = state.practicePlans.find(p => p.id === planId) || state.activePracticePlan;
  if (!found) return;
  const now = Date.now();
  const copy = JSON.parse(JSON.stringify(found));
  copy.id = 'pp-' + now;
  copy.name = copy.name + ' (copy)';
  copy.createdAt = now;
  copy.updatedAt = now;
  state.practicePlans.unshift(copy);
  state.activePracticePlan = JSON.parse(JSON.stringify(copy));
  savePracticePlans();
  saveLastPracticePlan(copy.id);
  expandedBlockIdx = null;
  renderPanel();
  showToast('Plan duplicated ✓');
}

function deletePlan(planId) {
  state.practicePlans = state.practicePlans.filter(p => p.id !== planId);
  if (state.activePracticePlan && state.activePracticePlan.id === planId) {
    state.activePracticePlan = state.practicePlans[0]
      ? JSON.parse(JSON.stringify(state.practicePlans[0]))
      : null;
    saveLastPracticePlan(state.activePracticePlan ? state.activePracticePlan.id : null);
  }
  savePracticePlans();
  renderPanel();
}

function addBlock(drillId, afterIdx) {
  const plan = state.activePracticePlan;
  if (!plan) return;
  const drill = getDrillById(drillId);
  if (!drill) return;
  const block = {
    drillId,
    duration: drill.duration,
    notes: '',
    linkedPlays: [],
  };
  const insertAt = (afterIdx >= 0 && afterIdx < plan.blocks.length)
    ? afterIdx + 1
    : plan.blocks.length;
  plan.blocks.splice(insertAt, 0, block);
  expandedBlockIdx = insertAt;
}

function removeBlock(idx) {
  const plan = state.activePracticePlan;
  if (!plan) return;
  plan.blocks.splice(idx, 1);
  if (expandedBlockIdx === idx) expandedBlockIdx = null;
  else if (expandedBlockIdx > idx) expandedBlockIdx--;
  renderPanel();
}

function moveBlock(idx, direction) {
  const plan = state.activePracticePlan;
  if (!plan) return;
  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= plan.blocks.length) return;
  const temp = plan.blocks[idx];
  plan.blocks[idx] = plan.blocks[newIdx];
  plan.blocks[newIdx] = temp;
  if (expandedBlockIdx === idx) expandedBlockIdx = newIdx;
  else if (expandedBlockIdx === newIdx) expandedBlockIdx = idx;
  renderPanel();
}

function updateBlockDuration(idx, delta) {
  const plan = state.activePracticePlan;
  if (!plan || !plan.blocks[idx]) return;
  const newDur = Math.max(1, Math.min(60, plan.blocks[idx].duration + delta));
  plan.blocks[idx].duration = newDur;
  renderPanel();
}

function saveCustomDrill(drill) {
  CUSTOM_DRILLS.push(drill);
  saveCustomDrillsToStorage(CUSTOM_DRILLS);
}

// ── Run view operations ───────────────────────────────────────

function startPracticeRun() {
  const plan = state.activePracticePlan;
  if (!plan || plan.blocks.length === 0) return;
  state.practiceRunning = true;
  state.practiceBlockIdx = 0;
  resetTimerForBlock(0);
  renderPanel();
}

function advancePracticeBlock(direction) {
  const plan = state.activePracticePlan;
  if (!plan) return;
  const newIdx = state.practiceBlockIdx + direction;
  if (newIdx < 0 || newIdx >= plan.blocks.length) return;
  stopTimer();
  state.practiceTimerActive = false;
  state.practiceBlockIdx = newIdx;
  resetTimerForBlock(newIdx);
  renderPanel();
}

function completePractice() {
  stopTimer();
  state.practiceRunning = false;
  state.practiceTimerActive = false;
  const body = document.getElementById('practice-body');
  if (body) {
    body.innerHTML = `
      <div class="pp-complete">
        <div class="pp-complete-icon">🎉</div>
        <div class="pp-complete-title">Practice Complete!</div>
        <div class="pp-complete-msg">Great work today, coaches.</div>
        <button class="pp-action-btn pp-action-primary" id="pp-complete-back">← Back to Plan</button>
      </div>
    `;
    const backBtn = body.querySelector('#pp-complete-back');
    if (backBtn) backBtn.addEventListener('click', () => renderPanel());
  }
}

function resetTimerForBlock(idx) {
  const plan = state.activePracticePlan;
  if (!plan || !plan.blocks[idx]) return;
  const block = plan.blocks[idx];
  state.practiceTimerRemaining = block.duration * 60;
  state.practiceTimerElapsed = 0;
}

function toggleTimerMode() {
  stopTimer();
  state.practiceTimerActive = false;
  state.practiceTimerMode = state.practiceTimerMode === 'timer' ? 'stopwatch' : 'timer';
  // Reset for the current block
  resetTimerForBlock(state.practiceBlockIdx);
  savePracticeTimerMode();
  renderPanel();
}

export function togglePracticeTimer() {
  if (state.practiceTimerActive) {
    stopTimer();
    state.practiceTimerActive = false;
    renderPanel();
  } else {
    state.practiceTimerActive = true;
    timerLastTs = null;
    timerRAF = requestAnimationFrame(tickTimer);
    renderPanel();
  }
}

function stopTimer() {
  if (timerRAF) {
    cancelAnimationFrame(timerRAF);
    timerRAF = null;
  }
  timerLastTs = null;
}

function tickTimer(ts) {
  if (!state.practiceTimerActive) return;
  if (timerLastTs === null) timerLastTs = ts;
  const delta = (ts - timerLastTs) / 1000;
  timerLastTs = ts;

  if (state.practiceTimerMode === 'timer') {
    state.practiceTimerRemaining = Math.max(0, state.practiceTimerRemaining - delta);
    if (state.practiceTimerRemaining <= 0) {
      state.practiceTimerActive = false;
      state.practiceTimerRemaining = 0;
      // Update just the timer display without full re-render for perf
      updateRunTimerDisplay();
      return;
    }
  } else {
    state.practiceTimerElapsed += delta;
  }

  updateRunTimerDisplay();
  timerRAF = requestAnimationFrame(tickTimer);
}

function updateRunTimerDisplay() {
  const el = document.getElementById('pp-run-timer');
  if (!el) return;

  const mode = state.practiceTimerMode;
  const isTimer = mode === 'timer';
  const secs = isTimer ? state.practiceTimerRemaining : state.practiceTimerElapsed;
  const m = Math.floor(secs / 60);
  const s = String(Math.floor(secs % 60)).padStart(2, '0');
  el.textContent = `${m}:${s}`;

  // Update class
  el.className = (() => {
    if (!state.practiceTimerActive && secs === 0 && isTimer) return 'pp-run-timer expired';
    if (state.practiceTimerActive) return isTimer ? 'pp-run-timer running' : 'pp-run-timer stopwatch';
    return 'pp-run-timer paused';
  })();

  // Update pause button
  const pauseBtn = document.getElementById('pp-run-pause');
  if (pauseBtn) pauseBtn.textContent = state.practiceTimerActive ? '⏸' : '▶';
}

// ── Helpers ───────────────────────────────────────────────────

function getTimeUsed(plan) {
  if (!plan || !plan.blocks) return 0;
  return plan.blocks.reduce((sum, b) => sum + (b.duration || 0), 0);
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  // Use existing swap-toast if available, else silent
  const toast = document.getElementById('swap-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 2000);
}
