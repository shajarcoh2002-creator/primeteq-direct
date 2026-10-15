// Device catalog. `released` = US launch date, `msrp` = launch price (USD) per storage.
// Models marked `verify: true` have estimated launch data — confirm before going live.

export type CategoryId = "iphone" | "samsung" | "google" | "ipad";
export type CurveId = "apple-phone" | "samsung" | "google" | "apple-tablet";
export type CarrierId = "unlocked" | "att" | "tmobile" | "verizon" | "other" | "wifi" | "cellular";

export interface StorageOption {
  label: string;
  msrp: number;
}

export interface DeviceModel {
  slug: string;
  name: string;
  category: CategoryId;
  curve: CurveId;
  released: string;
  storage: StorageOption[];
  verify?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  kind: "phone" | "tablet";
  carriers: CarrierId[];
}

const PHONE_CARRIERS: CarrierId[] = ["att", "tmobile", "verizon", "unlocked", "other"];

export const CATEGORIES: Category[] = [
  { id: "iphone", name: "iPhone", shortName: "iPhone", kind: "phone", carriers: PHONE_CARRIERS },
  { id: "samsung", name: "Samsung Galaxy", shortName: "Samsung", kind: "phone", carriers: PHONE_CARRIERS },
  { id: "google", name: "Google Pixel", shortName: "Google", kind: "phone", carriers: PHONE_CARRIERS },
  { id: "ipad", name: "iPad", shortName: "iPad", kind: "tablet", carriers: ["wifi", "cellular"] },
];

export const CARRIER_LABELS: Record<CarrierId, string> = {
  att: "AT&T",
  tmobile: "T-Mobile",
  verizon: "Verizon",
  unlocked: "Unlocked",
  other: "Other carrier",
  wifi: "Wi-Fi only",
  cellular: "Wi-Fi + Cellular",
};

const s = (...pairs: [string, number][]): StorageOption[] => pairs.map(([label, msrp]) => ({ label, msrp }));

const iphone = (slug: string, name: string, released: string, storage: StorageOption[], verify = false): DeviceModel => ({
  slug, name, category: "iphone", curve: "apple-phone", released, storage, verify,
});
const samsung = (slug: string, name: string, released: string, storage: StorageOption[], verify = false): DeviceModel => ({
  slug, name, category: "samsung", curve: "samsung", released, storage, verify,
});
const pixel = (slug: string, name: string, released: string, storage: StorageOption[], verify = false): DeviceModel => ({
  slug, name, category: "google", curve: "google", released, storage, verify,
});
const ipad = (slug: string, name: string, released: string, storage: StorageOption[], verify = false): DeviceModel => ({
  slug, name, category: "ipad", curve: "apple-tablet", released, storage, verify,
});

