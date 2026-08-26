import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  /** Ice tile with ink bars — default for dark chrome. */
  inverted?: boolean;
};

export function LogoMark({ className, inverted = true }: LogoMarkProps) {
  const bar = inverted ? "fill-primary-foreground" : "fill-fg";
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        width="32"
        height="32"
        rx="7"
        className={inverted ? "fill-primary" : "fill-bg"}
      />
      <rect x="6" y="17" width="5" height="9" rx="1.5" className={bar} opacity="0.38" />
      <rect x="13.5" y="12" width="5" height="14" rx="1.5" className={bar} opacity="0.68" />
      <rect x="21" y="7" width="5" height="19" rx="1.5" className={bar} />
    </svg>
  );
}
