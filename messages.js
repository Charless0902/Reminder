/*
 * Peoula Reminder: message generator.
 *
 * Everything you might want to change lives in this file:
 *   1. CONFIG: deadline, the word "Peoula", timezone, mix of handwritten messages
 *   2. TEXTS: the building blocks per day (add or edit lines freely)
 *   3. the generator itself (normally no need to touch it)
 *
 * Placeholders you can use in every text:
 *   {PEOULA}  -> CONFIG.peoula        e.g. "Peoula"
 *   {DAG}     -> CONFIG.deadlineDay   e.g. "woensdag"
 *   {Dag}     -> same, capitalised    e.g. "Woensdag"
 *   {UUR}     -> CONFIG.deadlineTime  e.g. "20:00"
 *
 * Rules for new lines: always plural ("jullie", never je/jij/jouw/jou).
 * Run `node test/run-tests.js` after editing.
 */

// ============================== 1. CONFIG ==============================

const CONFIG = {
  peoula: 'Peoula',            // the word used for the activity
  deadlineDay: 'woensdag',     // deadline day, lowercase (Tuesday texts say "morgen", Wednesday texts say "VANDAAG")
  deadlineTime: '20:00',       // deadline time
  timeZone: 'Europe/Brussels', // used to decide what day it is
  handwrittenChance: 0.2,      // chance that a complete handwritten message is used instead of a generated one
  noRepeatWeeks: 4,            // the opener and motivation line are not reused within this many weeks
};

// ============================== 2. TEXTS ===============================
// Per day: interchangeable parts. A message is built from
// opener + dayLine + deadline + motivation + closer + two emoji combos.
// dayLine must name the day and say it's a reminder for the {PEOULA}.
// closer must ask to react with an emoji.
// handwritten: complete messages, one string per block (blocks are separated by a blank line).

