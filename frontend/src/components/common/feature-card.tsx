import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  index?: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "gloss group relative rounded-2xl border border-border bg-card/40 p-6 hover:bg-card/60",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        {index && <span className="font-mono text-[11px] text-muted-foreground">{index}</span>}
      </div>
      <h3 className="mt-5 text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
