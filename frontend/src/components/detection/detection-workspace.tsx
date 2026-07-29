import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Gauge, ShieldAlert, Table2 } from "lucide-react";

import { AlertBox } from "@/components/common/alert-box";
import { ChartContainer } from "@/components/common/chart-container";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { FileUpload } from "@/components/common/file-upload";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { MetricCard } from "@/components/common/metric-card";
import { ResultCard } from "@/components/common/result-card";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn } from "@/components/ui/words-pull-up";

// Import API service functions
import { uploadNetworkCSV, uploadMalwareCSV, type PredictionResponse } from "@/services/api";

export interface DistributionPoint {
  name: string;
  value: number;
}

export interface DetectionRow extends Record<string, unknown> {
  id: string;
  label: string;
  confidence: string;
  severity: string;
}

export interface DetectionWorkspaceProps {
  eyebrow: string;
  title: string;
  description: string;
  uploadHint: string;
  primaryLabel: string;
  primaryValue: string;
  metrics: { label: string; value: string; hint?: string }[];
  recommendation: string;
  distribution: DistributionPoint[];
  summary: DistributionPoint[];
  rows: DetectionRow[];
  tableTitle: string;
  endpoint: string;
}

interface LocalResultState extends PredictionResponse {
  elapsedSeconds: string;
  flaggedCount: number;
  distribution: DistributionPoint[];
  summary: DistributionPoint[];
  rows: DetectionRow[];
}

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const columns: DataTableColumn<DetectionRow>[] = [
  { key: "id", header: "Record" },
  { key: "label", header: "Predicted label" },
  { key: "confidence", header: "Confidence", align: "right" },
  { key: "severity", header: "Severity", align: "right" },
];

type Status = "idle" | "loading" | "success" | "error";

