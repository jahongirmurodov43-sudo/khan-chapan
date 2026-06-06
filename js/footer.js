(function () {
  const FOOTER_HTML = `
<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <img src="/images/logo-gold.svg" alt="Khan Chapan" height="48">
      <p class="footer__tagline" data-i18n="home.hero_tag"></p>
    </div>
    <div class="footer__info">
      <p data-i18n="footer.address"></p>
      <div class="footer__socials">
        <a href="https://t.me/khanchapan" target="_blank" rel="noopener">Telegram</a>
        <a href="https://www.instagram.com/khan.chapan/" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/khan.chapan" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.tiktok.com/@khanchapan" target="_blank" rel="noopener">TikTok</a>
      </div>
    </div>
    <div class="footer__copy">
      <p>© Khan Chapan ${new Date().getFullYear()}. <span data-i18n="footer.rights"></span>.</p>
    </div>
  </div>
</footer>`;

  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
})();
