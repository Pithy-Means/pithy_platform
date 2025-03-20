import OurImpact from "@/components/OurImpact";
import OurStory from "@/components/OurStory";
import Partnerships from "@/components/Partnerships";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:  "About Us",
   description: "Learn more about Pithy Means, our story, partnerships, and impact.",
  keywords: ["Pithy Means", "about us", "our story", "partnerships", "impact"],
  openGraph: {
    title: "About Us",
    description: "Learn more about Pithy Means, our story, partnerships, and impact.",
    url: "https://www.pithymeans.com/about",
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
    title: "About Us",
    description: "Learn more about Pithy Means, our story, partnerships, and impact.",
    images: ["/opengraph-image.png"],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center items-center h-72 bg-black w-full top-0">
        <h1 className="text-green-600 text-lg">About Us</h1>
      </div>
      <OurStory />
      <Partnerships />
      <OurImpact />
    </div>
  );
}
