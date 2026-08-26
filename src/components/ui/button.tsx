import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,border-color,color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96] min-h-11",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "border border-border bg-transparent text-fg hover:bg-surface-2",
        ghost: "text-muted hover:text-fg hover:bg-surface-2",
        accent: "bg-accent text-accent-foreground hover:opacity-90",
      },
      size: {
        sm: "rounded-md px-3 text-sm h-9 min-h-9",
        md: "rounded-lg px-5 text-sm h-11",
        lg: "rounded-xl px-7 text-base h-12",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
