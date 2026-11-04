import type { Lang } from "@/i18n/config";

// Panama drop-off. In Panama we don't ship: customers bring the device to our BH Tech store.
// Edit here and the checkout, order page, emails and admin all update.
// TODO(Prime Teq): add the store hours (and the exact local number if any).

export interface DropoffLocation {
  id: string;
  name: string;
  /** Street address / reference point, as the customer should read it. */
  address: Record<Lang, string>;
  area: string;
  hours?: Record<Lang, string>;
  /** Search text for the Google Maps link. */
  mapsQuery: string;
}

export const DROPOFF_LOCATIONS: DropoffLocation[] = [
  {
    id: "bh-tech",
    name: "Tienda BH Tech",
    address: { es: "Plaza Pacífica (Super 99), local BH Tech", en: "Plaza Pacífica (Super 99), BH Tech store" },
    area: "Punta Paitilla, Ciudad de Panamá",
    mapsQuery: "Super 99 Plaza Pacífica Paitilla, Panamá",
  },
];

/** Panama drop-off is always our BH Tech store. */
export const DEFAULT_DROPOFF = DROPOFF_LOCATIONS[0];

export const getLocation = (id: string | undefined) => DROPOFF_LOCATIONS.find((l) => l.id === id);

export const mapsUrl = (l: DropoffLocation) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.mapsQuery)}`;

/** "Plaza Pacífica — Punta Pacífica, Ciudad de Panamá" */
export const locationLine = (l: DropoffLocation, lang: Lang) =>
  `${l.name} — ${l.address[lang] !== l.name ? `${l.address[lang]}, ` : ""}${l.area}`;

// Banks that receive ACH transfers in Panama (shown in checkout). "other" lets the customer type one.
export const PANAMA_BANKS = [
  "Banco General",
  "Banistmo",
  "BAC Credomatic",
  "Banco Nacional de Panamá",
  "Caja de Ahorros",
  "Global Bank",
  "Multibank",
  "Banesco",
  "Credicorp Bank",
  "Davivienda",
  "St. Georges Bank",
  "Banisi",
  "Towerbank",
  "Banco Aliado",
  "Canal Bank",
  "Mercantil Banco",
  "Unibank",
  "Scotiabank",
  "Cooperativa",
];
