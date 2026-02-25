import catalogRaw from "@/data/catalog.json";
import type { ApiEntry, CatalogData, PreviewData } from "./types";
import { slugify } from "./slugify";

// Import all 25 preview files statically
import openMeteo from "@/data/previews/open-meteo.json";
import restcountries from "@/data/previews/restcountries.json";
import pokApi from "@/data/previews/pok-api.json";
import coingecko from "@/data/previews/coingecko.json";
import spacex from "@/data/previews/spacex.json";
import jsonplaceholder from "@/data/previews/jsonplaceholder.json";
import dogCeo from "@/data/previews/dog-ceo.json";
import theCatApi from "@/data/previews/the-cat-api.json";
import nasa from "@/data/previews/nasa.json";
import openLibrary from "@/data/previews/open-library.json";
import jokeapi from "@/data/previews/jokeapi.json";
import ipApi from "@/data/previews/ip-api.json";
import nationalizeIo from "@/data/previews/nationalize-io.json";
import agifyIo from "@/data/previews/agify-io.json";
import boredApi from "@/data/previews/bored-api.json";
import httpCat from "@/data/previews/http-cat.json";
import unsplash from "@/data/previews/unsplash.json";
import github from "@/data/previews/github.json";
import hackernews from "@/data/previews/hackernews.json";
import openFoodFacts from "@/data/previews/open-food-facts.json";
import exchangerateApi from "@/data/previews/exchangerate-api.json";
import covid19 from "@/data/previews/covid-19.json";
import qrCodeGenerator from "@/data/previews/qr-code-generator.json";
import loremPicsum from "@/data/previews/lorem-picsum.json";
import numbers from "@/data/previews/numbers.json";

const catalog = catalogRaw as CatalogData;

const previewFiles: PreviewData[] = [
  openMeteo, restcountries, pokApi, coingecko, spacex,
  jsonplaceholder, dogCeo, theCatApi, nasa, openLibrary,
  jokeapi, ipApi, nationalizeIo, agifyIo, boredApi,
  httpCat, unsplash, github, hackernews, openFoodFacts,
  exchangerateApi, covid19, qrCodeGenerator, loremPicsum, numbers,
] as PreviewData[];

const previewMap = new Map<string, PreviewData>();
for (const data of previewFiles) {
  previewMap.set(data.id, data);
}

function buildEntries(): ApiEntry[] {
  return catalog.entries.map((entry) => {
    const slug = slugify(entry.API);
    const preview = previewMap.get(slug);
    return { ...entry, slug, preview };
  });
}

let cachedEntries: ApiEntry[] | null = null;

export function getAllApis(): ApiEntry[] {
  if (!cachedEntries) {
    cachedEntries = buildEntries();
  }
  return cachedEntries;
}

export function getFeaturedApis(): ApiEntry[] {
  return getAllApis().filter((api) => api.preview !== undefined);
}

export function getApiBySlug(slug: string): ApiEntry | undefined {
  return getAllApis().find((api) => api.slug === slug);
}

export function getApisByCategory(category: string): ApiEntry[] {
  return getAllApis().filter((api) => api.Category === category);
}

export function getAllSlugs(): string[] {
  return getAllApis().map((api) => api.slug);
}

export function getSimilarApis(api: ApiEntry, limit = 6): ApiEntry[] {
  return getAllApis()
    .filter((a) => a.Category === api.Category && a.slug !== api.slug)
    .slice(0, limit);
}
