import { Link } from "@tanstack/react-router";
import { Menu, ShieldHalf, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/network-detection", label: "Network Detection" },
  { to: "/malware-detection", label: "Malware Detection" },
  { to: "/about", label: "About" },
  { to: "/documentation", label: "Documentation" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <ShieldHalf className="h-5 w-5 text-primary" />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-foreground">
            Sentinel<span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground hover:text-foreground" }}
              className="rounded-full px-3.5 py-2 text-sm transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/network-detection"
            className="ml-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Run analysis
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border p-2 text-foreground lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-3 sm:px-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                activeProps={{ className: "text-primary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="py-3 text-sm"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
