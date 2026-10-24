import type { Metadata, Viewport } from "next";
import { Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InstaAud",
  description: "Turn Instagram Reel audio into MP3 files.",
};

export const viewport: Viewport = {
  themeColor: "#4a56d4",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={shadows.variable}>
      <body>{children}</body>
    </html>
  );
}