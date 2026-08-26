export type AnalyticsEvent = {
  id: string;
  name: string;
  path: string;
  at: string;
  meta?: string;
};

export const FUNNEL = [
  { id: "view_home", label: "Home" },
  { id: "cta_audit", label: "Start analysis" },
  { id: "audit_complete", label: "Scorecard" },
  { id: "view_hipaa", label: "HIPAA pack" },
  { id: "view_counsel", label: "Counsel desk" },
  { id: "checkout_complete", label: "Checkout" },
] as const;
