import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { brand } from "@/lib/brand";
import { cssVarsString } from "@/lib/colors";
import "./globals.css";

// Headings and body are both sans, so the hierarchy comes from weight, size and
// tracking: Jakarta at 600 with tight tracking against Inter at 400.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
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
    <html lang="hr" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `:root{${cssVarsString()}}` }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
