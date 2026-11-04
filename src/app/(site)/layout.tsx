import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { I18nProvider } from "@/i18n/client";
import { dictFor, getLang } from "@/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <I18nProvider lang={lang} dict={dictFor(lang)}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </I18nProvider>
  );
}
