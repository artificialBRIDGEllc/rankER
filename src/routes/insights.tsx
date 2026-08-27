import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TrackPage } from "@/components/track-page";
import { FUNNEL } from "@/lib/analytics";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Local funnel log — rankER" },
      {
        name: "description",
        content: "Counts of analysis, HIPAA, counsel, and checkout events stored in this browser.",
      },
    ],
  }),
});

function InsightsPage() {
  const events = useAppStore((s) => s.analyticsEvents ?? []);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of events) map.set(e.name, (map.get(e.name) ?? 0) + 1);
    return map;
  }, [events]);

  const max = Math.max(1, ...FUNNEL.map((f) => counts.get(f.id) ?? 0));

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <TrackPage name="view_insights" />
      <h1 className="font-display text-4xl">Local funnel log</h1>
      <p className="mt-3 text-muted">
        Event counts in this browser only. We do not have a warehouse wired. Names match the
        buttons you already clicked — analysis, HIPAA, Counsel Desk, and checkout.
      </p>
      <div className="mt-10 space-y-4">
        {FUNNEL.map((f) => {
          const n = counts.get(f.id) ?? 0;
          return (
            <div key={f.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{f.label}</span>
                <span className="font-mono tabular-nums">{n}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${Math.round((n / max) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-subtle">{events.length} events stored locally.</p>
    </main>
  );
}
