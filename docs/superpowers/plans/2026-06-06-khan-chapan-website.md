# Khan Chapan Restaurant Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full 8-page restaurant website for Khan Chapan — dark, cinematic, brand-first — with Sanity CMS for menu and events, trilingual support (UZ/RU/EN), and Netlify hosting.

**Architecture:** Static HTML/CSS/JS multi-page site. Shared nav and footer injected via JS. i18n handled client-side via JSON locale files. Menu and events data fetched at runtime from Sanity's CDN API. Forms submitted via Netlify Forms.

**Tech Stack:** HTML5, CSS3 (custom properties), Vanilla JS (ES6+), Sanity CMS, Netlify (hosting + forms), Google Fonts (Cormorant Garamond + Inter)

**Spec:** `docs/superpowers/specs/2026-06-06-khan-chapan-website-design.md`

---

## File Map

```
/
  index.html
  menu.html
  story.html
  events.html
  tour.html
  loyalty.html
  careers.html
  contact.html
  netlify.toml
  .gitignore

  css/
    main.css          — tokens, reset, typography, global layout
    nav.css           — navbar + mobile menu
    components.css    — buttons, cards, dividers, forms, sections
    animations.css    — fade-in, parallax, transitions

  js/
    nav.js            — inject shared navbar HTML
    footer.js         — inject shared footer HTML
    i18n.js           — language switching (UZ/RU/EN)
    animations.js     — IntersectionObserver fade-ins + parallax
    menu.js           — Sanity fetch + category tab render
    events.js         — Sanity fetch + upcoming/gallery render
    featured.js       — Sanity fetch for homepage signature dishes
    particles.js      — canvas ember animation on hero

  locales/
    uz.json
    ru.json
    en.json

  images/
    logo.svg          — white/cream version
    logo-gold.svg     — gold version for dark backgrounds
    texture.png       — dark fabric texture overlay
    hero-poster.jpg   — fallback for hero video
```

---

## Task 1: Project Scaffold & Git Init

**Files:**
- Create: `.gitignore`
- Create: `netlify.toml`
- Create: all empty directories

- [ ] **Step 1: Create folder structure**

```bash
mkdir -p css js locales images sanity docs/superpowers/plans docs/superpowers/specs
touch css/main.css css/nav.css css/components.css css/animations.css
touch js/nav.js js/footer.js js/i18n.js js/animations.js js/menu.js js/events.js js/featured.js js/particles.js
touch locales/uz.json locales/ru.json locales/en.json
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
.sanity/
dist/
.env
.env.local
*.DS_Store
.superpowers/
```

- [ ] **Step 3: Create `netlify.toml`**

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/menu"
  to = "/menu.html"
  status = 200
```

- [ ] **Step 4: Init git and commit**

```bash
git init
git add .
git commit -m "chore: project scaffold"
```

---

## Task 2: CSS Design System

**Files:**
- Populate: `css/main.css`

- [ ] **Step 1: Write `css/main.css`**

```css
/* ── Google Fonts ─────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

/* ── Design Tokens ────────────────────────────────── */
:root {
  --bg:       #0D0A06;
  --surface:  #1A1510;
  --gold:     #C9A055;
  --gold-dim: #8A6C38;
  --crimson:  #7A1A1A;
  --cream:    #F2E6C8;
  --cream-dim:#A89880;
  --white:    #FFFFFF;

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;

  --transition: 0.3s ease;
  --radius: 4px;
  --max-width: 1200px;
}

/* ── Reset ────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
  overflow-x: hidden;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

/* ── Typography ───────────────────────────────────── */
h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
  color: var(--cream);
}
h1 { font-size: clamp(2.5rem, 6vw, 5rem); }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
h3 { font-size: clamp(1.4rem, 2.5vw, 2rem); }
h4 { font-size: 1.2rem; }
p  { color: var(--cream-dim); max-width: 65ch; }

/* ── Layout ───────────────────────────────────────── */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 2rem;
}
.section {
  padding: 6rem 0;
}
.section--dark { background: var(--bg); }
.section--surface { background: var(--surface); }
.section--crimson { background: var(--crimson); }

/* ── Gold Divider ─────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gold-dim);
}
.divider-ornament {
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 1.5rem;
}

/* ── Texture Overlay ──────────────────────────────── */
.texture-overlay {
  position: relative;
}
.texture-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('../images/texture.png') repeat;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

- [ ] **Step 2: Open a blank HTML file in the browser and import `main.css`. Verify background is `#0D0A06` and no console errors.**

- [ ] **Step 3: Commit**

```bash
git add css/main.css
git commit -m "feat: CSS design tokens and global styles"
```

---

## Task 3: Shared Navbar

**Files:**
- Populate: `js/nav.js`
- Populate: `css/nav.css`

- [ ] **Step 1: Write `js/nav.js`**

```js
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

  // Inject navbar as first child of body
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Scroll behaviour: add .nav--scrolled after 80px
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }, { passive: true });

  // Mobile burger toggle
  document.getElementById('nav-burger').addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('nav__links--open');
    document.getElementById('nav-burger').classList.toggle('nav__burger--open');
  });

  // Highlight active page link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    if (a.getAttribute('href').includes(path)) a.classList.add('nav__link--active');
  });
})();
```

- [ ] **Step 2: Write `css/nav.css`**

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: background var(--transition), padding var(--transition);
}
.nav--scrolled {
  background: var(--surface);
  padding: 1rem 0;
  box-shadow: 0 2px 20px rgba(0,0,0,0.5);
}
.nav__inner {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav__logo img { height: 36px; }
.nav__links {
  display: flex;
  list-style: none;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}
.nav__links a {
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cream-dim);
  transition: color var(--transition);
}
.nav__links a:hover,
.nav__link--active { color: var(--gold) !important; }
.nav__actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.lang-switcher {
  display: flex;
  gap: 0.25rem;
}
.lang-switcher button {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--cream-dim);
  padding: 0.2rem 0.4rem;
  border-radius: 2px;
  transition: color var(--transition);
}
.lang-switcher button:hover,
.lang-switcher button.lang--active { color: var(--gold); }
.btn {
  display: inline-block;
  padding: 0.65rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: var(--radius);
  transition: all var(--transition);
}
.btn--gold {
  background: var(--gold);
  color: var(--bg);
}
.btn--gold:hover { background: var(--cream); }
.btn--outline {
  border: 1px solid var(--gold);
  color: var(--gold);
}
.btn--outline:hover { background: var(--gold); color: var(--bg); }

/* Mobile */
.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}
.nav__burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--cream);
  transition: all var(--transition);
}

@media (max-width: 900px) {
  .nav__burger { display: flex; }
  .nav__links {
    display: none;
    position: fixed;
    inset: 0;
    background: var(--bg);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    z-index: 999;
  }
  .nav__links--open { display: flex; }
  .nav__links a { font-size: 1.2rem; }
}
```

- [ ] **Step 3: Create a test HTML page to verify navbar renders and scroll transition works**

Create `test-nav.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nav Test</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
</head>
<body>
  <div style="height:200vh;padding-top:120px;color:white;padding-left:2rem;">
    Scroll down to test nav transition.
  </div>
  <script src="js/nav.js"></script>
