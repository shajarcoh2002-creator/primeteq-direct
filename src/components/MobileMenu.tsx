"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";

interface NavLink {
  label: string;
  href: string;
  current?: boolean;
  placeholder?: boolean;
}

export function MobileMenu({
  main,
  utility,
}: {
  main: NavLink[];
  utility: NavLink[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex flex-col bg-white"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-line"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav
              className="flex-1 overflow-y-auto px-4 py-6"
              onClick={(e) =>
                (e.target as HTMLElement).closest("a") && setOpen(false)
              }
            >
              <div className="grid grid-cols-3 gap-2">
                {main.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    aria-current={l.current ? "page" : undefined}
                    className={`rounded-xl border py-3 text-center text-sm font-bold uppercase tracking-[0.08em] ${
                      l.current
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line text-ink"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <p className="eyebrow mt-8">Sell a device</p>
              <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/sell/${c.id}`}
                      className="flex min-h-12 items-center justify-between px-4 font-semibold"
                    >
                      {c.name}{" "}
                      <span aria-hidden className="text-muted">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-8 space-y-1">
                {utility.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="flex min-h-11 items-center text-ink-2"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
