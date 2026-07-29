import { createFileRoute } from "@tanstack/react-router";
import { DetectionWorkspace } from "@/components/detection/detection-workspace";

export const Route = createFileRoute("/network-detection")({
  head: () => ({
    meta: [
      { title: "Network Intrusion Detection — SentinelAI" },
      {
        name: "description",
        content:
          "Upload network flow CSV datasets and review intrusion predictions, confidence, risk level and attack distribution.",
      },
      { property: "og:title", content: "Network Intrusion Detection — SentinelAI" },
      {
        property: "og:description",
        content: "Batch classification of network connection records into benign and attack classes.",
      },
    ],
  }),
  component: NetworkDetection,
});

function NetworkDetection() {
  return (
    <DetectionWorkspace
      eyebrow="Detector 01"
      title="Network Intrusion Detection"
      description="Upload a CSV of network connection records. Each row is classified as benign traffic or an attack category, with confidence and an aggregate risk level for the batch."
      uploadHint="Flow-record CSV · headers required · max 25 MB"
      primaryLabel="Prediction"
      primaryValue="DoS Attack"
      metrics={[
        { label: "Confidence score", value: "94.2%", hint: "Mean across flagged records" },
        { label: "Risk level", value: "High", hint: "Aggregated batch severity" },
        { label: "Analyzed records", value: "12,480", hint: "Rows parsed from the CSV" },
      ]}
      recommendation="Isolate the affected subnet, apply rate-limiting at the edge gateway and review firewall logs for the flagged source addresses within the last 24 hours."
      distribution={[
        { name: "Benign", value: 62 },
        { name: "DoS", value: 21 },
        { name: "Probe", value: 9 },
        { name: "R2L", value: 5 },
        { name: "U2R", value: 3 },
      ]}
      summary={[
        { name: "Benign", value: 7738 },
        { name: "DoS", value: 2620 },
        { name: "Probe", value: 1123 },
        { name: "R2L", value: 624 },
        { name: "U2R", value: 375 },
      ]}
      tableTitle="Record-level results"
      endpoint="POST /api/v1/network/predict"
      rows={[
        { id: "flow-00124", label: "DoS", confidence: "97.1%", severity: "Critical" },
        { id: "flow-00125", label: "Benign", confidence: "99.4%", severity: "None" },
        { id: "flow-00126", label: "Probe", confidence: "88.6%", severity: "Medium" },
        { id: "flow-00127", label: "R2L", confidence: "76.2%", severity: "High" },
        { id: "flow-00128", label: "Benign", confidence: "95.8%", severity: "None" },
        { id: "flow-00129", label: "U2R", confidence: "81.0%", severity: "Critical" },
      ]}
    />
  );
}
