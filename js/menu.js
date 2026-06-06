const MENU = (() => {
  function formatPrice(price) {
    return Number(price).toLocaleString('ru-RU') + ' UZS';
  }

  function renderCard(item, lang) {
    const name = item.name?.[lang] || item.name?.ru || '';
    const desc = item.description?.[lang] || item.description?.ru || '';
    const img  = item.image || 'images/placeholder-dish.svg';
    return `
      <div class="card reveal">
        <img class="card__image" src="${img}" alt="${name}" loading="lazy"
             onerror="this.src='images/placeholder-dish.svg'">
        <div class="card__body">
          <h4 class="card__title">${name}</h4>
          <p class="card__desc">${desc}</p>
          <span class="card__price">${formatPrice(item.price)}</span>
        </div>
      </div>`;
  }

  let _grouped = {};
  let _categories = [];
  let _activeCat = null;

  function renderTab(cat) {
    const lang   = I18N.current();
    const grid   = document.getElementById('menu-grid');
    const tabsEl = document.getElementById('menu-tabs');
    if (!grid) return;
    _activeCat = cat;
    grid.innerHTML = (_grouped[cat] || []).map(item => renderCard(item, lang)).join('');
    if (window.animationsObserve) window.animationsObserve();
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('tab--active', b.dataset.cat === cat);
    });
    // Update tab labels for current language
    tabsEl.querySelectorAll('.tab-btn').forEach(b => {
      const c = _categories.find(x => x.slug === b.dataset.cat);
      if (c) b.textContent = c.name[lang] || c.name.ru;
    });
  }

  function refresh() {
    if (_activeCat) renderTab(_activeCat);
  }

  async function init() {
    const loading = document.getElementById('menu-loading');
    const error   = document.getElementById('menu-error');
    const tabsEl  = document.getElementById('menu-tabs');

    try {
      const res = await fetch('data/menu.json');
      if (!res.ok) throw new Error('Failed to load menu');
      const data = await res.json();

      loading.style.display = 'none';

      _categories = data.categories || [];
      const items = data.items || [];

      _categories.forEach(c => { _grouped[c.slug] = []; });
      items.forEach(item => {
        if (_grouped[item.category]) _grouped[item.category].push(item);
      });

      const lang = I18N.current();
      tabsEl.innerHTML = _categories
        .filter(c => _grouped[c.slug].length > 0)
        .map(c => `<button class="tab-btn" data-cat="${c.slug}">${c.name[lang] || c.name.ru}</button>`)
        .join('');

      tabsEl.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (btn) renderTab(btn.dataset.cat);
      });

      const firstCat = _categories.find(c => _grouped[c.slug]?.length > 0);
      if (firstCat) renderTab(firstCat.slug);

    } catch (e) {
      loading.style.display = 'none';
      error.style.display   = 'block';
      console.error('Menu load error:', e);
    }
  }

  return { init, refresh };
})();
