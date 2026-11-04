import { CONTACT } from "@/lib/contact";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/server";

export interface LegalSection {
  title: string;
  body: React.ReactNode;
}

/** Shared layout for Terms, Privacy and Shipping & Payments. */
export async function LegalPage({ eyebrow, title, intro, sections }: { eyebrow?: string; title: string; intro: React.ReactNode; sections: LegalSection[] }) {
  const t = await getDict();
  return (
    <section className="bg-paper">
      <div className="container-page py-10 md:py-16">
        <article className="card mx-auto max-w-3xl p-6 md:p-10">
          <p className="eyebrow">{eyebrow ?? t.legal.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{fmt(t.legal.effective, { date: t.policy.effectiveDate })}</p>
          <div className="mt-6 text-[15px] leading-relaxed text-ink-2">{intro}</div>

          <nav aria-label={t.legal.sections} className="mt-8 rounded-2xl bg-paper p-5">
            <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s${i + 1}`} className="text-ink-2 hover:text-brand">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-9">
            {sections.map((s, i) => (
              <section key={s.title} id={`s${i + 1}`} className="scroll-mt-28">
                <h2 className="font-display text-xl font-bold text-ink">
                  {i + 1}. {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-2 [&_li]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5">{s.body}</div>
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
            {t.legal.questions}{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">
              {CONTACT.email}
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  );
}
