import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { getDict, getLang } from "@/i18n/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope" });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDict();
  return {
    title: { default: t.meta.title, template: "%s | Prime Teq" },
    description: t.meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const lang = await getLang();
  return (
    <html lang={lang} className={`h-full ${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
