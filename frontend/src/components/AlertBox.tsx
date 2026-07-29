import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertBoxProps {
  variant?: AlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
}

const config = {
  info: { icon: Info, style: "border-primary/40 bg-primary/10 text-primary" },
  success: { icon: CheckCircle2, style: "border-success/40 bg-success/10 text-success" },
  warning: { icon: AlertTriangle, style: "border-warning/40 bg-warning/10 text-warning" },
  error: { icon: XCircle, style: "border-destructive/50 bg-destructive/10 text-destructive" },
} as const;

export function AlertBox({ variant = "info", title, children, className }: AlertBoxProps) {
  const { icon: Icon, style } = config[variant];
  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4", style, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        {children && (
          <div className="mt-1 text-sm text-muted-foreground">{children}</div>
        )}
      </div>
    </div>
  );
}
