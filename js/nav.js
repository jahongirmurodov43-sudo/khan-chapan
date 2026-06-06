(function () {
  const NAV_HTML = `
<nav class="nav" id="main-nav">
  <div class="nav__inner container">
    <a href="/index.html" class="nav__logo">
      <img src="/images/logo-gold.svg" alt="Khan Chapan" height="40">
    </a>
    <ul class="nav__links" id="nav-links">
      <li><a href="/index.html"    data-i18n="nav.home"></a></li>
      <li><a href="/menu.html"     data-i18n="nav.menu"></a></li>
      <li><a href="/story.html"    data-i18n="nav.story"></a></li>
      <li><a href="/events.html"   data-i18n="nav.events"></a></li>
      <li><a href="/tour.html"     data-i18n="nav.tour"></a></li>
      <li><a href="/loyalty.html"  data-i18n="nav.loyalty"></a></li>
      <li><a href="/careers.html"  data-i18n="nav.careers"></a></li>
      <li><a href="/contact.html"  data-i18n="nav.contact"></a></li>
    </ul>
    <div class="nav__actions">
      <div class="lang-switcher" id="lang-switcher">
        <button data-lang="uz">UZ</button>
        <button data-lang="ru">RU</button>
        <button data-lang="en">EN</button>
      </div>
      <a href="/contact.html#reserve" class="btn btn--gold" data-i18n="nav.reserve"></a>
    </div>
    <button class="nav__burger" id="nav-burger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }, { passive: true });

  document.getElementById('nav-burger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('nav__links--open');
    document.getElementById('nav-burger').classList.toggle('nav__burger--open');
  });

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    if (a.getAttribute('href').includes(path)) a.classList.add('nav__link--active');
  });
})();
