"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { type CheckoutState, createOrder } from "./actions";

const PAYOUTS = [
  { id: "paypal", label: "PayPal", hint: "PayPal email" },
  { id: "zelle", label: "Zelle", hint: "Zelle email or phone" },
  { id: "check", label: "Check by mail", hint: "" },
] as const;

export function CheckoutForm({ hidden }: { hidden: Record<string, string> }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createOrder, {});
  const [payout, setPayout] = useState<(typeof PAYOUTS)[number]["id"]>("paypal");
  const current = PAYOUTS.find((p) => p.id === payout)!;

  return (
    <form action={action} className="mt-8 space-y-10">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-bold">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name *</label>
            <input id="name" name="name" className="field" autoComplete="name" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" className="field" autoComplete="tel" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" required />
          <p className="mt-1 text-xs text-muted">We&apos;ll send your shipping label and updates here.</p>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-lg font-bold">How do you want to be paid?</legend>
        <input type="hidden" name="payoutMethod" value={payout} />
        <div className="flex flex-wrap gap-3">
          {PAYOUTS.map((p) => (
            <button key={p.id} type="button" className="choice" data-active={payout === p.id} onClick={() => setPayout(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        {payout !== "check" ? (
          <div className="mt-4 max-w-md">
            <label className="label" htmlFor="payoutHandle">{current.hint} *</label>
            <input id="payoutHandle" name="payoutHandle" className="field" required />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">We&apos;ll mail the check to the address below.</p>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-bold">Shipping address</legend>
        <p className="-mt-2 text-sm text-muted">Used for your prepaid shipping label{payout === "check" ? " and your check" : ""}.</p>
        <div>
          <label className="label" htmlFor="line1">Street address *</label>
          <input id="line1" name="line1" className="field" autoComplete="address-line1" required />
        </div>
        <div>
          <label className="label" htmlFor="line2">Apt, suite (optional)</label>
          <input id="line2" name="line2" className="field" autoComplete="address-line2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_100px_140px]">
          <div>
            <label className="label" htmlFor="city">City *</label>
            <input id="city" name="city" className="field" autoComplete="address-level2" required />
          </div>
          <div>
            <label className="label" htmlFor="state">State *</label>
            <input id="state" name="state" className="field uppercase" maxLength={2} autoComplete="address-level1" required />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP *</label>
            <input id="zip" name="zip" className="field" inputMode="numeric" autoComplete="postal-code" required />
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="terms" className="mt-1 h-4 w-4 accent-brand" required />
        <span>
          I own this device, it is not lost, stolen or under unpaid financing, and I accept the{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-brand hover:underline">terms &amp; price promise</Link>.
        </span>
      </label>

      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{state.error}</p>}

      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Submitting…" : "Accept offer & get shipping label"}
      </button>
    </form>
  );
}
