import { Compass } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">API Explorer</h1>
          <p className="text-xs text-muted-foreground">
            Discover APIs visually
          </p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
}
