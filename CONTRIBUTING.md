# Contributing to API Explorer

Thanks for your interest in contributing! This project thrives on community contributions - whether it's adding new API previews, improving existing ones, or enhancing the UI.

## Quick start

```bash
git clone https://github.com/akuligowski9/api-explorer.git
cd api-explorer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Ways to contribute

### Add a new API preview

This is the most impactful contribution. Each preview turns a boring docs link into a visual, interactive card.

1. **Pick an API** from the catalog (`data/catalog.json`) that doesn't have a preview yet, or add a new API entirely.

2. **Create a preview file** at `data/previews/{slug}.json`:

```json
{
  "id": "your-api-slug",
  "previewType": "card",
  "sampleResponse": {
    "key": "value"
  },
  "previewConfig": {
    "title": "Display Title",
    "displayFields": ["key"]
  }
}
```

3. **Choose the right preview type**:

| Type | Best for | Example |
|------|----------|---------|
| `weather` | Temperature + forecast data | OpenWeatherMap |
| `chart` | Financial, statistical data | CoinGecko, World Bank |
| `map` | Location, IP, geo data | IPInfo, RestCountries |
| `list` | Search results, collections | Wikipedia, PokeAPI |
| `media` | Photos, generated images | Unsplash, PlaceKitten |
| `code` | Developer tools, raw data | GitHub API, JSONPlaceholder |
| `card` | General structured data | Most APIs |

4. **Verify it builds**: `npm run build`

5. **Submit a PR** with a screenshot of your preview.

### Improve an existing preview

Found a preview that could look better? Open a PR! Common improvements:
- Better sample data that showcases the API
- More relevant display fields
- Switching to a more appropriate preview type

### Report issues

- Broken API links
- Preview rendering bugs
- UI/UX improvements
- New feature ideas

Use the [issue templates](https://github.com/akuligowski9/api-explorer/issues/new/choose) to get started.

## Development guidelines

- **TypeScript** - all code is typed end-to-end
- **No component libraries** - we use Tailwind CSS v4 with a custom design system
- **Static generation** - all pages are pre-built at build time
- **Keep previews realistic** - use actual sample data from the API when possible

## Slug format

The slug for an API is its name lowercased with spaces replaced by hyphens. For example:
- "OpenWeatherMap" → `openweathermap`
- "Cat Facts" → `cat-facts`
- "REST Countries" → `rest-countries`

Check [`lib/slugify.ts`](lib/slugify.ts) for the exact logic.

## Pull request process

1. Fork the repo and create your branch from `main`
2. Make your changes
3. Run `npm run build` to ensure everything compiles
4. Run `npm run lint` to check for style issues
5. Submit your PR with a clear description of what you changed

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
