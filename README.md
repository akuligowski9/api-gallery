# API Explorer

> A visual front-end for 1,500+ public APIs — see what the data looks like before reading the docs.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/akuligowski9/api-explorer)](https://github.com/akuligowski9/api-explorer/releases)
[![GitHub stars](https://img.shields.io/github/stars/akuligowski9/api-explorer?style=social)](https://github.com/akuligowski9/api-explorer)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/akuligowski9/api-explorer/blob/main/CONTRIBUTING.md)

**[Live Demo](https://public-apis-explorer.vercel.app)** · If this is useful, consider giving it a star!

![API Explorer demo](public/demo.gif)

Built on top of [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis) and [public-apis/public-apis](https://github.com/public-apis/public-apis) — same data, completely different experience. Instead of browsing a markdown table, you get rendered sample data displayed as weather cards, charts, image grids, and more.

## Why this exists

Public API catalogs are incredibly useful, but they're all tables and lists. I wanted a way to actually *see* what an API returns before reading the docs. This project takes the same catalog data and gives it a visual layer:

- **1,546 APIs** with hand-crafted visual previews across 40+ categories
- **7 preview types**: weather cards, SVG charts, geo visualizations, image displays, styled lists, code viewers, and key-value cards
- **Side-by-side comparison**: select up to 3 APIs and compare auth, CORS, HTTPS, descriptions, and previews in a full-screen drawer
- Search, category filters, and paginated browsing (48 cards per page)

## Tech stack

- **Next.js 16** (App Router, SSG) — all 1,550 pages pre-built at deploy time
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible component primitives
- **Framer Motion** — scroll animations, card transitions
- **TypeScript** — end to end
- **Vercel** — deployed at [public-apis-explorer.vercel.app](https://public-apis-explorer.vercel.app)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx              → Homepage (search + card grid)
  [slug]/page.tsx       → Detail page (SSG, 1,546 pages)
components/
  previews/             → 7 visual preview components + registry
  api-card.tsx          → Card component with hover effects + compare checkbox
  api-grid.tsx          → Responsive grid with search + filters
  compare-tray.tsx      → Sticky bottom tray for selected APIs
  compare-drawer.tsx    → Full-screen side-by-side comparison drawer
  search-bar.tsx        → Glass-morphism search input
data/
  catalog.json          → Full API catalog (1,546 entries)
  previews/             → 1,546 preview JSON files (one per API)
lib/
  api-data.ts           → Data access layer
  categories.ts         → Category definitions + emoji map
  compare-context.tsx   → React context for API comparison state
  search.ts             → Fuzzy search
```

## Adding a new preview

1. Fetch sample data from the API and save it to `data/previews/{slug}.json`:

```json
{
  "id": "your-api-slug",
  "previewType": "card",
  "sampleResponse": { ... },
  "previewConfig": {
    "title": "Display Title",
    "displayFields": ["field1", "field2"]
  }
}
```

2. The preview type determines which component renders the data:

| Type | Component | Best for |
|------|-----------|----------|
| `weather` | Temperature + forecast bars | Weather APIs |
| `chart` | SVG line/bar chart | Financial, statistical data |
| `map` | Geo pin visualization | Location, IP APIs |
| `list` | Scrollable rows | Search results, collections |
| `media` | Image display | Photos, generated images |
| `code` | Syntax-highlighted JSON | Developer tools, raw data |
| `card` | Key-value pairs | General structured data |

3. If the API isn't in `data/catalog.json`, add an entry:

```json
{
  "API": "Your API Name",
  "Description": "What it does",
  "Auth": "",
  "HTTPS": true,
  "Cors": "yes",
  "Link": "https://docs-url.com",
  "Category": "Category Name"
}
```

4. Run `npm run build` to verify the new page generates.

## Contributing

We welcome contributions! Browse [open issues](https://github.com/akuligowski9/api-explorer/issues) to find something to work on, or see [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

```bash
# Fork, clone, and create a preview
git clone https://github.com/YOUR_USERNAME/api-explorer.git
cd api-explorer
npm install
npm run dev
```

## License

MIT
