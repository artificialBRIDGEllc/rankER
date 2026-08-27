import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ICANN_NOTICE } from "@/lib/domains";

export const Route = createFileRoute("/domains/cart")({ component: DomainCartPage });

function DomainCartPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="font-display text-3xl">We do not sell domains</h1>
      <p className="mt-3 text-muted">
        There is no cart. rankER is not a registrar. Look the name up in public RDAP, then
        register it with a registrar you choose.
      </p>
      <p className="mt-4 text-xs text-subtle">{ICANN_NOTICE}</p>
      <Link to="/domains" className={cn(buttonVariants(), "mt-8 inline-flex")}>
        RDAP search
      </Link>
    </main>
  );
}
