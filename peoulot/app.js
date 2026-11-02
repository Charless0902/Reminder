(function () {
  'use strict';

  const G = PeoulotGen;
  const C = G.CONFIG;
  const $ = (id) => document.getElementById(id);
  const el = {
    todayLabel: $('today-label'),
    tabs: $('tabs'),
    rest: $('rest'),
    restText: $('rest-text'),
    editor: $('editor'),
    label: $('msg-label'),
    msg: $('msg'),
    send: $('send'),
    copy: $('copy'),
    reset: $('reset'),
    toast: $('toast'),
    goUrl: $('go-url'),
    copyGo: $('copy-go'),
    installTip: $('install-tip'),
  };

  // ?go  -> open WhatsApp right away with today's message (for the Shortcut)
  // ?dag=ma|do -> pretend it's that day (handy for testing ?go on another day)
  const params = new URLSearchParams(location.search);
  const today = G.today();
  const forcedDay = parseDay(params.get('dag'));
  const todayDay = forcedDay || (C.messages[today.weekday] ? today.weekday : null);
  const state = { day: null, original: '' };

  function parseDay(value) {
    const v = (value || '').trim().toLowerCase();
    const day = G.days.find((d) => v === String(d) || (v.length >= 2 && C.messages[d].name.toLowerCase().startsWith(v)));
    return day || null;
  }

  const fullDate = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const weekdayOnly = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', timeZone: 'UTC' });
  const formatDate = (utc) => fullDate.format(new Date(utc));
  const isoDate = (utc) => new Date(utc).toISOString().slice(0, 10);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- drafts: edits survive a trip to WhatsApp and back ----------

  const DRAFT_PREFIX = 'peoulot-update:';
  const draftKey = (day) => `${DRAFT_PREFIX}${isoDate(G.nextDate(today, day))}-${day}`;

  function readDraft(day) {
    try {
      return localStorage.getItem(draftKey(day));
    } catch (e) {
      return null;
    }
  }

  function saveDraft() {
    try {
      if (el.msg.value === state.original) localStorage.removeItem(draftKey(state.day));
      else localStorage.setItem(draftKey(state.day), el.msg.value);
    } catch (e) {
      // private browsing: no drafts, everything else still works
    }
  }

  function cleanOldDrafts() {
    try {
      const todayKey = DRAFT_PREFIX + isoDate(today.utc);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DRAFT_PREFIX) && key < todayKey) localStorage.removeItem(key);
      }
    } catch (e) {
      // ignore
    }
  }

  // ---------- rendering ----------

  function buildTabs() {
    for (const day of G.days) {
      const tab = document.createElement('button');
      tab.className = 'tab' + (day === today.weekday ? ' is-today' : '');
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', 'false');
      tab.dataset.day = day;
      tab.textContent = C.messages[day].name;
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = 'vandaag';
      tab.appendChild(tag);
      tab.addEventListener('click', () => showDay(day));
      el.tabs.appendChild(tab);
    }
  }

  function selectTab(day) {
    for (const tab of el.tabs.children) tab.setAttribute('aria-selected', String(Number(tab.dataset.day) === day));
  }

  function showDay(day) {
    state.day = day;
    state.original = G.message(day);
    selectTab(day);
    el.label.textContent = 'Bericht voor ' + formatDate(G.nextDate(today, day));
    el.rest.hidden = true;
    el.editor.hidden = false;
    setText(readDraft(day) || state.original);
  }

  function showRest() {
    selectTab(null);
    el.editor.hidden = true;
    el.rest.hidden = false;
    const schedule = G.days.map((d) => `${C.messages[d].name.toLowerCase()} ("${C.messages[d].title.replace(/:$/, '')}")`);
    const next = Math.min(...G.days.map((d) => G.nextDate(today, d)));
    el.restText.textContent =
      `Het is ${weekdayOnly.format(new Date(today.utc))}. Er gaat een bericht uit op ${schedule.join(' en ')}. ` +
      `Volgende: ${formatDate(next)}.`;
  }

  function setText(text) {
    el.msg.value = text;
    changed();
  }

  function changed() {
    autosize();
    el.send.href = G.whatsappUrl(el.msg.value);
    el.reset.disabled = el.msg.value === state.original;
  }

  function autosize() {
    el.msg.style.height = 'auto';
    el.msg.style.height = el.msg.scrollHeight + 'px';
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

  el.msg.addEventListener('input', () => {
    changed();
    saveDraft();
  });

  el.reset.addEventListener('click', () => {
    setText(state.original);
    saveDraft();
    toast('↺ Origineel bericht terug');
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
  buildTabs();
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
