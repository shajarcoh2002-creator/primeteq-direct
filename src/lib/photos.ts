import { promises as fs } from "fs";
import path from "path";

// Real product photos live in public/devices/<model-slug>.<ext>, e.g. public/devices/iphone-17-pro.webp.
// Transparent PNG/WebP on a square-ish canvas works best. Models without a photo fall back to the line illustration.
const DIR = path.join(process.cwd(), "public", "devices");
const EXTS = [".webp", ".png", ".jpg", ".jpeg", ".avif"];

/** Map of model slug → public URL for every photo found on disk. */
export async function getDevicePhotos(): Promise<Record<string, string>> {
  let files: string[] = [];
  try {
    files = await fs.readdir(DIR);
  } catch {
    return {};
  }
  const out: Record<string, string> = {};
  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!EXTS.includes(ext)) continue;
    const slug = path.basename(f, path.extname(f));
    // First match wins in EXTS order (webp preferred).
    if (!out[slug] || EXTS.indexOf(ext) < EXTS.indexOf(path.extname(out[slug]))) out[slug] = `/devices/${f}`;
  }
  return out;
}

export async function getDevicePhoto(slug: string) {
  return (await getDevicePhotos())[slug] ?? null;
}
