// Prepares raw product photos for the site.
//
//   1. Put raw photos in ./photos-raw/ named <model-slug>.<jpg|jpeg|png|webp|tif>
//      e.g. photos-raw/iphone-17-pro.jpg   (slugs: see admin → Catálogo y precios)
//   2. Run:  npm run photos
//
// Each photo is trimmed to the device (removes the white/plain background border),
// scaled to fit, centered on a 1200×1200 white canvas and saved as
// public/devices/<model-slug>.webp. Unknown file names are reported and skipped.

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const RAW = path.join(ROOT, "photos-raw");
const OUT = path.join(ROOT, "public", "devices");
const CANVAS = 1200;
const DEVICE_MAX = 1000; // device fits inside 1000×1000 → ~100px margin each side
const INPUT_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"];

async function knownSlugs() {
  const src = await fs.readFile(path.join(ROOT, "src", "data", "catalog.ts"), "utf8");
  return new Set([...src.matchAll(/(?:iphone|samsung|pixel|ipad)\("([^"]+)"/g)].map((m) => m[1]));
}

async function main() {
  const slugs = await knownSlugs();
  let files;
  try {
    files = await fs.readdir(RAW);
  } catch {
    console.error(`No ./photos-raw folder. Create it and add photos named <model-slug>.jpg`);
    process.exit(1);
  }
  await fs.mkdir(OUT, { recursive: true });

  let ok = 0;
  const skipped = [];
  for (const file of files.sort()) {
    const ext = path.extname(file).toLowerCase();
    if (!INPUT_EXTS.includes(ext)) continue;
    const slug = path.basename(file, path.extname(file)).toLowerCase().trim();
    if (!slugs.has(slug)) {
      skipped.push(file);
      continue;
    }
    const device = await sharp(path.join(RAW, file))
      .rotate() // respect camera orientation
      .flatten({ background: "#ffffff" })
      .trim({ background: "#ffffff", threshold: 28 })
      .resize(DEVICE_MAX, DEVICE_MAX, { fit: "inside" })
      .toBuffer();
    await sharp({ create: { width: CANVAS, height: CANVAS, channels: 3, background: "#ffffff" } })
      .composite([{ input: device, gravity: "center" }])
      .webp({ quality: 86 })
      .toFile(path.join(OUT, `${slug}.webp`));
    ok++;
    console.log(`✓ ${file} → public/devices/${slug}.webp`);
  }

  console.log(`\n${ok} photo(s) ready.`);
  if (skipped.length) {
    console.log(`Skipped (name doesn't match a model): ${skipped.join(", ")}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
