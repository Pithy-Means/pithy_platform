import React from "react";
import { Button } from "./ui/button";

const Header_description = () => {
  return (
    <div className="flex flex-col lg:items-start xl:items-start items-center space-y-4 w-full px-4 lg:px-0 xl:px-2 4k:px-6">
      {/* Reduced and responsive heading */}
      <h1 className="text-xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-text-6xl
       text-[#5AC35A] font-extrabold lg:text-start text-center">
        Unlock Your Dream Career.
      </h1>
      {/* Responsive paragraph */}
      <p className="text-base sm:text-lg md:text-lg lg:text-start lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl  text-center">
        Discover Your Strengths, Interest, Perfect Career Match And The Business
        Venture For You
      </p>
      {/* Responsive button */}
      <Button className="bg-gradient-to-tr from-[#5AC35A] to-[#00AE76] w-fit text-sm sm:text-base md:text-xl lg:text-2xl xl:text-2xl 4k:text-6xl px-4 py-2 4k:px-8 4k:py-10 4k:rounded-md">
        Start Your Journey
      </Button>
    </div>
  );
};

export default Header_description;
