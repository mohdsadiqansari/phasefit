// ════════════════════════════════════════════
// LEADERBOARD CSS (injected once)
// ════════════════════════════════════════════
(function injectLbCSS() {
  const s = document.createElement('style');
  s.textContent = `
  .lb-vs{display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center;margin-bottom:20px;}
  .lb-user-card{border-radius:20px;padding:20px;border:2px solid var(--border);position:relative;overflow:hidden;transition:transform .3s;}
  .lb-user-card.winner{transform:scale(1.02);}
  .lb-user-card.sadik-card{background:linear-gradient(135deg,rgba(249,115,22,.08),rgba(249,115,22,.02));border-color:rgba(249,115,22,.3);}
  .lb-user-card.anas-card{background:linear-gradient(135deg,rgba(59,130,246,.08),rgba(59,130,246,.02));border-color:rgba(59,130,246,.3);}
  .lb-crown{position:absolute;top:-2px;right:14px;font-size:28px;filter:drop-shadow(0 0 8px gold);animation:crownBob .8s ease-in-out infinite alternate;}
  @keyframes crownBob{from{transform:translateY(0)}to{transform:translateY(-4px)}}
  .lb-av{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:22px;margin-bottom:10px;}
  .lb-av.s{background:rgba(249,115,22,.2);color:var(--accent);}
  .lb-av.a{background:rgba(59,130,246,.2);color:var(--blue);}
  .lb-uname{font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:2px;margin-bottom:4px;}
  .lb-meta{font-size:12px;color:var(--text2);margin-bottom:12px;}
  .lb-big{font-family:'Bebas Neue',sans-serif;font-size:40px;line-height:1;}
  .lb-prog-wrap{margin-top:10px;}
  .lb-prog-label{display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:4px;}
  .lb-prog-bar{height:8px;background:var(--bg3);border-radius:100px;overflow:hidden;}
  .lb-prog-fill{height:100%;border-radius:100px;transition:width .8s cubic-bezier(.34,1.56,.64,1);}
  .vs-badge{text-align:center;}
  .vs-text{font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:4px;background:linear-gradient(135deg,var(--accent),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
  .vs-score{font-family:'Bebas Neue',sans-serif;font-size:24px;color:var(--text2);letter-spacing:2px;margin-top:4px;}
  .lb-categories{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:4px;}
  @media(max-width:640px){.lb-vs{grid-template-columns:1fr;}.lb-categories{grid-template-columns:1fr 1fr;}}
  .lb-cat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;position:relative;overflow:hidden;}
  .lb-cat-icon{font-size:22px;margin-bottom:6px;}
  .lb-cat-title{font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;}
  .lb-cat-vals{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;}
  .lb-cat-val{text-align:center;flex:1;}
  .lb-cat-num{font-family:'Bebas Neue',sans-serif;font-size:24px;line-height:1;}
  .lb-cat-name{font-size:10px;color:var(--text3);margin-top:2px;}
  .lb-cat-winner{position:absolute;top:8px;right:8px;font-size:13px;}
  .lb-cat-divider{width:1px;background:var(--border);align-self:stretch;}
  .lb-row{display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);gap:12px;}
  .lb-row:last-child{border-bottom:none;}
  .lb-row-icon{font-size:18px;width:28px;text-align:center;}
  .lb-row-label{flex:1;font-size:13px;color:var(--text2);}
  .lb-row-vals{display:flex;gap:16px;}
  .lb-row-val{text-align:center;min-width:60px;}
  .lb-row-num{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:15px;}
  .lb-row-who{font-size:10px;color:var(--text3);margin-top:1px;letter-spacing:.5px;}
  .lb-winner-badge{font-size:11px;padding:2px 7px;border-radius:100px;font-weight:700;letter-spacing:.5px;}
  .lb-winner-badge.s{background:rgba(249,115,22,.15);color:var(--accent);}
  .lb-winner-badge.a{background:rgba(59,130,246,.15);color:var(--blue);}
  .lb-winner-badge.tie{background:rgba(251,191,36,.15);color:var(--gold);}
  .lb-tie-note{text-align:center;padding:20px;color:var(--text3);font-size:13px;}
  `;
  document.head.appendChild(s);
})();

