/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GoHome } from "react-icons/go";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import {
  Bell,
  BriefcaseBusiness,
  CirclePlus,
  GraduationCap,
  HandCoins,
  LogOut,
  School,
  ShieldAlert,
  ChevronsLeft,
  ChevronsRight,
  LockKeyhole,
} from "lucide-react";
import { PostWithUser } from "@/types/schema";
import CreatePost from "./createPosts";
import ProfilePage from "./ProfilePage";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Modal from "./Modal";


interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { user, signout } = useAuthStore((state) => state);

  // Check if user has paid
  const isPaid = user?.paid || false;

  const router = useRouter();
  const pathname = usePathname();

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const addNewPost = (newPost: PostWithUser) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    closeModal();
  };

  const handleLogout = async () => {
    await signout();
    router.push("/");
  };

  const getLinkClassName = (href: string) =>
    `${pathname === href ? "text-green-500 font-bold" : ""} text-lg cursor-pointer`;

  // Creates either a normal link or a disabled div based on premium status
  const createNavigationItem = (
    href: string, 
    icon: React.ElementType, 
    label: string, 
    isPremium: boolean = false
  ) => {
    // If the feature is premium and user hasn't paid, show locked version
    if (isPremium && !isPaid) {
      return (
        <div 
          className="flex flex-row gap-3 items-center opacity-50 cursor-not-allowed"
          onClick={() => router.push("/dashboard/courses")} // Redirect to courses page when clicked
        >
          {React.createElement(icon, {
            className: getLinkClassName(href),
            size: 24,
          })}
          <p className={`${getLinkClassName(href)} ${isSidebarCollapsed ? "hidden" : "lg:block"}`}>
            {label} <span className="ml-2 text-xs text-[#F26900]"><LockKeyhole /></span>
          </p>
        </div>
      );
    }

    // For non-premium features or if user has paid
    return (
      <Link
        href={href}
        className="flex flex-row gap-3 items-center hover:text-[#37BB65]"
      >
        {React.createElement(icon, {
          className: getLinkClassName(href),
          size: 24,
        })}
        <p className={`${getLinkClassName(href)} ${isSidebarCollapsed ? "hidden" : "lg:block"}`}>
          {label}
        </p>
      </Link>
    );
  };

  return (
    <div className="flex space-x-4 relative w-full">
      <div
        className={`
          hidden 
          md:flex 
          h-[90vh] 
          flex-col 
          justify-between 
          bg-white 
          text-black 
          py-20 
          items-center 
          px-8 
          rounded-tr-xl 
          rounded-br-xl 
          mt-6 
          shadow-lg 
          shadow-black/10
          border-r
          border-gray-800
          border-t
          border-b
          transition-all 
          duration-300 
          ease-in-out
          relative
          ${isSidebarCollapsed ? "w-[100px]" : "w-[300px]"}
        `}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebarCollapse}
          className="absolute top-4 right-4 z-10 hover:bg-gray-100 p-2 rounded-full"
        >
          {isSidebarCollapsed ? (
            <ChevronsRight size={24} />
          ) : (
            <ChevronsLeft size={24} />
          )}
        </button>

        <div className="flex flex-col space-y-12 w-full">
          <div className="flex flex-col space-y-2 mb-10">
            <p
              className={`text-lg text-black/50 ${isSidebarCollapsed ? "hidden" : "lg:block"}`}
            >
              Overview
            </p>

            {/* Admin Link */}
            {user?.role === "admin" &&
              createNavigationItem("/admin", ShieldAlert, "Admin")}

            <div className="flex flex-col space-y-2">
              {/* Home link - always accessible */}
              {createNavigationItem("/dashboard", GoHome, "Home")}
              
              {/* Courses link - always accessible */}
              {createNavigationItem("/dashboard/courses", GraduationCap, "Courses")}
              
              {/* Premium features */}
              {createNavigationItem("/dashboard/jobs", BriefcaseBusiness, "Jobs", true)}
              {createNavigationItem("/dashboard/scholarships", School, "Scholarships", true)}
              {createNavigationItem("/dashboard/fundings", HandCoins, "Fundings", true)}

              {/* Add Post Button */}
              <button
                onClick={openModal}
                className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] p-0 bg-transparent"
              >
                <CirclePlus className={getLinkClassName("/posts")} size={24} />
                <p
                  className={`
                    text-lg 
                    ${isSidebarCollapsed ? "hidden" : "lg:block"}
                  `}
                >
                  Add Post
                </p>
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="flex flex-col space-y-2">
            <p
              className={`text-lg text-black/50 ${isSidebarCollapsed ? "hidden" : "lg:block"}`}
            >
              Account
            </p>

            {/* Profile Button */}
            <button
              onClick={openProfileModal}
              className="flex flex-row gap-3 items-center"
            >
              <IoPersonOutline
                className={getLinkClassName("/profile")}
                size={24}
              />
              <p
                className={`
                  ${getLinkClassName("/profile")} 
                  ${isSidebarCollapsed ? "hidden" : "lg:block"}
                `}
              >
                Profile
              </p>
            </button>

            {/* Notifications Link */}
            <Link
              href="/dashboard/notifications"
              className="flex flex-row gap-3 items-center"
            >
              <Bell
                className={getLinkClassName("/dashboard/notifications")}
                size={24}
              />
              <p
                className={`
                  ${getLinkClassName("/dashboard/notifications")} 
                  ${isSidebarCollapsed ? "hidden" : "lg:block"}
                `}
              >
                Notifications
              </p>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col space-y-2">
          {/* Help Link */}
          <Link
            href="/dashboard/help"
            className="flex flex-row gap-3 items-center"
          >
            <IoMdHelpCircleOutline
              className={getLinkClassName("/dashboard/help")}
              size={24}
            />
            <p
              className={`
                ${getLinkClassName("/dashboard/help")} 
                ${isSidebarCollapsed ? "hidden" : "lg:block"}
              `}
            >
              Help & support
            </p>
          </Link>

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
          >
            <LogOut size={24} />
            <p
              className={`
                text-lg 
                ${isSidebarCollapsed ? "hidden" : "lg:block"}
              `}
            >
              Logout
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CreatePost userId={user?.user_id || ""} onPostCreated={addNewPost} />
        </Modal>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg">
            <ProfilePage />
            <button
              onClick={closeProfileModal}
              className="mt-4 bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default OverView;