import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TALENTARA - Platform Marketplace Talent Digital",
    template: "%s | TALENTARA",
  },
  description:
    "Platform marketplace talent digital yang menghubungkan perusahaan dengan talent profesional SPG & Usher di Indonesia.",
  keywords: ["talent", "SPG", "usher", "marketplace", "event", "Indonesia", "Semarang"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
