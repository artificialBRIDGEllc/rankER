import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CopilotPanel } from "@/components/copilot-panel";
import { CwvLabPanel } from "@/components/cwv-lab";
import { ScoreMeter } from "@/components/score-meter";
import { TrackPage } from "@/components/track-page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { AuditResult, Severity } from "@/lib/audit";
import { getAuditRecord } from "@/lib/fns";
import { downloadCssTokens } from "@/lib/pack-files";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/audit/$id")({ component: AuditResultPage });

const SEV: Record<Severity, "crit" | "warn" | "muted"> = {
  critical: "crit",
  high: "warn",
  medium: "muted",
};

function AuditResultPage() {
  const { id } = Route.useParams();
  const audits = useAppStore((s) => s.audits);
  const saveAudit = useAppStore((s) => s.saveAudit);
  const [hydrated, setHydrated] = useState(() => useAppStore.persist.hasHydrated());
  const [remote, setRemote] = useState<AuditResult | null>(null);

  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return useAppStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  useEffect(() => {
    const local = useAppStore.getState().audits.find((a) => a.id === id);
    if (local) return;
    void getAuditRecord({ data: id })
      .then((row) => {
        if (row) {
          saveAudit(row);
          setRemote(row);
        }
      })
      .catch(() => undefined);
  }, [id, saveAudit]);

  const audit: AuditResult | undefined = audits.find((a) => a.id === id) ?? remote ?? undefined;

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-sm text-muted">Loading scorecard…</p>
      </main>
    );
  }

  if (!audit) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Analysis not found</h1>
        <p className="mt-2 text-muted">Run a new free analysis to generate a scorecard.</p>
        <Link to="/audit" className={cn(buttonVariants(), "mt-6 inline-flex")}>
          Free analysis
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <TrackPage name="audit_complete" meta={audit.host} />
      <p className="text-sm text-muted">{audit.host}</p>
      <h1 className="mt-1 font-display text-4xl">Scorecard</h1>
      <p className="mt-2 text-sm text-subtle">{audit.url}</p>
      {audit.source ? (
        <Badge tone="muted" className="mt-3">
          {audit.source === "live"
            ? `Live fetch${audit.httpStatus ? ` · HTTP ${audit.httpStatus}` : ""}`
            : "Heuristic fallback"}
        </Badge>
      ) : null}

      <div className="mt-8 grid gap-6 rounded-2xl border border-border bg-surface p-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Overall</p>
          <p className="font-display text-6xl tabular-nums">{audit.scorecard.overall}</p>
          <p className="mt-1 text-sm text-subtle">0–100 HTML model. Not a Google ranking percentile.</p>
        </div>
        <div className="space-y-4">
          <ScoreMeter label="HTML vitals risk" value={audit.scorecard.cwv} />
          <ScoreMeter label="SEO foundation" value={audit.scorecard.seo} />
          <ScoreMeter label="Content authority" value={audit.scorecard.authority} />
          <ScoreMeter label="Brand unity" value={audit.scorecard.brand} />
        </div>
      </div>

      {audit.lab ? <CwvLabPanel lab={audit.lab} /> : null}

      {audit.pages?.length ? (
        <section className="mt-8">
          <h2 className="font-display text-2xl">Pages fetched</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {audit.pages.map((p) => (
              <li key={p.url} className="rounded-xl border border-border bg-surface px-4 py-3">
                <span className="font-mono text-xs text-accent">HTTP {p.status}</span>{" "}
                <span className="text-fg">{p.url}</span>
                <span className="block text-subtle">{p.title ?? "No title"} · {(p.bytes / 1024).toFixed(0)} KB</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <h2 className="mt-12 font-display text-2xl">Ranked defects</h2>
      <ul className="mt-4 space-y-3">
        {audit.defects.map((d) => (
          <li key={d.id} className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-accent">{d.id}</span>
              <Badge tone={SEV[d.severity]}>{d.severity}</Badge>
              <Badge>{d.layer}</Badge>
            </div>
            <h3 className="mt-2 font-medium">{d.title}</h3>
            <p className="mt-1 text-sm text-muted">{d.impact}</p>
            {d.evidence ? (
              <p className="mt-2 font-mono text-xs text-accent">{d.evidence}</p>
            ) : null}
            <p className="mt-2 text-sm text-fg">{d.fix}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-display text-2xl">Suggested tokens</h2>
      <p className="mt-2 text-sm text-muted">Suggestions from this fetch. Not your brand system until you adopt them.</p>
      <button
        type="button"
        className="mt-3 text-sm underline"
        onClick={() => downloadCssTokens(audit.tokens, audit.host)}
      >
        Download CSS file
      </button>
      <pre className="mt-4 overflow-x-auto rounded-2xl border border-border bg-surface p-5 font-mono text-xs text-muted">
        {Object.entries(audit.tokens)
          .map(([k, v]) => `${k}: ${v};`)
          .join("\n")}
      </pre>

      <h2 className="mt-12 font-display text-2xl">Implementation backlog</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
        {audit.patches.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <div className="mt-12">
        <CopilotPanel audit={audit} />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/counsel" className={cn(buttonVariants())}>
          Request a review
        </Link>
        <Link to="/compliance/hipaa" className={cn(buttonVariants({ variant: "secondary" }))}>
          HIPAA pack
        </Link>
        <Link to="/pricing" className={cn(buttonVariants({ variant: "ghost" }))}>
          View plans
        </Link>
      </div>
    </main>
  );
}
