import { CARRIER_LABELS } from "@/data/catalog";
import { CONTACT } from "./contact";
import type { Order } from "./db";
import type { EmailMessage } from "./email";
import { siteUrl } from "./email";
import { CONDITION_LABELS } from "./pricing";
import { POLICY } from "./policy";

// Transactional email templates. Inline styles only (email clients ignore stylesheets).

const NAVY = "#0B1640";
const BLUE = "#342CFF";
const MUTED = "#5B6475";
const LINE = "#E2E7F0";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

const PREP = [
  "Back up your data.",
  "Sign out of your Apple, Google or Samsung account and turn off Find My or device protection.",
  "Factory reset the device and remove the SIM card.",
  "Send only the device — no case, charger, cable or box.",
];

function layout(title: string, bodyHtml: string) {
  const base = siteUrl();
  return `<!doctype html><html><body style="margin:0;background:#F5F7FB;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${NAVY}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FB;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid ${LINE};border-radius:16px">
<tr><td style="padding:28px 28px 8px"><img src="${base}/brand/primeteq-logo.png" alt="Prime Teq" width="150" style="display:block;height:auto;border:0"></td></tr>
<tr><td style="padding:12px 28px 4px"><h1 style="margin:0;font-size:24px;line-height:1.25;color:${NAVY}">${esc(title)}</h1></td></tr>
<tr><td style="padding:8px 28px 28px;font-size:15px;line-height:1.6;color:#1E2A52">${bodyHtml}</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:${MUTED};text-align:center">
Questions? Reply to this email or write to <a href="mailto:${CONTACT.email}" style="color:${BLUE}">${CONTACT.email}</a>.<br>
Prime Teq · <a href="${base}" style="color:${MUTED}">${CONTACT.website}</a> · <a href="${CONTACT.instagramUrl}" style="color:${MUTED}">${CONTACT.instagramHandle}</a>
</p>
</td></tr></table></body></html>`;
}

function summaryTable(order: Order) {
  const rows: [string, string][] = [
    ["Order", order.id],
    ["Device", `${order.item.modelName} ${order.item.storage}`],
    ["Carrier", CARRIER_LABELS[order.item.carrier]],
    ["Condition", CONDITION_LABELS[order.item.condition]],
    ["Your offer", money(order.finalPrice ?? order.item.quotedPrice)],
    ["Payment", order.payout.method === "paypal" ? "PayPal" : order.payout.method === "zelle" ? "Zelle" : "Check"],
    ["Offer valid until", fmtDate(order.expiresAt)],
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-top:1px solid ${LINE}">
${rows
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
  const orderUrl = `${siteUrl()}/order/${order.id}`;
  const first = order.customer.name.split(" ")[0] || "there";
  const html = layout(
    "Your offer is accepted",
    `<p style="margin:0">Hi ${esc(first)}, thanks for selling with Prime Teq. Here’s your order:</p>
${summaryTable(order)}
<p style="margin:0"><strong>What’s next:</strong> we’ll email your free prepaid shipping label and instructions within ${POLICY.labelWithin}.</p>
<p style="margin:16px 0 0"><strong>Get your device ready:</strong></p>
${list(PREP)}
${button(orderUrl, "View your order")}
<p style="margin:0;color:${MUTED};font-size:13px">Keep your order number (${esc(order.id)}) to track your order at any time.</p>`,
  );
  const text = `Your offer is accepted

Hi ${first}, thanks for selling with Prime Teq.

Order: ${order.id}
Device: ${order.item.modelName} ${order.item.storage} (${CARRIER_LABELS[order.item.carrier]})
Condition: ${CONDITION_LABELS[order.item.condition]}
Your offer: ${money(order.finalPrice ?? order.item.quotedPrice)}
Offer valid until: ${fmtDate(order.expiresAt)}

What's next: we'll email your free prepaid shipping label and instructions within ${POLICY.labelWithin}.

Get your device ready:
${PREP.map((p) => `- ${p}`).join("\n")}

View your order: ${orderUrl}

Questions? ${CONTACT.email}`;
  return { to: order.customer.email, subject: `Your Prime Teq offer is accepted — order ${order.id}`, html, text };
}

/** Sent from the admin once the prepaid label is created. */
export function shippingLabelEmail(order: Order): EmailMessage {
  const label = order.label!;
  // Links only to our own domain: links to a third-party label host in a "print your label" email look like phishing to spam filters.
  const orderUrl = `${siteUrl()}/order/${order.id}`;
  const first = order.customer.name.split(" ")[0] || "there";
  const steps = [
    "Click “View & print your label” above, then print it (any printer works).",
    "Wrap the device in padding and put it in a small, sturdy box so it can’t move.",
    "Tape the label to the box and drop it off with the carrier shown on the label.",
  ];
  const html = layout(
    "Your shipping label is ready",
    `<p style="margin:0">Hi ${esc(first)}, here’s your prepaid shipping label for order <strong>${esc(order.id)}</strong> (${esc(order.item.modelName)} ${esc(order.item.storage)}).</p>
${button(orderUrl, "View & print your label")}
<p style="margin:0"><strong>How to ship:</strong></p>
${list(steps, true)}
<p style="margin:16px 0 0">Please ship by <strong>${fmtDate(order.expiresAt)}</strong> to keep your offer of <strong>${money(order.finalPrice ?? order.item.quotedPrice)}</strong>.</p>
${label.tracking ? `<p style="margin:12px 0 0">Tracking number: <strong>${esc(label.tracking)}</strong></p>` : ""}
<p style="margin:16px 0 0"><strong>Before you ship, make sure you:</strong></p>
${list(PREP)}
<p style="margin:16px 0 0">Once your device arrives, we inspect it within ${POLICY.inspectionWithin} and send your payment within ${POLICY.paymentWithin} of approval.</p>
<p style="margin:16px 0 0;color:#5B6475;font-size:13px">You can also find your label any time on your order page: ${esc(orderUrl.replace(/^https?:\/\//, ""))}</p>`,
  );
  const text = `Your shipping label is ready

Hi ${first}, here's your prepaid shipping label for order ${order.id} (${order.item.modelName} ${order.item.storage}).

View and print your label: ${orderUrl}

How to ship:
${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Please ship by ${fmtDate(order.expiresAt)} to keep your offer of ${money(order.finalPrice ?? order.item.quotedPrice)}.
${label.tracking ? `Tracking number: ${label.tracking}\n` : ""}
Before you ship:
${PREP.map((p) => `- ${p}`).join("\n")}

Questions? ${CONTACT.email}`;
  return { to: order.customer.email, subject: `Your Prime Teq shipping label — order ${order.id}`, html, text };
}
