import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { HashOpener } from "./HashOpener";
import { InstagramIcon } from "./InstagramIcon";
import { Ban, ClipboardCheck, CreditCard, Globe, ListChecks, Lock, PackageOpen, Route, ShieldAlert, ShieldCheck, Smartphone, Workflow, Wrench } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { icon: Smartphone, title: "Select your device", body: "Choose the brand, model, storage and carrier of the device you want to sell." },
    { icon: ClipboardCheck, title: "Review your offer", body: "Answer a few questions about its condition and see your offer as you go." },
    { icon: PackageOpen, title: "Follow the instructions", body: "Accept your offer and we’ll send the next steps to prepare and send your device." },
    { icon: Workflow, title: "Complete your trade", body: "Once your device is checked, we finalize your trade with the payment method you chose." },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-28 bg-white">
      <div className="container-page py-12 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Four steps, start to finish.</h2>
        </div>
        <ol className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 sm:block">
              <div className="flex shrink-0 items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-white text-brand">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="font-display hidden text-sm font-bold text-muted sm:inline">0{i + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold sm:mt-5">
                  <span className="mr-1.5 text-muted sm:hidden">{i + 1}.</span>
                  {s.title}
                </h3>
                <p className="mt-1 text-[15px] text-muted sm:mt-2">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-muted sm:mt-10">
          Shipping is free and you’re paid by PayPal or Zelle.{" "}
          <Link href="/shipping-payments" className="font-semibold text-brand hover:underline">Shipping &amp; Payments details</Link>
        </p>
      </div>
    </section>
  );
}

/** Eligibility, in plain words — mirrors the “Eligible devices” section of the Terms. */
export function NotAccepted() {
  const items = [
    { icon: ShieldAlert, title: "Lost or stolen devices", body: "Devices reported lost or stolen, or blacklisted by a carrier." },
    { icon: CreditCard, title: "Unpaid financing", body: "Devices with a remaining balance or payment plan with a carrier or store." },
    { icon: Lock, title: "Locked devices", body: "Find My, Google or Samsung account protection still turned on." },
    { icon: Wrench, title: "Modified or fake parts", body: "Devices altered from factory specs or with counterfeit parts." },
    { icon: Ban, title: "Accessories", body: "Cases, chargers, cables and boxes — we don’t buy them or send them back." },
    { icon: Globe, title: "Outside the U.S.", body: "For now we only buy from sellers shipping from the United States." },
  ];
  return (
    <section id="not-accepted" className="scroll-mt-28 bg-white">
      <div className="container-page py-12 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Before you sell</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">What we don’t accept.</h2>
          <p className="mt-3 text-muted">Check this list first so your trade goes smoothly.</p>
        </div>
        <ul className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.title} className="flex gap-4 rounded-2xl border border-line p-4 md:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-danger-soft text-danger">
                <it.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-bold">{it.title}</h3>
                <p className="mt-1 text-sm text-muted">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-muted">
          Broken, cracked or not-working devices are fine — they just get a lower offer. Full details in our{" "}
          <Link href="/terms#s2" className="font-semibold text-brand hover:underline">Terms of Service</Link>.
        </p>
      </div>
    </section>
  );
}

export function TrustGrid() {
  const items = [
    { icon: ListChecks, title: "Clear steps", body: "One question at a time, with your progress always visible." },
    { icon: Route, title: "Straightforward process", body: "From model to offer in a single, guided flow — no listings to create." },
    { icon: ShieldCheck, title: "Trade with confidence", body: "Your offer, your device details and your order status, all in one place." },
  ];
  return (
    <section className="bg-paper">
      <div className="container-page py-12 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">Why Prime Teq</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Selling tech, made simple.</h2>
        </div>
        <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="card p-5 sm:p-6">
              <it.icon className="h-6 w-6 text-brand" strokeWidth={1.75} />
              <h3 className="mt-3 text-lg font-bold sm:mt-5">{it.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export interface FaqItem {
  id?: string;
  q: string;
  a: React.ReactNode;
}

export function Faq({ items, title = "Questions, answered." }: { items: FaqItem[]; title?: string }) {
  return (
    <section id="faq" className="scroll-mt-28 bg-white">
      <HashOpener />
      <div className="container-page grid gap-8 py-12 md:gap-10 md:py-24 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{title}</h2>
          <p className="mt-4 text-muted">
            Still need help? Email{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a> or message us on{" "}
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
              <InstagramIcon className="h-3.5 w-3.5" /> Instagram
            </a>
            .
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {items.map((f) => (
            <details key={f.q} id={f.id} className="group scroll-mt-32">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-brand transition group-open:rotate-45 group-open:border-brand"
                >
                  +
                </span>
              </summary>
              <div className="pb-6 pr-12 text-[15px] text-muted">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClosingCta({ href, label }: { href: string; label: string }) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-brand/70" />
      <div className="container-page relative flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <h2 className="max-w-xl text-3xl font-extrabold md:text-[40px] md:leading-tight">Your next move starts here.</h2>
        <Link href={href} className="btn btn-on-dark px-7">
          {label}
        </Link>
      </div>
    </section>
  );
}

export const PLACEHOLDER = (text = "Answer to be confirmed by Prime Teq") => <span className="placeholder-note">{text}</span>;
