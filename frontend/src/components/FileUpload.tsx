import { FileSpreadsheet, UploadCloud, X } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onError?: (message: string | null) => void;
  accept?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

const MAX_SIZE_MB = 25;

export function FileUpload({
  file,
  onFileSelect,
  onError,
  accept = ".csv,text/csv",
  hint = "CSV up to 25 MB",
  disabled = false,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const validate = (candidate: File) => {
    if (!candidate.name.toLowerCase().endsWith(".csv")) {
      onError?.("Invalid file type. Only .csv files are supported.");
      return false;
    }
    if (candidate.size === 0) {
      onError?.("The selected CSV appears to be empty.");
      return false;
    }
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
      onError?.(`File is larger than ${MAX_SIZE_MB} MB.`);
      return false;
    }
    onError?.(null);
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    const candidate = files?.[0];
    if (!candidate) return;
    if (validate(candidate)) onFileSelect(candidate);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-3xl border border-dashed p-8 text-center transition-colors sm:p-12",
          dragging ? "border-primary bg-primary/10" : "border-border bg-card/60",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary">
          <UploadCloud className="h-6 w-6" />
        </div>
        <p className="mt-5 text-base font-semibold">Drag & drop your CSV here</p>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          Browse file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {file && (
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Remove selected file"
            onClick={() => {
              onFileSelect(null);
              onError?.(null);
            }}
            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
