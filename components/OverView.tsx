/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
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
import { useAuthStore } from "@/lib/store/useAuthStore";
// import { useCourseStore } from "@/lib/store/courseStore";
import Modal from "./Modal";
import ProfileContainer from "./ProfileContainer";

interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  // Toggle sidebar collapse
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { user, signout } = useAuthStore((state) => state);
  // const { isCoursePurchased } = useCourseStore();

  // Check if user has paid
  const isPaid = user?.paid || false;

  const router = useRouter();
  const pathname = usePathname();

  // Check if the user has purchased any courses
  useEffect(() => {
    const checkPremiumAccess = async () => {
      if (user && user.user_id) {
        // First check if the user is already marked as paid in their profile
        if (user.paid) {
          setHasPremiumAccess(true);
          return;
        }

        // Otherwise, check if they've purchased any courses
        try {
          const response = await fetch(
            `/api/user/purchased-courses?userId=${user.user_id}`,
          );
          if (response.ok) {
            const data = await response.json();
            const hasPurchasedCourses = data.courses && data.courses.length > 0;
            setHasPremiumAccess(hasPurchasedCourses);

            // Update the user's paid status in AuthStore if they have purchased courses
            if (hasPurchasedCourses && !user.paid) {
              // This would require adding an updateUser method to the auth store
              // We'll create this method in the next step
              useAuthStore.getState().updateUserPaidStatus(true);
            }
          }
        } catch (error) {
          console.error("Error checking purchased courses:", error);
        }
      }
    };

    checkPremiumAccess();
  }, [user]);

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
    isPremium: boolean = false,
  ) => {
    // Use the combined premium status check (user.paid OR hasPremiumAccess)
    const hasAccess = isPaid || hasPremiumAccess;

    // If the feature is premium and user hasn't paid, show locked version
    if (isPremium && !hasAccess) {
      return (
        <div
          className="flex flex-row gap-3 items-center opacity-50 cursor-not-allowed"
          onClick={() => router.push("/dashboard/courses")} // Redirect to courses page when clicked
        >
          {React.createElement(icon, {
            className: getLinkClassName(href),
            size: 24,
          })}
          <div
            className={`${getLinkClassName(href)} ${isSidebarCollapsed ? "hidden" : "flex flex-row space-x-2"}`}
          >
            <p>{label}</p>
            <span className="ml-2 text-xs text-[#F26900]">
              <LockKeyhole />
            </span>
          </div>
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
        <p
          className={`${getLinkClassName(href)} ${isSidebarCollapsed ? "hidden" : "lg:block"}`}
        >
          {label}
        </p>
      </Link>
    );
  };

  return (
    <div className="flex space-x-4 relative w-full">
      {/* Fixed Sidebar (no scrolling) */}
      <div
        className={`
          hidden 
          md:flex 
          h-screen
          sticky
          top-0
          flex-col 
          justify-between 
          bg-white 
          text-black 
          py-20 
          items-center 
          px-8 
          rounded-tr-xl 
          rounded-br-xl 
          my-6 
          shadow-lg 
          shadow-black/10
          border-r
          border-slate-500
          border-t
          border-b
          transition-all 
          duration-800 
          ease-in-out
          ${isSidebarCollapsed ? "w-[100px]" : "w-[340px]"}
        `}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebarCollapse}
          className="absolute top-4 right-4 z-10 hover:bg-green-400 p-2 rounded-full"
        >
          {isSidebarCollapsed ? (
            <ChevronsRight
              size={24}
              className="text-black/25 hover:text-white"
            />
          ) : (
            <ChevronsLeft
              size={24}
              className="text-black/25 hover:text-white"
            />
          )}
        </button>

        <div className="flex flex-col justify-between h-full w-full">
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
              {createNavigationItem(
                "/dashboard/courses",
                GraduationCap,
                "Courses",
              )}

              {/* Premium features */}
              {createNavigationItem(
                "/dashboard/jobs",
                BriefcaseBusiness,
                "Jobs",
                true,
              )}
              {createNavigationItem(
                "/dashboard/scholarships",
                School,
                "Scholarships",
                true,
              )}
              {createNavigationItem(
                "/dashboard/fundings",
                HandCoins,
                "Fundings",
                true,
              )}

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
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CreatePost userId={user?.user_id || ""} onPostCreated={addNewPost} />
        </Modal>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <Modal isOpen={isProfileModalOpen} onClose={closeProfileModal}>
          <ProfileContainer />
        </Modal>
      )}
    </div>
  );
};

export default OverView;