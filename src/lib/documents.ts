import type { PackId } from "./pricing";

export type DocPreview = {
  id: string;
  title: string;
  kicker: string;
  body: string;
};

export const PACK_DOCS: Record<PackId, DocPreview[]> = {
  compliance_standard: [
    {
      id: "privacy",
      title: "Privacy Policy",
      kicker: "GDPR · CCPA",
      body: "We collect account data, usage telemetry, and the minimum information required to deliver the service. We do not sell personal information. You may request access, correction, or deletion. California residents have additional rights under the CCPA, including the right to opt out of sale or sharing.",
    },
    {
      id: "terms",
      title: "Terms of Service",
      kicker: "Limitation of liability",
      body: "The service is provided as-is. We cap liability at fees paid in the prior twelve months. You retain ownership of your content; you grant us a limited license to host and display it. These terms are templates until counsel signs the pack.",
    },
    {
      id: "a11y",
      title: "Accessibility Statement",
      kicker: "WCAG 2.2 AA",
      body: "We aim to conform to WCAG 2.2 Level AA. If you encounter a barrier, contact us and we will provide an equally effective alternative. This statement is reviewed whenever the primary templates change.",
    },
  ],
  compliance_regulated: [
    {
      id: "risk",
      title: "Regulatory risk warning",
      kicker: "Finance · insurance",
      body: "Nothing on this site is an offer, solicitation, or personalized financial, insurance, or legal advice. Past performance is not indicative of future results. Products may not be available in all jurisdictions.",
    },
    {
      id: "ads",
      title: "Testimonials & advertising",
      kicker: "FTC endorsement",
      body: "Testimonials reflect individual experience. They are not typical and are not a guarantee. Material connections between the advertiser and endorser are disclosed adjacent to the claim.",
    },
    {
      id: "dpa",
      title: "Data protection addendum",
      kicker: "Processor terms",
      body: "Where we process personal data on your behalf, we act as processor, follow documented instructions, and flow down the same restrictions to subprocessors. A current subprocessor list is available on request.",
    },
  ],
  compliance_hipaa: [
    {
      id: "npp",
      title: "Notice of Privacy Practices",
      kicker: "45 CFR 164.520",
      body: "This notice describes how medical information about you may be used and disclosed and how you can get access to this information. We may use and disclose PHI for treatment, payment, and health-care operations. Other uses require your written authorization. You may revoke an authorization in writing, except to the extent we have already relied on it.",
    },
    {
      id: "baa",
      title: "Business Associate Agreement (starter)",
      kicker: "45 CFR 164.504(e)",
      body: "The Business Associate will not use or disclose PHI other than as permitted by this Agreement or as required by law; will use appropriate safeguards; and will report breaches of unsecured PHI without unreasonable delay and no later than 60 days.",
    },
    {
      id: "cms",
      title: "Medicare / CMS marketing",
      kicker: "Medicare Advantage",
      body: "This is not a complete description of benefits. Call [plan] for more information. Benefits, premiums, and/or copayments/coinsurance may change on January 1 of each year. Limitations, copayments, and restrictions may apply.",
    },
  ],
};