</body>
</html>
```

Open in browser. Verify: navbar appears, scroll past 80px triggers `.nav--scrolled` background, mobile burger toggles at narrow width.

- [ ] **Step 4: Delete `test-nav.html`, commit**

```bash
rm test-nav.html
git add js/nav.js css/nav.css
git commit -m "feat: shared navbar with scroll and mobile toggle"
```

---

## Task 4: Shared Footer & i18n System

**Files:**
- Populate: `js/footer.js`
- Populate: `js/i18n.js`
- Populate: `locales/en.json`, `locales/ru.json`, `locales/uz.json`

- [ ] **Step 1: Write `locales/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "menu": "Menu",
    "story": "Our Story",
    "events": "Events",
    "tour": "3D Tour",
    "loyalty": "Coins",
    "contact": "Contact",
    "reserve": "Reserve a Table"
  },
  "footer": {
    "address": "Usta Olim Passage 5, Sebzar, Tashkent",
    "rights": "All rights reserved",
    "follow": "Follow us"
  },
  "home": {
    "hero_tag": "Discover The Legend Within",
    "hero_sub": "Eastern cuisine rooted in centuries of tradition",
    "hero_cta": "Reserve a Table",
    "story_heading": "The Legend",
    "story_text": "Khan Chapan is more than a restaurant — it is a living chronicle of Uzbek culinary heritage, where every dish carries the weight of history and the warmth of ancestral hands.",
    "story_cta": "Read Our Story",
    "dishes_heading": "Signature Dishes",
    "cta_heading": "Reserve Your Table Tonight",
    "cta_sub": "Experience the legend in person",
    "cta_btn": "Book Now"
  },
  "menu": {
    "heading": "Our Menu",
    "sub": "Every dish is a chapter in the legend",
    "loading": "Loading menu...",
    "error": "Unable to load menu. Please try again later.",
    "categories": {
      "starters": "Starters",
      "mains": "Mains",
      "soups": "Soups",
      "grills": "Grills",
      "drinks": "Drinks",
      "desserts": "Desserts"
    }
  },
  "story": {
    "heading": "Our Story",
    "sub": "A legend written in flavour"
  },
  "events": {
    "heading": "Events & Gallery",
    "upcoming_heading": "Upcoming Events",
    "gallery_heading": "Gallery",
    "no_upcoming": "No upcoming events at this time.",
    "book_event": "Book This Event",
    "private_heading": "Host a Private Event",
    "private_sub": "Bring the legend to your celebration",
    "form": {
      "name": "Your Name",
      "email": "Email Address",
      "date": "Preferred Date",
      "guests": "Number of Guests",
      "message": "Tell us about your event",
      "submit": "Send Inquiry",
      "success": "Thank you! We will be in touch shortly."
    }
  },
  "tour": {
    "heading": "3D Tour",
    "sub": "Explore Khan Chapan before you arrive"
  },
  "loyalty": {
    "heading": "Khan Coins",
    "sub": "Earn rewards with every visit"
  },
  "careers": {
    "heading": "Join the Legend",
    "sub": "We are always looking for passionate people",
    "form": {
      "name": "Your Name",
      "email": "Email Address",
      "position": "Position Applying For",
      "message": "Tell us about yourself",
      "cv": "Attach your CV",
      "submit": "Apply Now",
      "success": "Application received. We will contact you soon."
    }
  },
  "contact": {
    "heading": "Find Us",
    "hours_heading": "Opening Hours",
    "hours": {
      "weekdays": "Monday – Friday: 11:00 – 23:00",
      "weekends": "Saturday – Sunday: 10:00 – 00:00"
    },
    "social_heading": "Follow the Legend",
    "reserve_heading": "Reserve a Table"
  }
}
```

- [ ] **Step 2: Write `locales/ru.json`**

```json
{
  "nav": {
    "home": "Главная",
    "menu": "Меню",
    "story": "Наша история",
    "events": "Мероприятия",
    "tour": "3D Тур",
    "loyalty": "Монеты",
    "contact": "Контакты",
    "reserve": "Забронировать стол"
  },
  "footer": {
    "address": "Проход Уста Олим 5, Себзар, Ташкент",
    "rights": "Все права защищены",
    "follow": "Мы в соцсетях"
  },
  "home": {
    "hero_tag": "Discover The Legend Within",
    "hero_sub": "Восточная кухня, уходящая корнями в вековые традиции",
    "hero_cta": "Забронировать стол",
    "story_heading": "Легенда",
    "story_text": "Khan Chapan — это больше, чем ресторан. Это живая летопись узбекской кулинарной культуры, где каждое блюдо несёт в себе тяжесть истории и тепло предков.",
    "story_cta": "Наша история",
    "dishes_heading": "Фирменные блюда",
    "cta_heading": "Забронируйте столик этим вечером",
    "cta_sub": "Прикоснитесь к легенде лично",
    "cta_btn": "Забронировать"
  },
  "menu": {
    "heading": "Наше меню",
    "sub": "Каждое блюдо — глава в летописи",
    "loading": "Загрузка меню...",
    "error": "Не удалось загрузить меню. Попробуйте позже.",
    "categories": {
      "starters": "Закуски",
      "mains": "Основные блюда",
      "soups": "Супы",
      "grills": "Гриль",
      "drinks": "Напитки",
      "desserts": "Десерты"
    }
  },
  "story": {
    "heading": "Наша история",
    "sub": "Легенда, написанная вкусом"
  },
  "events": {
    "heading": "Мероприятия и галерея",
    "upcoming_heading": "Предстоящие мероприятия",
    "gallery_heading": "Галерея",
    "no_upcoming": "Предстоящих мероприятий пока нет.",
    "book_event": "Забронировать",
    "private_heading": "Частное мероприятие",
    "private_sub": "Принесите легенду на ваш праздник",
    "form": {
      "name": "Ваше имя",
      "email": "Электронная почта",
      "date": "Желаемая дата",
      "guests": "Количество гостей",
      "message": "Расскажите о вашем мероприятии",
      "submit": "Отправить заявку",
      "success": "Спасибо! Мы свяжемся с вами в ближайшее время."
    }
  },
  "tour": {
    "heading": "3D Тур",
    "sub": "Познакомьтесь с Khan Chapan до визита"
  },
  "loyalty": {
    "heading": "Khan Монеты",
    "sub": "Зарабатывайте бонусы с каждым визитом"
  },
  "careers": {
    "heading": "Присоединяйтесь к легенде",
    "sub": "Мы всегда ищем увлечённых людей",
    "form": {
      "name": "Ваше имя",
      "email": "Электронная почта",
      "position": "Желаемая должность",
      "message": "Расскажите о себе",
      "cv": "Прикрепите резюме",
      "submit": "Откликнуться",
      "success": "Заявка получена. Мы свяжемся с вами."
    }
  },
  "contact": {
    "heading": "Мы на карте",
    "hours_heading": "Часы работы",
    "hours": {
      "weekdays": "Пн – Пт: 11:00 – 23:00",
      "weekends": "Сб – Вс: 10:00 – 00:00"
    },
    "social_heading": "Следите за нами",
    "reserve_heading": "Забронировать стол"
  }
}
```

- [ ] **Step 3: Write `locales/uz.json`** (flag for native speaker review before launch)

```json
{
  "nav": {
    "home": "Bosh sahifa",
    "menu": "Menyu",
    "story": "Bizning hikoyamiz",
    "events": "Tadbirlar",
    "tour": "3D Tur",
    "loyalty": "Tanga",
    "contact": "Aloqa",
    "reserve": "Stol band qilish"
  },
  "footer": {
    "address": "Usta Olim yo'lagi 5, Sebzar, Toshkent",
    "rights": "Barcha huquqlar himoyalangan",
    "follow": "Bizni kuzating"
  },
  "home": {
    "hero_tag": "Discover The Legend Within",
    "hero_sub": "Asrlar davomida shakllangan sharq taomlari",
    "hero_cta": "Stol band qilish",
    "story_heading": "Afsona",
    "story_text": "Khan Chapan — bu oddiy restoran emas. Bu O'zbek oshxonasining tirik tarixi bo'lib, har bir taom tarix og'irligini va ajdodlar issiqligini o'zida mujassam etadi.",
    "story_cta": "Bizning hikoyamiz",
    "dishes_heading": "Maxsus taomlar",
    "cta_heading": "Bu kecha stolga band qiling",
    "cta_sub": "Afsonani shaxsan his eting",
    "cta_btn": "Band qilish"
  },
  "menu": {
    "heading": "Menyumiz",
    "sub": "Har bir taom — afsonadagi bob",
    "loading": "Menyu yuklanmoqda...",
    "error": "Menyuni yuklab bo'lmadi. Keyinroq urinib ko'ring.",
    "categories": {
      "starters": "Salatlar",
      "mains": "Asosiy taomlar",
      "soups": "Sho'rvalar",
      "grills": "Grill",
      "drinks": "Ichimliklar",
      "desserts": "Desertlar"
    }
  },
  "story": {
    "heading": "Bizning hikoyamiz",
    "sub": "Ta'm bilan yozilgan afsona"
  },
  "events": {
    "heading": "Tadbirlar va galereya",
    "upcoming_heading": "Yaqinlashayotgan tadbirlar",
    "gallery_heading": "Galereya",
    "no_upcoming": "Hozircha rejalashtirilgan tadbir yo'q.",
    "book_event": "Band qilish",
    "private_heading": "Shaxsiy tadbir",
    "private_sub": "Afsonani o'z bayramingizga olib keling",
    "form": {
      "name": "Ismingiz",
      "email": "Elektron pochta",
      "date": "Afzal ko'rgan sana",
      "guests": "Mehmonlar soni",
      "message": "Tadbiringiz haqida aytib bering",
      "submit": "Ariza yuborish",
      "success": "Rahmat! Tez orada siz bilan bog'lanamiz."
    }
  },
  "tour": {
    "heading": "3D Tur",
    "sub": "Kelishdan oldin Khan Chapan bilan tanishing"
  },
  "loyalty": {
    "heading": "Khan Tangalari",
    "sub": "Har bir tashrif bilan bonus to'plang"
  },
  "careers": {
    "heading": "Afsonaga qo'shiling",
    "sub": "Biz doim ishtiyoqli odamlarni izlaymiz",
    "form": {
      "name": "Ismingiz",
      "email": "Elektron pochta",
      "position": "Murojaat qilayotgan lavozim",
      "message": "O'zingiz haqingizda gapirib bering",
      "cv": "Rezyumeni biriktiring",
      "submit": "Murojaat qilish",
      "success": "Ariza qabul qilindi. Tez orada siz bilan bog'lanamiz."
    }
  },
  "contact": {
    "heading": "Bizni toping",
    "hours_heading": "Ish vaqti",
    "hours": {
      "weekdays": "Du – Ju: 11:00 – 23:00",
      "weekends": "Sh – Ya: 10:00 – 00:00"
    },
    "social_heading": "Bizni kuzating",
    "reserve_heading": "Stol band qilish"
  }
}
```

- [ ] **Step 4: Write `js/i18n.js`**

```js
const I18N = (() => {
  const SUPPORTED = ['uz', 'ru', 'en'];
  const DEFAULT   = 'ru';
  let current = localStorage.getItem('lang') || DEFAULT;
  let strings = {};

  async function load(lang) {
    const res = await fetch(`/locales/${lang}.json`);
    if (!res.ok) throw new Error(`Failed to load locale: ${lang}`);
    strings = await res.json();
    current = lang;
    localStorage.setItem('lang', lang);
    apply();
    updateSwitcher();
  }

  function get(key) {
    // dot-notation: "nav.home" → strings.nav.home
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
    // Wire lang switcher buttons (nav must be injected first)
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (btn && SUPPORTED.includes(btn.dataset.lang)) load(btn.dataset.lang);
    });
    load(current);
  }

  return { init, get, load, current: () => current };
})();
```

- [ ] **Step 5: Write `js/footer.js`**

```js
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
        <a href="https://instagram.com/khanchapan" target="_blank" rel="noopener">Instagram</a>
        <a href="https://facebook.com/khanchapan" target="_blank" rel="noopener">Facebook</a>
        <a href="https://tiktok.com/@khanchapan" target="_blank" rel="noopener">TikTok</a>
      </div>
    </div>
    <div class="footer__copy">
      <p>© Khan Chapan ${new Date().getFullYear()}. <span data-i18n="footer.rights"></span>.</p>
    </div>
  </div>
