import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { HashOpener } from "./HashOpener";
import { InstagramIcon } from "./InstagramIcon";
import { ClipboardCheck, ListChecks, PackageOpen, Route, ShieldCheck, Smartphone, Workflow, X } from "lucide-react";

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
    "Lost or stolen devices",
    "Unpaid financing or balance",
    "Find My / account lock turned on",
    "Modified or counterfeit parts",
    "Accessories (cases, chargers, boxes)",
    "Sellers outside the U.S.",
  ];
  return (
    <section id="not-accepted" className="scroll-mt-28 bg-white">
      <div className="container-page pb-12 md:pb-20">
        <div className="grid gap-5 rounded-2xl border border-line bg-paper p-5 md:grid-cols-[260px_1fr] md:gap-8 md:p-7">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">What we don’t accept</h2>
            <p className="mt-1.5 text-sm text-muted">
              Broken or cracked devices are fine — they just get a lower offer.{" "}
              <Link href="/terms#s2" className="font-semibold text-brand hover:underline">Details</Link>
            </p>
          </div>
          <ul className="grid gap-x-6 gap-y-2.5 text-[15px] text-ink-2 sm:grid-cols-2">
            {items.map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <X className="h-4 w-4 shrink-0 text-muted" strokeWidth={2.25} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
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
