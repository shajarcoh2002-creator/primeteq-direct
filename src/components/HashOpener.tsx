"use client";

import { useEffect } from "react";

/** Opens a <details> FAQ item when the URL hash points at it (e.g. “Which model do I have?”). */
export function HashOpener() {
  useEffect(() => {
    const open = () => {
      const el = location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (el instanceof HTMLDetailsElement) el.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
