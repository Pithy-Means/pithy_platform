import React from "react";
import Header_description from "./Header_description";
import CardImage from "./CardImage";

const BodySection = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between items-center space-y-20 lg:space-y-0 lg:space-x-10 px-6 lg:px-10 py-20 bg-black relative">
      <div className="absolute left-0 top-0 sm:left-4 md:left-8 transform -rotate-6 mt-8">
        <div className="flex items-center justify-center bg-white/10 px-8 py-10 rounded-full shadow-sm backdrop-blur-xl">
          <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
          <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
            Jobs
          </span>
        </div>
      </div>
      <Header_description />

      {/* Fundings - Top Right */}
      <div className="absolute right-0 bottom-1/4 sm:right-10 md:right-16 transform rotate-3">
        <div className="flex items-center bg-white/10 px-8 py-10 rounded-full shadow-sm backdrop-blur-sm">
          <div className="w-2 h-2 bg-[#5AC35A] rounded-full mr-2"></div>
          <span className="text-sm sm:text-base md:text-lg xl:text-xl font-medium text-[#5AC35A]">
            Fundings
          </span>
        </div>
      </div>
      <div className="pb-20 lg:pb-0">
        <CardImage />
      </div>
    </div>
  );
};

export default BodySection;
