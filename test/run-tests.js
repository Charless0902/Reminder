#!/usr/bin/env node
/*
 * Checks the generated reminders.
 *
 *   node test/run-tests.js                   # next 12 weeks from today (Europe/Brussels)
 *   node test/run-tests.js --from=2026-11-02 # next 12 weeks from another date
 *
 * Fails (exit code 1) when a message
 *   - contains a singular Dutch pronoun as a whole word (je, jij, jouw, jou),
 *   - misses the deadline (woensdag + 20:00),
 *   - misses the closing ask to react with an emoji,
 *   - is identical to another week's message,
 * plus a few extra style checks (day + Peoula + reminder named, 3-4 blocks,
 * "lievelingsemoji" as one word, no leftover {PLACEHOLDERS}, intact ❤️‍🔥 emoji,
 * WhatsApp link round trip, no opener/motivation reuse within 4 weeks).
 */
'use strict';

const G = require('../messages.js');
const C = G.CONFIG;

const WEEKS = 12;
const LONG_RUN_WEEKS = 156; // extra sweep over 3 years for the rare combinations
const DAY_PATTERNS = {
  1: /maanda+g+|monda+y+/i,
  2: /dinsda+g+|tuesda+y+/i,
  3: /woensda+g+|wednesda+y+/i,
};
const HEART_FIRE = '❤️‍🔥'; // ❤️‍🔥

const failures = [];
let checked = 0;

function fail(where, why, text) {
  failures.push({ where, why, text });
}

// ---------- rules ----------

const SINGULAR = /(^|[^\p{L}])(je|jij|jouw|jou)(?=$|[^\p{L}])/iu;
const WRONG_PLURAL_VERB = /(^|[^\p{L}])jullie (hebt|bent|kan|kunt|wil|wilt|zal|zult|moet|gaat|doet|weet|staat|komt|ziet|maakt)(?=$|[^\p{L}])/iu;

function textProblems(text) {
  const problems = [];
  const stretchedAway = text.replace(/(\p{L})\1+/gu, '$1'); // "jijjj" -> "jij"
  const m = text.match(SINGULAR) || stretchedAway.match(SINGULAR);
  if (m) problems.push(`singular pronoun "${m[2]}"`);
  const v = text.match(WRONG_PLURAL_VERB);
  if (v) problems.push(`"jullie ${v[2]}" (needs a plural verb)`);
  if (/\{[A-Za-z]+\}/.test(text)) problems.push('leftover placeholder');
  if (/lievelings[\s-]+emoji/i.test(text)) problems.push('"lievelingsemoji" must be one word');
  const hearts = text.match(/❤️?‍?🔥/g) || [];
  if (hearts.some((h) => h !== HEART_FIRE)) problems.push('broken ❤️‍🔥 emoji (missing variation selector or ZWJ)');
  return problems;
}

function hasDeadline(text) {
  const day = new RegExp(C.deadlineDay, 'i');
  if (!text.includes(C.deadlineTime) || !day.test(text)) return false;
  const sameSentence = new RegExp(`${C.deadlineDay}|vandaag|vanavond`, 'i');
  return text.split('\n').some((line) => line.includes(C.deadlineTime) && sameSentence.test(line));
}

function messageProblems(text, dayNr) {
  const problems = textProblems(text);
  const blocks = text.split(/\n\s*\n/);
  const closer = blocks[blocks.length - 1];
  if (!hasDeadline(text)) problems.push(`misses the deadline (${C.deadlineDay} ${C.deadlineTime})`);
  if (!/emoji/i.test(closer) || !/reage|reacti|drop|laat|eronder/i.test(closer)) {
    problems.push('misses the emoji closer in the last block');
  }
  if (!DAY_PATTERNS[dayNr].test(text)) problems.push('does not say which day it is');
  if (!text.includes(C.peoula) || !/reminder/i.test(text)) problems.push(`does not say it's a reminder for the ${C.peoula}`);
  if (blocks.length < 3 || blocks.length > 4) problems.push(`${blocks.length} blocks (want 3-4)`);
  if (text.length > 600) problems.push(`too long for WhatsApp (${text.length} chars)`);
  if (dayNr === 3 && !/LAATSTE/.test(text)) problems.push('Wednesday message must say LAATSTE');

  const url = G.whatsappUrl(text);
  const encoded = url.slice('whatsapp://send?text='.length);
  if (/[\s\n]/.test(encoded)) problems.push('WhatsApp link contains raw whitespace');
  if (decodeURIComponent(encoded) !== text) problems.push('WhatsApp link does not decode back to the same text');
  if (text.includes('\n') && !encoded.includes('%0A')) problems.push('line breaks not encoded as %0A');
  if (text.includes(HEART_FIRE) && !encoded.includes('%E2%9D%A4%EF%B8%8F%E2%80%8D%F0%9F%94%A5')) {
    problems.push('❤️‍🔥 not encoded with its ZWJ');
  }
  return problems;
}

// ---------- helpers ----------

function startWeek() {
  const arg = process.argv.find((a) => a.startsWith('--from='));
  if (!arg) return G.reminderWeek(G.today());
  const [y, m, d] = arg.slice(7).split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d);
  return G.reminderWeek({ utc, weekday: new Date(utc).getUTCDay() || 7 });
}

function weeksFrom(start, count) {
  const out = [];
  let utc = G.dateOf(start.isoYear, start.isoWeek, 1);
  for (let i = 0; i < count; i++, utc += 7 * 86400000) out.push(G.isoWeekOf(utc));
  return out;
}

