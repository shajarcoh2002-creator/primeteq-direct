"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANGS, type Lang } from "@/i18n/config";
import { setLang } from "@/i18n/actions";
import { useI18n } from "@/i18n/client";

const LABEL: Record<Lang, string> = { es: "ES", en: "EN" };
const NAME: Record<Lang, string> = { es: "Español", en: "English" };

/** ES | EN switch. Stores the choice in a cookie for a year and re-renders the page. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [pending, start] = useTransition();

  function choose(next: Lang) {
    if (next === lang) return;
    start(async () => {
      await setLang(next);
      router.refresh();
    });
  }

  return (
    <div role="group" aria-label={t.nav.language} className={`inline-flex items-center rounded-full border border-line bg-white p-0.5 text-[11px] font-bold ${pending ? "opacity-60" : ""} ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          aria-pressed={l === lang}
          title={NAME[l]}
          lang={l}
          className={`rounded-full px-2.5 py-1 tracking-[0.06em] transition ${l === lang ? "bg-ink text-white" : "text-ink-2 hover:text-brand"}`}
        >
          {LABEL[l]}
        </button>
      ))}
    </div>
  );
}
