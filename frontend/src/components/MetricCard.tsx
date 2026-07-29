import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const toneMap: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("surface-panel rounded-2xl p-5", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <p className="min-w-0 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" />}
      </div>
      <p className={cn("mt-3 truncate text-2xl font-semibold sm:text-3xl", toneMap[tone])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