export function DetectionWorkspace(props: DetectionWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("Analyzing uploaded data...");
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<LocalResultState | null>(null);

  const analyze = async () => {
    if (!file) {
      setStatus("error");
      setError("No file selected. Upload a CSV dataset before running the analysis.");
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
    setStatusMessage("Analyzing uploaded data...");

    const startTime = performance.now();

    try {
      let apiResponse: PredictionResponse;
      const isNetwork = props.endpoint.includes("network") || props.title.toLowerCase().includes("network");

      // Custom callback to handle Render's dynamic wakeup updates
      const onWakeUp = (msg: string) => {
        setStatusMessage(msg);
      };

      if (isNetwork) {
        apiResponse = await uploadNetworkCSV(file, onWakeUp);
      } else {
        apiResponse = await uploadMalwareCSV(file, onWakeUp);
      }

      const endTime = performance.now();
      const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(2);

      // Compute statistics and chart inputs dynamically from backend results array
      const counts: Record<string, number> = {};
      apiResponse.results.forEach((r) => {
        counts[r.prediction] = (counts[r.prediction] || 0) + 1;
      });

      const total = apiResponse.results.length;

      // Distribution data format (percentages for pie chart)
      const distribution: DistributionPoint[] = Object.entries(counts).map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
      }));

      // Summary data format (counts for bar chart)
      const summary: DistributionPoint[] = Object.entries(counts).map(([name, count]) => ({
        name,
        value: count,
      }));

      // Rows for DataTable component mapping
      const rows: DetectionRow[] = apiResponse.results.map((r) => ({
        id: `Record #${r.row_index + 1}`,
        label: r.prediction,
        confidence: `${(r.confidence * 100).toFixed(1)}%`,
        severity: r.risk_level,
      }));

      // Count threat flagged records (non-benign/normal connect logs)
      const flaggedCount = apiResponse.results.filter((r) => {
        const lowerLabel = r.prediction.toLowerCase();
        return (
          !lowerLabel.includes("normal") &&
          !lowerLabel.includes("benign") &&
          !lowerLabel.includes("class_0")
        );
      }).length;

      // Update state with structured dataset
      setResultData({
        ...apiResponse,
        elapsedSeconds,
        flaggedCount,
        distribution,
        summary,
        rows,
      });

      setStatus("success");
    } catch (err: any) {
      console.error("API threat detection error:", err);
      setStatus("error");
      setError(err.message || "An unexpected error occurred while communicating with the threat service.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <SectionHeader
        eyebrow={props.eyebrow}
        title={props.title}
        description={props.description}
        action={
          <span className="rounded-full border border-border bg-card/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {props.endpoint}
          </span>
        }
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Step 1 Upload Panel */}
        <FadeIn className="space-y-5">
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <p className="eyebrow">Step 01 — Upload dataset</p>
            <FileUpload
              className="mt-5"
              file={file}
              hint={props.uploadHint}
              disabled={status === "loading"}
              onFileSelect={(f) => {
                setFile(f);
                setStatus("idle");
                setError(null);
              }}
              onInvalidFile={(msg) => {
                setStatus("error");
                setError(msg);
              }}
            />
            <button
              type="button"
              onClick={analyze}
              disabled={status === "loading"}
              className="mt-5 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {status === "loading" ? "Analyzing…" : "Analyze"}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Results are parsed directly from the live API responses.
            </p>
          </div>

          {status === "error" && error && (
            <AlertBox tone="error" title="Analysis error occurred">
              {error}
            </AlertBox>
          )}
          {status === "success" && resultData && (
            <AlertBox tone="success" title="Analysis complete">
              Found {resultData.flaggedCount} potential threats across {resultData.total_samples} analyzed sample records.
            </AlertBox>
          )}
        </FadeIn>

        {/* Results Workspace Area */}
        <div className="space-y-8">
          {status === "loading" ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-border bg-card/40 p-6">
              <LoadingSpinner size="lg" label={statusMessage} />
            </div>
          ) : resultData && status === "success" ? (
            <>
              {/* Prediction Summary Result Card */}
              <FadeIn>
                <ResultCard
                  title="Prediction summary"
                  badge="Live Analysis"
                  badgeTone="primary"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <MetricCard
                      label={props.primaryLabel}
                      value={resultData.prediction}
                      icon={ShieldAlert}
                      tone={
                        resultData.risk_level === "Low" 
                          ? "muted" 
                          : resultData.risk_level === "Medium" 
                            ? "warning" 
                            : "primary"
                      }
                    />
                    <MetricCard
                      label="Confidence score"
                      value={`${(resultData.confidence * 100).toFixed(1)}%`}
                      hint="Top probability score"
                      icon={Gauge}
                    />
                    <MetricCard
                      label={props.primaryLabel.toLowerCase().includes("malware") ? "Threat severity" : "Risk level"}
                      value={resultData.risk_level}
                      hint="Aggregated severity index"
                      icon={ShieldAlert}
                      tone={
                        resultData.risk_level === "Low"
                          ? "muted"
                          : ["High", "Critical"].includes(resultData.risk_level)
                            ? "primary"
                            : "warning"
                      }
                    />
                    <MetricCard
                      label="Analyzed samples"
                      value={resultData.total_samples.toLocaleString()}
                      hint="Total rows in CSV"
                      icon={Table2}
                    />
                  </div>
                  <div className="mt-5 rounded-xl border border-border bg-muted/30 p-5">
                    <p className="eyebrow">Actionable Recommendation</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {resultData.recommendation}
                    </p>
                  </div>
                </ResultCard>
              </FadeIn>

              {/* Dynamic Charts Section (Only shown for batch/multi-row files) */}
              {resultData.total_samples > 1 && resultData.distribution.length > 0 && (
                <FadeIn className="grid gap-6 xl:grid-cols-2">
                  <ChartContainer title="Class distribution" subtitle="Attack class distribution ratio">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resultData.distribution}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={50}
                          outerRadius={85}
                          paddingAngle={3}
                          stroke="none"
                        >
                          {resultData.distribution.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <ChartContainer title="Summary statistics" subtitle="Total occurrences count">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resultData.summary}>
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                          stroke="var(--muted-foreground)"
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                          stroke="var(--muted-foreground)"
                        />
                        <Tooltip
                          cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="value" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </FadeIn>
              )}

              {/* Record Level Detailed Data Table */}
              <FadeIn>
                <ResultCard title={props.tableTitle} badge="Live Results" badgeTone="primary">
                  <div className="mb-4 grid gap-4 sm:grid-cols-3">
                    <MetricCard
                      label="Analyzed records"
                      value={resultData.total_samples.toLocaleString()}
                      icon={Table2}
                    />
                    <MetricCard 
                      label="Flagged threats" 
                      value={resultData.flaggedCount.toLocaleString()} 
                      tone={resultData.flaggedCount > 0 ? "warning" : "muted"} 
                    />
                    <MetricCard 
                      label="Processing speed" 
                      value={`${resultData.elapsedSeconds} s`} 
                      icon={Activity} 
                    />
                  </div>
                  <DataTable columns={columns} rows={resultData.rows} />
                </ResultCard>
              </FadeIn>
            </>
          ) : (
            // Awaiting Analysis Visual Card
            <FadeIn>
              <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-border bg-card/15 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary">
                  <Gauge className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-medium">Awaiting Dataset Analysis</h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                  No active threat analysis exists. Upload a standard CSV dataset of connection logs (for Network detection) or behavioral features (for Malware detection) on the left to inspect threat alerts, class distributions, and recommended actions.
                </p>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
