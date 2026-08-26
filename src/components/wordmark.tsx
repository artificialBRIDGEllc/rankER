import { cn } from "@/lib/cn";

type WordmarkProps = {
  className?: string;
  /** UI chrome vs editorial lockup. */
  tone?: "ui" | "display";
};

/**
 * rank + ER as a ligature pair. ER is typeset Figtree, not a drawn path.
 * The R tucks under the E’s arm — one glyph, two letters.
 */
export function Wordmark({ className, tone = "ui" }: WordmarkProps) {
  const display = tone === "display";
  return (
    <span
      className={cn(
        "inline-flex items-baseline text-fg",
        display ? "font-display italic" : "font-medium tracking-tight",
        className,
      )}
    >
      <span>rank</span>
      <span
        className={cn(
          "liga-er not-italic font-semibold",
          display && "ml-[0.05em] font-sans text-[0.78em]",
        )}
      >
        E<span className="liga-er-r">R</span>
      </span>
    </span>
  );
}
