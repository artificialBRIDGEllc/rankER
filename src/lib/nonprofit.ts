import type { PlanId } from "./pricing";
import { PLANS } from "./pricing";

export type OrgStatus = "501c3" | "501c4" | "church" | "fiscal_sponsor" | "other";
export type BudgetBand = "under_100k" | "100_250k" | "250_1m" | "over_1m";
export type DiscountAsk = "50" | "80" | "100";

export type NonprofitRequest = {
  id: string;
  createdAt: string;
  orgName: string;
  ein: string;
  status: OrgStatus;
  website: string;
  budget: BudgetBand;
  plan: Exclude<PlanId, "free">;
  ask: DiscountAsk;
  contactName: string;
  email: string;
  mission: string;
  servesUnderserved: boolean;
  attested: boolean;
  typicalPercent: number;
  typicalMonthly: number;
};

export const ORG_STATUS: Record<OrgStatus, string> = {
  "501c3": "501(c)(3) public charity",
  "501c4": "501(c)(4) social welfare",
  church: "Church / religious organization",
  fiscal_sponsor: "Project under a fiscal sponsor",
  other: "Other nonprofit",
};

export const BUDGET_LABELS: Record<BudgetBand, string> = {
  under_100k: "Under $100,000",
  "100_250k": "$100,000 – $250,000",
  "250_1m": "$250,000 – $1 million",
  over_1m: "Over $1 million",
};

export function typicalPercent(budget: BudgetBand, underserved: boolean): number {
  const base =
    budget === "under_100k" ? 100 : budget === "100_250k" ? 80 : budget === "250_1m" ? 50 : 30;
  return underserved ? Math.min(100, base === 100 ? 100 : base + 20) : base;
}

export function quoteMonthly(plan: Exclude<PlanId, "free">, percent: number): number {
  return Math.round(PLANS[plan].priceMonthly * (1 - percent / 100) * 100) / 100;
}

export const NONPROFIT_CRITERIA = [
  {
    title: "Who qualifies",
    body: "U.S. 501(c)(3) charities, churches, and fiscally sponsored projects. Equivalent foreign charities considered with registration documents.",
  },
  {
    title: "What $0 covers",
    body: "If approved, discounts apply to Saved history or Templates + export for one property. $0 is not automatic.",
  },
  {
    title: "How we decide",
    body: "Budget, who you serve, and public benefit. A human reviews the stored request. No SLA we can keep until that desk exists.",
  },
] as const;
