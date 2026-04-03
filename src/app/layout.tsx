import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://rentalhub.ng"),
  title: {
    default: "RentalHub NG - Off-Campus Accommodation",
    template: "%s | RentalHub NG",
  },
  description:
    "Find verified off-campus accommodation for Nigerian students. Browse properties near BOUESTI, book rooms, and manage your listings.",
  keywords: ["student accommodation", "off-campus housing", "BOUESTI", "Nigeria student housing", "rental", "RentalHub"],
  authors: [{ name: "RentalHub NG" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://rentalhub.ng",
    siteName: "RentalHub NG",
    title: "RentalHub NG - Off-Campus Accommodation",
    description:
      "Find verified off-campus accommodation for Nigerian students. Browse properties near BOUESTI, book rooms, and manage your listings.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "RentalHub NG" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentalHub NG - Off-Campus Accommodation",
    description: "Find verified off-campus accommodation for Nigerian students.",
    images: ["/og-default.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans overflow-x-hidden">
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
