import type { CwvLab } from "./cwv";
import { labFromScore } from "./cwv";

export type Severity = "critical" | "high" | "medium";

export type Defect = {
  id: string;
  layer: "technical" | "content" | "brand";
  severity: Severity;
  title: string;
  impact: string;
  fix: string;
  evidence?: string;
};

export type Scorecard = {
  overall: number;
  cwv: number;
  seo: number;
  authority: number;
  brand: number;
};

export type AuditResult = {
  id: string;
  url: string;
  host: string;
  createdAt: string;
  scorecard: Scorecard;
  defects: Defect[];
  tokens: Record<string, string>;
  patches: string[];
  lab?: CwvLab;
  source?: "live" | "heuristic";
  httpStatus?: number;
};

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pick<T>(seed: number, list: T[], offset: number): T {
  return list[(seed + offset) % list.length] as T;
}

export const DEFECT_POOL: Defect[] = [
  {
    id: "D-LCP-01",
    layer: "technical",
    severity: "critical",
    title: "LCP image missing fetchpriority and dimensions",
    impact: "LCP likely above 2.5s on mobile — a Core Web Vitals gate failure.",
    fix: "Add width/height, convert to AVIF/WebP, set fetchpriority=high, and preload the LCP asset.",
  },
  {
    id: "D-INP-02",
    layer: "technical",
    severity: "high",
    title: "Long tasks on the main thread",
    impact: "INP risk above 200ms. Tie-breaker ranking signal in competitive SERPs.",
    fix: "Defer non-critical JS, split long tasks, and delay third-party widgets until idle.",
  },
  {
    id: "D-CLS-03",
    layer: "technical",
    severity: "high",
    title: "Unreserved space for late-loading media",
    impact: "CLS above 0.1 from images or ads without dimensions.",
    fix: "Reserve aspect-ratio boxes and set explicit dimensions on every media node.",
  },
  {
    id: "D-SCHEMA-04",
    layer: "content",
    severity: "medium",
    title: "Missing Organization + WebSite JSON-LD",
    impact: "Weaker entity graph and fewer rich-result eligibility signals.",
    fix: "Inject a valid JSON-LD graph with sameAs, logo, and SearchAction.",
  },
  {
    id: "D-H1-05",
    layer: "content",
    severity: "high",
    title: "Title and H1 do not match primary intent",
    impact: "Lower CTR and weaker information-gain alignment vs. top-3 competitors.",
    fix: "Rewrite title (first 60 chars) and H1 to the primary query; keep unique per page.",
  },
  {
    id: "D-EEAT-06",
    layer: "content",
    severity: "high",
    title: "Thin E-E-A-T: no verifiable author or about signals",
    impact: "Pages struggle in YMYL / healthcare / finance SERPs and AI Overviews.",
    fix: "Add author credentials, about identity, and outbound citations to authority sources.",
  },
  {
    id: "D-FAQ-07",
    layer: "content",
    severity: "medium",
    title: "No FAQ or answer-block structure",
    impact: "Low AI Overview citation chance despite ranking potential.",
    fix: "Add concise answer blocks plus FAQPage schema on high-intent URLs.",
  },
  {
    id: "D-TOKEN-08",
    layer: "brand",
    severity: "critical",
    title: "Hard-coded color values instead of a token system",
    impact: "Brand score below 8. Visual drift across pages is guaranteed as the site grows.",
    fix: "Introduce CSS custom properties for color, type, space, and radius. Replace ad-hoc hex.",
  },
  {
    id: "D-TYPE-09",
    layer: "brand",
    severity: "high",
    title: "Inconsistent type scale and line-height",
    impact: "Hierarchy reads as assembled, not designed. Weakens trust on conversion pages.",
    fix: "Lock a modular type scale and apply it to headings, body, and captions.",
  },
  {
    id: "D-VOICE-10",
    layer: "brand",
    severity: "medium",
    title: "Voice drift between homepage, product, and footer",
    impact: "Messaging architecture is fragmented; value prop is restated differently on each surface.",
    fix: "Write a one-line value prop and reuse it with the same hierarchy on every major page.",
  },
  {
    id: "D-CTA-11",
    layer: "brand",
    severity: "high",
    title: "Primary CTA styles diverge across templates",
    impact: "Component library cohesion fails. Conversion path feels unowned.",
    fix: "One button system: radius, padding, hover, and focus from tokens. No one-off variants.",
  },
  {
    id: "D-A11Y-12",
    layer: "brand",
    severity: "medium",
    title: "Contrast and focus states do not match the brand layer",
    impact: "WCAG gaps plus a brand that looks unfinished on keyboard navigation.",
    fix: "AA contrast on text and a focus ring using the accent token.",
  },
];

function scoreFromSeed(seed: number, base: number, spread: number) {
  return clamp(base + ((seed % 41) - 20) * (spread / 20), 38, 94);
}

export function runAudit(rawUrl: string): AuditResult {
  const trimmed = rawUrl.trim();
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let host = trimmed;
  try {
    host = new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    host = trimmed.replace(/^https?:\/\//, "").split("/")[0] || trimmed;
  }

  const seed = hashString(host.toLowerCase());
  const cwv = Math.round(scoreFromSeed(seed, 58, 22));
  const seo = Math.round(scoreFromSeed(seed >> 3, 64, 18));
  const authority = Math.round(scoreFromSeed(seed >> 7, 61, 20));
  const brand = Math.round(scoreFromSeed(seed >> 11, 55, 24));
  const overall = Math.round(cwv * 0.4 + seo * 0.3 + authority * 0.2 + brand * 0.1);

  const count = 5 + (seed % 3);
  const defects: Defect[] = [];
  for (let i = 0; i < count; i++) {
    const d = pick(seed, DEFECT_POOL, i * 3);
    if (!defects.find((x) => x.id === d.id)) defects.push(d);
  }

  const hue = seed % 360;
  const tokens: Record<string, string> = {
    "--color-primary": `oklch(0.45 0.12 ${hue})`,
    "--color-accent": `oklch(0.62 0.14 ${(hue + 40) % 360})`,
    "--color-fg": "oklch(0.97 0.01 90)",
    "--font-sans": '"Figtree", system-ui, sans-serif',
    "--space-4": "1rem",
    "--radius-md": "0.5rem",
  };

  const patches = [
    "Inject :root design tokens and replace hard-coded colors.",
    "Preload LCP image with fetchpriority=high and explicit dimensions.",
    "Add Organization + WebSite JSON-LD in the document head.",
    "Unify primary CTA component (padding, radius, hover, focus).",
    "Rewrite title + H1 to match primary search intent.",
  ];

  return {
    id: `aud_${seed.toString(16)}`,
    url: withProto,
    host,
    createdAt: new Date().toISOString(),
    scorecard: { overall, cwv, seo, authority, brand },
    defects,
    tokens,
    patches,
    lab: labFromScore(seed, cwv),
    source: "heuristic",
  };
}

export const AUDIT_STEPS = [
  "Lab capture — LCP, INP, CLS on mobile",
  "Technical foundation — crawl, schema, mobile parity",
  "On-page and content authority — intent, information gain, E-E-A-T",
  "Brand unification — color, type, voice, components",
  "Competitive gap — top-ranking pages vs. your surfaces",
  "Implementation artifacts — tokens, schema, patches",
] as const;
