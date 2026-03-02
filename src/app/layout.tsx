import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { COOKIE_NAME } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sara & Bor — Poroka",
  description: "Poročiva se! Pridružite se nama na najinem posebnem dnevu.",
  openGraph: {
    title: "Sara & Bor — Poroka",
    description: "Poročiva se! Pridružite se nama na najinem posebnem dnevu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get(COOKIE_NAME)?.value === "true";

  return (
    <html lang="sl">
      <body
        className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-cream-50 text-gray-800`}
      >
        {isAuthenticated && <Navbar />}
        <main className="min-h-screen">{children}</main>
        {isAuthenticated && (
          <footer className="py-8 text-center text-sm text-sage-400 border-t border-cream-200">
            <p className="font-serif">Sara & Bor &middot; 2026</p>
          </footer>
        )}
      </body>
    </html>
  );
}
