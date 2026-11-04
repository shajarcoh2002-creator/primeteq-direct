import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { getSettings } from "@/lib/db";
import { policyFor } from "@/lib/policy";
import { getDict, getLang } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getDict()).footer.terms };
}

export default async function TermsPage() {
  const [settings, t, lang] = await Promise.all([getSettings(), getDict(), getLang()]);
  const days = settings.offerValidDays;
  const P = policyFor(t);
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;
  const shipping = <Link href="/shipping-payments" className="font-semibold text-brand hover:underline">{t.footer.shipping}</Link>;

  const es: LegalSection[] = [
    {
      title: "Quién puede vender",
      body: (
        <>
          <p>Para vender un equipo a {P.company}, debes:</p>
          <ul>
            <li>tener al menos {P.minAge} años y poder celebrar un acuerdo vinculante;</li>
            <li>vivir en {P.serviceArea}: en Panamá entregas el equipo en uno de nuestros puntos; en EE. UU. lo envías desde una dirección allí;</li>
            <li>ser el dueño del equipo, o estar autorizado por el dueño para venderlo;</li>
            <li>darnos información correcta sobre ti, tus datos de pago y tu equipo.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Equipos aceptados",
      body: (
        <>
          <p>Solo compramos los equipos que aparecen en nuestro sitio. Un equipo no se acepta si:</p>
          <ul>
            <li>fue reportado como perdido o robado, o está bloqueado por un operador;</li>
            <li>tiene saldo pendiente o financiamiento con un operador o tienda;</li>
            <li>tiene activado un bloqueo de activación o de cuenta (como Find My o la protección de cuenta de Google o Samsung);</li>
            <li>fue modificado respecto a sus especificaciones de fábrica, o tiene piezas falsificadas.</li>
          </ul>
          <p>Podemos rechazar cualquier equipo a nuestra discreción. No compramos accesorios (fundas, cargadores, cables, cajas) y no se devuelven.</p>
        </>
      ),
    },
    {
      title: "Tu oferta",
      body: (
        <>
          <p>
            Tu oferta se calcula según el modelo, la capacidad, el operador y la condición que eliges. Es válida por {days} días desde que la aceptas.
            Tu equipo debe llegarnos o entregarse en ese plazo; si no, la oferta vence.
          </p>
          <p>
            Las ofertas son personales e intransferibles. Si el valor de reventa de tu modelo baja más de {P.marketDropPct}% durante el plazo de tu
            oferta, podemos enviarte una oferta actualizada, que puedes aceptar o rechazar como se describe en la sección 6. Todos los montos están en
            dólares estadounidenses (USD).
          </p>
        </>
      ),
    },
    {
      title: "Definición de condiciones",
      body: (
        <ul>
          <li><strong>Impecable o como nuevo:</strong> sin rayones, marcas ni señales de uso.</li>
          <li><strong>Poco uso:</strong> ligeras señales de uso normal, visibles solo de cerca.</li>
          <li><strong>Rayado o con marcas:</strong> rayones, marcas o golpecitos visibles en la pantalla o el cuerpo.</li>
          <li><strong>Dañado:</strong> doblado, astillado, abollado o descolorido, sin grietas.</li>
          <li>
            <strong>Roto:</strong> no enciende, no funciona completamente (pantalla, botones, cámaras, bocinas, conectividad, biometría o batería), o
            tiene el frente o la parte trasera agrietados.
          </li>
        </ul>
      ),
    },
    {
      title: "Preparar y entregar tu equipo",
      body: (
        <>
          <p>Antes de entregarlo, te comprometes a respaldar tus datos, cerrar sesión en todas tus cuentas, desactivar los bloqueos, restablecerlo de fábrica y quitar la SIM.</p>
          <p>
            En Panamá, llevas el equipo al punto de entrega que elegiste con tu número de orden. En EE. UU., te enviamos por correo una etiqueta de
            envío prepagada en {P.labelWithin}. Más detalles en {shipping}.
          </p>
        </>
      ),
    },
    {
      title: "Revisión y ofertas revisadas",
      body: (
        <>
          <p>Revisamos cada equipo en {P.inspectionWithin} después de recibirlo.</p>
          <ul>
            <li>Si coincide con tu descripción, aprobamos tu oferta original y te pagamos.</li>
            <li>Si está en mejor condición de la que describiste, podemos subir tu oferta.</li>
            <li>
              Si no coincide (otro modelo, capacidad, operador o condición), te enviamos una oferta revisada. Tienes {P.revisedOfferDays} días para
              aceptarla o rechazarla. Si la rechazas, te devolvemos el equipo sin costo. Si no respondes en {P.revisedOfferDays} días, la oferta revisada
              se considera aceptada y te enviamos ese pago.
            </li>
          </ul>
          <p>Una vez que aceptas una oferta, original o revisada, la venta es final.</p>
        </>
      ),
    },
    {
      title: "Pago",
      body: (
        <p>
          Pagamos por {P.payoutMethods} en {P.paymentWithin} después de aprobar tu equipo. Eres responsable de escribir correctamente tus datos de pago.
          Los pagos enviados a los datos que nos diste se consideran completados, y no podemos recuperar fondos enviados a una cuenta incorrecta que tú
          escribiste.
        </p>
      ),
    },
    {
      title: "Propiedad y riesgo",
      body: (
        <p>
          Eres responsable del equipo hasta que nos llega o lo entregas. La propiedad pasa a {P.company} cuando te enviamos el pago. Después de aceptar
          una oferta y recibir el pago, no podemos devolver el equipo ni los datos que tenga.
        </p>
      ),
    },
    {
      title: "Tus datos",
      body: (
        <p>
          Eres responsable de borrar todos tus datos personales antes de entregar el equipo. Borramos los equipos como parte de nuestro proceso, pero no
          somos responsables de datos que queden en un equipo que nos entregues, ni de su pérdida después de entregarlo.
        </p>
      ),
    },
    {
      title: "Fraude, equipos robados y bloqueados",
      body: (
        <p>
          Si recibimos un equipo reportado como perdido o robado, o sospechamos fraude, podemos retener el pago, quedarnos con el equipo y compartir
          información con las autoridades o con el dueño legítimo. Los equipos con un bloqueo de cuenta que no podamos quitar recibirán una oferta
          revisada o se te devolverán.
        </p>
      ),
    },
    {
      title: "Limitación de responsabilidad",
      body: (
        <p>
          El Servicio se ofrece “tal cual”. En la medida en que lo permita la ley, {P.company} no es responsable por daños indirectos o consecuentes, y
          nuestra responsabilidad total por cualquier transacción se limita al monto de la oferta de ese equipo.
        </p>
      ),
    },
    {
      title: "Cambios a estos términos",
      body: (
        <p>
          Podemos actualizar estos términos. Se aplica a cada orden la versión vigente cuando aceptaste la oferta. Si sigues usando el Servicio después de
          un cambio, aceptas los términos actualizados.
        </p>
      ),
    },
    { title: "Contacto", body: <p>¿Preguntas sobre estos términos o tu orden? Escríbenos a {mail}.</p> },
  ];

  const en: LegalSection[] = [
    {
      title: "Who can sell",
      body: (
        <>
          <p>To sell a device to {P.company}, you must:</p>
          <ul>
            <li>be at least {P.minAge} years old and able to enter into a binding agreement;</li>
            <li>live in {P.serviceArea}: in Panama you drop the device off at one of our locations; in the U.S. you ship it from an address there;</li>
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
            Your offer is calculated from the model, storage, carrier and condition you select. It is valid for {days} days from the moment you accept
            it at checkout. Your device must reach us, or be dropped off, within those {days} days, or the offer expires.
          </p>
          <p>
            Offers are personal and can’t be transferred. If the resale value of your model drops by more than {P.marketDropPct}% during your offer
            period, we may send you an updated offer, which you can accept or decline as described in section 6. All amounts are in U.S. dollars (USD).
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
            <strong>Broken:</strong> doesn’t power on, doesn’t work fully (screen, buttons, cameras, speakers, connectivity, biometrics or battery), or
            has a cracked front or back.
          </li>
        </ul>
      ),
    },
    {
      title: "Preparing and delivering your device",
      body: (
        <>
          <p>Before you deliver it, you agree to back up your data, sign out of all accounts, turn off device locks, factory reset the device and remove the SIM card.</p>
          <p>
            In Panama, bring the device and your order number to the drop-off location you chose. In the U.S., we email you a prepaid shipping label
            within {P.labelWithin} of checkout. See {shipping} for details.
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
              If it doesn’t match (different model, storage, carrier or condition), we send you a revised offer. You have {P.revisedOfferDays} days to
              accept or decline it. If you decline, we return the device to you at no cost. If you don’t respond within {P.revisedOfferDays} days, the
              revised offer is considered accepted and we send that payment.
            </li>
          </ul>
          <p>Once you accept an offer, original or revised, the sale is final.</p>
        </>
      ),
    },
    {
      title: "Payment",
      body: (
        <p>
          We pay by {P.payoutMethods} within {P.paymentWithin} of approving your device. You’re responsible for entering correct payment details.
          Payments sent to the details you provided are considered complete, and we can’t recover funds sent to an incorrect account you entered.
        </p>
      ),
    },
    {
      title: "Ownership and risk of loss",
      body: (
        <p>
          You remain responsible for the device until it is delivered to us. Ownership of the device passes to {P.company} when we send your payment.
          Once you have accepted an offer and been paid, we can’t return the device or any data on it.
        </p>
      ),
    },
    {
      title: "Your data",
      body: (
        <p>
          You are responsible for removing all personal data before delivering your device. We erase devices as part of our standard process, but we
          are not responsible for any data left on a device you give us, or for any loss of data after you deliver it.
        </p>
      ),
    },
    {
      title: "Fraud, stolen and locked devices",
      body: (
        <p>
          If we receive a device that is reported lost or stolen, or if we suspect fraud, we may withhold payment, keep the device and share information
          with law enforcement or the rightful owner. Devices that arrive with an account lock we can’t remove will receive a revised offer, or be
          returned to you.
        </p>
      ),
    },
    {
      title: "Limitation of liability",
      body: (
        <p>
          The Service is provided “as is”. To the fullest extent permitted by law, {P.company} is not liable for indirect or consequential damages, and
          our total liability for any transaction is limited to the amount of the offer for that device.
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
    { title: "Contact", body: <p>Questions about these terms or your order? Email {mail}.</p> },
  ];

  return (
    <LegalPage
      title={t.footer.terms}
      intro={
        <p>
          {lang === "es"
            ? `Estos términos rigen la venta de un equipo a ${P.company} a través de ${CONTACT.website} (el “Servicio”). Al pedir una oferta o completar tu orden, aceptas estos términos. Si no estás de acuerdo, no uses el Servicio.`
            : `These terms govern selling a device to ${P.company} through ${CONTACT.website} (the “Service”). By requesting an offer or completing checkout, you agree to these terms. If you don’t agree, please don’t use the Service.`}
        </p>
      }
      sections={lang === "es" ? es : en}
    />
  );
}
