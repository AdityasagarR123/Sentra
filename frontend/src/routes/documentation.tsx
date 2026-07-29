import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertBox } from "@/components/common/alert-box";
import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { SectionHeader } from "@/components/common/section-header";
import { FadeIn } from "@/components/ui/words-pull-up";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Documentation & API Guide — SentinelAI" },
      {
        name: "description",
        content:
          "File format requirements, upload instructions, processing workflow, result interpretation and FAQ for the detection framework.",
      },
      { property: "og:title", content: "Documentation & API Guide — SentinelAI" },
      {
        property: "og:description",
        content: "How to prepare datasets, run an analysis and interpret detection results.",
      },
    ],
  }),
  component: Documentation,
});

interface FieldRow extends Record<string, unknown> {
  id: string;
  label: string;
  confidence: string;
  severity: string;
}

const columns: DataTableColumn<FieldRow>[] = [
  { key: "id", header: "Field" },
  { key: "label", header: "Type" },
  { key: "confidence", header: "Required", align: "right" },
  { key: "severity", header: "Notes", align: "right" },
];

const fields: FieldRow[] = [
  { id: "header row", label: "string", confidence: "Yes", severity: "Column names must match training schema" },
  { id: "numeric features", label: "float / int", confidence: "Yes", severity: "No missing values" },
  { id: "categorical features", label: "string", confidence: "Optional", severity: "Encoded server-side" },
  { id: "label", label: "string", confidence: "No", severity: "Ignored during inference" },
];

const steps = [
  { title: "Supported file format", body: "Comma-separated .csv files with a header row, UTF-8 encoded, up to 25 MB. Excel workbooks and JSON are not accepted." },
  { title: "Upload instructions", body: "Open a detector page, drag the file into the upload zone or use Browse file, confirm the filename appears, then press Analyze." },
  { title: "Processing workflow", body: "The file is validated in the browser, sent to the FastAPI endpoint as multipart/form-data, preprocessed, scored by the model and returned as JSON." },
  { title: "Result interpretation", body: "Prediction is the dominant class, confidence is the calibrated probability, and risk/severity maps class and confidence to a four-tier scale with a recommendation." },
];

const faq = [
  { q: "Is the backend connected yet?", a: "Not yet. Every result on the detector pages is placeholder data. The Analyze action is wired to a single integration point so the FastAPI call can be dropped in without touching UI code." },
  { q: "What happens to my uploaded file?", a: "Nothing is uploaded in the current build — the file is only read in the browser for validation and display." },
  { q: "Which endpoints will be used?", a: "POST /api/v1/network/predict for intrusion detection and POST /api/v1/malware/predict for malware classification, both accepting multipart/form-data with a `file` field." },
  { q: "How are errors surfaced?", a: "Invalid extension, empty file, missing selection, upload failure and API errors each render a dedicated alert in the upload panel." },
  { q: "Can I analyze a single record?", a: "The interface is batch-first, but a one-row CSV works exactly the same way." },
];

function Documentation() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
      <SectionHeader
        eyebrow="Documentation / API guide"
        title="How to use the framework"
        description="Everything an analyst needs to prepare a dataset, run an analysis and read the output correctly."
      />

      <div className="mt-14 space-y-5">
        {steps.map((s, i) => (
          <FadeIn key={s.title} delay={i * 0.05}>
            <div className="rounded-2xl border border-border bg-card/40 p-7">
              <span className="font-mono text-[11px] text-primary">0{i + 1}</span>
              <h3 className="mt-3 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl">Expected CSV schema</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Placeholder schema — replace with the exact feature list once the backend contract is
          fixed.
        </p>
        <DataTable className="mt-6" columns={columns} rows={fields} />
      </section>

      <section className="mt-16">
        <h2 className="text-2xl">Request example</h2>
        <pre className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card/60 p-6 font-mono text-xs leading-relaxed text-muted-foreground">
{`curl -X POST https://api.example.com/api/v1/network/predict \\
  -H "Accept: application/json" \\
  -F "file=@flows.csv"`}
        </pre>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl">FAQ</h2>
        <Accordion type="single" collapsible className="mt-5">
          {faq.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <AlertBox className="mt-12" tone="warning" title="Integration pending">
        This build is frontend-only. No AI logic runs in the browser and no network requests are
        made to a model service.
      </AlertBox>
    </div>
  );
}
