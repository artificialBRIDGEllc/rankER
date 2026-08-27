import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TrackPage } from "@/components/track-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AUDIT_STEPS } from "@/lib/audit";
import { analyzeSite, saveAuditRecord } from "@/lib/fns";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/audit/")({ component: AuditPage });

function AuditPage() {
  const navigate = useNavigate();
  const saveAudit = useAppStore((s) => s.saveAudit);
  const track = useAppStore((s) => s.track);
  const [url, setUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value || value.length < 3) {
      setError("Enter a website address.");
      return;
    }
    setError(null);
    setRunning(true);
    setStep(0);
    track("cta_audit", "/audit", value);
    const tick = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, AUDIT_STEPS.length - 1));
    }, 700);
    try {
      const result = await analyzeSite({ data: value });
      saveAudit(result);
      void saveAuditRecord({ data: result }).catch(() => undefined);
      void navigate({ to: "/audit/$id", params: { id: result.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze that site.");
    } finally {
      window.clearInterval(tick);
      setRunning(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-14">
      <TrackPage name="view_audit" />
      <h1 className="font-display text-4xl">Free analysis</h1>
      <p className="mt-3 text-muted">
        We fetch the homepage and up to two internal links on the same host. TTFB is
        measured. LCP, INP, and CLS are not. No account required. Sign in to save.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm text-muted" htmlFor="url">
          Website URL
        </label>
        <Input
          id="url"
          name="url"
          inputMode="url"
          autoComplete="url"
          placeholder="example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={running}
        />
        {error ? <p className="text-sm text-crit">{error}</p> : null}
        <Button type="submit" size="lg" className="w-full" disabled={running}>
          {running ? "Fetching pages…" : "Run analysis"}
        </Button>
      </form>
      {running ? (
        <ol className="mt-8 space-y-3">
          {AUDIT_STEPS.map((label, i) => (
            <li
              key={label}
              className={i <= step ? "text-sm text-fg" : "text-sm text-subtle"}
            >
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
              {label}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 text-sm text-subtle">
          Live fetch of the public HTML. Private networks are blocked. If the host
          refuses the request, we fall back to a heuristic scorecard.
        </p>
      )}
    </main>
  );
}
