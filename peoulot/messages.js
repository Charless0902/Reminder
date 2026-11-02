/*
 * Peoulot Update: the WhatsApp message for Monday and Thursday.
 *
 * Change the kvoutsot or the titles in CONFIG below.
 * Run `node peoulot/test/run-tests.js` after editing.
 */

// ============================== CONFIG ==============================

const CONFIG = {
  timeZone: 'Europe/Brussels', // used to decide what day it is

  // The kvoutsot, in the order they appear in the message.
  groups: ['Manhigim', 'Lohamim', 'Eytanim', 'Nesharim', 'Giborim', 'Mena', 'Tzio', 'Nahshon', 'Totha'],

  // Which message goes out on which day (1 = Monday ... 7 = Sunday).
  // blankLine: an empty line between the title and the list.
  messages: {
    1: { name: 'Maandag', title: 'Peoulot in de drive:', blankLine: false },
    4: { name: 'Donderdag', title: 'Peoulot verbeterd:', blankLine: true },
  },
};

// ============================== LOGIC ===============================

const PeoulotGen = (function () {
  'use strict';

  const DAY_MS = 86400000;
  const days = Object.keys(CONFIG.messages).map(Number).sort((a, b) => a - b);

  function message(day) {
    const m = CONFIG.messages[day];
    if (!m) throw new Error(`no message for day ${day}`);
    return m.title + '\n' + (m.blankLine ? '\n' : '') + CONFIG.groups.map((g) => '-' + g).join('\n');
  }

  // Today's date in CONFIG.timeZone. weekday: 1 = Monday ... 7 = Sunday.
  function today(now) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: CONFIG.timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
    }).formatToParts(now || new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    const utc = Date.UTC(get('year'), get('month') - 1, get('day'));
    return { utc, weekday: new Date(utc).getUTCDay() || 7 };
  }

  // The date a day's message is for: today if it's that day, otherwise the next one.
  function nextDate(t, day) {
    return t.utc + ((day - t.weekday + 7) % 7) * DAY_MS;
  }

  function whatsappUrl(text) {
    return 'whatsapp://send?text=' + encodeURIComponent(text.replace(/\r\n?/g, '\n'));
  }

  return { CONFIG, days, message, today, nextDate, whatsappUrl };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = PeoulotGen;
