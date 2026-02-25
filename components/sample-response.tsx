"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface SampleResponseProps {
  data: Record<string, unknown>;
}

export function SampleResponse({ data }: SampleResponseProps) {
  const [expanded, setExpanded] = useState(false);
  const json = JSON.stringify(data, null, 2);
  const lines = json.split("\n");
  const isLong = lines.length > 15;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sample Response</h2>
        <CopyButton text={json} />
      </div>

      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-neutral-900 text-neutral-100",
          "ring-1 ring-white/[0.06]",
        )}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-neutral-500">response.json</span>
        </div>

        {/* Code content */}
        <div className={cn("overflow-x-auto", !expanded && isLong && "max-h-[360px]")}>
          <pre className="p-4 text-sm leading-relaxed">
            <code>
              {(expanded ? lines : lines.slice(0, 15)).map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-6 select-none text-right text-neutral-600">
                    {i + 1}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: colorizeJsonLine(line),
                    }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Expand/collapse for long responses */}
        {isLong && (
          <>
            {!expanded && (
              <div className="pointer-events-none absolute inset-x-0 bottom-10 h-16 bg-gradient-to-t from-neutral-900" />
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] py-2.5 text-xs text-neutral-400 transition-colors hover:text-neutral-200"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Show all {lines.length} lines
                </>
              )}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function colorizeJsonLine(line: string): string {
  return line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(
      /("(?:[^"\\]|\\.)*")(\s*:)/g,
      '<span style="color:#c084fc">$1</span>$2',
    )
    .replace(
      /:\s*("(?:[^"\\]|\\.)*")/g,
      ': <span style="color:#4ade80">$1</span>',
    )
    .replace(
      /:\s*(\d+\.?\d*)/g,
      ': <span style="color:#60a5fa">$1</span>',
    )
    .replace(
      /:\s*(true|false)/g,
      ': <span style="color:#fbbf24">$1</span>',
    )
    .replace(
      /:\s*(null)/g,
      ': <span style="color:#f87171">$1</span>',
    );
}
