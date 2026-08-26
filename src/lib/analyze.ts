import { DEFECT_POOL, runAudit, type AuditResult, type Defect } from "./audit";
import { labFromScore } from "./cwv";

const MAX_BYTES = 800_000;
const FETCH_MS = 8000;

export class AnalyzeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyzeError";
  }
}

function normalizeUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 500) throw new AnalyzeError("Enter a website address.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProto);
  } catch {
    throw new AnalyzeError("That URL is not valid.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AnalyzeError("Only http and https URLs are allowed.");
  }
  if (isBlockedHost(url.hostname)) {
    throw new AnalyzeError("That host cannot be fetched.");
  }
  return url;
}

function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    h === "localhost" ||
    h === "0.0.0.0" ||
    h === "::1" ||
    h.endsWith(".localhost") ||
    h.endsWith(".local") ||
    h.endsWith(".internal")
  ) {
    return true;
  }
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(h);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }
  if (h.includes(":")) return true;
  return false;
}

function attr(html: string, re: RegExp): string | null {
  const m = re.exec(html);
  return m?.[1]?.replace(/\s+/g, " ").trim() || null;
}

function count(html: string, re: RegExp): number {
  const copy = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
  return (html.match(copy) ?? []).length;
}

function byId(id: string): Defect {
  const d = DEFECT_POOL.find((x) => x.id === id);
  if (!d) throw new Error(`missing defect ${id}`);
  return { ...d };
}

export async function analyzeUrl(raw: string): Promise<AuditResult> {
  const start = normalizeUrl(raw);
  try {
    const res = await fetch(start.href, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_MS),
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "rankERBot/1.0 (+https://ranker.theartificialbridge.com)",
      },
    });
    const finalUrl = new URL(res.url);
    if (isBlockedHost(finalUrl.hostname)) {
      throw new AnalyzeError("Redirect landed on a blocked host.");
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    const bytes = buf.byteLength;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(buf.slice(0, MAX_BYTES));
    return scoreLive(finalUrl, html, res.status, Math.min(bytes, MAX_BYTES));
  } catch (err) {
    if (err instanceof AnalyzeError) throw err;
    const fallback = runAudit(start.href);
    return { ...fallback, source: "heuristic" };
  }
}

function scoreLive(url: URL, html: string, status: number, bytes: number): AuditResult {
  const host = url.hostname.replace(/^www\./, "");
  const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = attr(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
  ) ?? attr(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const jsonLd = count(html, /application\/ld\+json/gi);
  const h1 = count(html, /<h1\b/gi);
  const images = count(html, /<img\b/gi);
  const imagesMissingAlt = count(html, /<img\b(?![^>]*\balt=)[^>]*>/gi);
  const hasOg = /property=["']og:/i.test(html);
  const hasLang = /<html[^>]+lang=/i.test(html);
  const fetchPriority = /fetchpriority=["']high["']/i.test(html);
  const imgWithSize = count(html, /<img\b[^>]*(width=|height=|aspect-ratio)/gi);
  const scripts = count(html, /<script\b/gi);
  const hexColors = count(html, /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi);
  const https = url.protocol === "https:";
  const author = /rel=["']author["']|itemprop=["']author["']|author-name/i.test(html);

  const defects: Defect[] = [];
  const push = (id: string, evidence: string) => {
    if (defects.some((d) => d.id === id)) return;
    defects.push({ ...byId(id), evidence });
  };

  if (!fetchPriority || imgWithSize < Math.max(1, Math.floor(images * 0.4))) {
    push("D-LCP-01", `Images: ${images}. With dimensions: ${imgWithSize}. fetchpriority=high: ${fetchPriority ? "yes" : "no"}.`);
  }
  if (scripts > 18 || bytes > 350_000) {
    push("D-INP-02", `${scripts} script tags, ${(bytes / 1024).toFixed(0)} KB HTML.`);
  }
  if (imagesMissingAlt > 0 || imgWithSize < images) {
    push("D-CLS-03", `${imagesMissingAlt} images missing alt; ${images - imgWithSize} missing width/height.`);
  }
  if (jsonLd === 0) {
    push("D-SCHEMA-04", "No application/ld+json graph on the document.");
  }
  if (!title || h1 !== 1) {
    push("D-H1-05", `Title “${title ?? "missing"}”. H1 count: ${h1}.`);
  }
  if (!author) {
    push("D-EEAT-06", "No author/rel=author or itemprop=author on the page.");
  }
  if (!/faq|question/i.test(html) && jsonLd === 0) {
    push("D-FAQ-07", "No FAQ copy or FAQPage schema detected.");
  }
  if (hexColors > 8) {
    push("D-TOKEN-08", `${hexColors} hard-coded hex values in the HTML.`);
  }
  if (!hasLang || !viewport) {
    push("D-A11Y-12", `html[lang]: ${hasLang ? "yes" : "no"}. viewport: ${viewport ? "yes" : "no"}.`);
  }

  if (defects.length === 0) {
    push("D-VOICE-10", "Live fetch found no critical defects; brand voice still needs a human pass.");
  }

  let cwv = 86;
  if (!fetchPriority) cwv -= 10;
  if (bytes > 250_000) cwv -= 8;
  if (scripts > 18) cwv -= 8;
  if (imagesMissingAlt > 2) cwv -= 6;
  let seo = 88;
  if (!title) seo -= 16;
  else if (title.length > 65 || title.length < 12) seo -= 6;
  if (!description) seo -= 12;
  if (h1 !== 1) seo -= 8;
  if (!canonical) seo -= 6;
  if (jsonLd === 0) seo -= 8;
  if (!hasOg) seo -= 4;
  if (status >= 400) seo -= 20;
  let authority = 78;
  if (!https) authority -= 18;
  if (!author) authority -= 10;
  if (jsonLd === 0) authority -= 6;
  let brand = 80;
  if (hexColors > 8) brand -= 14;
  if (!hasLang) brand -= 6;

  cwv = Math.max(32, Math.min(96, cwv));
  seo = Math.max(32, Math.min(96, seo));
  authority = Math.max(32, Math.min(96, authority));
  brand = Math.max(32, Math.min(96, brand));
  const overall = Math.round(cwv * 0.4 + seo * 0.3 + authority * 0.2 + brand * 0.1);

  const seed = host.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const hue = seed % 360;

  return {
    id: `aud_${Date.now().toString(36)}_${Math.abs(seed).toString(16).slice(0, 6)}`,
    url: url.href,
    host,
    createdAt: new Date().toISOString(),
    scorecard: { overall, cwv, seo, authority, brand },
    defects,
    tokens: {
      "--color-primary": `oklch(0.45 0.12 ${hue})`,
      "--color-accent": `oklch(0.62 0.14 ${(hue + 40) % 360})`,
      "--color-fg": "oklch(0.97 0.01 90)",
      "--font-sans": '"Figtree", system-ui, sans-serif',
      "--space-4": "1rem",
      "--radius-md": "0.5rem",
    },
    patches: defects.slice(0, 5).map((d) => d.fix),
    lab: labFromScore(seed, cwv),
    source: "live",
    httpStatus: status,
  };
}
