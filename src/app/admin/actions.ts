"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CurveId } from "@/data/catalog";
import { parseVariantId } from "@/data/catalog";
import { requireAdmin } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { orderConfirmationEmail, shippingLabelEmail } from "@/lib/emails";
import {
  type OrderStatus,
  STATUS_LABELS,
  getCalibrationRefs,
  getOrder,
  getOverrides,
  getSettings,
  quoteById,
  saveCalibrationRefs,
  saveOrder,
  saveOverrides,
  saveSettings,
} from "@/lib/db";
import { CONDITIONS, type Condition, DEFAULT_SETTINGS, type PricingSettings, resaleKey } from "@/lib/pricing";

const num = (form: FormData, key: string) => {
  const n = Number(String(form.get(key) ?? "").replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

// ---------- Orders ----------

export async function updateOrder(form: FormData) {
  await requireAdmin();
  const order = await getOrder(String(form.get("id")));
  if (!order) return;
  const status = String(form.get("status")) as OrderStatus;
  if (!(status in STATUS_LABELS)) return;
  const final = String(form.get("finalPrice") ?? "").trim();
  const finalPrice = final === "" ? null : num(form, "finalPrice");
  const note = String(form.get("note") ?? "").trim();

  order.status = status;
  if (finalPrice === null || Number.isFinite(finalPrice)) order.finalPrice = finalPrice;
  order.history.push({ at: new Date().toISOString(), status, note });
  await saveOrder(order);
  revalidatePath("/admin");
  redirect(`/admin/orders/${order.id}`);
}

/** Saves the prepaid label link (from Pirate Ship) and emails it to the customer. */
export async function sendLabel(form: FormData) {
  await requireAdmin();
  const order = await getOrder(String(form.get("id")));
  if (!order) return;
  const url = String(form.get("labelUrl") ?? "").trim();
  const tracking = String(form.get("tracking") ?? "").trim();
  if (!/^https:\/\/\S+$/i.test(url)) redirect(`/admin/orders/${order.id}?label=invalid`);

  order.label = { url, tracking: tracking || undefined, sentAt: new Date().toISOString() };
  if (order.status === "awaiting_device") order.status = "label_sent";
  const sent = await sendEmail(shippingLabelEmail(order)).catch((e) => ({ ok: false, mode: "smtp" as const, detail: String(e) }));
  order.history.push({
    at: new Date().toISOString(),
    status: order.status,
    note: sent.ok
      ? `Shipping label emailed to ${order.customer.email}${sent.mode === "outbox" ? " (local preview)" : ""}${tracking ? ` · tracking ${tracking}` : ""}`
      : `Shipping label saved but email NOT sent: ${sent.detail}`,
  });
  await saveOrder(order);
  revalidatePath("/admin");
  redirect(`/admin/orders/${order.id}?label=${sent.ok ? "sent" : "failed"}`);
}

/** Re-sends the order confirmation email (e.g. if email wasn't configured when the order came in). */
export async function resendConfirmation(form: FormData) {
  await requireAdmin();
  const order = await getOrder(String(form.get("id")));
  if (!order) return;
  const sent = await sendEmail(orderConfirmationEmail(order)).catch((e) => ({ ok: false, mode: "smtp" as const, detail: String(e) }));
  order.history.push({
    at: new Date().toISOString(),
    status: order.status,
    note: sent.ok ? `Confirmation email re-sent to ${order.customer.email}` : `Confirmation email NOT sent: ${sent.detail}`,
  });
  await saveOrder(order);
  redirect(`/admin/orders/${order.id}?confirmation=${sent.ok ? "sent" : "failed"}`);
}

// ---------- Pricing formula ----------

function parseCurve(text: string): [number, number][] | null {
  const points = text
    .split(/[,;\n]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.split(":").map((x) => Number(x.trim())) as [number, number]);
  if (points.length < 2 || points.some(([a, b]) => !Number.isFinite(a) || !Number.isFinite(b))) return null;
  return points.sort((a, b) => a[0] - b[0]);
}

export async function savePricing(form: FormData) {
  await requireAdmin();
  const current = await getSettings();
  const next: PricingSettings = structuredClone(current);

  for (const k of Object.keys(next.costs) as (keyof PricingSettings["costs"])[]) {
    const v = num(form, `costs.${k}`);
    if (Number.isFinite(v)) next.costs[k] = v;
  }
  for (const k of Object.keys(next.conditionPct) as Condition[]) {
    const v = num(form, `condition.${k}`);
    if (Number.isFinite(v)) next.conditionPct[k] = v;
  }
  for (const k of Object.keys(next.carrierPct) as (keyof PricingSettings["carrierPct"])[]) {
    const v = num(form, `carrier.${k}`);
    if (Number.isFinite(v)) next.carrierPct[k] = v;
  }
  for (const k of Object.keys(next.curves) as CurveId[]) {
    const curve = parseCurve(String(form.get(`curve.${k}`) ?? ""));
    if (curve) next.curves[k] = curve;
    const cal = num(form, `calibration.${k}`);
    if (Number.isFinite(cal) && cal > 0) next.calibrationPct[k] = cal;
  }
  const days = num(form, "offerValidDays");
  if (Number.isFinite(days) && days > 0) next.offerValidDays = days;
  const min = num(form, "minOffer");
  if (Number.isFinite(min) && min >= 0) next.minOffer = min;

  await saveSettings(next);
  revalidatePath("/", "layout");
  redirect("/admin/pricing?saved=1");
}

export async function resetPricing() {
  await requireAdmin();
  await saveSettings(structuredClone(DEFAULT_SETTINGS));
  revalidatePath("/", "layout");
  redirect("/admin/pricing?saved=1");
}

// ---------- Manual resale prices ----------

export async function setResale(form: FormData) {
  await requireAdmin();
  const key = resaleKey(String(form.get("model")), String(form.get("storage")));
  const raw = String(form.get("resale") ?? "").trim();
  const overrides = await getOverrides();
  const v = num(form, "resale");
  if (raw === "" || !(v > 0)) delete overrides[key];
  else overrides[key] = v;
  await saveOverrides(overrides);
  revalidatePath("/", "layout");
}

/** CSV import: model_slug,storage,resale_price (one per line, header optional). */
export async function importResaleCsv(form: FormData) {
  await requireAdmin();
  const text = String(form.get("csv") ?? "");
  const overrides = await getOverrides();
  let applied = 0;
  for (const line of text.split(/\r?\n/)) {
    const [slug, storage, price] = line.split(",").map((x) => x?.trim());
    const value = Number(String(price ?? "").replace(/[$\s]/g, ""));
    if (!slug || !storage || !Number.isFinite(value) || value <= 0) continue;
    if (!parseVariantId(`${slug}__${storage.toLowerCase()}__unlocked`) && !parseVariantId(`${slug}__${storage.toLowerCase()}__wifi`)) continue;
    overrides[resaleKey(slug, storage)] = value;
    applied++;
  }
  await saveOverrides(overrides);
  revalidatePath("/", "layout");
  redirect(`/admin/catalog?imported=${applied}`);
}

// ---------- Calibration ----------

export async function addCalibrationRef(form: FormData) {
  await requireAdmin();
  const variantId = String(form.get("variantId") ?? "");
  const condition = String(form.get("condition")) as Condition;
  const price = num(form, "referencePrice");
  if (!parseVariantId(variantId) || !CONDITIONS.includes(condition) || !(price > 0)) {
    redirect("/admin/calibration?error=1");
  }
  const refs = await getCalibrationRefs();
  refs.push({
    id: randomBytes(6).toString("hex"),
    variantId,
    condition,
    referencePrice: price,
    source: String(form.get("source") ?? "Gazelle").trim() || "Gazelle",
    checkedAt: new Date().toISOString().slice(0, 10),
  });
  await saveCalibrationRefs(refs);
  redirect("/admin/calibration");
}

export async function deleteCalibrationRef(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  await saveCalibrationRefs((await getCalibrationRefs()).filter((r) => r.id !== id));
  revalidatePath("/admin/calibration");
}

/**
 * Sets each brand's calibration so our "good" offers match the reference prices on average.
 * Only references in "good"/"flawless" condition are used (they map 1:1 to the base offer).
 */
export async function applyCalibration(form: FormData) {
  await requireAdmin();
  const curve = String(form.get("curve")) as CurveId;
  const settings = await getSettings();
  const refs = await getCalibrationRefs();
  const ratios: number[] = [];
  for (const r of refs) {
    if (r.condition !== "good" && r.condition !== "flawless") continue;
    const q = await quoteById(r.variantId);
    if (!q || q.model.curve !== curve) continue;
    const ours = q.quote.offers[r.condition];
    if (ours > 0) ratios.push(r.referencePrice / ours);
  }
  if (ratios.length) {
    const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    settings.calibrationPct[curve] = Math.round(settings.calibrationPct[curve] * avg * 10) / 10;
    await saveSettings(settings);
  }
  revalidatePath("/", "layout");
  redirect("/admin/calibration");
}
