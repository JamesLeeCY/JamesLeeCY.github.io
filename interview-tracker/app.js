import {
  sb, configured, ACTIVE, ENDED, STATUSES, STATUS_ORDER, CHANNELS, PRIORITIES, STAGE_KINDS, STAGE_NAMES,
  FORMATS, RESULTS, PREP_KINDS, CASE_TYPES, LC_TOPICS, DIFFICULTIES, INDUSTRIES,
  esc, ymd, daysUntil, relDays, fmtDay, fmtTime, isoToLocalInput, localInputToIso, initTheme,
  statusClass, resultClass,
} from './common.js';

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const main = $('#main');
const dlg = $('#dlg');

const state = { user: null, companies: [], apps: [], stages: [], prep: [], prepFilter: 'all' };
const companyById = (id) => state.companies.find((c) => c.id === id);
const appById = (id) => state.apps.find((a) => a.id === id);
const stagesOf = (appId) => state.stages.filter((s) => s.application_id === appId).sort(stageSort);

function stageSort(a, b) {
  if (a.seq !== b.seq) return a.seq - b.seq;
  return (a.scheduled_at || '9999').localeCompare(b.scheduled_at || '9999');
}

function stageDay(s) { return s.scheduled_at ? ymd(new Date(s.scheduled_at)) : null; }

function nextStage(appId) {
  return stagesOf(appId).find((s) => s.result === '待定') || null;
}

function appTitle(a) {
  const c = companyById(a.company_id);
  return c ? c.name : '（未知公司）';
}

// ---------------------------------------------------------------- toast
let toastTimer;
function toast(msg, err = false) {
  let el = $('.toast');
  if (!el) { el = document.createElement('div'); document.body.appendChild(el); }
  el.className = `toast${err ? ' err' : ''}`;
  el.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), err ? 5000 : 2200);
}

function fail(error) {
  console.error(error);
  toast(`出錯了：${error?.message || error}`, true);
}

// ---------------------------------------------------------------- data
async function loadAll() {
  const [c, a, s, p] = await Promise.all([
    sb.from('companies').select('*').order('name'),
    sb.from('applications').select('*').order('created_at'),
    sb.from('stages').select('*'),
    sb.from('prep_logs').select('*').order('done_on', { ascending: false }),
  ]);
  for (const r of [c, a, s, p]) if (r.error) throw r.error;
  state.companies = c.data; state.apps = a.data; state.stages = s.data; state.prep = p.data;
}

const clean = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === '' ? null : v]));

async function upsert(table, values, id) {
  const q = id
    ? sb.from(table).update(clean(values)).eq('id', id).select().single()
    : sb.from(table).insert(clean(values)).select().single();
  const { data, error } = await q;
  if (error) throw error;
  const list = { companies: state.companies, applications: state.apps, stages: state.stages, prep_logs: state.prep }[table];
  const i = list.findIndex((x) => x.id === data.id);
  if (i >= 0) list[i] = data; else list.push(data);
  return data;
}

async function remove(table, id) {
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) throw error;
  await loadAll(); // cascades may remove children
}

async function ensureCompany(name, industry) {
  const n = name.trim();
  let c = state.companies.find((x) => x.name.toLowerCase() === n.toLowerCase());
  if (!c) c = await upsert('companies', { name: n, industry: industry || null });
  else if (industry && industry !== c.industry) c = await upsert('companies', { industry }, c.id);
  return c;
}

