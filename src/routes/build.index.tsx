import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  BUILD_STEPS,
  INDUSTRIES,
  defaultBrief,
  generateSite,
  type IndustryId,
  type SiteBrief,
  type SitePageId,
} from "@/lib/site-builder";
import { saveGeneratedSite } from "@/lib/fns";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/build/")({ component: BuildWizard });

const PAGE_OPTIONS: { id: SitePageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "privacy", label: "Privacy" },
];

function BuildWizard() {
  const navigate = useNavigate();
  const saveSite = useAppStore((s) => s.saveSite);
  const [brief, setBrief] = useState<SiteBrief>(defaultBrief);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function patch<K extends keyof SiteBrief>(key: K, value: SiteBrief[K]) {
    setBrief((b) => ({ ...b, [key]: value }));
  }

  function togglePage(id: SitePageId) {
    if (id === "home") return;
    setBrief((b) => ({
      ...b,
      pages: b.pages.includes(id) ? b.pages.filter((p) => p !== id) : [...b.pages, id],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (brief.name.trim().length < 2) {
      setError("Enter the business name.");
      return;
    }
    setError(null);
    setRunning(true);
    setStep(0);
    for (let i = 0; i < BUILD_STEPS.length; i++) {
      setStep(i);
      await wait(420);
    }
    const site = generateSite(brief);
    saveSite(site);
    void saveGeneratedSite({ data: { id: site.id, payload: site } }).catch(() => undefined);
    setRunning(false);
    void navigate({ to: "/build/$id", params: { id: site.id } });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-14">
      <p className="text-sm text-muted">From scratch</p>
      <h1 className="mt-1 font-display text-4xl">Build a site</h1>
      <p className="mt-3 text-muted">
        No existing URL required. Choose the industry, name the practice, pick pages.
        rankER generates a brand-locked site you can preview, copy, and take to Rebuild & Command.
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-8">
        <fieldset>
          <legend className="mb-3 text-sm text-muted">Industry</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(INDUSTRIES) as IndustryId[]).map((id) => {
              const item = INDUSTRIES[id];
              const on = brief.industry === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    patch("industry", id);
                    if (id === "healthcare") patch("compliance", "hipaa");
                    else if (id === "professional") patch("compliance", "regulated");
                    else patch("compliance", "standard");
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left min-h-11",
                    on ? "border-accent bg-surface" : "border-border bg-transparent",
                  )}
                >
                  <p className="font-medium">{item.label}</p>
                  <p className="mt-1 text-sm text-muted">{item.blurb}</p>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
              Business name
            </label>
            <Input
              id="name"
              value={brief.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder="Heritage Care"
              disabled={running}
            />
          </div>
          <div>
            <label htmlFor="tagline" className="mb-1.5 block text-sm text-muted">
              One-line offer
            </label>
            <Input
              id="tagline"
              value={brief.tagline}
              onChange={(e) => patch("tagline", e.target.value)}
              placeholder={INDUSTRIES[brief.industry].defaultTagline}
              disabled={running}
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm text-muted">
              City
            </label>
            <Input
              id="city"
              value={brief.city}
              onChange={(e) => patch("city", e.target.value)}
              placeholder="Prosper, Texas"
              disabled={running}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm text-muted">Pages</legend>
          <div className="flex flex-wrap gap-2">
            {PAGE_OPTIONS.map((p) => {
              const on = brief.pages.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={p.id === "home" || running}
                  onClick={() => togglePage(p.id)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-sm",
                    on ? "border-accent bg-surface text-fg" : "border-border text-muted",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {error ? <p className="text-sm text-crit">{error}</p> : null}

        <Button type="submit" size="lg" className="w-full" disabled={running}>
          {running ? "Composing site…" : "Generate site"}
        </Button>
      </form>

      {running ? (
        <ol className="mt-8 space-y-3">
          {BUILD_STEPS.map((label, i) => (
            <li key={label} className={i <= step ? "text-sm text-fg" : "text-sm text-subtle"}>
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
              {label}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-subtle">
          Healthcare defaults to HIPAA stubs. Professional defaults to regulated language.
          Templates still require attorney review before launch.
        </p>
      )}
    </main>
  );
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
