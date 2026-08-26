import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { ROADMAP, type Horizon } from "@/lib/roadmap";

export const Route = createFileRoute("/roadmap")({ component: RoadmapPage });

const LABELS: Record<Horizon, string> = {
  now: "Building now",
  next: "Next",
  later: "Later",
};

function RoadmapPage() {
  const groups: Horizon[] = ["now", "next", "later"];
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl">Future improvements</h1>
      <p className="mt-3 text-muted">
        The product ships with free analysis, subscription tiers, governed copilot rules,
        and compliance packs. This is what comes next — in the order we will build it.
      </p>
      <div className="mt-12 space-y-12">
        {groups.map((horizon) => (
          <section key={horizon}>
            <Badge tone={horizon === "now" ? "accent" : "muted"}>{LABELS[horizon]}</Badge>
            <ul className="mt-4 space-y-4">
              {ROADMAP.filter((item) => item.horizon === horizon).map((item) => (
                <li key={item.id} className="rounded-2xl border border-border bg-surface p-5">
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Link to="/audit" className={cn(buttonVariants(), "mt-12 inline-flex")}>
        Run a free analysis today
      </Link>
    </main>
  );
}
