import Link from 'next/link';
import { ArrowRight, Users, TrendingUp, ShieldCheck, Handshake } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
        <span className="font-display text-lg font-bold text-primary-foreground">GF</span>
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-background" />
      </div>
      <div className="leading-tight">
        <p className="font-display text-base font-bold tracking-tight text-foreground">
          Golden Future
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Cooperative Society
        </p>
      </div>
    </div>
  );
}

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#benefits', label: 'Benefits' },
  { href: '#services', label: 'Services' },
  { href: '#transparency', label: 'Transparency' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Golden Future home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Member Login
          </Link>
          <Link
            href="/apply"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            Become a Member
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A trusted community of professionals building wealth together through
              collective savings, transparent investments, and shared prosperity.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Explore</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {navLinks.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Members</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Member Login
                </Link>
              </li>
              <li>
                <Link href="/apply" className="transition-colors hover:text-foreground">
                  Membership Application
                </Link>
              </li>
              <li>
                <Link href="#faq" className="transition-colors hover:text-foreground">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-foreground">Terms &amp; Conditions</Link></li>
              <li><Link href="/risk-disclosure" className="transition-colors hover:text-foreground">Risk Disclosures</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Golden Future Multipurpose Cooperative Society. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secured &amp; Audited</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> Member-Owned</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
