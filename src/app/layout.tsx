import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VED COURIER LOGISTICS — International Courier, Freight & Global Tracking",
  description: "Reliable international logistics, air cargo, ocean freight, express courier, and end-to-end parcel tracking connecting the US, China, United Kingdom, South Korea, and global trade corridors. Your Shipment. Our Responsibility.",
  keywords: "VED Courier Logistics, international freight, shipment tracking, air cargo, ocean freight, courier USA to China, courier China to UK, express parcel delivery",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/images/ved-logo.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/images/ved-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/ved-logo.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-[#e22026] selection:text-white">
        {children}
      </body>
    </html>
  );
}
