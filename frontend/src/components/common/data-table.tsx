import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";

export interface DataTableColumn<T> {
  key: keyof T & string;
  header: string;
  align?: "left" | "right";
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  emptyMessage = "No records to display yet.",
  className,
}: DataTableProps<T>) {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset pagination when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Toggle sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortOrder === "asc") {
        setSortOrder("desc");
      } else if (sortOrder === "desc") {
        setSortKey(null);
        setSortOrder(null);
      } else {
        setSortOrder("asc");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // 1. Filter rows by search query
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;
    const query = searchQuery.toLowerCase().trim();
    return rows.filter((row) => {
      return Object.entries(row).some(([key, val]) => {
        // Skip ID column in search query if you want, but searching all is generally better
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [rows, searchQuery]);

  // 2. Sort filtered rows
  const sortedRows = useMemo(() => {
    if (!sortKey || !sortOrder) return filteredRows;
    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      // Handle numerical values
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle percentage strings (e.g. "97.1%")
      const aClean = String(aVal).replace("%", "");
      const bClean = String(bVal).replace("%", "");
      const aNum = parseFloat(aClean);
      const bNum = parseFloat(bClean);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
      }

      // Handle standard strings
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortOrder === "asc" ? -1 : 1;
      if (aStr > bStr) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRows, sortKey, sortOrder]);

  // 3. Paginate sorted rows
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  // Ensure current page does not exceed total pages on filter change
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="space-y-4">
      {/* Search and Table Info Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-full border border-border bg-card/60 py-2 pr-4 pl-9 text-xs transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
        <div className="text-right text-xs text-muted-foreground">
          Showing {sortedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, sortedRows.length)} of {sortedRows.length} results
          {searchQuery && " (filtered)"}
        </div>
      </div>

      {/* Responsive Table Layout */}
      <div className={cn("overflow-x-auto rounded-xl border border-border bg-card/10", className)}>
        <table className="w-full min-w-[560px] text-sm">
          <thead className="bg-muted/30">
            <tr className="border-b border-border/80">
              {columns.map((c) => {
                const isSortedThis = sortKey === c.key;
                return (
                  <th
                    key={c.key}
                    onClick={() => c.sortable !== false && handleSort(c.key)}
                    className={cn(
                      "px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors",
                      c.sortable !== false && "cursor-pointer hover:bg-muted/50 hover:text-foreground",
                      c.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    <div className={cn("flex items-center gap-1.5", c.align === "right" ? "justify-end" : "justify-start")}>
                      {c.header}
                      {c.sortable !== false && (
                        <span>
                          {isSortedThis ? (
                            sortOrder === "asc" ? (
                              <ArrowUp className="h-3 w-3 text-primary" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-muted-foreground/45 opacity-0 hover:opacity-100 group-hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, i) => (
                <tr key={i} className="border-b border-border/50 last:border-none hover:bg-muted/20">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        "px-4 py-3 text-xs",
                        c.align === "right" ? "text-right font-mono" : "text-left text-foreground/95"
                      )}
                    >
                      {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-border bg-card/85 px-2 py-1 text-xs focus:outline-none"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs transition-opacity hover:opacity-95 disabled:opacity-40"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs transition-opacity hover:opacity-95 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <span className="mx-2 text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs transition-opacity hover:opacity-95 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs transition-opacity hover:opacity-95 disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
