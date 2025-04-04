import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { UserProvider } from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pithymeansplus.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  title: {
    default: "Pithy Means",
    template: "%s - Pithy Means",
  },
  description: "Discover your potential, value, and insights with Pithy Means. Empowering individuals with tools and resources to achieve their goals.",
  keywords: ["Pithy Means", "self-improvement", "personal growth", "goal setting", "empowerment", "tools for success"],
  openGraph: {
    title: "Pithy Means",
    description: "Discover your potential, value, and insights with Pithy Means. Empowering individuals with tools and resources to achieve their goals.",
    url: "https://www.pithymeans.com",
    siteName: "Pithy Means",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pithy Means - Empowering Individuals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pithy Means",
    description: "Discover your potential, value, and insights with Pithy Means. Empowering individuals with tools and resources to achieve their goals.",
    images: ["/og-image.jpg"],
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
        {/* Favicon for all devices */}
        <link rel="icon" href="/favicon.ico" />
        {/** Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Optionally, add more sizes for better support */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <UserProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </UserProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
