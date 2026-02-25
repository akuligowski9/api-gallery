"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Shield,
  ShieldOff,
  Globe,
  GlobeIcon,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getCategoryEmoji } from "@/lib/categories";
import { AuthBadge } from "./auth-badge";
import { PreviewRenderer } from "./previews";
import { cn } from "@/lib/utils";
import type { ApiEntry } from "@/lib/types";

interface CompareDrawerProps {
  open: boolean;
  onClose: () => void;
}

function StatusIcon({
  value,
  type,
}: {
  value: boolean | string;
  type: "https" | "cors";
}) {
  if (type === "https") {
    return value ? (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
        <Shield className="h-4 w-4" /> Yes
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
        <ShieldOff className="h-4 w-4" /> No
      </span>
    );
  }

  // CORS
  if (value === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
        <Globe className="h-4 w-4" /> Yes
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400">
        <GlobeIcon className="h-4 w-4" /> No
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <HelpCircle className="h-4 w-4" /> Unknown
    </span>
  );
}

function CompareColumn({ api }: { api: ApiEntry }) {
  const emoji = getCategoryEmoji(api.Category);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <div className="mb-4 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{api.API}</h3>
            <p className="text-sm text-muted-foreground">{api.Category}</p>
          </div>
        </div>
      </div>

      {/* Comparison rows */}
      <div className="space-y-0">
        <CompareRow label="Auth" odd>
          <AuthBadge auth={api.Auth} />
        </CompareRow>

        <CompareRow label="HTTPS">
          <StatusIcon value={api.HTTPS} type="https" />
        </CompareRow>

        <CompareRow label="CORS" odd>
          <StatusIcon value={api.Cors} type="cors" />
        </CompareRow>

        <CompareRow label="Description">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {api.Description}
          </p>
        </CompareRow>

        {api.preview && (
          <CompareRow label="Preview" odd>
            <div className="overflow-hidden rounded-xl ring-1 ring-border/30">
              <PreviewRenderer data={api.preview} compact />
            </div>
          </CompareRow>
        )}

        <CompareRow label="Links" odd={!api.preview}>
          <div className="flex flex-wrap gap-2">
            <a
              href={api.Link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
            >
              <ExternalLink className="h-3 w-3" />
              View docs
            </a>
            <a
              href={`/${api.slug}`}
              className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
            >
              View details
            </a>
          </div>
        </CompareRow>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  odd,
  children,
}: {
  label: string;
  odd?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg px-3 py-3",
        odd ? "bg-muted/30" : "bg-transparent",
      )}
    >
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
        {label}
      </p>
      {children}
    </div>
  );
}

export function CompareDrawer({ open, onClose }: CompareDrawerProps) {
  const { selectedApis } = useCompare();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-6 py-4">
              <h2 className="text-xl font-bold">Compare APIs</h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              <div
                className={cn(
                  "mx-auto grid max-w-6xl gap-6",
                  selectedApis.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-3",
                )}
              >
                {selectedApis.map((api) => (
                  <CompareColumn key={api.slug} api={api} />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
