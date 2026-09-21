import type { Metadata, Viewport } from "next";
import { Libre_Bodoni, Public_Sans } from "next/font/google";
import { brand } from "@/lib/brand";
import { cssVarsString } from "@/lib/colors";
import "./globals.css";

// Bodoni has very fine strokes, so headings use 500/600 to avoid looking fragile.
const bodoni = Libre_Bodoni({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: brand.name,
  description: brand.tagline,
};

export const viewport: Viewport = {
  themeColor: brand.colors.bg,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr" className={`${bodoni.variable} ${publicSans.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${cssVarsString()}}` }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
