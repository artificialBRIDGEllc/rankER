import { DEFECT_POOL, runAudit, type AuditResult, type Defect, type FetchedPage } from "./audit";
import { htmlModelFromSignals } from "./cwv";

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

type PageFetch = {
  url: URL;
  status: number;
  html: string;
  bytes: number;
  ttfbMs: number;
};

async function fetchPublic(url: URL): Promise<PageFetch> {
  const started = Date.now();
  const res = await fetch(url.href, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_MS),
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "rankERBot/1.0 (+https://ranker.theartificialbridge.com)",
    },
  });
  const ttfbMs = Date.now() - started;
  const finalUrl = new URL(res.url);
  if (isBlockedHost(finalUrl.hostname)) {
    throw new AnalyzeError("Redirect landed on a blocked host.");
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const bytes = Math.min(buf.byteLength, MAX_BYTES);
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf.slice(0, MAX_BYTES));
  return { url: finalUrl, status: res.status, html, bytes, ttfbMs };
}

function sameHost(a: URL, b: URL) {
  return a.hostname.replace(/^www\./, "") === b.hostname.replace(/^www\./, "");
}

function internalLinks(html: string, base: URL): string[] {
  const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)].map((m) => m[1] ?? "");
  const seen = new Set<string>();
  const out: URL[] = [];
  for (const href of hrefs) {
    if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) continue;
    try {
      const u = new URL(href, base);
      if (!sameHost(u, base)) continue;
      if (u.protocol !== "http:" && u.protocol !== "https:") continue;
      u.hash = "";
      if (u.pathname === base.pathname) continue;
      if (seen.has(u.pathname)) continue;
      seen.add(u.pathname);
      out.push(u);
    } catch {
      /* skip */
    }
  }
  const rank = (u: URL) => {
    const p = u.pathname.toLowerCase();
    if (/about|who/.test(p)) return 0;
    if (/contact/.test(p)) return 1;
    if (/privacy|legal|terms/.test(p)) return 2;
    if (/service|product|care/.test(p)) return 3;
    return 9;
  };
  return out
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, 2)
    .map((u) => u.href);
}

export async function analyzeUrl(raw: string): Promise<AuditResult> {
  const start = normalizeUrl(raw);
  try {
    const home = await fetchPublic(start);
    const extras = internalLinks(home.html, home.url);
    const more = await Promise.all(
      extras.map((href) => fetchPublic(new URL(href)).catch(() => null)),
    );
    const pages = [home, ...more.filter((p): p is PageFetch => p !== null)];
    return scoreLive(pages);
  } catch (err) {
    if (err instanceof AnalyzeError) throw err;
    const fallback = runAudit(start.href);
    return { ...fallback, source: "heuristic" };
  }
}

function scoreLive(pages: PageFetch[]): AuditResult {
  const home = pages[0]!;
  const host = home.url.hostname.replace(/^www\./, "");
  const html = pages.map((p) => p.html).join("\n");
  const bytes = pages.reduce((n, p) => n + p.bytes, 0);
  const title = attr(home.html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    attr(home.html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ??
    attr(home.html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = attr(home.html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(home.html);
  const jsonLd = count(html, /application\/ld\+json/gi);
  const h1 = count(home.html, /<h1\b/gi);
  const images = count(html, /<img\b/gi);
  const imagesMissingAlt = count(html, /<img\b(?![^>]*\balt=)[^>]*>/gi);
  const hasOg = /property=["']og:/i.test(home.html);
  const hasLang = /<html[^>]+lang=/i.test(home.html);
  const fetchPriority = /fetchpriority=["']high["']/i.test(html);
  const imgWithSize = count(html, /<img\b[^>]*(width=|height=|aspect-ratio)/gi);
  const scripts = count(html, /<script\b/gi);
  const hexColors = count(html, /#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi);
  const https = home.url.protocol === "https:";
  const author = /rel=["']author["']|itemprop=["']author["']|author-name/i.test(html);
  const buttonClasses = new Set(
    [...html.matchAll(/class=["']([^"']*btn[^"']*)["']/gi)].map((m) => m[1]),
  );

  const defects: Defect[] = [];
  const push = (id: string, evidence: string) => {
    if (defects.some((d) => d.id === id)) return;
    defects.push({ ...byId(id), evidence });
  };

  if (images > 0 && (!fetchPriority || imgWithSize < Math.max(1, Math.floor(images * 0.4)))) {
    push(
      "D-LCP-01",
      `Fetched ${pages.length} page(s). Images: ${images}. With dimensions: ${imgWithSize}. fetchpriority=high: ${fetchPriority ? "yes" : "no"}.`,
    );
  }
  if (scripts > 18 || bytes > 350_000) {
    push("D-INP-02", `${scripts} script tags across ${pages.length} page(s), ${(bytes / 1024).toFixed(0)} KB HTML.`);
  }
  if (imagesMissingAlt > 0 || (images > 0 && imgWithSize < images)) {
    push("D-CLS-03", `${imagesMissingAlt} images missing alt; ${Math.max(0, images - imgWithSize)} missing width/height.`);
  }
  if (jsonLd === 0) push("D-SCHEMA-04", `No application/ld+json on ${pages.length} fetched document(s).`);
  if (!title || h1 !== 1) push("D-H1-05", `Homepage title “${title ?? "missing"}”. H1 count: ${h1}.`);
  if (!author) push("D-EEAT-06", "No author/rel=author or itemprop=author on fetched HTML.");
  if (!/faq|question/i.test(html) && jsonLd === 0) {
    push("D-FAQ-07", "No FAQ copy or FAQPage schema in the fetch.");
  }
  if (hexColors > 8) push("D-TOKEN-08", `${hexColors} hard-coded hex values in fetched HTML.`);
  if (buttonClasses.size > 3) {
    push("D-CTA-11", `${buttonClasses.size} distinct button-like class strings.`);
  }
  if (!hasLang || !viewport) {
    push("D-A11Y-12", `html[lang]: ${hasLang ? "yes" : "no"}. viewport: ${viewport ? "yes" : "no"}.`);
  }
  if (defects.length === 0) {
    push("D-VOICE-10", `Fetched ${pages.length} page(s) with no HTML-level defects. Voice still needs a human.`);
  }

  let cwv = 86;
  if (images > 0 && !fetchPriority) cwv -= 10;
  if (bytes > 250_000) cwv -= 8;
  if (scripts > 18) cwv -= 8;
  if (imagesMissingAlt > 2) cwv -= 6;
  if (home.ttfbMs > 800) cwv -= 6;
  let seo = 88;
  if (!title) seo -= 16;
  else if (title.length > 65 || title.length < 12) seo -= 6;
  if (!description) seo -= 12;
  if (h1 !== 1) seo -= 8;
  if (!canonical) seo -= 6;
  if (jsonLd === 0) seo -= 8;
  if (!hasOg) seo -= 4;
  if (home.status >= 400) seo -= 20;
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

  const fetched: FetchedPage[] = pages.map((p) => ({
    url: p.url.href,
    status: p.status,
    title: attr(p.html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    bytes: p.bytes,
  }));

  return {
    id: `aud_${Date.now().toString(36)}_${Math.abs(seed).toString(16).slice(0, 6)}`,
    url: home.url.href,
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
    lab: htmlModelFromSignals({
      ttfbMs: home.ttfbMs,
      htmlBytes: bytes,
      scripts,
      images,
      imagesMissingDims: Math.max(0, images - imgWithSize),
    }),
    source: "live",
    httpStatus: home.status,
    pages: fetched,
  };
}
