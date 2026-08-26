import { cn } from "@/lib/cn";

type LogoMarkProps = {
  className?: string;
  /** Ice tile with ink mark — default for dark chrome. */
  inverted?: boolean;
};

const R_PATH =
  "M14.2 6.2h10c3.6 0 4.2 2.5 4.2 5.2c0 3.1-2.1 5.2-4.9 5.2h-4.7L27.6 26h-5.3l-3.5-5.8V26h-4.6zm4.6 2.8v4.4h3.6c1.6 0 1.8-1.2 1.8-2.2s-.3-2.2-1.8-2.2z";

export function LogoMark({ className, inverted = true }: LogoMarkProps) {
  const ink = inverted ? "fill-primary-foreground" : "fill-fg";
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
      <rect x="4.6" y="18" width="3.6" height="8" rx="1.1" className={ink} opacity="0.38" />
      <rect x="9.5" y="12.6" width="3.6" height="13.4" rx="1.1" className={ink} opacity="0.68" />
      <path d={R_PATH} fillRule="evenodd" className={ink} />
    </svg>
  );
}
