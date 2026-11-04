import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { getSettings } from "@/lib/db";
import { DROPOFF_LOCATIONS } from "@/lib/locations";
import { policyFor } from "@/lib/policy";
import { getDict, getLang } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getDict()).footer.shipping };
}

export default async function ShippingPaymentsPage() {
  const [settings, t, lang] = await Promise.all([getSettings(), getDict(), getLang()]);
  const days = settings.offerValidDays;
  const P = policyFor(t);
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;
  const wa = <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand hover:underline">{CONTACT.whatsapp}</a>;
  const track = <Link href="/track" className="font-semibold text-brand hover:underline">{t.nav.trackOffer}</Link>;
  const locations = (
    <ul>
      {DROPOFF_LOCATIONS.map((l) => (
        <li key={l.id}>
          <strong>{l.name}</strong> — {l.address[lang] !== l.name && <>{l.address[lang]}, </>}
          {l.area}
          {l.hours && <> · {l.hours[lang]}</>}
        </li>
      ))}
    </ul>
  );

  const sections: LegalSection[] =
    lang === "es"
      ? [
          {
            title: "Panamá: entrega en tienda",
            body: (
              <>
                <p>
                  En Panamá no hacemos envíos. Al aceptar tu oferta llevas tu equipo a nuestra tienda, con tu número de
                  orden, dentro de los {days} días de validez de la oferta:
                </p>
                {locations}
                <p>Te enviamos la dirección y los detalles por correo. Para coordinar la hora, escríbenos por WhatsApp al {wa} o a {mail}.</p>
              </>
            ),
          },
          {
            title: "Estados Unidos: etiqueta de envío gratis",
            body: (
              <p>
                Después de aceptar tu oferta, te enviamos por correo una etiqueta de envío prepagada con las instrucciones en {P.labelWithin}. La
                etiqueta se crea con la dirección que escribiste al finalizar, así que asegúrate de que sea la dirección desde donde enviarás.
              </p>
            ),
          },
          {
            title: "Cómo preparar tu equipo",
            body: (
              <ul>
                <li>Haz un respaldo, cierra sesión en todas tus cuentas, desactiva Find My o la protección del equipo y restablécelo de fábrica.</li>
                <li>Quita la tarjeta SIM.</li>
                <li>Si lo envías, envuélvelo con protección y ponlo en una caja pequeña y firme para que no se mueva.</li>
                <li>Entrega solo el equipo: sin fundas, cargadores, cables ni cajas. Los accesorios no se devuelven.</li>
              </ul>
            ),
          },
          {
            title: "Plazos",
            body: (
              <p>
                Tu oferta es válida por {days} días después de aceptarla, y tu equipo debe llegar (o entregarse) dentro de ese plazo. Puedes seguir tu
                orden cuando quieras en {track}.
              </p>
            ),
          },
          {
            title: "Revisión",
            body: (
              <p>
                Revisamos tu equipo en {P.inspectionWithin} después de recibirlo. Si coincide con lo que describiste, se aprueba. Si no, te enviamos una
                oferta revisada que puedes aceptar o rechazar en {P.revisedOfferDays} días. Si la rechazas, te devolvemos el equipo sin costo.
              </p>
            ),
          },
          {
            title: "Cómo te pagamos",
            body: (
              <>
                <p>Te pagamos en {P.paymentWithin} después de aprobar tu equipo, con el método que elegiste. En Panamá puedes darnos tus datos de Yappy o ACH al finalizar o en la tienda.</p>
                <ul>
                  <li><strong>Yappy (Panamá):</strong> al número de celular vinculado a tu Yappy, a nombre de esa cuenta.</li>
                  <li><strong>Transferencia ACH (Panamá):</strong> a la cuenta de ahorros o corriente que indicaste (banco, tipo, número y titular).</li>
                  <li><strong>PayPal (EE. UU.):</strong> al correo de tu cuenta PayPal.</li>
                  <li><strong>Zelle (EE. UU.):</strong> al correo o celular de EE. UU. registrado en Zelle, a nombre de esa cuenta.</li>
                </ul>
                <p>
                  Revisa bien tus datos de pago: no podemos recuperar pagos enviados a datos mal escritos. Para cambiarlos antes de recibir tu pago,
                  escríbenos a {mail} con tu número de orden.
                </p>
              </>
            ),
          },
          { title: "Preguntas", body: <p>¿Necesitas ayuda con la entrega o el pago? Escríbenos a {mail} con tu número de orden.</p> },
        ]
      : [
          {
            title: "Panama: store drop-off",
            body: (
              <>
                <p>
                  In Panama we don’t ship. When you accept your offer you bring your device to our store, with your
                  order number, within the {days}-day offer period:
                </p>
                {locations}
                <p>We email you the address and details. To arrange a time, message us on WhatsApp at {wa} or email {mail}.</p>
              </>
            ),
          },
          {
            title: "United States: free shipping label",
            body: (
              <p>
                After you accept your offer, we email a prepaid shipping label and instructions within {P.labelWithin}. The label is created with the
                address you entered at checkout, so make sure it’s the address you’ll ship from.
              </p>
            ),
          },
          {
            title: "How to prepare your device",
            body: (
              <ul>
                <li>Back up your data, sign out of all accounts, turn off Find My or device protection, and factory reset the device.</li>
                <li>Remove the SIM card.</li>
                <li>If you ship it, wrap it in padding and place it in a small, sturdy box so it can’t move around.</li>
                <li>Bring or send only the device — no cases, chargers, cables or boxes. Accessories are not returned.</li>
              </ul>
            ),
          },
          {
            title: "Timing",
            body: (
              <p>
                Your offer is valid for {days} days after you accept it, and your device must reach us (or be dropped off) within that time. You can
                follow your order any time on {track}.
              </p>
            ),
          },
          {
            title: "Inspection",
            body: (
              <p>
                We inspect your device within {P.inspectionWithin} of receiving it. If it matches your description, it’s approved. If it doesn’t, we
                send you a revised offer that you can accept or decline within {P.revisedOfferDays} days. If you decline, we return your device at no cost.
              </p>
            ),
          },
          {
            title: "Getting paid",
            body: (
              <>
                <p>We send your payment within {P.paymentWithin} of approving your device, using the method you chose. In Panama you can give us your Yappy or ACH details at checkout or at the store.</p>
                <ul>
                  <li><strong>Yappy (Panama):</strong> to the mobile number linked to your Yappy account, under the name on that account.</li>
                  <li><strong>ACH transfer (Panama):</strong> to the savings or checking account you gave us (bank, type, number and holder).</li>
                  <li><strong>PayPal (U.S.):</strong> to your PayPal account email.</li>
                  <li><strong>Zelle (U.S.):</strong> to the email or U.S. mobile number enrolled in Zelle, under the name on that account.</li>
                </ul>
                <p>
                  Please double-check your payment details at checkout — we can’t recover payments sent to details entered incorrectly. To change them
                  before you’re paid, email {mail} with your order number.
                </p>
              </>
            ),
          },
          { title: "Questions", body: <p>Need help with delivery or payment? Email {mail} with your order number.</p> },
        ];

  return (
    <LegalPage
      eyebrow={t.legal.help}
      title={t.footer.shipping}
      intro={
        <p>
          {lang === "es"
            ? `En Panamá entregas tu equipo en nuestra tienda BH Tech y te pagamos por Yappy o ACH. En EE. UU. el envío es gratis y te pagamos por PayPal o Zelle. Así funciona.`
            : `In Panama you drop off your device at our BH Tech store and get paid by Yappy or ACH. In the U.S. shipping is free and you get paid by PayPal or Zelle. Here’s how it works.`}
        </p>
      }
      sections={sections}
    />
  );
}
