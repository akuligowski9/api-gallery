"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";

interface MediaPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/**
 * Resolve a nested key path like "urls.regular" from an object.
 */
function resolveKey(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce(
      (o, k) =>
        o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined,
      obj as unknown,
    );
}

export function MediaPreview({ data, compact = false }: MediaPreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const { title, subtitle, imageKey } = previewConfig;
  const [loaded, setLoaded] = useState(false);

  const imageUrl = imageKey
    ? (resolveKey(sampleResponse, imageKey) as string | undefined)
    : undefined;

  // ── Compact Mode ───────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          "ring-1 ring-black/[0.06] dark:ring-white/[0.06]",
          "h-full min-h-[160px]",
        )}
      >
        {/* Loading shimmer */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">No image</span>
          </div>
        )}

        {/* Bottom gradient overlay with title */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent px-4 pb-3 pt-10">
          <p className="truncate text-sm font-semibold text-white drop-shadow-sm">
            {title}
          </p>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-white/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Full Mode ──────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-white shadow-sm ring-1 ring-black/[0.06]",
        "dark:bg-neutral-800 dark:ring-white/[0.06]",
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {/* Loading shimmer */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm text-muted-foreground">
              No image available
            </span>
          </div>
        )}
      </div>

      {/* Title / subtitle below the image */}
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
