import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" } as const;

export function LoadingSpinner({ label, className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {label && (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
      )}
    </div>
  );
}
