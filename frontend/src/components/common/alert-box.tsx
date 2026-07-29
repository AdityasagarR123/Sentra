import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AlertTone = "info" | "success" | "warning" | "error";

const tones = {
  info: { icon: Info, cls: "border-border bg-muted/40 text-foreground", accent: "text-primary" },
  success: {
    icon: CheckCircle2,
    cls: "border-success/30 bg-success/10 text-foreground",
    accent: "text-success",
  },
  warning: {
    icon: AlertTriangle,
    cls: "border-warning/30 bg-warning/10 text-foreground",
    accent: "text-warning",
  },
  error: {
    icon: XCircle,
    cls: "border-destructive/40 bg-destructive/10 text-foreground",
    accent: "text-destructive",
  },
} as const;

interface AlertBoxProps {
  tone?: AlertTone;
  title: string;
  children?: ReactNode;
  className?: string;
}

export function AlertBox({ tone = "info", title, children, className }: AlertBoxProps) {
  const { icon: Icon, cls, accent } = tones[tone];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", cls, className)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", accent)} />
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {children && <div className="text-sm text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
