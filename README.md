# SohihFinder — Hadith Search & Verify Platform

A free, open-source full-stack hadith search, browse, and verification platform. No paid AI APIs
required — all data comes from open-source hadith datasets, and the app runs entirely on free tiers.

## Features

- Search 36,500+ hadiths from 10 collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasai, Ibn Majah, Malik, Nawawi 40, Qudsi 40, Dehlawi 40)
- Intelligent fuzzy search with synonym matching (intention→niyyah, prayer→salah, etc.) and live suggestions
- Browse collections with book filter and pagination, or browse by grade (Sahih / Hasan / Da'if / Mawdu)
- "Verify" page: paste a hadith claim and see the closest matching hadiths with their existing grades
- Arabic RTL text, copy buttons, and bookmark/save hadiths in your browser
- Dark/light theme, mobile-first responsive design with animations
- Color-coded grade badges and reference links to Sunnah.com

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (M0 free tier) — optional; falls back to in-memory store |
| Search | Fuse.js fuzzy search + MongoDB text index |
| Hosting | Vercel (frontend) / Render or Railway (backend) |

No OpenAI / Claude / Gemini API keys. No credit card. No cost.

## Project Structure

```
├── backend/
│   ├── models/Hadith.js          # Mongoose schema
│   ├── routes/                   # hadiths, search, collections
│   ├── store/memoryStore.js      # In-memory store (no DB required)
│   ├── scripts/importDataset.js  # Import hadith data into MongoDB
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/pages/                # Home, Browse, Search, Detail, Verify, About
│   ├── src/components/           # HadithCard, SearchBar, grade helpers
│   ├── src/api/client.js         # API helper (uses /api reverse proxy)
│   └── vite.config.js            # /api proxy to backend, allowedHosts
└── README.md
```

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # set MONGODB_URI (optional)
npm install
npm run dev            # starts on http://localhost:5000
```

Without a MongoDB URI, the backend automatically loads 7 collections from the jsDelivr CDN into an
in-memory store (36,000+ hadiths). For production, set `MONGODB_URI` and unset `SKIP_MONGO`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend, so there are no CORS issues in preview.

### 3. Import data into MongoDB (production)

```bash
cd backend
export MONGODB_URI="mongodb+srv://..."
npm run import          # downloads eng+ara editions and upserts into MongoDB
```

This imports 10 collections (36,500+ hadiths) with both Arabic and English text. Run it once; the
server will then serve everything from MongoDB.

### 4. Backend with MongoDB (production)

```bash
cd backend
node server.js          # uses MONGODB_URI from .env; falls back to in-memory store if absent
```

## API Endpoints

```
GET /api/hadiths                    List/paginate (query: collection, book, grade, page, limit)
GET /api/hadiths/:id                Single hadith detail (e.g. bukhari-1, includes Arabic + English)
GET /api/hadiths/random             Random hadith
GET /api/hadiths/stats              Total hadiths + grade distribution
GET /api/search?q=keyword           Full-text + fuzzy search (collection & grade filters)
GET /api/search/suggest?q=...       Live search suggestions
GET /api/search/verify?text=...     Closest matching hadiths with grades
GET /api/collections                All book collections
GET /api/collections/:grade         Filter by grade (Sahih, Hasan, Da'if, Mawdu)
GET /api/health                     Health check
```

## Data Sources

- **fawazahmed0/hadith-api** — open-source static JSON API served from jsDelivr CDN (used for the
  in-memory store and import script)
- **AhmedBaset/hadith-json** — offline-capable dataset for importing into your own MongoDB instance

Grades shown come from established scholarly works (Al-Albani, Shuaib Al-Arnaut, collection
editors) already present in the source data.

## Disclaimer

This platform displays grades that already exist in the source datasets. It does not issue religious
rulings or automated authenticity judgments. All religious decisions should be made with qualified
scholars.

## License

MIT
