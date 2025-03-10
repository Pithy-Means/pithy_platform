"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const Header_description = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col lg:items-start xl:items-start items-center space-y-4 w-full px-4 lg:px-0 xl:px-2 4k:px-6 relative">
      {/* Reduced and responsive heading */}
      <h1 className="text-xl sm:text-3xl lg:text-4xl xl:text-6xl 4k:text-8xl text-[#5AC35A] font-extrabold lg:text-start text-center">
        Unlock Your Dream Career.
      </h1>

      {/* Responsive paragraph */}
      <p className="text-base sm:text-lg md:text-xl xl:text-2xl 4k:text-5xl lg:text-start text-center">
        Discover Your Strengths, Interest, Perfect Career Match And The Business
        Venture For You
      </p>

      {/* Responsive button */}
      <Button
        onClick={() => router.push("/signIn")}
        className="bg-gradient-to-tr from-[#5AC35A] to-[#00AE76] w-fit text-sm sm:text-base md:text-2xl xl:text-3xl p-3 4k:rounded-md z-10"
      >
        Start Your Journey
      </Button>
      {/* Scholarships - Bottom Center */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 sm:bottom-4 md:bottom-8">
        <div className="flex items-center bg-white/10 px-8 py-10 rounded-full shadow-sm backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
          <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
            Scholarships
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header_description;
