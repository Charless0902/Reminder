# Peoulot Update

A second, separate mini-site next to the Peoula Reminder. It checks what day it is (Europe/Brussels) and prepares the WhatsApp message for that day:

- **Monday:** "Peoulot in de drive:" + the list of kvoutsot
- **Thursday:** "Peoulot verbeterd:" + the list of kvoutsot
- **Other days:** "Geen bericht vandaag" (the Maandag / Donderdag tabs still work)

Same buttons as the reminder: **Stuur via WhatsApp**, **Kopieer**, and **↺ Herstel** to undo your edits. Edits are kept for the day, so you can tick groups off (e.g. `-Tzio ✅`) and come back later.

## Changing things

Everything is at the top of `messages.js`: the list of kvoutsot (`groups`), the two titles, and whether there's an empty line between the title and the list.

```sh
node peoulot/test/run-tests.js   # must print "✓ All checks passed"
```

## Links

| Link | What it does |
| --- | --- |
| `https://charless0902.github.io/Reminder/peoulot/` | Opens the page with today's message |
| `https://charless0902.github.io/Reminder/peoulot/?go` | Opens WhatsApp right away (Monday and Thursday only). Use this in a Shortcut |
| `...?go&dag=do` | Same, but pretends it's Thursday (`ma` or `do`). Handy for testing |

It's published together with the Peoula Reminder (same GitHub Pages setup), so there's nothing extra to set up. Add it to your home screen separately: open the link above in Safari → Deel → *Zet op beginscherm*. It gets its own blue icon called "Peoulot".
