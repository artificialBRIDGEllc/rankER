import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { AuditResult } from "@/lib/audit";

type Msg = { role: "user" | "assistant"; text: string };

function reply(audit: AuditResult, input: string, pendingApply: boolean): { text: string; pending: boolean } {
  const q = input.toLowerCase();
  const ids = audit.defects.map((d) => d.id);

  if (pendingApply && /\b(yes|approve|confirm|apply)\b/.test(q)) {
    return {
      pending: false,
      text: `Approved. Logged as a governed apply on ${ids[0] ?? "D-TOKEN-08"}. In production this would write the patch only after the approval is stored in the governance log. Risk score: 62 (elevated — schema and token writes).`,
    };
  }

  if (/\bapply|patch|fix|rebuild|write\b/.test(q)) {
    const id = audit.defects[0]?.id ?? "D-TOKEN-08";
    return {
      pending: true,
      text: `I can only apply changes after explicit confirmation. Proposed action cites ${id}: ${audit.defects[0]?.fix ?? "inject tokens"}. Reply “approve” to log the apply. I will not invent a score that is not on this audit.`,
    };
  }

  const cited = audit.defects.find((d) => q.includes(d.id.toLowerCase())) ?? audit.defects[0];
  if (/\bscore|cwv|lcp|brand|overall\b/.test(q)) {
    return {
      pending: false,
      text: `From this audit only — overall ${audit.scorecard.overall}, CWV ${audit.scorecard.cwv}, SEO ${audit.scorecard.seo}, authority ${audit.scorecard.authority}, brand ${audit.scorecard.brand}. Strongest defect: ${cited.id} (${cited.title}).`,
    };
  }

  return {
    pending: false,
    text: `Citing ${cited.id}. ${cited.title}. Impact: ${cited.impact} Fix: ${cited.fix} I cannot invent metrics outside this scorecard. Ask me to apply a patch if you want the confirmation gate.`,
  };
}

export function CopilotPanel({ audit }: { audit: AuditResult }) {
  const intro = useMemo<Msg>(
    () => ({
      role: "assistant",
      text: `Governed copilot bound to ${audit.host}. I will only cite defects ${audit.defects.map((d) => d.id).join(", ")}. Write actions require an explicit “approve”.`,
    }),
    [audit],
  );
  const [messages, setMessages] = useState<Msg[]>([intro]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const next = reply(audit, text, pending);
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: next.text }]);
    setPending(next.pending);
    setInput("");
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <h2 className="font-medium">Governed copilot</h2>
      <p className="mt-1 text-sm text-muted">Evidence-only. No invented scores. Apply requires confirmation.</p>
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
          placeholder="Ask about a defect ID or request a patch…"
          className="h-11"
        />
        <Button type="submit" className="shrink-0">
          Send
        </Button>
      </form>
    </section>
  );
}
