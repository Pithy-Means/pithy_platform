import DiscoverFit from "@/components/DiscoverFit";
import Footer from "@/components/Footer";
import FreqAskeQuestion from "@/components/FreqAskeQuestion";
import SpecialMobile from "@/components/SpecialMobile";
import SpecialOffer from "@/components/SpecialOffer";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:  "How It Works",
  description: "Learn how Pithy Means works and how you can benefit from our platform.",
  keywords: ["Pithy Means", "how it works", "benefits", "platform"],
  openGraph: {
    title: "How It Works",
    description: "Learn how Pithy Means works and how you can benefit from our platform.",
    url: "https://www.pithymeans.com/how-it-works",
    siteName: "Pithy Means",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Pithy Means - Empowering Individuals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works",
    description: "Learn how Pithy Means works and how you can benefit from our platform.",
    images: ["/opengraph-image.png"],
  },
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Header Section */}
      <div className="flex justify-center items-center h-72 bg-black w-full top-0">
        <h1 className="text-green-600 text-lg md:text-2xl lg:text-3xl xl:text-5xl 4k:text-6xl">
          How It Works
        </h1>
      </div>

      {/* DiscoverFit Component */}
      <DiscoverFit />

      {/* Ensure FreqAskeQuestion gets full width */}
      <div className="w-full">
        <FreqAskeQuestion />
      </div>

      {/* Special Offer for larger screens */}
      <div className="lg:block hidden w-full">
        <SpecialOffer />
      </div>

      {/* Special Mobile Offer for smaller screens */}
      <div className="lg:hidden block w-full">
        <SpecialMobile />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