export const MODELS: DeviceModel[] = [
  // ---------- iPhone ----------
  iphone("iphone-17-pro-max", "iPhone 17 Pro Max", "2025-09-19", s(["256GB", 1199], ["512GB", 1399], ["1TB", 1599], ["2TB", 1999])),
  iphone("iphone-17-pro", "iPhone 17 Pro", "2025-09-19", s(["256GB", 1099], ["512GB", 1299], ["1TB", 1499])),
  iphone("iphone-air", "iPhone Air", "2025-09-19", s(["256GB", 999], ["512GB", 1199], ["1TB", 1399])),
  iphone("iphone-17", "iPhone 17", "2025-09-19", s(["256GB", 799], ["512GB", 999])),
  iphone("iphone-17e", "iPhone 17e", "2026-02-28", s(["256GB", 599], ["512GB", 799]), true),
  iphone("iphone-16e", "iPhone 16e", "2025-02-28", s(["128GB", 599], ["256GB", 699], ["512GB", 899])),
  iphone("iphone-16-pro-max", "iPhone 16 Pro Max", "2024-09-20", s(["256GB", 1199], ["512GB", 1399], ["1TB", 1599])),
  iphone("iphone-16-pro", "iPhone 16 Pro", "2024-09-20", s(["128GB", 999], ["256GB", 1099], ["512GB", 1299], ["1TB", 1499])),
  iphone("iphone-16-plus", "iPhone 16 Plus", "2024-09-20", s(["128GB", 899], ["256GB", 999], ["512GB", 1199])),
  iphone("iphone-16", "iPhone 16", "2024-09-20", s(["128GB", 799], ["256GB", 899], ["512GB", 1099])),
  iphone("iphone-15-pro-max", "iPhone 15 Pro Max", "2023-09-22", s(["256GB", 1199], ["512GB", 1399], ["1TB", 1599])),
  iphone("iphone-15-pro", "iPhone 15 Pro", "2023-09-22", s(["128GB", 999], ["256GB", 1099], ["512GB", 1299], ["1TB", 1499])),
  iphone("iphone-15-plus", "iPhone 15 Plus", "2023-09-22", s(["128GB", 899], ["256GB", 999], ["512GB", 1199])),
  iphone("iphone-15", "iPhone 15", "2023-09-22", s(["128GB", 799], ["256GB", 899], ["512GB", 1099])),
  iphone("iphone-14-pro-max", "iPhone 14 Pro Max", "2022-09-16", s(["128GB", 1099], ["256GB", 1199], ["512GB", 1399], ["1TB", 1599])),
  iphone("iphone-14-pro", "iPhone 14 Pro", "2022-09-16", s(["128GB", 999], ["256GB", 1099], ["512GB", 1299], ["1TB", 1499])),
  iphone("iphone-14-plus", "iPhone 14 Plus", "2022-10-07", s(["128GB", 899], ["256GB", 999], ["512GB", 1199])),
  iphone("iphone-14", "iPhone 14", "2022-09-16", s(["128GB", 799], ["256GB", 899], ["512GB", 1099])),
  iphone("iphone-13-pro-max", "iPhone 13 Pro Max", "2021-09-24", s(["128GB", 1099], ["256GB", 1199], ["512GB", 1399], ["1TB", 1599])),
  iphone("iphone-13-pro", "iPhone 13 Pro", "2021-09-24", s(["128GB", 999], ["256GB", 1099], ["512GB", 1299], ["1TB", 1499])),
  iphone("iphone-13", "iPhone 13", "2021-09-24", s(["128GB", 799], ["256GB", 899], ["512GB", 1099])),
  iphone("iphone-13-mini", "iPhone 13 mini", "2021-09-24", s(["128GB", 699], ["256GB", 799], ["512GB", 999])),
  iphone("iphone-12-pro-max", "iPhone 12 Pro Max", "2020-11-13", s(["128GB", 1099], ["256GB", 1199], ["512GB", 1399])),
  iphone("iphone-12-pro", "iPhone 12 Pro", "2020-10-23", s(["128GB", 999], ["256GB", 1099], ["512GB", 1299])),
  iphone("iphone-12", "iPhone 12", "2020-10-23", s(["64GB", 799], ["128GB", 849], ["256GB", 949])),
  iphone("iphone-12-mini", "iPhone 12 mini", "2020-11-13", s(["64GB", 699], ["128GB", 749], ["256GB", 849])),
  iphone("iphone-11-pro-max", "iPhone 11 Pro Max", "2019-09-20", s(["64GB", 1099], ["256GB", 1249], ["512GB", 1449])),
  iphone("iphone-11-pro", "iPhone 11 Pro", "2019-09-20", s(["64GB", 999], ["256GB", 1149], ["512GB", 1349])),
  iphone("iphone-11", "iPhone 11", "2019-09-20", s(["64GB", 699], ["128GB", 749], ["256GB", 849])),
  iphone("iphone-se-3rd-gen", "iPhone SE (3rd gen)", "2022-03-18", s(["64GB", 429], ["128GB", 479], ["256GB", 579])),
  iphone("iphone-se-2nd-gen", "iPhone SE (2nd gen)", "2020-04-24", s(["64GB", 399], ["128GB", 449], ["256GB", 549])),
  iphone("iphone-xs-max", "iPhone XS Max", "2018-09-21", s(["64GB", 1099], ["256GB", 1249], ["512GB", 1449])),
  iphone("iphone-xs", "iPhone XS", "2018-09-21", s(["64GB", 999], ["256GB", 1149], ["512GB", 1349])),
  iphone("iphone-xr", "iPhone XR", "2018-10-26", s(["64GB", 749], ["128GB", 799], ["256GB", 899])),

  // ---------- Samsung ----------
  samsung("galaxy-z-fold8", "Galaxy Z Fold8", "2026-07-25", s(["256GB", 1999], ["512GB", 2119], ["1TB", 2359]), true),
  samsung("galaxy-z-flip8", "Galaxy Z Flip8", "2026-07-25", s(["256GB", 1099], ["512GB", 1219]), true),
  samsung("galaxy-s26-ultra", "Galaxy S26 Ultra", "2026-03-06", s(["256GB", 1299], ["512GB", 1419], ["1TB", 1659]), true),
  samsung("galaxy-s26-plus", "Galaxy S26+", "2026-03-06", s(["256GB", 999], ["512GB", 1119]), true),
  samsung("galaxy-s26", "Galaxy S26", "2026-03-06", s(["256GB", 859], ["512GB", 979]), true),
  samsung("galaxy-z-fold7", "Galaxy Z Fold7", "2025-07-25", s(["256GB", 1999], ["512GB", 2119], ["1TB", 2419])),
  samsung("galaxy-z-flip7", "Galaxy Z Flip7", "2025-07-25", s(["256GB", 1099], ["512GB", 1219])),
  samsung("galaxy-z-flip7-fe", "Galaxy Z Flip7 FE", "2025-07-25", s(["128GB", 899], ["256GB", 959])),
  samsung("galaxy-s25-fe", "Galaxy S25 FE", "2025-09-04", s(["128GB", 649], ["256GB", 709])),
  samsung("galaxy-s25-edge", "Galaxy S25 Edge", "2025-05-30", s(["256GB", 1099], ["512GB", 1219])),
  samsung("galaxy-s25-ultra", "Galaxy S25 Ultra", "2025-02-07", s(["256GB", 1299], ["512GB", 1419], ["1TB", 1659])),
  samsung("galaxy-s25-plus", "Galaxy S25+", "2025-02-07", s(["256GB", 999], ["512GB", 1119])),
  samsung("galaxy-s25", "Galaxy S25", "2025-02-07", s(["128GB", 799], ["256GB", 859])),
  samsung("galaxy-s24-fe", "Galaxy S24 FE", "2024-10-03", s(["128GB", 649], ["256GB", 709], ["512GB", 829]), true),
  samsung("galaxy-z-fold6", "Galaxy Z Fold6", "2024-07-24", s(["256GB", 1899], ["512GB", 2019], ["1TB", 2259])),
  samsung("galaxy-z-flip6", "Galaxy Z Flip6", "2024-07-24", s(["256GB", 1099], ["512GB", 1219])),
  samsung("galaxy-s24-ultra", "Galaxy S24 Ultra", "2024-01-31", s(["256GB", 1299], ["512GB", 1419], ["1TB", 1659])),
  samsung("galaxy-s24-plus", "Galaxy S24+", "2024-01-31", s(["256GB", 999], ["512GB", 1119])),
  samsung("galaxy-s24", "Galaxy S24", "2024-01-31", s(["128GB", 799], ["256GB", 859], ["512GB", 979]), true),
  samsung("galaxy-s23-fe", "Galaxy S23 FE", "2023-10-26", s(["128GB", 599], ["256GB", 659])),
  samsung("galaxy-z-fold5", "Galaxy Z Fold5", "2023-08-11", s(["256GB", 1799], ["512GB", 1919], ["1TB", 2159])),
  samsung("galaxy-z-flip5", "Galaxy Z Flip5", "2023-08-11", s(["256GB", 999], ["512GB", 1119])),
  samsung("galaxy-s23-ultra", "Galaxy S23 Ultra", "2023-02-17", s(["256GB", 1199], ["512GB", 1379], ["1TB", 1619])),
  samsung("galaxy-s23-plus", "Galaxy S23+", "2023-02-17", s(["256GB", 999], ["512GB", 1119])),
  samsung("galaxy-s23", "Galaxy S23", "2023-02-17", s(["128GB", 799], ["256GB", 859])),
  samsung("galaxy-z-fold4", "Galaxy Z Fold4", "2022-08-26", s(["256GB", 1799], ["512GB", 1919], ["1TB", 2159])),
  samsung("galaxy-z-flip4", "Galaxy Z Flip4", "2022-08-26", s(["128GB", 999], ["256GB", 1059], ["512GB", 1179])),
  samsung("galaxy-s22-ultra", "Galaxy S22 Ultra", "2022-02-25", s(["128GB", 1199], ["256GB", 1299], ["512GB", 1399], ["1TB", 1599])),
  samsung("galaxy-s22-plus", "Galaxy S22+", "2022-02-25", s(["128GB", 999], ["256GB", 1049])),
  samsung("galaxy-s22", "Galaxy S22", "2022-02-25", s(["128GB", 799], ["256GB", 849])),
  samsung("galaxy-s21-fe", "Galaxy S21 FE 5G", "2022-01-11", s(["128GB", 699], ["256GB", 769])),
  samsung("galaxy-z-fold3", "Galaxy Z Fold3 5G", "2021-08-27", s(["256GB", 1799], ["512GB", 1899])),
  samsung("galaxy-z-flip3", "Galaxy Z Flip3 5G", "2021-08-27", s(["128GB", 999], ["256GB", 1049])),
  samsung("galaxy-s21-ultra", "Galaxy S21 Ultra 5G", "2021-01-29", s(["128GB", 1199], ["256GB", 1249], ["512GB", 1379])),
  samsung("galaxy-s21-plus", "Galaxy S21+ 5G", "2021-01-29", s(["128GB", 999], ["256GB", 1049])),
  samsung("galaxy-s21", "Galaxy S21 5G", "2021-01-29", s(["128GB", 799], ["256GB", 849])),

  // ---------- Google ----------
  pixel("pixel-10-pro-fold", "Pixel 10 Pro Fold", "2025-10-09", s(["256GB", 1799], ["512GB", 1919], ["1TB", 2149])),
  pixel("pixel-10-pro-xl", "Pixel 10 Pro XL", "2025-08-28", s(["256GB", 1199], ["512GB", 1319], ["1TB", 1549])),
  pixel("pixel-10-pro", "Pixel 10 Pro", "2025-08-28", s(["128GB", 999], ["256GB", 1099], ["512GB", 1219], ["1TB", 1449])),
  pixel("pixel-10", "Pixel 10", "2025-08-28", s(["128GB", 799], ["256GB", 899])),
  pixel("pixel-9a", "Pixel 9a", "2025-04-10", s(["128GB", 499], ["256GB", 599])),
  pixel("pixel-9-pro-fold", "Pixel 9 Pro Fold", "2024-09-04", s(["256GB", 1799], ["512GB", 1919])),
  pixel("pixel-9-pro-xl", "Pixel 9 Pro XL", "2024-08-22", s(["128GB", 1099], ["256GB", 1199], ["512GB", 1319], ["1TB", 1549])),
  pixel("pixel-9-pro", "Pixel 9 Pro", "2024-09-04", s(["128GB", 999], ["256GB", 1099], ["512GB", 1219], ["1TB", 1449])),
  pixel("pixel-9", "Pixel 9", "2024-08-22", s(["128GB", 799], ["256GB", 899])),
  pixel("pixel-8a", "Pixel 8a", "2024-05-14", s(["128GB", 499], ["256GB", 559])),
  pixel("pixel-8-pro", "Pixel 8 Pro", "2023-10-12", s(["128GB", 999], ["256GB", 1059], ["512GB", 1179], ["1TB", 1399])),
  pixel("pixel-8", "Pixel 8", "2023-10-12", s(["128GB", 699], ["256GB", 759])),
  pixel("pixel-fold", "Pixel Fold", "2023-06-27", s(["256GB", 1799], ["512GB", 1919])),
  pixel("pixel-7a", "Pixel 7a", "2023-05-10", s(["128GB", 499])),
  pixel("pixel-7-pro", "Pixel 7 Pro", "2022-10-13", s(["128GB", 899], ["256GB", 999], ["512GB", 1099])),
  pixel("pixel-7", "Pixel 7", "2022-10-13", s(["128GB", 599], ["256GB", 699])),
  pixel("pixel-6a", "Pixel 6a", "2022-07-28", s(["128GB", 449])),
  pixel("pixel-6-pro", "Pixel 6 Pro", "2021-10-28", s(["128GB", 899], ["256GB", 999], ["512GB", 1099])),
  pixel("pixel-6", "Pixel 6", "2021-10-28", s(["128GB", 599], ["256GB", 699])),

  // ---------- iPad (Wi-Fi launch prices; cellular handled by carrier adjustment) ----------
  ipad("ipad-pro-13-m5", "iPad Pro 13-inch (M5)", "2025-10-22", s(["256GB", 1299], ["512GB", 1499], ["1TB", 1899], ["2TB", 2299])),
  ipad("ipad-pro-11-m5", "iPad Pro 11-inch (M5)", "2025-10-22", s(["256GB", 999], ["512GB", 1199], ["1TB", 1599], ["2TB", 1999])),
  ipad("ipad-pro-13-m4", "iPad Pro 13-inch (M4)", "2024-05-15", s(["256GB", 1299], ["512GB", 1499], ["1TB", 1899], ["2TB", 2299])),
  ipad("ipad-pro-11-m4", "iPad Pro 11-inch (M4)", "2024-05-15", s(["256GB", 999], ["512GB", 1199], ["1TB", 1599], ["2TB", 1999])),
  ipad("ipad-air-13-m3", "iPad Air 13-inch (M3)", "2025-03-12", s(["128GB", 799], ["256GB", 899], ["512GB", 1099], ["1TB", 1299])),
  ipad("ipad-air-11-m3", "iPad Air 11-inch (M3)", "2025-03-12", s(["128GB", 599], ["256GB", 699], ["512GB", 899], ["1TB", 1099])),
  ipad("ipad-air-13-m2", "iPad Air 13-inch (M2)", "2024-05-15", s(["128GB", 799], ["256GB", 899], ["512GB", 1099], ["1TB", 1299])),
  ipad("ipad-air-11-m2", "iPad Air 11-inch (M2)", "2024-05-15", s(["128GB", 599], ["256GB", 699], ["512GB", 899], ["1TB", 1099])),
  ipad("ipad-a16", "iPad (A16)", "2025-03-12", s(["128GB", 349], ["256GB", 449], ["512GB", 649])),
  ipad("ipad-10th-gen", "iPad (10th gen)", "2022-10-26", s(["64GB", 449], ["256GB", 599])),
  ipad("ipad-mini-a17-pro", "iPad mini (A17 Pro)", "2024-10-23", s(["128GB", 499], ["256GB", 599], ["512GB", 799])),
  ipad("ipad-mini-6th-gen", "iPad mini (6th gen)", "2021-09-24", s(["64GB", 499], ["256GB", 649])),
];