// ════════════════════════════════════════════
// LEADERBOARD
// ════════════════════════════════════════════
function buildLeaderboard() {
  const sl = JSON.parse(localStorage.getItem('sadik_logs') || '[]');
  const al = JSON.parse(localStorage.getItem('anas_logs') || '[]');
  const su = USERS.sadik, au = USERS.anas;

  // ── Helper: latest weight ──
  const latestW = (logs, u) => logs.length ? parseFloat(logs[logs.length - 1].weight) || u.initWeight : u.initWeight;
  const sw = latestW(sl, su), aw = latestW(al, au);

  // ── Metrics ──
  const metrics = {
    progress: {
      label: 'Goal Progress', icon: '🎯', unit: '%',
      s: Math.min(100, Math.max(0, ((sw - su.initWeight) / (su.targetWeight - su.initWeight) * 100))).toFixed(1),
      a: Math.min(100, Math.max(0, ((aw - au.initWeight) / (au.targetWeight - au.initWeight) * 100))).toFixed(1)
    },
    streak: {
      label: 'Current Streak', icon: '🔥', unit: 'days',
      s: calcStreak(sl), a: calcStreak(al)
    },
    totalDays: {
      label: 'Days Logged', icon: '📅', unit: 'days',
      s: sl.length, a: al.length
    },
    workouts: {
      label: 'Workouts Done', icon: '💪', unit: 'sessions',
      s: sl.filter(l => l.workout === 'yes').length,
      a: al.filter(l => l.workout === 'yes').length
    },
    consistency: {
      label: 'Consistency', icon: '📊', unit: '%',
      s: sl.length ? ((sl.filter(l => l.workout === 'yes').length / sl.length) * 100).toFixed(1) : 0,
      a: al.length ? ((al.filter(l => l.workout === 'yes').length / al.length) * 100).toFixed(1) : 0
    },
    weightGained: {
      label: 'Weight Gained', icon: '⚖️', unit: 'kg',
      s: Math.max(0, sw - su.initWeight).toFixed(2),
      a: Math.max(0, aw - au.initWeight).toFixed(2)
    }
  };

  // ── Score (how many categories each wins) ──
  let sScore = 0, aScore = 0, ties = 0;
  Object.values(metrics).forEach(m => {
    const sv = parseFloat(m.s), av = parseFloat(m.a);
    if (sv > av) sScore++;
    else if (av > sv) aScore++;
    else ties++;
  });

  const overallWinner = sScore > aScore ? 'sadik' : aScore > sScore ? 'anas' : 'tie';

  // ── VS Banner ──
  const sProgPct = Math.min(100, Math.max(0, ((sw - su.initWeight) / (su.targetWeight - su.initWeight) * 100)));
  const aProgPct = Math.min(100, Math.max(0, ((aw - au.initWeight) / (au.targetWeight - au.initWeight) * 100)));

  document.getElementById('lbVsBanner').innerHTML = `
    <div class="lb-vs">
      <div class="lb-user-card sadik-card${overallWinner === 'sadik' ? ' winner' : ''}">
        ${overallWinner === 'sadik' ? '<div class="lb-crown">👑</div>' : ''}
        <div class="lb-av s">S</div>
        <div class="lb-uname">🔥 SADIK</div>
        <div class="lb-meta">${su.age}y · ${su.height}cm · ${sw.toFixed(1)}kg · Goal: ${su.targetWeight}kg</div>
        <div class="lb-big" style="color:var(--accent)">${sProgPct.toFixed(1)}<span style="font-size:18px">%</span></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px;margin-bottom:8px;">to goal</div>
        <div class="lb-prog-wrap">
          <div class="lb-prog-label"><span>Start ${su.initWeight}kg</span><span>Target ${su.targetWeight}kg</span></div>
          <div class="lb-prog-bar"><div class="lb-prog-fill" style="width:${sProgPct}%;background:var(--accent)"></div></div>
        </div>
      </div>

      <div class="vs-badge">
        <div class="vs-text">VS</div>
        <div class="vs-score">${sScore} – ${aScore}</div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px;letter-spacing:1px;">CATEGORIES WON</div>
        ${ties ? `<div style="font-size:10px;color:var(--gold);margin-top:3px;">${ties} TIE${ties > 1 ? 'S' : ''}</div>` : ''}
      </div>

      <div class="lb-user-card anas-card${overallWinner === 'anas' ? ' winner' : ''}">
        ${overallWinner === 'anas' ? '<div class="lb-crown">👑</div>' : ''}
        <div class="lb-av a">A</div>
        <div class="lb-uname" style="color:var(--blue)">⚡ ANAS</div>
        <div class="lb-meta">${au.age}y · ${au.height}cm · ${aw.toFixed(1)}kg · Goal: ${au.targetWeight}kg</div>
        <div class="lb-big" style="color:var(--blue)">${aProgPct.toFixed(1)}<span style="font-size:18px">%</span></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px;margin-bottom:8px;">to goal</div>
        <div class="lb-prog-wrap">
          <div class="lb-prog-label"><span>Start ${au.initWeight}kg</span><span>Target ${au.targetWeight}kg</span></div>
          <div class="lb-prog-bar"><div class="lb-prog-fill" style="width:${aProgPct}%;background:var(--blue)"></div></div>
        </div>
      </div>
    </div>`;

  // ── Category Cards ──
  const catList = [
    metrics.progress, metrics.streak, metrics.workouts,
    metrics.totalDays, metrics.consistency, metrics.weightGained
  ];
  document.getElementById('lbCategories').innerHTML = `<div class="lb-categories">${catList.map(m => {
    const sv = parseFloat(m.s), av = parseFloat(m.a);
    const sw_ = sv > av ? 's' : av > sv ? 'a' : 'tie';
    const winnerEmoji = sw_ === 's' ? '🔥' : sw_ === 'a' ? '⚡' : '🤝';
    return `<div class="lb-cat-card">
        <div class="lb-cat-icon">${m.icon}</div>
        <div class="lb-cat-title">${m.label}</div>
        <div class="lb-cat-vals">
          <div class="lb-cat-val">
            <div class="lb-cat-num" style="color:${sv >= av ? 'var(--accent)' : 'var(--text2)'}">${m.s}${m.unit === '%' ? '%' : ''}</div>
            <div class="lb-cat-name">${m.unit !== '%' ? m.unit : ''} SADIK</div>
          </div>
          <div class="lb-cat-divider"></div>
          <div class="lb-cat-val">
            <div class="lb-cat-num" style="color:${av >= sv ? 'var(--blue)' : 'var(--text2)'}">${m.a}${m.unit === '%' ? '%' : ''}</div>
            <div class="lb-cat-name">${m.unit !== '%' ? m.unit : ''} ANAS</div>
          </div>
        </div>
        <div class="lb-cat-winner">${winnerEmoji}</div>
      </div>`;
  }).join('')
    }</div>`;

  // ── Detailed Table ──
  const rows = [
    { icon: '⚖️', label: 'Current Weight', s: `${sw.toFixed(1)} kg`, a: `${aw.toFixed(1)} kg`, winner: 'n/a' },
    { icon: '🎯', label: 'Target Weight', s: `${su.targetWeight} kg`, a: `${au.targetWeight} kg`, winner: 'n/a' },
    { icon: '📈', label: 'Weight Gained', s: `${Math.max(0, sw - su.initWeight).toFixed(2)} kg`, a: `${Math.max(0, aw - au.initWeight).toFixed(2)} kg`, winner: parseFloat(sw - su.initWeight) >= parseFloat(aw - au.initWeight) ? 's' : 'a' },
    { icon: '🏁', label: 'To Goal', s: `${Math.max(0, su.targetWeight - sw).toFixed(1)} kg`, a: `${Math.max(0, au.targetWeight - aw).toFixed(1)} kg`, winner: Math.max(0, su.targetWeight - sw) <= Math.max(0, au.targetWeight - aw) ? 's' : 'a' },
    { icon: '🎯', label: 'Goal Progress', s: `${sProgPct.toFixed(1)}%`, a: `${aProgPct.toFixed(1)}%`, winner: sProgPct >= aProgPct ? 's' : 'a' },
    { icon: '🔥', label: 'Streak', s: `${calcStreak(sl)} days`, a: `${calcStreak(al)} days`, winner: calcStreak(sl) >= calcStreak(al) ? 's' : 'a' },
    { icon: '💪', label: 'Workouts Done', s: `${sl.filter(l => l.workout === 'yes').length}`, a: `${al.filter(l => l.workout === 'yes').length}`, winner: sl.filter(l => l.workout === 'yes').length >= al.filter(l => l.workout === 'yes').length ? 's' : 'a' },
    { icon: '📅', label: 'Days Logged', s: `${sl.length}`, a: `${al.length}`, winner: sl.length >= al.length ? 's' : 'a' },
    { icon: '📊', label: 'Consistency', s: `${sl.length ? ((sl.filter(l => l.workout === 'yes').length / sl.length) * 100).toFixed(0) : 0}%`, a: `${al.length ? ((al.filter(l => l.workout === 'yes').length / al.length) * 100).toFixed(0) : 0}%`, winner: (sl.length ? sl.filter(l => l.workout === 'yes').length / sl.length : 0) >= (al.length ? al.filter(l => l.workout === 'yes').length / al.length : 0) ? 's' : 'a' },
    { icon: '📆', label: 'Last Logged', s: sl.length ? sl[sl.length - 1].date : 'Not yet', a: al.length ? al[al.length - 1].date : 'Not yet', winner: 'n/a' }
  ];

  document.getElementById('lbTable').innerHTML = rows.map(r => `
    <div class="lb-row">
      <div class="lb-row-icon">${r.icon}</div>
      <div class="lb-row-label">${r.label}</div>
      <div class="lb-row-vals">
        <div class="lb-row-val">
          <div class="lb-row-num" style="color:${r.winner === 's' ? 'var(--accent)' : 'var(--text)'}">${r.s}</div>
          <div class="lb-row-who">SADIK</div>
        </div>
        <div class="lb-row-val">
          <div class="lb-row-num" style="color:${r.winner === 'a' ? 'var(--blue)' : 'var(--text)'}">${r.a}</div>
          <div class="lb-row-who">ANAS</div>
        </div>
        ${r.winner !== 'n/a' ? `<div class="lb-row-val"><span class="lb-winner-badge ${r.winner === 's' ? 's' : r.winner === 'a' ? 'a' : 'tie'}">${r.winner === 's' ? '🔥 SADIK' : r.winner === 'a' ? '⚡ ANAS' : '🤝 TIE'}</span></div>` : ''}
      </div>
    </div>`).join('');

  // Update sub
  const msg = overallWinner === 'sadik' ? '🔥 SADIK is leading! Keep it up Anas — don\'t let him get too far ahead!' :
    overallWinner === 'anas' ? '⚡ ANAS is leading! Come on Sadik — time to push harder!' :
      '🤝 It\'s a TIE! Both brothers are putting in equal work — MashaAllah!';
  document.getElementById('lbSub').textContent = msg;
}

