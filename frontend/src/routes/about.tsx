import { createFileRoute } from "@tanstack/react-router";
import { Brain, Compass, GitBranch, Target } from "lucide-react";

import { FeatureCard } from "@/components/common/feature-card";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn } from "@/components/ui/words-pull-up";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — SentinelAI" },
      {
        name: "description",
        content:
          "Problem statement, objectives, technologies and AI models behind the AI-Based Cyber Threat Detection Framework.",
      },
      { property: "og:title", content: "About the Project — SentinelAI" },
      {
        property: "og:description",
        content: "Research context, objectives and model design of the detection framework.",
      },
    ],
  }),
  component: About,
});

const objectives = [
  "Provide a single console for two independent detection models.",
  "Keep inference server-side so models can be retrained without frontend changes.",
  "Translate raw probabilities into risk levels and actionable recommendations.",
  "Support batch CSV analysis with clear validation and error reporting.",
  "Maintain a reusable component library for future detectors.",
];

const models = [
  {
    icon: Brain,
    title: "Random Forest / XGBoost",
    description:
      "Tabular ensemble baselines for network flow classification on NSL-KDD and CIC-IDS style feature sets.",
  },
  {
    icon: GitBranch,
    title: "Deep neural classifier",
    description:
      "A dense network over normalised feature vectors for multi-class malware family attribution.",
  },
  {
    icon: Target,
    title: "Confidence calibration",
    description:
      "Softmax outputs are calibrated so the reported confidence reflects real predictive certainty.",
  },
  {
    icon: Compass,
    title: "Risk mapping layer",
    description:
      "Predicted class plus confidence is mapped to a four-tier risk scale with a matching recommendation.",
  },
];

const future = [
  "Real-time streaming detection over live packet captures.",
  "Explainability with SHAP-based per-feature attributions.",
  "Analyst accounts, saved reports and historical trend dashboards.",
  "Automated response hooks into firewalls and EDR tooling.",
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeader
        eyebrow="About"
        title="An AI-based framework for cyber threat detection"
        description="This project explores how supervised machine learning can support security analysts in triaging two distinct threat surfaces — network intrusions and malware samples — through a single, consistent interface."
      />

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <FadeIn className="rounded-2xl border border-border bg-card/40 p-8">
          <p className="eyebrow">Problem statement</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Signature-based defences fail against polymorphic malware and novel intrusion patterns.
            Security teams are simultaneously overwhelmed by alert volume and starved of context.
            The framework addresses both by classifying batches offline and presenting graded,
            interpretable output rather than raw alerts.
          </p>
        </FadeIn>
        <FadeIn delay={0.1} className="rounded-2xl border border-border bg-card/40 p-8">
          <p className="eyebrow">Objectives</p>
          <ul className="mt-4 space-y-3">
            {objectives.map((o) => (
              <li key={o} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                {o}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <section className="mt-20">
        <SectionHeader eyebrow="Technologies used" title="Implementation surface" />
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["React 19 · TypeScript", "Frontend"],
            ["Tailwind CSS v4", "Design system"],
            ["Recharts", "Charts"],
            ["TanStack Router", "Routing"],
            ["FastAPI · Python", "API layer"],
            ["scikit-learn", "Classical models"],
            ["TensorFlow / Keras", "Deep models"],
            ["Pandas · NumPy", "Preprocessing"],
          ].map(([label, note]) => (
            <div key={label} className="bg-background p-6">
              <p className="text-sm">{label}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeader eyebrow="AI models" title="What runs behind the API" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {models.map((m, i) => (
            <FadeIn key={m.title} delay={i * 0.05}>
              <FeatureCard {...m} className="h-full" />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-border bg-card/40 p-8 sm:p-10">
        <p className="eyebrow">Future scope</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {future.map((f) => (
            <p key={f} className="text-sm leading-relaxed text-muted-foreground">
              — {f}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
