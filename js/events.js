const EVENTS = (() => {
  function formatDate(dateStr, lang) {
    const date   = new Date(dateStr);
    const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-GB';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderUpcoming(event, lang) {
    const title     = event.title?.[lang]       || event.title?.ru       || '';
    const desc      = event.description?.[lang] || event.description?.ru || '';
    const cover     = event.coverImage || '';
    const bookLabel = typeof I18N !== 'undefined' ? I18N.get('events.book_event') : 'Book';
    return `
      <div class="card reveal">
        ${cover ? `<img class="card__image" src="${cover}" alt="${title}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="card__body">
          <p style="font-size:0.8rem;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem">
            ${formatDate(event.date, lang)}${event.startTime ? ' · ' + event.startTime : ''}
          </p>
          <h4 class="card__title">${title}</h4>
          <p class="card__desc">${desc}</p>
          ${event.bookingLink ? `<a href="${event.bookingLink}" target="_blank" class="btn btn--outline" style="margin-top:1rem">${bookLabel}</a>` : ''}
        </div>
      </div>`;
  }

  function renderGalleryItem(event, lang) {
    const title  = event.title?.[lang] || event.title?.ru || '';
    const cover  = event.coverImage || '';
    const photos = Array.isArray(event.photos) ? event.photos : [];
    return `
      <div class="gallery-item reveal" data-photos='${JSON.stringify(photos)}' onclick="EVENTS.openLightbox(this)">
        ${cover ? `<img src="${cover}" alt="${title}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div class="gallery-item__overlay"><span>${title}</span></div>
      </div>`;
  }

  async function init() {
    const lang = localStorage.getItem('lang') || 'ru';

    try {
      const res    = await fetch('data/events.json');
      if (!res.ok) throw new Error('Failed to load events');
      const result = await res.json();

      const upcoming = result.filter(e => e.status === 'upcoming');
      const past     = result.filter(e => e.status === 'past');

      const upcomingGrid = document.getElementById('upcoming-grid');
      const noUpcoming   = document.getElementById('no-upcoming');
      if (upcoming.length === 0) {
        noUpcoming.style.display = 'block';
      } else {
        upcomingGrid.innerHTML = upcoming.map(e => renderUpcoming(e, lang)).join('');
      }

      const gallery = document.getElementById('gallery-grid');
      gallery.innerHTML = past.map(e => renderGalleryItem(e, lang)).join('');

      if (window.animationsObserve) window.animationsObserve();
    } catch (e) {
      console.error('Events load error:', e);
    }
  }

  function openLightbox(el) {
    const photos = JSON.parse(el.dataset.photos || '[]');
    if (!photos.length) return;
    const lb  = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = photos[0];
    lb.style.display = 'flex';
  }

  return { init, openLightbox };
})();
