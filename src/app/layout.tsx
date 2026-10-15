import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: {
    default: "Prime Teq — Sell your device",
    template: "%s | Prime Teq",
  },
  description: "Sell your iPhone, Samsung, Google Pixel or iPad with Prime Teq. Find your model and see your offer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
