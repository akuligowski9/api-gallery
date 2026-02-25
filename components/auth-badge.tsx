import { Lock, Key, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthBadgeProps {
  auth: string;
  className?: string;
}

export function AuthBadge({ auth, className }: AuthBadgeProps) {
  const isOpen = !auth;
  const isKey = auth === "apiKey";
  const isOAuth = auth === "OAuth";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isOpen &&
          "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
        isKey &&
          "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
        isOAuth &&
          "bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400",
        !isOpen &&
          !isKey &&
          !isOAuth &&
          "bg-muted text-muted-foreground",
        className,
      )}
    >
      {isOpen ? (
        <Unlock className="h-3 w-3" />
      ) : isKey ? (
        <Key className="h-3 w-3" />
      ) : (
        <Lock className="h-3 w-3" />
      )}
      {isOpen ? "Free" : isKey ? "API Key" : isOAuth ? "OAuth" : auth}
    </span>
  );
}
