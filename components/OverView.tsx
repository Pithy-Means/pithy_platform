"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoNotifications } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { BriefcaseBusiness, School } from "lucide-react";
import { logoutUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface OverViewProps {
  children?: ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <div className="flex space-x-4 w-full pr-4">
      <div className="flex flex-col space-y-4 bg-white text-black p-4 items-center rounded-tr-xl mt-6 shadow-lg shadow-black lg:w-[250px] w-[100px]">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <p className="text-lg py-4 font-semibold hidden lg:block">Overview</p>
          <div className="flex flex-col space-y-2">
            {/* Home */}
            <Link href="/dashboard" className="flex flex-row gap-3 cursor-pointer hover:text-[#37BB65]">
              <GoHome size={24} />
              <p className="text-base hidden lg:block">Home</p>
            </Link>
            {/* Courses */}
            <Link href="/courses" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <HiMiniClipboardDocumentList size={24} />
              <p className="text-base hidden lg:block">Courses</p>
            </Link>
            {/* Community */}
            <Link href="/community" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoIosPeople size={24} />
              <p className="text-base hidden lg:block">Community</p>
            </Link>
            {/* Post */}
            <Link href="/post" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <MdOutlineAddCircle size={24} />
              <p className="text-base hidden lg:block">Post</p>
            </Link>
            {/* Job */}
            <Link href="/jobs" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <BriefcaseBusiness size={24} />
              <p className="text-base hidden lg:block">Job</p>
            </Link>
            {/* Scholarship */}
            <Link href="/scholarships" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <School size={24} />
              <p className="text-base hidden lg:block">Scholarship</p>
            </Link>
          </div>
        </div>

        {/* Account Section */}
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-4 font-semibold hidden lg:block">Account</p>
          <div className="flex flex-col space-y-2">
            {/* Profile & Settings */}
            <Link href="/profile" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoPersonOutline size={24} />
              <p className="text-base hidden lg:block">Profile & settings</p>
            </Link>
            {/* Notifications */}
            <Link href="/notifications" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoNotifications size={24} />
              <p className="text-base hidden lg:block">Notifications</p>
            </Link>
          </div>
        </div>

        {/* Other Features */}
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-2 font-semibold hidden lg:block">Other features</p>
          <div className="space-y-4 mb-2">
            {/* Help & Support */}
            <Link href="/help" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoMdHelpCircleOutline size={24} />
              <p className="text-base hidden lg:block">Help & support</p>
            </Link>
            {/* Logout */}
            <div
              className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
              onClick={handleLogout}
            >
              <IoMdLogOut size={24} />
              <p className="text-base hidden lg:block">Logout</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default OverView;
