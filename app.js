(function () {
  'use strict';

  const G = ReminderGen;
  const C = G.CONFIG;
  const $ = (id) => document.getElementById(id);
  const el = {
    todayLabel: $('today-label'),
    tabs: Array.from(document.querySelectorAll('.tab')),
    rest: $('rest'),
    restText: $('rest-text'),
    editor: $('editor'),
    label: $('msg-label'),
    msg: $('msg'),
    send: $('send'),
    copy: $('copy'),
    reroll: $('reroll'),
    toast: $('toast'),
    goUrl: $('go-url'),
    copyGo: $('copy-go'),
    installTip: $('install-tip'),
  };

  // ?go  -> open WhatsApp right away with today's message (for the Shortcut)
  // ?dag=ma|di|wo -> pretend it's that day (handy for testing ?go on another day)
  const params = new URLSearchParams(location.search);
  const today = G.today();
  const week = G.reminderWeek(today);
  const forcedDay = parseDay(params.get('dag'));
  const todayDay = forcedDay || (today.weekday <= 3 ? today.weekday : null);
  const state = { day: null, variant: 0, message: null };

  function parseDay(value) {
    const days = { 1: 1, ma: 1, maandag: 1, 2: 2, di: 2, dinsdag: 2, 3: 3, wo: 3, woensdag: 3 };
    return days[(value || '').trim().toLowerCase()] || null;
  }

  const fullDate = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const weekdayOnly = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', timeZone: 'UTC' });
  const formatDate = (utc) => fullDate.format(new Date(utc));
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- drafts: edits and rerolls survive a trip to WhatsApp and back ----------

  const DRAFT_PREFIX = 'peoula-reminder:';
  const weekPrefix = `${DRAFT_PREFIX}${week.isoYear}-W${week.isoWeek}-`;

  function readDraft(day) {
    try {
      return JSON.parse(localStorage.getItem(weekPrefix + day)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveDraft() {
    const edited = el.msg.value !== state.message.text;
    try {
      if (!state.variant && !edited) localStorage.removeItem(weekPrefix + state.day);
      else localStorage.setItem(weekPrefix + state.day, JSON.stringify({ variant: state.variant, text: edited ? el.msg.value : null }));
    } catch (e) {
      // private browsing: no drafts, everything else still works
    }
  }

  function cleanOldDrafts() {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DRAFT_PREFIX) && !key.startsWith(weekPrefix)) localStorage.removeItem(key);
      }
    } catch (e) {
      // ignore
    }
  }

  // ---------- rendering ----------

  function showDay(day) {
    state.day = day;
    const draft = readDraft(day);
    state.variant = draft.variant || 0;
    state.message = G.generate({ isoYear: week.isoYear, isoWeek: week.isoWeek, day, variant: state.variant });

    el.tabs.forEach((tab) => tab.setAttribute('aria-selected', String(Number(tab.dataset.day) === day)));
    el.label.textContent = 'Bericht voor ' + formatDate(G.dateOf(week.isoYear, week.isoWeek, day));
    el.rest.hidden = true;
    el.editor.hidden = false;
    setText(draft.text || state.message.text);
  }

  function showRest() {
    el.tabs.forEach((tab) => tab.setAttribute('aria-selected', 'false'));
    el.editor.hidden = true;
    el.rest.hidden = false;
    el.restText.textContent =
      `Het is ${weekdayOnly.format(new Date(today.utc))}. De deadline voor de ${C.peoula} was ${C.deadlineDay} om ${C.deadlineTime}. ` +
      `Volgende reminder: ${formatDate(G.dateOf(week.isoYear, week.isoWeek, 1))}. Geniet ervan 😎`;
  }

  function setText(text) {
    el.msg.value = text;
    autosize();
    updateSendLink();
  }

  function autosize() {
    el.msg.style.height = 'auto';
    el.msg.style.height = el.msg.scrollHeight + 'px';
  }

  function updateSendLink() {
    el.send.href = G.whatsappUrl(el.msg.value);
  }

  let toastTimer;
  function toast(text) {
    el.toast.textContent = text;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  // ---------- events ----------

  el.tabs.forEach((tab) => {
    const day = Number(tab.dataset.day);
    if (day === today.weekday) tab.classList.add('is-today');
    tab.addEventListener('click', () => showDay(day));
  });

  el.msg.addEventListener('input', () => {
    autosize();
    updateSendLink();
    saveDraft();
  });

  el.reroll.addEventListener('click', () => {
    state.variant += 1;
    state.message = G.generate({ isoYear: week.isoYear, isoWeek: week.isoWeek, day: state.day, variant: state.variant });
    setText(state.message.text);
    saveDraft();
    toast('🎲 Nieuwe versie');
  });

  el.copy.addEventListener('click', () => {
    copyText(el.msg.value).then((ok) => toast(ok ? 'Gekopieerd ✓' : 'Kopiëren lukte niet'));
  });

  el.copyGo.addEventListener('click', () => {
    copyText(el.goUrl.textContent).then((ok) => toast(ok ? 'Link gekopieerd ✓' : 'Kopiëren lukte niet'));
  });

  window.addEventListener('resize', () => {
    if (!el.editor.hidden) autosize();
  });

  // ---------- start ----------

  el.todayLabel.textContent = capitalize(formatDate(today.utc));
  el.goUrl.textContent = location.origin + location.pathname + '?go';
  cleanOldDrafts();

  if (todayDay) showDay(todayDay);
  else showRest();

  const standalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  if (standalone) el.installTip.hidden = true;

  if (params.has('go')) {
    // Drop ?go from the address so coming back to this tab doesn't reopen WhatsApp.
    params.delete('go');
    const query = params.toString();
    history.replaceState(null, '', location.pathname + (query ? '?' + query : ''));
    if (todayDay) location.href = G.whatsappUrl(el.msg.value);
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
