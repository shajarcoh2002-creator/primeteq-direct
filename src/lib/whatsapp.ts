import { CARRIER_LABELS } from "@/data/catalog";
import { type Order, PAYOUT_LABELS, orderCountry } from "./db";
import { CONTACT } from "./contact";
import { siteUrl } from "./email";
import { getLocation } from "./locations";
import { CONDITION_LABELS } from "./pricing";

// Automatic WhatsApp alert to the manager on every new order, via the WhatsApp Cloud API (Meta).
//
// Env vars (Vercel → Settings → Environment Variables):
//   WHATSAPP_TOKEN            permanent access token of the Meta system user
//   WHATSAPP_PHONE_NUMBER_ID  id of the business number that sends the alert
//   WHATSAPP_NOTIFY_TO        optional: manager number(s), international format, comma-separated (default: CONTACT.managerWhatsapp)
//   WHATSAPP_TEMPLATE         approved template name (e.g. nueva_orden). Without it a plain text is sent,
//                             which WhatsApp only delivers if the manager wrote to the business number in the last 24 h.
//   WHATSAPP_TEMPLATE_LANG    template language code (default "es")
//
// The template body must have exactly these 8 variables, in this order:
//   Nueva orden {{1}} · Equipo: {{2}} · Oferta: {{3}} · Cliente: {{4}} · Contacto: {{5}} · Pago: {{6}} · Entrega: {{7}} · Ver: {{8}}

const GRAPH = "https://graph.facebook.com/v21.0";

export const whatsappConfigured = () => Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

const recipients = () =>
  (process.env.WHATSAPP_NOTIFY_TO?.trim() || CONTACT.managerWhatsapp)
    .split(",")
    .map((n) => n.replace(/\D/g, ""))
    .filter(Boolean);

/** The 8 template values for an order (no newlines: WhatsApp rejects them in template parameters). */
export function orderSummaryFields(order: Order) {
  const loc = getLocation(order.dropoff?.locationId);
  const pa = orderCountry(order) === "PA";
  const price = order.finalPrice ?? order.item.quotedPrice;
  const a = order.address;
  return [
    order.id,
    `${order.item.modelName} ${order.item.storage} · ${CARRIER_LABELS[order.item.carrier]} · ${CONDITION_LABELS[order.item.condition]}`,
    `$${price.toLocaleString("en-US")}`,
    order.customer.name,
    [order.customer.phone, order.customer.email].filter(Boolean).join(" · "),
    [PAYOUT_LABELS[order.payout.method], order.payout.bank, order.payout.accountName].filter(Boolean).join(" · "),
    pa ? `Drop-off Panamá: ${loc?.name ?? order.dropoff?.locationId ?? "—"}` : `Envío EE. UU.: ${a.city}, ${a.state} ${a.zip}`,
    `${siteUrl()}/admin/orders/${order.id}`,
  ].map((s) => s.replace(/\s+/g, " ").trim() || "—");
}

/** Multi-line summary for the "Send by WhatsApp" button in the admin and for plain-text alerts. */
export function orderSummaryText(order: Order) {
  const [id, device, price, name, contact, payout, delivery, link] = orderSummaryFields(order);
  return [
    `*Nueva orden ${id}*`,
    `Equipo: ${device}`,
    `Oferta: ${price}`,
    `Cliente: ${name}`,
    `Contacto: ${contact}`,
    `Pago: ${payout}`,
    `Entrega: ${delivery}`,
    `Ver: ${link}`,
  ].join("\n");
}

/** wa.me link that opens WhatsApp with the summary ready to send. */
export function whatsappShareUrl(order: Order) {
  const to = recipients()[0] ?? "";
  return `https://wa.me/${to}?text=${encodeURIComponent(orderSummaryText(order))}`;
}

export async function notifyNewOrder(order: Order): Promise<{ ok: boolean; detail: string }> {
  if (!whatsappConfigured()) return { ok: false, detail: "not configured (WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID missing)" };
  const template = process.env.WHATSAPP_TEMPLATE?.trim();

  const results = await Promise.all(
    recipients().map(async (to) => {
      const body = template
        ? {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
              name: template,
              language: { code: process.env.WHATSAPP_TEMPLATE_LANG?.trim() || "es" },
              components: [{ type: "body", parameters: orderSummaryFields(order).map((text) => ({ type: "text", text })) }],
            },
          }
        : { messaging_product: "whatsapp", to, type: "text", text: { body: orderSummaryText(order), preview_url: false } };
      const res = await fetch(`${GRAPH}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return { ok: true, to };
      const err = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      return { ok: false, to, error: `${res.status} ${err?.error?.message ?? res.statusText}` };
    }),
  );

  const failed = results.filter((r) => !r.ok);
  const mask = (n: string) => `…${n.slice(-4)}`;
  if (failed.length === results.length) return { ok: false, detail: failed.map((f) => `${mask(f.to)}: ${f.error}`).join("; ") };
  return { ok: true, detail: `${results.length - failed.length}/${results.length} recipients${template ? "" : ", plain text"}` };
}
