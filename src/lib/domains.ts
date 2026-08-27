export type TldId = string;

export type Tld = {
  id: TldId;
  label: string;
  price: number;
  renewal: number;
  note: string;
};

export const TLDS: Tld[] = [
  { id: "com", label: ".com", price: 12.99, renewal: 14.99, note: "Typical retail, not our quote" },
  { id: "net", label: ".net", price: 13.99, renewal: 15.99, note: "Typical retail, not our quote" },
  { id: "org", label: ".org", price: 12.99, renewal: 14.99, note: "Typical retail, not our quote" },
  { id: "io", label: ".io", price: 39.0, renewal: 42.0, note: "Typical retail, not our quote" },
  { id: "ai", label: ".ai", price: 79.0, renewal: 79.0, note: "Typical retail, not our quote" },
  { id: "co", label: ".co", price: 24.99, renewal: 28.99, note: "Typical retail, not our quote" },
  { id: "health", label: ".health", price: 69.0, renewal: 69.0, note: "Typical retail, not our quote" },
  { id: "care", label: ".care", price: 29.0, renewal: 32.0, note: "Typical retail, not our quote" },
  { id: "clinic", label: ".clinic", price: 34.0, renewal: 36.0, note: "Typical retail, not our quote" },
  { id: "agency", label: ".agency", price: 22.0, renewal: 24.0, note: "Typical retail, not our quote" },
  { id: "dev", label: ".dev", price: 14.0, renewal: 16.0, note: "Typical retail, not our quote" },
  { id: "app", label: ".app", price: 16.0, renewal: 18.0, note: "Typical retail, not our quote" },
  { id: "us", label: ".us", price: 9.99, renewal: 10.99, note: "Typical retail, not our quote" },
];

export type DomainCartItem = {
  fqdn: string;
  sld: string;
  tldId: string;
  price: number;
  years: number;
  privacy: boolean;
  attachSiteId?: string;
};

export type RegisteredDomain = {
  fqdn: string;
  registeredAt: string;
  expiresAt: string;
  privacy: boolean;
  nameservers: string[];
  attachSiteId?: string;
  orderId: string;
};

export function parseQuery(raw: string): { sld: string; tldHint?: string } {
  const cleaned = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const host = cleaned.replace(/^www\./, "");
  const parts = host.split(".");
  if (parts.length >= 2) {
    const tld = parts.pop() as string;
    const sld = parts.join("-").replace(/[^a-z0-9-]/g, "");
    return { sld, tldHint: tld };
  }
  return { sld: host.replace(/[^a-z0-9-]/g, "") };
}

export function tldById(id: string): Tld | undefined {
  return TLDS.find((t) => t.id === id);
}

export const DOMAIN_ADDONS = [
  { id: "privacy", name: "WHOIS privacy", price: 0, detail: "Not offered. We are not a registrar." },
  { id: "dns", name: "DNS + SSL", price: 0, detail: "Not offered. We are not a registrar." },
  { id: "forward", name: "Email forwarding", price: 0, detail: "Not offered. We are not a registrar." },
] as const;

export const ICANN_NOTICE =
  "rankER is not a registrar. Domain search is an RDAP lookup only. We do not collect registrant data or complete ICANN registrations.";
