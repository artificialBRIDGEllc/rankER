import { cn } from "@/lib/cn";

type BrandLogoProps = {
  variant?: "primary" | "inverse" | "mono";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "size-6",
  md: "size-8",
  lg: "size-12",
} as const;

export function BrandLogo({
  variant = "inverse",
  size = "md",
  className,
}: BrandLogoProps) {
  const tile =
    variant === "inverse"
      ? "fill-primary"
      : variant === "mono"
        ? "fill-transparent"
        : "fill-bg";
  const ink =
    variant === "inverse"
      ? "fill-primary-foreground"
      : variant === "mono"
        ? "fill-current"
        : "fill-fg";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", SIZES[size], className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" className={tile} />
      <rect x="4.6" y="18.4" width="3.3" height="7.6" rx="0.9" className={ink} opacity="0.4" />
      <rect x="9" y="13" width="3.3" height="13" rx="0.9" className={ink} opacity="0.7" />
      <text
        x="13.4"
        y="26.1"
        fontFamily="Figtree, ui-sans-serif, system-ui, sans-serif"
        fontSize="18.5"
        fontWeight="600"
        className={ink}
      >
        R
      </text>
    </svg>
  );
}

/** @deprecated use BrandLogo */
export function LogoMark({
  className,
  inverted = true,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return <BrandLogo variant={inverted ? "inverse" : "primary"} className={className} />;
}
