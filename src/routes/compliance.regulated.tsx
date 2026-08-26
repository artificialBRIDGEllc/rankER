import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { DocumentPreview } from "@/components/document-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { COUNSEL_PRODUCTS } from "@/lib/counsel";
import { ONE_TIME_PACKS } from "@/lib/pricing";

export const Route = createFileRoute("/compliance/regulated")({
  component: RegulatedPackPage,
});

const pack = ONE_TIME_PACKS.compliance_regulated;
const counsel = COUNSEL_PRODUCTS.signoff_regulated;

function RegulatedPackPage() {
  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-sm text-muted">One-time pack · Elevated governance</p>
        <h1 className="mt-2 font-display text-4xl">{pack.name}</h1>
        <p className="mt-2 font-display text-3xl">${pack.price.toLocaleString()}</p>
        <p className="mt-4 text-muted">{pack.description}</p>
        <ul className="mt-8 space-y-3 text-sm text-muted">
          {pack.includes.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-ok" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/checkout"
            search={{ pack: pack.id }}
            className={cn(buttonVariants({ size: "lg" }), "inline-flex")}
          >
            Template only · ${pack.price.toLocaleString()}
          </Link>
          <Link to="/counsel" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "inline-flex")}>
            Signed · ${(pack.price + counsel.price).toLocaleString()}
          </Link>
        </div>
      </div>
      <DocumentPreview pack="compliance_regulated" />
    </main>
  );
}