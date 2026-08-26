export type TldId = string;

export type Tld = {
  id: TldId;
  label: string;
  price: number;
  renewal: number;
  note: string;
};

export const TLDS: Tld[] = [
  { id: "com", label: ".com", price: 12.99, renewal: 14.99, note: "Default commercial" },
  { id: "net", label: ".net", price: 13.99, renewal: 15.99, note: "Networks and infra" },
  { id: "org", label: ".org", price: 12.99, renewal: 14.99, note: "Organizations" },
  { id: "io", label: ".io", price: 39.0, renewal: 42.0, note: "Product and software" },
  { id: "ai", label: ".ai", price: 79.0, renewal: 79.0, note: "AI products" },
  { id: "co", label: ".co", price: 24.99, renewal: 28.99, note: "Company short form" },
  { id: "health", label: ".health", price: 69.0, renewal: 69.0, note: "Healthcare brands" },
  { id: "care", label: ".care", price: 29.0, renewal: 32.0, note: "Clinics and caregiving" },
  { id: "clinic", label: ".clinic", price: 34.0, renewal: 36.0, note: "Practices" },
  { id: "agency", label: ".agency", price: 22.0, renewal: 24.0, note: "Agencies and FMOs" },
  { id: "dev", label: ".dev", price: 14.0, renewal: 16.0, note: "Developers" },
  { id: "app", label: ".app", price: 16.0, renewal: 18.0, note: "Applications" },
  { id: "us", label: ".us", price: 9.99, renewal: 10.99, note: "United States" },
];

export const TAKEN_LABELS = new Set([
  "google",
  "facebook",
  "amazon",
  "microsoft",
  "apple",
  "wellmed",
  "medicare",
  "unitedhealth",
  "humana",
  "aetna",
]);

export type DomainQuote = {
  fqdn: string;
  sld: string;
  tld: Tld;
  available: boolean;
  premium: boolean;
  price: number;
  years: number;
};

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

const TAKEN_RATE = 0.22;

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

export function quoteDomain(sld: string, tld: Tld, years = 1): DomainQuote {
  const label = sld.toLowerCase();
  const fqdn = `${label}.${tld.id}`;
  const takenKnown = TAKEN_LABELS.has(label);
  const takenHash = (hash(fqdn) % 100) / 100 < TAKEN_RATE;
  const premium = label.length <= 3 || (label.length <= 5 && !label.includes("-"));
  const available = !takenKnown && !takenHash;
  const price = available ? Number((tld.price * years * (premium ? 2.4 : 1)).toFixed(2)) : 0;
  return { fqdn, sld: label, tld, available, premium, price, years };
}

export function searchDomains(query: string, years = 1): DomainQuote[] {
  const { sld, tldHint } = parseQuery(query);
  if (sld.length < 2) return [];
  const ordered = [...TLDS].sort((a, b) => {
    if (a.id === tldHint) return -1;
    if (b.id === tldHint) return 1;
    return 0;
  });
  return ordered.map((tld) => quoteDomain(sld, tld, years));
}

export function tldById(id: string): Tld | undefined {
  return TLDS.find((t) => t.id === id);
}

export const DOMAIN_ADDONS = [
  { id: "privacy", name: "WHOIS privacy", price: 0, detail: "Included. Registrant data redacted." },
  { id: "dns", name: "DNS + SSL", price: 0, detail: "Included. rankER nameservers and certificates." },
  { id: "forward", name: "Email forwarding", price: 0, detail: "Included. Up to 10 aliases." },
] as const;

export const ICANN_NOTICE =
  "Domain registrations are subject to ICANN and registry policies. You must provide accurate registrant contact data. This preview does not complete a live registration; production uses a contracted registrar (OpenSRS / Namecheap Reseller) after Stripe payment.";
