"use server";

import { redirect } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { type Order, type PayoutMethod, newOrderId, quoteById, saveOrder } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail } from "@/lib/emails";
import { parseAnswers } from "@/lib/quote-params";

export interface CheckoutState {
  error?: string;
  /** What the customer typed, sent back so the form keeps it after an error. */
  values?: Record<string, string>;
}

const PAYOUTS: PayoutMethod[] = ["paypal", "zelle"];

export async function createOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const str = (k: string) => String(form.get(k) ?? "").trim();
  const values = Object.fromEntries([...form.entries()].map(([k, v]) => [k, String(v)]));
  const fail = (error: string): CheckoutState => ({ error, values });

  const data = await quoteById(str("v"));
  const parsed = parseAnswers((k) => str(k));
  if (!data || !parsed) return fail("This offer is no longer valid. Please start again.");

  const email = str("email").toLowerCase();
  const payoutMethod = str("payoutMethod") as PayoutMethod;
  const required = ["name", "email", "line1", "city", "state", "zip"];
  if (required.some((k) => !str(k))) return fail("Please fill in all required fields.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Please enter a valid email address.");
  if (!/^\d{5}(-\d{4})?$/.test(str("zip"))) return fail("Please enter a valid ZIP code.");
  if (!PAYOUTS.includes(payoutMethod)) return fail("Please choose how you want to be paid.");
  const handle = str("payoutHandle");
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handle);
  const isUsPhone = /^\+?1?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(handle);
  if (payoutMethod === "paypal" && !isEmail) return fail("Please enter the email address of your PayPal account.");
  if (payoutMethod === "zelle" && !isEmail && !isUsPhone) return fail("Please enter the email or U.S. mobile number enrolled in Zelle.");
  if (payoutMethod === "zelle" && !str("payoutName")) return fail("Please enter the full name on your Zelle account.");
  if (handle !== str("payoutHandleConfirm")) return fail("The payment details don't match. Please check and type them again.");
  if (form.get("terms") !== "on") return fail("Please confirm the device is yours and accept the terms.");

  const now = new Date();
  const expires = new Date(now.getTime() + data.settings.offerValidDays * 86_400_000);
  const quotedPrice = data.quote.offers[parsed.condition];

  const order: Order = {
    id: newOrderId(),
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: "awaiting_device",
    customer: { name: str("name"), email, phone: str("phone") },
    address: { line1: str("line1"), line2: str("line2"), city: str("city"), state: str("state").toUpperCase(), zip: str("zip") },
    payout: { method: payoutMethod, handle, accountName: payoutMethod === "zelle" ? str("payoutName") : undefined },
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
    history: [{ at: now.toISOString(), status: "awaiting_device", note: `Offer accepted: $${quotedPrice} (${CARRIER_LABELS[data.carrier]})` }],
  };

  await saveOrder(order);

  // Confirmation email. A failure never blocks the order; it's recorded in the order history for the admin.
  const sent = await sendEmail(orderConfirmationEmail(order)).catch((e) => ({ ok: false, mode: "smtp", detail: String(e) }));
  order.history.push({
    at: new Date().toISOString(),
    status: order.status,
    note: sent.ok ? `Confirmation email sent to ${email}${sent.mode === "outbox" ? " (local preview)" : ""}` : `Confirmation email NOT sent: ${sent.detail}`,
  });
  await saveOrder(order);

  redirect(`/order/${order.id}?new=1`);
}
