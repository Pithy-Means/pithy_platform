"use client";

import React from "react";
// import Image from "next/image";
import Posts from "./Posts";
import { CircleUserRound } from "lucide-react";
// import InputContact from "./InputContact";
import { Button } from "./ui/button";

const ShareSomething = () => {
  return (
    <div className="flex flex-col w-full no-scrollbar max-h-screen">
      {/* Header Section */}
      <div className="flex flex-col bg-white text-black px-6 justify-center rounded h-16 p-4 m-6">
        <div className="flex items-center w-full space-x-4">
          {/* Icon */}
          <CircleUserRound size={32} className="flex-shrink-0" />

          {/* Input */}
          <input
            type="text"
            placeholder="Share something"
            className="border-2 border-gray-300 rounded flex-1 py-1.5 px-4" 
            value="" // Add the value property
            onChange={() => {}} // Open modal when the input is clicked
          />

          {/* Button */}
          <Button className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-2 px-6 flex-shrink-0">
            Post
          </Button>
        </div>
      </div>

      {/* Scrollable Posts Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 h-full">
        <Posts />
      </div>
    </div>
  );
};

export default ShareSomething;
