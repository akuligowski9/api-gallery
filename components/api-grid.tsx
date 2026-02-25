"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { SearchBar } from "./search-bar";
import { CategoryChips } from "./category-chips";
import { ApiCard } from "./api-card";
import { searchApis } from "@/lib/search";
import { getCategoriesForFilter } from "@/lib/categories";
import type { ApiEntry } from "@/lib/types";

interface ApiGridProps {
  apis: ApiEntry[];
}

export function ApiGrid({ apis }: ApiGridProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(() => {
    let result = apis;

    // Apply category filter
    const categories = getCategoriesForFilter(activeFilter);
    if (categories) {
      result = result.filter((api) => categories.includes(api.Category));
    }

    // Apply search
    result = searchApis(result, query);

    // Sort: featured first, then alphabetically
    result.sort((a, b) => {
      const aFeatured = a.preview ? 0 : 1;
      const bFeatured = b.preview ? 0 : 1;
      if (aFeatured !== bFeatured) return aFeatured - bFeatured;
      return a.API.localeCompare(b.API);
    });

    return result;
  }, [apis, query, activeFilter]);

  return (
    <div className="space-y-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        resultCount={filtered.length}
      />

      <CategoryChips
        selected={activeFilter}
        onSelect={(cat) => {
          setActiveFilter(cat);
          setQuery("");
        }}
      />

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No APIs found</p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((api, i) => (
              <ApiCard
                key={api.slug}
                api={api}
                index={i}
                featured={!!api.preview}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
