import type { Lang } from "@/i18n/config";

// Panama drop-off points. In Panama we don't ship: customers bring the device to one of these.
// Edit here and the checkout, order page, emails and admin all update.
// TODO(Prime Teq): confirm the exact address, reference point and hours of each location.

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
    name: "BH Tech",
    address: { es: "Local de BH Tech", en: "BH Tech store" },
    area: "Ciudad de Panamá",
    mapsQuery: "BH Tech Panamá",
  },
  {
    id: "paitilla",
    name: "Punta Paitilla",
    address: { es: "Punta Paitilla (punto de encuentro coordinado por WhatsApp)", en: "Punta Paitilla (meeting point arranged by WhatsApp)" },
    area: "Punta Paitilla, Ciudad de Panamá",
    mapsQuery: "Punta Paitilla, Panamá",
  },
  {
    id: "plaza-pacifica",
    name: "Plaza Pacífica",
    address: { es: "Plaza Pacífica", en: "Plaza Pacífica" },
    area: "Punta Pacífica, Ciudad de Panamá",
    mapsQuery: "Plaza Pacífica, Punta Pacífica, Panamá",
  },
  {
    id: "super-99",
    name: "Super 99",
    address: { es: "Super 99 (entrada principal)", en: "Super 99 (main entrance)" },
    area: "Ciudad de Panamá",
    mapsQuery: "Super 99 Punta Paitilla, Panamá",
  },
];

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
