import { useEffect, useState } from "react";

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 900,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(to);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setN(to * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, duration]);

  const shown = Number.isInteger(to) ? Math.round(n) : n.toFixed(1);
  return (
    <span className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
