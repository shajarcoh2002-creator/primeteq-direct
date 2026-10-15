// Writes src/data/photos.json: { "<model-slug>": "/devices/<file>" } for every photo in public/devices.
// Runs automatically before `dev` and `build` and after `npm run photos`, so the app never
// needs to read the filesystem at runtime (serverless hosts don't ship /public to functions).

import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public", "devices");
const OUT = path.join(ROOT, "src", "data", "photos.json");
const EXTS = [".webp", ".png", ".jpg", ".jpeg", ".avif"]; // preference order

export async function writePhotoManifest() {
  let files = [];
  try {
    files = await fs.readdir(DIR);
  } catch {}
  const manifest = {};
  for (const f of files.sort()) {
    const ext = path.extname(f).toLowerCase();
    if (!EXTS.includes(ext)) continue;
    const slug = path.basename(f, path.extname(f));
    const current = manifest[slug];
    if (!current || EXTS.indexOf(ext) < EXTS.indexOf(path.extname(current).toLowerCase())) manifest[slug] = `/devices/${f}`;
  }
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(OUT, JSON.stringify(sorted, null, 2) + "\n");
  return Object.keys(sorted).length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const n = await writePhotoManifest();
  console.log(`photo manifest: ${n} model photo(s)`);
}
