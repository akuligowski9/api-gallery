# API Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/akuligowski9/api-explorer?style=social)](https://github.com/akuligowski9/api-explorer)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/akuligowski9/api-explorer/blob/main/CONTRIBUTING.md)

A visual front-end for public API catalogs. This project builds on the excellent work of repos like [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis) - same data, completely different experience. Instead of browsing a markdown table, you get rendered sample data displayed as weather cards, charts, image grids, and more.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fakuligowski9%2Fapi-explorer)

## Why this exists

Public API catalogs are incredibly useful, but they're all tables and lists. I wanted a way to actually *see* what an API returns before reading the docs. This project takes the same catalog data and gives it a visual layer:

- **1,546 APIs** with visual preview components
- **1,500+ APIs** listed with search, filters, and category browsing
- **7 preview types**: weather cards, SVG charts, geo visualizations, image displays, styled lists, code viewers, and key-value cards

## Tech stack

- **Next.js 16** - App Router, static site generation (all pages pre-built)
- **Tailwind CSS v4** - custom design system, no component library
- **framer-motion** - scroll animations, card transitions
- **TypeScript** - end to end

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
  [slug]/page.tsx       → Detail page (SSG, 1,547 pages)
components/
  previews/             → 7 visual preview components + registry
  api-card.tsx          → Card component with hover effects
  api-grid.tsx          → Responsive grid with search + filters
  search-bar.tsx        → Glass-morphism search input
data/
  catalog.json          → Full API catalog (1,558 entries)
  previews/             → Sample response data (25 files)
lib/
  api-data.ts           → Data access layer
  categories.ts         → Category definitions + emoji map
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

We welcome contributions! The easiest way to help is by adding new API previews. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

```bash
# Fork, clone, and create a preview
git clone https://github.com/YOUR_USERNAME/api-explorer.git
cd api-explorer
npm install
npm run dev
```

## Standing on the shoulders of

This project wouldn't exist without these open-source API catalogs:

- [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis) - the catalog data powering this project (MIT license)
- [public-apis/public-apis](https://github.com/public-apis/public-apis) - the original list that started it all

API Explorer is a visual layer on top of their work. If you find this useful, go star those repos too.

## License

MIT
