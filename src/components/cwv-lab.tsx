import { cn } from "@/lib/cn";
import { CWV_THRESHOLDS, cwvRating, type CwvLab } from "@/lib/cwv";

function tone(rating: "good" | "needs" | "poor") {
  return rating === "good" ? "text-ok" : rating === "needs" ? "text-warn" : "text-crit";
}

export function CwvLabPanel({ lab }: { lab: CwvLab }) {
  const rows = [
    { key: "lcp" as const, label: "LCP", value: `${(lab.lcpMs / 1000).toFixed(2)}s`, raw: lab.lcpMs },
    { key: "inp" as const, label: "INP", value: `${lab.inpMs}ms`, raw: lab.inpMs },
    { key: "cls" as const, label: "CLS", value: lab.cls.toFixed(3), raw: lab.cls },
  ];

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl">Lab Core Web Vitals</h2>
        <p className={cn("text-sm", lab.passed ? "text-ok" : "text-crit")}>
          {lab.passed ? "Pass · mobile lab" : "Fail · mobile lab"}
        </p>
      </div>
      <p className="mt-1 text-sm text-subtle">
        Deterministic lab capture for week-over-week comparison. Thresholds: LCP {CWV_THRESHOLDS.lcp},
        INP {CWV_THRESHOLDS.inp}, CLS {CWV_THRESHOLDS.cls}. FCP {(lab.fcpMs / 1000).toFixed(2)}s · TTFB{" "}
        {lab.ttfbMs}ms.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {rows.map((r) => {
          const rating = cwvRating(r.key, r.raw);
          return (
            <div key={r.key} className="rounded-xl border border-border bg-bg p-4">
              <p className="text-xs text-muted">{r.label}</p>
              <p className={cn("mt-1 font-display text-2xl tabular-nums", tone(rating))}>{r.value}</p>
              <p className="mt-1 text-xs text-subtle">{rating}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
