"use client";

import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";
import { useState } from "react";

interface ChartPreviewProps {
  data: PreviewData;
  compact?: boolean;
}

interface DataPoint {
  label: string;
  value: number;
}

/**
 * Find the first array value within a record, then map its items into
 * { label, value } pairs using the configured keys.
 */
function extractDataPoints(
  sampleResponse: Record<string, unknown>,
  labelKey: string,
  dataKey: string,
): DataPoint[] {
  // Search top-level keys for the first array
  for (const val of Object.values(sampleResponse)) {
    if (Array.isArray(val) && val.length > 0) {
      return val.map((item: Record<string, unknown>) => ({
        label: String(item[labelKey] ?? ""),
        value: Number(item[dataKey] ?? 0),
      }));
    }
  }
  return [];
}

/**
 * Build an SVG path string for a smooth line using quadratic bezier curves.
 */
function buildSmoothPath(
  points: Array<{ x: number; y: number }>,
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;

    if (i === 0) {
      d += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
    } else {
      d += ` Q ${current.x} ${current.y} ${midX} ${midY}`;
    }
  }

  // Final segment to the last point
  const last = points[points.length - 1];
  const secondLast = points[points.length - 2];
  d += ` Q ${secondLast.x + (last.x - secondLast.x) / 2} ${last.y} ${last.x} ${last.y}`;

  return d;
}

/**
 * Build the area fill path (line path + close at bottom).
 */
function buildAreaPath(
  points: Array<{ x: number; y: number }>,
  chartHeight: number,
  paddingLeft: number,
  paddingRight: number,
): string {
  if (points.length < 2) return "";
  const linePath = buildSmoothPath(points);
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${linePath} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;
}

