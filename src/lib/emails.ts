import { type Lang, fmt } from "@/i18n/config";
import { dictFor } from "@/i18n/server";
import { CONTACT } from "./contact";
import { type Order, PAYOUT_LABELS, orderCountry } from "./db";
import type { EmailMessage } from "./email";
import { siteUrl } from "./email";
import { getLocation, mapsUrl } from "./locations";
import { policyFor } from "./policy";

// Transactional email templates, in the language the customer used on the site.
// Inline styles only (email clients ignore stylesheets).

const NAVY = "#0B1640";
const BLUE = "#342CFF";
const MUTED = "#5B6475";
const LINE = "#E2E7F0";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const COPY = {
  en: {
    questions: "Questions? Reply to this email or write to",
    order: "Order",
    device: "Device",
    carrier: "Carrier",
    condition: "Condition",
    offer: "Your offer",
    payment: "Payment",
    dropoff: "Drop-off",
    validUntil: "Offer valid until",
    acceptedTitle: "Your offer is accepted",
    hi: "Hi {name}, thanks for selling with Prime Teq. Here’s your order:",
    there: "there",
    nextShip: "<strong>What’s next:</strong> we’ll email your free prepaid shipping label and instructions within {labelWithin}.",
    nextDropoff: "<strong>What’s next:</strong> bring your device and your order number to <strong>{location}</strong> before <strong>{date}</strong>.",
    getReady: "Get your device ready:",
    prep: [
      "Back up your data.",
      "Sign out of your Apple, Google or Samsung account and turn off Find My or device protection.",
      "Factory reset the device and remove the SIM card.",
      "Bring or send only the device — no case, charger, cable or box.",
    ],
    viewOrder: "View your order",
    keepNumber: "Keep your order number ({id}) to track your order at any time.",
    map: "Open in Google Maps",
    coordinate: "To arrange the time, message us on WhatsApp:",
    acceptedSubject: "Your Prime Teq offer is accepted — order {id}",
    labelTitle: "Your shipping label is ready",
    labelHi: "Hi {name}, here’s your prepaid shipping label for order <strong>{id}</strong> ({device}).",
    labelButton: "View & print your label",
    howToShip: "How to ship:",
    shipSteps: [
      "Click “View & print your label” above, then print it (any printer works).",
      "Wrap the device in padding and put it in a small, sturdy box so it can’t move.",
      "Tape the label to the box and drop it off with the carrier shown on the label.",
    ],
    shipBy: "Please ship by <strong>{date}</strong> to keep your offer of <strong>{price}</strong>.",
    tracking: "Tracking number:",
    beforeShip: "Before you ship, make sure you:",
    afterArrive: "Once your device arrives, we inspect it within {inspection} and send your payment within {payment} of approval.",
    findLabel: "You can also find your label any time on your order page:",
    labelSubject: "Your Prime Teq shipping label — order {id}",
  },
  es: {
    questions: "¿Preguntas? Responde a este correo o escríbenos a",
    order: "Orden",
    device: "Equipo",
    carrier: "Operador",
    condition: "Condición",
    offer: "Tu oferta",
    payment: "Pago",
    dropoff: "Punto de entrega",
    validUntil: "Oferta válida hasta",
    acceptedTitle: "Tu oferta fue aceptada",
    hi: "Hola {name}, gracias por vender con Prime Teq. Este es el resumen de tu orden:",
    there: "",
    nextShip: "<strong>Siguiente paso:</strong> te enviaremos por correo tu etiqueta de envío prepagada y gratis, con las instrucciones, en {labelWithin}.",
    nextDropoff: "<strong>Siguiente paso:</strong> lleva tu equipo y tu número de orden a <strong>{location}</strong> antes del <strong>{date}</strong>.",
    getReady: "Prepara tu equipo:",
    prep: [
      "Haz un respaldo de tus datos.",
      "Cierra sesión en tu cuenta de Apple, Google o Samsung y desactiva Find My o la protección del equipo.",
      "Restablece el equipo de fábrica y quita la tarjeta SIM.",
      "Entrega solo el equipo, sin funda, cargador, cable ni caja.",
    ],
    viewOrder: "Ver tu orden",
    keepNumber: "Guarda tu número de orden ({id}) para rastrearla cuando quieras.",
    map: "Abrir en Google Maps",
    coordinate: "Para coordinar la hora, escríbenos por WhatsApp:",
    acceptedSubject: "Tu oferta de Prime Teq fue aceptada — orden {id}",
    labelTitle: "Tu etiqueta de envío está lista",
    labelHi: "Hola {name}, aquí está tu etiqueta de envío prepagada para la orden <strong>{id}</strong> ({device}).",
    labelButton: "Ver e imprimir tu etiqueta",
    howToShip: "Cómo enviarlo:",
    shipSteps: [
      "Haz clic en “Ver e imprimir tu etiqueta” y imprímela (cualquier impresora sirve).",
      "Envuelve el equipo con protección y ponlo en una caja pequeña y firme para que no se mueva.",
      "Pega la etiqueta en la caja y entrégala a la empresa de envíos que aparece en ella.",
    ],
    shipBy: "Envíalo antes del <strong>{date}</strong> para mantener tu oferta de <strong>{price}</strong>.",
    tracking: "Número de rastreo:",
    beforeShip: "Antes de enviarlo, asegúrate de:",
    afterArrive: "Cuando llegue tu equipo, lo revisamos en {inspection} y te pagamos en {payment} después de aprobarlo.",
    findLabel: "También puedes ver tu etiqueta en cualquier momento en la página de tu orden:",
    labelSubject: "Tu etiqueta de envío de Prime Teq — orden {id}",
  },
} satisfies Record<Lang, unknown>;

