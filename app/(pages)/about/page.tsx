// 'use client';

import OurImpact from "@/components/OurImpact";
import OurStory from "@/components/OurStory";
import Partnerships from "@/components/Partnerships";
// import ErrorBoundary from "@/components/ErrorBoundary";

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
