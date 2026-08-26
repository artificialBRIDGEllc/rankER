import { useId } from "react";
import { cn } from "@/lib/cn";

type BrandLogoProps = {
  variant?: "primary" | "inverse" | "mono";
  size?: "sm" | "md" | "lg";
  className?: string;
  /** One-shot: bars grow up, then the R opens from the stem. */
  animate?: boolean;
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
  animate = false,
}: BrandLogoProps) {
  const clip = useId();
  const tile =
    variant === "inverse"
      ? "fill-primary"
      : variant === "mono"
        ? "fill-transparent"
        : "fill-bg";
  const inkFill =
    variant === "inverse"
      ? "fill-primary-foreground"
      : variant === "mono"
        ? "fill-current"
        : "fill-fg";
  const inkStroke =
    variant === "inverse"
      ? "stroke-primary-foreground"
      : variant === "mono"
        ? "stroke-current"
        : "stroke-fg";

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("shrink-0", SIZES[size], animate && "logo-mark-animate", className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <rect width="32" height="32" rx="7" />
        </clipPath>
      </defs>
      <rect width="32" height="32" rx="7" className={tile} />
      <g clipPath={`url(#${clip})`}>
        <rect
          className={cn("logo-bar", inkFill)}
          x="2.3"
          y="18.8"
          width="5"
          height="10.7"
          rx="1"
          opacity="0.34"
        />
        <rect
          className={cn("logo-bar", inkFill)}
          x="8.2"
          y="11.2"
          width="5"
          height="18.3"
          rx="1"
          opacity="0.66"
        />
        <rect
          className={cn("logo-bar", inkFill)}
          x="14.1"
          y="2.5"
          width="5"
          height="27"
          rx="1"
        />
        <g
          className={cn("logo-door", inkStroke)}
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="butt"
          strokeLinejoin="round"
        >
          <path d="M19.1 3.8h5.2c3.2 0 3.6 3.2 3.6 5.9s-.6 5.9-3.6 5.9H19.1" />
          <path d="M21.4 15.6 28.2 28.8" />
        </g>
      </g>
    </svg>
  );
}

export function LogoMark({
  className,
  inverted = true,
  animate = false,
}: {
  className?: string;
  inverted?: boolean;
  animate?: boolean;
}) {
  return (
    <BrandLogo
      variant={inverted ? "inverse" : "primary"}
      className={className}
      animate={animate}
    />
  );
}
