import { cn } from "@/lib/cn";

export function ScoreMeter({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  const tone = value >= 80 ? "ok" : value >= 60 ? "warn" : "crit";
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-sm tabular-nums text-fg">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-[var(--motion-slow)]",
            tone === "ok" && "bg-ok",
            tone === "warn" && "bg-warn",
            tone === "crit" && "bg-crit",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
