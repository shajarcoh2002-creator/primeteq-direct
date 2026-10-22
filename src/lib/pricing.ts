// Pricing engine — pure functions, safe to import anywhere.
//
// OFFER (good condition, unlocked) =
//   resale × (1 − marketplace fee − risk − hold depreciation − margin) − refurb − shipping
//   × brand calibration
// then × carrier adjustment × condition adjustment, rounded down to whole dollars.
//
// resale = manual resale price if set, otherwise launch price × resale curve(age in months).

import type { CarrierId, CurveId, DeviceModel, StorageOption } from "@/data/catalog";
import { storageSlug } from "@/data/catalog";

export type Condition = "flawless" | "good" | "fair" | "poor" | "broken";
export const CONDITIONS: Condition[] = ["flawless", "good", "fair", "poor", "broken"];

export const CONDITION_LABELS: Record<Condition, string> = {
  flawless: "Flawless or like new",
  good: "Lightly used",
  fair: "Scratched or scuffed",
  poor: "Damaged (dents, chips, bent)",
  broken: "Broken / not working / cracked",
};

export interface PricingSettings {
  costs: {
    marketplaceFeePct: number;
    refurbCost: number;
    shippingCost: number;
    riskPct: number;
    holdDepreciationPct: number;
    marginPct: number;
  };
  conditionPct: Record<Condition, number>;
  carrierPct: Record<CarrierId, number>;
  /** [ageMonths, % of launch price] points, interpolated linearly. */
  curves: Record<CurveId, [number, number][]>;
  calibrationPct: Record<CurveId, number>;
  /** Share (%) of the extra launch price of a bigger storage tier that a used device keeps. */
  storagePremiumPct: number;
  offerValidDays: number;
  minOffer: number;
}

export const CURVE_LABELS: Record<CurveId, string> = {
  "apple-phone": "iPhone",
  samsung: "Samsung",
  google: "Google Pixel",
  "apple-tablet": "iPad",
};

// Defaults calibrated against a live Gazelle quote (Oct 2026):
// iPhone 17 Pro 256GB Unlocked → $663 / $663 / $636 / $378 / $274.
// Condition ratios come from that quote; curves and carrier adjustments are
// industry estimates to be refined with the calibration tool.
export const DEFAULT_SETTINGS: PricingSettings = {
  costs: {
    marketplaceFeePct: 12,
    refurbCost: 15,
    shippingCost: 20,
    riskPct: 3,
    holdDepreciationPct: 4.5,
    marginPct: 7,
  },
  conditionPct: { flawless: 100, good: 100, fair: 96, poor: 57, broken: 41 },
  // AT&T from Gazelle (17 Pro Max 1TB: $726 AT&T vs $811 unlocked); T-Mobile and Verizon assumed the same until checked.
  carrierPct: { unlocked: 100, att: 89.5, tmobile: 89.5, verizon: 89.5, other: 80, wifi: 100, cellular: 108 },
  curves: {
    "apple-phone": [[0, 93], [6, 90], [12, 88], [24, 68], [36, 52], [48, 38], [60, 27], [72, 18], [84, 12], [96, 8], [120, 5]],
    samsung: [[0, 80], [6, 70], [12, 60], [24, 42], [36, 30], [48, 20], [60, 13], [72, 8], [96, 4]],
    google: [[0, 75], [6, 62], [12, 52], [24, 36], [36, 24], [48, 15], [60, 9], [84, 4]],
    "apple-tablet": [[0, 85], [12, 75], [24, 60], [36, 48], [48, 37], [60, 28], [84, 15], [120, 7]],
  },
  // iPhone 101.5%: best fit to 4 Gazelle references (all within ±1.5%). Other brands not calibrated yet.
  calibrationPct: { "apple-phone": 101.5, samsung: 100, google: 100, "apple-tablet": 100 },
  // Gazelle, Oct 2026: iPhone 17 Pro Max 256GB → 1TB unlocked = $745 → $811 (+$66 for +$400 at launch).
  storagePremiumPct: 26,
  offerValidDays: 15,
  minOffer: 1,
};

/** Manual resale prices (good condition, unlocked), keyed by `${modelSlug}__${storage}`. */
export type ResaleOverrides = Record<string, number>;

export const resaleKey = (modelSlug: string, storage: string) => `${modelSlug}__${storageSlug(storage)}`;

