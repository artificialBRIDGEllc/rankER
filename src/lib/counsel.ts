import type { PackId } from "./pricing";
import { ONE_TIME_PACKS } from "./pricing";

export type CounselSku = "signoff_standard" | "signoff_regulated" | "signoff_hipaa" | "retainer";
export type CounselStatus = "submitted";

export const COUNSEL_PRODUCTS = {
  signoff_standard: {
    id: "signoff_standard" as const,
    pack: "compliance_standard" as PackId,
    name: "Review request · Standard",
    price: 495,
    days: "No SLA. Not for sale as a signed letter.",
    description:
      "Illustrative future fee. Today this form only stores a request. No reviewer is on staff.",
  },
  signoff_regulated: {
    id: "signoff_regulated" as const,
    pack: "compliance_regulated" as PackId,
    name: "Review request · Regulated",
    price: 1200,
    days: "No SLA. Not for sale as a signed letter.",
    description:
      "Illustrative future fee for regulated-language review. Not a signed filing. Not sold today.",
  },
  signoff_hipaa: {
    id: "signoff_hipaa" as const,
    pack: "compliance_hipaa" as PackId,
    name: "Review request · HIPAA",
    price: 2400,
    days: "No SLA. Not for sale as a signed NPP.",
    description:
      "Illustrative future fee for HIPAA-oriented template review. Not a signed NPP. Not sold today.",
  },
  retainer: {
    id: "retainer" as const,
    pack: null,
    name: "Website-copy request queue",
    price: 199,
    days: "Not a monthly retainer we fulfill.",
    description: "Illustrative future monthly queue. Not general counsel. Not sold today.",
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
  submitted: "Request stored. No reviewer assigned.",
};

export const ENGAGEMENT_LIMITS = [
  "This form stores a request on your account. It is not a signed opinion.",
  "rankER does not employ counsel and does not create an attorney-client relationship.",
  "Does not replace a general counsel, malpractice coverage, or an ongoing HIPAA program.",
  "You still need your own lawyer before you publish the templates.",
] as const;
