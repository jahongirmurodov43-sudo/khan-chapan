# Khan Chapan — Sanity Studio

## Setup

1. Create a project at https://sanity.io/manage
2. Copy your Project ID
3. Replace `YOUR_PROJECT_ID` in `sanity.config.js` with your actual Project ID
4. Run `npm install` in this directory
5. Run `npm run dev` to open the Studio at http://localhost:3333
6. In Sanity dashboard → your project → API → CORS Origins, add:
   - `http://localhost` (for local development)
   - Your production domain (e.g. `https://khanchapan.uz`)
7. Set dataset to allow public reads: Sanity dashboard → project → Datasets → production → make public

## Content entry

- **Menu Items**: Add dishes with name (UZ/RU/EN), description, category, price, image. Set `available: true` and mark 3 as `featured: true` for the homepage strip.
- **Events**: Add upcoming events. After an event, upload photos and change status to `past` — it moves automatically to the gallery.

## Deploying the Studio

```bash
npm run deploy
```

This publishes the Studio to `https://khan-chapan.sanity.studio` (or your chosen subdomain).
