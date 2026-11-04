import Link from "next/link";
import type { CategoryId } from "@/data/catalog";
import type { Dict } from "@/i18n/en";
import { fmt } from "@/i18n/config";
import { rich } from "@/i18n/rich";
import { CONTACT } from "@/lib/contact";
import { DEFAULT_SETTINGS } from "@/lib/pricing";
import { policyFor } from "@/lib/policy";
import type { FaqItem } from "./sections";

const link = "font-semibold text-brand hover:underline";

/** FAQ content shared by the home page and each category page. */
export function sellFaqs(t: Dict, category: CategoryId | null, offerValidDays = DEFAULT_SETTINGS.offerValidDays): FaqItem[] {
  const P = policyFor(t);
  const f = t.faq.items;
  const tip = category ? t.faq.findModel[category] : t.faq.findModel.any;
  const mail = <a href={`mailto:${CONTACT.email}`} className={link}>{CONTACT.email}</a>;
  const [accBefore, accAfter] = f.accountA.split(t.nav.trackOffer);
  return [
    { id: "which-model", q: f.whichModelQ, a: tip },
    { q: f.conditionQ, a: f.conditionA },
    {
      q: f.accountQ,
      a: accAfter === undefined ? f.accountA : (
        <>
          {accBefore}
          <Link href="/track" className={link}>{t.nav.trackOffer}</Link>
          {accAfter}
        </>
      ),
    },
    {
      q: f.afterQ,
      a: fmt(f.afterA, { labelWithin: P.labelWithin, days: offerValidDays, inspection: P.inspectionWithin, payment: P.paymentWithin }),
    },
    {
      q: f.prepareQ,
      a: (
        <>
          {f.prepareA} <Link href="/shipping-payments" className={link}>{t.footer.shipping}</Link>
        </>
      ),
    },
    { q: f.payQ, a: fmt(f.payA, { payment: P.paymentWithin }) },
    { q: f.mismatchQ, a: fmt(f.mismatchA, { days: P.revisedOfferDays }) },
    { q: f.notListedQ, a: rich(f.notListedA, { email: mail }) },
  ];
}
