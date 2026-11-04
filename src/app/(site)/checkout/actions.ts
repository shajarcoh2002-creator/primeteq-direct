"use server";

import { redirect } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { getDict, getLang } from "@/i18n/server";
import { type Country, type Order, type PayoutMethod, PAYOUTS_BY_COUNTRY, newOrderId, quoteById, saveOrder } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/emails";
import { getLocation } from "@/lib/locations";
import { parseAnswers } from "@/lib/quote-params";
import { notifyNewOrder } from "@/lib/whatsapp";

export interface CheckoutState {
  error?: string;
  /** What the customer typed, sent back so the form keeps it after an error. */
  values?: Record<string, string>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const US_PHONE = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
/** Panama mobile: 8 digits starting with 6, optional +507. */
const PA_MOBILE = /^(\+?507[\s-]?)?6\d{3}[\s-]?\d{4}$/;
const digits = (s: string) => s.replace(/\D/g, "");

export async function createOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const [t, lang] = await Promise.all([getDict(), getLang()]);
  const E = t.checkout.errors;
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  const fail = (error: string): CheckoutState => ({ error, values });

  const data = await quoteById(str("v"));
  const parsed = parseAnswers((k) => str(k));
  if (!data || !parsed) return fail(E.expired);

  const country = str("country") as Country;
  if (country !== "US" && country !== "PA") return fail(E.country);

  const email = str("email").toLowerCase();
  const phone = str("phone");
  const required = country === "US" ? ["name", "email", "line1", "city", "state", "zip"] : ["name", "email", "phone"];
  if (required.some((k) => !str(k))) return fail(E.required);
  if (!EMAIL.test(email)) return fail(E.email);
  if (phone && digits(phone).length < 7) return fail(E.phone);
  if (country === "US" && !/^\d{5}(-\d{4})?$/.test(str("zip"))) return fail(E.zip);

  const payoutMethod = str("payoutMethod") as PayoutMethod;
  if (!PAYOUTS_BY_COUNTRY[country].includes(payoutMethod)) return fail(E.payout);
  const handle = str("payoutHandle");
  const payout: Order["payout"] = { method: payoutMethod, handle };

  if (payoutMethod === "paypal" && !EMAIL.test(handle)) return fail(E.paypal);
  if (payoutMethod === "zelle") {
    if (!EMAIL.test(handle) && !US_PHONE.test(handle)) return fail(E.zelle);
    if (!str("payoutName")) return fail(E.zelleName);
    payout.accountName = str("payoutName");
  }
  if (payoutMethod === "yappy") {
    if (!PA_MOBILE.test(handle)) return fail(E.yappy);
    if (!str("payoutName")) return fail(E.yappyName);
    payout.accountName = str("payoutName");
  }
  if (payoutMethod === "ach") {
    const bank = str("achBank") === "other" ? str("achBankOther") : str("achBank");
    const accountType = str("achType");
    if (!bank || (accountType !== "savings" && accountType !== "checking") || digits(handle).length < 5 || !str("payoutName")) return fail(E.ach);
    Object.assign(payout, { bank, accountType, accountName: str("payoutName") });
  }
  // Compare ignoring spaces/dashes so "6123-4567" matches "61234567".
  const norm = (s: string) => (EMAIL.test(s) ? s.toLowerCase() : s.replace(/[\s.()-]/g, ""));
  if (norm(handle) !== norm(str("payoutHandleConfirm"))) return fail(E.mismatch);
  if (payoutMethod === "yappy") payout.handle = digits(handle).replace(/^507(?=\d{8}$)/, "");
  if (payoutMethod === "ach") payout.handle = digits(handle);

  const location = country === "PA" ? getLocation(str("dropoff")) : undefined;
  if (country === "PA" && !location) return fail(E.location);
  if (form.get("terms") !== "on") return fail(E.terms);

  const now = new Date();
  const expires = new Date(now.getTime() + data.settings.offerValidDays * 86_400_000);
  const quotedPrice = data.quote.offers[parsed.condition];
  const status = country === "PA" ? "awaiting_dropoff" : "awaiting_device";

  const order: Order = {
    id: newOrderId(),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status,
    country,
    lang,
    dropoff: location ? { locationId: location.id } : undefined,
    customer: { name: str("name"), email, phone },
    address:
      country === "US"
        ? { line1: str("line1"), line2: str("line2"), city: str("city"), state: str("state").toUpperCase(), zip: str("zip") }
        : { line1: "", line2: "", city: "", state: "", zip: "" },
    payout,
    item: {
      variantId: str("v"),
      modelName: data.model.name,
      storage: data.storage.label,
      carrier: data.carrier,
      condition: parsed.condition,
      answers: parsed.answers,
      quotedPrice,
    },
    finalPrice: null,
    history: [
      {
        at: now.toISOString(),
        status,
        note: `Offer accepted: $${quotedPrice} (${CARRIER_LABELS[data.carrier]})${location ? ` · drop-off at ${location.name}` : ""}`,
      },
    ],
  };

  await saveOrder(order);

  // Confirmation email + WhatsApp alert to the manager. Failures never block the order; they're logged in its history.
  const [sent, wa] = await Promise.all([
    sendEmail(orderConfirmationEmail(order)).catch((e) => ({ ok: false, mode: "smtp", detail: String(e) })),
    notifyNewOrder(order).catch((e) => ({ ok: false, detail: String(e) })),
  ]);
  const at = new Date().toISOString();
  order.history.push({
    at,
    status,
    note: sent.ok ? `Confirmation email sent to ${email}${sent.mode === "outbox" ? " (local preview)" : ""}` : `Confirmation email NOT sent: ${sent.detail}`,
  });
  order.history.push({ at, status, note: wa.ok ? `WhatsApp alert sent to manager${wa.detail ? ` (${wa.detail})` : ""}` : `WhatsApp alert NOT sent: ${wa.detail}` });
  await saveOrder(order);

  redirect(`/order/${order.id}?new=1`);
}
