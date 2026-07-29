import { Link } from "@tanstack/react-router";
import { Github, Mail, ShieldHalf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldHalf className="h-5 w-5 shrink-0 text-primary" />
            <span className="font-display text-sm font-bold">SENTRA®</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            An AI-based cyber threat detection framework for network intrusion analysis and
            malware family classification. Frontend interface, ready for REST API integration.
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Navigate
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
            <li><Link to="/network-detection" className="text-muted-foreground hover:text-foreground">Network Detection</Link></li>
            <li><Link to="/malware-detection" className="text-muted-foreground hover:text-foreground">Malware Detection</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/documentation" className="text-muted-foreground hover:text-foreground">Documentation</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2 text-muted-foreground">
              <Github className="h-4 w-4 shrink-0 text-primary" />
              github.com/your-org/sentra
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              team@sentra.example
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center font-mono text-xs text-muted-foreground">
        © 2026 SENTRA — AI-Based Cyber Threat Detection Framework
      </div>
    </footer>
  );
}
