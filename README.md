# Peoula Reminder

A small mobile website that writes a fresh WhatsApp reminder for the madrichim of Hanoar Hatzioni Antwerpen on Monday, Tuesday and Wednesday, then opens WhatsApp with it so you can pick the group.

- **Monday**: fresh week, first reminder, chill
- **Tuesday**: the clock is ticking
- **Wednesday**: LAST reminder, deadline VANDAAG

Each message is built from interchangeable parts per day (openers, day lines, deadline lines, motivation lines, emoji combos, closers), and sometimes one of ten handwritten messages is used instead. The choice is seeded on the date (year + ISO week + weekday), so the page shows the same message all day and a different one next week. The opener and the motivation line never repeat within 4 weeks of the same day.

## Files

| File | What it is |
| --- | --- |
| `messages.js` | **Config and all texts** (top of the file), plus the generator |
| `index.html`, `style.css`, `app.js` | The page |
| `manifest.webmanifest`, `sw.js`, `icons/` | Home screen app: name, icon, offline support |
| `test/run-tests.js` | Checks the messages for the next 12 weeks |
| `test/samples.js` | Prints upcoming messages so you can read them |

No framework, no build step, no backend, no API keys.

## Changing things

Open `messages.js`. At the top:

```js
const CONFIG = {
  peoula: 'Peoula',
  deadlineDay: 'woensdag',
  deadlineTime: '20:00',
  timeZone: 'Europe/Brussels',
  handwrittenChance: 0.2,
  noRepeatWeeks: 4,
};
```

Below that, `TEXTS` holds the lines per day. Add or change lines freely. You can use `{PEOULA}`, `{DAG}` (deadline day), `{Dag}` (same with a capital) and `{UUR}` (deadline time) in any line. Keep it plural: "jullie", never je/jij/jouw/jou.

The Tuesday texts say "morgen" and the Wednesday texts say "VANDAAG". If the deadline ever moves to another day, those lines need a look too.

## Checking the messages

Needs [Node.js](https://nodejs.org) (any recent version):

```sh
node test/run-tests.js     # must print "✓ All checks passed."
node test/samples.js       # shows the next 3 weeks per day
node test/samples.js 8     # ... or the next 8 weeks
```

The test fails if a message contains a singular pronoun (je, jij, jouw, jou), misses the deadline, misses the emoji closer or repeats another week's message. It also checks that every message names the day, the Peoula and "reminder", has 3–4 blocks, spells "lievelingsemoji" as one word, and survives the WhatsApp link encoding (line breaks and ❤️‍🔥).

## Links

| Link | What it does |
| --- | --- |
| `https://charless0902.github.io/Reminder/` | Opens the page. Today's message is selected on Mon/Tue/Wed; Thu–Sun shows "Geen reminder vandaag" |
| `https://charless0902.github.io/Reminder/?go` | Opens WhatsApp right away with today's message (Mon/Tue/Wed only). Use this in an iPhone Shortcut |
| `...?go&dag=di` | Same, but pretends it's Tuesday (`ma`, `di` or `wo`). Handy for testing |

## Hosting on GitHub Pages

1. Put the code on `main` (merge the branch / pull request).
2. On a free GitHub account the repository must be **public** for Pages: *Settings → General → Danger Zone → Change visibility → Public*.
3. *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, folder `/ (root)` → Save*.
4. After 1–2 minutes the site is live at **https://charless0902.github.io/Reminder/**.

Every push to `main` updates the site automatically.

## iPhone

- **Home screen app:** open the site in Safari → Share → *Zet op beginscherm*. It opens full screen with its own icon and also works offline.
- **One Shortcut instead of three:** in the Shortcuts app (*Opdrachten*), make one shortcut with the action *Open URL's* → `https://charless0902.github.io/Reminder/?go`. If you run it from an automation, one automation for Monday, Tuesday and Wednesday is enough. On other days it just shows "Geen reminder vandaag".
