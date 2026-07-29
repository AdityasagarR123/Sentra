import { createFileRoute } from "@tanstack/react-router";
import { Brain, Cpu, Rocket, Target, TriangleAlert, Wrench } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/SectionHeader";
import { FeatureCard } from "@/components/FeatureCard";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About the Framework — SENTRA" },
      {
        name: "description",
        content:
          "Problem statement, objectives, technologies and AI models behind the SENTRA AI-based cyber threat detection framework.",
      },
      { property: "og:title", content: "About the Framework — SENTRA" },
      {
        property: "og:description",
        content: "Problem statement, objectives, models and future scope of the SENTRA framework.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const objectives = [
  "Detect and classify network intrusions from flow-level telemetry.",
  "Identify malware families from extracted static and behavioural features.",
  "Attach calibrated confidence and risk levels to every prediction.",
  "Present batch results in a form an analyst can triage in minutes.",
  "Keep the interface fully decoupled from the inference backend.",
];

const technologies = [
  { icon: Wrench, title: "Frontend", description: "React 19, TypeScript, TanStack Router, Tailwind CSS, Recharts." },
  { icon: Cpu, title: "Backend (external)", description: "FastAPI service exposing REST endpoints for batch inference." },
  { icon: Brain, title: "Data tooling", description: "Pandas and Scikit-learn for feature engineering and preprocessing." },
];

const models = [
  { icon: Brain, title: "Random Forest / XGBoost", description: "Tabular baselines for flow-level intrusion classification." },
  { icon: Cpu, title: "1D CNN", description: "Sequence model over packet and byte-level representations." },
  { icon: Target, title: "LSTM", description: "Temporal modelling of session behaviour for evasive attacks." },
  { icon: TriangleAlert, title: "Multiclass classifier", description: "Malware family attribution over extracted feature vectors." },
];

export default function About() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <SectionHeader
          eyebrow="About"
          title="An AI-based cyber threat detection framework"
          description="SENTRA is a research-oriented framework that combines network intrusion detection and malware classification behind a shared analyst interface, designed so the detection service can evolve independently of the UI."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <div className="surface-panel rounded-3xl p-8">
            <h3 className="text-xl font-semibold">Problem statement</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Signature-based defences fail against polymorphic malware and novel intrusion
              patterns, while raw model output from ML pipelines is rarely usable by analysts.
              Teams end up with detections they cannot prioritise and evidence they cannot read.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              SENTRA addresses the second half of that gap: turning batch model output into
              ranked, explained findings with confidence and risk attached to every record.
            </p>
          </div>

          <div className="surface-panel rounded-3xl p-8">
            <h3 className="text-xl font-semibold">Objectives</h3>
            <ul className="mt-4 space-y-3">
              {objectives.map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="Technologies used" title="Stack" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {technologies.map((tech) => (
              <FeatureCard key={tech.title} {...tech} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="AI models" title="Detection approaches" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {models.map((model) => (
              <FeatureCard key={model.title} {...model} />
            ))}
          </div>
        </div>

        <div className="surface-panel mt-16 rounded-3xl p-8">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5 shrink-0 text-primary" />
            <h3 className="text-xl font-semibold">Future scope</h3>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              { t: "Real-time streaming", c: "Move from batch CSV uploads to live flow ingestion with websocket updates." },
              { t: "Explainability", c: "Surface SHAP-style feature attributions alongside each prediction." },
              { t: "SOC integration", c: "Push findings into ticketing and SIEM pipelines with analyst feedback loops." },
            ].map((item) => (
              <div key={item.t}>
                <p className="font-semibold">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
