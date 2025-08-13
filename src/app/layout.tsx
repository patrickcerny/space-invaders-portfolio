import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import FaviconSwitcher from "@/components/FaviconSwitcher";
import "./globals.css";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Space Invaders Portfolio",
  description: "Shoot the invaders to reveal links",
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
    <html lang="de-CH" suppressHydrationWarning>
      <body className={pressStart.className}>
        <FaviconSwitcher />
        {children}
      </body>
    </html>
  );
}
