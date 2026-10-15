"use server";

import { redirect } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { type Order, type PayoutMethod, newOrderId, quoteById, saveOrder } from "@/lib/db";
import { parseAnswers } from "@/lib/quote-params";

export interface CheckoutState {
  error?: string;
}

const PAYOUTS: PayoutMethod[] = ["paypal", "zelle", "check"];

export async function createOrder(_prev: CheckoutState, form: FormData): Promise<CheckoutState> {
  const str = (k: string) => String(form.get(k) ?? "").trim();

  const data = await quoteById(str("v"));
  const parsed = parseAnswers((k) => str(k));
  if (!data || !parsed) return { error: "This offer is no longer valid. Please start again." };

  const email = str("email").toLowerCase();
  const payoutMethod = str("payoutMethod") as PayoutMethod;
  const required = ["name", "email", "line1", "city", "state", "zip"];
  if (required.some((k) => !str(k))) return { error: "Please fill in all required fields." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Please enter a valid email address." };
  if (!/^\d{5}(-\d{4})?$/.test(str("zip"))) return { error: "Please enter a valid ZIP code." };
  if (!PAYOUTS.includes(payoutMethod)) return { error: "Please choose how you want to be paid." };
  if (payoutMethod !== "check" && !str("payoutHandle")) return { error: "Please enter your PayPal or Zelle account." };
  if (form.get("terms") !== "on") return { error: "Please confirm the device is yours and accept the terms." };

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
    payout: { method: payoutMethod, handle: payoutMethod === "check" ? "" : str("payoutHandle") },
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
  redirect(`/order/${order.id}?new=1`);
}
