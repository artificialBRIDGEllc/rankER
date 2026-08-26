import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Badge({
  className,
  tone = "muted",
  ...props
}: ComponentProps<"span"> & { tone?: "muted" | "ok" | "warn" | "crit" | "accent" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "muted" && "border-border text-muted",
        tone === "ok" && "border-ok/30 text-ok",
        tone === "warn" && "border-warn/30 text-warn",
        tone === "crit" && "border-crit/30 text-crit",
        tone === "accent" && "border-accent/30 text-accent",
        className,
      )}
      {...props}
    />
  );
}
