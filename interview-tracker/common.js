import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const configured =
  typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('https://') &&
  typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.startsWith('YOUR_');

export const sb = configured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: true } })
  : null;

export const ACTIVE = ['想投', '已投', '筆試/OA', '面試中', 'Offer'];
export const ENDED = ['接受', '婉拒', '未通過', '撤回'];
export const STATUSES = [...ACTIVE, ...ENDED];
export const STATUS_ORDER = Object.fromEntries(STATUSES.map((s, i) => [s, i]));

export const CHANNELS = ['官網', '內推', '獵頭', '校園徵才', 'LinkedIn', '104／1111', '其他'];
export const PRIORITIES = [{ value: 1, label: '高' }, { value: 2, label: '中' }, { value: 3, label: '低' }];
export const STAGE_KINDS = ['筆試/OA', 'Behavioral', 'Case', 'Coding', 'Technical', 'HR', '其他'];
export const STAGE_NAMES = ['履歷審查', '筆試/OA', '一面', '二面', '三面', 'Case 面試', 'Partner 面', '主管面', 'HR 面', 'Offer 談判'];
export const FORMATS = ['線上', '現場', '電話'];
export const RESULTS = ['待定', '通過', '未通過', '取消'];
export const PREP_KINDS = ['Case', 'LeetCode', 'Behavioral', '產業研究'];
export const CASE_TYPES = ['Market sizing', 'Profitability', 'Market entry', 'M&A', 'Pricing', 'Growth', 'Operations', 'Brainteaser'];
export const LC_TOPICS = ['Array', 'Hash Table', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Tree', 'Graph', 'Heap', 'Backtracking', 'DP', 'Greedy', 'SQL'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const INDUSTRIES = ['管理顧問', '半導體', '科技／AI', '金融', '電商', '生醫', '其他'];

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// 'YYYY-MM-DD' in Taipei for a Date
export function ymd(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}

export function parseDay(s) {
  // date-only strings are calendar days; anchor them at Taipei midnight
  return new Date(`${s}T00:00:00+08:00`);
}

export function daysUntil(dayStr) {
  const a = parseDay(ymd()), b = parseDay(dayStr);
  return Math.round((b - a) / 864e5);
}

export function relDays(n) {
  if (n === 0) return '今天';
  if (n === 1) return '明天';
  if (n === -1) return '昨天';
  return n > 0 ? `${n} 天後` : `${-n} 天前`;
}

const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
export function fmtDay(dayStr, withWeek = true) {
  if (!dayStr) return '';
  const [y, m, dd] = dayStr.split('-').map(Number);
  const wk = WEEK[new Date(Date.UTC(y, m - 1, dd)).getUTCDay()];
  return `${m}/${dd}${withWeek ? `（${wk}）` : ''}`;
}

export function fmtTime(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
}

// ISO → value for <input type=datetime-local> in Taipei time
export function isoToLocalInput(iso) {
  if (!iso) return '';
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  const hh = p.hour === '24' ? '00' : p.hour;
  return `${p.year}-${p.month}-${p.day}T${hh}:${p.minute}`;
}

export function localInputToIso(v) {
  if (!v) return null;
  return new Date(`${v}:00+08:00`).toISOString();
}

export function initTheme(buttonSelector) {
  let t = null;
  try { t = localStorage.getItem('theme'); } catch (e) { /* ignore */ }
  if (t !== 'dark' && t !== 'light') t = 'dark';
  document.documentElement.setAttribute('data-theme', t);
  const btn = document.querySelector(buttonSelector);
  if (!btn) return;
  const label = () => { btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '淺色' : '深色'; };
  label();
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
    label();
  });
}

export function statusClass(s) {
  return { '想投': 's-idea', '已投': 's-applied', '筆試/OA': 's-oa', '面試中': 's-interview', 'Offer': 's-offer',
    '接受': 's-accepted', '婉拒': 's-ended', '未通過': 's-rejected', '撤回': 's-ended' }[s] || '';
}

export function resultClass(r) {
  return { '待定': 'r-pending', '通過': 'r-pass', '未通過': 'r-fail', '取消': 'r-cancel' }[r] || '';
}
