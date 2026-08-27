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
        <h1 className="font-display text-4xl">Pricing</h1>
        <p className="mt-3 text-muted">
          Free analysis fetches public HTML. Paid tiers save history and unlock template
          downloads. We do not run weekly jobs, register domains, or sign legal documents.
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
            {plan.popular ? <p className="mb-2 text-xs font-medium text-accent">Includes template download</p> : null}
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
              {plan.id === "free" ? "Start free" : "Choose plan"}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-ok/35 bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">Need a human reviewer?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Submit a review request. rankER stores it on your account. We do not employ counsel
          and no signed letter is generated automatically.
        </p>
        <Link to="/counsel" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Open Counsel Desk
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">Nonprofit?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          501(c)(3) and similar orgs can request a discount. The request is stored. A human
          has to approve it — there is no automatic $0 plan.
        </p>
        <Link to="/nonprofit" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Request a nonprofit rate
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
        <h2 className="font-display text-2xl">No site yet?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Generate an in-app preview from a brief. You still have to deploy it yourself.
        </p>
        <Link to="/build" className={cn(buttonVariants(), "mt-5 inline-flex")}>
          Build from scratch
        </Link>
      </div>

      <h2 id="domains" className="mt-20 text-center font-display text-2xl">
        Domain RDAP lookup
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted">
        Public RDAP records. We do not register names. Figures below are typical retail, not a quote from us:
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
          Look up RDAP
        </Link>
      </div>

      <h2 id="packs" className="mt-20 text-center font-display text-2xl">
        One-time template packs
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-muted">
        Markdown you can download on the pack page. Not legal advice.
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
