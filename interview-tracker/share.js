import { sb, configured, STATUSES, ENDED, PREP_KINDS, esc, fmtDay, statusClass, resultClass, ymd, initTheme } from './common.js';

const main = document.querySelector('#main');

function weekLabel(w) { return fmtDay(w, false); }

function appBlock(a, stages) {
  const name = a.company || `某${a.industry ? `${a.industry}` : ''}公司`;
  const steps = stages.map((s) => `
    <div class="step ${resultClass(s.result)}${s.is_expected ? ' expected' : ''}">
      <span class="dot"></span>
      <div class="step-head"><span class="name">${esc(s.name)}</span><span class="badge ${resultClass(s.result)}">${esc(s.result)}</span></div>
      <div class="step-meta">${s.on_date ? `<span>${fmtDay(s.on_date, false)}</span>` : '<span>待排定</span>'}${s.kind ? `<span class="tag">${esc(s.kind)}</span>` : ''}${s.format ? `<span>${esc(s.format)}</span>` : ''}</div>
      ${s.public_note ? `<div class="step-body"><div class="prose">${esc(s.public_note)}</div></div>` : ''}
    </div>`).join('');
  return `<article class="card share-app">
    <div class="step-head"><h3>${esc(name)}</h3><span class="badge ${statusClass(a.status)}">${esc(a.status)}</span></div>
    <div class="role">${esc(a.role)}${a.industry && a.company ? ` · ${esc(a.industry)}` : ''}</div>
    ${a.public_note ? `<div class="prose note">${esc(a.public_note)}</div>` : ''}
    ${steps ? `<div class="stepper">${steps}</div>` : '<p class="small muted">尚無關卡紀錄。</p>'}
  </article>`;
}

function bars(rows) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return `<div class="bars">${rows.map((r) => `<div class="bar-row"><span>${esc(r.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${(r.value / max) * 100}%"></div></div><span class="num">${esc(r.text ?? r.value)}</span></div>`).join('')}</div>`;
}

async function load() {
  if (!configured) {
    main.innerHTML = '<div class="empty">分享頁尚未設定。</div>';
    return;
  }
  const [apps, stages, stats, weekly, prep] = await Promise.all([
    sb.from('public_applications').select('*'),
    sb.from('public_stages').select('*').order('seq'),
    sb.from('public_prep_stats').select('*'),
    sb.from('public_prep_weekly').select('*').order('week'),
    sb.from('public_prep').select('*').order('done_on', { ascending: false }).limit(50),
  ]);
  const err = [apps, stages, stats, weekly, prep].find((r) => r.error);
  if (err) { main.innerHTML = `<div class="empty">讀取失敗：${esc(err.error.message)}</div>`; return; }

  const byApp = new Map();
  for (const s of stages.data) { if (!byApp.has(s.application_id)) byApp.set(s.application_id, []); byApp.get(s.application_id).push(s); }

  const order = (s) => STATUSES.indexOf(s);
  const list = apps.data.sort((x, y) => order(x.status) - order(y.status));
  const active = list.filter((a) => !ENDED.includes(a.status));
  const ended = list.filter((a) => ENDED.includes(a.status));

  const s = stats.data;
  const sum = (rows, k) => rows.reduce((t, r) => t + (r[k] || 0), 0);
  const kindRows = PREP_KINDS.map((k) => {
    const r = s.filter((x) => x.kind === k);
    return { label: k, value: sum(r, 'sessions'), text: `${sum(r, 'sessions')} 次` };
  }).filter((r) => r.value);
  const caseRows = s.filter((x) => x.kind === 'Case').map((x) => ({ label: x.topic, value: x.sessions }))
    .reduce((acc, r) => { const f = acc.find((a) => a.label === r.label); if (f) f.value += r.value; else acc.push({ ...r }); return acc; }, [])
    .sort((a, b) => b.value - a.value);
  const lcRows = ['Easy', 'Medium', 'Hard'].map((d) => ({ label: d, value: sum(s.filter((x) => x.kind === 'LeetCode' && x.difficulty === d), 'sessions') })).filter((r) => r.value);
  const totalHours = (sum(s, 'minutes') / 60).toFixed(1);

  const weeks = [...new Set(weekly.data.map((w) => w.week))].slice(-10);
  const wk = weeks.map((w) => ({ w, min: sum(weekly.data.filter((x) => x.week === w), 'minutes') }));
  const maxMin = Math.max(60, ...wk.map((x) => x.min));

  main.innerHTML = `
    <div class="intro">
      <h1>求職紀錄</h1>
      <p class="muted">應徵流程、各關形式與準備方法的整理。為遵守各公司的保密要求，這裡只寫題型與準備方式，不寫面試原題。</p>
      <p class="small muted">更新於 ${fmtDay(ymd(), false)}</p>
    </div>

    <div class="stats-row">
      <div class="stat"><div class="v">${list.length}</div><div class="k">應徵</div></div>
      <div class="stat"><div class="v">${sum(s, 'sessions')}</div><div class="k">準備紀錄</div></div>
      <div class="stat"><div class="v">${totalHours}</div><div class="k">準備小時</div></div>
    </div>

    ${active.length ? `<div class="group-title">進行中</div><div class="share-apps">${active.map((a) => appBlock(a, byApp.get(a.id) || [])).join('')}</div>` : ''}
    ${ended.length ? `<div class="group-title">已結束</div><div class="share-apps">${ended.map((a) => appBlock(a, byApp.get(a.id) || [])).join('')}</div>` : ''}
    ${list.length ? '' : '<div class="empty">目前沒有公開的應徵紀錄。</div>'}

    <div class="group-title">準備</div>
    <div class="grid-2">
      <div class="stack">
        <section class="card"><div class="section-title">每週準備時數</div>
          ${wk.length ? `<div class="vbars">${wk.map((x) => `<div class="vbar"><span class="val">${x.min ? (x.min / 60).toFixed(1) : ''}</span><div class="fill" style="height:${(x.min / maxMin) * 120}px"></div><span class="lab">${weekLabel(x.w)}</span></div>`).join('')}</div>` : '<p class="small muted">尚無資料。</p>'}
        </section>
        ${prep.data.length ? `<section class="card"><div class="section-title">練習筆記</div>${prep.data.map((p) => `
          <div class="list-row" style="cursor:default"><div><div class="title">${esc(p.topic || p.kind)}</div><div class="small muted">${fmtDay(p.done_on, false)} · ${esc(p.kind)}${p.difficulty ? ` · ${esc(p.difficulty)}` : ''}</div>${p.public_note ? `<div class="prose small" style="margin-top:4px">${esc(p.public_note)}</div>` : ''}</div></div>`).join('')}</section>` : ''}
      </div>
      <div class="stack">
        <section class="card"><div class="section-title">類型</div>${kindRows.length ? bars(kindRows) : '<p class="small muted">尚無資料。</p>'}</section>
        ${caseRows.length ? `<section class="card"><div class="section-title">Case 類型</div>${bars(caseRows)}</section>` : ''}
        ${lcRows.length ? `<section class="card"><div class="section-title">LeetCode 難度</div>${bars(lcRows)}</section>` : ''}
      </div>
    </div>`;
}

initTheme('#btn-theme');
load().catch((e) => { main.innerHTML = `<div class="empty">讀取失敗：${esc(e.message)}</div>`; });
