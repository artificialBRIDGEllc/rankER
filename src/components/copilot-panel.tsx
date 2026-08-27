import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { AuditResult } from "@/lib/audit";

type Msg = { role: "user" | "assistant"; text: string };

function reply(audit: AuditResult, input: string): { text: string } {
  const q = input.toLowerCase();
  const cited = audit.defects.find((d) => q.includes(d.id.toLowerCase())) ?? audit.defects[0];

  if (/\bapply|patch|fix|rebuild|write|approve\b/.test(q)) {
    return {
      text: `I cannot write to ${audit.host}. rankER does not apply patches, edit DNS, or change your CMS. Cite a defect ID and I will repeat the evidence from this fetch.`,
    };
  }

  if (/\bscore|cwv|lcp|brand|overall|ttfb\b/.test(q)) {
    const ttfb = audit.lab?.ttfbMs;
    return {
      text: `From this fetch only — overall ${audit.scorecard.overall}, HTML-vitals risk ${audit.scorecard.cwv}, SEO ${audit.scorecard.seo}, authority ${audit.scorecard.authority}, brand ${audit.scorecard.brand}. TTFB ${ttfb == null ? "not measured" : `${ttfb}ms`}. LCP/INP/CLS were not measured. Strongest defect: ${cited?.id ?? "none"} (${cited?.title ?? ""}).`,
    };
  }

  if (!cited) return { text: "This scorecard has no defects to cite." };

  return {
    text: `Citing ${cited.id}. ${cited.title}. ${cited.evidence ?? ""} Impact: ${cited.impact} Fix: ${cited.fix}`,
  };
}

export function CopilotPanel({ audit }: { audit: AuditResult }) {
  const intro = useMemo<Msg>(
    () => ({
      role: "assistant",
      text: `Bound to the fetch of ${audit.host}. I only cite defects ${audit.defects.map((d) => d.id).join(", ") || "(none)"}. I cannot apply patches.`,
    }),
    [audit],
  );
  const [messages, setMessages] = useState<Msg[]>([intro]);
  const [input, setInput] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const next = reply(audit, text);
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: next.text }]);
    setInput("");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-medium">Governed copilot</h2>
      <p className="mt-1 text-sm text-muted">Evidence from this fetch only. No live writes.</p>
      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto text-sm">
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "text-fg" : "text-muted"}>
            <span className="font-medium text-accent">{m.role === "user" ? "You" : "Copilot"} · </span>
            {m.text}
          </p>
        ))}
      </div>
      <form onSubmit={send} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a defect ID…"
          className="h-11"
        />
        <Button type="submit">Send</Button>
      </form>
    </section>
  );
}