const label = (w, day) =>
  `${G.DAYS[day]} ${new Date(G.dateOf(w.isoYear, w.isoWeek, day)).toISOString().slice(0, 10)} (${w.isoYear}-W${w.isoWeek})`;

// ---------- 1. every building block on its own ----------

for (const [dayName, texts] of Object.entries(G.TEXTS)) {
  for (const [pool, lines] of Object.entries(texts)) {
    if (pool === 'handwritten') continue;
    const min = 15;
    if (lines.length < min) fail(`${dayName}.${pool}`, `only ${lines.length} options (want ${min}+)`, '');
    if (new Set(lines).size !== lines.length) fail(`${dayName}.${pool}`, 'duplicate lines', '');
    for (const line of lines) {
      for (const p of textProblems(G.fill(line))) fail(`${dayName}.${pool}`, p, line);
    }
  }
  for (const p of ['dayLines', 'closers']) {
    // not checked via full messages only, so a rarely picked line can't slip through
    const dayNr = Number(Object.keys(G.DAYS).find((k) => G.DAYS[k] === dayName));
    for (const line of texts[p]) {
      const t = G.fill(line);
      if (p === 'dayLines' && (!DAY_PATTERNS[dayNr].test(t) || !t.includes(C.peoula) || !/reminder/i.test(t))) {
        fail(`${dayName}.dayLines`, 'must name the day and say it is a reminder for the Peoula', line);
      }
      if (p === 'closers' && (!/emoji/i.test(t) || !/reage|reacti|drop|laat|eronder/i.test(t))) {
        fail(`${dayName}.closers`, 'must ask to react with an emoji', line);
      }
    }
  }
  for (const line of texts.deadlines) {
    const t = G.fill(line);
    const ok = t.includes(C.deadlineTime) && (dayName === 'woensdag' ? /vandaag|vanavond/i.test(t) : new RegExp(C.deadlineDay, 'i').test(t));
    if (!ok) fail(`${dayName}.deadlines`, 'must contain the deadline', line);
  }
  const dayNr = Number(Object.keys(G.DAYS).find((k) => G.DAYS[k] === dayName));
  texts.handwritten.forEach((blocks, i) => {
    for (const p of messageProblems(blocks.map(G.fill).join('\n\n'), dayNr)) fail(`${dayName}.handwritten[${i}]`, p, blocks.join('\n\n'));
  });
}

// ---------- 2. the next 12 weeks (+ a 3 year sweep) ----------

function sweep(weeks, { strict }) {
  const seenByDay = { 1: new Map(), 2: new Map(), 3: new Map() };
  const allTexts = new Map();
  for (const day of [1, 2, 3]) {
    const history = [];
    for (const w of weeks) {
      const msg = G.generate({ ...w, day });
      const where = label(w, day);
      checked++;
      for (const p of messageProblems(msg.text, day)) fail(where, p, msg.text);

      if (G.generate({ ...w, day }).text !== msg.text) fail(where, 'not deterministic (same day gave another text)', msg.text);
      const reroll = G.generate({ ...w, day, variant: 1 });
      if (reroll.text === msg.text) fail(where, '"Andere versie" gave the same text', msg.text);
      for (const p of messageProblems(reroll.text, day)) fail(where + ' [reroll]', p, reroll.text);

      const seen = seenByDay[day];
      if (strict && seen.has(msg.text)) fail(where, `identical to ${seen.get(msg.text)}`, msg.text);
      seen.set(msg.text, where);
      if (strict && allTexts.has(msg.text) && allTexts.get(msg.text) !== where) {
        fail(where, `identical to ${allTexts.get(msg.text)}`, msg.text);
      }
      allTexts.set(msg.text, where);

      for (const slot of ['opener', 'motivation']) {
        const prev = history.slice(-C.noRepeatWeeks).find((h) => h.keys[slot] === msg.keys[slot]);
        if (prev) fail(where, `${slot} reused from ${prev.where} (within ${C.noRepeatWeeks} weeks)`, msg.text);
      }
      history.push({ keys: msg.keys, where });
    }
  }
}

const start = startWeek();
sweep(weeksFrom(start, WEEKS), { strict: true });
// Long sweep: all rules again, and no identical text within any 52-week window.
const longWeeks = weeksFrom(start, LONG_RUN_WEEKS);
sweep(longWeeks, { strict: false });
for (const day of [1, 2, 3]) {
  const texts = longWeeks.map((w) => G.generate({ ...w, day }).text);
  texts.forEach((t, i) => {
    const j = texts.indexOf(t, i + 1);
    if (j !== -1 && j - i < 52) fail(label(longWeeks[j], day), `identical to ${j - i} weeks earlier`, t);
  });
}

// ---------- report ----------

const handwrittenCount = [1, 2, 3].reduce(
  (n, day) => n + weeksFrom(start, WEEKS).filter((w) => G.generate({ ...w, day }).handwritten !== null).length,
  0
);

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s):\n`);
  for (const f of failures.slice(0, 40)) {
    console.error(`- ${f.where}: ${f.why}`);
    if (f.text) console.error('    ' + f.text.replace(/\n/g, '\n    '));
  }
  if (failures.length > 40) console.error(`... and ${failures.length - 40} more`);
  process.exit(1);
}

console.log(
  `✓ All checks passed.\n` +
    `  ${WEEKS} weeks × 3 days from ${label(start, 1).split(' ')[1]}: ${WEEKS * 3} messages, all different ` +
    `(${handwrittenCount} handwritten, ${WEEKS * 3 - handwrittenCount} generated).\n` +
    `  Plus every building block and handwritten message on its own, a ${LONG_RUN_WEEKS}-week sweep and every first reroll ` +
    `(${checked} messages in total).`
);
