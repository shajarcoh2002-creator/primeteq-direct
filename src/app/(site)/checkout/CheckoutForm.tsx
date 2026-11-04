"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { MapPin } from "lucide-react";
import { useI18n } from "@/i18n/client";
import type { Country } from "@/lib/db";
import type { DropoffLocation } from "@/lib/locations";
import { type CheckoutState, createOrder } from "./actions";

const PAYOUTS: Record<Country, ("paypal" | "zelle" | "yappy" | "ach")[]> = { PA: ["yappy", "ach"], US: ["paypal", "zelle"] };
const COUNTRIES: { id: Country; flag: string }[] = [
  { id: "PA", flag: "🇵🇦" },
  { id: "US", flag: "🇺🇸" },
];

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

export function CheckoutForm({
  hidden,
  locations,
  banks,
}: {
  hidden: Record<string, string>;
  locations: (DropoffLocation & { maps: string })[];
  banks: string[];
}) {
  const { t, lang } = useI18n();
  const c = t.checkout;
  const [state, action, pending] = useActionState<CheckoutState, FormData>(createOrder, {});
  // React resets the form after each submit; defaultValue brings back what was typed when there's an error.
  const v = (k: string) => state.values?.[k] ?? "";
  const [country, setCountry] = useState<Country>((state.values?.country as Country) || (lang === "es" ? "PA" : "US"));
  const [payout, setPayout] = useState(state.values?.payoutMethod || PAYOUTS[country][0]);
  const [bank, setBank] = useState(v("achBank"));
  const method = PAYOUTS[country].includes(payout as never) ? (payout as (typeof PAYOUTS)[Country][number]) : PAYOUTS[country][0];
  const current = c.payouts[method];

  const chooseCountry = (next: Country) => {
    setCountry(next);
    setPayout(PAYOUTS[next][0]);
  };

  return (
    <form action={action} className="mt-8 space-y-8">
      {Object.entries(hidden).map(([k, val]) => (
        <input key={k} type="hidden" name={k} value={val} />
      ))}
      <input type="hidden" name="country" value={country} />

      <Section letter="A" title={c.country}>
        <div className="grid max-w-md grid-cols-2 gap-3" role="radiogroup" aria-label={c.country}>
          {COUNTRIES.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={country === o.id}
              data-selected={country === o.id}
              className="option"
              onClick={() => chooseCountry(o.id)}
            >
              <span className="option-dot" aria-hidden />
              <span aria-hidden>{o.flag}</span> {c.countries[o.id]}
            </button>
          ))}
        </div>
      </Section>

      <Section letter="B" title={c.contact}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="name">{c.fullName}</label>
            <input id="name" name="name" defaultValue={v("name")} className="field" autoComplete="name" required />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              {country === "PA" ? c.phoneWhatsapp : c.phone}{" "}
              {country === "US" && <span className="font-normal text-muted">{c.optional}</span>}
            </label>
            <input id="phone" name="phone" defaultValue={v("phone")} className="field" type="tel" autoComplete="tel" required={country === "PA"} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">{c.email}</label>
          <input id="email" name="email" defaultValue={v("email")} type="email" className="field" autoComplete="email" required />
          <p className="mt-1.5 text-sm text-muted">{c.emailHelp}</p>
        </div>
      </Section>

      <Section letter="C" title={c.payment}>
        <p className="-mt-1 text-sm text-muted">{c.paymentLead}</p>
        <input type="hidden" name="payoutMethod" value={method} />
        <div className="grid max-w-md gap-3 sm:grid-cols-2" role="radiogroup" aria-label={c.payment}>
          {PAYOUTS[country].map((id) => (
            <button key={id} type="button" role="radio" aria-checked={method === id} data-selected={method === id} className="option" onClick={() => setPayout(id)}>
              <span className="option-dot" aria-hidden />
              {c.payouts[id].label}
            </button>
          ))}
        </div>

        {method === "ach" && (
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="achBank">{c.achBank}</label>
              <select id="achBank" name="achBank" value={bank} onChange={(e) => setBank(e.target.value)} className="field" required>
                <option value="" disabled>{c.achBankPlaceholder}</option>
                {banks.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
                <option value="other">{c.achBankOther}</option>
              </select>
            </div>
            <div>
              <span className="label">{c.achType}</span>
              <div className="grid grid-cols-2 gap-2">
                {(["savings", "checking"] as const).map((k) => (
                  <label key={k} className="option cursor-pointer has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                    <input type="radio" name="achType" value={k} defaultChecked={v("achType") === k} className="accent-brand" required />
                    {c.achTypes[k]}
                  </label>
                ))}
              </div>
            </div>
            {bank === "other" && (
              <div className="sm:col-span-2">
                <label className="label" htmlFor="achBankOther">{c.achBankOther}</label>
                <input id="achBankOther" name="achBankOther" defaultValue={v("achBankOther")} className="field" required />
              </div>
            )}
          </div>
        )}

        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="payoutHandle">{current.hint}</label>
            <input
              key={`h-${method}`}
              id="payoutHandle"
              name="payoutHandle"
              defaultValue={v("payoutMethod") === method ? v("payoutHandle") : ""}
              className="field"
              inputMode={method === "yappy" || method === "ach" ? "numeric" : undefined}
              autoComplete={method === "paypal" ? "email" : "off"}
              required
            />
            <p className="mt-1.5 text-sm text-muted">{current.note}</p>
          </div>
          <div>
            <label className="label" htmlFor="payoutHandleConfirm">{current.confirm}</label>
            <input
              key={`c-${method}`}
              id="payoutHandleConfirm"
              name="payoutHandleConfirm"
              defaultValue={v("payoutMethod") === method ? v("payoutHandleConfirm") : ""}
              className="field"
              inputMode={method === "yappy" || method === "ach" ? "numeric" : undefined}
              autoComplete="off"
              required
            />
          </div>
          {method !== "paypal" && (
            <div className="sm:col-span-2">
              <label className="label" htmlFor="payoutName">
                {method === "zelle" ? c.zelleName : method === "yappy" ? c.yappyName : c.achHolder}
              </label>
              <input key={`n-${method}`} id="payoutName" name="payoutName" defaultValue={v("payoutName")} className="field" autoComplete="name" required />
              {method === "zelle" && <p className="mt-1.5 text-sm text-muted">{c.zelleNameHelp}</p>}
            </div>
          )}
        </div>
      </Section>

      {country === "US" ? (
        <Section letter="D" title={c.shipTitle}>
          <p className="-mt-1 text-sm text-muted">{c.shipLead}</p>
          <div>
            <label className="label" htmlFor="line1">{c.street}</label>
            <input id="line1" name="line1" defaultValue={v("line1")} className="field" autoComplete="address-line1" required />
          </div>
          <div>
            <label className="label" htmlFor="line2">{c.apt} <span className="font-normal text-muted">{c.optional}</span></label>
            <input id="line2" name="line2" defaultValue={v("line2")} className="field" autoComplete="address-line2" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-[1fr_110px_150px]">
            <div className="col-span-2 sm:col-span-1">
              <label className="label" htmlFor="city">{c.city}</label>
              <input id="city" name="city" defaultValue={v("city")} className="field" autoComplete="address-level2" required />
            </div>
            <div>
              <label className="label" htmlFor="state">{c.state}</label>
              <input id="state" name="state" defaultValue={v("state")} className="field uppercase" maxLength={2} autoComplete="address-level1" required />
            </div>
            <div>
              <label className="label" htmlFor="zip">{c.zip}</label>
              <input id="zip" name="zip" defaultValue={v("zip")} className="field" inputMode="numeric" autoComplete="postal-code" required />
            </div>
          </div>
        </Section>
      ) : (
        <Section letter="D" title={c.dropoffTitle}>
          <p className="-mt-1 text-sm text-muted">{c.dropoffLead}</p>
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={c.dropoffTitle}>
            {locations.map((l) => (
              <label
                key={l.id}
                className="option cursor-pointer !items-start !py-4 has-[:checked]:border-brand has-[:checked]:bg-brand-soft"
              >
                <input type="radio" name="dropoff" value={l.id} defaultChecked={v("dropoff") === l.id} className="mt-1 accent-brand" required />
                <span className="min-w-0">
                  <span className="block">{l.name}</span>
                  <span className="mt-0.5 block text-sm font-normal text-muted">
                    {l.address[lang] !== l.name && <>{l.address[lang]} · </>}
                    {l.area}
                  </span>
                  {l.hours && <span className="mt-0.5 block text-xs font-normal text-muted">{l.hours[lang]}</span>}
                  <a
                    href={l.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPin className="h-3.5 w-3.5" /> Google Maps
                  </a>
                </span>
              </label>
            ))}
          </div>
        </Section>
      )}

      <label className="flex items-start gap-3 rounded-2xl border border-line p-4 text-sm">
        <input type="checkbox" name="terms" defaultChecked={v("terms") === "on"} className="mt-0.5 h-5 w-5 shrink-0 accent-brand" required />
        <span>
          {c.terms}{" "}
          <Link href="/terms" target="_blank" className="font-semibold text-brand hover:underline">{c.termsLink}</Link>.
        </span>
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full px-8 sm:w-auto" disabled={pending}>
        {pending ? c.submitting : c.submit}
      </button>
    </form>
  );
}
