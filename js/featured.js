(async function () {
  const lang = localStorage.getItem('lang') || 'ru';

  try {
    const res    = await fetch('data/menu.json');
    if (!res.ok) return;
    const result = await res.json();

    const featured = result.filter(item => item.available && item.featured).slice(0, 3);
    const grid     = document.getElementById('featured-dishes');
    if (!grid || !featured.length) return;

    grid.innerHTML = featured.map(item => {
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
            <span class="card__price">${(item.price || 0).toLocaleString('uz-UZ')} UZS</span>
          </div>
        </div>`;
    }).join('');

    if (window.animationsObserve) window.animationsObserve();
  } catch (e) {
    console.error('Featured dishes error:', e);
  }
})();