export const storageSlug = (label: string) => label.toLowerCase();

/** Where to find the exact model name on the device (shown under “Which model do I have?”). */
export const FIND_MODEL_TIP: Record<CategoryId, string> = {
  iphone: "Open Settings → General → About. Your iPhone’s model name is listed at the top.",
  samsung: "Open Settings → About phone. The model name is shown at the top of the screen.",
  google: "Open Settings → About phone. Look for “Model” or “Device name”.",
  ipad: "Open Settings → General → About. Your iPad’s model name is listed at the top.",
};

/** Generation / family label used to group the model chooser. Derived from the model name. */
export function groupLabel(model: DeviceModel): string {
  const n = model.name;
  switch (model.category) {
    case "iphone": {
      if (model.slug === "iphone-air") return "iPhone 17 family";
      if (/SE/.test(n)) return "iPhone SE";
      if (/iPhone X/.test(n)) return "iPhone XS & XR";
      const g = n.match(/iPhone (\d+)/);
      return g ? `iPhone ${g[1]} family` : "Other iPhone";
    }
    case "samsung": {
      if (/Galaxy Z/.test(n)) return "Galaxy Z Fold & Flip";
      const g = n.match(/Galaxy S(\d+)/);
      return g ? `Galaxy S${g[1]} series` : "Other Galaxy";
    }
    case "google": {
      if (/Pixel Fold/.test(n)) return "Pixel Fold";
      const g = n.match(/Pixel (\d+)/);
      return g ? `Pixel ${g[1]} series` : "Other Pixel";
    }
    case "ipad": {
      if (/iPad Pro/.test(n)) return "iPad Pro";
      if (/iPad Air/.test(n)) return "iPad Air";
      if (/iPad mini/.test(n)) return "iPad mini";
      return "iPad";
    }
  }
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function getModel(slug: string) {
  return MODELS.find((m) => m.slug === slug);
}

export function modelsIn(category: CategoryId) {
  return MODELS.filter((m) => m.category === category);
}

/** Variant id: model slug + storage + carrier, e.g. "iphone-17-pro__256gb__unlocked". */
export function variantId(modelSlug: string, storage: string, carrier: CarrierId) {
  return `${modelSlug}__${storageSlug(storage)}__${carrier}`;
}

export function parseVariantId(id: string) {
  const [modelSlug, storage, carrier] = id.split("__");
  const model = getModel(modelSlug ?? "");
  if (!model) return null;
  const opt = model.storage.find((o) => storageSlug(o.label) === storage);
  const category = getCategory(model.category)!;
  if (!opt || !category.carriers.includes(carrier as CarrierId)) return null;
  return { model, storage: opt, carrier: carrier as CarrierId, category };
}
