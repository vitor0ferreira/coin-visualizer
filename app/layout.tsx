import type { Metadata } from "next";
import "./globals.css";
import { robotoFont } from "@/lib/fonts";


export const metadata: Metadata = {
  title: "Coin Visualizer",
  description: "A simple Coin Price Visualizer builded with Next and Developed by Ferreira",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${robotoFont.className} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
