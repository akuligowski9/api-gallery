"use client";

import { Unlock, Key, Lock, Globe, ShieldCheck } from "lucide-react";
import { FilterDropdown, type FilterOption } from "./filter-dropdown";
import { DEFAULT_FILTERS, countActiveFilters, type FilterState } from "@/lib/filters";

const AUTH_OPTIONS: FilterOption[] = [
  { value: "any", label: "Auth: Any" },
  { value: "free", label: "Free" },
  { value: "apiKey", label: "API Key" },
  { value: "OAuth", label: "OAuth" },
];

const HTTPS_OPTIONS: FilterOption[] = [
  { value: "any", label: "HTTPS: Any" },
  { value: "yes", label: "HTTPS Only" },
];

const CORS_OPTIONS: FilterOption[] = [
  { value: "any", label: "CORS: Any" },
  { value: "yes", label: "Enabled" },
  { value: "no", label: "Disabled" },
  { value: "unknown", label: "Unknown" },
];

const AUTH_ACCENT: Record<string, string> = {
  free: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  apiKey: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  OAuth: "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function authIcon(value: string) {
  if (value === "free") return <Unlock className="h-3.5 w-3.5" />;
  if (value === "apiKey") return <Key className="h-3.5 w-3.5" />;
  if (value === "OAuth") return <Lock className="h-3.5 w-3.5" />;
  return <Unlock className="h-3.5 w-3.5" />;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <>
      <FilterDropdown
        label="Auth"
        icon={authIcon(filters.auth)}
        value={filters.auth}
        options={AUTH_OPTIONS}
        onChange={(v) => onChange({ ...filters, auth: v as FilterState["auth"] })}
        accentClass={AUTH_ACCENT[filters.auth]}
      />

      <FilterDropdown
        label="HTTPS"
        icon={<ShieldCheck className="h-3.5 w-3.5" />}
        value={filters.https}
        options={HTTPS_OPTIONS}
        onChange={(v) => onChange({ ...filters, https: v as FilterState["https"] })}
        accentClass={
          filters.https !== "any"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : undefined
        }
      />

      <FilterDropdown
        label="CORS"
        icon={<Globe className="h-3.5 w-3.5" />}
        value={filters.cors}
        options={CORS_OPTIONS}
        onChange={(v) => onChange({ ...filters, cors: v as FilterState["cors"] })}
        accentClass={
          filters.cors !== "any"
            ? "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            : undefined
        }
      />

      {activeCount > 0 && (
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Clear
        </button>
      )}
    </>
  );
}
