import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DelayedLoader from "@/components/DelayedLoader";

const kanit = Kanit({
  subsets: ['latin'],            // character sets you need
  weight: ['400', '700'],        // font weights to preload
  style: ['normal', 'italic'],   // optional
  display: 'swap',               // recommended for performance
  variable: '--font-kanit',      // if you want a CSS variable instead of className
})
export const metadata: Metadata = {
  title: "next-expense",
  description: "Web Application (Next.JS) Develop by sithiphong krobkrong",
};

import { ThemeProvider } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import LangProvider from "@/components/LangProvider";
import FixedCostApplier from "@/components/FixedCostApplier";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={kanit.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LangProvider>
            <FixedCostApplier />
            <Navbar />
            <div className="pb-16 sm:pb-0">
              <DelayedLoader>{children}</DelayedLoader>
            </div>
            <Footer />
            <BottomNav />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


