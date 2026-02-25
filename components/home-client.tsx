"use client";

import { useState } from "react";
import { Header } from "./header";
import { ApiGrid } from "./api-grid";
import { CompareProvider } from "@/lib/compare-context";
import type { ApiEntry } from "@/lib/types";

export type Columns = 1 | 2 | 3;

interface HomeClientProps {
  apis: ApiEntry[];
}

export function HomeClient({ apis }: HomeClientProps) {
  const [columns, setColumns] = useState<Columns>(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 3
  );

  return (
    <CompareProvider>
      <Header columns={columns} onColumnsChange={setColumns} />
      <main className="mt-10 space-y-2">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore public APIs
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse {apis.length.toLocaleString()} APIs with visual previews,
            sample data, and instant docs.
          </p>
        </div>
        <ApiGrid apis={apis} columns={columns} />
      </main>
    </CompareProvider>
  );
}
