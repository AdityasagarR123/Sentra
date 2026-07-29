/**
 * Placeholder data only — no AI logic, no backend calls.
 * Replace these shapes with the FastAPI response payloads during integration.
 */

export interface DistributionPoint {
  name: string;
  value: number;
}

export interface AnalysisSummary {
  prediction: string;
  confidence: number;
  risk: string;
  riskTone: "success" | "warning" | "danger";
  recommendation: string;
  records: number;
  flagged: number;
  processingTime: string;
}

export interface RecordRow extends Record<string, unknown> {
  id: string;
  source: string;
  label: string;
  confidence: string;
  severity: string;
}

export const networkSummary: AnalysisSummary = {
  prediction: "DDoS — Volumetric Flood",
  confidence: 0.94,
  risk: "High",
  riskTone: "danger",
  recommendation:
    "Rate-limit the offending source subnets at the edge, enable SYN cookies, and forward the flagged flows to the SOC queue for manual triage.",
  records: 12480,
  flagged: 1834,
  processingTime: "— s",
};

export const networkDistribution: DistributionPoint[] = [
  { name: "Benign", value: 62 },
  { name: "DDoS", value: 18 },
  { name: "Port Scan", value: 9 },
  { name: "Brute Force", value: 7 },
  { name: "Infiltration", value: 4 },
];

export const networkRows: RecordRow[] = [
  { id: "FLW-00121", source: "10.0.4.18 → 172.16.2.9", label: "DDoS", confidence: "0.97", severity: "High" },
  { id: "FLW-00122", source: "10.0.4.21 → 172.16.2.9", label: "DDoS", confidence: "0.95", severity: "High" },
  { id: "FLW-00123", source: "192.168.1.44 → 10.0.0.5", label: "Port Scan", confidence: "0.81", severity: "Medium" },
  { id: "FLW-00124", source: "10.0.9.2 → 10.0.0.5", label: "Benign", confidence: "0.99", severity: "Low" },
  { id: "FLW-00125", source: "203.0.113.7 → 10.0.0.5", label: "Brute Force", confidence: "0.88", severity: "Medium" },
];

export const malwareSummary: AnalysisSummary = {
  prediction: "Trojan.Emotet",
  confidence: 0.91,
  risk: "Critical",
  riskTone: "danger",
  recommendation:
    "Isolate the affected endpoints, revoke cached credentials, and submit the sample hashes to the incident response pipeline for containment.",
  records: 3260,
  flagged: 742,
  processingTime: "— s",
};

export const malwareDistribution: DistributionPoint[] = [
  { name: "Benign", value: 48 },
  { name: "Trojan", value: 21 },
  { name: "Ransomware", value: 13 },
  { name: "Worm", value: 10 },
  { name: "Spyware", value: 8 },
];

export const malwareRows: RecordRow[] = [
  { id: "SMP-0451", source: "invoice_2026.exe", label: "Trojan.Emotet", confidence: "0.96", severity: "Critical" },
  { id: "SMP-0452", source: "setup_patch.dll", label: "Ransomware.Locky", confidence: "0.92", severity: "Critical" },
  { id: "SMP-0453", source: "driver_update.sys", label: "Worm.Conficker", confidence: "0.84", severity: "High" },
  { id: "SMP-0454", source: "report_final.pdf", label: "Benign", confidence: "0.98", severity: "Low" },
  { id: "SMP-0455", source: "helper_tool.exe", label: "Spyware.Agent", confidence: "0.79", severity: "Medium" },
];
