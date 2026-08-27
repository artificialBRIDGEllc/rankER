import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { COUNSEL_PRODUCTS } from "@/lib/counsel";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/counsel/$id")({ component: CounselMatter });

function CounselMatter() {
  const { id } = Route.useParams();
  const list = useAppStore((s) => s.counselEngagements);
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
        <Link to="/counsel" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Open Counsel Desk
        </Link>
      </main>
    );
  }

  const product = COUNSEL_PRODUCTS[rec.sku];

  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <p className="text-sm text-muted">{rec.id}</p>
      <h1 className="mt-1 font-display text-4xl">Request stored</h1>
      <p className="mt-3 text-muted">
        {rec.orgName} · {rec.jurisdiction} · {product.name}. {rec.reviewer}.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <p className="font-medium">Nothing was signed</p>
        <p className="mt-2 text-sm text-muted">
          This row is a stored request. No licensed reviewer is assigned, no opinion letter is
          generated, and the template pack is still a template. Have your own counsel review the
          Markdown before you publish.
        </p>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Email</dt>
            <dd>{rec.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Entity</dt>
            <dd className="text-right">{rec.entityType}</dd>
          </div>
          {rec.notes ? (
            <div>
              <dt className="text-muted">Notes</dt>
              <dd className="mt-1">{rec.notes}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/compliance/hipaa" className={cn(buttonVariants())}>
          Download HIPAA templates
        </Link>
        <Link to="/counsel" className={cn(buttonVariants({ variant: "secondary" }))}>
          Store another request
        </Link>
      </div>
    </main>
  );
}
