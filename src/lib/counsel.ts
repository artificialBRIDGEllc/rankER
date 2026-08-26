import type { PackId } from "./pricing";
import { ONE_TIME_PACKS } from "./pricing";

export type CounselSku = "signoff_standard" | "signoff_regulated" | "signoff_hipaa" | "retainer";
export type CounselStatus = "submitted" | "conflicts" | "review" | "signed";

export const COUNSEL_PRODUCTS = {
  signoff_standard: {
    id: "signoff_standard" as const,
    pack: "compliance_standard" as PackId,
    name: "Counsel sign-off · Standard",
    price: 495,
    days: "3–5 business days",
    description: "Licensed reviewer signs the Standard pack. Limited engagement for website disclosures only.",
  },
  signoff_regulated: {
    id: "signoff_regulated" as const,
    pack: "compliance_regulated" as PackId,
    name: "Counsel sign-off · Regulated",
    price: 1200,
    days: "5–8 business days",
    description: "Finance, insurance, and professional-services language, signed.",
  },
  signoff_hipaa: {
    id: "signoff_hipaa" as const,
    pack: "compliance_hipaa" as PackId,
    name: "Counsel sign-off · HIPAA",
    price: 2400,
    days: "7–12 business days",
    description: "NPP, BAA starter, telehealth, and CMS marketing language, signed for the website.",
  },
  retainer: {
    id: "retainer" as const,
    pack: null,
    name: "Counsel retainer",
    price: 199,
    days: "Monthly",
    description: "Website-only review of copy and disclosure changes. For practices that cannot hire a GC yet.",
  },
} as const;

export function skuForPack(pack: PackId): Exclude<CounselSku, "retainer"> {
  if (pack === "compliance_hipaa") return "signoff_hipaa";
  if (pack === "compliance_regulated") return "signoff_regulated";
  return "signoff_standard";
}

export function bundleTotal(pack: PackId): number {
  return ONE_TIME_PACKS[pack].price + COUNSEL_PRODUCTS[skuForPack(pack)].price;
}

export type CounselEngagement = {
  id: string;
  createdAt: string;
  orgName: string;
  email: string;
  jurisdiction: string;
  sku: CounselSku;
  entityType: string;
  notes: string;
  status: CounselStatus;
  reviewer: string;
};

export const COUNSEL_STEPS: Record<CounselStatus, string> = {
  submitted: "Engagement received",
  conflicts: "Conflicts cleared",
  review: "Counsel reviewing drafts",
  signed: "Signed opinion letter issued",
};

export const ENGAGEMENT_LIMITS = [
  "Covers the website disclosure pack as of the signature date, in the stated jurisdiction.",
  "Does not create an attorney-client relationship for clinical operations, employment, or payer contracts.",
  "Does not replace a general counsel, malpractice coverage, or ongoing HIPAA program.",
  "You may still need local counsel if you practice in multiple states.",
] as const;
