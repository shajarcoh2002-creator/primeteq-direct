import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PrimeTeq Direct — Sell your phone for cash",
    template: "%s | PrimeTeq Direct",
  },
  description: "Sell your iPhone, Samsung, Google Pixel or iPad. Instant offer, free shipping, fast payment.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
