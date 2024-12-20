import React from "react";
import { Button } from "./ui/button";

const Header_description = () => {
  return (
    <div className="flex flex-col lg:items-start items-center space-y-4 w-full px-4 lg:px-0">
      {/* Reduced and responsive heading */}
      <h1 className="text-xl sm:text-3xl lg:text-4xl text-[#5AC35A] font-extrabold lg:text-start text-center">
        Unlock Your Dream Career.
      </h1>
      {/* Responsive paragraph */}
      <p className="text-base sm:text-lg md:text-xl lg:text-start text-center">
        Discover Your Strengths, Interest, Perfect Career Match And The Business
        Venture For You
      </p>
      {/* Responsive button */}
      <Button className="bg-gradient-to-tr from-[#5AC35A] to-[#00AE76] w-fit text-sm sm:text-base md:text-2xl px-4 py-2">
        Start Your Journey
      </Button>
    </div>
  );
};

export default Header_description;
