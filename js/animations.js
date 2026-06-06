(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  function observeRevealElements() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeRevealElements);
  } else {
    observeRevealElements();
  }

  window.animationsObserve = observeRevealElements;
})();
