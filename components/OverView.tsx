"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import ModalComp from "./ModalComp";

interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isCoursesModalOpen, setCoursesModalOpen] = useState(false); // State for Courses modal
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const notAuthorizedLinks = ["Community", "Scholarship"];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, linkName: string) => {
    if (notAuthorizedLinks.includes(linkName)) {
      e.preventDefault();
      alert(`You are not authorized to access "${linkName}"`);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const getLinkClassName = (href: string) =>
    `flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] ${
      pathname === href ? "text-green-500 font-bold" : ""
    }`;

  return (
    <div className="flex space-x-4 w-full pr-4">
      <div className="flex flex-col space-y-4 bg-white text-black py-4 items-center rounded-tr-xl mt-6 shadow-lg shadow-black lg:w-[250px] w-[100px]">
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-4 font-semibold hidden lg:block">Overview</p>
          <div className="flex flex-col space-y-2">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              <GoHome size={24} />
              <p className="text-base hidden lg:block">Home</p>
            </Link>
            <button
              onClick={() => setCoursesModalOpen(true)}
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
            >
              <HiMiniClipboardDocumentList size={24} />
              <p className="text-base hidden lg:block">Courses</p>
            </button>
            <Link
              href="/community"
              className={getLinkClassName("/community")}
              onClick={(e) => handleLinkClick(e, "Community")}
            >
              <IoIosPeople size={24} />
              <p className="text-base hidden lg:block">Community</p>
            </Link>
            <Link
              href="/post"
              className={getLinkClassName("/post")}
              onClick={(e) => handleLinkClick(e, "Post")}
            >
              <MdOutlineAddCircle size={24} />
              <p className="text-base hidden lg:block">Post</p>
            </Link>
            <Link
              href="/jobs"
              className={getLinkClassName("/jobs")}
              onClick={(e) => handleLinkClick(e, "Job")}
            >
              <BriefcaseBusiness size={24} />
              <p className="text-base hidden lg:block">Job</p>
            </Link>
            <Link
              href="/scholarships"
              className={getLinkClassName("/scholarships")}
              onClick={(e) => handleLinkClick(e, "Scholarship")}
            >
              <School size={24} />
              <p className="text-base hidden lg:block">Scholarship</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-4 font-semibold hidden lg:block">Account</p>
          <Link href="/profile" className={getLinkClassName("/profile")}>
            <IoPersonOutline size={24} />
            <p className="text-base hidden lg:block">Profile & settings</p>
          </Link>
          <Link href="/notifications" className={getLinkClassName("/notifications")}>
            <IoNotifications size={24} />
            <p className="text-base hidden lg:block">Notifications</p>
          </Link>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-2 font-semibold hidden lg:block">Other features</p>
          <Link href="/help" className={getLinkClassName("/help")}>
            <IoMdHelpCircleOutline size={24} />
            <p className="text-base hidden lg:block">Help & support</p>
          </Link>
          <div
            className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
            onClick={handleLogout}
          >
            <IoMdLogOut size={24} />
            <p className="text-base hidden lg:block">Logout</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalComp isOpen={isCoursesModalOpen} onClose={() => setCoursesModalOpen(false)}>
        <h2 className="text-lg font-bold">Courses Information</h2>
        <p>This modal shows detailed information about courses.</p>
      </ModalComp>

      {children}
    </div>
  );
};

export default OverView;
