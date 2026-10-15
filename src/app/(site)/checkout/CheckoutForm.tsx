"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { type CheckoutState, createOrder } from "./actions";

const PAYOUTS = [
  { id: "paypal", label: "PayPal", hint: "PayPal email" },
  { id: "zelle", label: "Zelle", hint: "Zelle email or phone" },
  { id: "check", label: "Check by mail", hint: "" },
] as const;

function Section({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-8 first:border-t-0 first:pt-0">
      <legend className="font-display float-left w-full text-lg font-bold">
        <span className="mr-2 text-brand">{letter}.</span>
        {title}
      </legend>
      <div className="clear-both space-y-4 pt-4">{children}</div>
    </fieldset>
  );
}

export function CheckoutForm({ hidden }: { hidden: Record<string, string> }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createOrder, {});
  const [payout, setPayout] = useState<(typeof PAYOUTS)[number]["id"]>("paypal");
  const current = PAYOUTS.find((p) => p.id === payout)!;

  return (
    <form action={action} className="mt-8 space-y-8">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <Section letter="A" title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" className="field" autoComplete="name" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone <span className="font-normal text-muted">(optional)</span></label>
            <input id="phone" name="phone" className="field" autoComplete="tel" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" required />
          <p className="mt-1.5 text-sm text-muted">We’ll send next steps and order updates here.</p>
        </div>
      </Section>

      <Section letter="B" title="How would you like to be paid?">
        <input type="hidden" name="payoutMethod" value={payout} />
        <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Payment method">
          {PAYOUTS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={payout === p.id} data-selected={payout === p.id} className="option" onClick={() => setPayout(p.id)}>
              <span className="option-dot" aria-hidden />
              {p.label}
            </button>
          ))}
        </div>
        {payout !== "check" ? (
          <div className="max-w-md">
            <label className="label" htmlFor="payoutHandle">{current.hint}</label>
            <input id="payoutHandle" name="payoutHandle" className="field" required />
          </div>
        ) : (
          <p className="text-sm text-muted">The check will be mailed to the address below.</p>
        )}
      </Section>

      <Section letter="C" title="Your address">
        <p className="-mt-1 text-sm text-muted">Where you’ll ship your device from{payout === "check" ? " and where we’ll mail your check" : ""}.</p>
        <div>
          <label className="label" htmlFor="line1">Street address</label>
          <input id="line1" name="line1" className="field" autoComplete="address-line1" required />
        </div>
        <div>
          <label className="label" htmlFor="line2">Apt, suite <span className="font-normal text-muted">(optional)</span></label>
          <input id="line2" name="line2" className="field" autoComplete="address-line2" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-[1fr_110px_150px]">
          <div className="col-span-2 sm:col-span-1">
            <label className="label" htmlFor="city">City</label>
            <input id="city" name="city" className="field" autoComplete="address-level2" required />
          </div>
          <div>
            <label className="label" htmlFor="state">State</label>
            <input id="state" name="state" className="field uppercase" maxLength={2} autoComplete="address-level1" required />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP</label>
            <input id="zip" name="zip" className="field" inputMode="numeric" autoComplete="postal-code" required />
          </div>
        </div>
      </Section>

      <label className="flex items-start gap-3 rounded-2xl border border-line p-4 text-sm">
        <input type="checkbox" name="terms" className="mt-0.5 h-5 w-5 shrink-0 accent-brand" required />
        <span>
          I confirm this device is mine to sell and I accept the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-brand hover:underline">terms</Link>.
        </span>
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full px-8 sm:w-auto" disabled={pending}>
        {pending ? "Submitting…" : "Accept offer"}
      </button>
    </form>
  );
}
