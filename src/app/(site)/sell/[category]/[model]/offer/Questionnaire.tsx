"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import { type Answers, type Condition, conditionFromAnswers } from "@/lib/pricing";

const FUNCTIONAL_CHECKS = [
  "Screen works and fully lights up",
  "All exterior buttons",
  "Front/back cameras and flash",
  "Speakers and microphones",
  "Charging port",
  "Cellular, Wi-Fi, Bluetooth and GPS",
  "Touchscreen",
  "Face ID / fingerprint sensor",
  "Battery holds a charge",
];

const COSMETIC: { id: Exclude<Condition, "broken">; title: string; body: string }[] = [
  { id: "flawless", title: "Flawless or like new", body: "No scratches, scuffs or signs of use." },
  { id: "good", title: "Lightly used", body: "Minor signs of normal use, light scratches visible only up close." },
  { id: "fair", title: "Scratched or scuffed", body: "Obvious scratches, scuffs or nicks on the screen or body." },
  { id: "poor", title: "Damaged or broken", body: "Bent, chipped, dented or sun-bleached. No cracks." },
];

function YesNo({ value, onChange }: { value: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <div className="mt-3 flex gap-3">
      <button type="button" className="choice min-w-20" data-active={value === true} onClick={() => onChange(true)}>Yes</button>
      <button type="button" className="choice min-w-20" data-active={value === false} onClick={() => onChange(false)}>No</button>
    </div>
  );
}

interface Props {
  variant: string;
  offers: Record<Condition, number>;
  kind: "phone" | "tablet";
  brand: CategoryId;
}

export function Questionnaire({ variant, offers, kind, brand }: Props) {
  const [a, setA] = useState<Partial<Answers>>({});
  const set = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }));
  const condition = conditionFromAnswers(a);
  const offer = condition ? offers[condition] : null;

  const q2Enabled = a.powersOn === true;
  const q3Enabled = q2Enabled && a.functional === true;
  const q4Enabled = q3Enabled && a.noCracks === true;

  const params = new URLSearchParams({
    v: variant,
    p: a.powersOn ? "1" : "0",
    f: a.functional ? "1" : "0",
    n: a.noCracks ? "1" : "0",
    k: a.cosmetic ?? "",
  });

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Let&apos;s determine the condition</h2>

        <div>
          <h3 className="font-semibold">1. Does the device power on?</h3>
          <YesNo value={a.powersOn} onChange={(v) => set({ powersOn: v })} />
        </div>

        <div className={q2Enabled ? "" : "pointer-events-none opacity-40"}>
          <h3 className="font-semibold">2. Is the device fully functional and does the whole screen light up correctly?</h3>
          <p className="mt-2 text-sm text-muted">Yes, if all of these work correctly:</p>
          <ul className="mt-2 grid gap-1 text-sm text-muted sm:grid-cols-2">
            {FUNCTIONAL_CHECKS.filter((c) => kind === "phone" || !c.startsWith("Cellular")).map((c) => (
              <li key={c} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cash" /> {c}
              </li>
            ))}
          </ul>
          <YesNo value={a.functional} onChange={(v) => set({ functional: v })} />
        </div>

        <div className={q3Enabled ? "" : "pointer-events-none opacity-40"}>
          <h3 className="font-semibold">3. Are the front and back free of cracks?</h3>
          <YesNo value={a.noCracks} onChange={(v) => set({ noCracks: v })} />
        </div>

        <div className={q4Enabled ? "" : "pointer-events-none opacity-40"}>
          <h3 className="font-semibold">4. What&apos;s the overall cosmetic condition?</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {COSMETIC.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set({ cosmetic: c.id })}
                data-active={a.cosmetic === c.id}
                className="rounded-xl border-[1.5px] border-line p-4 text-left transition hover:border-brand data-[active=true]:border-brand data-[active=true]:bg-brand-soft"
              >
                <span className="block font-semibold">{c.title}</span>
                <span className="mt-1 block text-sm text-muted">{c.body}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-line bg-paper p-6 lg:sticky lg:top-32">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">Your PrimeTeq offer</p>
        <p className={`mt-2 text-5xl font-extrabold ${offer ? "text-cash" : "text-muted/50"}`}>
          {offer ? `$${offer.toLocaleString("en-US")}` : "$---"}
        </p>
        {condition === "broken" && <p className="mt-2 text-sm text-muted">Offer for a device that is not fully working or has cracks.</p>}
        <p className="mt-4 text-sm text-muted">
          If your device is in better condition than you described, we&apos;ll increase your offer.
        </p>
        {offer ? (
          <Link href={`/checkout?${params}`} className="btn btn-primary mt-6 w-full">Get paid</Link>
        ) : (
          <button className="btn btn-primary mt-6 w-full" disabled>Get paid</button>
        )}
        <p className="mt-4 flex items-start gap-2 text-xs text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-cash" />
          Offer locked for 30 days. We don&apos;t buy devices reported lost or stolen{brand === "iphone" || brand === "ipad" ? " or with Activation Lock on" : ""}.
        </p>
      </aside>
    </div>
  );
}
