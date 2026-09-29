let activeWeek = Number(localStorage.getItem('jfw-active-week')) || 1;
let week = window.WORKOUT_WEEKS[activeWeek] || window.WORKOUT_WEEKS[1];
const dayGrid = document.getElementById('dayGrid');
const dialog = document.getElementById('workoutDialog');
const workoutContent = document.getElementById('workoutContent');
const profileSelect = document.getElementById('profileSelect');
const storageKey = 'jfw-data-v2';
const legacyStorageKey = 'jfw-week1-v1';

const PROFILE_INFO = {
  a: { name: 'Person A', detail: 'Sciatica' },
  b: { name: 'Person B', detail: 'Knee / Hip' }
};

let state = loadState();
let activeProfile = localStorage.getItem('jfw-active-profile') || 'a';
if (!PROFILE_INFO[activeProfile]) activeProfile = 'a';
profileSelect.value = activeProfile;

function defaultProfileState() {
  return { weeks: { 1: {}, 2: {}, 3: {}, 4: {} }, weights: [] };
}

function loadState() {
  let loaded = null;
  try { loaded = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  if (loaded?.profiles) return loaded;

  // One-time migration from the original version. Old data becomes Person A's Week 1 data.
  let legacy = {};
  try { legacy = JSON.parse(localStorage.getItem(legacyStorageKey)) || {}; } catch {}
  const migrated = {
    version: 2,
    profiles: {
      a: { ...defaultProfileState(), weeks: { 1: legacy } },
      b: defaultProfileState()
    }
  };
  localStorage.setItem(storageKey, JSON.stringify(migrated));
  return migrated;
}

function ensureProfile(profile = activeProfile) {
  state.profiles ||= {};
  state.profiles[profile] ||= defaultProfileState();
  state.profiles[profile].weeks ||= {};
  for (let w=1; w<=4; w++) state.profiles[profile].weeks[w] ||= {};
  state.profiles[profile].weights ||= [];
  return state.profiles[profile];
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function currentWeekState() {
  return ensureProfile().weeks[activeWeek];
}

function dayState(id) {
  const weekState = currentWeekState();
  weekState[id] ||= {
    checks: {}, complete: false, completedAt: '',
    painBefore: '', painAfter: '', difficulty: '', notes: '', exerciseRatings: {}
  };
  weekState[id].exerciseRatings ||= {};
  return weekState[id];
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function profileLabel(profile = activeProfile) {
  const p = PROFILE_INFO[profile];
  return `${p.name} — ${p.detail}`;
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
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openWorkout(card.dataset.day);
      }
    });
  });
  updateProgress();
}

