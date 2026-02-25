import { Lock, Key, Unlock } from "lucide-react";
import { createElement } from "react";

export function authAccent(value: string): string | null {
  switch (value) {
    case "free":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
    case "apiKey":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
    case "OAuth":
      return "bg-violet-500/15 text-violet-600 dark:text-violet-400";
    default:
      return null;
  }
}

export function authIcon(value: string): React.ReactNode {
  const cls = "h-3 w-3";
  if (value === "free") return createElement(Unlock, { className: cls });
  if (value === "apiKey") return createElement(Key, { className: cls });
  if (value === "OAuth") return createElement(Lock, { className: cls });
  return createElement(Unlock, { className: cls });
}
