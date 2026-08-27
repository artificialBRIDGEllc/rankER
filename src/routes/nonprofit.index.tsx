import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/cn";
import {
  BUDGET_LABELS,
  NONPROFIT_CRITERIA,
  ORG_STATUS,
  quoteMonthly,
  typicalPercent,
  type BudgetBand,
  type DiscountAsk,
  type OrgStatus,
} from "@/lib/nonprofit";
import { PLANS, type PlanId } from "@/lib/pricing";
import { saveNonprofitRequest } from "@/lib/fns";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/nonprofit/")({
  component: NonprofitPage,
  head: () => ({
    meta: [
      { title: "Nonprofit rates — rankER" },
      {
        name: "description",
        content:
          "501(c)(3) and public-benefit organizations can request 50–100% off rankER. The request is stored. A human has to approve it. There is no automatic $0 plan and no five-day SLA.",
      },
    ],
  }),
});

const fieldClass =
  "h-12 min-h-11 w-full rounded-lg border border-border bg-surface px-4 text-base text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function NonprofitPage() {
  const navigate = useNavigate();
  const add = useAppStore((s) => s.addNonprofitRequest);
  const [orgName, setOrgName] = useState("");
  const [ein, setEin] = useState("");
  const [status, setStatus] = useState<OrgStatus>("501c3");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState<BudgetBand>("under_100k");
  const [plan, setPlan] = useState<Exclude<PlanId, "free">>("tier1");
  const [ask, setAsk] = useState<DiscountAsk>("100");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [mission, setMission] = useState("");
  const [servesUnderserved, setServesUnderserved] = useState(true);
  const [attested, setAttested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const percent = useMemo(
    () => typicalPercent(budget, servesUnderserved),
    [budget, servesUnderserved],
  );
  const monthly = quoteMonthly(plan, percent);
  const list = PLANS[plan].priceMonthly;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (orgName.trim().length < 2) {
      setError("Enter the legal organization name.");
      return;
    }
    if (!/^\d{2}-?\d{7}$/.test(ein.trim()) && status !== "fiscal_sponsor" && status !== "church") {
      setError("Enter a nine-digit EIN (XX-XXXXXXX). Churches may leave 00-0000000 if none.");
      return;
    }
    if (!contactName.trim() || !email.includes("@")) {
      setError("Contact name and a valid email are required.");
      return;
    }
    if (!attested) {
      setError("Certification is required.");
      return;
    }
    const rec = add({
      orgName: orgName.trim(),
      ein: ein.trim() || "none",
      status,
      website: website.trim(),
      budget,
      plan,
      ask,
      contactName: contactName.trim(),
      email: email.trim(),
      mission: mission.trim(),
      servesUnderserved,
      attested,
      typicalPercent: percent,
      typicalMonthly: monthly,
    });
    void saveNonprofitRequest({ data: { id: rec.id, payload: rec } }).catch(() => undefined);
    void navigate({ to: "/nonprofit/$id", params: { id: rec.id } });
  }

  return (
    <main className="pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "rankER Nonprofit Rate",
          description:
            "A form to request 50–100% off rankER. The request is stored. $0 is not automatic.",
        }}
      />

      <section className="relative overflow-hidden border-b border-border">
        <img
          src="/media/light-fins.jpg"
          alt=""
          width={1792}
          height={1008}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/40" />
        <div className="relative mx-auto max-w-3xl px-4 py-20">
          <p className="text-xs tracking-[0.18em] text-accent uppercase">Specialty offer</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            Nonprofit rates.
            <span className="mt-1 block italic text-accent">Sometimes zero.</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Verified public-benefit organizations can request 50%, 80%, or a full scholarship
            to $0. Free analysis is already free. This form is the paid-plan and pack path.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
        {NONPROFIT_CRITERIA.map((c) => (
          <article key={c.title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-medium">{c.title}</h2>
            <p className="mt-2 text-sm text-muted">{c.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-2xl px-4">
        <h2 className="font-display text-3xl">Request a rate</h2>
        <p className="mt-2 text-sm text-muted">
          Typical formula for this profile (not a promise):{" "}
          <span className="text-fg">
            {percent}% off {PLANS[plan].name}
          </span>
          {percent === 100 ? (
            <span> — $0 / month</span>
          ) : (
            <span>
              {" "}
              — ${monthly.toFixed(2)}/mo instead of ${list}
            </span>
          )}
          . The formula is illustrative. Final award is reviewed by a human. Asking for $0 is allowed.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="org" className="mb-1.5 block text-sm text-muted">
              Legal organization name
            </label>
            <Input id="org" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ein" className="mb-1.5 block text-sm text-muted">
                EIN
              </label>
              <Input
                id="ein"
                inputMode="numeric"
                placeholder="12-3456789"
                value={ein}
                onChange={(e) => setEin(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="mb-1.5 block text-sm text-muted">
                Status
              </label>
              <select
                id="status"
                className={fieldClass}
                value={status}
                onChange={(e) => setStatus(e.target.value as OrgStatus)}
              >
                {(Object.keys(ORG_STATUS) as OrgStatus[]).map((k) => (
                  <option key={k} value={k}>
                    {ORG_STATUS[k]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="web" className="mb-1.5 block text-sm text-muted">
              Current website (optional)
            </label>
            <Input
              id="web"
              placeholder="https://"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budget" className="mb-1.5 block text-sm text-muted">
                Annual operating budget
              </label>
              <select
                id="budget"
                className={fieldClass}
                value={budget}
                onChange={(e) => setBudget(e.target.value as BudgetBand)}
              >
                {(Object.keys(BUDGET_LABELS) as BudgetBand[]).map((k) => (
                  <option key={k} value={k}>
                    {BUDGET_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="plan" className="mb-1.5 block text-sm text-muted">
                Plan requested
              </label>
              <select
                id="plan"
                className={fieldClass}
                value={plan}
                onChange={(e) => setPlan(e.target.value as Exclude<PlanId, "free">)}
              >
                <option value="tier1">Saved history · $49</option>
                <option value="tier2">Templates + export · $149</option>
                <option value="tier3">Portfolio · $499</option>
              </select>
            </div>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Discount requested</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["50", "50% off"],
                  ["80", "80% off"],
                  ["100", "$0 scholarship"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAsk(id)}
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-sm",
                    ask === id ? "border-accent bg-surface text-fg" : "border-border text-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cname" className="mb-1.5 block text-sm text-muted">
                Your name
              </label>
              <Input id="cname" value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="mission" className="mb-1.5 block text-sm text-muted">
              Who you serve, in one paragraph
            </label>
            <textarea
              id="mission"
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
            />
          </div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1 size-4"
              checked={servesUnderserved}
              onChange={(e) => setServesUnderserved(e.target.checked)}
            />
            We primarily serve rural, senior, low-income, or otherwise underserved communities.
          </label>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              className="mt-1 size-4"
              checked={attested}
              onChange={(e) => setAttested(e.target.checked)}
            />
            I certify this organization is a nonprofit or fiscally sponsored public-benefit project
            and that the information is accurate.
          </label>
          {error ? <p className="text-sm text-crit">{error}</p> : null}
          <Button type="submit" size="lg" className="w-full">
            Submit request
          </Button>
          <p className="text-xs text-subtle">
            Preview stores the request on this device and, if you are signed in, on your account.
            EIN is not verified automatically. Not a commitment until you receive a written award.
          </p>
        </form>
      </section>
    </main>
  );
}