// ════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const urlU = new URLSearchParams(location.search).get('user');
  if (urlU && USERS[urlU]) {
    activeUser = urlU;
    // Skip welcome screen if user is specified in URL
    const overlay = document.getElementById('wsOverlay');
    if (overlay) { overlay.classList.add('hidden'); overlay.style.display = 'none'; }
  }
  updateHeaderDate();
  applyUserTheme();
  buildDashboard();
  buildWeekGrid();
  buildDiet();
  buildTips();
  buildStreakDots();
  renderLogTable();
  setTimeout(drawChart, 150);
  const ti = todayIdx();
  showWorkoutDetail(ti);
  document.querySelectorAll('.day-card')[ti]?.classList.add('active');
  initSync(activeUser);
  setInterval(() => syncPull(activeUser), 90000);
});

function todayIdx() { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; }

// ════════════════════════════════════════════
// USER SYSTEM
// ════════════════════════════════════════════
function selectUser(id) {
  activeUser = id;
  const overlay = document.getElementById('wsOverlay');
  if (overlay) {
    overlay.classList.add('exiting');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.style.display = 'none';
    }, 400);
  }
  // Set URL param
  const url = new URL(location.href);
  url.searchParams.set('user', id);
  history.replaceState({}, '', url);
  // Apply user theme and rebuild everything
  applyUserTheme();
  buildDashboard();
  buildWeekGrid();
  buildDiet();
  buildStreakDots();
  renderLogTable();
  setTimeout(drawChart, 150);
  const ti = todayIdx();
  showWorkoutDetail(ti);
  document.querySelectorAll('.day-card')[ti]?.classList.add('active');
  initSync(id);
}

