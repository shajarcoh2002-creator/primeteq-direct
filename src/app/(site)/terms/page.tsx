import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { getSettings } from "@/lib/db";
import { POLICY as P } from "@/lib/policy";

export const dynamic = "force-dynamic";
export const metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const days = (await getSettings()).offerValidDays;
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={
        <p>
          These terms govern selling a device to {P.company} through {CONTACT.website} (the “Service”). By requesting an offer or completing
          checkout, you agree to these terms. If you don’t agree, please don’t use the Service.
        </p>
      }
      sections={[
        {
          title: "Who can sell",
          body: (
            <>
              <p>To sell a device to {P.company}, you must:</p>
              <ul>
                <li>be at least {P.minAge} years old and able to enter into a binding agreement;</li>
                <li>live in {P.serviceArea} and ship from an address there;</li>
                <li>be the owner of the device, or be authorized by the owner to sell it;</li>
                <li>give us accurate information about yourself, your payment details and your device.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Eligible devices",
          body: (
            <>
              <p>We only buy devices listed on our site. A device is not eligible if it:</p>
              <ul>
                <li>has been reported lost or stolen, or is blacklisted by a carrier;</li>
                <li>still has an unpaid balance or financing with a carrier or retailer;</li>
                <li>has an activation or account lock enabled (such as Find My, Google or Samsung account protection);</li>
                <li>has been modified from its original factory specifications, or contains counterfeit parts.</li>
              </ul>
              <p>We may refuse any device at our discretion. Accessories (cases, chargers, cables, boxes) are not purchased and will not be returned.</p>
            </>
          ),
        },
        {
          title: "Your offer",
          body: (
            <>
              <p>
                Your offer is calculated from the model, storage, carrier and condition you select. It is valid for {days} days from the moment you
                accept it at checkout. Your device must reach us within those {days} days, or the offer expires.
              </p>
              <p>
                Offers are personal and can’t be transferred. If the resale value of your model drops by more than {P.marketDropPct}% during your offer
                period, we may send you an updated offer, which you can accept or decline as described in section 6.
              </p>
            </>
          ),
        },
        {
          title: "Condition definitions",
          body: (
            <ul>
              <li><strong>Flawless or like new:</strong> no scratches, scuffs or signs of use.</li>
              <li><strong>Lightly used:</strong> light signs of normal use that are visible only up close.</li>
              <li><strong>Scratched or scuffed:</strong> obvious scratches, scuffs or nicks on the screen or body.</li>
              <li><strong>Damaged:</strong> bent, chipped, dented or sun-bleached, with no cracks.</li>
              <li>
                <strong>Broken:</strong> doesn’t power on, doesn’t work fully (screen, buttons, cameras, speakers, connectivity, biometrics or battery),
                or has a cracked front or back.
              </li>
            </ul>
          ),
        },
        {
          title: "Preparing and sending your device",
          body: (
            <>
              <p>Before you ship, you agree to back up your data, sign out of all accounts, turn off device locks, factory reset the device and remove the SIM card.</p>
              <p>
                We email you a prepaid shipping label and instructions within {P.labelWithin} of checkout. Pack the device securely and ship it with that
                label. See <Link href="/shipping-payments" className="font-semibold text-brand hover:underline">Shipping &amp; Payments</Link> for details.
              </p>
            </>
          ),
        },
        {
          title: "Inspection and revised offers",
          body: (
            <>
              <p>We inspect every device within {P.inspectionWithin} of receiving it.</p>
              <ul>
                <li>If it matches your description, we approve your original offer and send your payment.</li>
                <li>If it’s in better condition than you described, we may raise your offer.</li>
                <li>
                  If it doesn’t match (different model, storage, carrier or condition), we email you a revised offer. You have {P.revisedOfferDays} days
                  to accept or decline it. If you decline, we return the device to you at no cost. If you don’t respond within {P.revisedOfferDays} days,
                  the revised offer is considered accepted and we send that payment.
                </li>
              </ul>
              <p>Once you accept an offer, original or revised, the sale is final.</p>
            </>
          ),
        },
        {
          title: "Payment",
          body: (
            <>
              <p>
                We pay by {P.payoutMethods} within {P.paymentWithin} of approving your device. You’re responsible for entering correct payment details.
                Payments sent to the details you provided are considered complete, and we can’t recover funds sent to an incorrect account you entered.
              </p>
            </>
          ),
        },
        {
          title: "Ownership and risk of loss",
          body: (
            <p>
              You remain responsible for the device until it is delivered to us. Ownership of the device passes to {P.company} when we send your
              payment. Once you have accepted an offer and been paid, we can’t return the device or any data on it.
            </p>
          ),
        },
        {
          title: "Your data",
          body: (
            <p>
              You are responsible for removing all personal data before shipping. We erase devices as part of our standard process, but we are not
              responsible for any data left on a device you send us, or for any loss of data after you ship it.
            </p>
          ),
        },
        {
          title: "Fraud, stolen and locked devices",
          body: (
            <p>
              If we receive a device that is reported lost or stolen, or if we suspect fraud, we may withhold payment, keep the device and share
              information with law enforcement or the rightful owner. Devices that arrive with an account lock we can’t remove will receive a revised
              offer, or be returned to you.
            </p>
          ),
        },
        {
          title: "Limitation of liability",
          body: (
            <p>
              The Service is provided “as is”. To the fullest extent permitted by law, {P.company} is not liable for indirect or consequential damages,
              and our total liability for any transaction is limited to the amount of the offer for that device.
            </p>
          ),
        },
        {
          title: "Changes to these terms",
          body: (
            <p>
              We may update these terms from time to time. The version in effect when you accept an offer applies to that order. Continued use of the
              Service after changes means you accept the updated terms.
            </p>
          ),
        },
        {
          title: "Contact",
          body: <p>Questions about these terms or your order? Email {mail}.</p>,
        },
      ]}
    />
  );
}