const TEXTS = {
  maandag: {
    openers: [
      'Hello!!!',
      'Heyyy team!!!',
      'Shalom shalom!!!',
      'Hallooo allemaal!!!',
      'Yo yo yo madrichim!!!',
      "Hellooo y'all!!!",
      'Goeiendag lieve madrichim!!!',
      'Hello hello hello!!!',
      'Hey hey hey!!!',
      'Shalom lieve madrichim!!!',
      'Allee madrichim!!!',
      'Hey you guys!!!',
      'Ahlan madrichim!!!',
      'Bonjourrr allemaal!!!',
      'Hiii team!!!',
      'Goeiemiddag, goeieavond, of wanneer jullie dit ook lezen!!!',
      'Sababa, daar zijn we weer!!!',
      'Ahoy madrichim!!!',
    ],
    dayLines: [
      "It's Monday againnn!!! En dat betekent een nieuwe reminder voor de {PEOULA}",
      'Het is weer maandag, dus hier is jullie wekelijkse {PEOULA}-reminder',
      'Het is maandaggg en dat betekent: de eerste {PEOULA}-reminder van de week!!!',
      'Maandag = {PEOULA}-reminderdag!!!',
      'The week just started en het is maandag, dus: {PEOULA}-reminder time!!!',
      'Maandagmood: chill, maar wel een kleine reminder voor de {PEOULA}!!!',
      'Monday is here, en de {PEOULA}-reminder ook!!!',
      'Het is maandag, de week is nog jong, perfect moment voor een {PEOULA}-reminder',
      'New week, new vibes: het is maandag en hier is de {PEOULA}-reminder!!!',
      'Maandag alweer!!! Tijd voor de {PEOULA}-reminder van deze week',
      'Het is maandag en jullie kennen het ritueel: {PEOULA}-reminder!!!',
      'Happy Monday!!! Hier is de eerste {PEOULA}-reminder van de week',
      'Weekend is gedaan, het is maandag, dus tijd voor een {PEOULA}-reminder!!!',
      'Efkes een maandagreminder voor de {PEOULA}, no stress (nog)!!!',
      'Het is maandag, dus jullie weten wat er komt: de {PEOULA}-reminder!!!',
      'Amai, het is al maandag!!! Dus hier is jullie {PEOULA}-reminder',
      'Nieuwe week, nieuwe {PEOULA}: het is maandag en dit is jullie reminder!!!',
      'Het is Mondayyy en dus tijd voor reminder nummer 1 voor de {PEOULA}!!!',
    ],
    deadlines: [
      'Vergeet niet: {UUR} max op {DAG}!!!',
      'Deadline: {DAG} om {UUR}, maar jullie hebben nog alle tijd',
      'Reminder van de reminder: ten laatste {DAG} om {UUR}',
      'Jullie hebben tot {DAG} {UUR} max, dus geen stress',
      'Zoals altijd: {UUR} max op {DAG}',
      'Klein detail: de deadline is {DAG} om {UUR}',
      "Nog tot {DAG} {UUR}, da's plenty tijd!!!",
      'Onthoud: {DAG}, {UUR}, max!!!',
      'De deadline blijft dezelfde: {DAG} om {UUR}',
      'Ten laatste {DAG} om {UUR} binnen, dan is iedereen happy',
      'Deadline staat vast: {DAG} {UUR} max',
      'Jullie kennen het: {DAG} om {UUR} max',
      'Rustig beginnen mag, maar {DAG} om {UUR} is de limiet!!!',
      'Save the date: {DAG} {UUR}, deadline!!!',
      'Noteer alvast: {DAG} om {UUR} max!!!',
      'Geen paniek, de deadline is pas {DAG} om {UUR}',
    ],
    motivations: [
      "Let's gooo, I believe in you guys!!!",
      'Jullie gaan dit zo goed doen!!!',
      'Ik heb er alle vertrouwen in, team!!!',
      'Begin rustig, dan wordt het een top-{PEOULA}!!!',
      "Fresh week, fresh ideas, let's gooo!!!",
      'Jullie zijn de beste madrichim, ik weet dat jullie dit kunnen!!!',
      'Kadima, de week is van jullie!!!',
      'Begin vandaag al met brainstormen, dan wordt het extra sababa!!!',
      "Chazak ve'ematz, you guys got this!!!",
      'Een klein beetje vandaag = een chille {DAG}!!!',
      'Ik kan niet wachten om te zien wat jullie deze week bedenken!!!',
      "Jullie chanichim gaan genieten, let's gooo!!!",
      'Een goed idee vandaag is al half werk!!!',
      "Y'all are amazing, dit wordt een topweek!!!",
      "Dream team, let's make this week awesome!!!",
      'Sababa vibes only, jullie kunnen dit!!!',
      'Ik geloof in jullie, deze week wordt legendary!!!',
    ],
    closers: [
      'Reageer allemaal met jullie lievelingsemoji!!!',
      'Reageer met jullie lievelingsemoji als jullie het gezien hebben!!!',
      'Laat allemaal een emoji achter als jullie dit gelezen hebben!!!',
      'Gezien? Drop jullie lievelingsemoji hieronder!!!',
      'Reageer allemaal met een emoji die jullie maandagmood beschrijft!!!',
      'Wie dit gelezen heeft: reageer met een emoji!!!',
      "Reacties met emoji's zijn verplicht, hè!!! 😜",
      'Reageer met jullie favoriete emoji, team!!!',
      "Eén emoji per madrich als reactie, let's go!!!",
      'Even checken of iedereen mee is: reageer met jullie lievelingsemoji!!!',
      'Drop allemaal een emoji, dan weet ik dat jullie wakker zijn!!!',
      'Reageer met een emoji als jullie er klaar voor zijn!!!',
      "Y'all know the drill: reageer met jullie lievelingsemoji!!!",
      'Emoji-check!!! Reageer allemaal met jullie lievelingsemoji',
      'Reageer met de emoji die bij jullie {PEOULA} van deze week past!!!',
      'Laat met een emoji weten dat jullie het gezien hebben!!!',
    ],
    emojiTop: [
      '☀️☀️☀️', '✨✨✨', '🙌🙌🙌', '😎😎😎', '🎉🎉🎉', '🥳🥳🥳', '📅📅📅', '👋👋👋',
      '🌟✨🌟', '💙🤍💙', '🤩🤩🤩', '☕️☕️☕️', '🎶🎶🎶', '🌈🌈🌈', '😁😁😁', '🚀🚀🚀',
    ],
    emojiBottom: [
      '❤️‍🔥❤️‍🔥❤️‍🔥', '💪💪💪', '🔥🔥🔥', '🫶🫶🫶', '💙💙💙', '🚀🚀🚀', '⭐️⭐️⭐️', '🤝🤝🤝',
      '💯💯💯', '✨💪✨', '🥇🥇🥇', '❤️❤️❤️', '😍😍😍', '🌟🌟🌟', '👊👊👊', '🧠💡🧠',
    ],
    handwritten: [
      [
        "Hello!!! It's Monday againnn!!!",
        'En dat betekent een nieuwe reminder voor de {PEOULA}, vergeet niet: {UUR} max op {DAG}.',
        "Let's gooo, I believe in you guys!!! ❤️‍🔥❤️‍🔥❤️‍🔥",
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'Shalom madrichim!!! ☀️☀️☀️',
        'Het is maandag: nieuwe week, nieuwe kansen en ja... een nieuwe {PEOULA}-reminder 😏',
        'Deadline zoals altijd: {DAG} om {UUR} max. Begin vandaag al met een ideetje, dan wordt het een sababa week!!!',
        'Reageer met jullie lievelingsemoji als jullie het gezien hebben!!!',
      ],
      [
        'Heyyy team!!! Maandaggg 🙌🙌🙌',
        'Kleine reminder: de {PEOULA} moet ten laatste {DAG} om {UUR} klaar zijn.',
        'Geen stress, jullie hebben nog tijd, maar wachten tot de laatste minuut is ook geen plan 😜 Kadima!!!',
        'Drop allemaal een emoji hieronder!!!',
      ],
      [
        'Breaking news 📰📰📰 Het is maandag!!!',
        'En dat betekent: tijd voor de eerste {PEOULA}-reminder van de week. Deadline: {DAG} {UUR} max.',
        'Jullie zijn fantastische madrichim, ik weet dat dit weer top wordt ✨✨✨',
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'Yo yo yo madrichim!!! 😎',
        "It's Monday, dus jullie weten wat er komt: de {PEOULA}-reminder!!! Deadline blijft {DAG} om {UUR}.",
        "Een goed idee vandaag = een chille {DAG}. Let's gooo!!! 🚀🚀🚀",
        'Reageer met een emoji als jullie mee zijn!!!',
      ],
      [
        'Hellooo!!! 👋👋👋',
        'Weekend voorbij, het is maandag en de {PEOULA} roept al. Reminder: {DAG} om {UUR} max.',
        'Brainstormen mag nu al, jullie chanichim gaan genieten!!! 🫶🫶🫶',
        'Laat allemaal een emoji achter als jullie dit gelezen hebben!!!',
      ],
      [
        'Maandag maandag maandag!!! 📅📅📅',
        'Jullie favoriete reminder is terug: de {PEOULA}!!! Vergeet niet, {DAG} om {UUR} max.',
        'Chazak, jullie gaan dit zo goed doen!!! 💪💪💪',
        'Emoji-check: reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        "Hey hey hey!!! It's a brand new weekkk, het is maandag 🌟✨🌟",
        'Eerste {PEOULA}-reminder van de week: ten laatste {DAG} om {UUR}.',
        'Ik ben benieuwd wat jullie deze keer gaan bedenken, I believe in you guys!!! ❤️‍🔥❤️‍🔥❤️‍🔥',
        'Reageer met jullie lievelingsemoji!!!',
      ],
      [
        'Shalom shalom!!! 😎😎😎',
        'Het is maandag, dus hier is jullie wekelijkse {PEOULA}-reminder. Deadline: {DAG} {UUR} max.',
        'Rustig starten, sterk eindigen. Sababa? Sababa!!! 💙🤍💙',
        'Reageer allemaal met een emoji!!!',
      ],
      [
        'Goeiendag lieve madrichim!!! 🥳🥳🥳',
        'Het is maandag: nieuwe week = nieuwe {PEOULA} = nieuwe reminder!!! Jullie hebben tot {DAG} om {UUR}.',
        "Teamwork makes the dream work, dus verdeel de taken en let's gooo!!! 🙌🙌🙌",
        'Reageer met jullie lievelingsemoji!!!',
      ],
    ],
  },

  dinsdag: {
    openers: [
      "Yallah let's gooo!!!",
      'Heyyy madrichim!!!',
      'Tick tock, tick tock!!!',
      'Kadima team!!!',
      'Hello again!!!',
      'Yallahhh!!!',
      'Psssst madrichim!!!',
      'Daar ben ik weer!!!',
      'Knock knock!!!',
      'Yo yo yo!!!',
      "Hey y'all!!!",
      'Here we go again!!!',
      'Sababa team!!!',
      'Helloooo!!!',
      'Kadima kadima!!!',
      'Allee allee!!!',
      'Amai madrichim!!!',
      'Hup hup hup!!!',
    ],
    dayLines: [
      'Het is al dinsdag en het is ook tijd voor een nieuwe reminder voor de {PEOULA}',
      'Dinsdag alweer, dus hier is reminder nummer 2 voor de {PEOULA}',
      "It's Tuesdayyy en de klok tikt voor de {PEOULA}, dus: reminder!!!",
      'Het is dinsdag: halfway naar de deadline, tijd voor een {PEOULA}-reminder!!!',
      'Tweede {PEOULA}-reminder van de week, want het is al dinsdag!!!',
      'Het is dinsdag en de {PEOULA}-reminder is back!!!',
      'Dinsdag = perfecte dag om verder te werken aan de {PEOULA}, dus hier is jullie reminder!!!',
      'Hier is jullie dinsdag-reminder: de {PEOULA} wacht op jullie!!!',
      "It's Tuesday already en jullie weten wat dat betekent: {PEOULA}-reminder!!!",
      'Het is dinsdag, de tijd vliegt, en hier is de {PEOULA}-reminder!!!',
      'Amai, het is al dinsdag!!! Tijd voor een {PEOULA}-reminder',
      'Dinsdagcheck: hoe staat het met de {PEOULA}? Dit is jullie reminder!!!',
      'Het is dinsdag en de klok tikt: tijd voor een {PEOULA}-reminder!!!',
      'Het is dinsdag, dus deze {PEOULA}-reminder komt precies op tijd!!!',
      'Day two van de reminders: het is dinsdag en de {PEOULA} roept!!!',
      'Tuesday reminder: het is dinsdag en de {PEOULA} wacht niet!!!',
      'Seffens is het al woensdag, dus hier is jullie dinsdag-reminder voor de {PEOULA}!!!',
    ],
    deadlines: [
      'Nog tot morgen, {DAG} {UUR} max!!!',
      'Deadline is morgen: {DAG} om {UUR}!!!',
      'Nog maar één dag tot {DAG} {UUR}!!!',
      'Reminder: {DAG} om {UUR} max, en dat is MORGEN al!!!',
      '{Dag} {UUR} komt sneller dan jullie denken!!!',
      'De deadline ({DAG} om {UUR}) komt eraan!!!',
      'Morgen ({DAG}) om {UUR} max, dus vandaag al goed doorwerken!!!',
      'Ten laatste {DAG} om {UUR}, de tijd vliegt!!!',
      'De klok tikt: {DAG} {UUR} max!!!',
      '{Dag} {UUR} = deadline, dus vandaag is de perfecte dag om verder te werken!!!',
      'Niet vergeten: morgen, {DAG}, om {UUR} max!!!',
      'Deadline check: {DAG} om {UUR} max!!!',
      'Zet een alarm: {DAG} om {UUR}!!!',
      'Nog één nachtje slapen tot de deadline: {DAG} {UUR}!!!',
      'Morgen is het zover: {DAG} om {UUR} max!!!',
      'Klein geheugensteuntje: {DAG} om {UUR} max!!!',
    ],
    motivations: [
      'You can do it, you guys!!!',
      'Jullie zijn al goed bezig, keep going!!!',
      'Nog even doorzetten, jullie kunnen dit!!!',
      'Chazak, jullie zijn er bijna!!!',
      "Ik geloof in jullie, let's finish strong!!!",
      'Een beetje werken vandaag en morgen is het easy!!!',
      'Kadima, jullie chanichim rekenen op jullie!!!',
      'Keep the energy up, team!!!',
      'Jullie hebben dit, ik weet het zeker!!!',
      'Halfway there, keep pushing!!!',
      'Teamwork makes the dream work, dus verdeel het werk!!!',
      'Sababa, als jullie vandaag doorwerken is morgen chill!!!',
      "Y'all got this, gewoon blijven gaan!!!",
      'Nog even focussen, dan zit het erop!!!',
      'Jullie zijn topmadrichim, dit lukt zeker!!!',
      "Don't stop now, jullie zijn on fire!!!",
      'Goe bezig, nu nog de laatste details!!!',
      "Ik ben nu al benieuwd naar het resultaat, let's gooo!!!",
    ],
    closers: [
      'Reageer allemaal met jullie lievelingsemoji!!!',
      'Reageer met een emoji als jullie {PEOULA} al in de maak is!!!',
      'Status-check: reageer met een emoji hoe ver jullie staan!!! (🟢 klaar, 🟡 bezig, 🔴 help)',
      'Drop jullie lievelingsemoji als jullie dit gezien hebben!!!',
      'Reageer met een emoji, dan weet ik dat jullie mee zijn!!!',
      'Gelezen? Reageer allemaal met jullie lievelingsemoji!!!',
      'Laat een emoji achter, team!!! Ik tel ze 👀',
      'Reageer met de emoji die jullie dinsdagvibe beschrijft!!!',
      'Emoji-check!!! Reageer allemaal met jullie lievelingsemoji',
      'Even een teken van leven: reageer met een emoji!!!',
      'Emoji-update: ⏳ = nog bezig, ✅ = klaar!!! Reageer allemaal',
      "Reageer allemaal met een emoji, y'all!!!",
      'Wie leest dit? Reageer met jullie lievelingsemoji!!!',
      'Eén emoji als reactie en we zijn sababa!!!',
      'Reageer met jullie lievelingsemoji, chazak!!!',
      'Reageer met een emoji zodat ik weet dat het binnen is!!!',
    ],
    emojiTop: [
      '⌛️⏱️⌛️', '⏳⏳⏳', '⏰⏰⏰', '🕗🕗🕗', '⏱️⏱️⏱️', '⌛️⌛️⌛️', '⏳⌛️⏳', '👀⏱️👀',
      '📅⏳📅', '⏰👀⏰', '🕐🕑🕒', '⚡️⚡️⚡️', '🔔🔔🔔', '📝📝📝', '✍️✍️✍️', '🧠🧠🧠',
    ],
    emojiBottom: [
      '💪💪💪', '🔥🔥🔥', '❤️‍🔥❤️‍🔥❤️‍🔥', '🚀🚀🚀', '💯💯💯', '🙌🙌🙌', '👊👊👊', '⚡️💪⚡️',
      '🫡🫡🫡', '✨✨✨', '💥💥💥', '🤩🤩🤩', '🦾🦾🦾', '😤💪😤', '🫶🫶🫶', '🌟🌟🌟',
    ],
    handwritten: [
      [
        "Yallah let's gooo!!! Het is al dinsdag en het is ook tijd voor een nieuwe reminder voor de {PEOULA} ⌛️⏱️⌛️",
        'You can do it, you guys 💪💪💪 (ps: {DAG} om {UUR} max)',
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'Tick tock, tick tock ⏳⏳⏳',
        'Het is dinsdag, dus hier is jullie {PEOULA}-reminder: de deadline komt dichterbij, morgen ({DAG}) om {UUR} max!!!',
        'Jullie zijn al goed bezig, ik weet het. Nog even doorzetten en dan is het sababa 💪💪💪',
        'Status-check: reageer met een emoji hoe ver jullie staan!!! (🟢 klaar, 🟡 bezig, 🔴 help)',
      ],
      [
        'Kadima madrichim!!! 🚀🚀🚀',
        'Dinsdag = reminder nummer 2 voor de {PEOULA}. Deadline: {DAG} {UUR}, dus dat is al MORGEN!!!',
        'Een beetje werken vandaag en morgen is het easy. You guys got this!!! 🔥🔥🔥',
        'Reageer met jullie lievelingsemoji!!!',
      ],
      [
        'Psssst... het is dinsdag 👀⏱️👀',
        'Kleine (maar belangrijke) reminder voor de {PEOULA}: ten laatste {DAG} om {UUR}.',
        'Chazak, jullie chanichim gaan genieten van wat jullie maken!!! ✨✨✨',
        'Drop allemaal een emoji als jullie dit gelezen hebben!!!',
      ],
      [
        'Hello again!!! Het is dinsdaggg ⏰⏰⏰',
        'Halfway naar de deadline, dus hier is jullie {PEOULA}-reminder: {DAG} om {UUR} max!!!',
        "Keep going, y'all, ik geloof in jullie!!! 💪💪💪",
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        "Yallahhh!!! It's Tuesday 🕗🕗🕗",
        'Het is dinsdag en tijd voor een {PEOULA}-reminder: de deadline is {DAG} om {UUR}!!!',
        'Teamwork makes the dream work, dus verdeel de taken en GO!!! 🙌🙌🙌',
        'Reageer met een emoji als jullie het gezien hebben!!!',
      ],
      [
        'Knock knock 🚪🚪🚪 Wie is daar? De dinsdag-reminder voor de {PEOULA}!!!',
        'Nog tot morgen, {DAG} {UUR} max.',
        'Jullie zijn topmadrichim, dit lukt zeker!!! ❤️‍🔥❤️‍🔥❤️‍🔥',
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'Heyyy team!!! ⌛️⌛️⌛️',
        'Het is al dinsdag, de tijd vliegt!!! Reminder: de {PEOULA} moet {DAG} om {UUR} klaar zijn.',
        'Sababa als jullie vandaag doorwerken, dan wordt morgen chill 😎',
        'Emoji-update: ⏳ = nog bezig, ✅ = klaar!!! Reageer allemaal',
      ],
      [
        'Here we go again!!! Dinsdag = reminder 2 van 3 voor de {PEOULA} 📝📝📝',
        'Deadline check: {DAG} om {UUR} max!!!',
        'Nog even focussen, dan zit het erop. Kadima!!! 💪💪💪',
        'Reageer met jullie lievelingsemoji, team!!!',
      ],
      [
        'Sababa team!!! ⚡️⚡️⚡️',
        "It's Tuesday already, dus tijd voor een {PEOULA}-reminder. Zet een alarm: {DAG} om {UUR}!!!",
        "Don't stop now, jullie zijn on fire!!! 🔥🔥🔥",
        'Reageer allemaal met een emoji!!!',
      ],
    ],
  },

  woensdag: {
    openers: [
      "Yallahhh let's gooo!!!",
      'ALARM ALARM!!!',
      'Madrichim, dit is het moment!!!',
      'Final call!!!',
      'Yallahhh!!!',
      'Kadima, NU!!!',
      "It's the final countdown!!!",
      'Attentie attentie!!!',
      'Heyyy madrichim, het is zover!!!',
      'Code rood!!!',
      'Laatste keer, beloofd!!!',
      'Here we gooo!!!',
      'Yo yo yo, final round!!!',
      'Sirenes aan!!!',
      'Breaking news!!!',
      'Last call, team!!!',
      'Ready or not, here it comes!!!',
      'Amai amai amai!!!',
    ],
    dayLines: [
      'Het is woensdag en dit is de LAATSTE reminder voor de {PEOULA}',
      'Woensdag = deadline-dag, dus dit is de LAATSTE {PEOULA}-reminder!!!',
      'Woensdag, oftewel deadline day: de LAATSTE {PEOULA}-reminder van de week!!!',
      'Het is woensdag: LAATSTE reminder, de {PEOULA} moet VANDAAG klaar zijn!!!',
      'Dit is hem dan: de LAATSTE {PEOULA}-reminder, want het is woensdag!!!',
      'Het is woensdaggg en dus D-Day voor de {PEOULA}: LAATSTE reminder!!!',
      'Woensdag is hier, en dit is de allerLAATSTE reminder voor de {PEOULA}!!!',
      'LAATSTE reminder van de week: het is woensdag en de {PEOULA} moet af!!!',
      'Het is woensdag, de dag van de waarheid: LAATSTE {PEOULA}-reminder!!!',
      'Woensdagmodus: AAN!!! Dit is de LAATSTE reminder voor de {PEOULA}',
      'Reminder nummer 3, de LAATSTE: het is woensdag en de {PEOULA}-deadline is VANDAAG!!!',
      'Het is woensdag en jullie weten het: dit is de LAATSTE {PEOULA}-reminder!!!',
      'Woensdag, deadline-dag, LAATSTE reminder voor de {PEOULA}!!!',
      'Het is woensdag, tijd voor de LAATSTE {PEOULA}-reminder!!!',
      'LAATSTE reminder, want het is woensdag en de {PEOULA} moet VANDAAG binnen!!!',
      'Het is woensdag, dus geen tijd te verliezen: LAATSTE reminder voor de {PEOULA}!!!',
      'Amai, het is al woensdag!!! Dit is de LAATSTE {PEOULA}-reminder',
    ],
    deadlines: [
      'VANDAAG om {UUR} max!!!',
      'Deadline: VANDAAG, {UUR}, geen seconde later!!!',
      'Vanavond om {UUR} moet alles binnen zijn!!!',
      'Nog een paar uur tot {UUR}, VANDAAG is de dag!!!',
      'Vanavond {UUR} is de deadline, geen uitstel!!!',
      "VANDAAG {UUR} max, that's the final deadline!!!",
      'De klok tikt: VANDAAG om {UUR}!!!',
      '{UUR} VANDAAG, dan moet het af zijn!!!',
      'Ten laatste VANDAAG om {UUR}!!!',
      'Om {UUR} vanavond gaat de deur dicht!!!',
      'Reminder: {DAG} {UUR} = VANDAAG {UUR}!!!',
      'Nog tot {UUR} vanavond, dus NU beginnen als het nog niet af is!!!',
      'Alles binnen VANDAAG voor {UUR}!!!',
      'Deadline is VANDAAG om {UUR}, no excuses!!!',
      'Vandaag, {UUR}, max max max!!!',
      'Om {UUR} vanavond is het game over!!!',
    ],
    motivations: [
      'You got this, geef alles wat jullie hebben!!!',
      "Chazak ve'ematz, jullie kunnen dit!!!",
      'Nog één laatste push, team!!!',
      'Final sprint, ik geloof in jullie!!!',
      "Jullie chanichim verdienen de beste {PEOULA}, let's make it happen!!!",
      'Alles geven nu, en daarna mogen jullie chillen!!!',
      'Laatste rechte lijn, kadima!!!',
      'Ik weet dat jullie dit gaan halen!!!',
      'No pressure... ok, een beetje pressure, maar jullie kunnen dit!!!',
      'Focus mode aan, jullie gaan dit rocken!!!',
      'Yallah, maak er iets geweldigs van!!!',
      'Jullie zijn de beste, laat het VANDAAG zien!!!',
      "Last push, y'all, dit wordt een top-{PEOULA}!!!",
      'Geef alles, ik ben trots op jullie!!!',
      'Laptops open en GAAN!!!',
      'Het einde is in zicht, nog even volhouden!!!',
      'Jullie hebben dit, nu nog even afwerken!!!',
    ],
    closers: [
      'Reageer allemaal met jullie lievelingsemoji!!!',
      'Reageer met ✅ als jullie {PEOULA} klaar is, anders met jullie lievelingsemoji!!!',
      'LAATSTE emoji-check: reageer allemaal!!!',
      'Reageer met een emoji als jullie dit gezien hebben, NU!!! 😤',
      'Laat een emoji achter zodat ik weet dat jullie mee zijn tot de finish!!!',
      'Reageer met jullie lievelingsemoji en dan: aan de slag!!!',
      'Emoji-status: ✅ klaar, ⏳ bijna, 🆘 help!!! Reageer allemaal',
      'Iedereen reageert met een emoji, geen uitzonderingen!!!',
      'Reageer met een emoji als jullie het VANDAAG gaan halen!!!',
      'Drop jullie lievelingsemoji, dan weet ik dat jullie er klaar voor zijn!!!',
      'Laatste keer dat ik het vraag: reageer allemaal met een emoji!!!',
      'Reageer met 🔥 of met jullie lievelingsemoji, als jullie maar reageren!!!',
      'Emoji-check, madrichim!!! Reageer allemaal',
      'Reageer met een emoji en dan: knallen!!!',
      'Reageer met jullie lievelingsemoji, kadima!!!',
      'Gezien? Emoji eronder en dan GAAN!!!',
    ],
    emojiTop: [
      '⏰🚨⏰', '🚨🚨🚨', '⚠️⚠️⚠️', '⏳⏰⏳', '🔔🔔🔔', '📣📣📣', '🆘🆘🆘', '⏰⏰⏰',
      '🚨⏳🚨', '😤🔥', '🏁🏁🏁', '‼️‼️‼️', '🔴🔴🔴', '⛔️⏰⛔️', '📢📢📢', '💣💣💣',
    ],
    emojiBottom: [
      '❤️‍🔥❤️‍🔥❤️‍🔥', '💪💪💪', '🔥🔥🔥', '😤🔥😤', '💯💯💯', '🏆🏆🏆', '🚀🚀🚀', '⚡️⚡️⚡️',
      '💥💥💥', '👊👊👊', '🫡🫡🫡', '🦾🦾🦾', '🥇🥇🥇', '🙌🙌🙌', '❤️‍🔥💪❤️‍🔥', '🔥💪🔥',
    ],
    handwritten: [
      [
        "Yallahhh let's gooo!!! 😤🔥 Het is woensdag en dit is de LAATSTE reminder voor de {PEOULA} ⏰🚨⏰",
        'You got this 💪💪💪 Nog tot VANDAAG {UUR} max, dus geef alles wat jullie hebben!!! ❤️‍🔥❤️‍🔥❤️‍🔥',
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'ALARM ALARM 🚨🚨🚨',
        'Het is woensdag = deadline-dag!!! Dit is de LAATSTE {PEOULA}-reminder: VANDAAG om {UUR} max.',
        'Nog één laatste push, team, ik geloof in jullie!!! 💪💪💪',
        'Reageer met ✅ als jullie {PEOULA} klaar is, anders met jullie lievelingsemoji!!!',
      ],
      [
        "It's the final countdown 🎶⏰🎶",
        'Woensdag, LAATSTE reminder: de {PEOULA} moet VANDAAG om {UUR} binnen zijn!!!',
        'Laptops open en GAAN, jullie kunnen dit!!! 🔥🔥🔥',
        'LAATSTE emoji-check: reageer allemaal!!!',
      ],
      [
        'Madrichim, dit is het moment 😤😤😤',
        'Het is woensdag en dit is de LAATSTE reminder. {PEOULA} VANDAAG om {UUR} max, geen seconde later!!!',
        "Chazak ve'ematz, geef alles wat jullie hebben!!! ❤️‍🔥❤️‍🔥❤️‍🔥",
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
      [
        'Code rood ⏰🚨⏰',
        'Het is woensdag, de LAATSTE {PEOULA}-reminder van de week!!! Vanavond om {UUR} is de deadline.',
        "Final sprint, y'all, en daarna mogen jullie chillen 😎",
        'Emoji-status: ✅ klaar, ⏳ bijna, 🆘 help!!! Reageer allemaal',
      ],
      [
        'Final call!!! 📣📣📣',
        'Het is woensdaggg: LAATSTE reminder voor de {PEOULA}. Deadline is VANDAAG om {UUR}, no excuses!!!',
        "Jullie chanichim verdienen de beste {PEOULA}, let's make it happen!!! 💯💯💯",
        'Reageer met een emoji als jullie het VANDAAG gaan halen!!!',
      ],
      [
        'Yallahhh!!! 🏁🏁🏁',
        'Woensdag, deadline-dag, LAATSTE reminder voor de {PEOULA}!!! Ten laatste VANDAAG om {UUR}.',
        'No pressure... ok, een beetje pressure, maar jullie kunnen dit!!! 😤🔥',
        'Laatste keer dat ik het vraag: reageer allemaal met een emoji!!!',
      ],
      [
        'Breaking news 📰🚨📰 Het is woensdag!!!',
        'En dat betekent: de LAATSTE {PEOULA}-reminder. VANDAAG {UUR} max!!!',
        'Het einde is in zicht, nog even volhouden. Kadima!!! 💪💪💪',
        'Reageer met jullie lievelingsemoji en dan: aan de slag!!!',
      ],
      [
        'Attentie attentie ⚠️⚠️⚠️',
        'Dit is de allerLAATSTE reminder: het is woensdag en de {PEOULA} moet vanavond om {UUR} klaar zijn!!!',
        'Focus mode aan, jullie gaan dit rocken!!! ⚡️⚡️⚡️',
        'Gezien? Emoji eronder en dan GAAN!!!',
      ],
      [
        'Last call, team!!! ⏳⏰⏳',
        'Het is woensdag, dus LAATSTE {PEOULA}-reminder: alles binnen VANDAAG voor {UUR}!!!',
        'I believe in you guys, geef alles wat jullie hebben!!! ❤️‍🔥❤️‍🔥❤️‍🔥',
        'Reageer allemaal met jullie lievelingsemoji!!!',
      ],
    ],
  },
};

// ============================== 3. GENERATOR ===========================

const ReminderGen = (function () {
  'use strict';

  const DAYS = { 1: 'maandag', 2: 'dinsdag', 3: 'woensdag' };
  const DAY_MS = 86400000;
  const WEEK_MS = 7 * DAY_MS;
  // Every week's message depends on the weeks before it (no repeats), so the
  // chain starts here. Monday 1 January 2024 = ISO week 2024-W01.
  const EPOCH = Date.UTC(2024, 0, 1);
  const HANDWRITTEN_MEMORY = 30; // a handwritten message comes back after at least this many weeks
  const IDENTICAL_MEMORY = 52;   // never the exact same text within a year
  const HISTORY = Math.max(HANDWRITTEN_MEMORY, IDENTICAL_MEMORY, CONFIG.noRepeatWeeks);

  const POOLS = {
    opener: 'openers', dayLine: 'dayLines', deadline: 'deadlines', motivation: 'motivations',
    closer: 'closers', emojiTop: 'emojiTop', emojiBottom: 'emojiBottom',
  };
  const SLOTS = Object.keys(POOLS);
  // How many weeks a part may not come back (opener and motivation are the ones you notice most).
  const MEMORY = {
    opener: CONFIG.noRepeatWeeks, motivation: CONFIG.noRepeatWeeks,
    dayLine: 2, deadline: 2, closer: 2, emojiTop: 1, emojiBottom: 1,
  };

  const end = (s) => (/[.!?)]$/.test(s) ? s : s + '.');
  // Block layouts. Each returns the blocks of the message (3 or 4).
  const LAYOUTS = [
    (p) => [`${p.opener} ${p.dayLine} ${p.emojiTop}`, end(p.deadline), `${p.motivation} ${p.emojiBottom}`, p.closer],
    (p) => [`${p.opener} ${p.dayLine} ${p.emojiTop}`, `${p.motivation} ${p.emojiBottom} ${end(p.deadline)}`, p.closer],
    (p) => [`${p.opener} ${p.emojiTop}`, `${end(p.dayLine)} ${end(p.deadline)}`, `${p.motivation} ${p.emojiBottom}`, p.closer],
    (p) => [`${p.opener} ${p.emojiTop}`, end(p.dayLine), `${end(p.deadline)} ${p.motivation} ${p.emojiBottom}`, p.closer],
  ];

  // Words that shouldn't appear twice in one message (e.g. "Kadima team!!!" + "..., kadima!!!").
  const CLASH_GROUPS = [
    ['yallah'], ['kadima'], ['sababa'], ['chazak'], ['ahlan'], ['shalom'], ['amai'], ['allee'],
    ["let's go", 'here we go'], ['believe', 'geloof in jullie'], ["y'all"], ['you guys'],
    ['team', 'teamwork'], ['madrichim', 'madrich'], ['tick tock', 'klok tikt'], ['tijd vliegt'],
    ['halfway'], ['perfecte dag'], ['final', 'finale', 'last call', 'last push', 'laatste push', 'sprint', 'finish'],
    ['laatste keer'], ['morgen'], ['deadline'], ['jullie weten', 'jullie kennen', 'know the drill'],
    ['geef alles', 'alles geven', 'alles wat jullie hebben'], ['chill', 'chille', 'chillen'],
    ['alarm', 'sirenes', 'code rood'], ['nieuwe week', 'new week', 'fresh week', 'brand new week'],
    ['chanichim'], ['top', 'topweek', 'topmadrichim'], ['brainstormen'], ['bezig'], ['nu'], ['gaan'],
  ].map((group) => group.map(normalize));

  const PICTO = /\p{Extended_Pictographic}/gu;

  function normalize(s) {
    return s
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[^a-z0-9à-ÿ']+/g, ' ')
      .replace(/([a-zà-ÿ])\1+/g, '$1')
      .trim();
  }

  function fill(t) {
    const day = CONFIG.deadlineDay;
    return t
      .replace(/\{PEOULA\}/g, CONFIG.peoula)
      .replace(/\{DAG\}/g, day)
      .replace(/\{Dag\}/g, day.charAt(0).toUpperCase() + day.slice(1))
      .replace(/\{UUR\}/g, CONFIG.deadlineTime);
  }

  const isEmojiSlot = (slot) => slot === 'emojiTop' || slot === 'emojiBottom';
  const keyOf = (slot, raw) => (isEmojiSlot(slot) ? raw : normalize(raw));

  // The opener of a handwritten message: its first words, up to the first !, ., ?, … or emoji.
  function handwrittenOpenerKey(firstBlock) {
    return normalize(firstBlock.split(/[!?.…]|\p{Extended_Pictographic}/u)[0]);
  }

  function hasWord(normText, phrase) {
    return (' ' + normText + ' ').includes(' ' + phrase + ' ');
  }

  function clashes(slot, candidate, chosen) {
    if (isEmojiSlot(slot)) {
      // no emoji that's already in the message (other combo, or e.g. ✅ in the closer)
      const mine = new Set(candidate.match(PICTO) || []);
      return Object.values(chosen).some((part) => (part.match(PICTO) || []).some((e) => mine.has(e)));
    }
    const cand = normalize(candidate);
    const others = SLOTS.filter((s) => !isEmojiSlot(s) && chosen[s]).map((s) => normalize(chosen[s]));
    return CLASH_GROUPS.some(
      (group) => group.some((w) => hasWord(cand, w)) && others.some((o) => group.some((w) => hasWord(o, w)))
    );
  }

  // Deterministic random numbers from a text seed (FNV-1a hash + mulberry32).
  function rngFrom(seed) {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    let a = h >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffledIndexes(n, rng) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Builds one message. `history` = earlier weeks (oldest first), `avoid` = messages it must differ from.
  function compose(dayNr, seed, history, avoid) {
    const texts = TEXTS[DAYS[dayNr]];
    const rng = rngFrom(seed);
    const recent = (n) => history.slice(Math.max(0, history.length - n)).concat(avoid);
    const banned = (slot) => new Set(recent(MEMORY[slot]).map((h) => h.keys[slot]).filter(Boolean));
    const usedTexts = new Set(recent(IDENTICAL_MEMORY).map((h) => h.text));

    if (rng() < CONFIG.handwrittenChance) {
      const usedHandwritten = new Set(recent(HANDWRITTEN_MEMORY).map((h) => h.handwritten));
      const bannedOpeners = banned('opener');
      for (const i of shuffledIndexes(texts.handwritten.length, rng)) {
        if (usedHandwritten.has(i)) continue;
        const blocks = texts.handwritten[i].map(fill);
        const text = blocks.join('\n\n');
        const keys = { opener: handwrittenOpenerKey(blocks[0]), motivation: 'handwritten-' + i };
        if (bannedOpeners.has(keys.opener) || usedTexts.has(text)) continue;
        return { text, keys, handwritten: i };
      }
    }

    let result = null;
    for (let attempt = 0; attempt < 25; attempt++) {
      const chosen = {};
      const keys = {};
      for (const slot of SLOTS) {
        const pool = texts[POOLS[slot]];
        const no = banned(slot);
        const order = shuffledIndexes(pool.length, rng);
        const allowed = order.filter((i) => !no.has(keyOf(slot, pool[i])));
        const candidates = allowed.length ? allowed : order;
        let pick = candidates.find((i) => !clashes(slot, fill(pool[i]), chosen));
        if (pick === undefined) pick = candidates[0];
        chosen[slot] = fill(pool[pick]);
        keys[slot] = keyOf(slot, pool[pick]);
      }
      const lastLayouts = new Set(recent(1).map((h) => h.keys.layout));
      const layouts = shuffledIndexes(LAYOUTS.length, rng);
      keys.layout = layouts.find((i) => !lastLayouts.has(i));
      const text = LAYOUTS[keys.layout](chosen).join('\n\n');
      result = { text, keys, handwritten: null };
      if (!usedTexts.has(text)) break;
    }
    return result;
  }

  // ---------- dates ----------

  function isoWeekOf(utcMs) {
    const d = new Date(utcMs);
    const weekday = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - weekday); // Thursday of the same week decides the ISO year
    const isoYear = d.getUTCFullYear();
    const isoWeek = Math.ceil(((d.getTime() - Date.UTC(isoYear, 0, 1)) / DAY_MS + 1) / 7);
    return { isoYear, isoWeek };
  }

  function mondayOf(isoYear, isoWeek) {
    const jan4 = Date.UTC(isoYear, 0, 4);
    const jan4Weekday = new Date(jan4).getUTCDay() || 7;
    return jan4 - (jan4Weekday - 1) * DAY_MS + (isoWeek - 1) * WEEK_MS;
  }

  // Today's date in CONFIG.timeZone. weekday: 1 = Monday ... 7 = Sunday.
  function today(now) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: CONFIG.timeZone, year: 'numeric', month: 'numeric', day: 'numeric',
    }).formatToParts(now || new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    const utc = Date.UTC(get('year'), get('month') - 1, get('day'));
    return { utc, weekday: new Date(utc).getUTCDay() || 7, ...isoWeekOf(utc) };
  }

  // The week the Monday/Tuesday/Wednesday reminders are for: this week until
  // Wednesday, the coming week from Thursday on.
  function reminderWeek(t) {
    return t.weekday <= 3 ? isoWeekOf(t.utc) : isoWeekOf(t.utc + 7 * DAY_MS);
  }

  function dateOf(isoYear, isoWeek, dayNr) {
    return mondayOf(isoYear, isoWeek) + (dayNr - 1) * DAY_MS;
  }

  // ---------- public API ----------

  const chains = { 1: [], 2: [], 3: [] };

  function seedOf(isoYear, isoWeek, dayNr) {
    return `${isoYear}-W${String(isoWeek).padStart(2, '0')}-${dayNr}`;
  }

  function weekIndex(isoYear, isoWeek) {
    return Math.round((mondayOf(isoYear, isoWeek) - EPOCH) / WEEK_MS);
  }

  function baseMessage(dayNr, index) {
    if (index < 0) {
      const w = isoWeekOf(EPOCH + index * WEEK_MS);
      return compose(dayNr, seedOf(w.isoYear, w.isoWeek, dayNr), [], []);
    }
    const chain = chains[dayNr];
    while (chain.length <= index) {
      const i = chain.length;
      const w = isoWeekOf(EPOCH + i * WEEK_MS);
      chain.push(compose(dayNr, seedOf(w.isoYear, w.isoWeek, dayNr), chain.slice(Math.max(0, i - HISTORY)), []));
    }
    return chain[index];
  }

  /**
   * The message for one day of one ISO week.
   * variant 0 = the message of the week; 1, 2, 3... = the "🎲 Andere versie" rerolls,
   * each one different from the base message and the variant before it.
   */
  function generate({ isoYear, isoWeek, day, variant = 0 }) {
    if (!DAYS[day]) throw new Error('day must be 1 (ma), 2 (di) or 3 (wo)');
    const index = weekIndex(isoYear, isoWeek);
    const base = baseMessage(day, index);
    const history = index > 0 ? chains[day].slice(Math.max(0, index - HISTORY), index) : [];
    const seed = seedOf(isoYear, isoWeek, day);
    let message = base;
    for (let v = 1; v <= variant; v++) {
      message = compose(day, `${seed}#${v}`, history, v === 1 ? [base] : [base, message]);
    }
    return { ...message, day, isoYear, isoWeek, variant };
  }

  function whatsappUrl(text) {
    return 'whatsapp://send?text=' + encodeURIComponent(text.replace(/\r\n?/g, '\n'));
  }

  return { CONFIG, TEXTS, DAYS, generate, today, reminderWeek, dateOf, isoWeekOf, whatsappUrl, fill, normalize };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = ReminderGen;