function switchUser(id) {
  activeUser = id;
  const url = new URL(location.href);
  url.searchParams.set('user', id);
  history.replaceState({}, '', url);
  applyUserTheme();
  buildDashboard();
  buildWeekGrid();
  buildDiet();
  buildStreakDots();
  renderLogTable();
  setTimeout(drawChart, 150);
  const ti = todayIdx();
  showWorkoutDetail(ti);
  document.querySelectorAll('.day-card')[ti]?.classList.add('active');
  initSync(id);
}

function applyUserTheme() {
  const isSadik = activeUser === 'sadik';
  document.getElementById('pillSadik').className = 'user-pill' + (isSadik ? ' active-sadik' : '');
  document.getElementById('pillAnas').className = 'user-pill' + (!isSadik ? ' active-anas' : '');
  const hero = document.getElementById('dashHero');
  if (hero) hero.className = 'today-card' + (!isSadik ? ' anas' : '');
}

function updateHeaderDate() {
  document.getElementById('headerDate').textContent =
    new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════
function buildDashboard() {
  const u = USERS[activeUser];
  const logs = getLogs();
  const w = logs.length ? parseFloat(logs[logs.length - 1].weight) || u.initWeight : u.initWeight;
  const bmi = (w / Math.pow(u.height / 100, 2)).toFixed(1);
  const toGain = Math.max(0, u.targetWeight - w).toFixed(1);

  document.getElementById('dashName').textContent = u.emoji + ' ' + u.name;
  document.getElementById('dashMeta').textContent =
    'Age ' + u.age + ' · ' + u.height + 'cm · ' + w.toFixed(1) + 'kg · BMI ' + bmi + ' · Goal: ' + u.targetWeight + 'kg Lean Muscle';

  const day = DAYS[todayIdx()];
  document.getElementById('dashTodayFocus').textContent = day.emoji + ' ' + day.muscle;
  document.getElementById('dashTodayDesc').textContent =
    day.type === 'rest' ? 'Rest day — eat well, sleep 8 hours. Recovery = growth! 💪' :
      day.exercises.length + ' exercises · ' + day.warmup;

  document.getElementById('statWeight').textContent = w.toFixed(1);
  document.getElementById('statTarget').textContent = u.targetWeight;
  document.getElementById('statToGain').textContent = toGain;
  document.getElementById('statStreak').textContent = calcStreak(logs);

  document.getElementById('dashNutrition').innerHTML = `
    <div style="font-family:'Bebas Neue',sans-serif;font-size:36px;color:var(--accent)">
      ${u.calories} <span style="font-size:16px;color:var(--text2)">kcal/day</span></div>
    <div class="sep" style="margin:10px 0;"></div>
    <div class="macro-bar-wrap">
      <div class="macro-header"><span>Protein</span><span style="color:var(--blue)">${u.protein}g</span></div>
      <div class="macro-bar"><div class="macro-fill" style="width:50%;background:var(--blue)"></div></div>
    </div>
    <div class="macro-bar-wrap">
      <div class="macro-header"><span>Carbs</span><span style="color:var(--gold)">${u.carbs}g</span></div>
      <div class="macro-bar"><div class="macro-fill" style="width:62%;background:var(--gold)"></div></div>
    </div>
    <div class="macro-bar-wrap">
      <div class="macro-header"><span>Fat</span><span style="color:var(--green)">${u.fat}g</span></div>
      <div class="macro-bar"><div class="macro-fill" style="width:25%;background:var(--green)"></div></div>
    </div>`;
}

function calcStreak(logs) {
  if (!logs.length) return 0;
  let s = 0; const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = logs.length - 1; i >= 0; i--) {
    const d = new Date(logs[i].date); d.setHours(0, 0, 0, 0);
    if ((today - d) / 86400000 > s + 1) break;
    if (logs[i].workout === 'yes') s++;
  }
  return s;
}

function buildStreakDots() {
  const c = document.getElementById('streakDots'); if (!c) return;
  c.innerHTML = '';
  const logs = getLogs();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const log = logs.find(l => l.date === ds);
    const dot = document.createElement('div');
    dot.className = 'streak-dot'; dot.title = ds;
    if (log) {
      if (log.workout === 'yes') dot.classList.add('hit');
      else if (log.workout === 'rest') dot.classList.add('rest-day');
    }
    c.appendChild(dot);
  }
}

// ════════════════════════════════════════════
// WORKOUT
// ════════════════════════════════════════════
function buildWeekGrid() {
  const c = document.getElementById('weekGrid'); if (!c) return;
  c.innerHTML = '';
  const ti = todayIdx();
  DAYS.forEach((day, i) => {
    const el = document.createElement('div');
    el.className = 'day-card' + (day.type === 'rest' ? ' rest' : '') + (i === ti ? ' today' : '');
    el.innerHTML = '<div class="day-name">' + day.day + '</div><div class="day-muscle">' + day.emoji + ' ' + day.muscle + '</div>';
    el.onclick = () => {
      document.querySelectorAll('.day-card').forEach(x => x.classList.remove('active'));
      el.classList.add('active');
      showWorkoutDetail(i);
    };
    c.appendChild(el);
  });
}

