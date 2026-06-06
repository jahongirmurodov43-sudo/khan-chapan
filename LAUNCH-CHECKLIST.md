# Khan Chapan Website — Pre-Launch Checklist

## Images (replace placeholders)
- [ ] `images/hero-poster.jpg` — Hero background image (dark, atmospheric, restaurant interior)
- [ ] `images/story-chapan.jpg` — Photo of a traditional chapan robe
- [ ] `images/story-beshbarmak.jpg` — Photo of the beshbarmak dish
- [ ] `images/texture.png` — Dark fabric texture overlay (subtle, used at 4% opacity)
- [ ] `images/logo-gold.svg` — Replace placeholder with actual brand logo
- [ ] `images/menu/` — Add dish photos named to match the `image` fields in `data/menu.json`
- [ ] `images/events/` — Add event cover photos named to match `coverImage` in `data/events.json`

## Menu & Events (no account needed — just edit files)
- [ ] Open `data/menu.json` and update/add all dishes with correct names, descriptions, prices
- [ ] Set `"featured": true` on exactly 3 dishes for the homepage strip
- [ ] Open `data/events.json` and add upcoming events
- [ ] After an event, update its `status` to `"past"` and add photo paths to the `photos` array

## Contact Details
- [ ] `contact.html` — Replace `+998 XX XXX XX XX` with real phone number
- [ ] `contact.html` — Replace Google Maps embed URL with correct embed for Usta Olim Passage 5, Sebzar, Tashkent
- [ ] `contact.html` and `js/footer.js` — Replace all social media URLs with actual profile links
- [ ] `contact.html#reserve` — Replace Telegram link with actual booking system URL

## 3D Tour
- [ ] `tour.html` — Replace `REPLACE_WITH_3D_TOUR_URL` with actual embed URL

## Translations
- [ ] Have `locales/uz.json` reviewed by a native Uzbek speaker before launch

## Netlify Deploy
- [ ] Go to https://app.netlify.com → "Add new site" → "Deploy manually"
- [ ] Drag and drop the project folder (everything except the `sanity/` folder)
- [ ] Add your custom domain in Netlify → Domain Management
- [ ] Verify both forms appear in Netlify → Forms after first deploy:
  - `careers`
  - `private-event`
- [ ] Configure form notification email in Netlify → Forms → Notifications

## Final Browser Check
- [ ] index.html — hero loads, particles animate, 3 featured dishes show
- [ ] menu.html — dishes load, tab switching works, language switcher updates text
- [ ] story.html — images show, layout correct on mobile
- [ ] events.html — upcoming events show, gallery shows past events, inquiry form submits
- [ ] tour.html — 3D tour iframe loads
- [ ] loyalty.html — steps visible, Telegram link works
- [ ] careers.html — form submits and shows success message
- [ ] contact.html — map loads, hours correct, reserve button works
- [ ] Language switcher works on all pages (UZ / RU / EN)
- [ ] Mobile layout correct on all pages (test at 375px width)
