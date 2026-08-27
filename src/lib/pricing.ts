export type PlanId = "free" | "tier1" | "tier2" | "tier3";
export type PackId = "compliance_standard" | "compliance_hipaa" | "compliance_regulated";

export const ONE_TIME_PACKS = {
  compliance_standard: {
    id: "compliance_standard" as const,
    name: "Standard template pack",
    price: 297,
    href: "/compliance/standard",
    description: "Downloadable website templates: privacy, terms, cookies, accessibility, disclaimer. Not legal advice.",
    includes: [
      "Privacy Policy template (GDPR/CCPA-oriented language)",
      "Terms of Service template",
      "Cookie notice template",
      "Accessibility statement template (WCAG 2.2 AA aim)",
      "Disclaimer template",
      "Contact & DMCA notice template",
      "Markdown download of the full pack",
    ],
    regulated: false,
  },
  compliance_regulated: {
    id: "compliance_regulated" as const,
    name: "Regulated industries templates",
    price: 997,
    href: "/compliance/regulated",
    description: "Standard templates plus finance/insurance/professional-services language. Not a license or filing.",
    includes: [
      "Everything in the Standard pack",
      "Regulatory risk-warning template",
      "Testimonial / advertising template (FTC-oriented)",
      "Client engagement disclaimer template",
      "Data protection addendum template",
      "Markdown download of the full pack",
    ],
    regulated: true,
  },
  compliance_hipaa: {
    id: "compliance_hipaa" as const,
    name: "HIPAA-oriented templates",
    price: 1497,
    href: "/compliance/hipaa",
    description:
      "Templates modeled on NPP, BAA, PHI, telehealth, and CMS marketing language. Not HIPAA certification. Not a signed NPP.",
    includes: [
      "Everything in the Standard pack",
      "Notice of Privacy Practices template (45 CFR 164.520-oriented)",
      "HIPAA authorization template",
      "Business Associate Agreement starter template",
      "PHI handling disclosure template",
      "Breach notification policy template",
      "Patient rights template",
      "Telehealth notice template",
      "Medicare Advantage / CMS marketing disclaimer template",
      "Security practices summary template",
      "Version changelog stub",
      "Counsel-review checklist (you still need your own lawyer)",
      "Markdown download of the full pack",
    ],
    regulated: true,
  },
} as const;

export const PLANS = {
  free: {
    id: "free" as const,
    name: "Free analysis",
    priceMonthly: 0,
    description: "Live fetch of homepage + up to two internal pages. No account required.",
    features: [
      "HTML fetch of 1–3 public pages",
      "Four-layer scorecard from that HTML",
      "Ranked defects with fetch evidence",
      "Suggested CSS tokens",
      "Governed copilot that cannot write to your site",
    ],
    popular: false,
  },
  tier1: {
    id: "tier1" as const,
    name: "Saved history",
    priceMonthly: 49,
    description: "The free analysis, stored on your signed-in account so you can re-run it.",
    features: [
      "Everything in Free",
      "Audits saved to your account",
      "Re-run on demand (not a weekly job)",
      "Copilot on saved scorecards",
    ],
    popular: false,
  },
  tier2: {
    id: "tier2" as const,
    name: "Templates + export",
    priceMonthly: 149,
    description: "Saved history plus template downloads and a CSS token export.",
    features: [
      "Everything in Saved history",
      "Download standard template pack",
      "Export tokens as a CSS file",
      "Up to 3 saved generated sites",
    ],
    popular: true,
  },
  tier3: {
    id: "tier3" as const,
    name: "Portfolio",
    priceMonthly: 499,
    description: "Saved sites and audits on one account. No automated rebuild of your live domain.",
    features: [
      "Everything in Templates + export",
      "From-scratch generator (also on /build)",
      "HIPAA-oriented template download",
      "Saved portfolio of generated sites",
      "Review-request forms (counsel / nonprofit) stored on your account",
    ],
    popular: false,
  },
} as const;
