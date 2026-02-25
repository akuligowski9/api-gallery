# API Explorer

A visual catalog of 1,500+ public APIs. Browse APIs through rendered sample data previews — not raw JSON, not docs links, but the data displayed as weather cards, charts, image grids, and more.

## What makes this different

Every other API catalog is a table. This one shows you what the data actually looks like:

- **25 featured APIs** with custom visual preview components
- **1,500+ APIs** listed with search, filters, and category browsing
- **7 preview types**: weather cards, SVG charts, geo visualizations, image displays, styled lists, code viewers, and key-value cards

## Tech stack

- **Next.js 16** — App Router, static site generation (all pages pre-built)
- **Tailwind CSS v4** — custom design system, no component library
- **framer-motion** — scroll animations, card transitions
- **TypeScript** — end to end

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

## API catalog source

Catalog data forked from [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis) (MIT license).

## License

MIT
