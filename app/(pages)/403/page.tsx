import Custom403 from "@/components/403";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Forbidden",
  description: "You are not allowed to access this page.",
  keywords: ["Pithy Means", "forbidden", "access denied"],
  openGraph: {
    title: "Forbidden",
    description: "You are not allowed to access this page.",
    url: "https://www.pithymeans.com/403",
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
    title: "Forbidden",
    description: "You are not allowed to access this page.",
    images: ["/opengraph-image.png"],
  },
}

export default function Page() {
  return <Custom403 />;
}
