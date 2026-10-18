"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { type CheckoutState, createOrder } from "./actions";

const PAYOUTS = [
  { id: "paypal", label: "PayPal", hint: "PayPal account email", note: "The email address you use to sign in to PayPal." },
  { id: "zelle", label: "Zelle", hint: "Zelle email or U.S. mobile number", note: "The email or mobile number enrolled in Zelle with your bank." },
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
  // React resets the form after each submit; defaultValue brings back what was typed when there's an error.
  const v = (k: string) => state.values?.[k] ?? "";

  return (
    <form action={action} className="mt-8 space-y-8">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <Section letter="A" title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" name="name" defaultValue={v("name")} className="field" autoComplete="name" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone <span className="font-normal text-muted">(optional)</span></label>
            <input id="phone" name="phone" defaultValue={v("phone")} className="field" autoComplete="tel" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" defaultValue={v("email")} type="email" className="field" autoComplete="email" required />
          <p className="mt-1.5 text-sm text-muted">We’ll send next steps and order updates here.</p>
        </div>
      </Section>

      <Section letter="B" title="Payment details">
        <p className="-mt-1 text-sm text-muted">Choose how you want to receive your payment. We send it as soon as your device is approved.</p>
        <input type="hidden" name="payoutMethod" value={payout} />
        <div className="grid max-w-md gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
          {PAYOUTS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={payout === p.id} data-selected={payout === p.id} className="option" onClick={() => setPayout(p.id)}>
              <span className="option-dot" aria-hidden />
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="payoutHandle">{current.hint}</label>
            <input id="payoutHandle" name="payoutHandle" defaultValue={v("payoutHandle")} className="field" autoComplete={payout === "paypal" ? "email" : "off"} required />
            <p className="mt-1.5 text-sm text-muted">{current.note}</p>
          </div>
          <div>
            <label className="label" htmlFor="payoutHandleConfirm">Confirm {payout === "paypal" ? "PayPal email" : "Zelle email or number"}</label>
            <input id="payoutHandleConfirm" name="payoutHandleConfirm" defaultValue={v("payoutHandleConfirm")} className="field" autoComplete="off" required />
          </div>
          {payout === "zelle" && (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="payoutName">Full name on your Zelle account</label>
              <input id="payoutName" name="payoutName" defaultValue={v("payoutName")} className="field" autoComplete="name" required />
              <p className="mt-1.5 text-sm text-muted">As it appears on your bank account, so the payment reaches the right person.</p>
            </div>
          )}
        </div>
      </Section>

      <Section letter="C" title="Address for shipping instructions">
        <p className="-mt-1 text-sm text-muted">
          The address you’ll ship your device from. We use it to create your prepaid shipping label, which we email to you with the instructions.
        </p>
        <div>
          <label className="label" htmlFor="line1">Street address</label>
          <input id="line1" name="line1" defaultValue={v("line1")} className="field" autoComplete="address-line1" required />
        </div>
        <div>
          <label className="label" htmlFor="line2">Apt, suite <span className="font-normal text-muted">(optional)</span></label>
          <input id="line2" name="line2" defaultValue={v("line2")} className="field" autoComplete="address-line2" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-[1fr_110px_150px]">
          <div className="col-span-2 sm:col-span-1">
            <label className="label" htmlFor="city">City</label>
            <input id="city" name="city" defaultValue={v("city")} className="field" autoComplete="address-level2" required />
          </div>
          <div>
            <label className="label" htmlFor="state">State</label>
            <input id="state" name="state" defaultValue={v("state")} className="field uppercase" maxLength={2} autoComplete="address-level1" required />
          </div>
          <div>
            <label className="label" htmlFor="zip">ZIP</label>
            <input id="zip" name="zip" defaultValue={v("zip")} className="field" inputMode="numeric" autoComplete="postal-code" required />
          </div>
        </div>
      </Section>

      <label className="flex items-start gap-3 rounded-2xl border border-line p-4 text-sm">
        <input type="checkbox" name="terms" defaultChecked={v("terms") === "on"} className="mt-0.5 h-5 w-5 shrink-0 accent-brand" required />
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
