"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
}

interface InlineFilterProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  accentClass: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function InlineFilter({
  label,
  icon,
  value,
  options,
  onChange,
  accentClass,
  isOpen,
  onToggle,
  onClose,
}: InlineFilterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isActive = value !== "any";
  const selectedLabel = options.find((o) => o.value === value)?.label ?? label;

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all",
          isActive && accentClass
            ? accentClass
            : "bg-foreground/[0.04] text-muted-foreground hover:bg-foreground/[0.08] hover:text-foreground",
        )}
      >
        <span className="flex items-center justify-center">{icon}</span>
        <span>{isActive ? selectedLabel : label}</span>
        {isActive && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"
          />
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 opacity-50 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 min-w-[160px] rounded-xl bg-popover/95 backdrop-blur-lg p-1 shadow-xl ring-1 ring-border/50"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  value === option.value
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-popover-foreground hover:bg-accent/50",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border-2",
                    value === option.value
                      ? "border-foreground"
                      : "border-muted-foreground/40",
                  )}
                >
                  {value === option.value && (
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                  )}
                </span>
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
