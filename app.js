const week = window.WORKOUT_WEEKS[1];
const dayGrid = document.getElementById('dayGrid');
const dialog = document.getElementById('workoutDialog');
const workoutContent = document.getElementById('workoutContent');
const profileSelect = document.getElementById('profileSelect');
const storageKey = 'jfw-week1-v1';
let state = loadState();

function loadState() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
  catch { return {}; }
}
function saveState() { localStorage.setItem(storageKey, JSON.stringify(state)); }
function dayState(id) {
  state[id] ||= { checks: {}, complete: false, painBefore: '', painAfter: '', difficulty: '', notes: '' };
  return state[id];
}

function renderDayGrid() {
  dayGrid.innerHTML = week.days.map(day => {
    const done = dayState(day.id).complete;
    return `<article class="day-card ${done ? 'completed' : ''}" data-day="${day.id}" tabindex="0" role="button" aria-label="Open ${day.label}: ${day.title}">
      <div class="day-num">${day.label}</div>
      <h3>${day.title}</h3>
      <p>${day.summary}</p>
      <div class="tag-row">${day.focus.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      <p><strong>${day.duration}</strong></p>
    </article>`;
  }).join('');
  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => openWorkout(card.dataset.day));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openWorkout(card.dataset.day); });
  });
  updateProgress();
}

function iconSvg(type) {
  const icons = {
    'sit-stand': '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="46" cy="18" r="8"/><path d="M44 28l-8 24 17 7 8 23M36 52l-17 6M51 58l18 8M63 82h20M20 62v20h22"/></svg>',
    'side-leg': '<svg viewBox="0 0 100 100"><circle cx="43" cy="18" r="8"/><path d="M43 28v32M43 40h-18M43 60l-5 25M43 60l28 14M20 28v58"/></svg>',
    'ham-curl': '<svg viewBox="0 0 100 100"><circle cx="45" cy="18" r="8"/><path d="M45 28v32M45 40H25M45 60l-5 25M45 60l19 12 12-11M20 28v58"/></svg>',
    'calf': '<svg viewBox="0 0 100 100"><circle cx="47" cy="18" r="8"/><path d="M47 28v33M47 40H28M47 60l-6 22M47 60l10 22M36 84h11M54 84h12M23 28v58"/></svg>',
    'brace': '<svg viewBox="0 0 100 100"><circle cx="50" cy="18" r="8"/><path d="M50 28v35M33 42h34M50 63l-13 22M50 63l13 22"/><path d="M38 38q12 12 24 0M38 50q12-10 24 0"/></svg>',
    'wall-push': '<svg viewBox="0 0 100 100"><path d="M82 12v76"/><circle cx="45" cy="25" r="8"/><path d="M43 34l-10 28M38 43l27 3 16-5M33 62l-12 21M33 62l17 22"/></svg>',
    'row': '<svg viewBox="0 0 100 100"><circle cx="45" cy="22" r="8"/><path d="M42 30l-14 27M28 57l-4 28M28 57l24 26M36 38l24 10 15-8M62 48l11 11"/></svg>',
    'curl': '<svg viewBox="0 0 100 100"><circle cx="50" cy="18" r="8"/><path d="M50 28v35M50 39l-18 15M50 39l18 15M32 54l9-12M68 54l-9-12M50 63l-12 22M50 63l12 22"/></svg>',
    'press': '<svg viewBox="0 0 100 100"><path d="M84 12v76"/><circle cx="46" cy="20" r="8"/><path d="M46 29v32M46 39l24 5 13-8M46 61l-10 24M46 61l12 24"/></svg>',
    'march': '<svg viewBox="0 0 100 100"><circle cx="46" cy="18" r="8"/><path d="M46 28v31M46 40H26M46 59l-8 26M46 59l16 8 10-12M20 28v58"/></svg>',
    'glute': '<svg viewBox="0 0 100 100"><circle cx="20" cy="53" r="7"/><path d="M27 54l22 6 22-17 17 22M8 70h84M47 60l-4 10M71 43l8 27"/></svg>',
    'heel-slide': '<svg viewBox="0 0 100 100"><circle cx="18" cy="47" r="7"/><path d="M25 49l28 8 20-10 16 22M8 72h84M53 57l-9 15"/></svg>',
    'ankle': '<svg viewBox="0 0 100 100"><path d="M38 18v45l-10 16h38M40 62h24l12 13"/><path d="M71 30q14 12 0 24M79 26l8 5-5 8"/></svg>',
    'breathing': '<svg viewBox="0 0 100 100"><circle cx="50" cy="20" r="8"/><path d="M50 28v34M32 43h36M50 62l-13 23M50 62l13 23"/><path d="M22 39q10-10 20 0M78 39q-10-10-20 0"/></svg>',
    'walk': '<svg viewBox="0 0 100 100"><circle cx="52" cy="17" r="8"/><path d="M48 26l-9 28 17 9 8 21M39 54l-17 15M55 63l-17 21M48 38l20 9 13-9"/></svg>',
    'balance': '<svg viewBox="0 0 100 100"><circle cx="48" cy="18" r="8"/><path d="M48 28v33M48 39H26M48 39l20 8M48 61l-11 24M48 61l14 24M20 27v59"/></svg>',
    'shoulder': '<svg viewBox="0 0 100 100"><circle cx="50" cy="24" r="9"/><path d="M35 42q15-14 30 0M38 45v27M62 45v27M50 33v40"/><path d="M25 46q-8 10 2 18M75 46q8 10-2 18"/></svg>'
  };
  return icons[type] || icons.brace;
}

