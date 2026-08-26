import { cn } from "@/lib/cn";

export function ScoreRing({
  value,
  label,
  size = 128,
  className,
}: {
  value: number;
  label: string;
  size?: number;
  className?: string;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="score-ring text-fg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-surface-2)" strokeWidth="6" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-ok)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fill="currentColor"
          style={{ fontSize: "22px", fontFamily: "var(--font-display)" }}
        >
          {value}
        </text>
      </svg>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
