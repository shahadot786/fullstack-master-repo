import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Nexus - Full-Stack MERN Application",
  description: "Full-Stack MERN Application - MongoDB, Express, React, Node.js with TypeScript",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/nexus-logo.png',
  },
  openGraph: {
    title: 'Nexus - Full-Stack MERN Application',
    description: 'Full-Stack MERN Application - MongoDB, Express, React, Node.js with TypeScript',
    images: ['/nexus-logo.png'],
  },
  twitter: {
    card: 'summary',
    title: 'Nexus - Full-Stack MERN Application',
    description: 'Full-Stack MERN Application - MongoDB, Express, React, Node.js with TypeScript',
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
