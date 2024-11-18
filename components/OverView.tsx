"use client";

import React, { ReactNode } from "react";
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
      <div className="flex flex-col space-y-4 bg-white text-black p-4 rounded mt-6 shadow-lg shadow-black w-[250px] ">
        <div className="flex flex-col space-y-4">
          <p className="text-lg py-4 font-semibold">Overview</p>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row gap-3 cursor-pointer hover:text-[#37BB65]">
              <GoHome size={24} />
              <p className="text-base">Home</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <HiMiniClipboardDocumentList size={24} />
              <p className="text-base">Courses</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoIosPeople size={24} />
              <p className="text-base">Community</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <MdOutlineAddCircle size={24} />
              <p className="text-base">Post</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <BriefcaseBusiness size={24} />
              <p className="text-base">Job</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <School size={24} />
              <p className="text-base">Scholarship</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-4 font-semibold">Account</p>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoPersonOutline size={24} />
              <p className="text-base">Profile & settings</p>
            </div>
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoNotifications size={24} />
              <p className="text-base">Notifications</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-2 font-semibold">Other features</p>
          <div className="space-y-4 mb-2">
            <div className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <IoMdHelpCircleOutline size={24} className="" />
              <p className="text-base">Help & support</p>
            </div>
            <div
              className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
              onClick={handleLogout}
            >
              <IoMdLogOut size={24} />
              <p className="text-base">Logout</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default OverView;