</footer>`;

  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
})();
```

Add footer styles to the bottom of `css/main.css`:

```css
/* ── Footer ───────────────────────────────────────── */
.footer {
  background: var(--surface);
  border-top: 1px solid rgba(201,160,85,0.2);
  padding: 4rem 0 2rem;
}
.footer__inner {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
.footer__tagline {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--gold);
  margin-top: 0.75rem;
  max-width: none;
}
.footer__socials {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.75rem;
}
.footer__socials a {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cream-dim);
  transition: color var(--transition);
}
.footer__socials a:hover { color: var(--gold); }
.footer__copy p {
  font-size: 0.75rem;
  color: var(--cream-dim);
  max-width: none;
}
@media (max-width: 700px) {
  .footer__inner { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: Create a test page and verify i18n switches language, all `data-i18n` elements update**

Create `test-i18n.html`:
```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i18n Test</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
</head>
<body>
  <p style="padding:100px 2rem;color:white;">
    Nav item: <strong data-i18n="nav.menu"></strong><br>
    Home CTA: <strong data-i18n="home.hero_cta"></strong>
  </p>
  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script>I18N.init();</script>
</body>
</html>
```

Open in browser. Click UZ / RU / EN buttons. Verify text updates and `localStorage` persists on refresh.

- [ ] **Step 7: Delete test file, commit**

```bash
rm test-i18n.html
git add js/i18n.js js/footer.js locales/
git commit -m "feat: i18n system and shared footer with trilingual locales"
```

---

## Task 5: CSS Components & Animations

**Files:**
- Populate: `css/components.css`
- Populate: `css/animations.css`
- Populate: `js/animations.js`

- [ ] **Step 1: Write `css/components.css`**

```css
/* ── Cards ────────────────────────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid rgba(201,160,85,0.15);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color var(--transition), transform var(--transition);
}
.card:hover {
  border-color: var(--gold-dim);
  transform: translateY(-4px);
}
.card__image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  display: block;
}
.card__body { padding: 1.5rem; }
.card__title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: var(--cream);
  margin-bottom: 0.5rem;
}
.card__desc {
  font-size: 0.9rem;
  color: var(--cream-dim);
  margin-bottom: 1rem;
}
.card__price {
  font-weight: 600;
  color: var(--gold);
  font-size: 1.1rem;
}

/* ── Grid ─────────────────────────────────────────── */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}
@media (max-width: 900px) { .grid-3 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .grid-3, .grid-2 { grid-template-columns: 1fr; } }

/* ── Section Heading ──────────────────────────────── */
.section-heading {
  text-align: center;
  margin-bottom: 4rem;
}
.section-heading h2 { color: var(--cream); }
.section-heading p {
  margin: 1rem auto 0;
  color: var(--cream-dim);
  font-style: italic;
  font-family: var(--font-display);
  font-size: 1.1rem;
}

/* ── Pull Quote ───────────────────────────────────── */
.pull-quote {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-style: italic;
  color: var(--gold);
  border-left: 3px solid var(--gold);
  padding: 1rem 2rem;
  margin: 3rem 0;
}

/* ── Tab Bar ──────────────────────────────────────── */
.tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(201,160,85,0.2);
  margin-bottom: 3rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.tab-btn {
  padding: 0.75rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream-dim);
  border-bottom: 2px solid transparent;
  transition: all var(--transition);
  white-space: nowrap;
}
.tab-btn:hover { color: var(--cream); }
.tab-btn.tab--active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

/* ── Forms ────────────────────────────────────────── */
.form { display: flex; flex-direction: column; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream-dim);
}
.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(201,160,85,0.25);
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: border-color var(--transition);
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--gold);
}
.form-group textarea { resize: vertical; min-height: 120px; }
.form-success {
  display: none;
  padding: 1rem;
  background: rgba(201,160,85,0.1);
  border: 1px solid var(--gold);
  border-radius: var(--radius);
  color: var(--gold);
  text-align: center;
}