function showWorkoutDetail(idx) {
  const day = DAYS[idx];
  const c = document.getElementById('workoutDetail'); if (!c) return;
  c.innerHTML = `
    <div class="workout-detail">
      <div class="workout-header">
        <div class="workout-day-badge" style="background:${day.color};color:${day.color.includes('gold') ? '#000' : '#000'}">${day.emoji}</div>
        <div>
          <div style="font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1px;">${day.muscle}</div>
          <div class="text-sm text-muted">🔥 Warmup: ${day.warmup}</div>
        </div>
      </div>
      <div class="exercise-list">
        ${day.exercises.map((ex, i) => `
          <div class="exercise-item" onclick="openModal(${idx},${i})">
            <div class="ex-num">${i + 1}</div>
            <div class="ex-icon">${ex.icon}</div>
            <div class="ex-info">
              <div class="ex-name">${ex.name}</div>
              <div class="ex-detail">${ex.equipment} · Rest ${ex.rest} · <span style="color:var(--text3)">${ex.muscles.join(', ')}</span></div>
            </div>
            <div class="ex-sets"><div class="set-pill">${ex.sets}×${ex.reps}</div></div>
            <button class="done-toggle${getDoneState(idx, i) ? ' checked' : ''}" id="dt-${idx}-${i}"
              onclick="toggleDone(event,${idx},${i})">${getDoneState(idx, i) ? '✓' : ''}</button>
          </div>`).join('')}
      </div>
    </div>`;
}

function getDoneState(di, ei) {
  return localStorage.getItem(activeUser + '_done_' + di + '_' + ei + '_' + today()) === '1';
}

function toggleDone(e, di, ei) {
  e.stopPropagation();
  const key = activeUser + '_done_' + di + '_' + ei + '_' + today();
  const cur = localStorage.getItem(key) === '1';
  localStorage.setItem(key, cur ? '0' : '1');
  const btn = document.getElementById('dt-' + di + '-' + ei);
  if (btn) { btn.classList.toggle('checked', !cur); btn.textContent = !cur ? '✓' : ''; }
  if (!cur) showNotif('✅ Exercise Done!');
}

function today() { return new Date().toISOString().split('T')[0]; }

