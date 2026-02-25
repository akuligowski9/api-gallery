export interface CatalogEntry {
  API: string;
  Description: string;
  Auth: "" | "apiKey" | "OAuth" | "X-Mashape-Key" | "User-Agent";
  HTTPS: boolean;
  Cors: "yes" | "no" | "unknown";
  Link: string;
  Category: string;
}

export interface CatalogData {
  count: number;
  entries: CatalogEntry[];
}

export type PreviewType =
  | "weather"
  | "map"
  | "chart"
  | "list"
  | "media"
  | "code"
  | "card";

export interface PreviewData {
  id: string;
  previewType: PreviewType;
  sampleResponse: Record<string, unknown>;
  previewConfig: {
    title: string;
    subtitle?: string;
    displayFields?: string[];
    imageKey?: string;
    items?: Array<Record<string, unknown>>;
    chartType?: "line" | "bar";
    chartDataKey?: string;
    chartLabelKey?: string;
  };
}

export interface ApiEntry extends CatalogEntry {
  slug: string;
  preview?: PreviewData;
}
