import Link from "next/link";
import { FIND_MODEL_TIP, type CategoryId } from "@/data/catalog";
import { CONTACT } from "@/lib/contact";
import { DEFAULT_SETTINGS } from "@/lib/pricing";
import { POLICY as P } from "@/lib/policy";
import type { FaqItem } from "./sections";

const link = "font-semibold text-brand hover:underline";

/** FAQ content shared by the home page and each category page. */
export function sellFaqs(category: CategoryId | null, offerValidDays = DEFAULT_SETTINGS.offerValidDays): FaqItem[] {
  const tip = category ? FIND_MODEL_TIP[category] : `${FIND_MODEL_TIP.iphone} On Android phones, open Settings → About phone.`;
  const mail = <a href={`mailto:${CONTACT.email}`} className={link}>{CONTACT.email}</a>;
  return [
    { id: "which-model", q: "How do I find which model I have?", a: tip },
    {
      q: "How do I describe my device’s condition?",
      a: "You’ll answer four short questions: whether it powers on, whether everything works, whether the front and back are free of cracks, and its overall cosmetic condition. Choose the option that best matches your device today.",
    },
    {
      q: "Do I need an account to sell?",
      a: (
        <>
          No. You only need an email address. We send your order number, shipping label and updates there, and you can follow your order any time on{" "}
          <Link href="/track" className={link}>Track Offer</Link> with your order number and email.
        </>
      ),
    },
    {
      q: "What happens after I accept my offer?",
      a: (
        <>
          We email you a free prepaid shipping label and instructions within {P.labelWithin}. Ship your device within {offerValidDays} days. When it
          arrives, we inspect it within {P.inspectionWithin} and, once it’s approved, send your payment by {P.payoutMethods} within {P.paymentWithin}.
        </>
      ),
    },
    {
      q: "How should I prepare my device before sending it?",
      a: (
        <>
          Back up your data, sign out of your Apple, Google or Samsung account, turn off Find My or device protection, factory reset the device and remove
          the SIM card. Send only the device — no case, charger or box. See <Link href="/shipping-payments" className={link}>Shipping &amp; Payments</Link>{" "}
          for packing tips.
        </>
      ),
    },
    {
      q: "How do I get paid?",
      a: (
        <>
          By PayPal or Zelle — you choose at checkout. For PayPal we need your PayPal email; for Zelle, the email or U.S. mobile number enrolled in Zelle
          and the name on that account. Payment is sent within {P.paymentWithin} of approving your device.
        </>
      ),
    },
    {
      q: "What if my device doesn’t match what I described?",
      a: `If it’s in better condition, we may raise your offer. If it doesn’t match, we email you a revised offer you can accept or decline within ${P.revisedOfferDays} days. If you decline, we send your device back for free.`,
    },
    {
      q: "My model isn’t listed. What can I do?",
      a: (
        <>
          Email {mail} with the model, storage, carrier and condition. If it’s a device we can buy, we’ll reply with an offer.
        </>
      ),
    },
  ];
}
