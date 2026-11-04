import Link from "next/link";
import { CONTACT } from "@/lib/contact";
import { HashOpener } from "./HashOpener";
import { InstagramIcon } from "./InstagramIcon";
import { rich } from "@/i18n/rich";
import { getDict } from "@/i18n/server";
import { ClipboardCheck, ListChecks, PackageOpen, Route, ShieldCheck, Smartphone, Workflow, X } from "lucide-react";

export async function HowItWorks() {
  const t = await getDict();
  const icons = [Smartphone, ClipboardCheck, PackageOpen, Workflow];
  const steps = t.how.steps.map((s, i) => ({ ...s, icon: icons[i] }));
  return (
    <section id="how-it-works" className="scroll-mt-28 bg-white">
      <div className="container-page py-12 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.how.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t.how.title}</h2>
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
          {t.how.note}{" "}
          <Link href="/shipping-payments" className="font-semibold text-brand hover:underline">{t.how.noteLink}</Link>
        </p>
      </div>
    </section>
  );
}

/** Eligibility, in plain words — mirrors the “Eligible devices” section of the Terms. */
export async function NotAccepted() {
  const t = await getDict();
  const items = t.notAccepted.items;
  return (
    <section id="not-accepted" className="scroll-mt-28 bg-white">
      <div className="container-page pb-12 md:pb-20">
        <div className="grid gap-5 rounded-2xl border border-line bg-paper p-5 md:grid-cols-[260px_1fr] md:gap-8 md:p-7">
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">{t.notAccepted.title}</h2>
            <p className="mt-1.5 text-sm text-muted">
              {t.notAccepted.lead}{" "}
              <Link href="/terms#s2" className="font-semibold text-brand hover:underline">{t.notAccepted.details}</Link>
            </p>
          </div>
          <ul className="grid gap-x-6 gap-y-2.5 text-[15px] text-ink-2 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <X className="h-4 w-4 shrink-0 text-muted" strokeWidth={2.25} aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function TrustGrid() {
  const t = await getDict();
  const icons = [ListChecks, Route, ShieldCheck];
  const items = t.trust.items.map((it, i) => ({ ...it, icon: icons[i] }));
  return (
    <section className="bg-paper">
      <div className="container-page py-12 md:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">{t.trust.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t.trust.title}</h2>
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

export async function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
  const t = await getDict();
  const [beforeIg] = t.faq.help.split("Instagram");
  return (
    <section id="faq" className="scroll-mt-28 bg-white">
      <HashOpener />
      <div className="container-page grid gap-8 py-12 md:gap-10 md:py-24 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow">{t.faq.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{title ?? t.faq.title}</h2>
          <p className="mt-4 text-muted">
            {rich(beforeIg, {
              email: <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>,
            })}
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

export async function ClosingCta({ href, label }: { href: string; label: string }) {
  const t = await getDict();
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-brand/70" />
      <div className="container-page relative flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <h2 className="max-w-xl text-3xl font-extrabold md:text-[40px] md:leading-tight">{t.cta.title}</h2>
        <Link href={href} className="btn btn-on-dark px-7">
          {label}
        </Link>
      </div>
    </section>
  );
}

export const PLACEHOLDER = (text = "Answer to be confirmed by Prime Teq") => <span className="placeholder-note">{text}</span>;