// ════════════════════════════════════════════
// EXERCISE MODAL — YouTube + Google Links
// ════════════════════════════════════════════
function openModal(di, ei) {
  const ex = DAYS[di].exercises[ei];
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modalContent');

  const mTags = ex.muscles.map((m, i) =>
    `<span class="mtag ${i === 0 ? 'primary' : 'secondary'}">${m}</span>`).join('');

  // Build search URLs — 100% free, always works, better than broken static images
  const q = encodeURIComponent(ex.name + ' exercise correct form tutorial');
  const ytUrl  = `https://www.youtube.com/results?search_query=${q}`;
  const ggUrl  = `https://www.google.com/search?q=${encodeURIComponent(ex.name + ' exercise form')}&tbm=isch`;
  const ggVid  = `https://www.google.com/search?q=${encodeURIComponent(ex.name + ' how to correct form')}&tbm=vid`;

  // Muscle group colour
  const isRest = ex.muscles[0] === 'Full Recovery' || ex.muscles[0] === 'Recovery';
  const iconBg = isRest
    ? 'rgba(34,197,94,.12)'
    : di === 0 || di === 5 ? 'rgba(249,115,22,.12)'
    : di === 1 ? 'rgba(59,130,246,.12)'
    : di === 2 ? 'rgba(251,191,36,.12)'
    : di === 4 ? 'rgba(239,68,68,.12)'
    : 'rgba(168,85,247,.12)';

  modal.innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>

    <div style="font-size:42px;margin-bottom:6px;text-align:center;">${ex.icon}</div>
    <div style="font-family:'Bebas Neue',sans-serif;font-size:26px;letter-spacing:1px;margin-bottom:8px;text-align:center;">${ex.name}</div>

    <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;justify-content:center;">
      <span class="tag orange">${ex.equipment}</span>
      <span class="tag">${ex.sets} sets × ${ex.reps}</span>
      <span class="tag">Rest: ${ex.rest}</span>
    </div>
    <div class="muscle-tags" style="justify-content:center;">${mTags}</div>

    <!-- VIDEO + IMAGES LINKS CARD -->
    <div class="ex-media-card">
      <div class="ex-media-icon" style="background:${iconBg};font-size:52px;">${ex.icon}</div>
      <div class="ex-media-label">Watch tutorial videos or browse form images:${isRest ? '<br><span style="opacity:.6;font-size:12px;">Rest day — no tutorial needed</span>' : ''}</div>
      <div class="ex-media-btns">
        <a class="ex-media-btn ex-yt" href="${ytUrl}" target="_blank" rel="noopener">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.8 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
          YouTube Tutorial
        </a>
        <a class="ex-media-btn ex-gg" href="${ggUrl}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
          Form Images
        </a>
        <a class="ex-media-btn ex-ggv" href="${ggVid}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          Video Guide
        </a>
      </div>
    </div>

    <div class="sep"></div>
    <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--text3);margin-bottom:8px;">HOW TO DO IT — CORRECT FORM</div>
    <ol class="step-list">
      ${ex.steps.map((s, i) => `
        <li class="step-item">
          <div class="step-num">${i + 1}</div>
          <div class="step-text">${s}</div>
        </li>`).join('')}
    </ol>
    <div style="background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:10px;padding:12px;margin-top:14px;">
      <div style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;">💡 PRO TIP</div>
      <div style="font-size:13px;color:var(--text);line-height:1.6;">${ex.tip}</div>
    </div>`;

  overlay.classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay'))
    document.getElementById('modalOverlay').classList.remove('open');
}

// ════════════════════════════════════════════
// DIET
// ════════════════════════════════════════════
function buildDiet() {
  const u = USERS[activeUser];
  const meals = activeUser === 'sadik' ? SADIK_MEALS : ANAS_MEALS;
  document.getElementById('dietTitle').textContent = 'HALAL DIET — ' + u.name;
  document.getElementById('dietSub').textContent =
    u.calories + ' kcal · ' + u.protein + 'g Protein · ' + u.carbs + 'g Carbs · ' + u.fat + 'g Fat · No Supplements';
  document.getElementById('dietMacros').innerHTML = `
    <div class="stat-card">
      <div class="card-title">Protein</div>
      <div class="stat-number" style="color:var(--blue)">${u.protein}g</div>
      <div class="stat-label">per day</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Carbs</div>
      <div class="stat-number" style="color:var(--gold)">${u.carbs}g</div>
      <div class="stat-label">per day</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Fat</div>
      <div class="stat-number" style="color:var(--green)">${u.fat}g</div>
      <div class="stat-label">per day</div>
    </div>
    <div class="stat-card">
      <div class="card-title">Total</div>
      <div class="stat-number">${u.calories}</div>
      <div class="stat-label">kcal</div>
    </div>`;

  document.getElementById('mealsContainer').innerHTML = meals.map((meal, i) => `
    <div class="meal-card">
      <div class="meal-header" onclick="toggleMeal(${i})">
        <div>
          <div class="meal-time-badge">${meal.time}</div>
          <div class="meal-name">${meal.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="meal-kcal">${meal.kcal}</div>
          <div style="font-size:11px;color:var(--text3)">kcal</div>
        </div>
      </div>
      <div class="meal-body" id="meal-${i}">
        <div style="margin-top:12px;">
          ${meal.items.map(item => `
            <div class="food-row">
              <span>${item.name} <span style="color:var(--text3)">(${item.amount})</span></span>
              <div class="food-macros">
                <span style="color:var(--blue)">P:${item.protein}</span>
                <span style="color:var(--gold)">C:${item.carbs}</span>
                <span style="color:var(--green)">F:${item.fat}</span>
                <span>${item.kcal}kcal</span>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`).join('');
  document.getElementById('meal-0')?.classList.add('open');
}

function toggleMeal(i) { document.getElementById('meal-' + i)?.classList.toggle('open'); }

// ════════════════════════════════════════════
// PROGRESS / LOGS
// ════════════════════════════════════════════
function storageKey() { return activeUser + '_logs'; }
function getLogs() { return JSON.parse(localStorage.getItem(storageKey()) || '[]'); }
function saveLogs(logs) { localStorage.setItem(storageKey(), JSON.stringify(logs)); }

function logProgress() {
  const weight = document.getElementById('inp-weight').value;
  const chest = document.getElementById('inp-chest').value;
  const bicep = document.getElementById('inp-bicep').value;
  const shoulder = document.getElementById('inp-shoulder').value;
  const waist = document.getElementById('inp-waist').value;
  const workout = document.getElementById('inp-workout').value;
  if (!weight) { showNotif('⚠️ Enter your weight first!', 'red'); return; }
  const logs = getLogs();
  const dt = today();
  const idx = logs.findIndex(l => l.date === dt);
  const entry = { date: dt, weight, chest, bicep, shoulder, waist, workout };
  if (idx >= 0) logs[idx] = entry; else logs.push(entry);
  saveLogs(logs);
  renderLogTable();
  drawChart();
  buildDashboard();
  buildStreakDots();
  showNotif('✅ Progress Saved!');
  ['weight', 'chest', 'bicep', 'shoulder', 'waist'].forEach(f => document.getElementById('inp-' + f).value = '');
  syncSave(activeUser, { logs });
}

function renderLogTable() {
  const logs = getLogs();
  const tb = document.getElementById('logTableBody'); if (!tb) return;
  document.getElementById('progressSub').textContent =
    'Tracking: ' + USERS[activeUser].name + ' · ' + logs.length + ' entries logged';
  if (!logs.length) {
    tb.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text3);padding:24px;">No logs yet. Start tracking! 💪</td></tr>';
    updateProgressStats([]); return;
  }
  const sorted = [...logs].reverse();
  tb.innerHTML = sorted.map((log, i) => {
    const prev = sorted[i + 1];
    const diff = prev && log.weight && prev.weight ? (parseFloat(log.weight) - parseFloat(prev.weight)).toFixed(1) : '-';
    const dc = diff !== '-' ? (parseFloat(diff) >= 0 ? 'pos' : 'neg') : '';
    const ds = diff !== '-' ? (parseFloat(diff) >= 0 ? '+' + diff : diff) : '-';
    return `<tr>
      <td>${log.date}</td>
      <td><strong>${log.weight || '-'} kg</strong></td>
      <td>${log.chest || '-'} cm</td>
      <td>${log.bicep || '-'} cm</td>
      <td>${log.shoulder || '-'} cm</td>
      <td>${log.waist || '-'} cm</td>
      <td class="${dc}">${ds}</td>
      <td>${log.workout === 'yes' ? '✅' : log.workout === 'rest' ? '😴' : '❌'}</td>
    </tr>`;
  }).join('');
  updateProgressStats(logs);
}

