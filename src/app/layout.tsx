import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SensiFinder - Crowdsourced Gaming Sensitivities",
  description: "Find the perfect sensitivity settings for your device. The ultimate crowdsourced database for BGMI, PUBG, Free Fire, and COD Mobile sensitivities.",
  keywords: ["gaming", "sensitivity", "BGMI", "PUBG", "Free Fire", "COD Mobile", "mobile gaming", "settings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