export function ageInMonths(released: string, now: Date) {
  const days = (now.getTime() - new Date(`${released}T00:00:00Z`).getTime()) / 86_400_000;
  return Math.max(0, days / 30.4375);
}

export function curveValue(points: [number, number][], age: number) {
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  if (age <= sorted[0][0]) return sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [x1, y1] = sorted[i];
    const [x0, y0] = sorted[i - 1];
    if (age <= x1) return y0 + ((age - x0) / (x1 - x0)) * (y1 - y0);
  }
  return sorted[sorted.length - 1][1];
}

export interface ResaleEstimate {
  resale: number;
  source: "manual" | "curve";
  ageMonths: number;
  curvePct: number;
}

export function estimateResale(
  model: DeviceModel,
  storage: StorageOption,
  settings: PricingSettings,
  overrides: ResaleOverrides,
  now: Date,
): ResaleEstimate {
  const ageMonths = ageInMonths(model.released, now);
  const curvePct = curveValue(settings.curves[model.curve], ageMonths);
  const manual = overrides[resaleKey(model.slug, storage.label)];
  if (manual && manual > 0) return { resale: manual, source: "manual", ageMonths, curvePct };
  // Used buyers pay only part of the launch-price premium for extra storage.
  const baseMsrp = Math.min(...model.storage.map((o) => o.msrp));
  const effectiveMsrp = baseMsrp + ((storage.msrp - baseMsrp) * settings.storagePremiumPct) / 100;
  return { resale: (effectiveMsrp * curvePct) / 100, source: "curve", ageMonths, curvePct };
}

/** Base offer: good condition, unlocked, after calibration — before carrier/condition. */
export function baseOffer(resale: number, curve: CurveId, settings: PricingSettings) {
  const c = settings.costs;
  const pctDeductions = (c.marketplaceFeePct + c.riskPct + c.holdDepreciationPct + c.marginPct) / 100;
  const raw = resale * (1 - pctDeductions) - c.refurbCost - c.shippingCost;
  return (raw * settings.calibrationPct[curve]) / 100;
}

export function finalOffer(base: number, carrier: CarrierId, condition: Condition, settings: PricingSettings) {
  const value = (base * settings.carrierPct[carrier] * settings.conditionPct[condition]) / 10_000;
  return Math.max(settings.minOffer, Math.floor(value));
}

export interface Quote {
  resale: ResaleEstimate;
  base: number;
  offers: Record<Condition, number>;
}

export function quoteVariant(
  model: DeviceModel,
  storage: StorageOption,
  carrier: CarrierId,
  settings: PricingSettings,
  overrides: ResaleOverrides,
  now = new Date(),
): Quote {
  const resale = estimateResale(model, storage, settings, overrides, now);
  const base = baseOffer(resale.resale, model.curve, settings);
  const offers = Object.fromEntries(
    CONDITIONS.map((c) => [c, finalOffer(base, carrier, c, settings)]),
  ) as Record<Condition, number>;
  return { resale, base, offers };
}

/** Questionnaire answers → condition tier (same logic as the quote flow). */
export interface Answers {
  powersOn: boolean;
  functional: boolean;
  noCracks: boolean;
  cosmetic: Exclude<Condition, "broken"> | null;
}

export function conditionFromAnswers(a: Partial<Answers>): Condition | null {
  if (a.powersOn === false || a.functional === false || a.noCracks === false) return "broken";
  if (a.powersOn && a.functional && a.noCracks && a.cosmetic) return a.cosmetic;
  return null;
}

/** Deep-merge saved settings over defaults so new fields always have a value. */
export function mergeSettings(saved: Partial<PricingSettings> | null | undefined): PricingSettings {
  const d = DEFAULT_SETTINGS;
  if (!saved) return structuredClone(d);
  return {
    costs: { ...d.costs, ...saved.costs },
    conditionPct: { ...d.conditionPct, ...saved.conditionPct },
    carrierPct: { ...d.carrierPct, ...saved.carrierPct },
    curves: { ...d.curves, ...saved.curves },
    calibrationPct: { ...d.calibrationPct, ...saved.calibrationPct },
    storagePremiumPct: saved.storagePremiumPct ?? d.storagePremiumPct,
    offerValidDays: saved.offerValidDays ?? d.offerValidDays,
    minOffer: saved.minOffer ?? d.minOffer,
  };
}
