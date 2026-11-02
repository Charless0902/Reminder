#!/usr/bin/env node
/*
 * Checks the Peoulot Update messages.
 *
 *   node peoulot/test/run-tests.js
 *
 * Fails (exit code 1) when a message isn't exactly the text below, when the
 * wrong day gets a message, or when the WhatsApp link would break the text.
 */
'use strict';

const G = require('../messages.js');

const EXPECTED = {
  1: 'Peoulot in de drive:\n-Manhigim\n-Lohamim\n-Eytanim\n-Nesharim\n-Giborim\n-Mena\n-Tzio\n-Nahshon\n-Totha',
  4: 'Peoulot verbeterd:\n\n-Manhigim\n-Lohamim\n-Eytanim\n-Nesharim\n-Giborim\n-Mena\n-Tzio\n-Nahshon\n-Totha',
};

const failures = [];
const check = (ok, what) => {
  if (!ok) failures.push(what);
};

// 1. the exact texts
check(JSON.stringify(G.days) === '[1,4]', `messages on Monday and Thursday only (got days ${G.days})`);
for (const day of [1, 4]) {
  const text = G.message(day);
  check(text === EXPECTED[day], `day ${day} message differs:\n${JSON.stringify(text)}\nexpected\n${JSON.stringify(EXPECTED[day])}`);
  check(!/[ \t]$/m.test(text), `day ${day} has trailing spaces`);

  const url = G.whatsappUrl(text);
  const encoded = url.slice('whatsapp://send?text='.length);
  check(url.startsWith('whatsapp://send?text='), `day ${day}: link is not whatsapp://send?text=`);
  check(!/\s/.test(encoded), `day ${day}: link contains raw whitespace`);
  check(encoded.includes('%0A'), `day ${day}: line breaks not encoded as %0A`);
  check(decodeURIComponent(encoded) === text, `day ${day}: link does not decode back to the same text`);
}

// 2. which day it is, in Brussels time
const cases = [
  ['2026-11-02T08:00:00+01:00', 1, 'Monday morning'],
  ['2026-11-01T23:30:00Z', 1, 'Sunday 23:30 UTC = Monday 00:30 in Brussels'],
  ['2026-11-02T22:59:00Z', 1, 'Monday 23:59 in Brussels'],
  ['2026-11-05T19:00:00+01:00', 4, 'Thursday evening'],
  ['2026-07-23T22:30:00Z', 5, 'summer time: Thursday 22:30 UTC = Friday 00:30 in Brussels'],
  ['2026-11-01T12:00:00+01:00', 7, 'Sunday'],
];
for (const [iso, weekday, label] of cases) {
  const t = G.today(new Date(iso));
  check(t.weekday === weekday, `${label}: weekday ${t.weekday}, expected ${weekday}`);
}

// 3. the date each tab is for (today, or the next one)
const day = (iso) => new Date(iso).toISOString().slice(0, 10);
const sunday = G.today(new Date('2026-11-01T12:00:00+01:00'));
const monday = G.today(new Date('2026-11-02T12:00:00+01:00'));
const friday = G.today(new Date('2026-11-06T12:00:00+01:00'));
check(day(G.nextDate(sunday, 1)) === '2026-11-02', 'from Sunday the Monday tab is for tomorrow');
check(day(G.nextDate(sunday, 4)) === '2026-11-05', 'from Sunday the Thursday tab is for Thursday');
check(day(G.nextDate(monday, 1)) === '2026-11-02', 'on Monday the Monday tab is for today');
check(day(G.nextDate(friday, 4)) === '2026-11-12', 'from Friday the Thursday tab is for next week');

if (failures.length) {
  console.error(`✗ ${failures.length} problem(s):\n- ` + failures.join('\n- '));
  process.exit(1);
}
console.log('✓ All checks passed: both messages exact, day detection in Brussels time, WhatsApp link round trip.');
