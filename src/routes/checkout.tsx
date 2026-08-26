import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ICANN_NOTICE } from "@/lib/domains";
import { COUNSEL_PRODUCTS, type CounselSku } from "@/lib/counsel";
import { ONE_TIME_PACKS, PLANS, type PackId, type PlanId } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

const searchSchema = z.object({
  pack: z.enum(["compliance_standard", "compliance_hipaa", "compliance_regulated"]).optional(),
  plan: z.enum(["tier1", "tier2", "tier3"]).optional(),
  domain: z.enum(["cart"]).optional(),
  counsel: z.enum(["signoff_standard", "signoff_regulated", "signoff_hipaa", "retainer"]).optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { pack, plan, domain, counsel } = Route.useSearch();
  const navigate = useNavigate();
  const addPurchase = useAppStore((s) => s.addPurchase);
  const track = useAppStore((s) => s.track);
  const cart = useAppStore((s) => s.domainCart);
  const registerCart = useAppStore((s) => s.registerCart);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<{ id: string; domains: string[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const packItem = pack ? ONE_TIME_PACKS[pack as PackId] : null;
  const planItem = plan ? PLANS[plan as PlanId] : null;
  const counselItem = counsel ? COUNSEL_PRODUCTS[counsel as CounselSku] : null;
  const domainMode = domain === "cart" || (!packItem && !planItem && !counselItem && cart.length > 0);
  const domainTotal = cart.reduce((sum, i) => sum + i.price, 0);
  const label = domainMode
    ? cart.map((c) => c.fqdn).join(", ") || "Domains"
    : [packItem?.name, counselItem?.name, planItem?.name].filter(Boolean).join(" + ") || "Select a product";
  const amount = domainMode
    ? domainTotal
    : (packItem?.price ?? 0) + (counselItem?.price ?? 0) + (planItem?.priceMonthly ?? 0);
  const kind = domainMode ? "domain" : counselItem && !packItem && !planItem ? "counsel" : packItem ? "pack" : "plan";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (domainMode && !cart.length) {
      setErr("Your domain cart is empty.");
      return;
    }
    if (!domainMode && !packItem && !planItem && !counselItem) {
      setErr("Choose a plan, pack, domain, or counsel engagement.");
      return;
    }
    if (!name.trim() || !email.includes("@")) {
      setErr("Name and a valid email are required.");
      return;
    }
    const rec = addPurchase({
      kind,
      sku: domainMode
        ? cart.map((c) => c.fqdn).join(",")
        : ((counselItem?.id ?? packItem?.id ?? planItem?.id) as string),
      label,
      amount,
    });
    const registered = domainMode ? registerCart(rec.id) : [];
    track("checkout_complete", "/checkout", rec.sku);
    setDone({ id: rec.id, domains: registered.map((d) => d.fqdn) });
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-4xl">Order recorded</h1>
        <p className="mt-3 text-muted">
          Demo checkout complete for {label}. In production this would open Stripe
          {domainMode ? " and submit the registrar order" : " and generate deliverables"} after payment.
        </p>
        <p className="mt-2 font-mono text-xs text-subtle">{done.id}</p>
        {done.domains[0] ? (
          <Link
            to="/domains/$fqdn"
            params={{ fqdn: done.domains[0] }}
            className="mt-6 inline-block text-sm underline"
          >
            Manage {done.domains[0]}
          </Link>
        ) : null}
        {packItem && !counselItem ? (
          <p className="mt-4 text-sm text-muted">
            Template pack. If you do not have counsel,{" "}
            <Link to="/counsel" className="underline">
              open Counsel Desk
            </Link>{" "}
            for a signed opinion letter.
          </p>
        ) : null}
        <Link to="/" className="mt-8 block text-sm text-fg underline">
          Back home
        </Link>
      </main>
    );
  }

  const ready = domainMode ? cart.length > 0 : Boolean(packItem || planItem || counselItem);

  return (
    <main className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-muted">
        {ready
          ? `${label} · $${amount.toLocaleString(undefined, { minimumFractionDigits: domainMode ? 2 : 0 })}${planItem && !domainMode ? "/mo" : domainMode ? " first year" : " one-time"}`
          : "No product selected."}
      </p>
      {!ready ? (
        <Link to="/pricing" className="mt-6 inline-block text-sm underline">
          View pricing
        </Link>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
              Legal / company name
            </label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
              Email
            </label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {err ? <p className="text-sm text-crit">{err}</p> : null}
          {domainMode ? <p className="text-xs text-subtle">{ICANN_NOTICE}</p> : (
            <p className="text-xs text-subtle">
              Preview checkout — no card is charged. Stripe wiring is the production path.
            </p>
          )}
          <Button type="submit" size="lg" className="w-full">
            Confirm ${amount.toFixed(domainMode ? 2 : 0)}
          </Button>
        </form>
      )}
      <button
        type="button"
        className="mt-6 text-sm text-subtle underline"
        onClick={() => navigate({ to: domainMode ? "/domains" : "/pricing" })}
      >
        Cancel
      </button>
    </main>
  );
}
