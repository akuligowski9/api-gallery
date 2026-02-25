"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchFilterBar } from "./search-filter-bar";
import { CategoryChips } from "./category-chips";
import { ApiCard } from "./api-card";
import { CompareTray } from "./compare-tray";
import { CompareDrawer } from "./compare-drawer";
import { useCompare } from "@/lib/compare-context";
import { searchApis } from "@/lib/search";
import { getCategoriesForFilter } from "@/lib/categories";
import { applyFilters, DEFAULT_FILTERS, type FilterState } from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { ApiEntry } from "@/lib/types";
import type { Columns } from "./home-client";

const GRID_COLS: Record<Columns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

const PAGE_SIZE = 48;

interface ApiGridProps {
  apis: ApiEntry[];
  columns: Columns;
}

export function ApiGrid({ apis, columns }: ApiGridProps) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selectedApis } = useCompare();
  const trayVisible = selectedApis.length > 0;

  const filtered = useMemo(() => {
    let result = apis;

    // Apply category filter
    const categories = getCategoriesForFilter(activeFilter);
    if (categories) {
      result = result.filter((api) => categories.includes(api.Category));
    }

    // Apply attribute filters (auth, https, cors)
    result = applyFilters(result, filters);

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
  }, [apis, query, activeFilter, filters]);

  // Reset visible count when filters change
  const handleFilterChange = useCallback((cat: string) => {
    setActiveFilter(cat);
    setQuery("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleFiltersChange = useCallback((f: FilterState) => {
    setFilters(f);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remaining = filtered.length - visibleCount;

  return (
    <div className="space-y-6">
      <SearchFilterBar
        query={query}
        onQueryChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        resultCount={filtered.length}
      />

      <CategoryChips
        selected={activeFilter}
        onSelect={handleFilterChange}
      />

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No APIs found</p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Try a different search term or category
          </p>
        </div>
      ) : (
        <>
          <div className={cn("grid gap-4", GRID_COLS[columns], trayVisible && "pb-20")}>
            <AnimatePresence mode="popLayout">
              {visible.map((api, i) => (
                <ApiCard
                  key={api.slug}
                  api={api}
                  index={i}
                  featured={!!api.preview}
                />
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <motion.div
              className={cn("flex justify-center pt-4 pb-2", trayVisible && "pb-20")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="group flex items-center gap-2 rounded-full bg-foreground/5 px-8 py-3 text-sm font-medium text-foreground transition-all hover:bg-foreground/10 hover:shadow-md active:scale-[0.98]"
              >
                Show more
                <span className="text-xs text-muted-foreground">
                  ({Math.min(remaining, PAGE_SIZE)} of {remaining} remaining)
                </span>
              </button>
            </motion.div>
          )}
        </>
      )}

      <CompareTray onCompare={() => setDrawerOpen(true)} />
      <CompareDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
