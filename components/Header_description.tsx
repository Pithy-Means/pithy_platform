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
    </div>
  );
};

export default Header_description;
