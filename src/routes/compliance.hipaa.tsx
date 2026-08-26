import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  ClipboardCheck,
  FileText,
  Lock,
  Scale,
  Shield,
  Stethoscope,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentPreview } from "@/components/document-preview";
import { TrackPage } from "@/components/track-page";
import { cn } from "@/lib/cn";
import { ONE_TIME_PACKS } from "@/lib/pricing";

export const Route = createFileRoute("/compliance/hipaa")({
  component: HipaaPage,
  head: () => ({
    meta: [
      { title: "HIPAA Compliance Pack — rankER" },
      {
        name: "description",
        content:
          "HIPAA-grade website disclosures: Notice of Privacy Practices, BAA starter, PHI handling, telehealth, and Medicare/CMS language.",
      },
    ],
  }),
});

const pack = ONE_TIME_PACKS.compliance_hipaa;

function HipaaPage() {
  const hipaa = pack.includes.filter((i) => !i.startsWith("Everything"));

  return (
    <main>
      <TrackPage name="view_hipaa" />
      <section className="px-4 pb-16 pt-12">
        <div className="mx-auto max-w-3xl text-center">
          <Badge tone="ok" className="mb-5">
            <Shield className="size-3.5" />
            HIPAA + Healthcare Compliance Pack
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl">
            Complete HIPAA disclosures
            <span className="block text-muted">ready for the website</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Notice of Privacy Practices, BAA starter language, PHI handling, breach policy,
            telehealth notices, and Medicare/CMS marketing disclaimers — plus the full
            Standard pack. Brand-matched. Install-ready.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/checkout"
              search={{ pack: "compliance_hipaa" }}
              className={cn(buttonVariants({ size: "lg", variant: "accent" }))}
            >
              Purchase HIPAA pack — $1,497
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/counsel" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              Get it signed — $3,897
            </Link>
          </div>
          <p className="mt-4 text-sm text-subtle">
            Template $1,497 · Counsel sign-off $2,400 · for teams that do not have a lawyer yet.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-sm text-muted md:grid-cols-4">
          {[
            { Icon: Stethoscope, label: "Covered entities" },
            { Icon: Building2, label: "Medicare Advantage" },
            { Icon: FileText, label: "Telehealth platforms" },
            { Icon: Scale, label: "Healthcare software" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center">
              <Icon className="size-5 text-ok" />
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-center font-display text-3xl">Everything included</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border bg-surface p-7">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="size-4 text-muted" />
              <h3 className="font-medium">Standard pack (included)</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {ONE_TIME_PACKS.compliance_standard.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-ok/35 bg-surface p-7">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="size-4 text-ok" />
              <h3 className="font-medium">HIPAA-specific additions</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted">
              {hipaa.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center font-display text-3xl">How delivery works</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["01", "Purchase", "One-time checkout. No subscription required."],
              ["02", "Details", "Legal name, jurisdiction, covered-entity status, brand tokens."],
              ["03", "Generate", "HTML, React, and Markdown under elevated risk scoring."],
              ["04", "Sign-off", "Counsel Desk signs, or you keep the template if you already have counsel."],
            ].map(([step, title, desc]) => (
              <article key={step} className="rounded-2xl border border-border bg-bg p-6">
                <p className="font-mono text-xs text-ok">{step}</p>
                <h3 className="mt-3 font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DocumentPreview pack="compliance_hipaa" />

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex gap-4 rounded-2xl border border-warn/30 bg-surface p-6">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
          <div>
            <h3 className="font-medium text-fg">Templates vs signed packs</h3>
            <p className="mt-2 text-sm text-muted">
              The $1,497 pack is a structured template. If you already have healthcare counsel, they
              should review it. If you do not — and most buyers do not — open Counsel Desk. A
              licensed reviewer signs the website disclosures under a limited engagement. That is
              not a general counsel relationship and not advice on clinical operations.
            </p>
            <Link to="/counsel" className="mt-3 inline-block text-sm underline">
              Open Counsel Desk
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-16 text-center">
        <Badge tone="ok" className="mb-4">
          <Lock className="size-3.5" />
          One-time · $1,497
        </Badge>
        <h2 className="font-display text-3xl">Ready for HIPAA-grade disclosures?</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Complete suite in minutes. Same governed engine that powers rankER audits.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/checkout"
            search={{ pack: "compliance_hipaa" }}
            className={cn(buttonVariants({ size: "lg", variant: "accent" }))}
          >
            Purchase HIPAA pack
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/pricing" hash="packs" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
            Compare packs
          </Link>
        </div>
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-subtle">
          <ClipboardCheck className="size-4" />
          Includes priority legal review checklist
        </p>
      </section>
    </main>
  );
}
