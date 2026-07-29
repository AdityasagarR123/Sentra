import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ title, subtitle, children, className }: ChartContainerProps) {
  return (
    <div className={cn("gloss-static rounded-2xl border border-border bg-card/50 p-5", className)}>
      <div className="mb-4">
        <p className="text-sm font-medium">{title}</p>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}
