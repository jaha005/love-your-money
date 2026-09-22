import { brand } from "@/lib/brand";
import { copy } from "@/lib/copy";
import { DEMO_MODE } from "@/lib/demo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-6 py-16">
      <p className="eyebrow">{brand.cohortName}</p>
      <h1 className="mt-3 font-display text-h1">{brand.logoText}</h1>
      <p className="mt-2 text-body text-muted">{brand.tagline}</p>

      <div className="hairline my-8" />

      {configured ? (
        <>
          <h2 className="mb-1 font-display text-h3">{copy.auth.title}</h2>
          <p className="mb-6 text-small text-muted">{copy.auth.lead}</p>
          <LoginForm demoMode={DEMO_MODE} />
        </>
      ) : (
        <p className="text-small text-muted">{copy.auth.notConfigured}</p>
      )}
    </main>
  );
}
