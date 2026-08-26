import { createFileRoute } from "@tanstack/react-router";
import { BrandLogo } from "@/components/brand-logo";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Sign in — rankER" },
      { name: "description", content: "Sign in to save audits, subscribe, and manage orders." },
    ],
  }),
});

function Login() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <div className="flex items-center gap-2.5">
        <BrandLogo />
        <Wordmark />
      </div>
      <h1 className="mt-8 font-display text-3xl">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Save analyses, subscribe, and retrieve orders on this account.
      </p>
      {authEnabled ? (
        <div className="mt-8 space-y-3">
          {GROK_PROVIDERS.map((p) => (
            <Button
              key={p.providerId}
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => signIn(p.providerId, { callbackURL: "/" })}
            >
              Continue with {p.label}
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled in this environment.</p>
      )}
    </main>
  );
}