export function ChartPreview({ data, compact = false }: ChartPreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const {
    title,
    subtitle,
    chartType = "line",
    chartDataKey = "value",
    chartLabelKey = "label",
  } = previewConfig;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const dataPoints = extractDataPoints(sampleResponse, chartLabelKey, chartDataKey);

  if (dataPoints.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl",
          "bg-card shadow-sm ring-1 ring-border/50",
          "dark:bg-neutral-800 dark:ring-white/[0.06]",
          compact ? "h-[160px]" : "h-64",
        )}
      >
        <p className="text-sm text-muted-foreground">No chart data available.</p>
      </div>
    );
  }

  const values = dataPoints.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal || 1;

  // Detect trend direction for line charts (financial data indicator)
  const isUpTrend = values[values.length - 1] >= values[0];

  // Chart dimensions
  const chartWidth = compact ? 280 : 520;
  const chartHeight = compact ? 100 : 220;
  const paddingTop = compact ? 10 : 24;
  const paddingBottom = compact ? 20 : 36;
  const paddingLeft = compact ? 8 : 12;
  const paddingRight = compact ? 8 : 12;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Map data to pixel coordinates
  const pixelPoints = dataPoints.map((dp, i) => ({
    x: paddingLeft + (i / Math.max(dataPoints.length - 1, 1)) * plotWidth,
    y: paddingTop + (1 - (dp.value - minVal) / valRange) * plotHeight,
    label: dp.label,
    value: dp.value,
  }));

  // Grid lines (4 horizontal lines)
  const gridLineCount = 4;
  const gridLines = Array.from({ length: gridLineCount }, (_, i) => {
    const ratio = i / (gridLineCount - 1);
    return {
      y: paddingTop + ratio * plotHeight,
      value: maxVal - ratio * valRange,
    };
  });

  // Bar width for bar charts
  const barGap = compact ? 3 : 6;
  const barWidth = Math.max(
    8,
    (plotWidth - barGap * (dataPoints.length - 1)) / dataPoints.length,
  );

  // Format value for display
  const formatVal = (v: number): string => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    if (v < 1 && v > 0) return v.toFixed(3);
    return v.toFixed(1);
  };

  // Determine how many x-axis labels to show to avoid overlap
  const maxLabels = compact ? 4 : 8;
  const labelStep = Math.max(1, Math.ceil(dataPoints.length / maxLabels));

  // SVG unique ID for gradients
  const gradientId = `chart-grad-${data.id}`;
  const areaGradientId = `area-grad-${data.id}`;

  // ── Line Chart ──────────────────────────────────────────────────────
  function renderLineChart() {
    const linePath = buildSmoothPath(pixelPoints);
    const areaPath = buildAreaPath(pixelPoints, paddingTop + plotHeight, paddingLeft, paddingRight);

    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={paddingLeft}
            y1={line.y}
            x2={paddingLeft + plotWidth}
            y2={line.y}
            stroke="currentColor"
            className="text-black/[0.06] dark:text-white/[0.08]"
            strokeWidth="1"
          />
        ))}

        {/* Area fill */}
        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#${areaGradientId})`}
          />
        )}

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={compact ? 2 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {pixelPoints.map((pt, i) => (
          <g key={i}>
            {/* Hover target (larger invisible circle) */}
            {!compact && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={12}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            )}
            {/* Visible dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 5 : compact ? 2 : 3}
              fill={hoveredIndex === i ? "#a855f7" : "#7c3aed"}
              stroke="white"
              strokeWidth={hoveredIndex === i ? 2 : compact ? 0 : 1.5}
              className="transition-all duration-150"
            />
            {/* Tooltip on hover */}
            {hoveredIndex === i && !compact && (
              <>
                <rect
                  x={pt.x - 28}
                  y={pt.y - 26}
                  width={56}
                  height={18}
                  rx={4}
                  className="fill-neutral-800 dark:fill-neutral-200"
                />
                <text
                  x={pt.x}
                  y={pt.y - 14}
                  textAnchor="middle"
                  className="fill-white dark:fill-neutral-900 text-[10px] font-medium"
                >
                  {formatVal(pt.value)}
                </text>
              </>
            )}
          </g>
        ))}

        {/* X-axis labels */}
        {pixelPoints.map((pt, i) => {
          if (i % labelStep !== 0) return null;
          return (
            <text
              key={`label-${i}`}
              x={pt.x}
              y={chartHeight - 4}
              textAnchor="middle"
              className={cn(
                "fill-muted-foreground",
                compact ? "text-[7px]" : "text-[10px]",
              )}
            >
              {pt.label}
            </text>
          );
        })}
      </svg>
    );
  }

  // ── Bar Chart ───────────────────────────────────────────────────────
  function renderBarChart() {
    const totalBarsWidth = barWidth * dataPoints.length + barGap * (dataPoints.length - 1);
    const offsetX = paddingLeft + (plotWidth - totalBarsWidth) / 2;
    const barGradientId = `bar-grad-${data.id}`;

    return (
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <line
            key={i}
            x1={paddingLeft}
            y1={line.y}
            x2={paddingLeft + plotWidth}
            y2={line.y}
            stroke="currentColor"
            className="text-black/[0.06] dark:text-white/[0.08]"
            strokeWidth="1"
          />
        ))}

        {/* Bars */}
        {dataPoints.map((dp, i) => {
          const barHeight = Math.max(2, ((dp.value - minVal) / valRange) * plotHeight);
          const x = offsetX + i * (barWidth + barGap);
          const y = paddingTop + plotHeight - barHeight;
          const isHovered = hoveredIndex === i;
          const radius = Math.min(4, barWidth / 2);

          return (
            <g key={i}>
              {/* Hover target */}
              {!compact && (
                <rect
                  x={x}
                  y={paddingTop}
                  width={barWidth}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                />
              )}
              {/* Bar with rounded top */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={radius}
                fill={`url(#${barGradientId})`}
                opacity={isHovered ? 1 : 0.8}
                className="transition-opacity duration-150"
              />
              {/* Value tooltip on hover */}
              {isHovered && !compact && (
                <>
                  <rect
                    x={x + barWidth / 2 - 28}
                    y={y - 22}
                    width={56}
                    height={18}
                    rx={4}
                    className="fill-neutral-800 dark:fill-neutral-200"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    className="fill-white dark:fill-neutral-900 text-[10px] font-medium"
                  >
                    {formatVal(dp.value)}
                  </text>
                </>
              )}
              {/* X-axis label */}
              {(i % labelStep === 0) && (
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  className={cn(
                    "fill-muted-foreground",
                    compact ? "text-[7px]" : "text-[10px]",
                  )}
                >
                  {dp.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // ── Compact Mode ────────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl",
          "bg-card shadow-sm ring-1 ring-border/50",
          "dark:bg-neutral-800 dark:ring-white/[0.06]",
          "h-[160px]",
        )}
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <h3 className="truncate text-xs font-semibold text-foreground">
            {title}
          </h3>
          {chartType === "line" && (
            <span
              className={cn(
                "text-[10px] font-semibold",
                isUpTrend ? "text-emerald-500" : "text-red-500",
              )}
            >
              {isUpTrend ? "\u25B2" : "\u25BC"}
            </span>
          )}
        </div>
        <div className="flex-1 px-2 pb-1">
          {chartType === "line" ? renderLineChart() : renderBarChart()}
        </div>
      </div>
    );
  }

  // ── Full Mode ───────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl",
        "bg-card shadow-sm ring-1 ring-border/50",
        "dark:bg-neutral-800 dark:ring-white/[0.06]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {chartType === "line" && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1",
              isUpTrend
                ? "bg-emerald-50 dark:bg-emerald-950/40"
                : "bg-red-50 dark:bg-red-950/40",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold",
                isUpTrend ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
              )}
            >
              {isUpTrend ? "\u25B2" : "\u25BC"}{" "}
              {Math.abs(
                ((values[values.length - 1] - values[0]) / (values[0] || 1)) * 100,
              ).toFixed(1)}
              %
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-4 pb-5">
        {chartType === "line" ? renderLineChart() : renderBarChart()}
      </div>
    </div>
  );
}
