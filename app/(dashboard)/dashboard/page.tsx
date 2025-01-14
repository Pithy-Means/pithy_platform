'use client';

import React from "react";
import dynamic from "next/dynamic";
import Community from "@/components/communty";
import ShareSomething from "@/components/ShareSomething";
import { BriefcaseBusiness, School } from "lucide-react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineAddCircle } from "react-icons/md";

const PersonSidebar = dynamic(() => import("@/components/PersonSidebar"), { ssr: false });

function Dashboard() {
  return (
    <div className="flex space-x-4">
      {/* Main content area */}
      <div className="w-full lg:w-[calc(100vw-600px)] h-screen overflow-y-auto">
        <ShareSomething />
      </div>

      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col space-y-4 overflow-y-auto overflow-x-hidden w-1/4 my-6 lg:relative right-0 lg:top:40">
        <PersonSidebar />
        <Community />
      </div>

      {/* Fixed bottom bar for smaller screens */}
      <div className="fixed left-0 bottom-0 h-20 w-full sm:block md:hidden bg-[#5AC35A] py-4 sm:px-0">
        <div className="flex justify-around items-center text-white">
          <GoHome size={36} />
          <HiMiniClipboardDocumentList size={36} />
          <MdOutlineAddCircle size={36} />
          <BriefcaseBusiness size={36} />
          <School size={36} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
