import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { COUNSEL_PRODUCTS, COUNSEL_STEPS, type CounselStatus } from "@/lib/counsel";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/counsel/$id")({ component: CounselMatter });

const ORDER: CounselStatus[] = ["submitted", "conflicts", "review", "signed"];

function CounselMatter() {
  const { id } = Route.useParams();
  const list = useAppStore((s) => s.counselEngagements);
  const advance = useAppStore((s) => s.advanceCounsel);
  const addPurchase = useAppStore((s) => s.addPurchase);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const rec = list.find((r) => r.id === id);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-muted">Loading engagement…</p>
      </main>
    );
  }
  if (!rec) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Engagement not found</h1>
        <Link to="/counsel" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Open Counsel Desk
        </Link>
      </main>
    );
  }

  const product = COUNSEL_PRODUCTS[rec.sku];
  const idx = ORDER.indexOf(rec.status);

  function payPreview() {
    addPurchase({
      kind: "counsel",
      sku: rec!.sku,
      label: product.name,
      amount: product.price,
    });
    advance(rec!.id);
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm text-muted">{rec.id}</p>
      <h1 className="mt-1 font-display text-4xl">
        {rec.status === "signed" ? "Signed" : "Engagement"}
      </h1>
      <p className="mt-3 text-muted">
        {rec.orgName} · {rec.jurisdiction} · {product.name}. Reviewer: {rec.reviewer}.
      </p>

      <ol className="mt-8 space-y-3">
        {ORDER.map((step, i) => (
          <li
            key={step}
            className={cn(
              "rounded-2xl border px-5 py-4 text-sm",
              i <= idx ? "border-ok/35 bg-surface text-fg" : "border-border text-muted",
            )}
          >
            {COUNSEL_STEPS[step]}
          </li>
        ))}
      </ol>

      {rec.status !== "signed" ? (
        <div className="mt-8 space-y-3">
          <Button type="button" size="lg" className="w-full" onClick={payPreview}>
            {rec.status === "submitted"
              ? `Record fee · $${product.price.toLocaleString()} and clear conflicts`
              : "Advance counsel review"}
          </Button>
          <p className="text-xs text-subtle">
            Preview advances the matter locally. Production: Stripe, then the assigned licensed
            reviewer signs a dated opinion letter.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-ok/35 bg-surface p-6">
          <p className="font-medium">Opinion letter ready (preview)</p>
          <p className="mt-2 text-sm text-muted">
            Website disclosure pack for {rec.orgName} is signed as of today in {rec.jurisdiction}.
            Scope is limited to the installed documents. Not a general retainer unless you chose
            Counsel retainer.
          </p>
          <Link to="/compliance/hipaa" className={cn(buttonVariants({ variant: "secondary" }), "mt-5 inline-flex")}>
            View HIPAA pack
          </Link>
        </div>
      )}
    </main>
  );
}
