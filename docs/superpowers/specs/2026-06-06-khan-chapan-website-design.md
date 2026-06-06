# Khan Chapan Restaurant Website — Design Spec
**Date:** 2026-06-06  
**Status:** Approved  

---

## 1. Project Overview

Rebuild the Khan Chapan restaurant website from a Taplink link-aggregator page into a full immersive brand experience. The primary goal is emotional: visitors should feel the "legend" of Khan Chapan before they do anything else. Reservations, menu browsing, and all other actions are secondary to brand immersion.

**Restaurant:** Khan Chapan, Usta Olim Passage 5, Sebzar, Tashkent, Uzbekistan  
**Cuisine:** Eastern / Uzbek (signature: beshbarmak)  
**Brand tagline:** "Discover The Legend Within"

---

## 2. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Plain HTML / CSS / JS | No build tools, full creative control, fast, easy to host |
| CMS | Sanity (free Starter tier) | Excellent admin UI, multilingual content, image management, runtime API |
| Hosting | Netlify (free tier) | Drag-and-drop deploy, free SSL, custom domain, built-in Forms |
| Forms | Netlify Forms | No backend needed for event booking and career applications |

---

## 3. Languages

The site supports three languages: **Uzbek (UZ)**, **Russian (RU)**, and **English (EN)**.

- Language is toggled via a switcher in the navbar (UZ / RU / EN)
- Selection is persisted in `localStorage` and applied on every page load
- Static text is stored in `/locales/uz.json`, `/locales/ru.json`, `/locales/en.json`
- Dynamic CMS content (menu, events) stores `uz`, `ru`, `en` fields per document and the frontend reads the active language field

---

## 4. Architecture & Folder Structure

Multi-page site — one `.html` file per page. No single-page-app framework.

```
/khan-chapan/
  index.html          — Home
  menu.html           — Menu
  story.html          — Our Story
  events.html         — Events & Gallery
  tour.html           — 3D Tour
  loyalty.html        — Loyalty / Coins
  careers.html        — Careers
  contact.html        — Contact

  /css/
    main.css          — Global styles, design tokens, typography
    animations.css    — Parallax, fade-ins, transitions

  /js/
    nav.js            — Shared navbar (injected into each page)
    footer.js         — Shared footer (injected into each page)
    i18n.js           — Language switching logic
    menu.js           — Sanity API fetch + render for menu page
    animations.js     — IntersectionObserver fade-ins, parallax
    events.js         — Sanity API fetch + render for events page

  /locales/
    uz.json
    ru.json
    en.json

  /images/
    (static assets — logo, backgrounds, decorative elements)

  /docs/
    /superpowers/specs/
      2026-06-06-khan-chapan-website-design.md
```

Shared `nav.js` and `footer.js` are injected via JS so navigation and footer are maintained in one place across all pages.

---

## 5. Visual Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0D0A06` | Page background (warm black) |
| `--gold` | `#C9A055` | Primary accent, headings, dividers, CTAs |
| `--crimson` | `#7A1A1A` | Secondary accent, hover states, CTA banners |
| `--cream` | `#F2E6C8` | Body text, secondary text |
| `--surface` | `#1A1510` | Cards, nav background on scroll |

A subtle dark fabric / aged parchment texture is applied at low opacity over the background on key sections.

### Typography

- **Display / Headings:** Cormorant Garamond (Google Fonts) — elegant, historical serif. Used for all `h1`–`h3` and pull-quotes.
- **Body / UI:** Inter (Google Fonts) — clean, readable, multilingual-friendly. Used for body text, nav links, labels, prices.

### Key Visual Patterns

- **Hero:** Full-screen cinematic video or high-res image (restaurant interior, fire, hands serving food). "Discover The Legend Within" centered in gold Cormorant Garamond over a dark overlay.
- **Section dividers:** Thin gold horizontal rules with optional ornamental center mark.
- **Photography style:** Dish photos on dark backgrounds — styled like artifacts, not fast-food shots.
- **Parallax:** Subtle parallax scroll on hero and Our Story page images.
- **Animations:** Fade-in + slight upward slide as sections enter viewport. Implemented with CSS transitions + IntersectionObserver (no animation libraries).
- **Ember effect:** Optional lightweight canvas particle animation on the hero (gold embers rising). Can be disabled on low-performance devices via `prefers-reduced-motion`.

### Navigation

- Fixed top navbar: transparent over hero, transitions to solid `--surface` on scroll
- Layout: Logo (left) | Nav links (center) | Language switcher + "Reserve" CTA button (right)
- Mobile: hamburger icon → full-screen dark overlay menu with large centered links
- Active page link is highlighted in gold

---

## 6. Pages

