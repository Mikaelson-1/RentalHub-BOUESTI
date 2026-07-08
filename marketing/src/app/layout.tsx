import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F4EEE4',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rentalhub.ng'),
  title: 'RentalHub — Verified Student Housing Near Your Campus',
  description:
    "Find safe, verified, affordable student housing near Nigeria's top universities. No agents. No scams. See the real total cost upfront.",
  keywords: [
    'student housing Nigeria',
    'student accommodation UNILAG',
    'student accommodation UI',
    'off-campus housing Nigeria',
    'verified student rentals',
  ],
  alternates: { canonical: 'https://rentalhub.ng' },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://rentalhub.ng',
    siteName: 'RentalHub',
    title: 'RentalHub — Verified Student Housing Near Your Campus',
    description:
      "Verified student housing across Nigeria's top universities. No agents. No scams.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentalHub — Verified Student Housing Near Your Campus',
    description: 'No agents. No scams. Verified student housing across Nigeria.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="font-sans bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
