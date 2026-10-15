import Link from "next/link";
import { BadgeDollarSign, Leaf, PackageCheck, ShieldCheck, Smartphone, Timer, Truck } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";
import { DeviceArt } from "@/components/DeviceArt";

const STEPS = [
  { icon: Smartphone, title: "Get an offer", body: "Answer a few quick questions about your device. It takes 2 minutes." },
  { icon: Truck, title: "Ship it free", body: "We email you a prepaid shipping label. Pack it up and drop it off." },
  { icon: BadgeDollarSign, title: "Get paid fast", body: "Once we confirm it matches your description, we pay you by PayPal, Zelle or check." },
];

const FAQ = [
  {
    q: "How do you determine my offer?",
    a: "Your offer is based on the model, storage, carrier and condition of your device, and on current resale values. Offers are updated as the market changes, but once you accept an offer it is locked for 30 days.",
  },
  {
    q: "What if my device is in better or worse condition than I said?",
    a: "If it's in better condition, we raise your offer. If it doesn't match what you described, we send you a revised offer — you can accept it or we'll return your device for free.",
  },
  {
    q: "How do I prepare my device?",
    a: "Back up your data, sign out of iCloud or your Google/Samsung account, turn off Find My / device protection, factory reset it and remove the SIM card. Don't send cases, chargers or boxes.",
  },
  {
    q: "How long does payment take?",
    a: "We inspect devices within 2 business days of arrival. Payment is sent as soon as your device is approved.",
  },
  {
    q: "Do you buy stolen, financed or blacklisted devices?",
    a: "No. Devices reported lost or stolen, with unpaid financing, or with an activation lock are not eligible.",
  },
];

export default function Home() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-page py-14 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/60">Instant offer · Free shipping · Fast pay</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Sell your device in minutes</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">Get a guaranteed cash offer for your phone or tablet. No listings, no buyers to deal with.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/sell/${c.id}`}
                className="group flex flex-col items-center rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <DeviceArt category={c.id} className="h-24 transition group-hover:-translate-y-1" />
                <span className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold">Sell {c.shortName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container-page scroll-mt-28 py-16">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-muted">
          Send us the same device (model, carrier and condition) and we&apos;ll pay you the amount in your offer.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-line p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-bold text-muted">Step {i + 1}</span>
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-page grid gap-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, t: "Price promise", b: "Your offer is locked for 30 days." },
            { icon: PackageCheck, t: "Better condition? More cash", b: "We raise your offer if your device is in better shape." },
            { icon: Timer, t: "Fast inspection", b: "Devices are inspected within 2 business days." },
            { icon: Leaf, t: "Reuse first", b: "We give devices a second life and recycle responsibly." },
          ].map((f) => (
            <div key={f.t} className="flex gap-3">
              <f.icon className="mt-0.5 h-6 w-6 shrink-0 text-cash" />
              <div>
                <h3 className="font-bold">{f.t}</h3>
                <p className="text-sm text-muted">{f.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="container-page scroll-mt-28 py-16">
        <h2 className="text-center text-3xl font-bold">Frequently asked questions</h2>
        <div className="mx-auto mt-8 max-w-3xl divide-y divide-line rounded-2xl border border-line">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                {f.q}
                <span className="ml-4 text-xl text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
