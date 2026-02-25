"use client";

import type { PreviewData, PreviewType } from "@/lib/types";
import { WeatherPreview } from "./weather-preview";
import { MapPreview } from "./map-preview";
import { ChartPreview } from "./chart-preview";
import { ListPreview } from "./list-preview";
import { MediaPreview } from "./media-preview";
import { CodePreview } from "./code-preview";
import { CardPreview } from "./card-preview";
import type { ComponentType } from "react";

interface PreviewProps {
  data: PreviewData;
  compact?: boolean;
}

const previewRegistry: Record<PreviewType, ComponentType<PreviewProps>> = {
  weather: WeatherPreview,
  map: MapPreview,
  chart: ChartPreview,
  list: ListPreview,
  media: MediaPreview,
  code: CodePreview,
  card: CardPreview,
};

export function PreviewRenderer({ data, compact }: PreviewProps) {
  const Component = previewRegistry[data.previewType];
  if (!Component) {
    return <CodePreview data={data} compact={compact} />;
  }
  return <Component data={data} compact={compact} />;
}
