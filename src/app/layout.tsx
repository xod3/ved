import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VED COURIER LOGISTICS — International Courier, Freight & Global Tracking",
  description: "Reliable international logistics, air cargo, ocean freight, express courier, and end-to-end parcel tracking connecting the US, China, Nigeria, South Korea, and global trade corridors. Your Shipment. Our Responsibility.",
  keywords: "VED Courier Logistics, international freight, shipment tracking, air cargo, ocean freight, courier USA to China, courier China to Nigeria, express parcel delivery",
  icons: {
    icon: "/images/ved-logo.png",
    shortcut: "/images/ved-logo.png",
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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
