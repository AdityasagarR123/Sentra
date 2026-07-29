import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">{title}</h2>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
