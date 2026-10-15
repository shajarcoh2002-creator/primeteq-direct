import { randomBytes } from "crypto";
import type { CarrierId } from "@/data/catalog";
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
  | "received"
  | "inspecting"
  | "countered"
  | "approved"
  | "paid"
  | "returned"
  | "cancelled";

export const STATUS_LABELS: Record<OrderStatus, { en: string; es: string }> = {
  awaiting_device: { en: "Waiting for your device", es: "Esperando equipo" },
  received: { en: "Device received", es: "Recibido" },
  inspecting: { en: "Inspecting", es: "En inspección" },
  countered: { en: "Revised offer sent", es: "Contraoferta enviada" },
  approved: { en: "Approved — payment processing", es: "Aprobado (por pagar)" },
  paid: { en: "Paid", es: "Pagado" },
  returned: { en: "Returned to you", es: "Devuelto" },
  cancelled: { en: "Cancelled", es: "Cancelado" },
};

export type PayoutMethod = "paypal" | "zelle" | "check";

export interface Order {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: OrderStatus;
  customer: { name: string; email: string; phone: string };
  address: { line1: string; line2: string; city: string; state: string; zip: string };
  payout: { method: PayoutMethod; handle: string };
  item: {
    variantId: string;
    modelName: string;
    storage: string;
    carrier: CarrierId;
    condition: Condition;
    answers: Answers;
    quotedPrice: number;
  };
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
