import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/primeteq-logo.png";

/** Official approved wordmark — always rendered as the supplied image, never retyped. */
export function Logo({ className = "h-7 w-auto sm:h-8" }: { className?: string }) {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center" aria-label="Prime Teq home">
      <Image src={logo} alt="Prime Teq" priority className={className} />
    </Link>
  );
}
