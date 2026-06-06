(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    return {
      x:       randomBetween(0, W),
      y:       H + 10,
      size:    randomBetween(1, 3),
      speedY:  randomBetween(0.4, 1.2),
      speedX:  randomBetween(-0.3, 0.3),
      opacity: randomBetween(0.3, 0.9),
      life:    0,
      maxLife: randomBetween(120, 260),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x    += p.speedX;
      p.y    -= p.speedY;
      p.life += 1;
      const progress = p.life / p.maxLife;
      const alpha    = p.opacity * Math.sin(progress * Math.PI);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 160, 85, ${alpha})`;
      ctx.fill();

      if (p.life >= p.maxLife) particles[i] = createParticle();
    });
    requestAnimationFrame(draw);
  }

  function init() {
    resize();
    window.addEventListener('resize', resize, { passive: true });
    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y    = randomBetween(0, H);
      p.life = randomBetween(0, p.maxLife);
      particles.push(p);
    }
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