// ---------------------------------------------------------------- forms
/*
  field: { name, label, type: text|textarea|select|date|datetime|number|check|list|section, options, required, hint, full, placeholder }
*/
function fieldHtml(f, v) {
  if (f.type === 'section') return `<div class="form-section">${esc(f.label)}</div>`;
  const id = `f-${f.name}`;
  const full = f.full || f.type === 'textarea' ? ' full' : '';
  const req = f.required ? ' required' : '';
  const hint = f.hint ? `<span class="hint">${esc(f.hint)}</span>` : '';
  if (f.type === 'check') {
    return `<div class="field check${f.full ? ' full' : ''}"><input type="checkbox" id="${id}" name="${f.name}" ${v ? 'checked' : ''}><label for="${id}">${esc(f.label)}</label>${hint}</div>`;
  }
  let input;
  const val = v ?? '';
  switch (f.type) {
    case 'textarea':
      input = `<textarea id="${id}" name="${f.name}" placeholder="${esc(f.placeholder || '')}"${req}>${esc(val)}</textarea>`; break;
    case 'select': {
      const opts = (f.options || []).map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
      input = `<select id="${id}" name="${f.name}"${req}>${f.blank ? '<option value="">—</option>' : ''}${opts.map((o) =>
        `<option value="${esc(o.value)}" ${String(o.value) === String(val) ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`;
      break;
    }
    case 'list':
      input = `<input id="${id}" name="${f.name}" list="${id}-dl" value="${esc(val)}" placeholder="${esc(f.placeholder || '')}" autocomplete="off"${req}>
        <datalist id="${id}-dl">${(f.options || []).map((o) => `<option value="${esc(o)}">`).join('')}</datalist>`;
      break;
    case 'datetime':
      input = `<input type="datetime-local" id="${id}" name="${f.name}" value="${esc(isoToLocalInput(val))}"${req}>`; break;
    default:
      input = `<input type="${f.type || 'text'}" id="${id}" name="${f.name}" value="${esc(val)}" placeholder="${esc(f.placeholder || '')}"${f.type === 'number' ? ' min="0"' : ''}${req}>`;
  }
  return `<div class="field${full}"><label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}</label>${input}${hint}</div>`;
}

function readForm(form, fields) {
  const out = {};
  for (const f of fields) {
    if (f.type === 'section') continue;
    const el = form.elements[f.name];
    if (!el) continue;
    if (f.type === 'check') out[f.name] = el.checked;
    else if (f.type === 'number') out[f.name] = el.value === '' ? null : Number(el.value);
    else if (f.type === 'datetime') out[f.name] = localInputToIso(el.value);
    else out[f.name] = el.value.trim();
  }
  return out;
}

function openForm({ title, fields, values = {}, submitLabel = '儲存', onSubmit, onDelete }) {
  dlg.innerHTML = `
    <form method="dialog" novalidate>
      <div class="dlg-head"><h2>${esc(title)}</h2><button type="button" class="btn ghost sm" data-close>關閉</button></div>
      <div class="dlg-body"><div class="form-grid">${fields.map((f) => fieldHtml(f, values[f.name])).join('')}</div></div>
      <div class="dlg-foot">
        ${onDelete ? '<button type="button" class="btn danger sm" data-delete>刪除</button>' : ''}
        <span class="spacer"></span>
        <button type="button" class="btn" data-close>取消</button>
        <button type="submit" class="btn primary">${esc(submitLabel)}</button>
      </div>
    </form>`;
  const form = $('form', dlg);
  $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
  if (onDelete) {
    $('[data-delete]', dlg).addEventListener('click', async () => {
      if (!confirm('確定刪除？這個動作無法復原。')) return;
      try { await onDelete(); dlg.close(); render(); toast('已刪除'); } catch (e) { fail(e); }
    });
  }
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const missing = fields.filter((f) => f.required && !form.elements[f.name]?.value.trim());
    if (missing.length) { toast(`請填寫：${missing.map((f) => f.label).join('、')}`, true); return; }
    const btn = $('[type=submit]', form);
    btn.disabled = true;
    try {
      await onSubmit(readForm(form, fields));
      dlg.close();
      render();
      toast('已儲存');
    } catch (e) { fail(e); btn.disabled = false; }
  });
  dlg.showModal();
  const first = $('input:not([type=checkbox]), textarea, select', dlg);
  if (first) first.focus();
}

// ---------------------------------------------------------------- forms: application
function appFields() {
  return [
    { type: 'section', label: '基本資料' },
    { name: 'company', label: '公司', type: 'list', options: state.companies.map((c) => c.name), required: true },
    { name: 'industry', label: '產業', type: 'list', options: INDUSTRIES },
    { name: 'role', label: '職缺', required: true, full: true, placeholder: '例：Business Analyst、Data Scientist' },
    { name: 'job_url', label: '職缺網址', type: 'url', full: true },
    { name: 'status', label: '狀態', type: 'select', options: STATUSES },
    { name: 'priority', label: '優先度', type: 'select', options: PRIORITIES },
    { name: 'channel', label: '管道／平台', type: 'list', options: CHANNELS },
    { name: 'location', label: '地點' },
    { name: 'applied_on', label: '投遞日', type: 'date' },
    { name: 'deadline', label: '截止日', type: 'date', hint: '投遞或回覆截止，會出現在時間軸' },
    { name: 'resume_uploaded', label: '已上傳履歷', type: 'check', full: true },
    { type: 'section', label: '私人（永遠不會出現在分享頁）' },
    { name: 'latest_update', label: '最新消息', full: true, placeholder: '例：一面結束，等通知' },
    { name: 'contact', label: '聯絡人', placeholder: '獵頭、HR、內推人' },
    { name: 'connections', label: '認識的人', placeholder: '公司內的學長姐、朋友' },
    { name: 'portal_account', label: '求職網站帳號', hint: '只記帳號；密碼請放密碼管理工具' },
    { name: 'salary_note', label: '薪資／條件' },
    { name: 'notes', label: '備註', type: 'textarea' },
    { type: 'section', label: '分享' },
    { name: 'is_public', label: '在分享頁顯示這筆應徵', type: 'check' },
    { name: 'share_anonymous', label: '匿名（隱藏公司名稱，只顯示產業）', type: 'check' },
    { name: 'public_note', label: '公開說明', type: 'textarea', placeholder: '給讀者看的整體心得：流程、時程、準備重點' },
  ];
}

function openAppForm(app) {
  const c = app ? companyById(app.company_id) : null;
  openForm({
    title: app ? '編輯應徵' : '新增應徵',
    fields: appFields(),
    values: app ? { ...app, company: c?.name, industry: c?.industry } : { status: '想投', priority: 2 },
    onSubmit: async (v) => {
      const company = await ensureCompany(v.company, v.industry);
      const { company: _c, industry: _i, ...rest } = v;
      const saved = await upsert('applications', { ...rest, company_id: company.id, priority: Number(rest.priority) }, app?.id);
      if (!app) location.hash = `#app/${saved.id}`;
    },
    onDelete: app ? () => remove('applications', app.id).then(() => { location.hash = '#board'; }) : null,
  });
}

