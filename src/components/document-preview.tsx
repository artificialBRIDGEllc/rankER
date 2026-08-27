import { PACK_DOCS } from "@/lib/documents";
import { downloadPack } from "@/lib/pack-files";
import type { PackId } from "@/lib/pricing";
import { Button } from "./ui/button";

export function DocumentPreview({ pack }: { pack: PackId }) {
  const docs = PACK_DOCS[pack];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8 max-w-xl">
        <h2 className="font-display text-3xl">Template excerpts</h2>
        <p className="mt-2 text-muted">
          These are templates. Download the full Markdown pack. Do not publish until your own
          counsel reviews it. rankER does not sign these files.
        </p>
        <Button className="mt-4" type="button" onClick={() => downloadPack(pack)}>
          Download full pack (.md)
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {docs.map((doc) => (
          <article key={doc.id} className="rounded-2xl border border-border bg-surface p-6">
            <p className="font-mono text-xs text-accent">{doc.kicker}</p>
            <h3 className="mt-2 font-medium">{doc.title}</h3>
            <p className="mt-3 font-display text-[1.05rem] leading-relaxed text-muted italic">
              {doc.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
