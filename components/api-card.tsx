"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryEmoji } from "@/lib/categories";
import { AuthBadge } from "./auth-badge";
import { PreviewRenderer } from "./previews";
import type { ApiEntry } from "@/lib/types";

interface ApiCardProps {
  api: ApiEntry;
  index: number;
  featured?: boolean;
}

export function ApiCard({ api, index, featured }: ApiCardProps) {
  const emoji = getCategoryEmoji(api.Category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.03, 0.6),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/${api.slug}`} className="group block h-full">
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-2xl",
            "bg-white ring-1 ring-black/[0.06]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.08] hover:ring-black/[0.1]",
            "dark:bg-white/[0.04] dark:ring-white/[0.06]",
            "dark:hover:bg-white/[0.06] dark:hover:shadow-white/[0.03] dark:hover:ring-white/[0.12]",
          )}
        >
          {/* Preview area for featured cards */}
          {featured && api.preview && (
            <div className="relative overflow-hidden">
              <PreviewRenderer data={api.preview} compact />
            </div>
          )}

          {/* Card body */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            {/* Header row */}
            <div className="flex items-start gap-3">
              {!featured && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-lg">
                  {emoji}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold leading-tight text-foreground">
                  {api.API}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {api.Category}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60" />
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {api.Description}
            </p>

            {/* Footer */}
            <div className="mt-auto flex items-center gap-2 pt-1">
              <AuthBadge auth={api.Auth} />
              {api.HTTPS && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/50">
                  <Shield className="h-3 w-3" />
                  HTTPS
                </span>
              )}
              {api.Cors === "yes" && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/50">
                  <Globe className="h-3 w-3" />
                  CORS
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
