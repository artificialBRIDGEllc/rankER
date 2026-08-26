import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditResult } from "./audit";
import type { AnalyticsEvent } from "./analytics";
import type { CounselEngagement, CounselStatus } from "./counsel";
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
  addToDomainCart: (item: DomainCartItem) => void;
  removeFromDomainCart: (fqdn: string) => void;
  clearDomainCart: () => void;
  setCartSite: (fqdn: string, siteId?: string) => void;
  registerCart: (orderId: string) => RegisteredDomain[];
  attachDomain: (fqdn: string, siteId?: string) => void;
  addNonprofitRequest: (req: Omit<NonprofitRequest, "id" | "createdAt">) => NonprofitRequest;
  addCounselEngagement: (
    req: Omit<CounselEngagement, "id" | "createdAt" | "status" | "reviewer">,
  ) => CounselEngagement;
  advanceCounsel: (id: string) => CounselEngagement | undefined;
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
      getSite: (id) => get().sites.find((x) => x.id === id),
      addPurchase: (purchase) => {
        const record: Purchase = {
          ...purchase,
          id: `po_${Date.now().toString(36)}`,
          at: new Date().toISOString(),
        };
        set((s) => ({ purchases: [record, ...s.purchases] }));
        return record;
      },
      addToDomainCart: (item) =>
        set((s) => ({
          domainCart: [item, ...s.domainCart.filter((d) => d.fqdn !== item.fqdn)].slice(0, 12),
        })),
      removeFromDomainCart: (fqdn) =>
        set((s) => ({ domainCart: s.domainCart.filter((d) => d.fqdn !== fqdn) })),
      clearDomainCart: () => set({ domainCart: [] }),
      setCartSite: (fqdn, siteId) =>
        set((s) => ({
          domainCart: s.domainCart.map((d) => (d.fqdn === fqdn ? { ...d, attachSiteId: siteId } : d)),
        })),
      registerCart: (orderId) => {
        const now = new Date();
        const created: RegisteredDomain[] = get().domainCart.map((item) => {
          const exp = new Date(now);
          exp.setFullYear(exp.getFullYear() + item.years);
          return {
            fqdn: item.fqdn,
            registeredAt: now.toISOString(),
            expiresAt: exp.toISOString(),
            privacy: item.privacy,
            nameservers: ["ns1.theartificialbridge.com", "ns2.theartificialbridge.com"],
            attachSiteId: item.attachSiteId,
            orderId,
          };
        });
        set((s) => ({
          domains: [...created, ...s.domains.filter((d) => !created.some((c) => c.fqdn === d.fqdn))],
          domainCart: [],
        }));
        return created;
      },
      attachDomain: (fqdn, siteId) =>
        set((s) => ({
          domains: s.domains.map((d) => (d.fqdn === fqdn ? { ...d, attachSiteId: siteId } : d)),
        })),
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
          reviewer: "Counsel Desk · licensed healthcare/privacy reviewer",
        };
        set((s) => ({
          counselEngagements: [record, ...s.counselEngagements].slice(0, 20),
        }));
        return record;
      },
      advanceCounsel: (id) => {
        const order: CounselStatus[] = ["submitted", "conflicts", "review", "signed"];
        let next: CounselEngagement | undefined;
        set((s) => ({
          counselEngagements: s.counselEngagements.map((e) => {
            if (e.id !== id) return e;
            const i = order.indexOf(e.status);
            next = { ...e, status: order[Math.min(order.length - 1, i + 1)] as CounselStatus };
            return next;
          }),
        }));
        return next;
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
