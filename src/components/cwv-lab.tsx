import { CWV_THRESHOLDS, type CwvLab } from "@/lib/cwv";

export function CwvLabPanel({ lab }: { lab: CwvLab }) {
  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-2xl">HTML vitals risk</h2>
      <p className="mt-1 text-sm text-subtle">
        {lab.method === "html-model"
          ? "Measured TTFB from our fetch, plus HTML counts. Not Chrome lab. Not CrUX. Not INP/LCP/CLS."
          : "Live fetch failed. No TTFB. Counts are empty."}{" "}
        Google field targets for comparison only: LCP {CWV_THRESHOLDS.lcp}, INP {CWV_THRESHOLDS.inp}, CLS{" "}
        {CWV_THRESHOLDS.cls}.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <Stat
          label="TTFB"
          value={lab.ttfbMs == null ? "—" : `${lab.ttfbMs}ms`}
        />
        <Stat label="HTML" value={`${(lab.htmlBytes / 1024).toFixed(0)} KB`} />
        <Stat label="Scripts" value={String(lab.scripts)} />
        <Stat label="Images" value={String(lab.images)} />
        <Stat label="No dimensions" value={String(lab.imagesMissingDims)} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-bg p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-2xl tabular-nums">{value}</p>
    </div>
  );
}
