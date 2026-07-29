import { Link } from "@tanstack/react-router";
import { Github, Mail, ShieldHalf } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <ShieldHalf className="h-5 w-5 text-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.22em]">
              Sentinel<span className="text-primary">AI</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            AI-Based Cyber Threat Detection Framework — a research dashboard for network intrusion
            and malware family classification. Frontend interface; models served by a FastAPI
            backend.
          </p>
        </div>

        <div>
          <p className="eyebrow">Pages</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/network-detection" className="hover:text-foreground">
              Network Detection
            </Link>
            <Link to="/malware-detection" className="hover:text-foreground">
              Malware Detection
            </Link>
            <Link to="/about" className="hover:text-foreground">
              About
            </Link>
            <Link to="/documentation" className="hover:text-foreground">
              Documentation
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
            <a href="#" className="inline-flex items-center gap-2 hover:text-foreground">
              <Github className="h-4 w-4" /> github.com/your-org
            </a>
            <a href="#" className="inline-flex items-center gap-2 hover:text-foreground">
              <Mail className="h-4 w-4" /> team@example.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-5">
        <p className="mx-auto max-w-7xl px-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:px-8">
          © {new Date().getFullYear()} SentinelAI — Academic project
        </p>
      </div>
    </footer>
  );
}
