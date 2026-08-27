import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ICANN_NOTICE } from "@/lib/domains";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/domains/$fqdn")({ component: DomainManagePage });

function DomainManagePage() {
  const { fqdn } = Route.useParams();
  const decoded = decodeURIComponent(fqdn);
  const domains = useAppStore((s) => s.domains);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  const record = domains.find((d) => d.fqdn === decoded);

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <p className="text-sm text-muted">Not a live registration</p>
      <h1 className="mt-1 font-display text-4xl">{decoded}</h1>
      <p className="mt-3 text-muted">
        {record
          ? "This browser still has a leftover local note for this name from an older preview. It is not WHOIS, not nameservers, and not an ICANN registration."
          : "rankER does not register, renew, or host this name. Look it up in RDAP, then use a real registrar."}
      </p>
      <p className="mt-4 text-xs text-subtle">{ICANN_NOTICE}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/domains" className={cn(buttonVariants())}>
          RDAP search
        </Link>
        <Link to="/build" className={cn(buttonVariants({ variant: "secondary" }))}>
          Build an in-app preview
        </Link>
      </div>
    </main>
  );
}
