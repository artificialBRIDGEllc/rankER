import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { DOMAIN_ADDONS, searchDomains, type DomainQuote } from "@/lib/domains";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/domains/")({ component: DomainSearchPage });

function DomainSearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const addToCart = useAppStore((s) => s.addToDomainCart);
  const cart = useAppStore((s) => s.domainCart);
  const results = useMemo(() => (submitted ? searchDomains(submitted) : []), [submitted]);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(query.trim());
  }

  function add(q: DomainQuote) {
    if (!q.available) return;
    addToCart({
      fqdn: q.fqdn,
      sld: q.sld,
      tldId: q.tld.id,
      price: q.price,
      years: 1,
      privacy: true,
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-sm text-muted">rankER Domains · reseller</p>
      <h1 className="mt-1 font-display text-4xl">Register the name. Rank the site.</h1>
      <p className="mt-3 text-muted">
        Search availability, add WHOIS privacy, and attach the domain to a rankER-built site.
        Privacy, DNS, SSL, and email forwarding are included.
      </p>

      <form onSubmit={onSearch} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="heritagecare or heritagecare.com"
          aria-label="Domain search"
        />
        <Button type="submit" size="lg" className="sm:w-40">
          Search
        </Button>
      </form>

      {cart.length ? (
        <p className="mt-4 text-sm text-muted">
          {cart.length} in cart ·{" "}
          <Link to="/domains/cart" className="underline">
            Review cart
          </Link>
        </p>
      ) : null}

      {submitted && results.length === 0 ? (
        <p className="mt-8 text-sm text-crit">Enter at least two characters.</p>
      ) : null}

      {results.length ? (
        <ul className="mt-8 space-y-2">
          {results.map((row) => {
            const inCart = cart.some((c) => c.fqdn === row.fqdn);
            return (
              <li
                key={row.fqdn}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    {row.fqdn}{" "}
                    {row.premium && row.available ? (
                      <Badge tone="accent" className="ml-1">
                        premium
                      </Badge>
                    ) : null}
                  </p>
                  <p className="text-sm text-muted">{row.tld.note}</p>
                </div>
                <div className="flex items-center gap-3">
                  {row.available ? (
                    <>
                      <span className="font-mono text-sm tabular-nums">${row.price.toFixed(2)}/yr</span>
                      <Button
                        type="button"
                        size="sm"
                        variant={inCart ? "secondary" : "primary"}
                        disabled={inCart}
                        onClick={() => add(row)}
                      >
                        {inCart ? "In cart" : "Add"}
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-subtle">Taken</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {DOMAIN_ADDONS.map((a) => (
          <article key={a.id} className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-sm font-medium">{a.name}</p>
            <p className="mt-1 font-mono text-xs text-ok">Included</p>
            <p className="mt-2 text-sm text-muted">{a.detail}</p>
          </article>
        ))}
      </section>

      <p className="mt-8 text-sm text-subtle">
        rankER resells through a contracted registrar. This preview quotes availability and price;
        live registration happens after Stripe in production.
      </p>
      {cart.length ? (
        <Link to="/domains/cart" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Continue to cart
        </Link>
      ) : null}
    </main>
  );
}
