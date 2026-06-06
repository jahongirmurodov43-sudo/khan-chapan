const MENU = (() => {
  function formatPrice(price) {
    return price.toLocaleString('uz-UZ') + ' UZS';
  }

  function renderCard(item, lang) {
    const name = item.name?.[lang]        || item.name?.ru        || '';
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

  async function init() {
    const lang    = localStorage.getItem('lang') || 'ru';
    const loading = document.getElementById('menu-loading');
    const error   = document.getElementById('menu-error');
    const grid    = document.getElementById('menu-grid');

    try {
      const res    = await fetch('data/menu.json');
      if (!res.ok) throw new Error('Failed to load menu');
      const result = await res.json();

      loading.style.display = 'none';

      const categories = ['starters','mains','soups','grills','drinks','desserts'];
      const grouped    = {};
      categories.forEach(c => { grouped[c] = []; });
      result.forEach(item => {
        if (item.available && grouped[item.category]) grouped[item.category].push(item);
      });

      function renderTab(cat) {
        grid.innerHTML = grouped[cat].map(item => renderCard(item, lang)).join('');
        if (window.animationsObserve) window.animationsObserve();
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('tab--active', b.dataset.cat === cat);
        });
      }

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => renderTab(btn.dataset.cat));
      });

      const firstCat = categories.find(c => grouped[c].length > 0) || 'starters';
      renderTab(firstCat);

    } catch (e) {
      loading.style.display = 'none';
      error.style.display   = 'block';
      console.error('Menu load error:', e);
    }
  }

  return { init };
})();
