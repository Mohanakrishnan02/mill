import type { Metadata, Viewport } from "next";
import { Inter, Yeseva_One, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { MILL } from "@/lib/mill-config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const yeseva = Yeseva_One({ weight: "400", subsets: ["latin"], variable: "--font-yeseva" });
const tamil = Noto_Serif_Tamil({ subsets: ["tamil"], variable: "--font-tamil" });

export const metadata: Metadata = {
  title: `${MILL.fullName} | Melur, Madurai`,
  description: "Traditional rice varieties from Melur, Madurai. Order online. No COD. Call: 7339604011",
};

export const viewport: Viewport = {
  themeColor: "#2e7d32",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${yeseva.variable} ${tamil.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#fdf8f0] pb-16 font-sans antialiased md:pb-0">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