function poseFigure(pose, support = '') {
  const P = pose;
  const pt = (name) => P[name] || [0, 0];
  const line = (a, b, cls = 'limb') => {
    const [x1,y1] = pt(a), [x2,y2] = pt(b);
    return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  };
  const [hx,hy] = pt('head');
  const [slx,sly] = pt('shoulderL'), [srx,sry] = pt('shoulderR');
  const [hlx,hly] = pt('hipL'), [hrx,hry] = pt('hipR');
  const torso = `<path class="torso" d="M ${slx} ${sly} L ${srx} ${sry} L ${hrx} ${hry} L ${hlx} ${hly} Z"/>`;
  let supportArt = '';
  if (support === 'chair') supportArt = '<path class="support" d="M18 62h27v5H18zM20 67v25M43 67v25M18 44h5v18"/>';
  if (support === 'counter') supportArt = '<path class="support" d="M7 38h28v5H7zM11 43v49M31 43v49"/>';
  if (support === 'wall') supportArt = '<path class="support" d="M91 8v88"/>';
  if (support === 'floor') supportArt = '<path class="support floor" d="M5 90h90"/>';

  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    ${supportArt}
    ${torso}
    ${line('shoulderL','elbowL')}${line('elbowL','handL')}
    ${line('shoulderR','elbowR')}${line('elbowR','handR')}
    ${line('hipL','kneeL')}${line('kneeL','ankleL')}
    ${line('hipR','kneeR')}${line('kneeR','ankleR')}
    <circle class="head" cx="${hx}" cy="${hy}" r="7"/>
    <circle class="joint" cx="${pt('kneeL')[0]}" cy="${pt('kneeL')[1]}" r="2.1"/>
    <circle class="joint" cx="${pt('kneeR')[0]}" cy="${pt('kneeR')[1]}" r="2.1"/>
  </svg>`;
}

const POSES = {
  stand: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[40,43],handL:[36,56],elbowR:[63,43],handR:[67,56],kneeL:[45,72],ankleL:[43,91],kneeR:[60,72],ankleR:[62,91]},
  sit: {head:[57,24],shoulderL:[49,35],shoulderR:[62,35],hipL:[49,59],hipR:[60,59],elbowL:[45,49],handL:[42,60],elbowR:[65,48],handR:[68,59],kneeL:[66,70],ankleL:[65,91],kneeR:[78,70],ankleR:[79,91]},
  sideOut: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[33,35],handL:[22,39],elbowR:[63,43],handR:[67,56],kneeL:[45,72],ankleL:[43,91],kneeR:[70,67],ankleR:[88,73]},
  hamCurl: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[34,34],handL:[23,38],elbowR:[63,43],handR:[67,56],kneeL:[45,72],ankleL:[43,91],kneeR:[62,69],ankleR:[74,58]},
  calfUp: {head:[52,11],shoulderL:[45,23],shoulderR:[58,23],hipL:[47,49],hipR:[57,49],elbowL:[34,30],handL:[23,34],elbowR:[63,38],handR:[67,51],kneeL:[45,68],ankleL:[44,87],kneeR:[60,68],ankleR:[61,87]},
  wallStart: {head:[56,18],shoulderL:[49,29],shoulderR:[62,29],hipL:[45,55],hipR:[56,55],elbowL:[66,39],handL:[88,38],elbowR:[69,47],handR:[89,46],kneeL:[40,73],ankleL:[35,91],kneeR:[57,73],ankleR:[59,91]},
  wallLean: {head:[68,22],shoulderL:[58,32],shoulderR:[71,32],hipL:[49,57],hipR:[60,57],elbowL:[73,40],handL:[90,39],elbowR:[75,48],handR:[91,47],kneeL:[44,74],ankleL:[38,91],kneeR:[61,75],ankleR:[63,91]},
  rowStart: {head:[57,23],shoulderL:[48,33],shoulderR:[61,35],hipL:[38,58],hipR:[49,61],elbowL:[37,45],handL:[24,48],elbowR:[68,47],handR:[75,61],kneeL:[39,75],ankleL:[36,92],kneeR:[53,77],ankleR:[58,92]},
  rowPull: {head:[57,23],shoulderL:[48,33],shoulderR:[61,35],hipL:[38,58],hipR:[49,61],elbowL:[37,45],handL:[24,48],elbowR:[75,39],handR:[63,46],kneeL:[39,75],ankleL:[36,92],kneeR:[53,77],ankleR:[58,92]},
  curlDown: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[42,46],handL:[39,62],elbowR:[61,46],handR:[64,62],kneeL:[45,72],ankleL:[43,91],kneeR:[60,72],ankleR:[62,91]},
  curlUp: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[42,46],handL:[50,36],elbowR:[61,46],handR:[53,36],kneeL:[45,72],ankleL:[43,91],kneeR:[60,72],ankleR:[62,91]},
  march: {head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[33,35],handL:[22,39],elbowR:[63,43],handR:[67,56],kneeL:[45,72],ankleL:[43,91],kneeR:[66,62],ankleR:[67,76]},
  bridgeLow:{head:[17,66],shoulderL:[27,66],shoulderR:[38,64],hipL:[52,70],hipR:[61,69],elbowL:[27,77],handL:[19,84],elbowR:[39,76],handR:[31,85],kneeL:[72,68],ankleL:[83,87],kneeR:[78,65],ankleR:[91,86]},
  bridgeHigh:{head:[17,66],shoulderL:[27,66],shoulderR:[38,64],hipL:[55,48],hipR:[64,48],elbowL:[27,77],handL:[19,84],elbowR:[39,76],handR:[31,85],kneeL:[74,62],ankleL:[84,87],kneeR:[80,59],ankleR:[92,86]},
  heelBent:{head:[17,66],shoulderL:[27,66],shoulderR:[38,64],hipL:[52,70],hipR:[61,69],elbowL:[27,77],handL:[19,84],elbowR:[39,76],handR:[31,85],kneeL:[72,68],ankleL:[83,87],kneeR:[78,65],ankleR:[91,86]},
  heelSlide:{head:[17,66],shoulderL:[27,66],shoulderR:[38,64],hipL:[52,70],hipR:[61,69],elbowL:[27,77],handL:[19,84],elbowR:[39,76],handR:[31,85],kneeL:[76,75],ankleL:[94,87],kneeR:[78,65],ankleR:[91,86]},
  walk1:{head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[37,39],handL:[27,50],elbowR:[65,39],handR:[74,30],kneeL:[38,70],ankleL:[27,90],kneeR:[66,69],ankleR:[77,86]},
  walk2:{head:[52,16],shoulderL:[45,28],shoulderR:[58,28],hipL:[47,54],hipR:[57,54],elbowL:[35,37],handL:[27,28],elbowR:[66,42],handR:[76,54],kneeL:[61,69],ankleL:[74,88],kneeR:[44,70],ankleR:[35,91]},
  shift:{head:[58,16],shoulderL:[51,28],shoulderR:[64,28],hipL:[54,54],hipR:[64,54],elbowL:[38,35],handL:[24,39],elbowR:[69,43],handR:[73,56],kneeL:[54,72],ankleL:[52,91],kneeR:[67,72],ankleR:[69,91]}
};

function exerciseVisual(type) {
  const src = window.EXERCISE_IMAGES?.[type];
  if (!src) return `<div class="photo-unavailable"><span>Form guide</span><small>Follow the written steps below</small></div>`;
  return `<img class="exercise-photo" src="${src}" alt="Photo demonstration for this movement" loading="lazy">`;
}

function openWorkout(dayId) {
  const day = week.days.find(d => d.id === dayId);
  const ds = dayState(dayId);
  const profile = activeProfile;
  workoutContent.innerHTML = `
    <section class="workout-hero">
      <p class="eyebrow">${day.label} • ${day.duration}</p>
      <h2>${day.title}</h2>
      <p>${day.summary}</p>
    </section>
    <section class="phase-section warmup-section">
      <div class="phase-heading"><span class="phase-number">1</span><div><p class="eyebrow">WARM-UP • PREPARATION</p><h3>Get ready to move</h3><p>Keep these easy. Warm-up reps do <strong>not</strong> count as workout sets.</p></div></div>
      <div class="warmup-grid">${day.warmup.map(w => `<article class="warmup-card"><div class="warmup-icon">${exerciseVisual(w.icon)}</div><div><h4>${w.name}</h4><span class="warmup-dose">${w.dose}</span><p>${w.instructions}</p></div></article>`).join('')}</div>
    </section>
    <section class="phase-section main-phase"><div class="phase-heading"><span class="phase-number">2</span><div><p class="eyebrow">MAIN WORKOUT • WORKING SETS</p><h3>Strength & control</h3><p>These are the sets to track and check off.</p></div></div></section>
    <section class="exercise-list">
      ${day.exercises.map((e, i) => `
        <article class="exercise-card">
          <div class="exercise-head">
            <div class="exercise-art">${exerciseVisual(e.icon)}</div>
            <div><h3>${e.name}</h3><div class="exercise-meta">${e.dose}</div></div>
            <label class="check-wrap"><input type="checkbox" data-check="${i}" ${ds.checks[i] ? 'checked' : ''}><span>Done</span></label>
          </div>
          <div class="exercise-feedback" data-exercise-feedback="${i}">
            <div class="feedback-title"><strong>Rate this exercise</strong><span>Saved for ${profileLabel(profile)}</span></div>
            <label>Effort
              <select data-exercise-field="effort" data-exercise-index="${i}">
                <option value="">Choose</option>
                ${['Too Easy','About Right','Challenging','Too Hard'].map(v => `<option value="${v}" ${(ds.exerciseRatings?.[i]?.effort || '') === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </label>
            <label>Comfort
              <select data-exercise-field="comfort" data-exercise-index="${i}">
                <option value="">Choose</option>
                ${['Good','Mild Discomfort','Painful'].map(v => `<option value="${v}" ${(ds.exerciseRatings?.[i]?.comfort || '') === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </label>
            <label>Weight used <span class="optional">(optional)</span>
              <input type="text" inputmode="decimal" data-exercise-field="weight" data-exercise-index="${i}" value="${escapeHtml(ds.exerciseRatings?.[i]?.weight || '')}" placeholder="e.g. 10 lb or bodyweight">
            </label>
            <label class="feedback-note">Exercise note <span class="optional">(optional)</span>
              <input type="text" data-exercise-field="note" data-exercise-index="${i}" value="${escapeHtml(ds.exerciseRatings?.[i]?.note || '')}" placeholder="e.g. right knee felt tight; use higher chair">
            </label>
          </div>
          <details open>
            <summary>How to do it</summary>
            <p>${e.instructions}</p>
            <div class="modification"><strong>${profileLabel(profile)}:</strong> ${profile === 'a' ? e.modA : e.modB}</div>
          </details>
        </article>`).join('')}
    </section>
    <section class="tracker">
      <div class="phase-heading"><span class="phase-number">3</span><div><p class="eyebrow">FINISHER / COOL-DOWN</p><h3>${day.finisherTitle || 'Finish'}</h3><p>${day.finisher}</p></div></div>
      <div class="tracker-grid">
        <label>Pain before (0–10)<input type="number" min="0" max="10" id="painBefore" value="${escapeHtml(ds.painBefore)}"></label>
        <label>Pain after (0–10)<input type="number" min="0" max="10" id="painAfter" value="${escapeHtml(ds.painAfter)}"></label>
        <label>Overall workout effort<select id="difficulty"><option value="">Choose</option><option ${['Too Easy','Easy'].includes(ds.difficulty)?'selected':''}>Too Easy</option><option ${['About Right','Moderate'].includes(ds.difficulty)?'selected':''}>About Right</option><option ${['Challenging','Hard'].includes(ds.difficulty)?'selected':''}>Challenging</option><option ${ds.difficulty==='Painful'?'selected':''}>Painful</option></select></label>
        <label class="wide">Notes<textarea id="notes" placeholder="What felt good? What should be modified next time?">${escapeHtml(ds.notes || '')}</textarea></label>
      </div>
      <button id="completeDay" class="primary-btn complete-day">${ds.complete ? '✓ Day completed' : 'Mark day complete'}</button>
    </section>`;

  workoutContent.querySelectorAll('[data-check]').forEach(cb => cb.addEventListener('change', e => {
    ds.checks[e.target.dataset.check] = e.target.checked;
    saveState();
  }));
  workoutContent.querySelectorAll('[data-exercise-field]').forEach(control => {
    const saveExerciseFeedback = e => {
      const i = e.target.dataset.exerciseIndex;
      const field = e.target.dataset.exerciseField;
      ds.exerciseRatings ||= {};
      ds.exerciseRatings[i] ||= {};
      ds.exerciseRatings[i][field] = e.target.value;
      saveState();
    };
    control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', saveExerciseFeedback);
  });
  ['painBefore','painAfter','difficulty','notes'].forEach(id => {
    document.getElementById(id).addEventListener('input', e => {
      ds[id] = e.target.value;
      saveState();
      renderWorkoutHistory();
    });
  });
  document.getElementById('completeDay').addEventListener('click', () => {
    ds.complete = !ds.complete;
    ds.completedAt = ds.complete ? new Date().toISOString() : '';
    saveState();
    renderDayGrid();
    renderWorkoutHistory();
    document.getElementById('completeDay').textContent = ds.complete ? '✓ Day completed' : 'Mark day complete';
  });
  if (!dialog.open) dialog.showModal();
}

function updateProgress() {
  const completed = week.days.filter(d => dayState(d.id).complete).length;
  const pct = Math.round(completed / week.days.length * 100);
  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressText').textContent = `${pct}% complete • ${completed}/${week.days.length} days`;
  const h=document.querySelector('.progress-panel h2'); if(h) h.textContent=`Week ${activeWeek} Progress`;
  const rb=document.getElementById('resetProgress'); if(rb) rb.textContent=`Reset Week ${activeWeek} progress`;
  document.getElementById('progressProfileText').textContent = `Progress for ${PROFILE_INFO[activeProfile].name} is stored on this device.`;
}

function todayLocalISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const d = new Date(`${dateString}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderTracking() {
  document.getElementById('trackingProfileText').textContent = `Tracking for ${profileLabel()}.`;
  renderWeights();
  renderWorkoutHistory();
}

function renderWeights() {
  const weights = [...ensureProfile().weights].sort((a, b) => a.date.localeCompare(b.date));
  const body = document.getElementById('weightHistoryBody');
  const summary = document.getElementById('weightSummary');

  if (!weights.length) {
    summary.innerHTML = `<div class="summary-stat"><span>Latest</span><strong>—</strong></div><div class="summary-stat"><span>Change</span><strong>—</strong></div><div class="summary-stat"><span>Entries</span><strong>0</strong></div>`;
    body.innerHTML = `<tr><td colspan="3" class="empty-row">No weight entries yet.</td></tr>`;
  } else {
    const first = weights[0];
    const last = weights[weights.length - 1];
    const change = +(last.weight - first.weight).toFixed(1);
    const changeText = weights.length > 1 ? `${change > 0 ? '+' : ''}${change.toFixed(1)} lb` : '—';
    summary.innerHTML = `
      <div class="summary-stat"><span>Latest</span><strong>${last.weight.toFixed(1)} lb</strong></div>
      <div class="summary-stat"><span>Change</span><strong>${changeText}</strong></div>
      <div class="summary-stat"><span>Entries</span><strong>${weights.length}</strong></div>`;
    body.innerHTML = [...weights].reverse().map(entry => `
      <tr>
        <td>${formatDate(entry.date)}</td>
        <td>${entry.weight.toFixed(1)} lb</td>
        <td><button class="icon-btn delete-weight" data-weight-id="${entry.id}" aria-label="Delete weight entry from ${formatDate(entry.date)}">Delete</button></td>
      </tr>`).join('');
    body.querySelectorAll('.delete-weight').forEach(btn => btn.addEventListener('click', () => {
      ensureProfile().weights = ensureProfile().weights.filter(entry => entry.id !== btn.dataset.weightId);
      saveState();
      renderWeights();
    }));
  }
  drawWeightChart(weights);
}

function drawWeightChart(weights) {
  const svg = document.getElementById('weightChart');
  const empty = document.getElementById('emptyChart');
  if (weights.length < 2) {
    svg.innerHTML = '';
    svg.style.display = 'none';
    empty.style.display = 'block';
    return;
  }

  svg.style.display = 'block';
  empty.style.display = 'none';
  const W = 640, H = 220, L = 52, R = 18, T = 20, B = 38;
  const vals = weights.map(w => w.weight);
  let min = Math.min(...vals), max = Math.max(...vals);
  const pad = Math.max(2, (max - min) * 0.25);
  min -= pad; max += pad;
  if (max === min) { max += 2; min -= 2; }
  const x = i => L + (i / (weights.length - 1)) * (W - L - R);
  const y = v => T + ((max - v) / (max - min)) * (H - T - B);
  const points = weights.map((w, i) => `${x(i).toFixed(1)},${y(w.weight).toFixed(1)}`).join(' ');
  const ticks = [max, (max + min) / 2, min];
  const labelIndexes = [...new Set([0, Math.floor((weights.length - 1) / 2), weights.length - 1])];

  svg.innerHTML = `
    ${ticks.map(v => `<line class="chart-grid" x1="${L}" y1="${y(v)}" x2="${W-R}" y2="${y(v)}"></line><text class="chart-label" x="${L-8}" y="${y(v)+4}" text-anchor="end">${v.toFixed(1)}</text>`).join('')}
    <polyline class="chart-line" points="${points}"></polyline>
    ${weights.map((w, i) => `<circle class="chart-point" cx="${x(i)}" cy="${y(w.weight)}" r="5"><title>${formatDate(w.date)}: ${w.weight.toFixed(1)} lb</title></circle>`).join('')}
    ${labelIndexes.map(i => `<text class="chart-label" x="${x(i)}" y="${H-12}" text-anchor="middle">${formatDate(weights[i].date).replace(/, \d{4}/, '')}</text>`).join('')}`;
}

function renderWorkoutHistory() {
  const container = document.getElementById('workoutHistory');
  const weekState = currentWeekState();
  const rows = week.days
    .map(day => ({ day, data: weekState[day.id] }))
    .filter(item => item.data && (item.data.complete || item.data.painBefore !== '' || item.data.painAfter !== '' || item.data.difficulty || item.data.notes));

  if (!rows.length) {
    container.innerHTML = `<p class="empty-state history-empty">No workout history yet. Open a workout and record pain, difficulty, notes, or completion.</p>`;
    return;
  }

  container.innerHTML = rows.map(({ day, data }) => `
    <article class="history-item">
      <div class="history-item-head">
        <div><span class="history-day">${day.label}</span><h4>${day.title}</h4></div>
        <span class="status-pill ${data.complete ? 'done' : ''}">${data.complete ? 'Completed' : 'In progress'}</span>
      </div>
      <div class="history-metrics">
        <span>Before <strong>${data.painBefore === '' ? '—' : escapeHtml(data.painBefore)}/10</strong></span>
        <span>After <strong>${data.painAfter === '' ? '—' : escapeHtml(data.painAfter)}/10</strong></span>
        <span>Difficulty <strong>${escapeHtml(data.difficulty || '—')}</strong></span>
      </div>
      ${data.notes ? `<p class="history-notes">${escapeHtml(data.notes)}</p>` : ''}
    </article>`).join('');
}

function showWeightMessage(message, type = '') {
  const el = document.getElementById('weightMessage');
  el.textContent = message;
  el.className = `form-message ${type}`;
  if (message) setTimeout(() => {
    if (el.textContent === message) el.textContent = '';
  }, 3500);
}

function exportProfileData() {
  const payload = {
    app: 'Joint Friendly Workouts',
    version: 2,
    exportedAt: new Date().toISOString(),
    profile: activeProfile,
    profileLabel: profileLabel(),
    data: ensureProfile()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `joint-friendly-workout-${activeProfile}-backup-${todayLocalISO()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function importProfileData(file) {
  try {
    const text = await file.text();
    const payload = JSON.parse(text);
    const incoming = payload?.data;
    if (!incoming || !Array.isArray(incoming.weights) || !incoming.weeks) throw new Error('Invalid backup');
    if (!confirm(`Replace ${profileLabel()}'s current saved data with this backup?`)) return;
    state.profiles[activeProfile] = incoming;
    saveState();
    renderDayGrid();
    renderTracking();
    showWeightMessage('Backup imported successfully.', 'success');
  } catch {
    showWeightMessage('That file does not look like a Joint Friendly Workouts backup.', 'error');
  }
}

function switchProfile(profile) {
  activeProfile = profile;
  ensureProfile();
  localStorage.setItem('jfw-active-profile', activeProfile);
  if (dialog.open) dialog.close();
  renderDayGrid();
  renderTracking();
}

function switchWeek(num) {
  activeWeek = Number(num); week = window.WORKOUT_WEEKS[activeWeek];
  localStorage.setItem('jfw-active-week', String(activeWeek));
  document.querySelectorAll('.week-tab').forEach(b=>b.classList.toggle('active', Number(b.dataset.week)===activeWeek));
  const intro=document.querySelector('.intro-card h2'); if(intro) intro.textContent=week.title;
  const introP=document.querySelector('.intro-card p'); if(introP) introP.innerHTML=`${week.subtitle}. Aim for about <strong>${week.effort}</strong> effort while keeping symptoms calm and form controlled.`;
  dayGrid.setAttribute('aria-label', `Week ${activeWeek} workout days`);
  if(dialog.open) dialog.close(); renderDayGrid(); renderTracking();
}
document.querySelectorAll('.week-tab').forEach(b=>b.addEventListener('click',()=>switchWeek(b.dataset.week)));
document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
profileSelect.addEventListener('change', e => switchProfile(e.target.value));

document.getElementById('resetProgress').addEventListener('click', () => {
  if (confirm(`Reset all Week ${activeWeek} checkmarks, pain scores, difficulty ratings, and notes for ${profileLabel()} on this device?`)) {
    ensureProfile().weeks[activeWeek] = {};
    saveState();
    renderDayGrid();
    renderWorkoutHistory();
  }
});

document.getElementById('weightForm').addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('weightDate').value;
  const weight = Number(document.getElementById('weightValue').value);
  if (!date || !Number.isFinite(weight) || weight <= 0) {
    showWeightMessage('Enter a valid date and weight.', 'error');
    return;
  }
  const weights = ensureProfile().weights;
  const existing = weights.find(entry => entry.date === date);
  if (existing) {
    existing.weight = weight;
    showWeightMessage('Updated the existing entry for that date.', 'success');
  } else {
    weights.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, date, weight });
    showWeightMessage('Weight entry saved.', 'success');
  }
  weights.sort((a, b) => a.date.localeCompare(b.date));
  saveState();
  document.getElementById('weightValue').value = '';
  renderWeights();
});

document.getElementById('exportData').addEventListener('click', exportProfileData);
document.getElementById('importData').addEventListener('change', e => {
  const file = e.target.files?.[0];
  if (file) importProfileData(file);
  e.target.value = '';
});

document.getElementById('weightDate').value = todayLocalISO();
switchWeek(activeWeek);
renderTracking();
