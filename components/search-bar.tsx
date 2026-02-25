"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  resultCount,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center overflow-hidden rounded-2xl",
          "bg-white/80 shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.06]",
          "backdrop-blur-xl transition-shadow duration-300",
          "focus-within:shadow-xl focus-within:shadow-black/[0.08] focus-within:ring-black/[0.1]",
          "dark:bg-white/[0.06] dark:shadow-white/[0.02] dark:ring-white/[0.08]",
          "dark:focus-within:shadow-white/[0.04] dark:focus-within:ring-white/[0.15]",
        )}
      >
        <Search className="ml-5 h-5 w-5 shrink-0 text-muted-foreground/60" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search 1,500+ APIs..."
          className={cn(
            "flex-1 bg-transparent px-4 py-4 text-base outline-none",
            "placeholder:text-muted-foreground/40",
          )}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="mr-3 rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-black/[0.04] hover:text-foreground dark:hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="mr-5 shrink-0 text-xs text-muted-foreground/50">
          {resultCount.toLocaleString()} APIs
        </div>
      </div>
    </div>
  );
}
