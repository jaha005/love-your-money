"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useTransition } from "react";
import { copy } from "@/lib/copy";
import { demoAccounts, type DemoRole } from "@/lib/demo";
import { demoSignIn, signIn, type LoginState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? copy.common.loading : copy.auth.submit}
    </button>
  );
}

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction] = useFormState<LoginState, FormData>(signIn, {});
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            {copy.auth.email}
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="password">
            {copy.auth.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
          />
        </div>
        {state.error ? (
          <p role="alert" className="text-small" style={{ color: "var(--danger)" }}>
            {state.error}
          </p>
        ) : null}
        <Submit />
      </form>

      {demoMode ? (
        <div className="mt-8">
          <div className="hairline mb-5" />
          <p className="mb-3 text-small text-muted">{copy.auth.demoLead}</p>
          <div className="space-y-2">
            {(Object.keys(demoAccounts) as DemoRole[]).map((role) => (
              <button
                key={role}
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => void demoSignIn(role))}
                className="btn-secondary w-full"
              >
                {demoAccounts[role].label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
