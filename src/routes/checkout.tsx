import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { COUNSEL_PRODUCTS, type CounselSku } from "@/lib/counsel";
import { ONE_TIME_PACKS, PLANS, type PackId, type PlanId } from "@/lib/pricing";
import { createCheckout } from "@/lib/fns";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useAppStore } from "@/lib/store";

const searchSchema = z.object({
  pack: z.enum(["compliance_standard", "compliance_hipaa", "compliance_regulated"]).optional(),
  plan: z.enum(["tier1", "tier2", "tier3"]).optional(),
  domain: z.enum(["cart"]).optional(),
  counsel: z.enum(["signoff_standard", "signoff_regulated", "signoff_hipaa", "retainer"]).optional(),
  paid: z.string().optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  component: CheckoutPage,
});

function CheckoutPage() {
  const { pack, plan, domain, counsel, paid } = Route.useSearch();
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const addPurchase = useAppStore((s) => s.addPurchase);
  const track = useAppStore((s) => s.track);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string; preview: boolean } | null>(
    paid ? { id: paid, preview: false } : null,
  );
  const [err, setErr] = useState<string | null>(null);

  const packItem = pack ? ONE_TIME_PACKS[pack as PackId] : null;
  const planItem = plan ? PLANS[plan as PlanId] : null;
  const counselItem = counsel ? COUNSEL_PRODUCTS[counsel as CounselSku] : null;
  const domainMode = domain === "cart";
  const label =
    [packItem?.name, planItem?.name].filter(Boolean).join(" + ") || "Select a product";
  const amount = (packItem?.price ?? 0) + (planItem?.priceMonthly ?? 0);
  const kind = packItem ? "pack" : "plan";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!packItem && !planItem) {
      setErr("Choose a plan or template pack.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      const sku = (packItem?.id ?? planItem?.id) as string;
      const res = await createCheckout({
        data: { kind, sku, label, amount },
      });
      addPurchase({ kind, sku, label, amount });
      track("checkout_complete", "/checkout", sku);
      if (res.checkoutUrl) {
        window.location.assign(res.checkoutUrl);
        return;
      }
      setDone({ id: res.orderId, preview: res.preview });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed.";
      if (message === "Unauthorized") {
        setErr("Sign in to complete checkout.");
      } else {
        setErr(message);
      }
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-2" />
      </main>
    );
  }

  if (!user) return <RedirectToSignIn />;

  if (domainMode) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-4xl">We do not sell domains</h1>
        <p className="mt-3 text-muted">
          rankER is not a registrar. Look the name up in RDAP, then register it elsewhere.
        </p>
        <Link to="/domains" className={cn(buttonVariants(), "mt-8 inline-flex")}>
          RDAP search
        </Link>
      </main>
    );
  }

  if (counselItem && !packItem && !planItem) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-4xl">We do not sell a signed letter</h1>
        <p className="mt-3 text-muted">
          {counselItem.name} is an illustrative future fee. Store a free request on Counsel Desk.
          Nothing is signed.
        </p>
        <Link to="/counsel" className={cn(buttonVariants(), "mt-8 inline-flex")}>
          Store a review request
        </Link>
      </main>
    );
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-4xl">{done.preview ? "Order saved" : "Payment received"}</h1>
        <p className="mt-3 text-muted">
          {done.preview
            ? `${label} is on file. Stripe is not configured here, so no card was charged.`
            : `${label} is paid. Template downloads and saved history apply to this account.`}
        </p>
        <p className="mt-2 font-mono text-xs text-subtle">{done.id}</p>
        {packItem ? (
          <p className="mt-4 text-sm text-muted">
            Template pack. For a human review request,{" "}
            <Link to="/counsel" className="underline">
              open Counsel Desk
            </Link>
            . We still do not sign it.
          </p>
        ) : null}
        <Link to="/" className="mt-8 block text-sm text-fg underline">
          Back home
        </Link>
      </main>
    );
  }

  const ready = Boolean(packItem || planItem);

  return (
    <main className="mx-auto max-w-lg px-4 py-14">
      <h1 className="font-display text-4xl">Checkout</h1>
      <p className="mt-2 text-muted">
        {ready
          ? `${label} · $${amount.toLocaleString()}${planItem && !packItem ? "/mo" : packItem && planItem ? " (pack + first month)" : " one-time"}`
          : "No product selected."}
      </p>
      {!ready ? (
        <Link to="/pricing" className="mt-6 inline-block text-sm underline">
          View pricing
        </Link>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          {err ? <p className="text-sm text-crit">{err}</p> : null}
          <p className="text-xs text-subtle">
            Stripe Checkout when a live key is present. Otherwise the order is stored on
            your account without a charge. Plans save history. Packs unlock Markdown downloads.
            We do not register domains or sign legal documents.
          </p>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Starting checkout…" : `Pay ${amount.toFixed(0)}`}
          </Button>
        </form>
      )}
      <button
        type="button"
        className="mt-6 text-sm text-subtle underline"
        onClick={() => navigate({ to: "/pricing" })}
      >
        Cancel
      </button>
    </main>
  );
}
