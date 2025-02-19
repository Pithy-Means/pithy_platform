/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
// import dynamic from "next/dynamic";
import ShareSomething from "@/components/ShareSomething";
import PersonSidebar from "@/components/PersonSidebar";

// Lazy load the sidebar component
// const PersonSidebar = dynamic(() => import("@/components/PersonSidebar"), { ssr: true });

function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 w-full relative">
      {/* Main content area */}
      <div className="px-4 sm:px-6 lg:px-8 w-full lg:w-[65%]">
        <ShareSomething />
      </div>
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col space-y-4 h-screen w-1/3 lg:py-6 lg:px-4 z-10">
        <PersonSidebar />
      </div>
    </div>
  );
}

export default Dashboard;