export type Horizon = "now" | "next" | "later";

export const ROADMAP: Array<{
  id: string;
  horizon: Horizon;
  title: string;
  detail: string;
}> = [
  {
    id: "from-scratch",
    horizon: "now",
    title: "Build from scratch",
    detail:
      "Shipped. Industry brief → brand tokens, IA, copy, schema, and a live preview without an existing URL.",
  },
  {
    id: "nonprofit",
    horizon: "now",
    title: "Nonprofit scholarship rates",
    detail:
      "Shipped. 501(c)(3) request flow for 50–100% off, including $0 for qualifying small and underserved organizations.",
  },
  {
    id: "domains",
    horizon: "now",
    title: "Domain reseller storefront",
    detail:
      "Shipped as a preview. Search, cart, ICANN notice, attach to a generated site. Production: OpenSRS or Namecheap Reseller after Stripe.",
  },
  {
    id: "playwright-cwv",
    horizon: "now",
    title: "Lab Core Web Vitals capture",
    detail:
      "Shipped. Every audit now includes mobile lab LCP, INP, and CLS against 2026 thresholds, comparable week over week.",
  },
  {
    id: "doc-previews",
    horizon: "now",
    title: "Compliance document previews",
    detail:
      "Shipped. Brand-structured NPP, privacy, BAA, and CMS excerpts on every pack page before purchase.",
  },
  {
    id: "analytics",
    horizon: "now",
    title: "Conversion analytics",
    detail:
      "Shipped as a local funnel on /insights. Production maps the same event names to a warehouse.",
  },
  {
    id: "temporal",
    horizon: "next",
    title: "Durable scheduled audits",
    detail:
      "Weekly and daily monitoring that survives restarts. Drift alerts when CWV or brand tokens regress.",
  },
  {
    id: "figma-tokens",
    horizon: "next",
    title: "Figma + Tailwind token export",
    detail:
      "One brand system written to CSS variables, Tailwind config, and Figma tokens from a single audit.",
  },
  {
    id: "jurisdiction",
    horizon: "next",
    title: "Jurisdiction-specific policy variants",
    detail:
      "California, EU, Texas, and other state overlays as pack add-ons without rewriting the core suite.",
  },
  {
    id: "attorney-review",
    horizon: "now",
    title: "Counsel Desk — signed deliverables",
    detail:
      "Shipped. Limited engagement with licensed reviewers so organizations without a legal team can publish signed website disclosures instead of a homework disclaimer.",
  },
  {
    id: "policy-updates",
    horizon: "later",
    title: "Regulation-change update service",
    detail:
      "Subscription that regenerates packs when CMS, OCR, or state rules move — with a versioned change log.",
  },
  {
    id: "white-label",
    horizon: "later",
    title: "Agency white-label + public API",
    detail:
      "Partners generate packs and audits under their own brand. Rebuild & Command unlocks the API.",
  },
  {
    id: "vertical-schema",
    horizon: "later",
    title: "Vertical schema packs",
    detail:
      "Medicare, SaaS, and local-service JSON-LD kits that plug into the same implementation protocol.",
  },
];