/* ── Hero ─────────────────────────────────────────── */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
.hero__bg {
  position: absolute;
  inset: 0;
  background: var(--bg);
  z-index: 0;
}
.hero__bg video,
.hero__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.45;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(13,10,6,0.3) 0%, rgba(13,10,6,0.7) 100%);
  z-index: 1;
}
.hero__content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
}
.hero__tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 1.5rem;
  border: 1px solid rgba(201,160,85,0.4);
  padding: 0.4rem 1rem;
  border-radius: 2px;
}
.hero__title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 700;
  color: var(--cream);
  line-height: 1.05;
  margin-bottom: 1.5rem;
}
.hero__sub {
  font-size: 1.1rem;
  color: var(--cream-dim);
  font-style: italic;
  font-family: var(--font-display);
  margin-bottom: 2.5rem;
  max-width: 50ch;
  margin-left: auto;
  margin-right: auto;
}
```

- [ ] **Step 2: Write `css/animations.css`**

```css
/* ── Fade-in on scroll ────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }

/* ── Parallax wrapper ─────────────────────────────── */
.parallax-section {
  position: relative;
  overflow: hidden;
}
.parallax-bg {
  position: absolute;
  inset: -20%;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

/* ── Canvas particle overlay ──────────────────────── */
#particles-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
```

- [ ] **Step 3: Write `js/animations.js`**

```js
(function () {
  // Fade-in on scroll via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  // Observe all .reveal elements present now and added later
  function observeRevealElements() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Run on DOM ready and export for dynamic content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeRevealElements);
  } else {
    observeRevealElements();
  }

  // Re-observe after dynamic content injection
  window.animationsObserve = observeRevealElements;
})();
```

- [ ] **Step 4: Commit**

```bash
git add css/components.css css/animations.css js/animations.js
git commit -m "feat: CSS components, cards, forms, hero, animations"
```

---

## Task 6: Home Page

**Files:**
- Create: `index.html`

Note: The "Signature Dishes" section will show static placeholder cards until Task 13 wires Sanity. After Task 13, `js/featured.js` is added.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Khan Chapan — Eastern cuisine restaurant in Tashkent. Beshbarmak, grills, and Uzbek heritage.">
  <title>Khan Chapan | Discover The Legend Within</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>

  <!-- Navbar injected by nav.js -->

  <!-- ── HERO ───────────────────────────────────── -->
  <section class="hero texture-overlay" id="hero">
    <div class="hero__bg">
      <!-- Replace src with actual video or image -->
      <img src="images/hero-poster.jpg" alt="Khan Chapan restaurant interior">
    </div>
    <div class="hero__overlay"></div>
    <canvas id="particles-canvas"></canvas>
    <div class="hero__content">
      <div class="hero__tag">Tashkent, Uzbekistan</div>
      <h1 class="hero__title" data-i18n="home.hero_tag">Discover The Legend Within</h1>
      <p class="hero__sub" data-i18n="home.hero_sub"></p>
      <a href="contact.html#reserve" class="btn btn--gold" data-i18n="home.hero_cta"></a>
    </div>
    <div class="hero__scroll-hint">↓</div>
  </section>

  <!-- ── OUR LEGEND TEASER ───────────────────────── -->
  <section class="section texture-overlay">
    <div class="container">
      <div class="divider"><span class="divider-ornament">✦</span></div>
      <div class="story-teaser reveal">
        <h2 data-i18n="home.story_heading"></h2>
        <p data-i18n="home.story_text"></p>
        <a href="story.html" class="btn btn--outline" style="margin-top:2rem" data-i18n="home.story_cta"></a>
      </div>
      <div class="divider" style="margin-top:4rem"><span class="divider-ornament">✦</span></div>
    </div>
  </section>

  <!-- ── SIGNATURE DISHES ───────────────────────── -->
  <section class="section section--surface">
    <div class="container">
      <div class="section-heading reveal">
        <h2 data-i18n="home.dishes_heading"></h2>
      </div>
      <div class="grid-3" id="featured-dishes">
        <!-- Populated by js/featured.js after Task 13 -->
        <!-- Static fallback shown until then -->
      </div>
      <div style="text-align:center;margin-top:3rem" class="reveal">
        <a href="menu.html" class="btn btn--outline" data-i18n="nav.menu"></a>
      </div>
    </div>
  </section>

  <!-- ── CTA BANNER ─────────────────────────────── -->
  <section class="section section--crimson">
    <div class="container" style="text-align:center">
      <h2 class="reveal" data-i18n="home.cta_heading" style="color:var(--cream)"></h2>
      <p class="reveal reveal-delay-1" data-i18n="home.cta_sub" style="margin:1rem auto 2rem"></p>
      <a href="contact.html#reserve" class="btn btn--gold reveal reveal-delay-2" data-i18n="home.cta_btn"></a>
    </div>
  </section>

  <!-- Footer injected by footer.js -->

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/particles.js"></script>
  <script>I18N.init();</script>

  <style>
    .hero__scroll-hint {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      color: var(--gold);
      font-size: 1.5rem;
      animation: bounce 2s infinite;
      z-index: 2;
    }
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
    }
    .story-teaser { max-width: 700px; }
    .story-teaser h2 { margin-bottom: 1.5rem; }
  </style>
</body>
</html>
```

- [ ] **Step 2: Add a placeholder hero image**

Place any dark atmospheric image at `images/hero-poster.jpg` (temporary — replaced with restaurant photo). If no image is available yet, add this to `index.html` head to create a CSS gradient fallback:

```html
<style>
  .hero__bg { background: linear-gradient(135deg, #1a0a00 0%, #0d0a06 100%); }
  .hero__bg img { display: none; }
</style>
```

- [ ] **Step 3: Open `index.html` in browser. Verify:**
  - Navbar renders and transitions on scroll
  - Hero fills viewport with dark overlay
  - Language switcher updates all `data-i18n` elements
  - Footer renders at bottom
  - `.reveal` elements animate in on scroll

- [ ] **Step 4: Commit**

```bash
git add index.html images/
git commit -m "feat: home page — hero, teaser, CTA banner"
```

---

## Task 7: Our Story Page

**Files:**
- Create: `story.html`

- [ ] **Step 1: Write `story.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Story | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>

  <!-- ── PAGE HERO ──────────────────────────────── -->
  <section class="page-hero">
    <div class="page-hero__content container">
      <h1 class="reveal" data-i18n="story.heading"></h1>
      <p class="reveal reveal-delay-1" data-i18n="story.sub"></p>
    </div>
  </section>

  <!-- ── CHAPTER 1: ORIGINS ──────────────────────── -->
  <section class="section texture-overlay">
    <div class="container story-grid">
      <div class="story-text reveal">
        <h3>The Name</h3>
        <p>A Khan Chapan is the ceremonial robe gifted by a ruler to mark honour, respect, and belonging. To receive one is to be recognised. Khan Chapan, the restaurant, carries that same spirit: a place where every guest is received as an honoured guest of the Khan.</p>
        <div class="pull-quote">"Every table is a throne. Every meal, an offering."</div>
        <p>Founded in Tashkent, in the historic Sebzar district, Khan Chapan was built with one purpose: to preserve the ancient culinary traditions of Central Asia and bring them into the present without apology.</p>
      </div>
      <div class="story-image reveal reveal-delay-1">
        <img src="images/story-chapan.jpg" alt="Traditional chapan robe" class="card__image" style="border-radius:4px">
      </div>
    </div>
  </section>

  <!-- ── CHAPTER 2: CUISINE ──────────────────────── -->
  <section class="section section--surface texture-overlay">
    <div class="container story-grid story-grid--reverse">
      <div class="story-image reveal">
        <img src="images/story-beshbarmak.jpg" alt="Beshbarmak dish" class="card__image" style="border-radius:4px">
      </div>
      <div class="story-text reveal reveal-delay-1">
        <h3>The Cuisine</h3>
        <p>Beshbarmak — "five fingers" — is the centrepiece of Uzbek hospitality. It is not merely a dish; it is a ritual. Guests gather, hands replace cutlery, and the act of eating becomes communal, intimate, alive.</p>
        <p style="margin-top:1rem">Khan Chapan elevates these traditions without erasing them. Our chefs — many trained across generations of family kitchens — interpret the classics with reverence and precision.</p>
      </div>
    </div>
  </section>

  <!-- ── CHAPTER 3: TEAM ─────────────────────────── -->
  <section class="section">
    <div class="container" style="text-align:center;max-width:700px;margin:0 auto">
      <div class="divider reveal"><span class="divider-ornament">✦</span></div>
      <h2 class="reveal" style="margin:2rem 0 1rem">The People Behind the Legend</h2>
      <p class="reveal reveal-delay-1">Our team of over 80 people share one conviction: that food is memory made edible. Join us, and become part of the story.</p>
      <a href="careers.html" class="btn btn--outline reveal reveal-delay-2" style="margin-top:2rem" data-i18n="nav.careers">Careers</a>
    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script>I18N.init();</script>

  <style>
    .page-hero {
      min-height: 45vh;
      display: flex;
      align-items: flex-end;
      padding-bottom: 4rem;
      background: linear-gradient(to bottom, var(--bg) 0%, var(--surface) 100%);
      padding-top: 8rem;
    }
    .page-hero h1 { color: var(--gold); }
    .page-hero p  { font-family: var(--font-display); font-style: italic; margin-top: 1rem; }
    .story-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    .story-grid--reverse .story-image { order: -1; }
    @media (max-width: 700px) {
      .story-grid { grid-template-columns: 1fr; }
      .story-grid--reverse .story-image { order: 0; }
    }
    .story-text h3 { color: var(--gold); margin-bottom: 1rem; }
  </style>
</body>
</html>
```

