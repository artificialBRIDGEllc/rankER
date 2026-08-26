import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { TLDS } from "@/lib/domains";
import { ONE_TIME_PACKS, PLANS } from "@/lib/pricing";

export const Route = createFileRoute("/pricing")({ component: PricingPage });

function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <header className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-display text-4xl">Pricing that scales with you</h1>
        <p className="mt-3 text-muted">
          Start free. Analyze an existing URL or build a site from a blank brief.
          Upgrade for weekly cadence, continuous monitoring, or full rebuild power.
          Compliance packs are one-time and available to everyone.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.values(PLANS).map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "flex flex-col rounded-2xl border p-6",
              plan.popular ? "border-accent/40 bg-surface" : "border-border bg-surface",
            )}
          >
            {plan.popular ? <p className="mb-2 text-xs font-medium text-accent">Most chosen</p> : null}
            <p className="text-sm text-muted">{plan.name}</p>
            <p className="mt-1 font-display text-3xl">
              {plan.priceMonthly === 0 ? "$0" : `$${plan.priceMonthly}`}
              {plan.priceMonthly > 0 ? (
                <span className="text-base font-sans font-normal text-subtle">/mo</span>
              ) : null}
            </p>
            <p className="mt-2 text-sm text-subtle">{plan.description}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={plan.id === "free" ? "/audit" : "/checkout"}
              search={plan.id === "free" ? undefined : { plan: plan.id }}
              className={cn(
                buttonVariants({ variant: plan.popular ? "primary" : "secondary" }),
                "mt-6 w-full",
              )}
            >
              {plan.id === "free" ? "Start free" : plan.id === "tier3" ? "Start rebuild" : "Choose plan"}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-ok/35 bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">No lawyer on staff?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Counsel Desk is a limited engagement. Licensed reviewers sign the website pack so you
          are not told to “have your legal team check” a document you cannot staff.
        </p>
        <Link to="/counsel" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Open Counsel Desk
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">Nonprofit?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          501(c)(3) and public-benefit orgs can request 50–80% off, or a scholarship to $0.
          Written decision in five business days.
        </p>
        <Link to="/nonprofit" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Request a nonprofit rate
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">No site yet?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Build from a blank brief. Healthcare, professional, local, or software — tokens, pages, and schema included.
        </p>
        <Link to="/build" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Build from scratch
        </Link>
      </div>

      <h2 id="domains" className="mt-20 text-center font-display text-2xl">
        Domain reseller
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted">
        rankER resells registrations. WHOIS privacy, DNS, SSL, and email forwarding included. First-year list price:
      </p>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">TLD</th>
              <th className="px-4 py-3 font-medium">First year</th>
              <th className="px-4 py-3 font-medium">Renewal</th>
              <th className="px-4 py-3 font-medium">Best for</th>
            </tr>
          </thead>
          <tbody>
            {TLDS.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{t.label}</td>
                <td className="px-4 py-3 font-mono tabular-nums">${t.price.toFixed(2)}</td>
                <td className="px-4 py-3 font-mono tabular-nums">${t.renewal.toFixed(2)}</td>
                <td className="px-4 py-3 text-muted">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-center">
        <Link to="/domains" className={cn(buttonVariants({ variant: "secondary" }), "inline-flex")}>
          Search availability
        </Link>
      </div>

      <h2 id="packs" className="mt-20 text-center font-display text-2xl">
        One-time compliance packs
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted">
        Generated with brand tokens. HIPAA and regulated packs run under elevated governance.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Object.values(ONE_TIME_PACKS).map((pack) => (
          <article
            key={pack.id}
            className={cn(
              "rounded-2xl border p-7",
              pack.id === "compliance_hipaa" ? "border-ok/35 bg-surface" : "border-border bg-surface",
            )}
          >
            <p className="text-sm text-muted">{pack.name}</p>
            <p className="mt-1 font-display text-2xl">${pack.price.toLocaleString()}</p>
            <p className="mt-3 text-sm text-muted">{pack.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {pack.includes.slice(0, 5).map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link to={pack.href} className={cn(buttonVariants({ variant: "secondary" }), "mt-6 w-full")}>
              View pack
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
