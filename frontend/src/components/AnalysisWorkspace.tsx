import { useState } from "react";
import {
  Activity,
  BarChart3,
  FileWarning,
  Gauge,
  Layers,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AlertBox } from "@/components/AlertBox";
import { ChartContainer } from "@/components/ChartContainer";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { FileUpload } from "@/components/FileUpload";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MetricCard } from "@/components/MetricCard";
import { ResultCard } from "@/components/ResultCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import type { AnalysisSummary, DistributionPoint, RecordRow } from "@/lib/placeholder-data";

// Import API service functions
import { uploadNetworkCSV, uploadMalwareCSV } from "@/services/api";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const columns: DataTableColumn<RecordRow>[] = [
  { key: "id", header: "Record" },
  { key: "source", header: "Source" },
  { key: "label", header: "Predicted label" },
  { key: "confidence", header: "Confidence", align: "right" },
  { key: "severity", header: "Severity", align: "right" },
];

type Status = "idle" | "loading" | "success" | "error";

interface AnalysisWorkspaceProps {
  eyebrow: string;
  title: string;
  description: string;
  predictionLabel: string;
  riskLabel: string;
  summary: AnalysisSummary;
  distribution: DistributionPoint[];
  rows: RecordRow[];
  endpoint: string;
}

// Helper to parse CSV rows client-side to extract fields for the "Source" column in the table
const parseCSVForSource = async (file: File, isNetwork: boolean): Promise<string[]> => {
  try {
    const text = await file.text();
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
    
    // Find column indexes
    let sourceColIdx = -1;
    let destColIdx = -1;
    let protoColIdx = -1;
    let serviceColIdx = -1;
    let nameColIdx = -1;

    headers.forEach((header, idx) => {
      if (header.includes("src_ip") || header.includes("source_ip") || header.includes("srcip")) {
        sourceColIdx = idx;
      } else if (header.includes("dst_ip") || header.includes("dest_ip") || header.includes("dstip")) {
        destColIdx = idx;
      } else if (header.includes("protocol") || header.includes("proto")) {
        protoColIdx = idx;
      } else if (header.includes("service")) {
        serviceColIdx = idx;
      } else if (header === "name" || header === "filename" || header === "file_name" || header === "hash" || header === "sha256") {
        nameColIdx = idx;
      }
    });

    const sources: string[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (isNetwork) {
        if (sourceColIdx !== -1 && destColIdx !== -1) {
          sources.push(`${values[sourceColIdx] || '10.0.0.1'} → ${values[destColIdx] || '10.0.0.2'}`);
        } else if (protoColIdx !== -1 && serviceColIdx !== -1) {
          sources.push(`${(values[protoColIdx] || 'TCP').toUpperCase()} → ${values[serviceColIdx] || 'http'}`);
        } else {
          const protoVal = protoColIdx !== -1 ? values[protoColIdx] : 'TCP';
          const serviceVal = serviceColIdx !== -1 ? values[serviceColIdx] : 'http';
          sources.push(`${protoVal.toUpperCase()} → ${serviceVal}`);
        }
      } else {
        if (nameColIdx !== -1) {
          sources.push(values[nameColIdx] || `sample_${i}.exe`);
        } else {
          sources.push(`sample_${i}.exe`);
        }
      }
    }
    return sources;
  } catch (e) {
    console.error("Error parsing CSV:", e);
    return [];
  }
};

