"use client";

import { cn } from "@/lib/utils";
import { FILTER_CATEGORIES } from "@/lib/categories";

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
  className?: string;
}

export function CategoryChips({
  selected,
  onSelect,
  className,
}: CategoryChipsProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 scrollbar-none",
        "-mx-4 px-4 sm:mx-0 sm:px-0",
        className,
      )}
    >
      {FILTER_CATEGORIES.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-foreground text-background shadow-md"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
