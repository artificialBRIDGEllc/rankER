import { ONE_TIME_PACKS, type PackId } from "./pricing";

const BANNER = `> TEMPLATE. Not legal advice. Not a signed opinion. Not HIPAA certification.
> Replace [BRACKETS]. Have qualified counsel review before you publish.

`;

const STANDARD: Record<string, string> = {
  "privacy-policy.md": `${BANNER}# Privacy Policy

**Last updated:** [DATE]
**Controller:** [LEGAL NAME], [ADDRESS], [EMAIL]

## What we collect
Account data you give us, usage logs (IP, user agent, pages), and the minimum needed to run the site.

## What we do not do
We do not sell personal information. We do not use this template as a representation that we comply with every GDPR or CCPA obligation — those depend on your operations.

## Rights
You may request access, correction, or deletion at [EMAIL]. California residents may have additional rights under the CCPA, including the right to know and to opt out of sale or sharing if you actually sell or share data.

## Retention
[STATE HOW LONG YOU KEEP EACH CATEGORY].

## Contact
[EMAIL]
`,
  "terms.md": `${BANNER}# Terms of Service

The service is provided as-is. Liability is capped at fees you paid us in the prior twelve months, except where law forbids a cap.

You keep your content. You grant us a limited license to host and display it to operate the site.

These terms are a template until counsel adopts them for [LEGAL NAME].
`,
  "cookies.md": `${BANNER}# Cookie notice

We use strictly necessary cookies to run the site. Analytics or marketing cookies, if any, require [YOUR CONSENT MECHANISM]. This file is not a consent banner. You still need a banner if you set non-essential cookies.
`,
  "accessibility.md": `${BANNER}# Accessibility statement

We aim to conform to WCAG 2.2 Level AA. That is an aim, not a certified audit. If you hit a barrier, email [EMAIL] and we will provide an equally effective alternative where we can.

Last reviewed: [DATE].
`,
  "disclaimer.md": `${BANNER}# Disclaimer

Nothing on this site is professional advice for your situation. [LEGAL NAME] is not your lawyer, doctor, or broker because you read a page.
`,
  "dmca.md": `${BANNER}# DMCA / contact

Copyright agent: [NAME], [ADDRESS], [EMAIL], [PHONE].

To report infringement, include the URL, your contact, a statement of good faith, and a statement under penalty of perjury that you are authorized.
`,
};

const REGULATED: Record<string, string> = {
  "risk-warning.md": `${BANNER}# Regulatory risk warning

Nothing here is an offer, solicitation, or personalized financial, insurance, or legal advice. Past results are not future results. Products may not be available in every jurisdiction. [ADD YOUR LICENSE NUMBERS IF YOU HAVE THEM].
`,
  "advertising.md": `${BANNER}# Testimonials and advertising

Testimonials are individual experience. They are not typical and not a guarantee. Material connections are disclosed next to the claim. This template does not make you FTC-compliant; your ads still need review.
`,
  "engagement.md": `${BANNER}# Client engagement disclaimer

A website visit is not an engagement. We take you on as a client only after a signed agreement.
`,
  "dpa.md": `${BANNER}# Data protection addendum (starter)

Where we process personal data for you, we act as processor, follow documented instructions, and flow restrictions to subprocessors. Subprocessor list: [URL]. This is a starter, not a signed DPA.
`,
};

