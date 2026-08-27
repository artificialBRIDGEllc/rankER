# rankER

Live HTML analysis, downloadable disclosure templates, in-app site previews, and RDAP lookup.

**Live home:** [ranker.theartificialbridge.com](https://ranker.theartificialbridge.com)  
**Company:** [artificialBRIDGE](https://www.theartificialbridge.com)

## What is true today

- Free analysis: fetch the public homepage plus up to two same-host links. TTFB is measured. LCP, INP, and CLS are not.
- Scores are an internal 0–100 HTML model, not a Google ranking, CrUX, or Chrome lab.
- Paid plans (when Stripe is configured) save history and unlock Markdown template downloads. Re-run is on demand, not a weekly job.
- One-time packs are templates, not legal advice, not HIPAA certification, not a signed NPP or BAA.
- Counsel Desk stores a review request. rankER does not employ counsel and does not issue a signed letter.
- Domain search is public RDAP. We are not a registrar.
- Build from scratch is an in-app preview. We do not host the public domain.

## Stack

TanStack Start, React 19, Tailwind v4, Vite, Zustand, Neon. Stripe Checkout when a live secret is present; otherwise the order is stored without a charge.

## Repo

`artificialBRIDGEllc/rankER` — private. Production host is the `ranker` subdomain of `theartificialbridge.com`.
