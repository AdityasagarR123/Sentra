import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Binary,
  Cpu,
  Database,
  FileSearch,
  Layers,
  Network,
  ShieldAlert,
  Waves,
} from "lucide-react";

import { FeatureCard } from "@/components/common/feature-card";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn, WordsPullUp } from "@/components/ui/words-pull-up";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SentinelAI — AI-Based Cyber Threat Detection Framework" },
      {
        name: "description",
        content:
          "A production-ready dashboard for AI-based network intrusion detection and malware family classification, powered by a FastAPI inference backend.",
      },
      { property: "og:title", content: "SentinelAI — AI-Based Cyber Threat Detection" },
      {
        property: "og:description",
        content:
          "Upload network traffic or malware feature datasets and review model predictions, confidence and risk levels.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: Network,
    title: "Traffic-level intrusion detection",
    description:
      "Classify flows from NSL-KDD / CIC-IDS style datasets into benign and attack categories.",
  },
  {
    icon: Binary,
    title: "Malware family classification",
    description:
      "Map static and behavioural feature vectors to known malware families with confidence scores.",
  },
  {
    icon: BarChart3,
    title: "Explainable result surfaces",
    description:
      "Every prediction ships with confidence, risk level, distribution charts and a record-level table.",
  },
  {
    icon: ShieldAlert,
    title: "Risk-graded recommendations",
    description: "Outputs are translated into analyst-ready actions instead of raw probabilities.",
  },
  {
    icon: Database,
    title: "CSV-first ingestion",
    description: "Drag-and-drop batch uploads with validation for format, emptiness and size.",
  },
  {
    icon: Layers,
    title: "Composable frontend",
    description:
      "Reusable upload, metric, chart and table components so new detectors plug in quickly.",
  },
];

const stack = [
  { label: "React 19 + TypeScript", note: "Interface layer" },
  { label: "TanStack Router", note: "Routing & SSR" },
  { label: "Tailwind CSS v4", note: "Design system" },
  { label: "Recharts", note: "Visualisation" },
  { label: "FastAPI", note: "Inference API" },
  { label: "scikit-learn / TensorFlow", note: "Model runtime" },
];

const pipeline = [
  { step: "01", title: "Ingest", body: "Analyst uploads a CSV of network flows or malware feature vectors." },
  { step: "02", title: "Validate", body: "Client checks extension, size and emptiness before dispatch." },
  { step: "03", title: "Infer", body: "The FastAPI service runs preprocessing and the trained model." },
  { step: "04", title: "Interpret", body: "Predictions, confidence and risk levels return to the dashboard." },
  { step: "05", title: "Act", body: "Charts, tables and recommendations guide the response." },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="grain veil relative overflow-hidden border-b border-border/60">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <FadeIn>
            <span className="eyebrow">AI-Based Cyber Threat Detection Framework</span>
          </FadeIn>
          <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            <WordsPullUp text="Detect intrusions and malware" />
            <span className="block italic text-primary">
              <WordsPullUp text="before they become incidents." delay={0.25} />
            </span>
          </h1>
          <FadeIn delay={0.4} className="mt-8 max-w-xl">
            <p className="text-base leading-relaxed text-muted-foreground">
              SentinelAI is a unified analyst console for two machine-learning detectors: network
              intrusion classification and malware family identification. Upload a dataset, review
              graded risk, act with confidence.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/network-detection"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Network detection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/malware-detection"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
              >
                Malware detection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeader
          eyebrow="Project overview"
          title="One framework, two detection surfaces"
          description="The framework separates the analyst interface from the inference layer. This dashboard handles ingestion, validation, state and interpretation; the FastAPI backend owns preprocessing and model execution — so detectors can evolve without reworking the UI."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FadeIn>
            <Link
              to="/network-detection"
              className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card/50 p-8 transition-colors hover:border-primary/50"
            >
              <div>
                <Waves className="h-6 w-6 text-primary" />
                <h3 className="mt-6 text-2xl">Network Intrusion Detection</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Batch-classify connection records into benign traffic or attack categories such as
                  DoS, Probe, R2L and U2R, with per-record confidence and an aggregate risk level.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-primary">
                Open detector <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link
              to="/malware-detection"
              className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card/50 p-8 transition-colors hover:border-primary/50"
            >
              <div>
                <FileSearch className="h-6 w-6 text-primary" />
                <h3 className="mt-6 text-2xl">Malware Detection</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Identify the likely malware family behind extracted static and behavioural
                  features, returning threat severity and a containment recommendation.
                </p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-primary">
                Open detector <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeader eyebrow="Key features" title="Built for analyst workflows" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <FeatureCard {...f} index={`0${i + 1}`} className="h-full" />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="border-y border-border/60 bg-card/25">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <SectionHeader
            eyebrow="Technology stack"
            title="Modern frontend, Python inference"
            description="A strict boundary between presentation and modelling keeps the system portable."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {stack.map((s) => (
              <div key={s.label} className="bg-background p-6">
                <Cpu className="h-4 w-4 text-primary" />
                <p className="mt-4 text-base">{s.label}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeader eyebrow="Workflow / pipeline" title="From CSV to decision in five steps" />
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-5">
          {pipeline.map((p) => (
            <div key={p.step} className="bg-background p-6">
              <span className="font-mono text-[11px] text-primary">{p.step}</span>
              <p className="mt-4 text-lg">{p.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <div className="veil grain relative overflow-hidden rounded-3xl border border-border p-10 text-center sm:p-16">
          <h2 className="mx-auto max-w-2xl text-4xl leading-tight sm:text-5xl">
            Start with a dataset. End with a decision.
          </h2>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/network-detection"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Analyze network traffic <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/documentation"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
            >
              Read the API guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
