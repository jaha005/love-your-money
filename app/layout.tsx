import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { brand } from "@/lib/brand";
import { cssVarsString } from "@/lib/colors";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
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
    <html lang="hr" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${cssVarsString()}}` }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
