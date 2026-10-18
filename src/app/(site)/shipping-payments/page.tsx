import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { getSettings } from "@/lib/db";
import { POLICY as P } from "@/lib/policy";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shipping & Payments" };

export default async function ShippingPaymentsPage() {
  const days = (await getSettings()).offerValidDays;
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;

  return (
    <LegalPage
      eyebrow="Help"
      title="Shipping & Payments"
      intro={
        <p>
          Shipping your device to {P.company} is free, and you get paid by {P.payoutMethods} once we approve it. Here’s exactly how it works.
        </p>
      }
      sections={[
        {
          title: "Your free shipping label",
          body: (
            <p>
              After you accept your offer, we email a prepaid shipping label and instructions to the email address you gave us, within{" "}
              {P.labelWithin}. The label is created with the address you entered at checkout, so make sure it’s the address you’ll ship from.
            </p>
          ),
        },
        {
          title: "How to pack your device",
          body: (
            <ul>
              <li>Back up your data, sign out of all accounts, turn off Find My or device protection, and factory reset the device.</li>
              <li>Remove the SIM card.</li>
              <li>Wrap the device in bubble wrap or soft padding and place it in a small, sturdy box so it can’t move around.</li>
              <li>Send only the device — no cases, chargers, cables or boxes. Accessories are not returned.</li>
              <li>Attach the prepaid label and drop the package off with the carrier shown on the label.</li>
            </ul>
          ),
        },
        {
          title: "When to ship",
          body: (
            <p>
              Your offer is valid for {days} days after you accept it, and your device must reach us within that time. Shipping soon after you get
              your label is the best way to keep your offer. You can follow your order any time on{" "}
              <Link href="/track" className="font-semibold text-brand hover:underline">Track Offer</Link>.
            </p>
          ),
        },
        {
          title: "Inspection",
          body: (
            <p>
              We inspect your device within {P.inspectionWithin} of receiving it. If it matches your description, it’s approved. If it doesn’t, we email
              you a revised offer that you can accept or decline within {P.revisedOfferDays} days. If you decline, we ship your device back for free.
            </p>
          ),
        },
        {
          title: "Getting paid",
          body: (
            <>
              <p>We send your payment within {P.paymentWithin} of approving your device, using the method you chose at checkout:</p>
              <ul>
                <li><strong>PayPal:</strong> sent to your PayPal account email.</li>
                <li><strong>Zelle:</strong> sent to the email or U.S. mobile number enrolled in Zelle, under the name on that account.</li>
              </ul>
              <p>
                Please double-check your payment details at checkout — we can’t recover payments sent to details entered incorrectly. To change your
                payment details before you’re paid, email {mail} with your order number.
              </p>
            </>
          ),
        },
        {
          title: "Questions",
          body: <p>Need help with shipping or payment? Email {mail} with your order number.</p>,
        },
      ]}
    />
  );
}
