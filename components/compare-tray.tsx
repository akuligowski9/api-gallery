"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getCategoryEmoji } from "@/lib/categories";

interface CompareTrayProps {
  onCompare: () => void;
}

export function CompareTray({ onCompare }: CompareTrayProps) {
  const { selectedApis, removeApi, clearAll } = useCompare();
  const count = selectedApis.length;

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/90 shadow-2xl ring-1 ring-border/50 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
            {/* Selected API chips */}
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <AnimatePresence mode="popLayout">
                {selectedApis.map((api) => (
                  <motion.span
                    key={api.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-3 py-1.5 text-sm ring-1 ring-foreground/10"
                  >
                    <span>{getCategoryEmoji(api.Category)}</span>
                    <span className="max-w-[120px] truncate font-medium">
                      {api.API}
                    </span>
                    <button
                      onClick={() => removeApi(api.slug)}
                      className="ml-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear all
              </button>
              <button
                onClick={onCompare}
                disabled={count < 2}
                className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-all hover:bg-foreground/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Compare &rarr;
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
