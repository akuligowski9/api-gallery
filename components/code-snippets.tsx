"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";
import { generateCurl, generateJavaScript, generatePython } from "@/lib/generate-snippets";
import type { ApiEntry } from "@/lib/types";

const tabs = [
  { id: "curl", label: "cURL", file: "request.sh" },
  { id: "javascript", label: "JavaScript", file: "request.js" },
  { id: "python", label: "Python", file: "request.py" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface CodeSnippetsProps {
  api: ApiEntry;
}

export function CodeSnippets({ api }: CodeSnippetsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("curl");

  const snippets: Record<TabId, string> = {
    curl: generateCurl(api),
    javascript: generateJavaScript(api),
    python: generatePython(api),
  };

  const code = snippets[activeTab];
  const activeFile = tabs.find((t) => t.id === activeTab)!.file;
  const lines = code.split("\n");

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Code Snippets</h2>

      <div
        className={cn(
          "overflow-hidden rounded-xl bg-neutral-900 text-neutral-100",
          "ring-1 ring-white/[0.06]",
        )}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-neutral-500">{activeFile}</span>
          </div>
          <CopyButton
            text={code}
            label="Copy"
            className="rounded-md bg-transparent px-2.5 py-1 text-neutral-400 hover:bg-transparent hover:text-neutral-200 dark:bg-transparent dark:text-neutral-400 dark:hover:text-neutral-200"
          />
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-white/[0.06]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white/[0.06] text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code content */}
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="mr-4 inline-block w-6 select-none text-right text-neutral-600">
                    {i + 1}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: colorizeLine(line, activeTab),
                    }}
                  />
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function colorizeLine(line: string, lang: TabId): string {
  const escaped = escapeHtml(line);

  switch (lang) {
    case "curl":
      return colorizeCurl(escaped);
    case "javascript":
      return colorizeJavaScript(escaped);
    case "python":
      return colorizePython(escaped);
  }
}

function colorizeCurl(line: string): string {
  return line
    .replace(/^(curl)\b/, '<span style="color:#c084fc">$1</span>')
    .replace(/(-X\s+)(GET|POST|PUT|DELETE)/, '$1<span style="color:#fbbf24">$2</span>')
    .replace(/(-H)\s/, '<span style="color:#60a5fa">$1</span> ')
    .replace(/"([^"]*)"/g, '<span style="color:#4ade80">"$1"</span>');
}

function colorizeJavaScript(line: string): string {
  return line
    .replace(
      /\b(const|let|var|await|async|function)\b/g,
      '<span style="color:#c084fc">$1</span>',
    )
    .replace(
      /\b(fetch|console|response|JSON)\b/g,
      '<span style="color:#60a5fa">$1</span>',
    )
    .replace(
      /\.(json|log|stringify)\b/g,
      '.<span style="color:#fbbf24">$1</span>',
    )
    .replace(/"([^"]*)"/g, '<span style="color:#4ade80">"$1"</span>');
}

function colorizePython(line: string): string {
  return line
    .replace(
      /^(import|from)\b/,
      '<span style="color:#c084fc">$1</span>',
    )
    .replace(
      /\b(requests|response|print)\b/g,
      '<span style="color:#60a5fa">$1</span>',
    )
    .replace(
      /\.(get|post|json)\b/g,
      '.<span style="color:#fbbf24">$1</span>',
    )
    .replace(/"([^"]*)"/g, '<span style="color:#4ade80">"$1"</span>');
}
