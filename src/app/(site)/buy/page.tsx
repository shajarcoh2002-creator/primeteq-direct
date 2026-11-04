import { ComingSoon } from "@/components/ComingSoon";
import { getDict } from "@/i18n/server";

export async function generateMetadata() {
  return { title: (await getDict()).meta.buy };
}

export default async function BuyPage() {
  const t = await getDict();
  return (
    <ComingSoon
      title={
        <>
          {t.soon.titleA} <span className="text-brand">{t.soon.titleB}</span>.
        </>
      }
      body={t.soon.body}
    />
  );
}
