import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="PrimeTeq Direct home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 17V7h6a3.5 3.5 0 0 1 0 7H7" />
          <path d="M14.5 17.5 18 21" />
        </svg>
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        PrimeTeq<span className="font-semibold text-brand"> Direct</span>
      </span>
    </Link>
  );
}