- [ ] **Step 2: Verify page renders, i18n applies to heading, reveal animations fire on scroll.**

- [ ] **Step 3: Commit**

```bash
git add story.html
git commit -m "feat: our story page"
```

---

## Task 8: 3D Tour, Loyalty & Careers Pages

**Files:**
- Create: `tour.html`
- Create: `loyalty.html`
- Create: `careers.html`

- [ ] **Step 1: Write `tour.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Tour | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <section class="page-hero" style="min-height:35vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="tour.heading" style="color:var(--gold)"></h1>
      <p class="reveal reveal-delay-1" data-i18n="tour.sub"></p>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container" style="max-width:100%;padding:0">
      <!-- Replace the src with the actual Matterport / 3D tour embed URL -->
      <iframe
        src="REPLACE_WITH_3D_TOUR_URL"
        width="100%"
        height="600"
        frameborder="0"
        allowfullscreen
        allow="xr-spatial-tracking"
        style="display:block;border:none"
        title="Khan Chapan 3D Tour"
      ></iframe>
    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script>I18N.init();</script>
</body>
</html>
```

**Action:** Replace `REPLACE_WITH_3D_TOUR_URL` with the actual embed URL from the existing Khan Chapan 3D tour link.

- [ ] **Step 2: Write `loyalty.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khan Coins | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <section class="page-hero" style="min-height:40vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="loyalty.heading" style="color:var(--gold)"></h1>
      <p class="reveal reveal-delay-1" data-i18n="loyalty.sub"></p>
    </div>
  </section>

  <section class="section texture-overlay">
    <div class="container" style="max-width:800px;margin:0 auto">

      <div class="loyalty-steps">
        <div class="loyalty-step reveal">
          <div class="loyalty-step__number">01</div>
          <h3>Visit & Dine</h3>
          <p>Every visit to Khan Chapan earns you Khan Coins. The more you dine, the more you earn.</p>
        </div>
        <div class="loyalty-step reveal reveal-delay-1">
          <div class="loyalty-step__number">02</div>
          <h3>Accumulate Coins</h3>
          <p>Coins accumulate in your Telegram account automatically. Track your balance anytime.</p>
        </div>
        <div class="loyalty-step reveal reveal-delay-2">
          <div class="loyalty-step__number">03</div>
          <h3>Redeem Rewards</h3>
          <p>Use your coins for discounts, complimentary dishes, or exclusive experiences at Khan Chapan.</p>
        </div>
      </div>

      <div style="text-align:center;margin-top:4rem" class="reveal">
        <p style="margin-bottom:1.5rem;font-family:var(--font-display);font-style:italic;font-size:1.1rem">
          Manage your coins and check your balance via Telegram
        </p>
        <a href="https://t.me/khanchapan" target="_blank" class="btn btn--gold">Open Telegram</a>
      </div>
    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script>I18N.init();</script>

  <style>
    .loyalty-steps { display: flex; flex-direction: column; gap: 3rem; }
    .loyalty-step { display: flex; gap: 2rem; align-items: flex-start; }
    .loyalty-step__number {
      font-family: var(--font-display);
      font-size: 3rem;
      font-weight: 700;
      color: var(--gold);
      opacity: 0.4;
      line-height: 1;
      min-width: 3rem;
    }
    .loyalty-step h3 { color: var(--cream); margin-bottom: 0.5rem; }
  </style>
</body>
</html>
```

- [ ] **Step 3: Write `careers.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Careers | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <section class="page-hero" style="min-height:40vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="careers.heading" style="color:var(--gold)"></h1>
      <p class="reveal reveal-delay-1" data-i18n="careers.sub"></p>
    </div>
  </section>

  <section class="section texture-overlay">
    <div class="container" style="max-width:700px;margin:0 auto">

      <!-- Application form — Netlify Forms -->
      <form
        name="careers"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        class="form reveal"
        id="careers-form"
        enctype="multipart/form-data"
      >
        <input type="hidden" name="form-name" value="careers">
        <input type="hidden" name="bot-field" style="display:none">

        <div class="form-group">
          <label data-i18n="careers.form.name"></label>
          <input type="text" name="name" required data-i18n-placeholder="careers.form.name">
        </div>
        <div class="form-group">
          <label data-i18n="careers.form.email"></label>
          <input type="email" name="email" required data-i18n-placeholder="careers.form.email">
        </div>
        <div class="form-group">
          <label data-i18n="careers.form.position"></label>
          <input type="text" name="position" required data-i18n-placeholder="careers.form.position">
        </div>
        <div class="form-group">
          <label data-i18n="careers.form.cv"></label>
          <input type="file" name="cv" accept=".pdf,.doc,.docx" style="color:var(--cream-dim);padding:0.5rem 0">
        </div>
        <div class="form-group">
          <label data-i18n="careers.form.message"></label>
          <textarea name="message" rows="5" data-i18n-placeholder="careers.form.message"></textarea>
        </div>

        <button type="submit" class="btn btn--gold" data-i18n="careers.form.submit"></button>
      </form>

      <div class="form-success" id="careers-success">
        <p data-i18n="careers.form.success"></p>
      </div>
    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script>
    I18N.init();
    // Show success message if Netlify redirects back with ?success
    if (window.location.search.includes('success')) {
      document.getElementById('careers-form').style.display = 'none';
      document.getElementById('careers-success').style.display = 'block';
    }
  </script>
</body>
</html>
```

- [ ] **Step 4: Verify all three pages render and i18n works. On careers page verify form fields appear.**

- [ ] **Step 5: Commit**

```bash
git add tour.html loyalty.html careers.html
git commit -m "feat: 3D tour, loyalty, and careers pages"
```

---

## Task 9: Contact Page

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Write `contact.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <section class="page-hero" style="min-height:40vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="contact.heading" style="color:var(--gold)"></h1>
    </div>
  </section>

  <!-- Map -->
  <div style="width:100%;height:400px;background:var(--surface);display:flex;align-items:center;justify-content:center" class="reveal">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.1!2d69.23!3d41.31!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zKhan+Chapan!5e0!3m2!1sen!2suz!4v1!5m2!1sen!2suz"
      width="100%"
      height="400"
      style="border:none;filter:invert(90%) hue-rotate(180deg);display:block"
      allowfullscreen
      loading="lazy"
      title="Khan Chapan on Google Maps"
    ></iframe>
  </div>

  <!-- Info + Reserve -->
  <section class="section texture-overlay">
    <div class="container contact-grid">

      <!-- Hours -->
      <div class="reveal">
        <h3 data-i18n="contact.hours_heading" style="color:var(--gold);margin-bottom:1.5rem"></h3>
        <table class="hours-table">
          <tr><td data-i18n="contact.hours.weekdays"></td></tr>
          <tr><td data-i18n="contact.hours.weekends"></td></tr>
        </table>
        <div style="margin-top:2rem">
          <p>📍 <span data-i18n="footer.address"></span></p>
          <p style="margin-top:0.5rem">📞 <a href="tel:+998000000000" style="color:var(--gold)">+998 XX XXX XX XX</a></p>
        </div>
      </div>

      <!-- Socials -->
      <div class="reveal reveal-delay-1">
        <h3 data-i18n="contact.social_heading" style="color:var(--gold);margin-bottom:1.5rem"></h3>
        <div class="social-links">
          <a href="https://t.me/khanchapan" target="_blank" rel="noopener">Telegram</a>
          <a href="https://t.me/khanchapan_channel" target="_blank" rel="noopener">Telegram Channel</a>
          <a href="https://instagram.com/khanchapan" target="_blank" rel="noopener">Instagram</a>
          <a href="https://facebook.com/khanchapan" target="_blank" rel="noopener">Facebook</a>
          <a href="https://tiktok.com/@khanchapan" target="_blank" rel="noopener">TikTok</a>
          <a href="https://yandex.uz/maps/-/khanchapan" target="_blank" rel="noopener">Yandex Maps</a>
          <a href="https://tripadvisor.com/khanchapan" target="_blank" rel="noopener">TripAdvisor</a>
        </div>
      </div>

      <!-- Reserve -->
      <div class="reveal reveal-delay-2" id="reserve">
        <h3 data-i18n="contact.reserve_heading" style="color:var(--gold);margin-bottom:1.5rem"></h3>
        <!-- Link to existing booking system. Replace href with actual booking URL -->
        <a href="https://t.me/khanchapan" class="btn btn--gold" target="_blank" data-i18n="nav.reserve"></a>
      </div>

    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script>I18N.init();</script>

  <style>
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }
    @media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr; } }
    .hours-table td {
      padding: 0.4rem 0;
      color: var(--cream-dim);
      font-size: 0.95rem;
    }
    .social-links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .social-links a {
      color: var(--cream-dim);
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      transition: color var(--transition);
    }
    .social-links a:hover { color: var(--gold); }
  </style>
</body>
</html>
```

