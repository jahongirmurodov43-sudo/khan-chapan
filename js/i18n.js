const I18N = (() => {
  const SUPPORTED = ['uz', 'ru', 'en'];
  const DEFAULT   = 'ru';
  let current = localStorage.getItem('lang') || DEFAULT;
  let strings = {};

  async function load(lang) {
    const res = await fetch(`/locales/${lang}.json?v=3`);
    if (!res.ok) throw new Error(`Failed to load locale: ${lang}`);
    strings = await res.json();
    current = lang;
    localStorage.setItem('lang', lang);
    apply();
    updateSwitcher();
    if (typeof MENU !== 'undefined' && MENU.refresh) MENU.refresh();
    if (typeof FEATURED !== 'undefined' && FEATURED.refresh) FEATURED.refresh();
    if (typeof EVENTS !== 'undefined' && EVENTS.refresh) EVENTS.refresh();
  }

  function get(key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : key), strings);
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = get(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = get(el.dataset.i18nPlaceholder);
    });
    document.documentElement.lang = current;
  }

  function updateSwitcher() {
    document.querySelectorAll('.lang-switcher button').forEach(btn => {
      btn.classList.toggle('lang--active', btn.dataset.lang === current);
    });
  }

  function init() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (btn && SUPPORTED.includes(btn.dataset.lang)) load(btn.dataset.lang);
    });
    load(current);
  }

  return { init, get, load, current: () => current };
})();
