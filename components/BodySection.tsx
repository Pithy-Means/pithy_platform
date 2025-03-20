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

      <div className="flex flex-row  lg:justify-evenly sm:items-center sm:justify-between space-x-20 lg:px-6 px-10">
        {/* Scholarships - Bottom Center */}
        <Button onClick={() => router.push("signIn")} className="flex items-center bg-white/10 lg:px-20 lg:py-8 lg:rounded-full px-4 py-6 rounded-md transform lg:rotate-90 shadow-sm backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
          <span className="lg:absolute text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
            Scholarships
          </span>
        </Button>
        <>
          {/* Jobs - Top Left */}
          <div className="lg:absolute lg:left-0 lg:top-0 sm:left-4 md:left-8 transform lg:-rotate-6 mt-8">
            <Button onClick={() => router.push("signIn")} className="flex items-center justify-center bg-white/10 lg:px-8 lg:py-10 lg:rounded-full px-4 py-6 rounded-md shadow-sm backdrop-blur-xl">
              <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
              <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
                Jobs
              </span>
            </Button>
          </div>
          {/* Fundings - Top Right */}
          <div className="lg:absolute lg:left-0 lg:bottom-0 sm:left-10 md:left-16 transform lg:rotate-3 mb-10">
            <Button onClick={() => router.push("signIn")} className="flex items-center bg-white/10 lg:px-8 lg: lg:py-10 lg:rounded-full px-4 py-6 rounded-md shadow-sm backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
              <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
                Fundings
              </span>
            </Button>
          </div>
        </>


      </div>

      {/* Right Section - Image Centered But Positioned on the Right */}
      <div className="flex-1 flex justify-center lg:justify-end pb-20 lg:pb-0">
        <CardImage />
      </div>

      {/* Absolute Positioned Elements */}
    </div>
  );
};

export default BodySection;
