"use client";

import React from "react";
import Header_description from "./Header_description";
import CardImage from "./CardImage";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const BodySection = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between items-center space-y-20 lg:space-y-0 lg:space-x-10 px-6 lg:px-10 py-20 bg-black relative">
      {/* Left Section - Will Expand to Push the Image */}
      <div className="flex-1">
        <Header_description />
      </div>
      {/* Scholarships - Bottom Center */}
      <Button
        onClick={() => router.push("signIn")}
        className="flex items-center bg-white/10 px-8 py-10 rounded-full transform rotate-0 lg:rotate-90 shadow-sm backdrop-blur-sm"
      >
        <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
        <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
          Scholarships
        </span>
      </Button>
      {/* Right Section - Image Centered But Positioned on the Right */}
      <div className="flex-1 flex justify-center lg:justify-end pb-20 lg:pb-0">
        <CardImage />
      </div>

      {/* Absolute Positioned Elements */}
      <>
        {/* Jobs - Top Left */}
        <div className="absolute left-0 top-0 sm:left-4 md:left-8 transform -rotate-6 mt-8">
          <Button
            onClick={() => router.push("signIn")}
            className="flex items-center justify-center bg-white/10 px-8 py-10 rounded-full shadow-sm backdrop-blur-xl"
          >
            <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
            <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
              Jobs
            </span>
          </Button>
        </div>
        {/* Fundings - Top Right */}
        <div className="absolute left-0 bottom-0 sm:left-10 md:left-16 transform rotate-3">
          <Button
            onClick={() => router.push("signIn")}
            className="flex items-center bg-white/10 px-8 py-10 rounded-full shadow-sm backdrop-blur-sm"
          >
            <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
            <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
              Fundings
            </span>
          </Button>
        </div>
      </>
    </div>
  );
};

export default BodySection;
