"use client";

import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";

interface CardPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/**
 * Resolve a nested key path like "sprites.front_default" from an object.
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

/**
 * Format a value for display: capitalize strings, localize numbers, etc.
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") {
    // Capitalize first letter if it's a short-ish string
    if (value.length > 0 && value.length < 200) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  }
  if (Array.isArray(value)) return `${value.length} items`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/**
 * Format a field key for display: snake_case / camelCase -> Title Case.
 */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
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

  const visibleFields = compact ? fields.slice(0, 3) : fields;

  // ── Joke Card Variant ──────────────────────────────────────────────
  if (isJoke) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl",
          "bg-white shadow-sm ring-1 ring-black/[0.06]",
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
        "bg-white shadow-sm ring-1 ring-black/[0.06]",
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
