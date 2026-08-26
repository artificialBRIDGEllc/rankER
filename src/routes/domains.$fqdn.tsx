import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/domains/$fqdn")({ component: DomainManagePage });

function DomainManagePage() {
  const { fqdn } = Route.useParams();
  const decoded = decodeURIComponent(fqdn);
  const domains = useAppStore((s) => s.domains);
  const sites = useAppStore((s) => s.sites);
  const attach = useAppStore((s) => s.attachDomain);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-muted">Loading domain…</p>
      </main>
    );
  }

  const record = domains.find((d) => d.fqdn === decoded);
  if (!record) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Domain not in this account</h1>
        <Link to="/domains" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Search domains
        </Link>
      </main>
    );
  }

  const site = sites.find((s) => s.id === record.attachSiteId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <p className="text-sm text-muted">Registered through rankER</p>
      <h1 className="mt-1 font-display text-4xl">{record.fqdn}</h1>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2 text-sm">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <dt className="text-muted">Expires</dt>
          <dd className="mt-1 font-mono">{record.expiresAt.slice(0, 10)}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <dt className="text-muted">WHOIS privacy</dt>
          <dd className="mt-1">{record.privacy ? "On" : "Off"}</dd>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
          <dt className="text-muted">Nameservers</dt>
          <dd className="mt-1 font-mono text-xs">{record.nameservers.join(" · ")}</dd>
        </div>
      </dl>

      <h2 className="mt-10 font-medium">Attach a generated site</h2>
      <select
        className="mt-3 h-11 w-full rounded-lg border border-border bg-surface px-3 text-fg"
        value={record.attachSiteId ?? ""}
        onChange={(e) => attach(record.fqdn, e.target.value || undefined)}
      >
        <option value="">Not attached</option>
        {sites.map((s) => (
          <option key={s.id} value={s.id}>
            {s.brief.name}
          </option>
        ))}
      </select>
      {site ? (
        <Link
          to="/build/$id"
          params={{ id: site.id }}
          className="mt-3 inline-block text-sm underline"
        >
          Open {site.brief.name}
        </Link>
      ) : (
        <Link to="/build" className="mt-3 inline-block text-sm underline">
          Build a site for this domain
        </Link>
      )}
    </main>
  );
}
