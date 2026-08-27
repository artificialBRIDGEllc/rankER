import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GeneratedSitePreview } from "@/components/generated-site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { GeneratedSite } from "@/lib/site-builder";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/build/$id")({ component: BuildResultPage });

function BuildResultPage() {
  const { id } = Route.useParams();
  const sites = useAppStore((s) => s.sites);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  const site: GeneratedSite | undefined = sites.find((s) => s.id === id);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm text-muted">Loading site…</p>
      </main>
    );
  }

  if (!site) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Site not found</h1>
        <p className="mt-2 text-muted">Generate a new site from a blank brief.</p>
        <Link to="/build" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Build from scratch
        </Link>
      </main>
    );
  }

  const hipaa = site.brief.compliance === "hipaa";

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm text-muted">From scratch · {site.brief.industry}</p>
      <h1 className="mt-1 font-display text-4xl">{site.brief.name}</h1>
      <p className="mt-2 text-muted">{site.seo.description}</p>

      <div className="mt-8">
        <GeneratedSitePreview site={site} />
      </div>

      <h2 className="mt-12 font-display text-2xl">Brand tokens</h2>
      <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface p-5 font-mono text-xs text-muted">
        {`--bg: ${site.tokens.bg};
--surface: ${site.tokens.surface};
--fg: ${site.tokens.fg};
--muted: ${site.tokens.muted};
--accent: ${site.tokens.accent};`}
      </pre>

      <h2 className="mt-12 font-display text-2xl">JSON-LD</h2>
      <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface p-5 font-mono text-xs text-muted">
        {site.schema}
      </pre>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {hipaa ? (
          <Link to="/compliance/hipaa" className={cn(buttonVariants())}>
            Add HIPAA pack
          </Link>
        ) : (
          <Link to="/pricing" hash="packs" className={cn(buttonVariants())}>
            Add compliance pack
          </Link>
        )}
        <Link to="/checkout" search={{ plan: "tier3" }} className={cn(buttonVariants({ variant: "secondary" }))}>
          Portfolio plan
        </Link>
        <Link to="/domains" className={cn(buttonVariants({ variant: "ghost" }))}>
          Look up a name (RDAP)
        </Link>
        <Link to="/build" className={cn(buttonVariants({ variant: "ghost" }))}>
          New brief
        </Link>
      </div>
    </main>
  );
}
