import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onInvalidFile?: (message: string) => void;
  accept?: string;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export function FileUpload({
  file,
  onFileSelect,
  onInvalidFile,
  accept = ".csv",
  disabled = false,
  hint = "CSV files only · max 25 MB",
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validate = (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith(".csv")) {
      onInvalidFile?.("Unsupported file type. Please upload a .csv file.");
      return;
    }
    if (candidate.size === 0) {
      onInvalidFile?.("The selected file is empty. Please upload a CSV with records.");
      return;
    }
    onFileSelect(candidate);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validate(dropped);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border bg-card/40",
          disabled && "opacity-60",
        )}
      >
        <UploadCloud className="h-8 w-8 text-primary" />
        <p className="mt-4 text-base">Drag & drop your dataset here</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) validate(selected);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="mt-6 rounded-full border border-border bg-secondary px-5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed"
        >
          Browse file
        </button>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm">{file.name}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Remove file"
            disabled={disabled}
            onClick={() => onFileSelect(null)}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