function openWorkout(dayId) {
  const day = week.days.find(d => d.id === dayId);
  const ds = dayState(dayId);
  const profile = profileSelect.value;
  workoutContent.innerHTML = `
    <section class="workout-hero">
      <p class="eyebrow">${day.label} • ${day.duration}</p>
      <h2>${day.title}</h2>
      <p>${day.summary}</p>
      <p><strong>Warm-up:</strong> ${day.warmup}</p>
    </section>
    <section class="exercise-list">
      ${day.exercises.map((e, i) => `
        <article class="exercise-card">
          <div class="exercise-head">
            <div class="exercise-art">${iconSvg(e.icon)}</div>
            <div><h3>${e.name}</h3><div class="exercise-meta">${e.dose}</div></div>
            <label class="check-wrap"><input type="checkbox" data-check="${i}" ${ds.checks[i] ? 'checked' : ''}><span>Done</span></label>
          </div>
          <details open>
            <summary>How to do it</summary>
            <p>${e.instructions}</p>
            <div class="modification"><strong>${profile === 'a' ? 'Person A — Sciatica' : 'Person B — Knee / Hip'}:</strong> ${profile === 'a' ? e.modA : e.modB}</div>
          </details>
        </article>`).join('')}
    </section>
    <section class="tracker">
      <h3>Finish</h3>
      <p>${day.finisher}</p>
      <div class="tracker-grid">
        <label>Pain before (0–10)<input type="number" min="0" max="10" id="painBefore" value="${ds.painBefore}"></label>
        <label>Pain after (0–10)<input type="number" min="0" max="10" id="painAfter" value="${ds.painAfter}"></label>
        <label>Difficulty<select id="difficulty"><option value="">Choose</option><option ${ds.difficulty==='Easy'?'selected':''}>Easy</option><option ${ds.difficulty==='Moderate'?'selected':''}>Moderate</option><option ${ds.difficulty==='Hard'?'selected':''}>Hard</option></select></label>
        <label class="wide">Notes<textarea id="notes" placeholder="What felt good? What should be modified next time?">${ds.notes || ''}</textarea></label>
      </div>
      <button id="completeDay" class="primary-btn complete-day">${ds.complete ? '✓ Day completed' : 'Mark day complete'}</button>
    </section>`;

  workoutContent.querySelectorAll('[data-check]').forEach(cb => cb.addEventListener('change', e => {
    ds.checks[e.target.dataset.check] = e.target.checked; saveState();
  }));
  ['painBefore','painAfter','difficulty','notes'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => { ds[id] = e.target.value; saveState(); });
  });
  document.getElementById('completeDay').addEventListener('click', () => {
    ds.complete = !ds.complete; saveState(); renderDayGrid();
    document.getElementById('completeDay').textContent = ds.complete ? '✓ Day completed' : 'Mark day complete';
  });
  dialog.showModal();
}

function updateProgress() {
  const completed = week.days.filter(d => dayState(d.id).complete).length;
  const pct = Math.round(completed / week.days.length * 100);
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressText').textContent = `${pct}% complete • ${completed}/${week.days.length} days`;
}

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
profileSelect.addEventListener('change', () => {
  if (dialog.open) {
    const current = workoutContent.querySelector('.workout-hero .eyebrow')?.textContent.split(' • ')[0];
    const day = week.days.find(d => d.label === current);
    if (day) openWorkout(day.id);
  }
});
document.getElementById('resetProgress').addEventListener('click', () => {
  if (confirm('Reset all Week 1 checkmarks, pain scores, difficulty ratings, and notes on this device?')) {
    state = {}; saveState(); renderDayGrid();
  }
});

renderDayGrid();
