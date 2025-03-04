"use client";

import React from "react";
// import Image from "next/image";
import Posts from "./Posts";
import { CircleUserRound } from "lucide-react";
// import InputContact from "./InputContact";
import { Button } from "./ui/button";

const ShareSomething = () => {
  return (
    <div className="flex flex-col no-scrollbar items-center justify-center max-h-screen mt-4">
      {/* Header Section */}
      <div className="flex flex-col bg-white text-black rounded-lg shadow-md p-2 w-full mt-2">
        <div className="flex items-center justify-center">
          {/* Icon */}
          <CircleUserRound size={32} className="flex-shrink-0 text-gray-600 hidden md:block" />

          {/* Input */}
          <input
            type="text"
            placeholder="Search Posts"
            className="border border-gray-300 rounded-lg flex-1 py-1 mx-2  px-2 focus:outline-none focus:ring-2 focus:ring-[#5AC35A]" 
            value="" // Add the value property
            onChange={() => {}} // Open modal when the input is clicked
          />

          {/* Button */}
          <Button className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-1 px-2 flex-shrink-0 hover:bg-gradient-to-tr from[#]">
            Search
          </Button>
        </div>
      </div>

      {/* Scrollable Posts Section */}
      <div className="overflow-y-auto no-scrollbar h-full mt-8 w-full">
        <Posts />
      </div>
    </div>
  );
};

export default ShareSomething;
