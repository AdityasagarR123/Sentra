import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
