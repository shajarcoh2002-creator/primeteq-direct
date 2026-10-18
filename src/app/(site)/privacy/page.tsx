import { LegalPage } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { POLICY as P } from "@/lib/policy";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={
        <p>
          This policy explains what information {P.company} collects when you use {CONTACT.website}, how we use it and the choices you have. We only
          collect what we need to buy your device and pay you.
        </p>
      }
      sections={[
        {
          title: "Information we collect",
          body: (
            <ul>
              <li><strong>Contact details:</strong> your name, email address and, if you choose to give it, your phone number.</li>
              <li><strong>Address:</strong> the address you ship from, used to create your shipping label.</li>
              <li><strong>Payment details:</strong> your PayPal email, or your Zelle email or mobile number and the name on that account.</li>
              <li><strong>Device details:</strong> the model, storage, carrier and condition you describe, and what we find during inspection (including the device’s serial number or IMEI).</li>
              <li><strong>Technical data:</strong> basic information your browser sends, such as IP address and pages visited, used to keep the site secure and working.</li>
            </ul>
          ),
        },
        {
          title: "How we use it",
          body: (
            <ul>
              <li>to give you an offer, create your order and send your shipping label;</li>
              <li>to inspect your device and send your payment;</li>
              <li>to email you about your order, including revised offers;</li>
              <li>to prevent fraud and check that devices aren’t lost, stolen or blacklisted;</li>
              <li>to improve our site and our offers.</li>
            </ul>
          ),
        },
        {
          title: "Who we share it with",
          body: (
            <>
              <p>We don’t sell your personal information. We share it only as needed with:</p>
              <ul>
                <li>shipping carriers, to create and deliver your label and package;</li>
                <li>payment providers (PayPal, Zelle and our bank), to send your payment;</li>
                <li>service providers that host our site and store our data, under confidentiality obligations;</li>
                <li>law enforcement or the rightful owner, if a device is reported lost or stolen or when the law requires it.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Data on your device",
          body: (
            <p>
              Please erase your device before sending it. As part of our standard process we wipe every device we receive. We don’t access, copy or keep
              personal content left on a device.
            </p>
          ),
        },
        {
          title: "How long we keep it",
          body: (
            <p>
              We keep order records for as long as needed to complete your sale, handle questions and meet legal, tax and accounting obligations. After
              that, we delete or anonymize them.
            </p>
          ),
        },
        {
          title: "Security",
          body: (
            <p>
              We use encrypted connections (HTTPS) and limit access to your information to the people who need it to process your order. No system is
              completely secure, but we work to protect your information.
            </p>
          ),
        },
        {
          title: "Your choices",
          body: (
            <p>
              You can ask us to access, correct or delete your personal information at any time by emailing {mail}. We may need to keep some records
              to complete an order or meet legal obligations.
            </p>
          ),
        },
        {
          title: "Children",
          body: <p>Our Service is for people {P.minAge} and older. We don’t knowingly collect information from children.</p>,
        },
        {
          title: "Changes to this policy",
          body: <p>We may update this policy. We’ll post the new version on this page with its effective date.</p>,
        },
        {
          title: "Contact",
          body: <p>Questions about your privacy? Email {mail}.</p>,
        },
      ]}
    />
  );
}
