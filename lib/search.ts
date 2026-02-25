import type { ApiEntry } from "./types";

/**
 * Simple fuzzy search — matches if all query tokens appear
 * in the API name, description, or category (case-insensitive).
 */
export function searchApis(apis: ApiEntry[], query: string): ApiEntry[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return apis;

  const tokens = trimmed.split(/\s+/);

  return apis.filter((api) => {
    const haystack = `${api.API} ${api.Description} ${api.Category}`.toLowerCase();
    return tokens.every((token) => haystack.includes(token));
  });
}
