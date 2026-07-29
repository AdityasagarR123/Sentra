import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" } as const;

export function LoadingSpinner({ label, size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} role="status">
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
