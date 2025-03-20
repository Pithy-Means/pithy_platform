import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { UserProvider } from "@/context/UserContext";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Pithy Means ",
  description: "Discover your potential with Pithy Means",
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
      </body>
    </html>
  );
}
