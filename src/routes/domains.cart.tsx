import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ICANN_NOTICE } from "@/lib/domains";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/domains/cart")({ component: DomainCartPage });

function DomainCartPage() {
  const cart = useAppStore((s) => s.domainCart);
  const sites = useAppStore((s) => s.sites);
  const remove = useAppStore((s) => s.removeFromDomainCart);
  const setCartSite = useAppStore((s) => s.setCartSite);
  const total = cart.reduce((sum, i) => sum + i.price, 0);

  if (!cart.length) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Cart is empty</h1>
        <p className="mt-2 text-muted">Search a name to add it as a rankER-resold domain.</p>
        <Link to="/domains" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Search domains
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-display text-4xl">Domain cart</h1>
      <ul className="mt-8 space-y-3">
        {cart.map((item) => (
          <li key={item.fqdn} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.fqdn}</p>
                <p className="text-sm text-muted">
                  {item.years} year · privacy on · ${item.price.toFixed(2)}
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(item.fqdn)}>
                Remove
              </Button>
            </div>
            {sites.length ? (
              <label className="mt-4 block text-sm text-muted">
                Attach to generated site
                <select
                  className="mt-1.5 h-11 w-full rounded-lg border border-border bg-bg px-3 text-fg"
                  value={item.attachSiteId ?? ""}
                  onChange={(e) => setCartSite(item.fqdn, e.target.value || undefined)}
                >
                  <option value="">None yet</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.brief.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="mt-3 text-sm text-subtle">
                Optional:{" "}
                <Link to="/build" className="underline">
                  build a site
                </Link>{" "}
                and attach this domain.
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-lg">
        Total{" "}
        <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
        <span className="text-sm text-muted"> first year</span>
      </p>
      <p className="mt-4 text-xs text-subtle">{ICANN_NOTICE}</p>
      <Link
        to="/checkout"
        search={{ domain: "cart" }}
        className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex")}
      >
        Checkout domains
      </Link>
    </main>
  );
}