**Actions after writing:**
- Replace phone number placeholder with actual Khan Chapan phone
- Replace social media URLs with actual profile URLs
- Replace Google Maps embed with the correct embed URL for Usta Olim Passage 5, Sebzar, Tashkent
- Replace reservation link with actual booking system URL

- [ ] **Step 2: Verify map loads, hours display, social links visible.**

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "feat: contact page with map, hours, socials, reserve"
```

---

## Task 10: Sanity CMS Setup

**Files:**
- Create: `sanity/` project (via Sanity CLI)
- Create: `sanity/schemas/menuItem.js`
- Create: `sanity/schemas/event.js`
- Create: `sanity/schemas/index.js`
- Create: `sanity/sanity.config.js`

**Prerequisite:** Node.js 18+ installed.

- [ ] **Step 1: Install Sanity CLI and init project**

```bash
cd sanity
npm create sanity@latest -- --project-id NEW --dataset production --template clean --no-typescript
```

When prompted:
- Project name: `khan-chapan`
- Dataset: `production`
- Output path: `./sanity`

This creates `sanity/package.json`, `sanity/sanity.config.ts`, and `sanity/schemas/`.

After init, note your Project ID from the output (format: `abc12345`). You will need it in Step 6.

- [ ] **Step 2: Write `sanity/schemas/menuItem.js`**

```js
export default {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: R => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek', type: 'text', rows: 2 },
        { name: 'ru', title: 'Russian', type: 'text', rows: 2 },
        { name: 'en', title: 'English', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Starters',  value: 'starters'  },
          { title: 'Mains',     value: 'mains'      },
          { title: 'Soups',     value: 'soups'      },
          { title: 'Grills',    value: 'grills'     },
          { title: 'Drinks',    value: 'drinks'     },
          { title: 'Desserts',  value: 'desserts'   },
        ],
        layout: 'radio',
      },
      validation: R => R.required(),
    },
    {
      name: 'price',
      title: 'Price (UZS)',
      type: 'number',
      validation: R => R.required().min(0),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to hide this item from the menu without deleting it.',
    },
    {
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'order',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first within the category.',
    },
  ],
  preview: {
    select: { title: 'name.ru', subtitle: 'category', media: 'image' },
  },
};
```

- [ ] **Step 3: Write `sanity/schemas/event.js`**

```js
export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek', type: 'string' },
        { name: 'ru', title: 'Russian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: R => R.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'uz', title: 'Uzbek', type: 'text', rows: 3 },
        { name: 'ru', title: 'Russian', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: R => R.required(),
    },
    { name: 'startTime', title: 'Start Time (e.g. 19:00)', type: 'string' },
    { name: 'endTime',   title: 'End Time (e.g. 23:00)',   type: 'string' },
    {
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Regular',  value: 'regular'  },
          { title: 'Private',  value: 'private'  },
          { title: 'Special',  value: 'special'  },
        ],
      },
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Upcoming',   value: 'upcoming'   },
          { title: 'Past',       value: 'past'       },
          { title: 'Cancelled',  value: 'cancelled'  },
        ],
        layout: 'radio',
      },
      initialValue: 'upcoming',
      validation: R => R.required(),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'photos',
      title: 'Gallery Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Add after the event for the gallery.',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Pin to top of events page.',
    },
    {
      name: 'bookingLink',
      title: 'Booking Link (optional)',
      type: 'url',
    },
  ],
  preview: {
    select: { title: 'title.ru', subtitle: 'status', media: 'coverImage' },
  },
};
```

- [ ] **Step 4: Register schemas in `sanity/sanity.config.js`**

Open the auto-generated `sanity.config.js` (or `.ts`) and replace or update the schema import:

```js
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import menuItem from './schemas/menuItem';
import event from './schemas/event';

export default defineConfig({
  name: 'khan-chapan',
  title: 'Khan Chapan CMS',
  projectId: 'YOUR_PROJECT_ID',  // ← paste your actual project ID here
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: [menuItem, event] },
});
```

- [ ] **Step 5: Run the Sanity Studio locally and verify both schemas appear**

```bash
cd sanity
npm run dev
```

Open `http://localhost:3333`. Verify "Menu Item" and "Event" document types appear in the left sidebar.

- [ ] **Step 6: Add 2 test menu items and 1 test event via the Studio UI. Verify they save without errors.**

- [ ] **Step 7: Enable the Sanity CDN API for public reads**

In the Sanity Studio sidebar → API → CORS Origins → add `http://localhost` and your production domain (e.g. `https://khanchapan.uz`). Also set dataset to Public reads in Sanity project settings.

- [ ] **Step 8: Commit**

```bash
git add sanity/
git commit -m "feat: Sanity CMS with menuItem and event schemas"
```

---

## Task 11: Menu Page

**Files:**
- Create: `menu.html`
- Populate: `js/menu.js`

- [ ] **Step 1: Write `js/menu.js`**

Replace `YOUR_PROJECT_ID` with your actual Sanity project ID from Task 10.

```js
const MENU = (() => {
  const PROJECT_ID = 'YOUR_PROJECT_ID';
  const DATASET    = 'production';
  const API_VER    = 'v2021-06-07';

  function sanityUrl(query) {
    return `https://${PROJECT_ID}.api.sanity.io/${API_VER}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  }

  function imageUrl(ref) {
    if (!ref) return 'images/placeholder-dish.jpg';
    // ref format: image-{id}-{dimensions}-{ext}
    const withoutPrefix = ref.replace(/^image-/, '');
    const parts = withoutPrefix.split('-');
    const ext   = parts.pop();
    const dims  = parts.pop();
    const id    = parts.join('-');
    return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
  }

  function formatPrice(price) {
    return price.toLocaleString('uz-UZ') + ' UZS';
  }

  function renderCard(item, lang) {
    const name = item.name?.[lang] || item.name?.ru || '';
    const desc = item.description?.[lang] || item.description?.ru || '';
    const imgSrc = imageUrl(item.image?.asset?._ref);
    return `
      <div class="card reveal">
        <img class="card__image" src="${imgSrc}" alt="${name}" loading="lazy">
        <div class="card__body">
          <h4 class="card__title">${name}</h4>
          <p class="card__desc">${desc}</p>
          <span class="card__price">${formatPrice(item.price)}</span>
        </div>
      </div>`;
  }

  async function init() {
    const lang = localStorage.getItem('lang') || 'ru';
    const query = `*[_type == "menuItem" && available == true]{
      name, description, category, price, "image": image{asset->{_ref}}, featured, order
    }|order(order asc)`;

    const grid = document.getElementById('menu-grid');
    const loading = document.getElementById('menu-loading');
    const error   = document.getElementById('menu-error');

    try {
      const res  = await fetch(sanityUrl(query));
      if (!res.ok) throw new Error('Fetch failed');
      const { result } = await res.json();

      loading.style.display = 'none';

      // Group by category
      const categories = ['starters','mains','soups','grills','drinks','desserts'];
      const grouped = {};
      categories.forEach(c => { grouped[c] = []; });
      result.forEach(item => { if (grouped[item.category]) grouped[item.category].push(item); });

      // Render active tab content
      function renderTab(cat) {
        grid.innerHTML = grouped[cat].map(item => renderCard(item, lang)).join('');
        if (window.animationsObserve) window.animationsObserve();
        // Highlight active tab
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('tab--active', b.dataset.cat === cat);
        });
      }

      // Wire tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => renderTab(btn.dataset.cat));
      });

      // Show first non-empty category
      const firstCat = categories.find(c => grouped[c].length > 0) || 'starters';
      renderTab(firstCat);

    } catch (e) {
      loading.style.display = 'none';
      error.style.display   = 'block';
      console.error('Menu fetch error:', e);
    }
  }

  return { init, imageUrl };
})();
```

- [ ] **Step 2: Write `menu.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Menu | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>

  <section class="page-hero" style="min-height:40vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="menu.heading" style="color:var(--gold)"></h1>
      <p class="reveal reveal-delay-1" data-i18n="menu.sub" style="font-family:var(--font-display);font-style:italic"></p>
    </div>
  </section>

  <section class="section">
    <div class="container">

      <!-- Category tabs -->
      <div class="tabs" id="menu-tabs">
        <button class="tab-btn" data-cat="starters"  data-i18n="menu.categories.starters"></button>
        <button class="tab-btn" data-cat="mains"     data-i18n="menu.categories.mains"></button>
        <button class="tab-btn" data-cat="soups"     data-i18n="menu.categories.soups"></button>
        <button class="tab-btn" data-cat="grills"    data-i18n="menu.categories.grills"></button>
        <button class="tab-btn" data-cat="drinks"    data-i18n="menu.categories.drinks"></button>
        <button class="tab-btn" data-cat="desserts"  data-i18n="menu.categories.desserts"></button>
      </div>

      <!-- State indicators -->
      <p id="menu-loading" style="color:var(--cream-dim);text-align:center" data-i18n="menu.loading"></p>
      <p id="menu-error"   style="display:none;color:var(--crimson);text-align:center" data-i18n="menu.error"></p>

      <!-- Dish grid populated by menu.js -->
      <div class="grid-3" id="menu-grid"></div>

    </div>
  </section>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/menu.js"></script>
  <script>
    I18N.init();
    MENU.init();
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify menu page — open in browser, dishes load from Sanity, category tabs switch content, language switcher updates dish names/descriptions**

