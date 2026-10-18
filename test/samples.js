#!/usr/bin/env node
/*
 * Prints the upcoming messages so you can judge the style.
 *
 *   node test/samples.js        # next 3 weeks
 *   node test/samples.js 6      # next 6 weeks
 */
'use strict';

const G = require('../messages.js');

const weeks = Number(process.argv[2]) || 3;
const start = G.reminderWeek(G.today());

for (const day of [1, 2, 3]) {
  console.log(`\n==================== ${G.DAYS[day].toUpperCase()} ====================`);
  let utc = G.dateOf(start.isoYear, start.isoWeek, day);
  for (let i = 0; i < weeks; i++, utc += 7 * 86400000) {
    const w = G.isoWeekOf(utc);
    const msg = G.generate({ ...w, day });
    const date = new Date(utc).toISOString().slice(0, 10);
    console.log(`\n--- ${date} (${msg.handwritten === null ? 'generated' : 'handwritten #' + (msg.handwritten + 1)}) ---\n`);
    console.log(msg.text);
  }
}
