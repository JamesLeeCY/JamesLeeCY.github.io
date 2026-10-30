// Calendar view (month / week), Google-Calendar style. Times are Asia/Taipei.
import { esc, ymd, fmtDay } from './common.js';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const HOUR_START = 8, HOUR_END = 22, HOUR_PX = 48;

// ---- date-string helpers (YYYY-MM-DD, calendar days, no time zone drift) ----
const toUTC = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
const fromUTC = (dt) => dt.toISOString().slice(0, 10);
export const addDays = (s, n) => { const dt = toUTC(s); dt.setUTCDate(dt.getUTCDate() + n); return fromUTC(dt); };
const addMonths = (s, n) => { const dt = toUTC(s); dt.setUTCDate(1); dt.setUTCMonth(dt.getUTCMonth() + n); return fromUTC(dt); };
const mondayOf = (s) => { const dow = (toUTC(s).getUTCDay() + 6) % 7; return addDays(s, -dow); };
const monthOf = (s) => s.slice(0, 7);

function taipeiParts(iso) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, h: Number(p.hour) % 24, m: Number(p.minute) };
}
const hhmm = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

// ---- events ----
// stage with a time of exactly 00:00 means "date known, time unknown" → all-day
export function buildEvents(state, appTitle) {
  const evs = [];
  for (const s of state.stages) {
    if (!s.scheduled_at || s.result === '取消') continue;
    const a = state.apps.find((x) => x.id === s.application_id);
    if (!a) continue;
    const t = taipeiParts(s.scheduled_at);
    const allDay = t.h === 0 && t.m === 0;
    evs.push({
      day: t.day, allDay, h: t.h, m: t.m, mins: 60, appId: a.id, iso: s.scheduled_at,
      title: `${appTitle(a)} · ${s.name}`, sub: [s.kind, s.format].filter(Boolean).join(' · '),
      cls: s.result === '未通過' ? 'ev-fail' : s.result === '通過' ? 'ev-pass' : 'ev-interview',
    });
  }
  for (const a of state.apps) {
    if (!a.deadline || ['接受', '婉拒', '未通過', '撤回'].includes(a.status)) continue;
    evs.push({ day: a.deadline, allDay: true, appId: a.id, title: `截止 · ${appTitle(a)}`, sub: a.role, cls: 'ev-deadline' });
  }
  evs.sort((x, y) => (x.day + (x.allDay ? '0' : '1') + hhmm(x.h || 0, x.m || 0)).localeCompare(y.day + (y.allDay ? '0' : '1') + hhmm(y.h || 0, y.m || 0)));
  return evs;
}

// ---- view state (remembered per browser) ----
const cal = { mode: 'month', anchor: null, sel: null };
try { const m = localStorage.getItem('calMode'); if (m === 'week' || m === 'month') cal.mode = m; } catch (e) { /* ignore */ }

function chip(e, compact = false) {
  const time = e.allDay ? '' : `<b>${hhmm(e.h, e.m)}</b> `;
  return `<button class="ev ${e.cls}" data-app="${esc(e.appId)}" title="${esc(e.title)}${e.sub ? `\n${esc(e.sub)}` : ''}">${compact ? '' : time}${esc(e.title)}</button>`;
}

function monthHtml(evs, today) {
  const first = `${monthOf(cal.anchor)}-01`;
  const start = mondayOf(first);
  const byDay = new Map();
  for (const e of evs) { if (!byDay.has(e.day)) byDay.set(e.day, []); byDay.get(e.day).push(e); }
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i);
    const list = byDay.get(d) || [];
    const out = monthOf(d) !== monthOf(cal.anchor);
    const shown = list.slice(0, 3);
    cells += `<div class="mc${out ? ' out' : ''}${d === today ? ' today' : ''}" data-day="${d}">
      <div class="mc-num">${Number(d.slice(8))}</div>
      ${shown.map((e) => chip(e)).join('')}
      ${list.length > 3 ? `<button class="ev-more" data-day="${d}">還有 ${list.length - 3} 項</button>` : ''}
      ${list.length ? `<div class="mc-dots">${list.map((e) => `<span class="dot ${e.cls}"></span>`).join('')}</div>` : ''}
    </div>`;
  }
  const selList = cal.sel ? (byDay.get(cal.sel) || []) : null;
  const dayList = selList ? `<div class="day-list"><h3>${fmtDay(cal.sel)}</h3>${selList.length ? selList.map((e) => chip(e)).join('') : '<p class="small muted">這天沒有行程。</p>'}</div>` : '';
  return `<div class="cal-month">
    ${WEEKDAYS.map((w) => `<div class="mc-head">${w}</div>`).join('')}
    ${cells}
  </div>${dayList}`;
}

