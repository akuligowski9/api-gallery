/* eslint-disable @next/next/no-img-element */
"use client";

import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";

interface ListPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/** Known keys that represent a numeric badge (score, popularity, etc.) */
const BADGE_KEYS = ["score", "stars", "stargazers_count", "population", "points"];

/** Known keys that represent secondary descriptive text */
const SECONDARY_KEYS = ["author", "by", "language", "capital", "region"];

/** Known keys that represent a small image / flag */
const IMAGE_KEYS = ["flag", "flags"];

/**
 * Find the first key in an item that matches one of the candidate keys.
 */
function findField(
  item: Record<string, unknown>,
  candidates: string[],
): { key: string; value: unknown } | undefined {
  for (const key of candidates) {
    if (key in item && item[key] !== undefined && item[key] !== null) {
      return { key, value: item[key] };
    }
  }
  return undefined;
}

/**
 * Extract the primary label from an item — the first string-valued field.
 */
function getPrimaryText(item: Record<string, unknown>): string {
  // Prefer common label-like keys first
  for (const key of ["name", "title", "label", "text", "activity"]) {
    if (typeof item[key] === "string") return item[key] as string;
  }
  // Fall back to the first string field
  for (const value of Object.values(item)) {
    if (typeof value === "string" && value.length > 0) return value;
  }
  return "—";
}

/**
 * Format a large number compactly: 1200 -> "1.2K", 3400000 -> "3.4M".
 */
function formatBadge(value: unknown): string {
  if (typeof value === "number") {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  }
  return String(value);
}

/**
 * Resolve a flag image URL. Handles both string URLs and the RestCountries
 * `flags` object shape: { png: string, svg: string }.
 */
function resolveFlagUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.png === "string") return obj.png;
    if (typeof obj.svg === "string") return obj.svg;
  }
  return undefined;
}

export function ListPreview({ data, compact = false }: ListPreviewProps) {
  const { previewConfig, sampleResponse } = data;
  const { title, items } = previewConfig;

  // Support items in either previewConfig.items or sampleResponse.items
  const allItems: Record<string, unknown>[] =
    items ?? (Array.isArray(sampleResponse?.items) ? sampleResponse.items : []);
  const visibleItems = compact ? allItems.slice(0, 3) : allItems;
  const remaining = allItems.length - visibleItems.length;

  if (allItems.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl",
          "bg-card shadow-sm ring-1 ring-border/50",
          "dark:bg-neutral-800 dark:ring-white/[0.06]",
          compact ? "h-[160px]" : "h-48",
        )}
      >
        <p className="text-sm text-muted-foreground">No items to display.</p>
      </div>
    );
  }

  const { itemKey, secondaryKey, badgeKey } = previewConfig;

  // ── Row Renderer ───────────────────────────────────────────────────
  function renderRow(item: Record<string, unknown>, index: number) {
    const primary = itemKey && typeof item[itemKey] === "string"
      ? (item[itemKey] as string)
      : getPrimaryText(item);
    const badge = badgeKey && item[badgeKey] !== undefined
      ? { key: badgeKey, value: item[badgeKey] }
      : findField(item, BADGE_KEYS);
    const secondary = secondaryKey && item[secondaryKey] !== undefined
      ? { key: secondaryKey, value: item[secondaryKey] }
      : findField(item, SECONDARY_KEYS);
    const imageField = findField(item, IMAGE_KEYS);
    const flagUrl = imageField ? resolveFlagUrl(imageField.value) : undefined;

    return (
      <div
        key={index}
        className={cn(
          "flex items-center gap-3 transition-colors",
          "hover:bg-muted/40",
          compact ? "px-4 py-2.5" : "px-5 py-3.5",
        )}
      >
        {/* Optional flag / image */}
        {flagUrl && (
          <img
            src={flagUrl}
            alt=""
            className={cn(
              "shrink-0 rounded-sm object-cover ring-1 ring-black/[0.06]",
              compact ? "h-5 w-7" : "h-6 w-9",
            )}
            loading="lazy"
          />
        )}

        {/* Text content */}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate font-medium text-foreground",
              compact ? "text-xs" : "text-sm",
            )}
          >
            {primary}
          </p>
          {secondary && !compact && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {String(secondary.value)}
            </p>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-full bg-muted px-2.5 py-0.5 font-mono font-medium text-muted-foreground",
              compact ? "text-[10px]" : "text-xs",
            )}
          >
            {formatBadge(badge.value)}
          </span>
        )}
      </div>
    );
  }

  // ── Compact Mode ───────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl",
          "bg-card shadow-sm ring-1 ring-border/50",
          "dark:bg-neutral-800 dark:ring-white/[0.06]",
        )}
      >
        {/* Title */}
        <div className="px-4 pb-1 pt-3">
          <h3 className="truncate text-xs font-semibold text-foreground">
            {title}
          </h3>
        </div>

        {/* Items */}
        <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
          {visibleItems.map((item, i) => renderRow(item, i))}
        </div>

        {/* "and N more..." */}
        {remaining > 0 && (
          <div className="px-4 pb-3 pt-1.5">
            <p className="text-[10px] text-muted-foreground/60">
              and {remaining} more...
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Full Mode ──────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-card shadow-sm ring-1 ring-border/50",
        "dark:bg-neutral-800 dark:ring-white/[0.06]",
      )}
    >
      {/* Header */}
      <div className="border-b border-black/[0.04] px-5 py-4 dark:border-white/[0.06]">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {allItems.length} {allItems.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Scrollable list */}
      <div className="max-h-[400px] divide-y divide-black/[0.04] overflow-auto dark:divide-white/[0.06]">
        {visibleItems.map((item, i) => renderRow(item, i))}
      </div>
    </div>
  );
}
