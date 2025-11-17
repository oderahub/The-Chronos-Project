import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Time Capsule AR",
  description: "Plant digital memories in physical spaces",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-void text-frost antialiased">
        <Cursor />
        <div className="grain-overlay"></div>
        {children}
      </body>
    </html>
  );
}
