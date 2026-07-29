import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyLabel?: string;
  caption?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading = false,
  emptyLabel = "No records to display yet.",
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("surface-panel overflow-hidden rounded-2xl", className)}>
      {caption && (
        <div className="border-b border-border px-5 py-4 text-sm font-semibold">{caption}</div>
      )}
      {loading ? (
        <div className="px-5 py-12">
          <LoadingSpinner label="Loading records…" />
        </div>
      ) : rows.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">{emptyLabel}</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/60">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
                      col.align === "right" ? "text-right" : "text-left",
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-border/70 transition-colors hover:bg-secondary/40">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-5 py-3",
                        col.align === "right" ? "text-right font-mono" : "text-left",
                      )}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
