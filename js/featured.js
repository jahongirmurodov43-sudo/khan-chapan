const FEATURED = (() => {
  let _items = [];

  function render() {
    const lang = I18N.current();
    const grid = document.getElementById('featured-dishes');
    if (!grid || !_items.length) return;

    grid.innerHTML = _items.map(item => {
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
            <span class="card__price">${(item.price || 0).toLocaleString('ru-RU')} UZS</span>
          </div>
        </div>`;
    }).join('');

    if (window.animationsObserve) window.animationsObserve();
  }

  async function init() {
    try {
      const res = await fetch('data/menu.json');
      if (!res.ok) return;
      const data = await res.json();
      const all  = data.items || data;
      _items = all.filter(item => item.featured).slice(0, 3);
      render();
    } catch (e) {
      console.error('Featured dishes error:', e);
    }
  }

  return { init, refresh: render };
})();
