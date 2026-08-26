import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { AnalyzeError, analyzeUrl } from "@/lib/analyze";
import { SITE } from "@/lib/brand";
import { COUNSEL_PRODUCTS } from "@/lib/counsel";
import { ONE_TIME_PACKS, PLANS } from "@/lib/pricing";
import type { AuditResult } from "@/lib/audit";

export const analyzeSite = createServerFn({ method: "POST" })
  .validator((url: string) => String(url ?? "").trim())
  .handler(async ({ data: url }): Promise<AuditResult> => {
    try {
      return await analyzeUrl(url);
    } catch (err) {
      const msg = err instanceof AnalyzeError ? err.message : "Could not fetch that site.";
      throw new Error(msg);
    }
  });

export const saveAuditRecord = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((audit: AuditResult) => audit)
  .handler(async ({ context, data: audit }) => {
    const sql = await getSql();
    const payload = JSON.stringify(audit);
    await sql`
      insert into audits (id, user_id, host, url, source, payload)
      values (
        ${audit.id},
        ${context.userId},
        ${audit.host},
        ${audit.url},
        ${audit.source ?? "heuristic"},
        ${payload}::jsonb
      )
      on conflict (id) do update set payload = excluded.payload
    `;
    return { ok: true as const };
  });

export const getAuditRecord = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => String(id ?? ""))
  .handler(async ({ context, data: id }): Promise<AuditResult | null> => {
    const sql = await getSql();
    const rows = await sql<{ payload: unknown }>`
      select payload from audits where id = ${id} and user_id = ${context.userId} limit 1
    `;
    if (!rows[0]) return null;
    const payload = rows[0].payload;
    return (typeof payload === "string" ? JSON.parse(payload) : payload) as AuditResult;
  });

export const listAuditRecords = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ id: string; host: string; created_at: string }>`
      select id, host, created_at from audits
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
    return rows;
  });

type CheckoutInput = {
  kind: "plan" | "pack" | "counsel" | "domain";
  sku: string;
  label: string;
  amount: number;
  domainCart?: { fqdn: string; price: number; years: number; privacy: boolean }[];
};

export const createCheckout = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: CheckoutInput) => input)
  .handler(async ({ context, data }) => {
    const amountCents = Math.round(data.amount * 100);
    if (!Number.isFinite(amountCents) || amountCents < 50) {
      throw new Error("Invalid amount.");
    }
    if (data.kind === "plan" && !(data.sku in PLANS && data.sku !== "free")) {
      throw new Error("Unknown plan.");
    }
    if (data.kind === "pack" && !(data.sku in ONE_TIME_PACKS)) {
      throw new Error("Unknown pack.");
    }
    if (data.kind === "counsel" && !(data.sku in COUNSEL_PRODUCTS)) {
      throw new Error("Unknown counsel product.");
    }

    const id = `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const sql = await getSql();
    const payload = JSON.stringify(data);
    const stripe = await startStripeSession({
      id,
      userId: context.userId,
      kind: data.kind,
      sku: data.sku,
      label: data.label,
      amountCents,
    });

    await sql`
      insert into orders (id, user_id, kind, sku, label, amount_cents, status, stripe_session_id, payload)
      values (
        ${id},
        ${context.userId},
        ${data.kind},
        ${data.sku},
        ${data.label},
        ${amountCents},
        ${stripe ? "pending" : "recorded_preview"},
        ${stripe?.sessionId ?? null},
        ${payload}::jsonb
      )
    `;

    if (data.kind === "domain" && data.domainCart?.length) {
      await sql`
        insert into domain_orders (id, user_id, payload)
        values (${id}, ${context.userId}, ${payload}::jsonb)
      `;
    }

    return {
      orderId: id,
      checkoutUrl: stripe?.url ?? null,
      preview: !stripe,
    };
  });

export const saveGeneratedSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((site: { id: string; payload: unknown }) => site)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into generated_sites (id, user_id, payload)
      values (${data.id}, ${context.userId}, ${JSON.stringify(data.payload)}::jsonb)
      on conflict (id) do update set payload = excluded.payload
    `;
    return { ok: true as const };
  });

export const saveCounselEngagement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((row: { id: string; payload: unknown }) => row)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into counsel_engagements (id, user_id, payload)
      values (${data.id}, ${context.userId}, ${JSON.stringify(data.payload)}::jsonb)
      on conflict (id) do update set payload = excluded.payload
    `;
    return { ok: true as const };
  });

export const saveNonprofitRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((row: { id: string; payload: unknown }) => row)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into nonprofit_requests (id, user_id, payload)
      values (${data.id}, ${context.userId}, ${JSON.stringify(data.payload)}::jsonb)
      on conflict (id) do update set payload = excluded.payload
    `;
    return { ok: true as const };
  });

async function startStripeSession(args: {
  id: string;
  userId: string;
  kind: string;
  sku: string;
  label: string;
  amountCents: number;
}): Promise<{ url: string; sessionId: string } | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;

  const recurring = args.kind === "plan";
  const params = new URLSearchParams();
  params.set("mode", recurring ? "subscription" : "payment");
  params.set("success_url", `${SITE.url}/checkout?paid=${args.id}`);
  params.set("cancel_url", `${SITE.url}/checkout`);
  params.set("client_reference_id", args.id);
  params.set("metadata[order_id]", args.id);
  params.set("metadata[user_id]", args.userId);
  params.set("metadata[sku]", args.sku);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(args.amountCents));
  params.set("line_items[0][price_data][product_data][name]", args.label);
  if (recurring) {
    params.set("line_items[0][price_data][recurring][interval]", "month");
  }

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const json = (await res.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !json.url || !json.id) {
    throw new Error(json.error?.message ?? "Stripe checkout failed.");
  }
  return { url: json.url, sessionId: json.id };
}
