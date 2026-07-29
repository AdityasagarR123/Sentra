import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { SectionHeader } from "@/components/SectionHeader";
import { AlertBox } from "@/components/AlertBox";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/documentation")({
  component: Documentation,
  head: () => ({
    meta: [
      { title: "Documentation & API Guide — SENTRA" },
      {
        name: "description",
        content:
          "Supported file formats, upload instructions, processing workflow, result interpretation and FAQ for the SENTRA detection framework.",
      },
      { property: "og:title", content: "Documentation & API Guide — SENTRA" },
      {
        property: "og:description",
        content: "How to prepare files, run a detection and read the results.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/documentation" },
    ],
    links: [{ rel: "canonical", href: "/documentation" }],
  }),
});

interface EndpointRow extends Record<string, unknown> {
  id: string;
  method: string;
  path: string;
  purpose: string;
  status: string;
}

const endpointColumns: DataTableColumn<EndpointRow>[] = [
  { key: "method", header: "Method" },
  { key: "path", header: "Endpoint" },
  { key: "purpose", header: "Purpose" },
  { key: "status", header: "Status", align: "right" },
];

const endpoints: EndpointRow[] = [
  { id: "1", method: "POST", path: "/predict/network", purpose: "Batch intrusion detection from a flow CSV", status: "Live" },
  { id: "2", method: "POST", path: "/predict/malware", purpose: "Malware family classification from a feature CSV", status: "Live" },
  { id: "3", method: "GET", path: "/docs", purpose: "API interactive documentation", status: "Live" },
  { id: "4", method: "GET", path: "/", purpose: "Service health probe", status: "Live" },
];

const faqs = [
  {
    q: "Which file formats are supported?",
    a: "UTF-8 encoded .csv files with a header row, up to 25 MB. Other formats are rejected during client-side validation.",
  },
  {
    q: "Does the interface store my uploads?",
    a: "No. The file is held in memory for the duration of the request and is never written to local storage or a browser database.",
  },
  {
    q: "Why do results show placeholder values?",
    a: "They don't! The frontend is fully connected to the live FastAPI threat detection backend. Results represent the actual predictions and confidence scores returned by the machine learning models.",
  },
  {
    q: "How should confidence be interpreted?",
    a: "Confidence is the model's calibrated probability for the winning class. Values below roughly 0.6 should be treated as low-certainty and routed to manual review.",
  },
  {
    q: "What determines the risk level?",
    a: "Risk combines the predicted class severity with the confidence score and the share of flagged records in the batch.",
  },
];

export default function Documentation() {
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-36">
        <SectionHeader
          eyebrow="Documentation"
          title="How to use the framework"
          description="Everything an analyst needs to prepare a dataset, run a detection and read the output — plus the API surface the frontend expects."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="surface-panel rounded-3xl p-7">
            <h3 className="text-lg font-semibold">Supported file format</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Extension: <span className="font-mono text-foreground">.csv</span></li>
              <li>• Encoding: UTF-8, comma delimited</li>
              <li>• Header row required</li>
              <li>• Maximum size: 25 MB</li>
              <li>• Column order must match the model feature schema</li>
            </ul>
          </div>

          <div className="surface-panel rounded-3xl p-7">
            <h3 className="text-lg font-semibold">Upload instructions</h3>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>1. Open a detection module from the navigation.</li>
              <li>2. Drag your CSV onto the drop zone, or use Browse file.</li>
              <li>3. Confirm the filename and size shown below the drop zone.</li>
              <li>4. Press Analyze and wait for the service response.</li>
            </ol>
          </div>

          <div className="surface-panel rounded-3xl p-7">
            <h3 className="text-lg font-semibold">Processing workflow</h3>
            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>1. Client-side validation of type, size and emptiness.</li>
              <li>2. Multipart upload to the FastAPI detection endpoint.</li>
              <li>3. Feature extraction and model inference server-side.</li>
              <li>4. JSON response rendered into metrics, charts and tables.</li>
            </ol>
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="Result interpretation" title="Reading the output" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              { t: "Prediction", c: "The winning class for the batch — an attack category or a malware family." },
              { t: "Confidence score", c: "Probability assigned to the winning class, expressed as a percentage." },
              { t: "Risk / severity level", c: "Derived triage priority: Low, Medium, High or Critical." },
              { t: "Recommendation", c: "Suggested containment or mitigation action returned with the prediction." },
              { t: "Distribution charts", c: "Share and absolute count of each predicted class across the batch." },
              { t: "Record table", c: "Per-record predictions so individual flows or samples can be inspected." },
            ].map((item) => (
              <div key={item.t} className="surface-panel rounded-2xl p-6">
                <p className="font-semibold">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.c}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="API guide" title="Endpoints the frontend expects" />
          <AlertBox className="mt-6" variant="success" title="Connected to API Backend">
            These routes describe the live contract that the dashboard uses to interact with the
            FastAPI machine learning service.
          </AlertBox>
          <DataTable className="mt-6" columns={endpointColumns} rows={endpoints} />
        </div>

        <div className="mt-16">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <Accordion type="single" collapsible className="surface-panel mt-8 rounded-3xl px-6">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PageShell>
  );
}
