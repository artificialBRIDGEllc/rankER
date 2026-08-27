import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditResult } from "./audit";
import type { AnalyticsEvent } from "./analytics";
import type { CounselEngagement } from "./counsel";
import type { DomainCartItem, RegisteredDomain } from "./domains";
import type { NonprofitRequest } from "./nonprofit";
import type { GeneratedSite } from "./site-builder";

export type Purchase = {
  id: string;
  kind: "plan" | "pack" | "domain" | "counsel";
  sku: string;
  label: string;
  amount: number;
  at: string;
};

type AppState = {
  audits: AuditResult[];
  purchases: Purchase[];
  sites: GeneratedSite[];
  domainCart: DomainCartItem[];
  domains: RegisteredDomain[];
  nonprofitRequests: NonprofitRequest[];
  counselEngagements: CounselEngagement[];
  analyticsEvents: AnalyticsEvent[];
  saveAudit: (audit: AuditResult) => void;
  getAudit: (id: string) => AuditResult | undefined;
  saveSite: (site: GeneratedSite) => void;
  getSite: (id: string) => GeneratedSite | undefined;
  addPurchase: (purchase: Omit<Purchase, "id" | "at">) => Purchase;
  addNonprofitRequest: (req: Omit<NonprofitRequest, "id" | "createdAt">) => NonprofitRequest;
  addCounselEngagement: (
    req: Omit<CounselEngagement, "id" | "createdAt" | "status" | "reviewer">,
  ) => CounselEngagement;
  track: (name: string, path: string, meta?: string) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      audits: [],
      purchases: [],
      sites: [],
      domainCart: [],
      domains: [],
      nonprofitRequests: [],
      counselEngagements: [],
      analyticsEvents: [],
      saveAudit: (audit) =>
        set((s) => ({
          audits: [audit, ...s.audits.filter((a) => a.id !== audit.id)].slice(0, 20),
        })),
      getAudit: (id) => get().audits.find((a) => a.id === id),
      saveSite: (site) =>
        set((s) => ({
          sites: [site, ...s.sites.filter((x) => x.id !== site.id)].slice(0, 20),
        })),
      getSite: (id) => get().sites.find((s) => s.id === id),
      addPurchase: (purchase) => {
        const record: Purchase = {
          ...purchase,
          id: `po_${Date.now().toString(36)}`,
          at: new Date().toISOString(),
        };
        set((s) => ({ purchases: [record, ...s.purchases] }));
        return record;
      },
      addNonprofitRequest: (req) => {
        const record: NonprofitRequest = {
          ...req,
          id: `np_${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ nonprofitRequests: [record, ...s.nonprofitRequests].slice(0, 20) }));
        return record;
      },
      addCounselEngagement: (req) => {
        const record: CounselEngagement = {
          ...req,
          id: `cd_${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
          status: "submitted",
          reviewer: "Unassigned — request stored, no reviewer attached",
        };
        set((s) => ({
          counselEngagements: [record, ...s.counselEngagements].slice(0, 20),
        }));
        return record;
      },
      track: (name, path, meta) =>
        set((s) => ({
          analyticsEvents: [
            {
              id: `ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`,
              name,
              path,
              at: new Date().toISOString(),
              meta,
            },
            ...(s.analyticsEvents ?? []),
          ].slice(0, 200),
        })),
    }),
    { name: "ranker-store" },
  ),
);
