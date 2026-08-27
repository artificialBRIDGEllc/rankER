import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupDomains, type RdapRow } from "@/lib/fns";

export const Route = createFileRoute("/domains/")({ component: DomainSearchPage });

function DomainSearchPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<RdapRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) {
      setError("Enter at least two characters.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      setRows(await lookupDomains({ data: q }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "RDAP lookup failed.");
      setRows(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-sm text-muted">RDAP lookup</p>
      <h1 className="mt-1 font-display text-4xl">Look up the name. We do not register it.</h1>
      <p className="mt-3 text-muted">
        This queries public RDAP. It is not a registrar, not WHOIS privacy, not DNS, not SSL,
        and not email forwarding. “Not listed” is not a guarantee the name is available.
      </p>

      <form onSubmit={onSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="heritagecare or heritagecare.com"
          aria-label="Domain search"
        />
        <Button type="submit" size="lg" className="sm:w-40" disabled={busy}>
          {busy ? "Looking up…" : "RDAP search"}
        </Button>
      </form>
      {error ? <p className="mt-4 text-sm text-crit">{error}</p> : null}

      {rows?.length ? (
        <ul className="mt-8 space-y-2">
          {rows.map((row) => (
            <li
              key={row.fqdn}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="font-medium text-fg">{row.fqdn}</p>
                <p className="text-xs text-subtle">{row.note}</p>
              </div>
              <Badge tone={row.status === "registered" ? "warn" : row.status === "error" ? "muted" : "ok"}>
                {row.status === "registered"
                  ? "Registered"
                  : row.status === "not_listed"
                    ? "Not in RDAP"
                    : "Lookup failed"}
              </Badge>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
