import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Patrick Cerny - Portfolio",
  description: "Retro Space Invaders portfolio showcasing Patrick Cerny's work",
  keywords: [
    "Patrick Cerny",
    "portfolio",
    "web developer",
    "space invaders",
  ],
  authors: [{ name: "Patrick Cerny" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Patrick Cerny - Portfolio",
    description:
      "Retro Space Invaders portfolio showcasing Patrick Cerny's work",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Patrick Cerny - Portfolio",
    description:
      "Retro Space Invaders portfolio showcasing Patrick Cerny's work",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de-CH" suppressHydrationWarning>
      <body className={pressStart.className}>{children}</body>
    </html>
  );
}