Open browser DevTools Network tab. Confirm the Sanity CDN API request returns 200 with dish data.

- [ ] **Step 4: Commit**

```bash
git add menu.html js/menu.js
git commit -m "feat: menu page with Sanity CDN fetch and category tabs"
```

---

## Task 12: Events Page

**Files:**
- Create: `events.html`
- Populate: `js/events.js`

- [ ] **Step 1: Write `js/events.js`**

```js
const EVENTS = (() => {
  const PROJECT_ID = 'YOUR_PROJECT_ID'; // same as menu.js
  const DATASET    = 'production';
  const API_VER    = 'v2021-06-07';

  function sanityUrl(query) {
    return `https://${PROJECT_ID}.api.sanity.io/${API_VER}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  }

  function imageUrl(ref) {
    if (!ref) return '';
    const withoutPrefix = ref.replace(/^image-/, '');
    const parts = withoutPrefix.split('-');
    const ext   = parts.pop();
    const dims  = parts.pop();
    const id    = parts.join('-');
    return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
  }

  function formatDate(dateStr, lang) {
    const date = new Date(dateStr);
    const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-GB';
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function renderUpcoming(event, lang) {
    const title = event.title?.[lang] || event.title?.ru || '';
    const desc  = event.description?.[lang] || event.description?.ru || '';
    const cover = imageUrl(event.coverImage?.asset?._ref);
    const bookingLabel = I18N.get('events.book_event');
    return `
      <div class="card reveal">
        ${cover ? `<img class="card__image" src="${cover}" alt="${title}" loading="lazy">` : ''}
        <div class="card__body">
          <p style="font-size:0.8rem;color:var(--gold);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem">
            ${formatDate(event.date, lang)} ${event.startTime ? '· ' + event.startTime : ''}
          </p>
          <h4 class="card__title">${title}</h4>
          <p class="card__desc">${desc}</p>
          ${event.bookingLink ? `<a href="${event.bookingLink}" target="_blank" class="btn btn--outline" style="margin-top:1rem">${bookingLabel}</a>` : ''}
        </div>
      </div>`;
  }

  function renderGalleryItem(event, lang) {
    const title  = event.title?.[lang] || event.title?.ru || '';
    const cover  = imageUrl(event.coverImage?.asset?._ref);
    const photos = (event.photos || []).map(p => imageUrl(p.asset?._ref)).filter(Boolean);
    return `
      <div class="gallery-item reveal" data-photos='${JSON.stringify(photos)}' onclick="EVENTS.openLightbox(this)">
        ${cover ? `<img src="${cover}" alt="${title}" loading="lazy">` : ''}
        <div class="gallery-item__overlay"><span>${title}</span></div>
      </div>`;
  }

  async function init() {
    const lang = localStorage.getItem('lang') || 'ru';
    const query = `*[_type == "event" && status != "cancelled"]{
      title, description, date, startTime, endTime, type, status,
      "coverImage": coverImage{asset->{_ref}},
      "photos": photos[]{asset->{_ref}},
      featured, bookingLink
    }|order(featured desc, date asc)`;

    try {
      const res = await fetch(sanityUrl(query));
      if (!res.ok) throw new Error('Fetch failed');
      const { result } = await res.json();

      const upcoming = result.filter(e => e.status === 'upcoming');
      const past     = result.filter(e => e.status === 'past');

      // Upcoming events
      const upcomingGrid = document.getElementById('upcoming-grid');
      const noUpcoming   = document.getElementById('no-upcoming');
      if (upcoming.length === 0) {
        noUpcoming.style.display = 'block';
      } else {
        upcomingGrid.innerHTML = upcoming.map(e => renderUpcoming(e, lang)).join('');
      }

      // Gallery (past events)
      const gallery = document.getElementById('gallery-grid');
      gallery.innerHTML = past.map(e => renderGalleryItem(e, lang)).join('');

      if (window.animationsObserve) window.animationsObserve();
    } catch (e) {
      console.error('Events fetch error:', e);
    }
  }

  function openLightbox(el) {
    const photos = JSON.parse(el.dataset.photos || '[]');
    if (!photos.length) return;
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    let idx = 0;
    img.src = photos[0];
    lb.style.display = 'flex';
    lb.dataset.photos = JSON.stringify(photos);
    lb.dataset.idx    = '0';
  }

  return { init, openLightbox };
})();
```

- [ ] **Step 2: Write `events.html`**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Events | Khan Chapan</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/nav.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>

  <section class="page-hero" style="min-height:40vh;padding-top:8rem;padding-bottom:3rem;background:var(--bg)">
    <div class="container">
      <h1 class="reveal" data-i18n="events.heading" style="color:var(--gold)"></h1>
    </div>
  </section>

  <!-- Upcoming Events -->
  <section class="section">
    <div class="container">
      <div class="section-heading reveal">
        <h2 data-i18n="events.upcoming_heading"></h2>
      </div>
      <p id="no-upcoming" style="display:none;color:var(--cream-dim);text-align:center" data-i18n="events.no_upcoming"></p>
      <div class="grid-3" id="upcoming-grid"></div>
    </div>
  </section>

  <!-- Gallery -->
  <section class="section section--surface">
    <div class="container">
      <div class="section-heading reveal">
        <h2 data-i18n="events.gallery_heading"></h2>
      </div>
      <div class="gallery-grid" id="gallery-grid"></div>
    </div>
  </section>

  <!-- Private Event Inquiry -->
  <section class="section texture-overlay">
    <div class="container" style="max-width:700px;margin:0 auto">
      <div class="section-heading reveal">
        <h2 data-i18n="events.private_heading"></h2>
        <p data-i18n="events.private_sub"></p>
      </div>
      <form
        name="private-event"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        class="form reveal"
        id="event-form"
      >
        <input type="hidden" name="form-name" value="private-event">
        <input type="hidden" name="bot-field" style="display:none">
        <div class="form-group">
          <label data-i18n="events.form.name"></label>
          <input type="text" name="name" required data-i18n-placeholder="events.form.name">
        </div>
        <div class="form-group">
          <label data-i18n="events.form.email"></label>
          <input type="email" name="email" required data-i18n-placeholder="events.form.email">
        </div>
        <div class="form-group">
          <label data-i18n="events.form.date"></label>
          <input type="date" name="date" required>
        </div>
        <div class="form-group">
          <label data-i18n="events.form.guests"></label>
          <input type="number" name="guests" min="1" max="500" required>
        </div>
        <div class="form-group">
          <label data-i18n="events.form.message"></label>
          <textarea name="message" rows="4" data-i18n-placeholder="events.form.message"></textarea>
        </div>
        <button type="submit" class="btn btn--gold" data-i18n="events.form.submit"></button>
      </form>
      <div class="form-success" id="event-success">
        <p data-i18n="events.form.success"></p>
      </div>
    </div>
  </section>

  <!-- Simple lightbox -->
  <div id="lightbox" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:2000;align-items:center;justify-content:center;flex-direction:column">
    <button onclick="document.getElementById('lightbox').style.display='none'"
      style="position:absolute;top:1.5rem;right:2rem;color:var(--cream);font-size:2rem;background:none;border:none;cursor:pointer">✕</button>
    <img id="lightbox-img" src="" alt="" style="max-height:85vh;max-width:90vw;object-fit:contain;border-radius:4px">
  </div>

  <script src="js/nav.js"></script>
  <script src="js/footer.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/events.js"></script>
  <script>
    I18N.init();
    EVENTS.init();
    if (window.location.search.includes('success')) {
      document.getElementById('event-form').style.display = 'none';
      document.getElementById('event-success').style.display = 'block';
    }
  </script>

  <style>
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    @media (max-width: 700px) { .gallery-grid { grid-template-columns: 1fr 1fr; } }
    .gallery-item {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: var(--radius);
      cursor: pointer;
    }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .gallery-item:hover img { transform: scale(1.05); }
    .gallery-item__overlay {
      position: absolute;
      inset: 0;
      background: rgba(13,10,6,0.6);
      display: flex;
      align-items: flex-end;
      padding: 1rem;
      opacity: 0;
      transition: opacity var(--transition);
    }
    .gallery-item:hover .gallery-item__overlay { opacity: 1; }
    .gallery-item__overlay span {
      color: var(--cream);
      font-family: var(--font-display);
      font-size: 1.1rem;
    }
  </style>
</body>
</html>
```

