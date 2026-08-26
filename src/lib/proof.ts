export const LAB_LIFTS = [
  { id: "ctr", label: "Title CTR", before: "1.8%", after: "4.6%", delta: "+156%" },
  { id: "lcp", label: "Mobile LCP", before: "4.2s", after: "1.7s", delta: "−60%" },
  { id: "cvr", label: "Form conversion", before: "1.1%", after: "3.4%", delta: "+209%" },
  { id: "brand", label: "Brand unity", before: "54", after: "91", delta: "+37" },
] as const;

export const LAB_NOTE =
  "Composite of rankER lab rebuilds on healthcare and professional templates. Not a guarantee of ranking or revenue.";

export const FAQ = [
  {
    q: "Does the free analysis change my live site?",
    a: "No. The free pass scores homepage plus two pages and returns a ranked defect list. Writes require an explicit copilot approval.",
  },
  {
    q: "How is this different from a generic SEO scan?",
    a: "Four layers: Core Web Vitals, authority, brand unity, and shippable patches. The output is tokens, schema, and copy — not a PDF of warnings.",
  },
  {
    q: "Can I start with no website?",
    a: "Yes. Build from scratch, register the domain through rankER, then attach HIPAA or regulated disclosures before launch.",
  },
  {
    q: "Are the HIPAA documents legal advice?",
    a: "No. They are structured templates for attorney review. Covered-entity use still requires qualified counsel.",
  },
] as const;
