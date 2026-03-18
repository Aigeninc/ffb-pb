// modules/warmups.js — Warm-Ups & Drills panel

const WARMUPS = [
  {
    name: 'Defensive Shuffle',
    category: 'Defense',
    icon: '🛡️',
    description: 'Side step skipping while keeping arms wide for defense',
    instructions: [
      'Line up on the sideline facing the field',
      'Arms out wide — full wingspan, palms facing forward',
      'Side step skip across the field (lateral movement)',
      'Stay low in athletic stance, knees bent',
      'Keep arms wide the ENTIRE time — this is your defensive coverage zone',
      'Go across and back = 1 rep'
    ],
    reps: '3 trips across',
    teaches: 'Lateral movement + defensive positioning — arms wide shows how much space you can cover',
  },
  {
    name: 'Diamond Catch Circles (High)',
    category: 'Catching',
    icon: '💎',
    description: 'Arm circles with hands in "diamond" shape to show high catch radius',
    instructions: [
      'Stand with feet shoulder width apart',
      'Make a DIAMOND shape with both hands — thumbs and index fingers touching, forming a triangle/diamond window',
      'This is your hand position for catches ABOVE your chest',
      'Do big arm circles forward with hands locked in diamond shape',
      'Watch the diamond window as it moves — that\'s where the ball goes through on high catches',
      'Circle forward, then reverse'
    ],
    reps: '10 circles forward, 10 circles backward',
    teaches: 'High catch technique — diamond hands (thumbs together) for any ball above the chest. The circles show your full catch radius overhead.',
  },
  {
    name: 'Pinky Catch Circles (Low)',
    category: 'Catching',
    icon: '🤲',
    description: 'Arm circles with pinkies crossed to show low catch radius',
    instructions: [
      'Stand with feet shoulder width apart',
      'Cross your pinky fingers together, palms facing up — this is a basket/scoop shape',
      'This is your hand position for catches BELOW your chest',
      'Do big arm circles forward with pinkies locked together',
      'Watch the basket as it moves — that\'s where you scoop low balls',
      'Circle forward, then reverse'
    ],
    reps: '10 circles forward, 10 circles backward',
    teaches: 'Low catch technique — pinkies together for any ball below the chest. The circles show your full catch radius down low.',
  },
];

// ── State ─────────────────────────────────────────────────────
let activeCategory = 'All';
let expandedCard = null;

// ── Panel open/close ──────────────────────────────────────────

export function openWarmupsPanel() {
  const panel = document.getElementById('warmups-panel');
  const backdrop = document.getElementById('warmups-backdrop');
  if (!panel) return;
  renderWarmupsPanel();
  panel.classList.add('open');
  if (backdrop) backdrop.classList.add('visible');
}

export function closeWarmupsPanel() {
  const panel = document.getElementById('warmups-panel');
  const backdrop = document.getElementById('warmups-backdrop');
  if (!panel) return;
  panel.classList.remove('open');
  if (backdrop) backdrop.classList.remove('visible');
}

// ── Render ────────────────────────────────────────────────────

function renderWarmupsPanel() {
  const body = document.getElementById('warmups-body');
  if (!body) return;

  // Category pills
  const categories = ['All', ...new Set(WARMUPS.map(w => w.category))];
  const pillsHtml = `
    <div class="warmup-category-pills">
      ${categories.map(cat => `
        <button class="warmup-pill${cat === activeCategory ? ' active' : ''}" data-cat="${cat}">${cat}</button>
      `).join('')}
    </div>
  `;

  // Exercise cards
  const filtered = activeCategory === 'All' ? WARMUPS : WARMUPS.filter(w => w.category === activeCategory);
  const cardsHtml = filtered.map((warmup, idx) => {
    const isExpanded = expandedCard === warmup.name;
    return `
      <div class="warmup-card${isExpanded ? ' expanded' : ''}" data-warmup="${warmup.name}">
        <div class="warmup-card-header">
          <span class="warmup-icon">${warmup.icon}</span>
          <div class="warmup-card-info">
            <div class="warmup-name">${warmup.name}</div>
            <div class="warmup-desc">${warmup.description}</div>
          </div>
          <span class="warmup-category-tag warmup-cat-${warmup.category.toLowerCase()}">${warmup.category}</span>
        </div>
        <div class="warmup-card-detail">
          <ol class="warmup-instructions">
            ${warmup.instructions.map(step => `<li>${step}</li>`).join('')}
          </ol>
          <div class="warmup-reps">🔁 <strong>Reps:</strong> ${warmup.reps}</div>
          <div class="warmup-teaches">💡 <strong>Teaches:</strong> ${warmup.teaches}</div>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = pillsHtml + `<div class="warmup-cards">${cardsHtml}</div>`;

  // Wire up category pills
  body.querySelectorAll('.warmup-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.cat;
      expandedCard = null;
      renderWarmupsPanel();
    });
  });

  // Wire up card expansion
  body.querySelectorAll('.warmup-card').forEach(card => {
    card.querySelector('.warmup-card-header').addEventListener('click', () => {
      const name = card.dataset.warmup;
      expandedCard = expandedCard === name ? null : name;
      renderWarmupsPanel();
    });
  });
}

// ── Init ──────────────────────────────────────────────────────

export function initWarmups() {
  const btn = document.getElementById('btn-warmups');
  const backdrop = document.getElementById('warmups-backdrop');
  const closeBtn = document.getElementById('warmups-close-btn');

  if (btn) {
    btn.addEventListener('click', () => {
      const panel = document.getElementById('warmups-panel');
      if (panel && panel.classList.contains('open')) {
        closeWarmupsPanel();
        btn.style.opacity = '0.4';
      } else {
        openWarmupsPanel();
        btn.style.opacity = '1';
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeWarmupsPanel();
      if (btn) btn.style.opacity = '0.4';
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeWarmupsPanel();
      if (btn) btn.style.opacity = '0.4';
    });
  }
}
