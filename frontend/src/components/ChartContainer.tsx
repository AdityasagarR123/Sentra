import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

interface ChartContainerProps {
  title: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  description,
  loading = false,
  empty = false,
  emptyLabel = "Chart renders once analysis results are available.",
  children,
  className,
}: ChartContainerProps) {
  return (
    <div className={cn("surface-panel rounded-2xl p-5 sm:p-6", className)}>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="mt-5 h-64 w-full">
        {loading ? (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-border">
            <LoadingSpinner label="Rendering…" />
          </div>
        ) : empty ? (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-border px-6 text-center text-xs text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