const langOf = (order: Order): Lang => order.lang ?? "en";
const fmtDate = (iso: string, lang: Lang) =>
  new Date(iso).toLocaleDateString(lang === "es" ? "es-PA" : "en-US", { month: "long", day: "numeric", year: "numeric" });
const stripTags = (s: string) => s.replace(/<[^>]+>/g, "");
const greetName = (order: Order, c: (typeof COPY)[Lang]) => order.customer.name.split(" ")[0] || c.there;
/** fmt() for HTML templates: placeholder values are escaped, the template's own tags are kept. */
const fmtHtml = (template: string, vars: Record<string, string | number>) =>
  fmt(template, Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, esc(String(v))])));

function layout(lang: Lang, title: string, bodyHtml: string) {
  const base = siteUrl();
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#F5F7FB;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${NAVY}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FB;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:16px">
<tr><td style="padding:28px 28px 8px"><img src="${base}/brand/primeteq-logo.png" alt="Prime Teq" width="150" style="display:block;height:auto;border:0"></td></tr>
<tr><td style="padding:12px 28px 4px"><h1 style="margin:0;font-size:24px;line-height:1.25;color:${NAVY}">${esc(title)}</h1></td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6;color:#1E2A52">${bodyHtml}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:${MUTED};text-align:center">
${COPY[lang].questions} <a href="mailto:${CONTACT.email}" style="color:${BLUE}">${CONTACT.email}</a>.<br>
Prime Teq · <a href="${base}" style="color:${MUTED}">${CONTACT.website}</a> · <a href="${CONTACT.instagramUrl}" style="color:${MUTED}">${CONTACT.instagramHandle}</a>
</p>
</td></tr></table></body></html>`;
}

function summaryRows(order: Order): [string, string][] {
  const lang = langOf(order);
  const c = COPY[lang];
  const t = dictFor(lang);
  const loc = getLocation(order.dropoff?.locationId);
  return [
    [c.order, order.id],
    [c.device, `${order.item.modelName} ${order.item.storage}`],
    [c.carrier, t.carriers[order.item.carrier]],
    [c.condition, t.conditions[order.item.condition]],
    [c.offer, money(order.finalPrice ?? order.item.quotedPrice)],
    [c.payment, PAYOUT_LABELS[order.payout.method]],
    ...(loc ? ([[c.dropoff, loc.name]] as [string, string][]) : []),
    [c.validUntil, fmtDate(order.expiresAt, lang)],
  ];
}

function summaryTable(order: Order) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-top:1px solid ${LINE}">
${summaryRows(order)
  .map(
    ([k, v]) =>
      `<tr><td style="padding:9px 0;border-bottom:1px solid ${LINE};color:${MUTED};font-size:14px">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid ${LINE};text-align:right;font-weight:600;font-size:14px">${esc(v)}</td></tr>`,
  )
  .join("\n")}
