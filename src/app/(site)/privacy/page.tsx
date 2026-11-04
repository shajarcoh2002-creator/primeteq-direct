import { LegalPage, type LegalSection } from "@/components/LegalPage";
import { CONTACT } from "@/lib/contact";
import { POLICY as P } from "@/lib/policy";
import { getDict, getLang } from "@/i18n/server";

export async function generateMetadata() {
  return { title: (await getDict()).footer.privacy };
}

export default async function PrivacyPage() {
  const [t, lang] = await Promise.all([getDict(), getLang()]);
  const mail = <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline">{CONTACT.email}</a>;

  const es: LegalSection[] = [
    {
      title: "Información que recopilamos",
      body: (
        <ul>
          <li><strong>Contacto:</strong> tu nombre, correo electrónico y teléfono / WhatsApp (obligatorio en Panamá, opcional en EE. UU.).</li>
          <li><strong>Dirección:</strong> en EE. UU., la dirección desde donde envías, para crear tu etiqueta. En Panamá, el punto de entrega que eliges.</li>
          <li>
            <strong>Datos de pago:</strong> según el método que elijas, tu número de Yappy, tu banco, tipo y número de cuenta para ACH, tu correo de
            PayPal o tu correo o celular de Zelle, y el nombre del titular.
          </li>
          <li><strong>Datos del equipo:</strong> el modelo, la capacidad, el operador y la condición que describes, y lo que encontramos al revisarlo (incluido el número de serie o IMEI).</li>
          <li><strong>Datos técnicos:</strong> información básica que envía tu navegador, como la dirección IP, las páginas visitadas y tu preferencia de idioma.</li>
        </ul>
      ),
    },
    {
      title: "Cómo la usamos",
      body: (
        <ul>
          <li>para darte una oferta, crear tu orden y coordinar la entrega o el envío;</li>
          <li>para revisar tu equipo y enviarte el pago;</li>
          <li>para escribirte sobre tu orden, incluidas las ofertas revisadas;</li>
          <li>para prevenir fraude y verificar que los equipos no estén perdidos, robados o bloqueados;</li>
          <li>para mejorar nuestro sitio y nuestras ofertas.</li>
        </ul>
      ),
    },
    {
      title: "Con quién la compartimos",
      body: (
        <>
          <p>No vendemos tu información personal. Solo la compartimos cuando hace falta con:</p>
          <ul>
            <li>nuestro equipo y el encargado de cada punto de entrega, que reciben el resumen de tu orden (incluso por WhatsApp) para atenderte;</li>
            <li>empresas de envío, para crear y entregar tu etiqueta y paquete (EE. UU.);</li>
            <li>proveedores de pago (Yappy, nuestro banco para ACH, PayPal, Zelle), para enviarte el pago;</li>
            <li>proveedores que alojan nuestro sitio, guardan nuestros datos o envían mensajes (como correo y WhatsApp), con obligación de confidencialidad;</li>
            <li>las autoridades o el dueño legítimo, si un equipo está reportado como perdido o robado, o cuando la ley lo exija.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Datos en tu equipo",
      body: (
        <p>
          Borra tu equipo antes de entregarlo. Como parte de nuestro proceso, borramos cada equipo que recibimos. No accedemos, copiamos ni guardamos el
          contenido personal que quede en un equipo.
        </p>
      ),
    },
    {
      title: "Cuánto tiempo la guardamos",
      body: (
        <p>
          Guardamos los registros de las órdenes el tiempo necesario para completar tu venta, atender preguntas y cumplir obligaciones legales,
          fiscales y contables. Después los borramos o anonimizamos.
        </p>
      ),
    },
    {
      title: "Seguridad",
      body: (
        <p>
          Usamos conexiones cifradas (HTTPS) y limitamos el acceso a tu información a las personas que la necesitan para procesar tu orden. Ningún
          sistema es totalmente seguro, pero trabajamos para proteger tu información.
        </p>
      ),
    },
    {
      title: "Tus opciones",
      body: (
        <p>
          Puedes pedirnos acceder, corregir o borrar tu información personal cuando quieras escribiendo a {mail}. Es posible que debamos conservar
          algunos registros para completar una orden o cumplir obligaciones legales.
        </p>
      ),
    },
    { title: "Menores de edad", body: <p>Nuestro Servicio es para personas de {P.minAge} años o más. No recopilamos a sabiendas información de menores.</p> },
    { title: "Cambios a esta política", body: <p>Podemos actualizar esta política. Publicaremos la nueva versión en esta página con su fecha de vigencia.</p> },
    { title: "Contacto", body: <p>¿Preguntas sobre tu privacidad? Escríbenos a {mail}.</p> },
  ];

  const en: LegalSection[] = [
    {
      title: "Information we collect",
      body: (
        <ul>
          <li><strong>Contact details:</strong> your name, email address and phone / WhatsApp number (required in Panama, optional in the U.S.).</li>
          <li><strong>Address:</strong> in the U.S., the address you ship from, used to create your label. In Panama, the drop-off location you choose.</li>
          <li>
            <strong>Payment details:</strong> depending on the method you choose, your Yappy number, your bank, account type and number for ACH, your
            PayPal email or your Zelle email or mobile number, and the account holder’s name.
          </li>
          <li><strong>Device details:</strong> the model, storage, carrier and condition you describe, and what we find during inspection (including the device’s serial number or IMEI).</li>
          <li><strong>Technical data:</strong> basic information your browser sends, such as IP address, pages visited and your language preference.</li>
        </ul>
      ),
    },
    {
      title: "How we use it",
      body: (
        <ul>
          <li>to give you an offer, create your order and arrange the drop-off or shipment;</li>
          <li>to inspect your device and send your payment;</li>
          <li>to contact you about your order, including revised offers;</li>
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
            <li>our team and the person in charge of each drop-off location, who receive your order summary (including by WhatsApp) to serve you;</li>
            <li>shipping carriers, to create and deliver your label and package (U.S.);</li>
            <li>payment providers (Yappy, our bank for ACH, PayPal, Zelle), to send your payment;</li>
            <li>service providers that host our site, store our data or send messages (such as email and WhatsApp), under confidentiality obligations;</li>
            <li>law enforcement or the rightful owner, if a device is reported lost or stolen or when the law requires it.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Data on your device",
      body: (
        <p>
          Please erase your device before delivering it. As part of our standard process we wipe every device we receive. We don’t access, copy or keep
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
          You can ask us to access, correct or delete your personal information at any time by emailing {mail}. We may need to keep some records to
          complete an order or meet legal obligations.
        </p>
      ),
    },
    { title: "Children", body: <p>Our Service is for people {P.minAge} and older. We don’t knowingly collect information from children.</p> },
    { title: "Changes to this policy", body: <p>We may update this policy. We’ll post the new version on this page with its effective date.</p> },
    { title: "Contact", body: <p>Questions about your privacy? Email {mail}.</p> },
  ];

  return (
    <LegalPage
      title={t.footer.privacy}
      intro={
        <p>
          {lang === "es"
            ? `Esta política explica qué información recopila ${P.company} cuando usas ${CONTACT.website}, cómo la usamos y qué opciones tienes. Solo recopilamos lo necesario para comprar tu equipo y pagarte.`
            : `This policy explains what information ${P.company} collects when you use ${CONTACT.website}, how we use it and the choices you have. We only collect what we need to buy your device and pay you.`}
        </p>
      }
      sections={lang === "es" ? es : en}
    />
  );
}
