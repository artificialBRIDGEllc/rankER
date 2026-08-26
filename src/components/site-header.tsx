import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "./logo-mark";
import { Wordmark } from "./wordmark";
import { Button, buttonVariants } from "./ui/button";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

const LINKS = [
  { to: "/build", label: "Build" },
  { to: "/domains", label: "Domains" },
  { to: "/pricing", label: "Pricing" },
  { to: "/compliance/hipaa", label: "HIPAA" },
];

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-bg",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5 font-medium tracking-tight">
          <LogoMark className="size-8" animate />
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/nonprofit" className="text-sm text-muted hover:text-fg">
            Nonprofit
          </Link>
          <Link to="/counsel" className="text-sm text-muted hover:text-fg">
            Counsel
          </Link>
          <AuthSlot />
          <Link
            to="/audit"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "min-h-11 px-4")}
          >
            Free analysis
          </Link>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open ? (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-3 text-sm text-muted hover:bg-surface-2 hover:text-fg"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/counsel"
              className="rounded-md px-3 py-3 text-sm text-muted hover:bg-surface-2 hover:text-fg"
              onClick={() => setOpen(false)}
            >
              Counsel Desk
            </Link>
            <Link
              to="/nonprofit"
              className="rounded-md px-3 py-3 text-sm text-muted hover:bg-surface-2 hover:text-fg"
              onClick={() => setOpen(false)}
            >
              Nonprofit rates
            </Link>
            <div className="px-3 py-3">
              <AuthSlot />
            </div>
            <Link
              to="/audit"
              className={cn(buttonVariants({ variant: "primary" }), "mt-2")}
              onClick={() => setOpen(false)}
            >
              Free analysis
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}


function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="size-8 animate-pulse rounded-full bg-surface-2" />;
  }
  return user ? (
    <SignedIn>
      <UserButton />
    </SignedIn>
  ) : (
    <SignedOut>
      <Link to="/login" className="text-sm text-muted hover:text-fg">
        Sign in
      </Link>
    </SignedOut>
  );
}
