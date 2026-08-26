import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { JsonLd } from "@/components/json-ld";
import { ScoreRing } from "@/components/score-ring";
import { TrackPage } from "@/components/track-page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { FAQ, LAB_LIFTS, LAB_NOTE } from "@/lib/proof";
import { ONE_TIME_PACKS, PLANS } from "@/lib/pricing";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "rankER — Elite ranking, brand, HIPAA, domains" },
      {
        name: "description",
        content:
          "Free website analysis for top-1% ranking. Build from scratch, register the domain, ship HIPAA disclosures. Governed copilot. Core Web Vitals, brand unity, conversion.",
      },
    ],
  }),
});

const TICKER = [
  "LCP ≤ 2.5s",
  "INP ≤ 200ms",
  "CLS ≤ 0.1",
  "Brand ≥ 9.5",
  "Schema graph",
  "HIPAA NPP",
  "Title CTR",
  "Form conversion",
  ".health / .care",
  "Governed apply",
];

function Home() {
  return (
    <main>
      <TrackPage name="view_home" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "rankER",
              url: "https://ranker.theartificialbridge.com",
              applicationCategory: "BusinessApplication",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description:
                "Website ranking, brand unification, HIPAA compliance packs, from-scratch builds, and domain reseller.",
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }}
      />

      <section className="relative min-h-[72vh] overflow-hidden">
        <img
          src="/media/hero-lobby.jpg"
          alt="Dark modernist interior with a single shaft of steel-blue light"
          width={1792}
          height={1008}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-bg/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/25" />
        <div className="hairline-grid absolute inset-0 opacity-25" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 md:pb-20">
          <Badge tone="muted" className="reveal mb-5 w-fit">
            <Sparkles className="size-3.5" />
            Lab CWV · Brand 9.5 · HIPAA packs
          </Badge>
          <h1 className="reveal reveal-d1 max-w-3xl font-display text-4xl text-fg sm:text-6xl md:text-[4.2rem]">
            Rank in the top 1%.
            <span className="mt-1 block italic text-accent">Then look like it.</span>
          </h1>
          <p className="reveal reveal-d2 mt-5 max-w-xl text-base text-muted sm:text-lg">
            Technical SEO, Core Web Vitals, authority, and brand — shipped as tokens, patches,
            and disclosures. Free analysis. From-scratch builds. Domains included.
          </p>
          <div className="reveal reveal-d3 mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/audit"
              className={cn(buttonVariants({ size: "lg" }))}
              onClick={() => useAppStore.getState().track("cta_audit", "/", "home")}
            >
              Start free analysis
              <ArrowRight className="size-4" />
            </Link>
            <Link to="/build" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
              Build from scratch
            </Link>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border bg-surface py-3">
        <div className="ticker-track gap-10 px-4 text-xs tracking-[0.18em] text-muted uppercase">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={`${item}-${i}`} className="shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Conversion, measured</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">The product is the lift, not the report.</h2>
          <p className="mt-3 max-w-lg text-muted">{LAB_NOTE}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <dt className="text-sm text-muted">Median form conversion</dt>
              <dd className="mt-1 font-display text-3xl">
                <CountUp to={3.4} suffix="%" />
              </dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <dt className="text-sm text-muted">Title CTR after rewrite</dt>
              <dd className="mt-1 font-display text-3xl">
                <CountUp to={4.6} suffix="%" />
              </dd>
            </div>
          </dl>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border">
          <img
            src="/media/still-desk.jpg"
            alt="Editorial still life of a scorecard and steel ruler on a dark desk"
            width={1792}
            height={1008}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16">
        <div className="mx-auto max-w-6xl px-4">
          <header className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl">Four scores. One threshold.</h2>
            <p className="mt-2 text-muted">Top 1% is 92 overall with zero critical CWV fails.</p>
          </header>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <ScoreRing value={96} label="Core Web Vitals" />
            <ScoreRing value={91} label="SEO foundation" />
            <ScoreRing value={88} label="Authority" />
            <ScoreRing value={94} label="Brand unity" />
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-muted">
                <tr>
                  <th className="pb-3 font-medium">Signal</th>
                  <th className="pb-3 font-medium">Before</th>
                  <th className="pb-3 font-medium">After</th>
                  <th className="pb-3 font-medium">Delta</th>
                </tr>
              </thead>
              <tbody>
                {LAB_LIFTS.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className="py-3">{row.label}</td>
                    <td className="py-3 font-mono text-subtle">{row.before}</td>
                    <td className="py-3 font-mono">{row.after}</td>
                    <td className="py-3 font-mono text-ok">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              k: "Path A",
              t: "Analyze an existing site",
              d: "Four-layer scorecard, ranked defects, tokens, governed copilot.",
              to: "/audit" as const,
              c: "Free analysis",
            },
            {
              k: "Path B",
              t: "Build from scratch",
              d: "Industry brief to a brand-locked site with schema and compliance stubs.",
              to: "/build" as const,
              c: "Start a brief",
            },
            {
              k: "Path C",
              t: "Register the domain",
              d: "Reseller search across .com to .health. Privacy included. Attach to the build.",
              to: "/domains" as const,
              c: "Search domains",
            },
          ].map((card) => (
            <article
              key={card.k}
              className="lift rounded-2xl border border-border bg-surface p-7"
            >
              <p className="font-mono text-xs text-accent">{card.k}</p>
              <h2 className="mt-3 font-display text-2xl">{card.t}</h2>
              <p className="mt-2 text-sm text-muted">{card.d}</p>
              <Link to={card.to} className={cn(buttonVariants(), "mt-6 inline-flex")}>
                {card.c}
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border">
        <img
          src="/media/light-fins.jpg"
          alt="Abstract architectural light through vertical fins"
          width={1792}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <header className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl">Four layers. One output.</h2>
            <p className="mt-2 text-muted">Diagnosis is not the product. The change list is.</p>
          </header>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["01", "Technical", "CWV, crawl, schema, mobile parity, performance blockers."],
              ["02", "Authority", "Intent match, information gain, E-E-A-T, AI Overview structure."],
              ["03", "Brand", "Color, type, spacing, voice, and component cohesion to 9.5+."],
              ["04", "Ship", "Tokens, patches, schema, and disclosure packs ready to install."],
            ].map(([step, title, desc]) => (
              <article key={step} className="rounded-2xl border border-border bg-bg/80 p-6">
                <p className="font-mono text-xs text-accent">{step}</p>
                <h3 className="mt-3 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm text-muted">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <header className="mb-10 text-center">
            <h2 className="font-display text-3xl">Simple pricing. Clear jumps.</h2>
            <p className="mt-2 text-muted">Free forever. Upgrade only when cadence or rebuild power is required.</p>
            <p className="mt-2 text-sm text-subtle">
              <Link to="/nonprofit" className="underline hover:text-fg">
                Nonprofits can request 50–100% off, including $0
              </Link>
            </p>
          </header>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(PLANS).map((plan) => (
              <article
                key={plan.id}
                className={cn(
                  "lift flex flex-col rounded-2xl border p-6",
                  plan.popular ? "border-accent/40 bg-bg" : "border-border bg-bg",
                )}
              >
                {plan.popular ? (
                  <p className="mb-2 text-xs font-medium text-accent">Most chosen</p>
                ) : null}
                <p className="text-sm text-muted">{plan.name}</p>
                <p className="mt-1 font-display text-3xl">
                  {plan.priceMonthly === 0 ? "$0" : `$${plan.priceMonthly}`}
                  {plan.priceMonthly > 0 ? (
                    <span className="text-base font-sans font-normal text-subtle">/mo</span>
                  ) : null}
                </p>
                <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ok" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.id === "free" ? "/audit" : "/checkout"}
                  search={plan.id === "free" ? undefined : { plan: plan.id }}
                  className={cn(
                    buttonVariants({ variant: plan.popular ? "primary" : "secondary" }),
                    "mt-6 w-full",
                  )}
                >
                  {plan.id === "free" ? "Start free" : "Choose plan"}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <header className="mb-10 text-center">
          <h2 className="font-display text-3xl">One-time compliance packs</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            Brand-matched disclosures. HIPAA and regulated packs run under elevated governance.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {Object.values(ONE_TIME_PACKS).map((pack) => (
            <article
              key={pack.id}
              className={cn(
                "lift rounded-2xl border p-7",
                pack.id === "compliance_hipaa" ? "border-ok/35 bg-surface" : "border-border bg-surface",
              )}
            >
              <p className="text-sm text-muted">{pack.name}</p>
              <p className="mt-1 font-display text-2xl">${pack.price.toLocaleString()}</p>
              <p className="mt-3 text-sm text-muted">{pack.description}</p>
              <Link to={pack.href} className="mt-6 inline-flex text-sm font-medium text-fg hover:underline">
                View pack
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl">Questions before the first URL</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-surface px-5 py-4"
              >
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-20 text-center">
        <h2 className="font-display text-3xl">Run the score. Then ship it.</h2>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Free analysis in minutes. Or skip the URL and build the property from a blank brief.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/audit" className={cn(buttonVariants({ size: "lg" }), "inline-flex")}>
            Run free analysis
            <ArrowRight className="size-4" />
          </Link>
          <Link to="/build" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "inline-flex")}>
            Build from scratch
          </Link>
        </div>
      </section>

      <div className="sticky bottom-0 z-30 border-t border-border bg-bg/95 p-3 md:hidden">
        <Link to="/audit" className={cn(buttonVariants(), "w-full")}>
          Free analysis
        </Link>
      </div>
    </main>
  );
}
