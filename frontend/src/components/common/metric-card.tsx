import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "warning" | "danger";
  className?: string;
}

const tones = {
  default: "text-foreground",
  primary: "text-primary",
  warning: "text-warning",
  danger: "text-destructive",
} as const;

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("gloss rounded-xl border border-border bg-card/50 p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        {Icon && <Icon className={cn("h-4 w-4", tones[tone])} />}
      </div>
      <p className={cn("mt-3 font-display text-3xl leading-none", tones[tone])}>{value}</p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
