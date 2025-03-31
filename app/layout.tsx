import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modern File Converter - Fast, Secure, and Easy File Conversion',
  description:
    'Convert your files quickly and securely with our Modern File Converter. Supports various formats including PDF, JPG, PNG, and more.',
  keywords:
    'file converter, online file conversion, PDF converter, image converter, audio converter',
  openGraph: {
    title: 'Modern File Converter',
    description:
      'Fast, secure, and easy file conversion for all your needs. Convert files to various formats effortlessly.',
    url: 'https://converter-chi-three.vercel.app/',
    siteName: 'Modern File Converter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Modern File Converter Preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modern File Converter',
    description:
      'Convert your files quickly and securely with our Modern File Converter.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
