import {
  ArrowRight,
  Users,
  TrendingUp,
  ShieldCheck,
  Handshake,
  Target,
  Eye,
  PiggyBank,
  Briefcase,
  Landmark,
  BookOpen,
  Vote,
  Scale,
  Lock,
  CheckCircle2,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

const heroImage =
  'https://images.pexels.com/photos/7651933/pexels-photo-7651933.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400';
const aboutImage =
  'https://images.pexels.com/photos/5257005/pexels-photo-5257005.jpeg?auto=compress&cs=tinysrgb&h=800&w=1100';

const stats = [
  { label: 'Active Members', value: '120+', icon: Users },
  { label: 'Pooled Contributions', value: '₦45.2M', icon: TrendingUp },
  { label: 'Active Investments', value: '8', icon: Briefcase },
  { label: 'Years of Integrity', value: '3+', icon: ShieldCheck },
];

const benefits = [
  {
    icon: PiggyBank,
    title: 'Structured Savings',
    description:
      'Build disciplined savings through regular monthly contributions and voluntary deposits, all tracked transparently in your personal account.',
  },
  {
    icon: Briefcase,
    title: 'Curated Investments',
    description:
      'Access vetted investment opportunities — from agriculture to real estate — with clear risk classifications and profit-sharing formulas.',
  },
  {
    icon: Handshake,
    title: 'Member-First Loans',
    description:
      'Affordable cooperative loans with fair terms, transparent interest, and repayment schedules tailored to your cash flow.',
  },
  {
    icon: ShieldCheck,
    title: 'Full Transparency',
    description:
      'Every contribution, investment, and distribution is recorded in a double-entry ledger. Members see exactly where their money works.',
  },
  {
    icon: Vote,
    title: 'Collective Governance',
    description:
      'Members have a voice. Decisions, policies, and leadership are chosen through transparent processes and documented meetings.',
  },
  {
    icon: Scale,
    title: 'Shared Prosperity',
    description:
      'Profits are distributed fairly based on approved participation formulas — not promises, but audited, approved allocations.',
  },
];

const services = [
  {
    icon: PiggyBank,
    title: 'Savings & Contributions',
    description:
      'Regular contributions, voluntary savings, special levies, and membership fees — with schedules, due dates, and automatic arrears tracking.',
    features: ['Monthly contribution plans', 'Voluntary savings wallets', 'Automated reminders', 'Contribution receipts'],
  },
  {
    icon: Briefcase,
    title: 'Investment Opportunities',
    description:
      'A transparent pipeline of vetted ventures. Members participate based on approved allocation rules and track performance in real time.',
    features: ['Vetted deal pipeline', 'Capital-based allocation', 'Risk classification', 'Realised return tracking'],
  },
  {
    icon: Landmark,
    title: 'Cooperative Loans',
    description:
      'Access affordable credit backed by your contributions. Clear eligibility, fair interest, and structured repayment schedules.',
    features: ['Simple application', 'Transparent interest', 'Repayment schedules', 'Loan statements'],
  },
  {
    icon: FileText,
    title: 'Financial Statements',
    description:
      'Trial balance, income & expenditure, and statement of financial position — generated from live records and exportable on demand.',
    features: ['Double-entry ledger', 'Cashbook reports', 'Member statements', 'CSV, Excel & PDF export'],
  },
];

const professions = [
  'Engineering', 'Medicine', 'Law', 'Accounting', 'Economics',
  'Education', 'Information Technology', 'Agriculture', 'Business',
  'Finance', 'Architecture', 'Entrepreneurship',
];

const faqs = [
  {
    q: 'Who can join the Golden Future Cooperative?',
    a: 'Membership is open to Nigerian graduates and professionals of good character from any field — engineering, medicine, law, finance, agriculture, technology, and more. Applicants must be committed to honesty, transparency, and active participation.',
  },
  {
    q: 'How are my contributions and savings protected?',
    a: 'All funds are held in the cooperative\u2019s registered accounts and recorded in a double-entry accounting system with a tamper-evident audit trail. Financial statements are published to members, and sensitive actions require multi-level approvals.',
  },
  {
    q: 'Are investment returns guaranteed?',
    a: 'No. The cooperative never promises guaranteed profits. Every investment carries a clearly stated risk classification. Expected returns are distinguished from actual realised returns, and losses, fees, and deductions are accounted for transparently.',
  },
  {
    q: 'How are profits shared among members?',
    a: 'Distributions follow an approved allocation method — typically proportional to the capital you contributed, or a fixed approved participation percentage. Allocations are calculated, reviewed, approved, and recorded as financial transactions before any payment is made.',
  },
  {
    q: 'Can I apply for a loan, and how does it work?',
    a: 'Yes. Approved members can apply through the member portal. Each application is reviewed against eligibility rules, approved by authorised officers, and disbursed with a clear repayment schedule. Repayments are tracked automatically.',
  },
  {
    q: 'How long does membership approval take?',
    a: 'After you submit your application, the membership officer reviews your details and documents. Approval, membership number assignment, and account activation typically follow the next executive review cycle.',
  },
];

export function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary/30">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center animate-fade-up">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Member-owned. Professionally managed.
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Building wealth,{' '}
              <span className="text-primary">together.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-balance">
              Golden Future Multipurpose Cooperative Society unites professionals from every
              field to pool resources, evaluate opportunities, and create sustainable
              prosperity — one disciplined contribution at a time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                Apply for Membership
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary"
              >
                Learn More
              </Link>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Already a member?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </div>
          <div className="relative animate-fade-in [animation-delay:200ms]">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
              <img
                src={heroImage}
                alt="Professionals collaborating in a modern office"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Trusted by professionals across Nigeria
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-none bg-border/60 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background px-6 py-8 text-center">
              <stat.icon className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-xl">
              <img
                src={aboutImage}
                alt="A diverse team collaborating around a table"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              About the Cooperative
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              A community where collaboration creates lasting value.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Golden Future Multipurpose Cooperative Society was founded on a simple belief:
              what one person cannot achieve alone can be achieved together. We bring together
              professionals from diverse fields — engineers, doctors, lawyers, accountants,
              farmers, technologists — and channel our combined expertise and capital into
              disciplined savings, vetted investments, and mutual support.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              This is not passive membership. It is a working community of people who contribute
              ideas, time, skills, and resources toward collective prosperity. Every naira is
              accounted for. Every decision is documented. Every member has a voice.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Our Mission</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  To create a trusted community where members work together to maximise wealth,
                  invest in profitable opportunities, and enjoy a better quality of life.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-5 w-5" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Our Vision</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  To build a financially secure, professionally managed, and legally recognised
                  cooperative that positively impacts generations to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professions we serve */}
      <section className="border-y border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Who we build with
          </p>
          <h2 className="mt-3 text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Professionals from every field
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {professions.map((p) => (
              <span
                key={p}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Membership benefits
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Why members choose Golden Future
            </h2>
            <p className="mt-4 text-base text-muted-foreground text-balance">
              More than a savings group — a structured, transparent, and professionally run
              financial community built around your long-term prosperity.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-20 border-y border-border bg-secondary/30 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              What we offer
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Savings, investments, loans &amp; transparent reporting
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section id="transparency" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Financial transparency
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
                Every naira accounted for. Every entry auditable.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                We believe trust is built on verifiable records. The cooperative maintains a
                full double-entry accounting system — a general ledger, cashbook, chart of
                accounts, and published financial statements — so members can see exactly how
                funds are saved, invested, lent, and distributed.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: BookOpen, title: 'Double-entry ledger', text: 'Every confirmed transaction generates balanced debit and credit entries.' },
                  { icon: Lock, title: 'Tamper-evident audit trail', text: 'Approval histories, edits, and reversals are recorded with actor and timestamp.' },
                  { icon: FileText, title: 'Published statements', text: 'Income, expenditure, and financial position are shared with members regularly.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-background p-8 shadow-sm">
              <p className="font-display text-sm font-semibold text-foreground">
                Cooperative-wide disclosures available to members
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  'Aggregate income and expenditure',
                  'Total contributions received',
                  'Approved investment portfolio summaries',
                  'Investment performance reports',
                  'Total loans outstanding',
                  'Approved dividend distributions',
                  'Published financial statements',
                  'Meeting minutes and cooperative notices',
                ].map((d) => (
                  <li key={d} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-xl bg-primary/5 p-4 text-xs text-muted-foreground">
                Private member data is never exposed through public reports. Each member sees
                only their own accounts, statements, and records.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-border bg-secondary/30 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Questions &amp; answers
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-card p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-foreground">
                  {faq.q}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 px-8 py-14 text-center shadow-xl sm:px-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              Ready to build your golden future?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 text-balance">
              Join a community of professionals committed to disciplined savings, transparent
              investments, and shared prosperity. Your journey starts with a single application.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3.5 text-sm font-semibold text-primary shadow-md transition-all hover:shadow-lg"
              >
                Apply for Membership
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/30 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                Member Login
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Phone, label: 'Call us', value: '+234 800 000 0000' },
              { icon: Mail, label: 'Email us', value: 'info@goldenfuture.coop' },
              { icon: MapPin, label: 'Visit us', value: 'Lagos, Nigeria' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="font-medium text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
