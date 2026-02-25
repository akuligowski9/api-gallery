/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import { resolveKey, formatLabel, formatValue } from "@/lib/preview-utils";
import type { PreviewData } from "@/lib/types";

interface CardPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

export function CardPreview({ data, compact = false }: CardPreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const { title, subtitle, displayFields, imageKey } = previewConfig;

  // Resolve image URL if imageKey is provided
  const imageUrl = imageKey
    ? (resolveKey(sampleResponse, imageKey) as string | undefined)
    : undefined;

  // Detect JokeAPI-style two-part joke
  const isJoke =
    sampleResponse.type === "twopart" &&
    typeof sampleResponse.setup === "string" &&
    typeof sampleResponse.delivery === "string";

  // Gather display fields with their resolved values
  const fields = (displayFields ?? []).map((key) => ({
    key,
    label: formatLabel(key),
    value: resolveKey(sampleResponse, key),
  }));

  const visibleFields = compact ? fields.slice(0, 5) : fields;

  // ── Joke Card Variant ──────────────────────────────────────────────
  if (isJoke) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl",
          "bg-card shadow-sm ring-1 ring-border/50",
          "dark:bg-neutral-800 dark:ring-white/[0.06]",
          compact ? "p-4" : "p-6",
        )}
      >
        <p
          className={cn(
            "font-medium text-foreground",
            compact ? "text-sm" : "text-base",
          )}
        >
          {String(sampleResponse.setup)}
        </p>
        <p
          className={cn(
            "mt-2 italic text-muted-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {String(sampleResponse.delivery)}
        </p>
        {!compact && subtitle && (
          <p className="mt-4 text-xs text-muted-foreground/60">{subtitle}</p>
        )}
      </div>
    );
  }

  // ── Standard Key-Value Card ────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-card shadow-sm ring-1 ring-border/50",
        "dark:bg-neutral-800 dark:ring-white/[0.06]",
        compact ? "gap-3" : "gap-4",
      )}
    >
      {/* Image + Header Section */}
      <div
        className={cn(
          "flex items-center gap-4",
          compact ? "p-4 pb-0" : "p-6 pb-0",
        )}
      >
        {imageUrl && (
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-lg bg-muted",
              compact ? "h-14 w-14" : "h-20 w-20",
            )}
          >
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "truncate font-semibold text-foreground",
              compact ? "text-sm" : "text-lg",
            )}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              className={cn(
                "mt-0.5 truncate text-muted-foreground",
                compact ? "text-xs" : "text-sm",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Key-Value Rows */}
      {visibleFields.length > 0 && (
        <div
          className={cn(
            "divide-y divide-black/[0.04] dark:divide-white/[0.06]",
            compact ? "px-4 pb-4" : "px-6 pb-6",
          )}
        >
          {visibleFields.map(({ key, label, value }) => (
            <div
              key={key}
              className={cn(
                "flex items-baseline justify-between gap-4",
                compact ? "py-1.5" : "py-2.5",
              )}
            >
              <span
                className={cn(
                  "shrink-0 text-muted-foreground",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "truncate text-right font-medium text-foreground",
                  compact ? "text-xs" : "text-sm",
                )}
              >
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Fallback: no fields, no image — show raw title only */}
      {visibleFields.length === 0 && !imageUrl && (
        <div className={compact ? "px-4 pb-4" : "px-6 pb-6"}>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? "No preview data available."}
          </p>
        </div>
      )}
    </div>
  );
}
