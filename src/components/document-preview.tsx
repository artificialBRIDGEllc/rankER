import { PACK_DOCS } from "@/lib/documents";
import type { PackId } from "@/lib/pricing";

export function DocumentPreview({ pack }: { pack: PackId }) {
  const docs = PACK_DOCS[pack];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-8 max-w-xl">
        <h2 className="font-display text-3xl">Document preview</h2>
        <p className="mt-2 text-muted">
          Structure you install. Brand tokens applied at generation. Signed versions replace the
          template banner with a counsel opinion letter.
        </p>
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
