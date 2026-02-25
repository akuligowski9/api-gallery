import Link from "next/link";
import { getCategoryEmoji } from "@/lib/categories";
import { AuthBadge } from "./auth-badge";
import type { ApiEntry } from "@/lib/types";

interface SimilarApisProps {
  apis: ApiEntry[];
}

export function SimilarApis({ apis }: SimilarApisProps) {
  if (apis.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Similar APIs</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <Link
            key={api.slug}
            href={`/${api.slug}`}
            className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/60"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-lg">
              {getCategoryEmoji(api.Category)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium group-hover:text-foreground">
                {api.API}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {api.Description}
              </p>
            </div>
            <AuthBadge auth={api.Auth} className="shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
