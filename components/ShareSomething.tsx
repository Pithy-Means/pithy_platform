"use client";


import React from "react";
// import Image from "next/image";
import Posts from "./Posts";
import { CircleUserRound } from "lucide-react";
import InputContact from "./InputContact";

const ShareSomething = () => {
  return (
    <div className="flex flex-col w-full no-scrollbar max-h-screen">
      {/* Header Section */}
      <div className="flex flex-col bg-white text-black px-6 justify-center rounded h-16 p-4 m-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 w-3/4">
            <CircleUserRound size={32} />
            {/* Add the functionality of create a post */}
            <InputContact
              type="text"
              label="Share something"
              className="border-2 border-gray-300 rounded-lg w-full"
              value="" // Add the value property
              onChange={() => {}} // Open modal when the input is clicked
            />
          </div>
            <button
              className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-2 px-6"
            >
              Post
            </button>
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