- [ ] **Step 3: Add a test event in Sanity Studio with status "upcoming" and one with status "past" (with photos). Verify they appear in the correct sections.**

- [ ] **Step 4: Submit the private event inquiry form. Verify Netlify receives the submission (check Netlify dashboard → Forms).**

- [ ] **Step 5: Commit**

```bash
git add events.html js/events.js
git commit -m "feat: events page with Sanity fetch, gallery, lightbox, and inquiry form"
```

---

## Task 13: Homepage Featured Dishes

**Files:**
- Create: `js/featured.js`
- Modify: `index.html` (add `<script src="js/featured.js">`)

- [ ] **Step 1: Write `js/featured.js`**

```js
(async function () {
  const PROJECT_ID = 'YOUR_PROJECT_ID';
  const DATASET    = 'production';
  const lang       = localStorage.getItem('lang') || 'ru';

  function imageUrl(ref) {
    if (!ref) return 'images/placeholder-dish.jpg';
    const withoutPrefix = ref.replace(/^image-/, '');
    const parts = withoutPrefix.split('-');
    const ext   = parts.pop();
    const dims  = parts.pop();
    const id    = parts.join('-');
    return `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${ext}`;
  }

  const query = `*[_type == "menuItem" && available == true && featured == true][0...3]{
    name, description, price, "image": image{asset->{_ref}}
  }`;
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/${DATASET}?query=${encodeURIComponent(query)}`;

  try {
    const res    = await fetch(url);
    const { result } = await res.json();
    const grid   = document.getElementById('featured-dishes');
    if (!grid || !result.length) return;

    grid.innerHTML = result.map(item => {
      const name = item.name?.[lang] || item.name?.ru || '';
      const desc = item.description?.[lang] || item.description?.ru || '';
      const src  = imageUrl(item.image?.asset?._ref);
      return `
        <div class="card reveal">
          <img class="card__image" src="${src}" alt="${name}" loading="lazy">
          <div class="card__body">
            <h4 class="card__title">${name}</h4>
            <p class="card__desc">${desc}</p>
            <span class="card__price">${item.price?.toLocaleString('uz-UZ')} UZS</span>
          </div>
        </div>`;
    }).join('');

    if (window.animationsObserve) window.animationsObserve();
  } catch (e) {
    console.error('Featured dishes error:', e);
  }
})();
```

- [ ] **Step 2: Add `<script src="js/featured.js"></script>` to `index.html` before the closing `</body>`, after the other scripts**

- [ ] **Step 3: In Sanity Studio, mark 3 menu items as `featured: true`. Reload the home page and verify they appear in the Signature Dishes section.**

- [ ] **Step 4: Commit**

```bash
git add js/featured.js index.html
git commit -m "feat: homepage signature dishes from Sanity"
```

---

## Task 14: Hero Particle Effect

**Files:**
- Populate: `js/particles.js`

- [ ] **Step 1: Write `js/particles.js`**

```js
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Respect reduced motion preference
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
      x:     randomBetween(0, W),
      y:     H + 10,
      size:  randomBetween(1, 3),
      speedY: randomBetween(0.4, 1.2),
      speedX: randomBetween(-0.3, 0.3),
      opacity: randomBetween(0.3, 0.9),
      life:   0,
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
      const alpha    = p.opacity * Math.sin(progress * Math.PI); // fade in + out

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
    // Seed initial particles spread across the canvas
    for (let i = 0; i < 60; i++) {
      const p = createParticle();
      p.y    = randomBetween(0, H); // start spread, not all at bottom
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
```

- [ ] **Step 2: Open `index.html` in browser. Verify gold ember particles rise over the hero. Verify they are absent when `prefers-reduced-motion: reduce` is set in the OS/browser.**

To test reduced motion: Chrome DevTools → Rendering panel → Enable "Emulate CSS media feature prefers-reduced-motion: reduce".

- [ ] **Step 3: Commit**

```bash
git add js/particles.js
git commit -m "feat: gold ember particle effect on hero"
```

---

## Task 15: Final Polish & Netlify Deploy

**Files:**
- Modify: `netlify.toml`
- Create: `images/logo-gold.svg` (placeholder or final)

- [ ] **Step 1: Add a placeholder logo SVG if not yet provided**

```svg
<!-- Save as images/logo-gold.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50">
  <text x="0" y="38" font-family="Georgia, serif" font-size="32" fill="#C9A055">Khan Chapan</text>
</svg>
```

Replace with the real logo SVG from the restaurant's brand assets.

- [ ] **Step 2: Update `netlify.toml` with form settings**

```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Cache-Control = "public, max-age=3600"

[[headers]]
  for = "/locales/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"
```

- [ ] **Step 3: Verify all 8 pages open without console errors**

Open each page, check DevTools Console (zero errors):
- `index.html` ✓
- `menu.html` ✓
- `story.html` ✓
- `events.html` ✓
- `tour.html` ✓
- `loyalty.html` ✓
- `careers.html` ✓
- `contact.html` ✓

- [ ] **Step 4: Verify language switching on every page**

On each page, switch between UZ → RU → EN. All `data-i18n` elements must update. Refresh page — language selection must persist.

- [ ] **Step 5: Deploy to Netlify**

Option A — drag and drop: Go to `app.netlify.com`, drag the project folder into the deploy zone.

Option B — CLI:
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

- [ ] **Step 6: After deploy, verify Netlify Forms are detected**

In Netlify dashboard → Forms — both "careers" and "private-event" forms should appear after the first deploy (Netlify detects them at build time).

- [ ] **Step 7: Add your production domain to Sanity CORS origins**

Sanity dashboard → project → API → CORS Origins → Add `https://your-production-domain.uz`.

- [ ] **Step 8: Final commit and tag**

```bash
git add .
git commit -m "feat: final polish, netlify config, deploy-ready"
git tag v1.0.0
```

---

## Actions Required from Restaurant Team Before Launch

1. **Replace placeholder phone** in `contact.html` with actual number
2. **Replace social URLs** in `contact.html` and `footer.js` with actual profile links
3. **Replace 3D tour URL** in `tour.html` with actual Matterport embed
4. **Replace Google Maps embed** in `contact.html` with the correct embed for Usta Olim Passage 5
5. **Replace hero image/video** `images/hero-poster.jpg` with actual restaurant photography
6. **Replace logo SVG** with actual brand logo
7. **Replace reservation link** in `contact.html` with actual booking system URL
8. **Have Uzbek translations reviewed** by a native Uzbek speaker before launch
9. **Populate Sanity** with full menu and event data
10. **Mark 3 menu items** as `featured: true` in Sanity for the homepage strip
