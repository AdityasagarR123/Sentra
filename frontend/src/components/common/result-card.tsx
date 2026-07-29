import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  badge?: string;
  badgeTone?: "primary" | "warning" | "danger" | "muted";
  children: ReactNode;
  className?: string;
}

const badgeTones = {
  primary: "border-primary/40 bg-primary/10 text-primary",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-destructive/40 bg-destructive/10 text-destructive",
  muted: "border-border bg-muted text-muted-foreground",
} as const;

export function ResultCard({
  title,
  badge,
  badgeTone = "muted",
  children,
  className,
}: ResultCardProps) {
  return (
    <section
      className={cn(
        "gloss-static rounded-2xl border border-border bg-card/50 p-6 shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <h3 className="text-xl">{title}</h3>
        {badge && (
          <span
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]",
              badgeTones[badgeTone],
            )}
          >
            {badge}
          </span>
        )}
      </header>
      <div className="pt-5">{children}</div>
    </section>
  );
}
