import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Your Digital Nexus - All-in-one platform for productivity and services",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/nexus-logo.png',
  },
  openGraph: {
    title: 'Nexus',
    description: 'Your Digital Nexus - All-in-one platform for productivity and services',
    images: ['/nexus-logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Nexus',
    description: 'Your Digital Nexus - All-in-one platform for productivity and services',
    images: ['/nexus-logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
