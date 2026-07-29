import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AnalysisWorkspace } from "@/components/AnalysisWorkspace";
import { networkDistribution, networkRows, networkSummary } from "@/lib/placeholder-data";

export const Route = createFileRoute("/network-detection")({
  component: NetworkDetection,
  head: () => ({
    meta: [
      { title: "Network Intrusion Detection — SENTRA" },
      {
        name: "description",
        content:
          "Upload flow-level CSV exports and review intrusion predictions, confidence scores, risk levels and attack distribution.",
      },
      { property: "og:title", content: "Network Intrusion Detection — SENTRA" },
      {
        property: "og:description",
        content: "Batch intrusion detection with confidence, risk scoring and attack distribution.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/network-detection" },
    ],
    links: [{ rel: "canonical", href: "/network-detection" }],
  }),
});

function NetworkDetection() {
  return (
    <PageShell>
      <AnalysisWorkspace
        eyebrow="Module 01"
        title="Network Intrusion Detection"
        description="Upload a preprocessed flow export (CIC-IDS style features). Each flow is classified as benign or as an attack category, with confidence and risk scoring."
        predictionLabel="Predicted attack"
        riskLabel="Risk level"
        summary={networkSummary}
        distribution={networkDistribution}
        rows={networkRows}
        endpoint="/predict/network"
      />
    </PageShell>
  );
}
