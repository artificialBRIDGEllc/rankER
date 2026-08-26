import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { BUDGET_LABELS, ORG_STATUS } from "@/lib/nonprofit";
import { PLANS } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/nonprofit/$id")({ component: NonprofitConfirm });

function NonprofitConfirm() {
  const { id } = Route.useParams();
  const list = useAppStore((s) => s.nonprofitRequests);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const rec = list.find((r) => r.id === id);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-muted">Loading request…</p>
      </main>
    );
  }

  if (!rec) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Request not found</h1>
        <Link to="/nonprofit" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Submit a request
        </Link>
      </main>
    );
  }

  const askedZero = rec.ask === "100";
  const plan = PLANS[rec.plan];

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm text-muted">Request {rec.id}</p>
      <h1 className="mt-1 font-display text-4xl">Under review</h1>
      <p className="mt-3 text-muted">
        {rec.orgName} asked for {rec.ask === "100" ? "a $0 scholarship" : `${rec.ask}% off`} on{" "}
        {plan.name}. Typical award for this profile is {rec.typicalPercent}%
        {rec.typicalPercent === 100
          ? " ($0 / month)."
          : ` ($${rec.typicalMonthly.toFixed(2)}/mo).`}{" "}
        Written decision in five business days.
      </p>
      <dl className="mt-8 space-y-3 rounded-2xl border border-border bg-surface p-6 text-sm">
        <Row label="Status" value={ORG_STATUS[rec.status]} />
        <Row label="Budget" value={BUDGET_LABELS[rec.budget]} />
        <Row label="EIN" value={rec.ein} />
        <Row label="Contact" value={`${rec.contactName} · ${rec.email}`} />
      </dl>
      {askedZero ? (
        <p className="mt-6 text-sm text-muted">
          $0 awards are reserved for the smallest budgets and underserved missions. If we cannot
          scholarship the full plan, we still offer the typical percent above.
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/audit" className={cn(buttonVariants())}>
          Run free analysis now
        </Link>
        <Link to="/pricing" className={cn(buttonVariants({ variant: "secondary" }))}>
          List pricing
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
