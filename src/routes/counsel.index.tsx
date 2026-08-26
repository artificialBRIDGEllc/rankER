import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TrackPage } from "@/components/track-page";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNSEL_PRODUCTS, ENGAGEMENT_LIMITS, type CounselSku } from "@/lib/counsel";
import { cn } from "@/lib/cn";
import { ONE_TIME_PACKS } from "@/lib/pricing";
import { saveCounselEngagement } from "@/lib/fns";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/counsel/")({
  component: CounselPage,
  head: () => ({
    meta: [
      { title: "Counsel Desk — signed website disclosures · rankER" },
      {
        name: "description",
        content:
          "Most buyers do not have a lawyer. rankER Counsel Desk is a limited engagement with licensed reviewers who sign the website pack. Not a 'ask your legal team' disclaimer.",
      },
    ],
  }),
});

const fieldClass =
  "h-12 min-h-11 w-full rounded-lg border border-border bg-surface px-4 text-base text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function CounselPage() {
  const navigate = useNavigate();
  const add = useAppStore((s) => s.addCounselEngagement);
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [jurisdiction, setJurisdiction] = useState("Texas");
  const [entityType, setEntityType] = useState("Covered entity / clinic");
  const [sku, setSku] = useState<CounselSku>("signoff_hipaa");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const product = COUNSEL_PRODUCTS[sku];
  const packPrice =
    product.pack && sku !== "retainer" ? ONE_TIME_PACKS[product.pack].price : 0;
  const total = product.price + packPrice;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (orgName.trim().length < 2 || !email.includes("@")) {
      setError("Organization name and a valid email are required.");
      return;
    }
    const rec = add({
      orgName: orgName.trim(),
      email: email.trim(),
      jurisdiction: jurisdiction.trim() || "Texas",
      sku,
      entityType,
      notes: notes.trim(),
    });
    void saveCounselEngagement({ data: { id: rec.id, payload: rec } }).catch(() => undefined);
    void navigate({ to: "/counsel/$id", params: { id: rec.id } });
  }

  return (
    <main className="pb-20">
      <TrackPage name="view_counsel" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "rankER Counsel Desk",
          description:
            "Limited attorney engagement to sign website disclosure packs for organizations without in-house counsel.",
        }}
      />

      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/media/still-desk.jpg"
          alt=""
          width={1792}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/50" />
        <div className="relative mx-auto max-w-3xl px-4 py-20">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Counsel Desk</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Signed by counsel.
            <span className="mt-1 block italic text-accent">Not “have your lawyer look at it.”</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Most clinics, agencies, and nonprofits buying these packs do not have a legal team and
            cannot hire one yet. We partner with licensed reviewers under a limited engagement so
            the website disclosures go live with a signature — not a homework assignment.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 md:grid-cols-4">
        {Object.values(COUNSEL_PRODUCTS).map((p) => (
          <article
            key={p.id}
            className={cn(
              "rounded-2xl border p-5",
              p.id === "signoff_hipaa" ? "border-ok/35 bg-surface" : "border-border bg-surface",
            )}
          >
            <p className="text-sm text-muted">{p.name}</p>
            <p className="mt-1 font-display text-2xl">
              ${p.price.toLocaleString()}
              {p.id === "retainer" ? <span className="text-base font-sans text-subtle">/mo</span> : null}
            </p>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <p className="mt-3 text-xs text-subtle">{p.days}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-border bg-surface py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl">How the partnership works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Limited engagement", "You retain Counsel Desk for the website pack only. Engagement letter is explicit about scope."],
              ["02", "Conflicts + jurisdiction", "Reviewer must be licensed for the state you publish in. Multi-state flags extra review."],
              ["03", "Redline the pack", "They start from rankER drafts — NPP, BAA starter, CMS lines — not a blank page."],
              ["04", "Signed opinion", "PDF + change log. Template banner is replaced with the signature block and date."],
            ].map(([n, t, d]) => (
              <article key={n} className="rounded-2xl border border-border bg-bg p-6">
                <p className="font-mono text-xs text-accent">{n}</p>
                <h3 className="mt-3 font-medium">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16">
        <h2 className="font-display text-3xl">Open an engagement</h2>
        <p className="mt-2 text-sm text-muted">
          {sku === "retainer"
            ? `Retainer ${product.price}/mo.`
            : `Pack ${packPrice.toLocaleString()} + counsel ${product.price.toLocaleString()} = $${total.toLocaleString()} one-time.`}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="org" className="mb-1.5 block text-sm text-muted">
              Legal entity name
            </label>
            <Input id="org" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                Email
              </label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="jur" className="mb-1.5 block text-sm text-muted">
                Primary jurisdiction
              </label>
              <Input id="jur" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="entity" className="mb-1.5 block text-sm text-muted">
                Entity type
              </label>
              <select
                id="entity"
                className={fieldClass}
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
              >
                {[
                  "Covered entity / clinic",
                  "Business associate / vendor",
                  "Medicare agency / FMO",
                  "Nonprofit",
                  "Professional practice",
                  "Other",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sku" className="mb-1.5 block text-sm text-muted">
                Engagement
              </label>
              <select
                id="sku"
                className={fieldClass}
                value={sku}
                onChange={(e) => setSku(e.target.value as CounselSku)}
              >
                {Object.values(COUNSEL_PRODUCTS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="mb-1.5 block text-sm text-muted">
              What must be true on the live site
            </label>
            <textarea
              id="notes"
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-crit">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full">
            Submit engagement
          </Button>
        </form>
        <ul className="mt-10 space-y-2 text-sm text-muted">
          {ENGAGEMENT_LIMITS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-subtle">
          Nonprofits may request a counsel discount after opening an engagement.{" "}
          <Link to="/nonprofit" className="underline">
            Nonprofit rates
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
