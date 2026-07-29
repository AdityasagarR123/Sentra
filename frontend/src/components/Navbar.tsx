import { Link } from "@tanstack/react-router";
import { Menu, ShieldHalf, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/network-detection", label: "Network Detection" },
  { to: "/malware-detection", label: "Malware Detection" },
  { to: "/about", label: "About" },
  { to: "/documentation", label: "Documentation" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-6">
      <nav className="pointer-events-auto mx-auto flex max-w-5xl items-center gap-4 rounded-full border border-border/70 bg-popover/85 px-4 py-2.5 backdrop-blur-xl sm:px-5">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <ShieldHalf className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold tracking-tight">
            SENTRA<span className="align-super text-[9px]">®</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-full px-3.5 py-1.5 text-sm transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          to="/network-detection"
          className="ml-auto hidden shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 lg:ml-2 lg:block"
        >
          Start scan
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto rounded-full p-2 text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="pointer-events-auto mx-auto mt-2 max-w-5xl rounded-3xl border border-border bg-popover/95 p-3 backdrop-blur-xl lg:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
