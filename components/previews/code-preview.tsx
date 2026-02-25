"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { PreviewData } from "@/lib/types";

interface CodePreviewProps {
  data: PreviewData;
  compact?: boolean;
}

/**
 * Apply lightweight syntax coloring to a JSON string.
 * Returns an array of React elements with appropriate Tailwind color classes.
 */
function colorizeJson(json: string): React.ReactNode[] {
  // Regex captures JSON tokens in order of precedence
  const tokenRegex =
    /("(?:\\.|[^"\\])*"\s*:)|("(?:\\.|[^"\\])*")|(true|false)|(null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(json)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      parts.push(json.slice(lastIndex, match.index));
    }

    const [fullMatch, key, str, bool, nul, num] = match;

    if (key) {
      // Object key — strip the trailing colon, color the key, re-add colon
      const colonIdx = key.lastIndexOf(":");
      const keyPart = key.slice(0, colonIdx);
      parts.push(
        <span key={`k-${match.index}`} className="text-violet-400">
          {keyPart}
        </span>,
      );
      parts.push(key.slice(colonIdx));
    } else if (str) {
      parts.push(
        <span key={`s-${match.index}`} className="text-green-400">
          {fullMatch}
        </span>,
      );
    } else if (bool) {
      parts.push(
        <span key={`b-${match.index}`} className="text-amber-400">
          {fullMatch}
        </span>,
      );
    } else if (nul) {
      parts.push(
        <span key={`n-${match.index}`} className="text-red-400">
          {fullMatch}
        </span>,
      );
    } else if (num) {
      parts.push(
        <span key={`d-${match.index}`} className="text-blue-400">
          {fullMatch}
        </span>,
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  // Remaining plain text after last match
  if (lastIndex < json.length) {
    parts.push(json.slice(lastIndex));
  }

  return parts;
}

export function CodePreview({ data, compact = false }: CodePreviewProps) {
  const { sampleResponse, previewConfig } = data;
  const { title } = previewConfig;

  const jsonString = useMemo(
    () => JSON.stringify(sampleResponse, null, 2),
    [sampleResponse],
  );

  const lines = useMemo(() => jsonString.split("\n"), [jsonString]);

  const colorized = useMemo(() => colorizeJson(jsonString), [jsonString]);

  // For compact mode, limit visible lines
  const compactLineCount = 6;
  const compactJson = useMemo(
    () =>
      compact
        ? colorizeJson(lines.slice(0, compactLineCount).join("\n"))
        : null,
    [compact, lines],
  );

  // ── Compact Mode ───────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl",
          "bg-neutral-900 text-neutral-100",
          "shadow-inner ring-1 ring-white/[0.06]",
          "h-full min-h-[160px]",
        )}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 truncate text-xs text-neutral-500">
            {title}
          </span>
        </div>

        {/* Code content */}
        <pre className="p-4 font-mono text-xs leading-relaxed">
          <code>{compactJson}</code>
        </pre>

        {/* Fade-out overlay */}
        {lines.length > compactLineCount && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent" />
        )}
      </div>
    );
  }

  // ── Full Mode ──────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        "bg-neutral-900 text-neutral-100",
        "shadow-inner ring-1 ring-white/[0.06]",
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-red-500/70" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
        <span className="h-3 w-3 rounded-full bg-green-500/70" />
        <span className="ml-2 truncate text-sm text-neutral-500">{title}</span>
      </div>

      {/* Scrollable code area */}
      <div className="max-h-[480px] overflow-auto">
        <pre className="p-4 font-mono text-sm leading-relaxed">
          <code className="flex">
            {/* Line numbers */}
            <span
              className="mr-6 select-none text-right text-neutral-600"
              aria-hidden="true"
            >
              {lines.map((_, i) => (
                <span key={i} className="block">
                  {i + 1}
                </span>
              ))}
            </span>

            {/* Colorized content */}
            <span className="flex-1">{colorized}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