const HIPAA: Record<string, string> = {
  "npp.md": `${BANNER}# Notice of Privacy Practices (template)

This notice describes how medical information about you may be used and disclosed and how you can get access to it. **It is a template.** A covered entity must complete, post, and follow a real NPP under 45 CFR 164.520.

We may use and disclose PHI for treatment, payment, and health-care operations. Other uses need your written authorization. You may revoke an authorization in writing, except where we already relied on it.

**Your rights:** access, amend, accounting of disclosures, restrict certain uses, confidential communications, and a paper copy of this notice.

**Our duties:** maintain privacy of PHI, provide this notice, and notify you of a breach of unsecured PHI.

Complaints: [PRIVACY OFFICER EMAIL] or the U.S. Department of Health and Human Services.

Effective: [DATE].
`,
  "authorization.md": `${BANNER}# HIPAA authorization template

I authorize [COVERED ENTITY] to disclose PHI described below to [RECIPIENT] for [PURPOSE]. I may revoke this in writing. This authorization expires on [DATE / EVENT].

Signature / date / description of PHI: [FIELDS].
`,
  "baa.md": `${BANNER}# Business Associate Agreement (starter)

The Business Associate will not use or disclose PHI except as permitted here or required by law; will use appropriate safeguards; will report breaches of unsecured PHI without unreasonable delay and no later than 60 days.

This is a starter. It is not a negotiated BAA.
`,
  "phi.md": `${BANNER}# PHI handling disclosure (website)

Do not submit PHI through unsecured web forms. [DESCRIBE YOUR ACTUAL CHANNEL: patient portal / phone].
`,
  "breach.md": `${BANNER}# Breach notification policy (template)

If unsecured PHI is breached, we will investigate and notify affected individuals and regulators as required by the Breach Notification Rule. Timelines depend on the facts. This template is not your incident-response plan.
`,
  "patient-rights.md": `${BANNER}# Patient rights (website summary)

You may request access, amendment, and an accounting of disclosures. Contact [PRIVACY OFFICER]. This summary does not replace the NPP.
`,
  "telehealth.md": `${BANNER}# Telehealth notice

Telehealth has risks (privacy, technology failure, emergency limits). Use [EMERGENCY NUMBER] for emergencies. Licensing: we treat patients in [STATES].
`,
  "cms-medicare.md": `${BANNER}# Medicare / CMS marketing disclaimer (template)

This is not a complete description of benefits. Call [PLAN] for more information. Benefits, premiums, and/or copayments/coinsurance may change on January 1 of each year. Limitations, copayments, and restrictions may apply.

We do not offer every plan in the area. For a full list, contact 1-800-MEDICARE or visit Medicare.gov.
`,
  "security-summary.md": `${BANNER}# Security practices summary (website)

[DESCRIBE WHAT YOU ACTUALLY DO: encryption in transit, access control, vendors]. Do not claim SOC 2, HIPAA compliance, or encryption at rest unless that is true.
`,
  "changelog.md": `${BANNER}# Template changelog

- [DATE] — Initial download from rankER. No counsel signature.
`,
  "counsel-checklist.md": `${BANNER}# Counsel review checklist

- [ ] Legal name, address, and privacy officer
- [ ] NPP completed and posted
- [ ] BAA executed with each business associate
- [ ] Forms do not collect PHI in the open
- [ ] CMS marketing reviewed if you mention Medicare
- [ ] Counsel has signed *your* versions, not this file
`,
};

export function packFiles(pack: PackId): Record<string, string> {
  if (pack === "compliance_standard") return { ...STANDARD };
  if (pack === "compliance_regulated") return { ...STANDARD, ...REGULATED };
  return { ...STANDARD, ...REGULATED, ...HIPAA };
}

export function packMarkdown(pack: PackId): string {
  const files = packFiles(pack);
  const meta = ONE_TIME_PACKS[pack];
  const parts = [`# ${meta.name}\n\n${meta.description}\n`];
  for (const [name, body] of Object.entries(files)) {
    parts.push(`\n---\n\n## File: ${name}\n\n${body}`);
  }
  return parts.join("\n");
}

export function downloadPack(pack: PackId) {
  const blob = new Blob([packMarkdown(pack)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${pack}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCssTokens(tokens: Record<string, string>, host: string) {
  const body = `:root {\n${Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n")}\n}\n`;
  const blob = new Blob([`/* Suggested tokens from rankER analysis of ${host}. Not your brand system until you adopt them. */\n${body}`], {
    type: "text/css;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${host.replace(/[^a-z0-9.-]/gi, "_")}-tokens.css`;
  a.click();
  URL.revokeObjectURL(url);
}
