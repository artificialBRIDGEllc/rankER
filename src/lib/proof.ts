export const LAB_NOTE =
  "Scores come from HTML we fetch (homepage plus up to two same-host links) and TTFB on that request. They are not Google rankings, CrUX, or Chrome lab LCP/INP/CLS.";

export const FAQ = [
  {
    q: "Does the free analysis change my live site?",
    a: "No. We fetch public HTML. We do not write to your server, DNS, or CMS. The copilot cannot apply patches.",
  },
  {
    q: "What do you actually fetch?",
    a: "The URL you enter, then up to two internal links on the same host. Private networks are blocked. If the host refuses, we say the fetch failed — we do not invent a lab.",
  },
  {
    q: "Is this a Core Web Vitals lab?",
    a: "No. TTFB is measured on our fetch. LCP, INP, and CLS are not measured. The CWV score is an HTML-risk model against Google’s published thresholds, labeled as such.",
  },
  {
    q: "Do you register domains?",
    a: "No. Domain search is an RDAP lookup. We do not sell registrations, privacy, DNS, SSL, or email forwarding.",
  },
  {
    q: "Are the HIPAA documents legal advice?",
    a: "No. They are downloadable templates. rankER does not employ counsel and does not issue a signed opinion letter.",
  },
  {
    q: "Can I start with no website?",
    a: "Yes. Build from scratch generates a preview in this app. It is not hosted on a public domain until you deploy it yourself.",
  },
] as const;
