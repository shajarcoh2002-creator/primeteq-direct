import Image from "next/image";
import type { CategoryId } from "@/data/catalog";
import { DeviceArt } from "./DeviceArt";

/** Real product photo when available, otherwise the neutral line illustration. Same box either way. */
export function DevicePhoto({
  category,
  photo,
  alt,
  className = "h-24 w-24",
  sizes = "120px",
}: {
  category: CategoryId;
  photo?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <span className={`relative grid shrink-0 place-items-center ${className}`}>
      {photo ? (
        <Image src={photo} alt={alt} fill sizes={sizes} className="object-contain" />
      ) : (
        <DeviceArt category={category} className="h-full w-auto" />
      )}
    </span>
  );
}