// ---------------------------------------------------------------- forms: stage
function stageFields() {
  return [
    { type: 'section', label: '關卡' },
    { name: 'name', label: '名稱', type: 'list', options: STAGE_NAMES, required: true },
    { name: 'seq', label: '順序', type: 'number', hint: '第幾關，用來排序' },
    { name: 'kind', label: '類型', type: 'select', options: STAGE_KINDS, blank: true },
    { name: 'format', label: '形式', type: 'select', options: FORMATS, blank: true },
    { name: 'scheduled_at', label: '日期時間', type: 'datetime', hint: '台北時間' },
    { name: 'result', label: '結果', type: 'select', options: RESULTS },
    { name: 'is_expected', label: '預期關卡（還沒排定，先記下來）', type: 'check', full: true },
    { type: 'section', label: '心得（私人）' },
    { name: 'interviewer', label: '面試官' },
    { name: 'self_rating', label: '自評', type: 'select', options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} / 5` })), blank: true },
    { name: 'reflection', label: '心得', type: 'textarea', placeholder: '問了什麼類型、自己怎麼回答、對方反應' },
    { name: 'improve', label: '可改進處', type: 'textarea' },
    { type: 'section', label: '分享' },
    { name: 'is_public', label: '應徵公開時顯示這一關', type: 'check', full: true },
    { name: 'public_note', label: '公開版心得', type: 'textarea', placeholder: '只寫題型與準備方式，不寫原題（多數公司要求保密）' },
  ];
}

async function maybeAdvance(app, stage) {
  const cur = STATUS_ORDER[app.status];
  let next = null;
  if (stage.result === '未通過') {
    if (!ENDED.includes(app.status) && confirm('這一關未通過，要把整筆應徵標成「未通過」嗎？')) next = '未通過';
  } else if (stage.kind === '筆試/OA' || stage.name === '筆試/OA') {
    if (cur < STATUS_ORDER['筆試/OA']) next = '筆試/OA';
  } else if (stage.name !== '履歷審查' && !stage.is_expected && cur < STATUS_ORDER['面試中']) {
    next = '面試中';
  }
  if (next) await upsert('applications', { status: next }, app.id);
}

function openStageForm(app, stage) {
  const existing = stagesOf(app.id);
  openForm({
    title: `${stage ? '編輯關卡' : '新增關卡'} · ${appTitle(app)}`,
    fields: stageFields(),
    values: stage || { seq: (existing.at(-1)?.seq || 0) + 1, result: '待定', is_public: true },
    onSubmit: async (v) => {
      const saved = await upsert('stages', {
        ...v, application_id: app.id, seq: v.seq ?? 1,
        self_rating: v.self_rating ? Number(v.self_rating) : null,
      }, stage?.id);
      await maybeAdvance(app, saved);
    },
    onDelete: stage ? () => remove('stages', stage.id) : null,
  });
}

// ---------------------------------------------------------------- forms: prep
function prepFields() {
  return [
    { type: 'section', label: '練習' },
    { name: 'kind', label: '類型', type: 'select', options: PREP_KINDS, required: true },
    { name: 'done_on', label: '日期', type: 'date', required: true },
    { name: 'topic', label: '主題', type: 'list', options: [...CASE_TYPES, ...LC_TOPICS], hint: 'Case 類型或 LeetCode 主題' },
    { name: 'ref', label: '題目／夥伴', placeholder: '例：LC 322 Coin Change、和 Amy 練 case' },
    { name: 'difficulty', label: '難度', type: 'select', options: DIFFICULTIES, blank: true },
    { name: 'minutes', label: '時長（分鐘）', type: 'number' },
    { name: 'rating', label: '自評', type: 'select', options: [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `${n} / 5` })), blank: true },
    { name: 'review_on', label: '下次複習', type: 'date', hint: '到期前 3 天會出現在時間軸' },
    { name: 'weak_tags', label: '弱點標籤', full: true, placeholder: '用逗號分隔，例：structuring, 數學, DP 狀態定義' },
    { name: 'application_id', label: '對應應徵', type: 'select', blank: true, full: true,
      options: state.apps.map((a) => ({ value: a.id, label: `${appTitle(a)} · ${a.role}` })) },
    { name: 'notes', label: '筆記（私人）', type: 'textarea' },
    { type: 'section', label: '分享' },
    { name: 'is_public', label: '在分享頁顯示這筆練習', type: 'check', full: true },
    { name: 'public_note', label: '公開說明', type: 'textarea' },
  ];
}

function openPrepForm(p, preset = {}) {
  openForm({
    title: p ? '編輯練習' : '新增練習',
    fields: prepFields(),
    values: p ? { ...p, weak_tags: (p.weak_tags || []).join(', ') } : { kind: 'Case', done_on: ymd(), ...preset },
    onSubmit: async (v) => {
      const tags = (v.weak_tags || '').split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
      await upsert('prep_logs', {
        ...v, weak_tags: tags,
        rating: v.rating ? Number(v.rating) : null,
        application_id: v.application_id || null,
      }, p?.id);
    },
    onDelete: p ? () => remove('prep_logs', p.id) : null,
  });
}

function openCompanyNotes(c) {
  openForm({
    title: `研究筆記 · ${c.name}`,
    fields: [
      { name: 'name', label: '公司名稱', required: true },
      { name: 'industry', label: '產業', type: 'list', options: INDUSTRIES },
      { name: 'website', label: '網站', type: 'url', full: true },
      { name: 'notes', label: '研究筆記（私人）', type: 'textarea', placeholder: '業務、近期新聞、為什麼想去、可以問面試官的問題' },
    ],
    values: c,
    onSubmit: (v) => upsert('companies', v, c.id),
  });
}

// ---------------------------------------------------------------- views
function setActiveTab(view) {
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === view));
}

function render(scrollTop = false) {
  const [view, id] = (location.hash.slice(1) || 'timeline').split('/');
  setActiveTab(view === 'app' ? 'board' : view);
  const fn = { timeline: renderTimeline, board: renderBoard, prep: renderPrep, stats: renderStats, app: () => renderDetail(id) }[view] || renderTimeline;
  fn();
  if (scrollTop) window.scrollTo({ top: 0 });
}

function eventRow({ time, title, sub, when, appId, cls = '' }) {
  return `<div class="event ${cls}" data-app="${esc(appId)}">
    <div class="time">${esc(time)}</div>
    <div><div class="title">${title}</div><div class="sub">${sub}</div></div>
    <div class="when">${esc(when)}</div></div>`;
}

function renderTimeline() {
  const today = ymd();
  const horizon = 30;
  const items = [];
  for (const s of state.stages) {
    const d = stageDay(s);
    if (!d || s.result === '取消') continue;
    const n = daysUntil(d);
    if (n < 0 || n > horizon) continue;
    const a = appById(s.application_id);
    if (!a) continue;
    items.push({ day: d, sort: s.scheduled_at, html: eventRow({
      time: fmtTime(s.scheduled_at), appId: a.id,
      title: `${esc(appTitle(a))} · ${esc(s.name)}`,
      sub: [esc(a.role), s.kind && `<span class="tag">${esc(s.kind)}</span>`, s.format && esc(s.format)].filter(Boolean).join(' · '),
      when: relDays(n),
    }) });
  }
  for (const a of state.apps) {
    if (!a.deadline || ENDED.includes(a.status)) continue;
    const n = daysUntil(a.deadline);
    if (n < 0 || n > horizon) continue;
    items.push({ day: a.deadline, sort: `${a.deadline}T23:59`, html: eventRow({
      time: '截止', cls: 'deadline', appId: a.id,
      title: `${esc(appTitle(a))} · ${esc(a.role)}`, sub: `目前狀態：${esc(a.status)}`, when: relDays(n),
    }) });
  }
  items.sort((x, y) => x.sort.localeCompare(y.sort));
  const byDay = new Map();
  for (const it of items) { if (!byDay.has(it.day)) byDay.set(it.day, []); byDay.get(it.day).push(it.html); }
  const upcoming = byDay.size
    ? [...byDay].map(([d, list]) => `<div class="day-group"><div class="day-label ${d === today ? 'today' : ''}">${fmtDay(d)} · ${relDays(daysUntil(d))}</div>${list.join('')}</div>`).join('')
    : '<div class="empty">未來 30 天沒有排定的面試或截止日。</div>';

  const unscheduled = state.stages
    .filter((s) => !s.scheduled_at && s.result === '待定' && !ENDED.includes(appById(s.application_id)?.status))
    .sort(stageSort);
  const nowMs = Date.now();
  const needReflection = state.stages.filter((s) => {
    if (!s.scheduled_at || s.reflection || s.result === '取消') return false;
    const t = Date.parse(s.scheduled_at);
    return t <= nowMs && t >= nowMs - 14 * 864e5;
  });
  const reviews = state.prep.filter((p) => p.review_on && daysUntil(p.review_on) <= 3)
    .sort((a, b) => a.review_on.localeCompare(b.review_on));

  const rowList = (list, fn, emptyText) => list.length ? list.map(fn).join('') : `<p class="muted small">${emptyText}</p>`;

  main.innerHTML = `
    <div class="page-head"><h1>接下來</h1><span class="muted small">今天 ${fmtDay(today)}</span></div>
    <div class="grid-2">
      <section class="card"><div class="section-title">未來 30 天</div>${upcoming}</section>
      <div class="stack">
        <section class="card"><div class="section-title">還沒寫心得</div>
          ${rowList(needReflection, (s) => { const a = appById(s.application_id); return `<div class="list-row" data-stage="${s.id}"><div><div class="title">${esc(appTitle(a))} · ${esc(s.name)}</div><div class="small muted">${fmtDay(stageDay(s))}</div></div><span class="btn sm">寫心得</span></div>`; }, '最近 14 天的面試都寫好心得了。')}
        </section>
        <section class="card"><div class="section-title">待排定的關卡</div>
          ${rowList(unscheduled, (s) => { const a = appById(s.application_id); return `<div class="list-row" data-app="${a.id}"><div><div class="title">${esc(appTitle(a))} · ${esc(s.name)}</div><div class="small muted">${esc(a.role)}${s.is_expected ? ' · 預期' : ''}</div></div><span class="badge r-pending">待排定</span></div>`; }, '沒有待排定的關卡。')}
        </section>
        <section class="card"><div class="section-title">複習到期</div>
          ${rowList(reviews, (p) => `<div class="list-row" data-prep="${p.id}"><div><div class="title">${esc(p.ref || p.topic || p.kind)}</div><div class="small muted">${esc(p.kind)}${p.topic ? ` · ${esc(p.topic)}` : ''}</div></div><span class="small ${daysUntil(p.review_on) < 0 ? 'r-fail' : 'muted'}">${relDays(daysUntil(p.review_on))}</span></div>`, '沒有到期的複習。')}
        </section>
      </div>
    </div>`;

  $$('[data-app]', main).forEach((el) => el.addEventListener('click', () => { location.hash = `#app/${el.dataset.app}`; }));
  $$('[data-stage]', main).forEach((el) => el.addEventListener('click', () => {
    const s = state.stages.find((x) => x.id === el.dataset.stage);
    openStageForm(appById(s.application_id), s);
  }));
  $$('[data-prep]', main).forEach((el) => el.addEventListener('click', () => openPrepForm(state.prep.find((p) => p.id === el.dataset.prep))));
}

function appCard(a) {
  const ns = nextStage(a.id);
  let next = '';
  if (ns) {
    const d = stageDay(ns);
    next = `<div class="next">下一關：<b>${esc(ns.name)}</b>${d ? ` · ${fmtDay(d, false)}（${relDays(daysUntil(d))}）` : ' · 待排定'}</div>`;
  } else if (a.deadline && !ENDED.includes(a.status) && daysUntil(a.deadline) >= 0) {
    next = `<div class="next">截止：<b>${fmtDay(a.deadline, false)}</b>（${relDays(daysUntil(a.deadline))}）</div>`;
  } else if (a.latest_update) {
    next = `<div class="next">${esc(a.latest_update)}</div>`;
  } else if (a.applied_on) {
    next = `<div class="next">${fmtDay(a.applied_on, false)} 投遞（${relDays(daysUntil(a.applied_on))}）</div>`;
  }
  const prio = a.priority === 1 ? '<span class="prio p1">● 高</span>' : a.priority === 3 ? '<span class="prio">低</span>' : '';
  const ended = ENDED.includes(a.status) ? ` <span class="badge ${statusClass(a.status)}">${esc(a.status)}</span>` : '';
  return `<div class="app-card" draggable="true" data-id="${a.id}">
    <div class="co"><span>${esc(appTitle(a))}</span>${prio}</div>
    <div class="role">${esc(a.role)}${ended}</div>${next}</div>`;
}

function renderBoard() {
  const cols = [...ACTIVE.map((s) => ({ key: s, label: s, list: state.apps.filter((a) => a.status === s) })),
    { key: '__ended', label: '已結束', list: state.apps.filter((a) => ENDED.includes(a.status)) }];
  const sortApps = (l) => l.sort((x, y) => {
    const nx = nextStage(x.id), ny = nextStage(y.id);
    return (x.priority - y.priority) || ((nx?.scheduled_at || '9') .localeCompare(ny?.scheduled_at || '9'));
  });
  main.innerHTML = `
    <div class="page-head"><h1>Pipeline</h1><span class="muted small">拖曳卡片改狀態 · 共 ${state.apps.length} 筆</span></div>
    ${state.apps.length ? '' : '<div class="empty" style="margin-bottom:16px">還沒有應徵紀錄。按右上角「＋ 應徵」新增第一筆。</div>'}
    <div class="board">${cols.map((c) => `
      <div class="col" data-status="${esc(c.key)}">
        <div class="col-head"><span>${esc(c.label)}</span><span class="count">${c.list.length}</span></div>
        ${sortApps(c.list).map(appCard).join('')}
      </div>`).join('')}</div>`;

  $$('.app-card', main).forEach((card) => {
    card.addEventListener('click', () => { location.hash = `#app/${card.dataset.id}`; });
    card.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', card.dataset.id); card.classList.add('dragging'); });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });
  $$('.col', main).forEach((col) => {
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drop'); });
    col.addEventListener('dragleave', () => col.classList.remove('drop'));
    col.addEventListener('drop', async (e) => {
      e.preventDefault(); col.classList.remove('drop');
      const id = e.dataTransfer.getData('text/plain');
      const a = appById(id);
      let status = col.dataset.status;
      if (!a) return;
      if (status === '__ended') {
        const pick = prompt(`結束狀態？輸入：${ENDED.join(' / ')}`, '未通過');
        if (!pick || !ENDED.includes(pick.trim())) return;
        status = pick.trim();
      }
      if (status === a.status) return;
      try { await upsert('applications', { status }, id); renderBoard(); toast(`已改為「${status}」`); } catch (err) { fail(err); }
    });
  });
}

function renderDetail(id) {
  const a = appById(id);
  if (!a) { main.innerHTML = '<div class="empty">找不到這筆應徵。<a href="#board">回看板</a></div>'; return; }
  const c = companyById(a.company_id);
  const stages = stagesOf(a.id);
  const preps = state.prep.filter((p) => p.application_id === a.id);
  const kv = (k, v) => (v ? `<dt>${esc(k)}</dt><dd>${v}</dd>` : '');

  const stepHtml = (s) => {
    const d = stageDay(s);
    const when = d ? `${fmtDay(d)} ${fmtTime(s.scheduled_at)}` : '待排定';
    return `<div class="step ${resultClass(s.result)}${s.is_expected ? ' expected' : ''}">
      <span class="dot"></span>
      <div class="step-head">
        <span class="name">${esc(s.name)}${s.is_expected ? ' <span class="tag">預期</span>' : ''}</span>
        <span><span class="badge ${resultClass(s.result)}">${esc(s.result)}</span> <button class="btn ghost sm" data-edit-stage="${s.id}">編輯</button></span>
      </div>
      <div class="step-meta"><span>${esc(when)}</span>${s.kind ? `<span class="tag">${esc(s.kind)}</span>` : ''}${s.format ? `<span>${esc(s.format)}</span>` : ''}${s.self_rating ? `<span>自評 ${s.self_rating}/5</span>` : ''}${s.is_public ? '' : '<span class="lock">不公開</span>'}</div>
      ${s.reflection ? `<div class="step-body"><div class="lbl">心得 · 私人</div><div class="prose">${esc(s.reflection)}</div></div>` : ''}
      ${s.improve ? `<div class="step-body"><div class="lbl">可改進處 · 私人</div><div class="prose">${esc(s.improve)}</div></div>` : ''}
      ${s.public_note ? `<div class="step-body"><div class="lbl">公開版心得</div><div class="prose">${esc(s.public_note)}</div></div>` : ''}
    </div>`;
  };

  main.innerHTML = `
    <div class="small" style="margin-bottom:10px"><a href="#board">← 看板</a></div>
    <div class="detail-head">
      <div>
        <h1>${esc(c?.name || '')}</h1>
        <div class="role">${esc(a.role)}</div>
      </div>
      <div class="actions">
        <select class="status-select" id="status-select">${STATUSES.map((s) => `<option ${s === a.status ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>
        <button class="btn" id="edit-app">編輯</button>
      </div>
    </div>
    <div class="grid-2">
      <section class="card">
        <div class="section-title">關卡 <button class="btn primary sm" id="add-stage">＋ 關卡</button></div>
        ${stages.length ? `<div class="stepper">${stages.map(stepHtml).join('')}</div>` : '<div class="empty">還沒有關卡。收到面試或筆試通知時新增；也可以先建「預期關卡」。</div>'}
      </section>
      <div class="stack">
        <section class="card">
          <div class="section-title">資訊</div>
          <dl class="kv">
            ${kv('最新消息', esc(a.latest_update))}
            ${kv('職缺網址', a.job_url && `<a href="${esc(a.job_url)}" target="_blank" rel="noopener">開啟職缺頁面</a>`)}
            ${kv('產業', esc(c?.industry))}
            ${kv('地點', esc(a.location))}
            ${kv('管道', esc(a.channel))}
            ${kv('履歷', a.resume_uploaded ? '已上傳' : '')}
            ${kv('優先度', esc(PRIORITIES.find((p) => p.value === a.priority)?.label))}
            ${kv('投遞日', a.applied_on && fmtDay(a.applied_on))}
            ${kv('截止日', a.deadline && `${fmtDay(a.deadline)}（${relDays(daysUntil(a.deadline))}）`)}
            ${kv('聯絡人', esc(a.contact))}
            ${kv('認識的人', esc(a.connections))}
            ${kv('帳號', esc(a.portal_account))}
            ${kv('薪資／條件', esc(a.salary_note))}
            ${kv('備註', esc(a.notes))}
            ${kv('分享', a.is_public ? `公開${a.share_anonymous ? '（匿名）' : ''}` : '<span class="lock">不公開</span>')}
            ${kv('公開說明', esc(a.public_note))}
          </dl>
        </section>
        <section class="card">
          <div class="section-title">研究筆記 <button class="btn ghost sm" id="edit-company">編輯</button></div>
          ${c?.website ? `<p class="small" style="margin-bottom:6px"><a href="${esc(c.website)}" target="_blank" rel="noopener">${esc(c.website)}</a></p>` : ''}
          ${c?.notes ? `<div class="prose">${esc(c.notes)}</div>` : '<p class="muted small">還沒有筆記。</p>'}
        </section>
        <section class="card">
          <div class="section-title">相關練習 <button class="btn ghost sm" id="add-prep">＋ 練習</button></div>
          ${preps.length ? preps.map((p) => `<div class="list-row" data-prep="${p.id}"><div><div class="title">${esc(p.ref || p.topic || p.kind)}</div><div class="small muted">${fmtDay(p.done_on, false)} · ${esc(p.kind)}${p.minutes ? ` · ${p.minutes} 分` : ''}</div></div>${p.rating ? `<span class="small muted">${p.rating}/5</span>` : ''}</div>`).join('') : '<p class="muted small">還沒有對應這筆應徵的練習。</p>'}
        </section>
      </div>
    </div>`;

  $('#status-select').addEventListener('change', async (e) => {
    try { await upsert('applications', { status: e.target.value }, a.id); toast(`已改為「${e.target.value}」`); } catch (err) { fail(err); }
  });
  $('#edit-app').addEventListener('click', () => openAppForm(a));
  $('#add-stage').addEventListener('click', () => openStageForm(a));
  $('#edit-company').addEventListener('click', () => openCompanyNotes(c));
  $('#add-prep').addEventListener('click', () => openPrepForm(null, { application_id: a.id }));
  $$('[data-edit-stage]', main).forEach((b) => b.addEventListener('click', () => openStageForm(a, state.stages.find((s) => s.id === b.dataset.editStage))));
  $$('[data-prep]', main).forEach((el) => el.addEventListener('click', () => openPrepForm(state.prep.find((p) => p.id === el.dataset.prep))));
}

function weekStart(dayStr) {
  const [y, m, d] = dayStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = (dt.getUTCDay() + 6) % 7; // Monday = 0
  dt.setUTCDate(dt.getUTCDate() - dow);
  return dt.toISOString().slice(0, 10);
}

function renderPrep() {
  const f = state.prepFilter;
  const list = state.prep.filter((p) => f === 'all' || p.kind === f);
  const thisWeek = weekStart(ymd());
  const weekMin = state.prep.filter((p) => weekStart(p.done_on) === thisWeek).reduce((s, p) => s + (p.minutes || 0), 0);
  const countKind = (k) => state.prep.filter((p) => p.kind === k).length;
  const lcDue = state.prep.filter((p) => p.review_on && daysUntil(p.review_on) <= 0).length;

  main.innerHTML = `
    <div class="page-head"><h1>準備紀錄</h1><button class="btn primary" id="add-prep">＋ 練習</button></div>
    <div class="stats-row">
      <div class="stat"><div class="v">${(weekMin / 60).toFixed(1)}</div><div class="k">本週小時</div></div>
      <div class="stat"><div class="v">${countKind('Case')}</div><div class="k">Case 場次</div></div>
      <div class="stat"><div class="v">${countKind('LeetCode')}</div><div class="k">LeetCode 題數</div></div>
      <div class="stat"><div class="v">${countKind('Behavioral') + countKind('產業研究')}</div><div class="k">Behavioral／產業研究</div></div>
      <div class="stat"><div class="v">${lcDue}</div><div class="k">今天該複習</div></div>
    </div>
    <div class="card">
      <div class="section-title"><div class="chips">${['all', ...PREP_KINDS].map((k) => `<button class="chip ${f === k ? 'active' : ''}" data-filter="${esc(k)}">${k === 'all' ? '全部' : esc(k)}</button>`).join('')}</div></div>
      ${list.length ? `<div class="table-wrap"><table class="data">
        <thead><tr><th>日期</th><th>類型</th><th>主題</th><th>題目／夥伴</th><th>難度</th><th class="num">分鐘</th><th class="num">自評</th><th>弱點</th><th>複習</th></tr></thead>
        <tbody>${list.map((p) => `<tr class="click" data-prep="${p.id}">
          <td>${fmtDay(p.done_on, false)}</td><td>${esc(p.kind)}</td><td>${esc(p.topic)}</td><td>${esc(p.ref)}${p.is_public ? '' : ' <span class="lock">·</span>'}</td>
          <td>${esc(p.difficulty)}</td><td class="num">${p.minutes ?? ''}</td><td class="num">${p.rating ?? ''}</td>
          <td>${(p.weak_tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join(' ')}</td>
          <td class="${p.review_on && daysUntil(p.review_on) <= 0 ? 'r-fail' : ''}">${p.review_on ? fmtDay(p.review_on, false) : ''}</td></tr>`).join('')}</tbody>
      </table></div>` : '<div class="empty">還沒有紀錄。每次練完花 30 秒記一筆，統計頁就會開始有東西。</div>'}
    </div>`;

  $('#add-prep').addEventListener('click', () => openPrepForm(null, f !== 'all' ? { kind: f } : {}));
  $$('[data-filter]', main).forEach((b) => b.addEventListener('click', () => { state.prepFilter = b.dataset.filter; renderPrep(); }));
  $$('[data-prep]', main).forEach((el) => el.addEventListener('click', () => openPrepForm(state.prep.find((p) => p.id === el.dataset.prep))));
}

function barRows(rows, fmt = (v) => v) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return `<div class="bars">${rows.map((r) => `<div class="bar-row"><span>${esc(r.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${(r.value / max) * 100}%"></div></div><span class="num">${esc(fmt(r.value, r))}</span></div>`).join('')}</div>`;
}

function renderStats() {
  const byStatus = STATUSES.map((s) => ({ label: s, value: state.apps.filter((a) => a.status === s).length })).filter((r) => r.value);

  const kinds = [...new Set(state.stages.map((s) => s.kind || '未分類'))];
  const passRows = kinds.map((k) => {
    const done = state.stages.filter((s) => (s.kind || '未分類') === k && (s.result === '通過' || s.result === '未通過'));
    const pass = done.filter((s) => s.result === '通過').length;
    return { label: k, value: done.length ? pass / done.length : 0, pass, n: done.length };
  }).filter((r) => r.n);

  const weeks = [];
  const start = weekStart(ymd());
  for (let i = 7; i >= 0; i--) {
    const [y, m, d] = start.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d - 7 * i));
    weeks.push(dt.toISOString().slice(0, 10));
  }
  const weekly = weeks.map((w) => ({ w, min: state.prep.filter((p) => weekStart(p.done_on) === w).reduce((s, p) => s + (p.minutes || 0), 0) }));
  const maxMin = Math.max(60, ...weekly.map((x) => x.min));

  const tagCount = new Map();
  for (const p of state.prep) for (const t of p.weak_tags || []) tagCount.set(t, (tagCount.get(t) || 0) + 1);
  const tags = [...tagCount].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([label, value]) => ({ label, value }));

  const caseRows = CASE_TYPES.map((t) => ({ label: t, value: state.prep.filter((p) => p.kind === 'Case' && p.topic === t).length })).filter((r) => r.value);
  const lcRows = DIFFICULTIES.map((d) => ({ label: d, value: state.prep.filter((p) => p.kind === 'LeetCode' && p.difficulty === d).length })).filter((r) => r.value);

  const active = state.apps.filter((a) => !ENDED.includes(a.status)).length;
  const interviews = state.stages.filter((s) => s.scheduled_at && s.result !== '取消' && daysUntil(stageDay(s)) <= 0).length;
  const offers = state.apps.filter((a) => a.status === 'Offer' || a.status === '接受').length;

  const empty = '<p class="muted small">資料累積後會出現在這裡。</p>';
  main.innerHTML = `
    <div class="page-head"><h1>統計</h1></div>
    <div class="stats-row">
      <div class="stat"><div class="v">${state.apps.length}</div><div class="k">應徵總數</div></div>
      <div class="stat"><div class="v">${active}</div><div class="k">進行中</div></div>
      <div class="stat"><div class="v">${interviews}</div><div class="k">已完成的關卡</div></div>
      <div class="stat"><div class="v">${offers}</div><div class="k">Offer</div></div>
    </div>
    <div class="grid-2">
      <div class="stack">
        <section class="card"><div class="section-title">各類關卡通過率</div>
          ${passRows.length ? barRows(passRows, (v, r) => `${r.pass}/${r.n}`) : empty}
          <p class="small muted" style="margin-top:10px">通過 ÷（通過＋未通過），待定與取消不計。</p>
        </section>
        <section class="card"><div class="section-title">每週準備時數（近 8 週）</div>
          <div class="vbars">${weekly.map((x) => `<div class="vbar"><span class="val">${x.min ? (x.min / 60).toFixed(1) : ''}</span><div class="fill" style="height:${(x.min / maxMin) * 120}px"></div><span class="lab">${fmtDay(x.w, false)}</span></div>`).join('')}</div>
        </section>
      </div>
      <div class="stack">
        <section class="card"><div class="section-title">應徵狀態</div>${byStatus.length ? barRows(byStatus) : empty}</section>
        <section class="card"><div class="section-title">弱點標籤</div>${tags.length ? barRows(tags) : empty}</section>
        <section class="card"><div class="section-title">Case 類型分布</div>${caseRows.length ? barRows(caseRows) : empty}</section>
        <section class="card"><div class="section-title">LeetCode 難度分布</div>${lcRows.length ? barRows(lcRows) : empty}</section>
      </div>
    </div>`;
}

// ---------------------------------------------------------------- auth & boot
function renderSetup() {
  main.innerHTML = `<div class="card center-card">
    <h1>還差一步：連上 Supabase</h1>
    <p class="muted">資料存在你自己的 Supabase 專案，網站本身不保存任何資料。</p>
    <ol>
      <li>到 supabase.com 建立免費專案。</li>
      <li>SQL Editor 貼上這個資料夾的 <code>schema.sql</code> 執行。</li>
      <li>Project Settings → API，把 Project URL 與 anon public key 填進 <code>config.js</code>。</li>
      <li>Authentication → URL Configuration，把這個頁面的網址加進 Redirect URLs。</li>
    </ol>
    <p class="small muted" style="margin-top:14px">詳細步驟見 <a href="SETUP.md">SETUP.md</a>。</p>
  </div>`;
}

function renderLogin() {
  $('#topbar').classList.add('hidden');
  main.innerHTML = `<form class="card center-card" id="login">
    <h1>面試追蹤</h1>
    <p class="muted">輸入 email，會寄一封登入連結給你。</p>
    <div class="field"><label for="email">Email</label><input type="email" id="email" required autocomplete="email"></div>
    <button class="btn primary" type="submit">寄登入連結</button>
    <p class="small muted" style="margin-top:14px">只是想看分享內容？<a href="share.html">前往分享頁</a></p>
  </form>`;
  $('#login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#email').value.trim();
    const redirect = location.origin + location.pathname;
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: true } });
    if (error) return fail(error);
    main.innerHTML = `<div class="card center-card"><h1>請查看信箱</h1><p>登入連結已寄到 <b>${esc(email)}</b>，點信裡的連結就會回到這裡。</p></div>`;
  });
}

async function boot() {
  if (!state.user) return renderLogin();
  $('#topbar').classList.remove('hidden');
  main.innerHTML = '<p class="muted">載入資料中…</p>';
  try { await loadAll(); } catch (e) {
    main.innerHTML = `<div class="card center-card"><h1>讀不到資料</h1><p class="muted">${esc(e.message)}</p><p class="small">確認已在 Supabase 執行 <code>schema.sql</code>。</p></div>`;
    return;
  }
  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), companies: state.companies, applications: state.apps, stages: state.stages, prep_logs: state.prep }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: `interview-tracker-${ymd()}.json` });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function init() {
  initTheme('#btn-theme');
  if (!configured) { renderSetup(); return; }

  $$('.tab').forEach((t) => t.addEventListener('click', () => { location.hash = `#${t.dataset.view}`; }));
  $('#btn-new-app').addEventListener('click', () => openAppForm(null));
  $('#btn-new-prep').addEventListener('click', () => openPrepForm(null));
  $('#btn-export').addEventListener('click', exportJson);
  $('#btn-logout').addEventListener('click', async () => { await sb.auth.signOut(); });
  window.addEventListener('hashchange', () => { if (state.user) render(true); });

  let lastUid;
  sb.auth.onAuthStateChange((_event, session) => {
    const uid = session?.user?.id ?? null;
    if (uid === lastUid) return;
    lastUid = uid;
    state.user = session?.user ?? null;
    // defer: supabase-js advises not awaiting other calls inside this callback
    setTimeout(boot, 0);
  });
}

init();
