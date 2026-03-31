import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Claude Buddy — Hatch Your Claude Code Buddy",
  description:
    "The Claude Code leak revealed a hidden gacha system. Enter your name and watch your unique pixel buddy get painted onto the grid. Same hash, same buddy, every time.",
  openGraph: {
    title: "Claude Buddy — Hatch Your Claude Code Buddy",
    description:
      "The Claude Code leak revealed a hidden gacha system. Enter your name and watch your unique pixel buddy get painted onto the grid.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Buddy — Hatch Your Claude Code Buddy",
    description:
      "The Claude Code leak revealed a hidden gacha system. Enter your name and watch your unique pixel buddy get painted onto the grid.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${jetbrains.variable}`}>
      <body className="bg-[#1a1a1a] text-white font-mono min-h-screen overflow-hidden">
        {children}
        {/* CRT scanline overlay */}
        <div className="crt-overlay" />
      </body>
    </html>
  );
}
