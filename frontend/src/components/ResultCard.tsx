import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}

export function ResultCard({ title, subtitle, badge, children, className }: ResultCardProps) {
  return (
    <section className={cn("surface-panel rounded-3xl p-6 sm:p-8", className)}>
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border pb-5">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold sm:text-xl">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {badge && (
          <span className="shrink-0 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            {badge}
          </span>
        )}
      </header>
      <div className="pt-6">{children}</div>
    </section>
  );
}
