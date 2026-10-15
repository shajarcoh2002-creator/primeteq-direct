// Real product photos live in public/devices/<model-slug>.<ext> (see scripts/prepare-photos.mjs).
// src/data/photos.json is generated from that folder by scripts/photo-manifest.mjs before dev/build.
import manifest from "@/data/photos.json";

const photos = manifest as Record<string, string>;

/** Map of model slug → public URL for every photo available. */
export async function getDevicePhotos(): Promise<Record<string, string>> {
  return photos;
}

export async function getDevicePhoto(slug: string) {
  return photos[slug] ?? null;
}
