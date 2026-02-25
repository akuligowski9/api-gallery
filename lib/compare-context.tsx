"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ApiEntry } from "@/lib/types";

const MAX_COMPARE = 3;

interface CompareContextValue {
  selectedApis: ApiEntry[];
  addApi: (api: ApiEntry) => void;
  removeApi: (slug: string) => void;
  toggleApi: (api: ApiEntry) => void;
  clearAll: () => void;
  isSelected: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [selectedApis, setSelectedApis] = useState<ApiEntry[]>([]);

  const addApi = useCallback((api: ApiEntry) => {
    setSelectedApis((prev) => {
      if (prev.some((a) => a.slug === api.slug)) return prev;
      const next = [...prev, api];
      // FIFO: drop the oldest if over max
      if (next.length > MAX_COMPARE) next.shift();
      return next;
    });
  }, []);

  const removeApi = useCallback((slug: string) => {
    setSelectedApis((prev) => prev.filter((a) => a.slug !== slug));
  }, []);

  const toggleApi = useCallback((api: ApiEntry) => {
    setSelectedApis((prev) => {
      if (prev.some((a) => a.slug === api.slug)) {
        return prev.filter((a) => a.slug !== api.slug);
      }
      const next = [...prev, api];
      if (next.length > MAX_COMPARE) next.shift();
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedApis([]);
  }, []);

  const isSelected = useCallback(
    (slug: string) => selectedApis.some((a) => a.slug === slug),
    [selectedApis],
  );

  return (
    <CompareContext.Provider
      value={{ selectedApis, addApi, removeApi, toggleApi, clearAll, isSelected }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return ctx;
}
