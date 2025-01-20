'use client';

import React from "react";
import dynamic from "next/dynamic";
import Community from "@/components/communty";
import ShareSomething from "@/components/ShareSomething";
import { BriefcaseBusiness, School } from "lucide-react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineAddCircle } from "react-icons/md";

import { NavLink } from 'react-router-dom';

const PersonSidebar = dynamic(() => import("@/components/PersonSidebar"), { ssr: false });

function Dashboard() {
  return (
    <div className="flex  flex-col lg:flex-row  lg:space-x-4 w-full ">
      {/* Main content area */}
      <div className="px-4 sm:px-6 lg:px-8 w-full lg:w-[70%] xl:w-[75%]">
        <ShareSomething />
      </div>


      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col space-y-4 absolute right-0 top-30 h-screen w-1/4  lg:py-6 lg:px-4  z-10">
        <PersonSidebar />
        <Community />
      </div>

      {/* Fixed bottom bar for smaller screens */}
      <div className="fixed bottom-0 h-20 w-full block md:hidden bg-[#5AC35A] py-4 z-10">
        <div className="flex justify-around items-center text-white">
          <NavLink
            to='/'
            aria-label="Home"
            className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-gray-800')}
          >
            <GoHome size={28} />
          </NavLink>
          <NavLink
            to='/Posts'
            aria-label="Posts"
            className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-gray-800')}
          >
            <HiMiniClipboardDocumentList size={28} />
          </NavLink>
          <NavLink
            to='/CreatePosts'
            aria-label="Create Post"
            className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-gray-800')}
          >
            <MdOutlineAddCircle size={28} />
          </NavLink>
          <NavLink
            to='/JobList'
            aria-label="Jobs"
            className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-gray-800')}
          >
            <BriefcaseBusiness size={28} />
          </NavLink>
          <NavLink
            to='/CourseList'
            aria-label="School"
            className={({ isActive }) => (isActive ? 'text-white' : 'hover:text-gray-800')}
          >
            <School size={28} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
