import { randomBytes } from "crypto";
import type { CarrierId } from "@/data/catalog";
import type { Lang } from "@/i18n/config";
import { parseVariantId } from "@/data/catalog";
import { findOrder, getDoc, listOrders, setDoc, upsertOrder } from "./store";
import {
  type Answers,
  type Condition,
  type PricingSettings,
  type ResaleOverrides,
  mergeSettings,
  quoteVariant,
} from "./pricing";

// ---------- Pricing data ----------

export async function getSettings(): Promise<PricingSettings> {
  return mergeSettings(await getDoc<Partial<PricingSettings> | null>("settings", null));
}

export async function saveSettings(settings: PricingSettings) {
  await setDoc("settings", settings);
}

export async function getOverrides(): Promise<ResaleOverrides> {
  return getDoc<ResaleOverrides>("resale-overrides", {});
}

export async function saveOverrides(overrides: ResaleOverrides) {
  await setDoc("resale-overrides", overrides);
}

export async function quoteById(variant: string, now = new Date()) {
  const parsed = parseVariantId(variant);
  if (!parsed) return null;
  const [settings, overrides] = await Promise.all([getSettings(), getOverrides()]);
  return { ...parsed, quote: quoteVariant(parsed.model, parsed.storage, parsed.carrier, settings, overrides, now), settings };
}

// ---------- Calibration references (competitor prices checked by hand) ----------

export interface CalibrationRef {
  id: string;
  variantId: string;
  condition: Condition;
  referencePrice: number;
  source: string;
  checkedAt: string;
}

const SEED_REFS: CalibrationRef[] = [
  { id: "seed-good", variantId: "iphone-17-pro__256gb__unlocked", condition: "good", referencePrice: 663, source: "Gazelle", checkedAt: "2026-10-14" },
  { id: "seed-fair", variantId: "iphone-17-pro__256gb__unlocked", condition: "fair", referencePrice: 636, source: "Gazelle", checkedAt: "2026-10-14" },
  { id: "seed-poor", variantId: "iphone-17-pro__256gb__unlocked", condition: "poor", referencePrice: 378, source: "Gazelle", checkedAt: "2026-10-14" },
  { id: "seed-broken", variantId: "iphone-17-pro__256gb__unlocked", condition: "broken", referencePrice: 274, source: "Gazelle", checkedAt: "2026-10-14" },
  { id: "seed-17pm-256-unl", variantId: "iphone-17-pro-max__256gb__unlocked", condition: "good", referencePrice: 745, source: "Gazelle", checkedAt: "2026-10-18" },
  { id: "seed-17pm-1tb-unl", variantId: "iphone-17-pro-max__1tb__unlocked", condition: "good", referencePrice: 811, source: "Gazelle", checkedAt: "2026-10-18" },
  { id: "seed-17pm-1tb-att", variantId: "iphone-17-pro-max__1tb__att", condition: "good", referencePrice: 726, source: "Gazelle", checkedAt: "2026-10-18" },
];

export async function getCalibrationRefs() {
  return getDoc<CalibrationRef[]>("calibration", SEED_REFS);
}

export async function saveCalibrationRefs(refs: CalibrationRef[]) {
  await setDoc("calibration", refs);
}

// ---------- Orders ----------

export type OrderStatus =
  | "awaiting_device"
  | "awaiting_dropoff"
  | "label_sent"
  | "received"
  | "inspecting"
  | "countered"
  | "approved"
  | "paid"
  | "returned"
  | "cancelled";

/** `en` = what the customer sees; `admin` = the internal label in the admin panel. */
export const STATUS_LABELS: Record<OrderStatus, { en: string; admin: string }> = {
  awaiting_device: { en: "Preparing your shipping label", admin: "Awaiting label" },
  awaiting_dropoff: { en: "Waiting for your drop-off", admin: "Awaiting drop-off (PA)" },
  label_sent: { en: "Shipping label sent — waiting for your device", admin: "Label sent" },
  received: { en: "Device received", admin: "Received" },
  inspecting: { en: "Inspecting", admin: "Inspecting" },
  countered: { en: "Revised offer sent", admin: "Counter-offer sent" },
  approved: { en: "Approved — payment processing", admin: "Approved (to pay)" },
  paid: { en: "Paid", admin: "Paid" },
  returned: { en: "Returned to you", admin: "Returned" },
  cancelled: { en: "Cancelled", admin: "Cancelled" },
};

// "check" is kept only so older orders still type-check. U.S.: PayPal / Zelle. Panama: Yappy / ACH.
export type PayoutMethod = "paypal" | "zelle" | "yappy" | "ach" | "check";
export type Country = "US" | "PA";
export const PAYOUTS_BY_COUNTRY: Record<Country, PayoutMethod[]> = { US: ["paypal", "zelle"], PA: ["yappy", "ach"] };
export const PAYOUT_LABELS: Record<PayoutMethod, string> = { paypal: "PayPal", zelle: "Zelle", yappy: "Yappy", ach: "ACH", check: "Check" };
/** Orders created before Panama existed have no country: they're U.S. orders. */
export const orderCountry = (o: Order): Country => o.country ?? "US";

export interface Order {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: OrderStatus;
  /** Where the customer sells from. Missing on older orders (= US). */
  country?: Country;
  /** Language the customer used on the site; emails are sent in it. Missing = English. */
  lang?: Lang;
  /** Panama only: the drop-off location id (see lib/locations.ts). U.S. orders ship with a prepaid label. */
  dropoff?: { locationId: string };
  customer: { name: string; email: string; phone: string };
  address: { line1: string; line2: string; city: string; state: string; zip: string };
  /**
   * handle = PayPal email, Zelle email / US mobile, Yappy mobile, or ACH account number.
   * accountName = name on the Zelle / Yappy / bank account. bank + accountType: ACH only.
   */
  payout: {
    method: PayoutMethod;
    handle: string;
    accountName?: string;
    bank?: string;
    accountType?: "savings" | "checking";
    /** Panama: the customer will give their Yappy / ACH details at the store. */
    pending?: boolean;
  };
  item: {
    variantId: string;
    modelName: string;
    storage: string;
    carrier: CarrierId;
    condition: Condition;
    answers: Answers;
    quotedPrice: number;
  };
  /** Prepaid return label created in Pirate Ship (or similar) and emailed to the customer. */
  label?: { url: string; tracking?: string; sentAt: string };
  finalPrice: number | null;
  history: { at: string; status: OrderStatus; note: string }[];
}

export async function getOrders() {
  return listOrders<Order>();
}

export async function getOrder(id: string) {
  return findOrder<Order>(id.trim().toUpperCase());
}

export async function saveOrder(order: Order) {
  await upsertOrder(order);
}

export function newOrderId() {
  // Unambiguous characters only (no 0/O, 1/I).
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  return "PT-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