### 6.1 Home (`index.html`)
- Full-screen hero (video / cinematic image) with tagline and "Reserve a Table" CTA
- "The Legend" teaser — 2–3 sentence brand narrative, links to Our Story
- "Signature Dishes" strip — 3 featured dishes pulled from Sanity (marked `featured: true`)
- Full-width crimson CTA banner: "Reserve Your Table Tonight" with booking link

### 6.2 Menu (`menu.html`)
- Category tab bar: Starters / Mains / Soups / Grills / Drinks / Desserts
- Dishes fetched from Sanity at page load in the active language
- Each dish: photo, name, description, price in UZS
- Tab switching is instant (no page reload) — content is filtered client-side after single fetch
- `available: false` dishes are excluded from the response query

### 6.3 Our Story (`story.html`)
- Long-scroll narrative: history of Khan Chapan, meaning of the name, Uzbek culinary heritage, chef spotlight
- Heavy use of parallax imagery, full-bleed section backgrounds, pull-quotes in gold Cormorant
- Static content (no CMS) — updated by editing HTML

### 6.4 Events & Gallery (`events.html`)
- **Upcoming events:** Cards for events with `status: upcoming`, showing title, date, description, cover image, booking link
- **Past events / Gallery:** Masonry photo grid of events with `status: past`, showing cover + photo gallery on click/expand
- **Private Event Inquiry form:** Name, email, date, guest count, message — submitted via Netlify Forms to restaurant email
- Content fetched from Sanity at page load

### 6.5 3D Tour (`tour.html`)
- Single-focus page: Matterport (or equivalent) iframe embedded full-width
- Brief intro text above the embed
- Static page, no CMS

### 6.6 Loyalty / Coins (`loyalty.html`)
- Explains the rewards program: how to earn coins, how to redeem, tiers (if any)
- Links out to Telegram bot for account management
- Static content for v1 — no login portal

### 6.7 Careers (`careers.html`)
- Lists open positions (static HTML for v1, or optionally a `jobPosting` Sanity type added post-launch)
- Application form: name, email, position, CV upload, message — submitted via Netlify Forms

### 6.8 Contact (`contact.html`)
- Embedded Google Map centered on Usta Olim Passage 5, Sebzar, Tashkent
- Opening hours table
- Address, phone number, all social links (Telegram, Instagram, Facebook, TikTok, Yandex, TripAdvisor)
- Reservation widget (link to existing booking system)

---

## 7. Sanity CMS Schema

### 7.1 `menuItem`

| Field | Type | Notes |
|---|---|---|
| `name` | object `{uz, ru, en}` | Dish name in all three languages |
| `description` | object `{uz, ru, en}` | Dish description in all three languages |
| `category` | string (enum) | starters / mains / soups / grills / drinks / desserts |
| `price` | number | Price in UZS |
| `currency` | string | Default "UZS" |
| `image` | image | Sanity image asset with alt text |
| `available` | boolean | Toggle to hide without deleting |
| `featured` | boolean | Pin to homepage Signature Dishes strip |
| `order` | number | Sort order within category |

### 7.2 `event`

| Field | Type | Notes |
|---|---|---|
| `title` | object `{uz, ru, en}` | Event title |
| `description` | object `{uz, ru, en}` | What the event is about |
| `date` | date | Event date |
| `startTime` | string | e.g. "19:00" |
| `endTime` | string | e.g. "23:00" |
| `type` | string (enum) | regular / private / special |
| `status` | string (enum) | upcoming / past / cancelled |
| `coverImage` | image | Hero image shown in listings |
| `photos` | array of images | Added after event, populates gallery |
| `featured` | boolean | Pin to top of events page |
| `bookingLink` | url | Optional — Telegram link or external booking |

Status drives behavior automatically: `upcoming` events appear as announcements; `past` events appear in the gallery with their photos.

---

## 8. Forms

Both forms use **Netlify Forms** (no backend server required):

- **Private Event Inquiry** (`events.html`): name, email, date, guest count, message
- **Career Application** (`careers.html`): name, email, position, CV file upload, message

Netlify sends form submissions to the restaurant's email address configured in the Netlify dashboard.

---

## 9. Out of Scope (v1)

- Online ordering / payment integration
- Loyalty portal with user login and coin balance
- CMS-managed career listings (static HTML for v1)
- CMS-managed Our Story / Loyalty pages (static HTML for v1)
- Blog or news section

---

## 10. Success Criteria

- Site loads in under 3 seconds on a mid-range mobile connection
- All 8 pages render correctly in Uzbek, Russian, and English
- Menu updates in Sanity are reflected on the site without any code changes
- Events flow correctly: upcoming → gallery after status change
- Netlify Forms submissions deliver to restaurant email
- Site passes basic accessibility checks (contrast ratios, alt text, keyboard nav)