</table>`;
}

function button(href: string, label: string) {
  return `<p style="margin:22px 0"><a href="${esc(href)}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:12px">${esc(label)}</a></p>`;
}

const list = (items: string[], ordered = false) =>
  `<${ordered ? "ol" : "ul"} style="margin:8px 0 0;padding-left:20px">${items.map((i) => `<li style="margin:4px 0">${esc(i)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;

/** Sent automatically when the customer accepts an offer. */
export function orderConfirmationEmail(order: Order): EmailMessage {
  const lang = langOf(order);
  const c = COPY[lang];
  const P = policyFor(dictFor(lang));
  const orderUrl = `${siteUrl()}/order/${order.id}`;
  const name = greetName(order, c);
  const loc = orderCountry(order) === "PA" ? getLocation(order.dropoff?.locationId) : undefined;
  const locText = loc ? `${loc.name} (${loc.area})` : "";
  const next = loc
    ? fmtHtml(c.nextDropoff, { location: locText, date: fmtDate(order.expiresAt, lang) })
    : fmtHtml(c.nextShip, { labelWithin: P.labelWithin });
  const hi = fmtHtml(c.hi, { name }).replace(/^(Hola|Hi) ,/, "$1,");

  const html = layout(
    lang,
    c.acceptedTitle,
    `<p style="margin:0">${hi}</p>
${summaryTable(order)}
<p style="margin:0">${next}</p>
${loc ? `<p style="margin:8px 0 0"><a href="${esc(mapsUrl(loc))}" style="color:${BLUE};font-weight:600">${esc(c.map)}</a></p>
<p style="margin:8px 0 0">${esc(c.coordinate)} <a href="${CONTACT.whatsappUrl}" style="color:${BLUE};font-weight:600">${esc(CONTACT.whatsapp)}</a></p>` : ""}
<p style="margin:16px 0 0"><strong>${esc(c.getReady)}</strong></p>
${list(c.prep)}
${button(orderUrl, c.viewOrder)}
<p style="margin:0;color:${MUTED};font-size:13px">${fmtHtml(c.keepNumber, { id: order.id })}</p>`,
  );
  const text = `${c.acceptedTitle}

${stripTags(hi)}

${summaryRows(order)
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}

${stripTags(next)}${loc ? `\n${mapsUrl(loc)}\n${c.coordinate} ${CONTACT.whatsapp}` : ""}

${c.getReady}
${c.prep.map((p) => `- ${p}`).join("\n")}

${c.viewOrder}: ${orderUrl}

${c.questions} ${CONTACT.email}`;
  return { to: order.customer.email, subject: fmt(c.acceptedSubject, { id: order.id }), html, text };
}

/** Sent from the admin once the prepaid label is created (U.S. orders only). */
export function shippingLabelEmail(order: Order): EmailMessage {
  const lang = langOf(order);
  const c = COPY[lang];
  const P = policyFor(dictFor(lang));
  const label = order.label!;
  // Links only to our own domain: links to a third-party label host in a "print your label" email look like phishing to spam filters.
  const orderUrl = `${siteUrl()}/order/${order.id}`;
  const name = greetName(order, c);
  const device = `${order.item.modelName} ${order.item.storage}`;
  const price = money(order.finalPrice ?? order.item.quotedPrice);
  const hi = fmtHtml(c.labelHi, { name, id: order.id, device }).replace(/^(Hola|Hi) ,/, "$1,");
  const shipBy = fmtHtml(c.shipBy, { date: fmtDate(order.expiresAt, lang), price });
  const after = fmt(c.afterArrive, { inspection: P.inspectionWithin, payment: P.paymentWithin });

  const html = layout(
    lang,
    c.labelTitle,
    `<p style="margin:0">${hi}</p>
${button(orderUrl, c.labelButton)}
<p style="margin:0"><strong>${esc(c.howToShip)}</strong></p>
${list(c.shipSteps, true)}
<p style="margin:16px 0 0">${shipBy}</p>
${label.tracking ? `<p style="margin:12px 0 0">${esc(c.tracking)} <strong>${esc(label.tracking)}</strong></p>` : ""}
<p style="margin:16px 0 0"><strong>${esc(c.beforeShip)}</strong></p>
${list(c.prep)}
<p style="margin:16px 0 0">${esc(after)}</p>
<p style="margin:16px 0 0;color:${MUTED};font-size:13px">${esc(c.findLabel)} ${esc(orderUrl.replace(/^https?:\/\//, ""))}</p>`,
  );
  const text = `${c.labelTitle}

${stripTags(hi)}

${c.labelButton}: ${orderUrl}

${c.howToShip}
${c.shipSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

${stripTags(shipBy)}
${label.tracking ? `${c.tracking} ${label.tracking}\n` : ""}
${c.beforeShip}
${c.prep.map((p) => `- ${p}`).join("\n")}

${after}

${c.questions} ${CONTACT.email}`;
  return { to: order.customer.email, subject: fmt(c.labelSubject, { id: order.id }), html, text };
}