function weekHtml(evs, today) {
  const start = mondayOf(cal.anchor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);
  const now = taipeiParts(new Date().toISOString());
  const col = (d) => {
    const timed = evs.filter((e) => e.day === d && !e.allDay);
    const blocks = timed.map((e) => {
      const startMin = Math.min(Math.max((e.h - HOUR_START) * 60 + e.m, 0), (HOUR_END - HOUR_START) * 60 - 30);
      const top = (startMin / 60) * HOUR_PX;
      const height = Math.max((e.mins / 60) * HOUR_PX - 2, 22);
      return `<button class="wk-ev ${e.cls}" data-app="${esc(e.appId)}" style="top:${top}px;height:${height}px" title="${esc(e.title)}">
        <span class="wk-time">${hhmm(e.h, e.m)}</span><span class="wk-title">${esc(e.title)}</span>${e.sub ? `<span class="wk-sub">${esc(e.sub)}</span>` : ''}</button>`;
    }).join('');
    const nowLine = d === today && now.h >= HOUR_START && now.h < HOUR_END
      ? `<div class="wk-now" style="top:${((now.h - HOUR_START) * 60 + now.m) / 60 * HOUR_PX}px"></div>` : '';
    return `<div class="wk-col${d === today ? ' today' : ''}">${hours.map(() => '<div class="wk-slot"></div>').join('')}${blocks}${nowLine}</div>`;
  };
  return `<div class="cal-week-wrap"><div class="cal-week">
    <div class="wk-corner"></div>
    ${days.map((d) => `<div class="wk-head${d === today ? ' today' : ''}"><span>${WEEKDAYS[(toUTC(d).getUTCDay() + 6) % 7]}</span><b>${Number(d.slice(8))}</b></div>`).join('')}
    <div class="wk-allday-label">全天</div>
    ${days.map((d) => `<div class="wk-allday">${evs.filter((e) => e.day === d && e.allDay).map((e) => chip(e)).join('')}</div>`).join('')}
    <div class="wk-hours">${hours.map((h) => `<div class="wk-hour">${hhmm(h, 0)}</div>`).join('')}</div>
    ${days.map(col).join('')}
  </div></div>`;
}

function titleText() {
  if (cal.mode === 'month') { const [y, m] = cal.anchor.split('-'); return `${y} 年 ${Number(m)} 月`; }
  const s = mondayOf(cal.anchor), e = addDays(s, 6);
  return `${s.slice(0, 4)} 年 ${fmtDay(s, false)} – ${fmtDay(e, false)}`;
}

export function renderCalendar(main, state, appTitle) {
  const today = ymd();
  if (!cal.anchor) cal.anchor = today;
  const evs = buildEvents(state, appTitle);
  const draw = () => {
    main.innerHTML = `
      <div class="page-head cal-head">
        <div class="cal-nav">
          <button class="btn sm" data-nav="today">今天</button>
          <button class="btn ghost sm" data-nav="-1" aria-label="上一頁">‹</button>
          <button class="btn ghost sm" data-nav="1" aria-label="下一頁">›</button>
          <h1>${titleText()}</h1>
        </div>
        <div class="actions">
          <div class="seg"><button class="${cal.mode === 'month' ? 'on' : ''}" data-mode="month">月</button><button class="${cal.mode === 'week' ? 'on' : ''}" data-mode="week">週</button></div>
          <button class="btn ghost sm" id="btn-ics" title="下載後可匯入 Google 日曆">加到 Google 日曆</button>
        </div>
      </div>
      <div class="cal-legend small muted"><span><span class="dot ev-interview"></span>面試／測驗</span><span><span class="dot ev-deadline"></span>截止</span><span><span class="dot ev-pass"></span>已通過</span><span><span class="dot ev-fail"></span>未通過</span><span>沒有時間的關卡顯示在「全天」</span></div>
      <div class="card cal-card">${cal.mode === 'month' ? monthHtml(evs, today) : weekHtml(evs, today)}</div>`;

    main.querySelectorAll('[data-nav]').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.nav;
      cal.sel = null;
      if (v === 'today') cal.anchor = today;
      else cal.anchor = cal.mode === 'month' ? addMonths(cal.anchor, Number(v)) : addDays(cal.anchor, 7 * Number(v));
      draw();
    }));
    main.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => {
      cal.mode = b.dataset.mode;
      try { localStorage.setItem('calMode', cal.mode); } catch (e) { /* ignore */ }
      draw();
    }));
    main.querySelectorAll('[data-app]').forEach((el) => el.addEventListener('click', (ev) => {
      ev.stopPropagation(); location.hash = `#app/${el.dataset.app}`;
    }));
    // month: clicking a day (or "還有 N 項") opens that week
    // on phones it lists that day under the grid instead
    main.querySelectorAll('.mc[data-day], .ev-more').forEach((el) => el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      if (window.innerWidth < 720) { cal.sel = el.dataset.day; draw(); return; }
      cal.anchor = el.dataset.day; cal.mode = 'week'; draw();
    }));
    main.querySelector('#btn-ics').addEventListener('click', () => downloadIcs(evs));
    if (cal.mode === 'week') {
      const wrap = main.querySelector('.cal-week-wrap');
      const wkStart = mondayOf(cal.anchor), wkEnd = addDays(wkStart, 6);
      const hs = evs.filter((e) => !e.allDay && e.day >= wkStart && e.day <= wkEnd).map((e) => e.h);
      if (wrap) wrap.scrollTop = hs.length ? Math.max(0, (Math.min(...hs) - HOUR_START - 1) * HOUR_PX) : 0;
    }
  };
  draw();
}

// ---- .ics export (import into Google Calendar) ----
function icsEscape(s) { return String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
const icsStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function downloadIcs(evs) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//jamesleecy//interview-tracker//ZH', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:面試追蹤', 'X-WR-TIMEZONE:Asia/Taipei'];
  const stamp = icsStamp(new Date());
  const today = ymd();
  for (const e of evs) {
    if (e.day < addDays(today, -30)) continue;
    const uid = `${e.appId}-${e.day}-${e.allDay ? 'd' : hhmm(e.h, e.m).replace(':', '')}@interview-tracker`;
    lines.push('BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${stamp}`);
    if (e.allDay) {
      lines.push(`DTSTART;VALUE=DATE:${e.day.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${addDays(e.day, 1).replace(/-/g, '')}`);
    } else {
      const start = new Date(e.iso);
      lines.push(`DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(new Date(start.getTime() + e.mins * 60000))}`);
    }
    lines.push(`SUMMARY:${icsEscape(e.title)}`);
    if (e.sub) lines.push(`DESCRIPTION:${icsEscape(e.sub)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: `interviews-${today}.ics` }).click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
