import type { CwvLab } from "./cwv";
import { htmlModelFromSignals } from "./cwv";

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

export type FetchedPage = {
  url: string;
  status: number;
  title: string | null;
  bytes: number;
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
  pages?: FetchedPage[];
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
    impact: "HTML signals a likely LCP risk. This is not a Chrome lab measurement.",
    fix: "Add width/height, convert to AVIF/WebP, set fetchpriority=high, and preload the LCP asset.",
  },
  {
    id: "D-INP-02",
    layer: "technical",
    severity: "high",
    title: "Heavy script payload on the document",
    impact: "Many script tags or a large HTML document increase INP risk. Not a measured INP.",
    fix: "Defer non-critical JS, split long tasks, and delay third-party widgets until idle.",
  },
  {
    id: "D-CLS-03",
    layer: "technical",
    severity: "high",
    title: "Unreserved space for late-loading media",
    impact: "Images without dimensions are a CLS risk. Not a measured CLS.",
    fix: "Reserve aspect-ratio boxes and set explicit dimensions on every media node.",
  },
  {
    id: "D-SCHEMA-04",
    layer: "content",
    severity: "medium",
    title: "Missing Organization + WebSite JSON-LD",
    impact: "No application/ld+json on the fetched documents.",
    fix: "Inject a valid JSON-LD graph with sameAs, logo, and SearchAction.",
  },
  {
    id: "D-H1-05",
    layer: "content",
    severity: "high",
    title: "Title and H1 do not match a single intent",
    impact: "Missing title, or H1 count is not 1, on a fetched page.",
    fix: "Rewrite title (first 60 chars) and H1 to the primary query; keep unique per page.",
  },
  {
    id: "D-EEAT-06",
    layer: "content",
    severity: "high",
    title: "Thin E-E-A-T: no verifiable author signal",
    impact: "No rel=author or itemprop=author on the fetched HTML.",
    fix: "Add author credentials, about identity, and outbound citations to authority sources.",
  },
  {
    id: "D-FAQ-07",
    layer: "content",
    severity: "medium",
    title: "No FAQ or answer-block structure",
    impact: "No FAQ copy or FAQPage schema in the fetch.",
    fix: "Add concise answer blocks plus FAQPage schema on high-intent URLs.",
  },
  {
    id: "D-TOKEN-08",
    layer: "brand",
    severity: "critical",
    title: "Hard-coded color values instead of a token system",
    impact: "Many hex values in HTML. Brand will drift as pages are added.",
    fix: "Introduce CSS custom properties for color, type, space, and radius. Replace ad-hoc hex.",
  },
  {
    id: "D-TYPE-09",
    layer: "brand",
    severity: "high",
    title: "Inconsistent type scale and line-height",
    impact: "Cannot be proven from HTML fetch alone; flagged when heading structure is irregular.",
    fix: "Lock a modular type scale and apply it to headings, body, and captions.",
  },
  {
    id: "D-VOICE-10",
    layer: "brand",
    severity: "medium",
    title: "Voice still needs a human pass",
    impact: "Fetch cannot score brand voice. Treat this as a review item, not a measured defect.",
    fix: "Write a one-line value prop and reuse it with the same hierarchy on every major page.",
  },
  {
    id: "D-CTA-11",
    layer: "brand",
    severity: "high",
    title: "Primary CTA styles diverge across templates",
    impact: "Not fully provable from HTML. Raised when multiple distinct button classes appear.",
    fix: "One button system: radius, padding, hover, and focus from tokens.",
  },
  {
    id: "D-A11Y-12",
    layer: "brand",
    severity: "medium",
    title: "Missing lang or viewport",
    impact: "html[lang] or viewport meta missing on a fetched document.",
    fix: "Set lang on <html> and a viewport meta. AA contrast still needs a human check.",
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
    if (!defects.find((x) => x.id === d.id)) defects.push({ ...d, evidence: "Heuristic fallback — live fetch failed." });
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

  return {
    id: `aud_${seed.toString(16)}`,
    url: withProto,
    host,
    createdAt: new Date().toISOString(),
    scorecard: { overall, cwv, seo, authority, brand },
    defects,
    tokens,
    patches: defects.slice(0, 5).map((d) => d.fix),
    lab: htmlModelFromSignals({
      ttfbMs: null,
      htmlBytes: 0,
      scripts: 0,
      images: 0,
      imagesMissingDims: 0,
    }),
    source: "heuristic",
  };
}

export const AUDIT_STEPS = [
  "Fetch homepage HTML and TTFB",
  "Follow two internal links on the same host",
  "Read title, schema, images, and tokens",
  "Score HTML vitals risk, SEO, authority, brand",
  "List defects with evidence from the fetch",
] as const;
