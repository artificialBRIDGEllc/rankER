import { useState } from "react";
import type { GeneratedPage, GeneratedSite } from "@/lib/site-builder";

export function GeneratedSitePreview({ site }: { site: GeneratedSite }) {
  const [pageId, setPageId] = useState(site.pages[0]?.id ?? "home");
  const page = site.pages.find((p) => p.id === pageId) ?? site.pages[0];
  const t = site.tokens;

  if (!page) return null;

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: "color-mix(in srgb, " + t.fg + " 12%, transparent)", background: t.bg, color: t.fg }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm"
        style={{ borderColor: "color-mix(in srgb, " + t.fg + " 12%, transparent)", background: t.surface }}
      >
        <span className="font-medium tracking-tight">{site.brief.name}</span>
        <nav className="flex flex-wrap gap-1">
          {site.pages.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPageId(p.id)}
              className="min-h-11 rounded-md px-3 text-sm"
              style={{
                background: p.id === pageId ? t.accent : "transparent",
                color: p.id === pageId ? t.accentFg : t.muted,
              }}
            >
              {p.title}
            </button>
          ))}
        </nav>
      </div>
      <PageBody site={site} page={page} />
    </div>
  );
}

function PageBody({ site, page }: { site: GeneratedSite; page: GeneratedPage }) {
  const t = site.tokens;
  return (
    <div className="px-5 py-10 sm:px-10">
      <p className="text-xs tracking-wide" style={{ color: t.muted }}>
        {site.brief.city}
      </p>
      <h2
        className="mt-2 max-w-xl font-display text-3xl sm:text-4xl"
        style={{ color: t.fg, letterSpacing: "-0.03em" }}
      >
        {page.headline}
      </h2>
      <p className="mt-4 max-w-lg text-sm leading-relaxed" style={{ color: t.muted }}>
        {page.body}
      </p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {page.bullets.map((b) => (
          <li
            key={b}
            className="rounded-xl px-4 py-3 text-sm"
            style={{ background: t.surface, color: t.fg }}
          >
            {b}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-8 min-h-11 rounded-lg px-5 text-sm font-medium"
        style={{ background: t.accent, color: t.accentFg }}
      >
        {page.cta}
      </button>
      <footer className="mt-12 border-t pt-4 text-xs" style={{ borderColor: "color-mix(in srgb, " + t.fg + " 12%, transparent)", color: t.muted }}>
        {site.brief.name} · {site.seo.title}
      </footer>
    </div>
  );
}
