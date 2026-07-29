import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Cpu,
  Database,
  FileSearch,
  Gauge,
  LineChart,
  Lock,
  Network,
  ScanLine,
  ServerCog,
  ShieldCheck,
} from "lucide-react";

import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/SectionHeader";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-rocks.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SENTRA — AI-Based Cyber Threat Detection Framework" },
      {
        name: "description",
        content:
          "SENTRA is an AI-based cyber threat detection framework for network intrusion detection and malware family classification, with an analyst-grade dashboard.",
      },
      { property: "og:title", content: "SENTRA — AI-Based Cyber Threat Detection Framework" },
      {
        property: "og:description",
        content:
          "Network intrusion detection and malware classification in one analyst-grade dashboard.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const features = [
  {
    icon: ScanLine,
    title: "Flow-level intrusion detection",
    description:
      "Classify network flows into benign traffic or attack families such as DDoS, port scanning and brute force.",
  },
  {
    icon: FileSearch,
    title: "Malware family classification",
    description:
      "Map static and behavioural features of samples to known malware families with per-record confidence.",
  },
  {
    icon: Gauge,
    title: "Confidence & risk scoring",
    description:
      "Every prediction carries a calibrated confidence score and a derived risk level for triage ordering.",
  },
  {
    icon: LineChart,
    title: "Visual analytics",
    description:
      "Distribution charts, summary statistics and per-record tables make batch results readable at a glance.",
  },
  {
    icon: Lock,
    title: "No data retention",
    description:
      "Files are streamed to the detection API on demand. The interface keeps nothing in local storage.",
  },
  {
    icon: ServerCog,
    title: "API-ready frontend",
    description:
      "All result surfaces are typed placeholders wired to a single integration point per detection page.",
  },
];

const stack = [
  { icon: Boxes, name: "React 19 + TypeScript", note: "Component-driven UI layer" },
  { icon: Cpu, name: "FastAPI", note: "Detection service (external)" },
  { icon: Database, name: "Pandas / Scikit-learn", note: "Feature pipeline & classical models" },
  { icon: Network, name: "TensorFlow / PyTorch", note: "Deep sequence & CNN classifiers" },
];

const pipeline = [
  { step: "01", title: "Upload", copy: "Analyst uploads a preprocessed CSV export of flows or samples." },
  { step: "02", title: "Validate", copy: "Format, encoding and schema checks run before anything is sent." },
  { step: "03", title: "Infer", copy: "The detection API scores each record with the trained model." },
  { step: "04", title: "Report", copy: "Predictions, confidence, risk and recommendations are rendered." },
];

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative min-h-[92vh] w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Dark rock formations lit by a burning orange horizon"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--background)_70%,transparent),transparent_45%,color-mix(in_oklab,var(--background)_92%,transparent))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--background)_82%,transparent),color-mix(in_oklab,var(--background)_35%,transparent)_55%,transparent)]" />


        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pt-32 pb-40 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl [text-shadow:0_2px_40px_oklch(0_0_0/0.65)]"
          >
            <div className="mb-2 h-5 w-5 border-l-2 border-t-2 border-foreground/80" />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-[auto_auto] sm:items-end sm:gap-6">
              <h1 className="font-display text-6xl font-bold leading-none tracking-tighter sm:text-8xl">
                SENTRA<span className="align-super text-2xl sm:text-4xl">®</span>
              </h1>
              <p className="pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/70">
                ©2026
                <br />
                Established since.
              </p>
            </div>
            <p className="mt-5 max-w-md text-sm font-medium leading-relaxed sm:text-base">
              An AI-based cyber threat detection framework — intrusion analysis, malware
              classification and explainable risk scoring in one analyst workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/network-detection">
                  Network detection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/malware-detection">Malware detection</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto hidden max-w-6xl px-6 pb-8 lg:block">
          <div className="flex items-end justify-between">
            <p className="font-mono text-xs leading-relaxed text-foreground/80">
              Security Research Lab
              <br />
              Threat Intelligence Unit
              <br />
              Batch inference · CSV
            </p>
            <ul className="space-y-1 text-right font-mono text-sm">
              {["01 Ingestion", "02 Feature engineering", "03 Model inference", "04 Reporting"].map(
                (item, i) => (
                  <li
                    key={item}
                    className="text-foreground"
                    style={{ opacity: 0.35 + i * 0.2 }}
                  >
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <SectionHeader
            eyebrow="Project overview"
            title="Two detection engines, one analyst surface"
            description="SENTRA unifies network intrusion detection and malware family classification behind a single dashboard. Analysts upload batch CSV exports, the detection service scores every record, and the interface turns raw model output into prioritised, explainable findings."
          />
          <div className="grid grid-cols-2 gap-4 self-center">
            {[
              { k: "Detection modules", v: "02" },
              { k: "Result surfaces", v: "12+" },
              { k: "Reusable components", v: "09" },
              { k: "Backend coupling", v: "REST" },
            ].map((item) => (
              <div key={item.k} className="surface-panel rounded-2xl p-5">
                <p className="font-display text-3xl font-semibold text-gradient-ember">{item.v}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.k}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionHeader eyebrow="Key features" title="Built for triage, not for demos" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Technology stack */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader
          eyebrow="Technology stack"
          title="Frontend today, FastAPI tomorrow"
          description="The interface is fully decoupled: swapping placeholder state for live responses touches a single handler per detection page."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map(({ icon: Icon, name, note }) => (
            <div key={name} className="surface-panel rounded-2xl p-6">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-4 font-semibold">{name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionHeader eyebrow="Workflow" title="How a batch moves through the framework" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pipeline.map((item) => (
              <div key={item.step} className="surface-panel relative rounded-2xl p-6">
                <span className="font-mono text-xs tracking-[0.2em] text-primary">{item.step}</span>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeader eyebrow="Detection modules" title="Choose an engine to start" />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {[
            {
              icon: Network,
              title: "Network Intrusion Detection",
              copy: "Upload flow-level CSV exports and classify traffic into benign or attack categories, with attack distribution, risk scoring and record-level output.",
              to: "/network-detection" as const,
              cta: "Open network detection",
            },
            {
              icon: ShieldCheck,
              title: "Malware Detection",
              copy: "Upload extracted sample features and predict malware families with confidence, severity, recommended containment steps and per-sample results.",
              to: "/malware-detection" as const,
              cta: "Open malware detection",
            },
          ].map(({ icon: Icon, title, copy, to, cta }) => (
            <div key={title} className="surface-panel glow-ember flex flex-col rounded-3xl p-8">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              <Button asChild className="mt-8 self-start">
                <Link to={to}>
                  {cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