function updateProgressStats(logs) {
  const c = document.getElementById('progressStats'); if (!c) return;
  if (!logs.length) { c.innerHTML = '<div style="color:var(--text3);font-size:13px;">Log your first entry to see stats here.</div>'; return; }
  const first = logs[0], last = logs[logs.length - 1];
  const gained = last.weight && first.weight ? (parseFloat(last.weight) - parseFloat(first.weight)).toFixed(1) : '0';
  c.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div style="background:var(--bg3);border-radius:10px;padding:12px;">
        <div class="card-title">Starting Weight</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;">${first.weight || '-'} kg</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;">
        <div class="card-title">Current Weight</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--accent)">${last.weight || '-'} kg</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;">
        <div class="card-title">Total Gained</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:${parseFloat(gained) >= 0 ? 'var(--green)' : 'var(--red)'}">
          ${parseFloat(gained) >= 0 ? '+' : ''}${gained} kg</div>
      </div>
      <div style="background:var(--bg3);border-radius:10px;padding:12px;">
        <div class="card-title">Days Logged</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;color:var(--blue)">${logs.length}</div>
      </div>
    </div>`;
}

function clearLogs() {
  if (confirm('Clear ALL progress logs for ' + USERS[activeUser].name + '? This cannot be undone.')) {
    localStorage.removeItem(storageKey());
    renderLogTable(); drawChart(); buildDashboard(); buildStreakDots();
    showNotif('🗑 Logs Cleared');
    syncSave(activeUser, { logs: [] });
  }
}

// ════════════════════════════════════════════
// CHART
// ════════════════════════════════════════════
function drawChart() {
  const canvas = document.getElementById('weightChart'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const logs = getLogs().filter(l => l.weight);
  canvas.width = canvas.offsetWidth || 600; canvas.height = 160;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (logs.length < 2) {
    ctx.fillStyle = '#525252'; ctx.font = '14px Barlow,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Log at least 2 entries to see your weight chart', W / 2, H / 2); return;
  }
  const weights = logs.map(l => parseFloat(l.weight));
  const min = Math.min(...weights) - 1, max = Math.max(...weights) + 1;
  const pad = { l: 40, r: 20, t: 20, b: 30 };
  const toX = i => pad.l + (i / (logs.length - 1)) * (W - pad.l - pad.r);
  const toY = v => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.t + (i / 4) * (H - pad.t - pad.b);
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
  }
  // Y-axis labels
  ctx.fillStyle = '#525252'; ctx.font = '11px Barlow,sans-serif'; ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = max - (i / 4) * (max - min);
    const y = pad.t + (i / 4) * (H - pad.t - pad.b);
    ctx.fillText(v.toFixed(1), pad.l - 4, y + 4);
  }
  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(249,115,22,0.3)'); grad.addColorStop(1, 'rgba(249,115,22,0)');
  ctx.beginPath(); ctx.moveTo(toX(0), H - pad.b);
  weights.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
  ctx.lineTo(toX(weights.length - 1), H - pad.b); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  weights.forEach((v, i) => { if (i === 0) ctx.moveTo(toX(i), toY(v)); else ctx.lineTo(toX(i), toY(v)); });
  ctx.stroke();
  // Dots + labels
  ctx.textAlign = 'center'; ctx.fillStyle = '#a3a3a3'; ctx.font = '11px Barlow,sans-serif';
  weights.forEach((v, i) => {
    ctx.beginPath(); ctx.arc(toX(i), toY(v), 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316'; ctx.fill();
    ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 2; ctx.stroke();
    if (i === 0 || i === weights.length - 1 || i % Math.ceil(weights.length / 5) === 0) {
      ctx.fillStyle = '#a3a3a3'; ctx.fillText(v + 'kg', toX(i), toY(v) - 10);
    }
  });
}

// ════════════════════════════════════════════
// TIMER
// ════════════════════════════════════════════
function setTimer(secs, btn) {
  clearInterval(timerInterval); timerRunning = false;
  timerTotal = secs; timerRemaining = secs;
  document.getElementById('timerDisplay').textContent = secs;
  document.getElementById('timerBtn').textContent = '▶ Start';
  updateTimerArc(secs, secs);
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval); timerRunning = false;
    document.getElementById('timerBtn').textContent = '▶ Resume';
  } else {
    timerRunning = true;
    document.getElementById('timerBtn').textContent = '⏸ Pause';
    timerInterval = setInterval(() => {
      timerRemaining--;
      document.getElementById('timerDisplay').textContent = timerRemaining;
      updateTimerArc(timerRemaining, timerTotal);
      if (timerRemaining <= 0) {
        clearInterval(timerInterval); timerRunning = false;
        document.getElementById('timerBtn').textContent = '▶ Start';
        document.getElementById('timerDisplay').textContent = 'GO!';
        showNotif('🔔 Rest Complete! Time to lift!');
        playBeep();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval); timerRunning = false; timerRemaining = timerTotal;
  document.getElementById('timerDisplay').textContent = timerTotal;
  document.getElementById('timerBtn').textContent = '▶ Start';
  updateTimerArc(timerTotal, timerTotal);
}

function updateTimerArc(r, t) {
  const arc = document.getElementById('timerArc'); if (!arc) return;
  const c = 552.9, offset = c * (1 - r / t);
  arc.style.strokeDashoffset = offset;
  const ratio = r / t;
  arc.style.stroke = ratio > 0.5 ? '#f97316' : ratio > 0.25 ? '#fbbf24' : '#ef4444';
}

function playBeep() {
  try {
    const ctx = new AudioContext(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(); osc.stop(ctx.currentTime + 0.8);
  } catch (e) { }
}

// ════════════════════════════════════════════
// TIPS
// ════════════════════════════════════════════
function buildTips() {
  const c = document.getElementById('tipsContainer'); if (!c) return;
  c.innerHTML = TIPS.map(t => `
    <div class="tip-card">
      <div class="tip-icon ${t.cls}">${t.icon}</div>
      <div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-text">${t.text}</div>
      </div>
    </div>`).join('');
}

// ════════════════════════════════════════════
// NAV
// ════════════════════════════════════════════
function showPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 'progress') setTimeout(drawChart, 100);
  if (id === 'leaderboard') buildLeaderboard();
  if (id === 'workout') {
    setTimeout(() => {
      const ti = todayIdx(); showWorkoutDetail(ti);
      document.querySelectorAll('.day-card')[ti]?.classList.add('active');
    }, 50);
  }
}

// ════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════
function showNotif(msg, color) {
  const n = document.getElementById('notif');
  n.textContent = msg;
  n.style.background = color === 'red' ? 'var(--red)' : color === 'orange' ? 'var(--accent)' : 'var(--green)';
  n.style.color = color === 'red' || color === 'orange' ? '#000' : '#000';
  n.classList.add('show');
  clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => n.classList.remove('show'), 2800);
}

window.addEventListener('resize', drawChart);

// ════════════════════════════════════════════
// JSONBIN CROSS-DEVICE SYNC
// ════════════════════════════════════════════
function setBinStatus(st) {
  const dot = document.getElementById('syncDot');
  const lbl = document.getElementById('syncLabel');
  if (!dot) return;
  dot.className = 'sync-dot' + (st === 'syncing' ? ' syncing' : st === 'offline' ? ' offline' : '');
  if (lbl) lbl.textContent = st === 'syncing' ? 'Syncing...' : st === 'offline' ? 'Offline' : 'Synced';
}

async function initSync(userId) {
  const existing = localStorage.getItem(userId + '_binId');
  if (existing) { await syncPull(userId); return; }
  try {
    setBinStatus('syncing');
    const r = await fetch(JBURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 'X-Master-Key': JBKEY,
        'X-Bin-Name': 'phasefit-' + userId, 'X-Bin-Private': 'false'
      },
      body: JSON.stringify({ logs: [], user: userId, createdAt: new Date().toISOString() })
    });
    const data = await r.json();
    const binId = data.metadata?.id;
    if (binId) {
      localStorage.setItem(userId + '_binId', binId);
      setBinStatus('ok');
    }
  } catch (e) { setBinStatus('offline'); }
}

async function syncSave(userId, record) {
  const binId = localStorage.getItem(userId + '_binId'); if (!binId) return;
  try {
    setBinStatus('syncing');
    await fetch(JBURL + '/' + binId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': JBKEY },
      body: JSON.stringify({ ...record, userId, updatedAt: new Date().toISOString() })
    });
    setBinStatus('ok');
  } catch (e) { setBinStatus('offline'); }
}

async function syncPull(userId) {
  const binId = localStorage.getItem(userId + '_binId'); if (!binId) return;
  try {
    const r = await fetch(JBURL + '/' + binId + '/latest',
      { headers: { 'X-Master-Key': JBKEY } });
    if (!r.ok) return;
    const data = await r.json();
    const remoteLogs = data.record?.logs;
    if (!remoteLogs || !remoteLogs.length) return;
    const localLogs = getLogs();
    // Merge: keep unique dates, prefer most recent entry
    const merged = Object.values(
      [...localLogs, ...remoteLogs].reduce((acc, log) => {
        const existing = acc[log.date];
        if (!existing || new Date(log.updatedAt || 0) > new Date(existing.updatedAt || 0))
          acc[log.date] = log;
        return acc;
      }, {})).sort((a, b) => a.date.localeCompare(b.date));
    const localStr = JSON.stringify(localLogs.sort((a, b) => a.date.localeCompare(b.date)));
    if (JSON.stringify(merged) !== localStr) {
      saveLogs(merged);
      renderLogTable(); drawChart(); buildDashboard(); buildStreakDots();
      showNotif('☁️ Data synced from cloud!');
    }
    setBinStatus('ok');
  } catch (e) { setBinStatus('offline'); }
}

// ════════════════════════════════════════════
// SYNC MODAL
// ════════════════════════════════════════════
function openSyncModal() {
  const sadikBin = localStorage.getItem('sadik_binId') || 'Not set up yet';
  const anasBin = localStorage.getItem('anas_binId') || 'Not set up yet';
  document.getElementById('syncModalBody').innerHTML = `
    <div style="display:grid;gap:14px;">
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div class="user-av sav">S</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;">SADIK's Sync ID</div>
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;color:var(--gold);word-break:break-all;margin-bottom:10px;">
          ${sadikBin}</div>
        <button class="btn btn-ghost" style="font-size:12px;padding:6px 14px;"
          onclick="navigator.clipboard.writeText('${sadikBin}');showNotif('📋 Sadik ID Copied!')">
          📋 Copy ID
        </button>
      </div>
      <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <div class="user-av aav">A</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-weight:700;">ANAS's Sync ID</div>
        </div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;color:var(--blue);word-break:break-all;margin-bottom:10px;">
          ${anasBin}</div>
        <button class="btn btn-ghost" style="font-size:12px;padding:6px 14px;"
          onclick="navigator.clipboard.writeText('${anasBin}');showNotif('📋 Anas ID Copied!')">
          📋 Copy ID
        </button>
      </div>
      <div style="background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.15);border-radius:10px;padding:12px;font-size:13px;color:var(--text2);">
        💡 <strong style="color:var(--text)">How to use:</strong> Dusre device pe website kholo, same URL use karo 
        (<code>?user=sadik</code> ya <code>?user=anas</code>). Data automatically sync hoga within 90 seconds. 
        Ya Sync ID apne doosre device pe paste karo neeche:
      </div>
      <div style="display:flex;gap:8px;">
        <input class="form-input" id="manualBinId" placeholder="Paste Sync ID here...">
        <button class="btn" onclick="setManualBin()">Set</button>
      </div>
    </div>`;
  document.getElementById('syncOverlay').classList.add('open');
}

function setManualBin() {
  const id = document.getElementById('manualBinId')?.value?.trim();
  if (!id) { showNotif('⚠️ Enter a Sync ID', 'red'); return; }
  localStorage.setItem(activeUser + '_binId', id);
  showNotif('✅ Sync ID Set! Pulling data...');
  closeSyncModal();
  syncPull(activeUser);
}

function closeSyncModal(e) {
  if (!e || e.target === document.getElementById('syncOverlay'))
    document.getElementById('syncOverlay').classList.remove('open');
}
