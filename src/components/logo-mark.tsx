import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  /** Ice tile with ink mark — default for dark chrome. */
  inverted?: boolean;
};

export function LogoMark({ className, inverted = true }: LogoMarkProps) {
  const ink = inverted ? "fill-primary-foreground" : "fill-fg";
  const stroke = inverted ? "stroke-primary-foreground" : "stroke-fg";
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
      <rect x="4.4" y="18.2" width="3.4" height="7.8" rx="1" className={ink} opacity="0.38" />
      <rect x="9" y="13" width="3.4" height="13" rx="1" className={ink} opacity="0.68" />
      <g
        fill="none"
        className={stroke}
        strokeWidth="3.6"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        <path d="M15.8 6.6v19.4" />
        <path d="M15.8 6.6h6.6c3.4 0 4.2 2.2 4.2 5.1s-.8 5.1-4.2 5.1H15.8" />
        <path d="M17.7 16.8 26.6 26" />
      </g>
    </svg>
  );
}
