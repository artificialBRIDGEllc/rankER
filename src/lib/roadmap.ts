export type Horizon = "now" | "next" | "later";

export const ROADMAP: Array<{
  id: string;
  horizon: Horizon;
  title: string;
  detail: string;
}> = [
  {
    id: "live-fetch",
    horizon: "now",
    title: "Live HTML analysis",
    detail:
      "Shipped. Fetch the URL plus up to two same-host links. TTFB measured. Defects cite the HTML. Not Chrome lab.",
  },
  {
    id: "from-scratch",
    horizon: "now",
    title: "Build from scratch",
    detail: "Shipped as an in-app preview. You deploy it. We do not host the public domain.",
  },
  {
    id: "templates",
    horizon: "now",
    title: "Disclosure templates",
    detail: "Shipped as Markdown downloads. Templates, not signed legal instruments.",
  },
  {
    id: "rdap",
    horizon: "now",
    title: "Domain RDAP lookup",
    detail: "Shipped. Public RDAP only. Not a registrar.",
  },
  {
    id: "requests",
    horizon: "now",
    title: "Counsel and nonprofit request forms",
    detail: "Shipped as stored requests. No in-house counsel. No five-day SLA we can keep.",
  },
  {
    id: "playwright-cwv",
    horizon: "next",
    title: "Real lab Core Web Vitals",
    detail: "Not shipped. LCP/INP/CLS are not measured today.",
  },
  {
    id: "registrar",
    horizon: "later",
    title: "Actual domain registration",
    detail: "Not shipped. Requires a contracted registrar after Stripe.",
  },
  {
    id: "temporal",
    horizon: "later",
    title: "Scheduled re-audits",
    detail: "Not shipped. Re-run is on demand.",
  },
  {
    id: "attorney-review",
    horizon: "later",
    title: "Signed counsel letters",
    detail: "Not shipped. Would require licensed reviewers under a real engagement.",
  },
];
