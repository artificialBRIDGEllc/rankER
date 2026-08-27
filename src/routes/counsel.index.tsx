import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TrackPage } from "@/components/track-page";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNSEL_PRODUCTS, ENGAGEMENT_LIMITS, type CounselSku } from "@/lib/counsel";
import { cn } from "@/lib/cn";
import { saveCounselEngagement } from "@/lib/fns";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/counsel/")({
  component: CounselPage,
  head: () => ({
    meta: [
      { title: "Counsel Desk — request a review · rankER" },
      {
        name: "description",
        content:
          "Submit a website-disclosure review request. rankER stores it. We do not employ counsel and do not issue a signed letter.",
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
          "@type": "WebPage",
          name: "rankER Counsel Desk",
          description:
            "A request form that stores a website-disclosure review. Not an attorney-client relationship. No signed letter is issued.",
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
            Request a review.
            <span className="mt-1 block italic text-accent">We do not sign the pack.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            This form stores a request on your account. We do not partner with reviewers in this
            product, we do not issue a signed letter, and we do not put the templates live for you.
            Fees below are illustrative for a future engagement — they are not for sale today.
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
              <span className="text-base font-sans text-subtle"> illustrative</span>
            </p>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <p className="mt-3 text-xs text-subtle">{p.days}</p>
          </article>
        ))}
      </section>

      <section className="border-y border-border bg-surface py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-3xl">What this form actually does</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ["01", "You write the request", "Legal name, jurisdiction, and what must be true on the live site."],
              ["02", "We store it", "Signed-in accounts persist the row. No reviewer is assigned."],
              ["03", "Nothing is signed", "Template banners stay templates. No PDF opinion letter is generated."],
              ["04", "Your own counsel", "Have a lawyer you hire review the Markdown before you publish."],
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
        <h2 className="font-display text-3xl">Store a request</h2>
        <p className="mt-2 text-sm text-muted">
          Free. {product.name} is recorded as the type you asked about. No card is charged.
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
                What you would want reviewed
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
            Store request
          </Button>
        </form>
        <ul className="mt-10 space-y-2 text-sm text-muted">
          {ENGAGEMENT_LIMITS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-subtle">
          Nonprofits can also store a discount request.{" "}
          <Link to="/nonprofit" className="underline">
            Nonprofit rates
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
