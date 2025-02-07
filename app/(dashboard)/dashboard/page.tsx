/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useContext, useState } from "react";
import dynamic from "next/dynamic";
import ShareSomething from "@/components/ShareSomething";
import { BriefcaseBusiness, School } from "lucide-react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineAddCircle } from "react-icons/md";

import Link from 'next/link';
import Modal from "@/components/Modal";
import CreatePosts from "@/components/createPosts";
import { PostWithUser } from "@/types/schema";
import { UserContext } from "@/context/UserContext";

// Lazy load the sidebar component
const PersonSidebar = dynamic(() => import("@/components/PersonSidebar"), { ssr: false });

function Dashboard() {
  return (
    <div className="flex  flex-col lg:flex-row  lg:space-x-4 w-full relative">
      {/* Main content area */}
      <div className="px-4 sm:px-6 lg:px-8 w-full lg:w-[65%]">
        <ShareSomething />
      </div>
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col space-y-4 h-screen w-1/4  lg:py-6 lg:px-4  z-10">
        <PersonSidebar />
      </div>
    </div>
  );
}

export default Dashboard;