export function AnalysisWorkspace({
  eyebrow,
  title,
  description,
  predictionLabel,
  riskLabel,
  summary,
  distribution,
  rows,
  endpoint,
}: AnalysisWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("Waiting for the detection service...");
  const [error, setError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<{
    summary: AnalysisSummary;
    distribution: DistributionPoint[];
    rows: RecordRow[];
  } | null>(null);

  const showResults = status === "success";

  const handleAnalyze = async () => {
    if (!file) {
      setError("Select a CSV file before running the analysis.");
      setStatus("error");
      return;
    }

    // Client-side validation checks
    if (!file.name.endsWith(".csv")) {
      setStatus("error");
      setError("Invalid file format. Please upload a standard CSV file.");
      return;
    }
    if (file.size === 0) {
      setStatus("error");
      setError("The uploaded CSV file is empty. Please upload a valid CSV dataset.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setStatus("error");
      setError("File exceeds the 25 MB limit. Please upload a smaller dataset.");
      return;
    }

    setError(null);
    setStatus("loading");
    setStatusMessage("Uploading and analyzing dataset...");

    const startTime = performance.now();

    try {
      const isNetwork = endpoint.includes("network") || title.toLowerCase().includes("network");
      
      const onWakeUp = (msg: string) => {
        setStatusMessage(msg);
      };

      const apiResponse = isNetwork 
        ? await uploadNetworkCSV(file, onWakeUp)
        : await uploadMalwareCSV(file, onWakeUp);

      const endTime = performance.now();
      const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(2);

      // Parse the CSV client-side to dynamically extract "Source" column strings
      const csvSources = await parseCSVForSource(file, isNetwork);

      // Compute statistics and chart inputs dynamically from backend results array
      const counts: Record<string, number> = {};
      apiResponse.results.forEach((r) => {
        counts[r.prediction] = (counts[r.prediction] || 0) + 1;
      });

      // Distribution data format (counts for recharts)
      const dynamicDistribution: DistributionPoint[] = Object.entries(counts).map(([name, count]) => ({
        name,
        value: count,
      }));

      // Rows for DataTable component mapping
      const dynamicRows: RecordRow[] = apiResponse.results.map((r, idx) => {
        const fallbackId = isNetwork 
          ? `FLW-${String(r.row_index + 121).padStart(5, '0')}`
          : `SMP-${String(r.row_index + 451).padStart(4, '0')}`;
        
        const fallbackSource = isNetwork 
          ? `10.0.4.${18 + idx} → 172.16.2.9`
          : `sample_${idx + 1}.exe`;

        return {
          id: fallbackId,
          source: csvSources[idx] || fallbackSource,
          label: r.prediction,
          confidence: `${(r.confidence * 100).toFixed(1)}%`,
          severity: r.risk_level,
        };
      });

      // Count threat flagged records (non-benign/normal connect logs)
      const flaggedCount = apiResponse.results.filter((r) => {
        const lowerLabel = r.prediction.toLowerCase();
        return (
          !lowerLabel.includes("normal") &&
          !lowerLabel.includes("benign") &&
          !lowerLabel.includes("class_0")
        );
      }).length;

      // Determine risk tone based on priority
      let riskTone: "success" | "warning" | "danger" = "success";
      if (apiResponse.risk_level === "Medium") {
        riskTone = "warning";
      } else if (["High", "Critical"].includes(apiResponse.risk_level)) {
        riskTone = "danger";
      }

      const dynamicSummary: AnalysisSummary = {
        prediction: apiResponse.prediction,
        confidence: apiResponse.confidence,
        risk: apiResponse.risk_level,
        riskTone,
        recommendation: apiResponse.recommendation,
        records: apiResponse.total_samples,
        flagged: flaggedCount,
        processingTime: `${elapsedSeconds}s`,
      };

      setLiveData({
        summary: dynamicSummary,
        distribution: dynamicDistribution,
        rows: dynamicRows,
      });

      setStatus("success");
    } catch (err: any) {
      console.error("API threat detection error:", err);
      setStatus("error");
      setError(err.message || "An unexpected error occurred while communicating with the threat service.");
    }
  };

  const activeSummary = liveData ? liveData.summary : summary;
  const activeDistribution = liveData ? liveData.distribution : distribution;
  const activeRows = liveData ? liveData.rows : rows;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="surface-panel rounded-3xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold">Upload dataset</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Provide a preprocessed CSV export. The file is passed straight through to the
            detection service — nothing is stored in the browser.
          </p>

          <FileUpload
            className="mt-6"
            file={file}
            onFileSelect={(next) => {
              setFile(next);
              setStatus("idle");
              setLiveData(null);
            }}
            onError={(message) => {
              setError(message);
              setStatus(message ? "error" : "idle");
              setLiveData(null);
            }}
          />

          <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <p className="min-w-0 truncate font-mono text-xs text-muted-foreground">
              POST {endpoint}
            </p>
            <Button
              className="shrink-0"
              onClick={handleAnalyze}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Analyzing…" : "Analyze"}
            </Button>
          </div>

          {status === "loading" && (
            <div className="mt-6 rounded-2xl border border-border bg-secondary/40 py-8">
              <LoadingSpinner label={statusMessage} />
            </div>
          )}

          {status === "error" && error && (
            <AlertBox className="mt-6" variant="error" title="Upload could not be processed">
              {error}
            </AlertBox>
          )}

          {showResults && (
            <AlertBox className="mt-6" variant="success" title="Analysis complete">
              Found {activeSummary.flagged} potential threats across {activeSummary.records} analyzed sample records.
            </AlertBox>
          )}
        </div>

        <div className="space-y-4">
          <AlertBox variant="info" title="Expected format">
            UTF-8 encoded CSV with a header row. Column order must match the model's feature
            schema.
          </AlertBox>
          <AlertBox variant="warning" title="Common failures">
            Empty files, non-CSV uploads, malformed rows, and unreachable API endpoints all
            surface here as inline errors.
          </AlertBox>
          <div className="surface-panel rounded-2xl p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Pipeline status
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {["File validation", "Feature extraction", "Model inference", "Report assembly"].map(
                (step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary font-mono text-[11px] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 truncate text-muted-foreground">{step}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14 space-y-6">
        <ResultCard
          title="Detection summary"
          subtitle="Primary model output for the uploaded dataset"
          badge={showResults ? "Live Analysis" : "Awaiting run"}
        >
          {showResults ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label={predictionLabel}
                value={activeSummary.prediction}
                icon={ShieldAlert}
                tone="danger"
              />
              <MetricCard
                label="Confidence score"
                value={`${Math.round(activeSummary.confidence * 100)}%`}
                icon={Gauge}
              />
              <MetricCard
                label={riskLabel}
                value={activeSummary.risk}
                icon={Activity}
                tone={activeSummary.riskTone}
              />
              <MetricCard
                label="Records analyzed"
                value={activeSummary.records.toLocaleString()}
                hint={`${activeSummary.flagged.toLocaleString()} flagged`}
                icon={Layers}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[predictionLabel, "Confidence score", riskLabel, "Records analyzed"].map((label) => (
                <MetricCard key={label} label={label} value="—" hint="Pending analysis" />
              ))}
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm font-semibold">Recommendation</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {showResults
                ? activeSummary.recommendation
                : "Mitigation guidance returned by the API will appear here after a successful run."}
            </p>
          </div>
        </ResultCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <ChartContainer
            title="Class distribution"
            description="Share of predicted classes across the dataset"
            loading={status === "loading"}
            empty={!showResults}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {activeDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer
            title="Detections per class"
            description="Absolute counts by predicted label"
            loading={status === "loading"}
            empty={!showResults}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeDistribution}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-secondary)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-foreground)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Flagged records"
            value={showResults ? activeSummary.flagged.toLocaleString() : "—"}
            icon={FileWarning}
            tone={showResults ? "warning" : "default"}
          />
          <MetricCard
            label="Clean records"
            value={showResults ? (activeSummary.records - activeSummary.flagged).toLocaleString() : "—"}
            icon={BarChart3}
          />
          <MetricCard
            label="Processing time"
            value={showResults ? activeSummary.processingTime : "—"}
            hint="Reported by the API"
            icon={Activity}
          />
        </div>

        <DataTable
          caption="Per-record results"
          columns={columns}
          rows={showResults ? activeRows : []}
          loading={status === "loading"}
          emptyLabel="Run an analysis to populate the record-level table."
        />
      </div>
    </div>
  );
}
