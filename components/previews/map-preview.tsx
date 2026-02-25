"use client";

import { cn } from "@/lib/utils";
import { resolveKey, formatLabel } from "@/lib/preview-utils";
import type { PreviewData } from "@/lib/types";

interface MapPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/**
 * Format coordinate values with degree symbols.
 */
function formatCoord(value: number, type: "lat" | "lon"): string {
  const abs = Math.abs(value);
  const dir =
    type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  return `${abs.toFixed(4)}° ${dir}`;
}

export function MapPreview({ data, compact = false }: MapPreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const { title, subtitle, displayFields } = previewConfig;

  const lat = sampleResponse.lat as number | undefined;
  const lon = sampleResponse.lon as number | undefined;
  const city = sampleResponse.city as string | undefined;
  const country = sampleResponse.country as string | undefined;

  // Gather display fields with their resolved values
  const fields = (displayFields ?? []).map((key) => ({
    key,
    label: formatLabel(key),
    value: resolveKey(sampleResponse, key),
  }));

  // Pin position within the visualization area (normalized 0-1 based on coordinates)
  // We position the pin at a visually interesting offset rather than true projection
  const pinX = lat !== undefined && lon !== undefined
    ? 0.35 + ((lon + 180) / 360) * 0.3
    : 0.5;
  const pinY = lat !== undefined
    ? 0.3 + ((90 - lat) / 180) * 0.4
    : 0.5;

  // ── Compact Mode ──────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "relative flex flex-col overflow-hidden rounded-xl",
          "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900",
          "h-[160px]",
        )}
      >
        {/* Grid background */}
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="compact-grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="white"
                strokeOpacity="0.06"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#compact-grid)" />
        </svg>

        {/* Pin visualization */}
        <div
          className="absolute"
          style={{
            left: `${pinX * 100}%`,
            top: `${pinY * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Outer pulse ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-ping rounded-full bg-emerald-400/10" />
          </div>
          {/* Middle ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border border-emerald-400/20" />
          </div>
          {/* Inner ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 rounded-full border border-emerald-400/30" />
          </div>
          {/* Center dot */}
          <div className="relative flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          </div>
        </div>

        {/* Text overlay */}
        <div className="relative mt-auto p-4">
          <p className="text-sm font-semibold text-white">
            {city ?? title}
            {country ? `, ${country}` : ""}
          </p>
          {lat !== undefined && lon !== undefined && (
            <p className="mt-0.5 font-mono text-[10px] text-emerald-400/70">
              {formatCoord(lat, "lat")} {formatCoord(lon, "lon")}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Full Mode ─────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900",
      )}
    >
      {/* Visualization area */}
      <div className="relative h-56">
        {/* Grid background */}
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="full-grid"
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="white"
                strokeOpacity="0.05"
                strokeWidth="0.5"
              />
            </pattern>
            {/* Radial glow behind the pin */}
            <radialGradient id="pin-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#full-grid)" />
        </svg>

        {/* Horizontal and vertical crosshair lines through pin */}
        <div
          className="absolute top-0 h-full w-px bg-emerald-400/10"
          style={{ left: `${pinX * 100}%` }}
        />
        <div
          className="absolute left-0 h-px w-full bg-emerald-400/10"
          style={{ top: `${pinY * 100}%` }}
        />

        {/* Radial glow */}
        <div
          className="absolute h-40 w-40 rounded-full"
          style={{
            left: `${pinX * 100}%`,
            top: `${pinY * 100}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Pin with concentric rings */}
        <div
          className="absolute"
          style={{
            left: `${pinX * 100}%`,
            top: `${pinY * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Pulse ring (outermost, animated) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 animate-ping rounded-full bg-emerald-400/5" style={{ animationDuration: "3s" }} />
          </div>
          {/* Ring 3 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border border-dashed border-emerald-400/10" />
          </div>
          {/* Ring 2 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border border-emerald-400/20" />
          </div>
          {/* Ring 1 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-6 rounded-full border border-emerald-400/40" />
          </div>
          {/* Center pin */}
          <div className="relative flex items-center justify-center">
            <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60">
              <div className="absolute inset-0.5 rounded-full bg-emerald-300" />
            </div>
          </div>
        </div>

        {/* Coordinate label near the pin */}
        {lat !== undefined && lon !== undefined && (
          <div
            className="absolute rounded bg-black/40 px-2 py-1 backdrop-blur-sm"
            style={{
              left: `${pinX * 100 + 6}%`,
              top: `${pinY * 100 - 3}%`,
            }}
          >
            <p className="font-mono text-[11px] font-medium text-emerald-400">
              {formatCoord(lat, "lat")}
            </p>
            <p className="font-mono text-[11px] font-medium text-emerald-400/70">
              {formatCoord(lon, "lon")}
            </p>
          </div>
        )}

        {/* Title overlay (top-left) */}
        <div className="absolute left-4 top-4">
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/50">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Metadata fields */}
      {fields.length > 0 && (
        <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
          {fields.map(({ key, label, value }) => {
            // Special formatting for lat/lon
            let displayValue: string;
            if (key === "lat" && typeof value === "number") {
              displayValue = formatCoord(value, "lat");
            } else if (key === "lon" && typeof value === "number") {
              displayValue = formatCoord(value, "lon");
            } else if (value === null || value === undefined) {
              displayValue = "\u2014";
            } else {
              displayValue = String(value);
            }

            return (
              <div
                key={key}
                className="flex items-baseline justify-between gap-4 px-5 py-2.5"
              >
                <span className="shrink-0 text-xs text-white/40">
                  {label}
                </span>
                <span className="truncate text-right text-sm font-medium text-white/80">
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
