"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies the customer's name and address in the format Pirate Ship's address box accepts. */
export function CopyAddress({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="btn btn-outline !min-h-10 !px-4 !py-2 text-sm"
    >
      {copied ? <Check className="h-4 w-4 text-cash" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy customer address"}
    </button>
  );
}
