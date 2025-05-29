import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={kanit.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
