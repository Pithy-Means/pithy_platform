/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 80;
const TRANSITION_DURATION = 250; // ms

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar collapse with proper animation sequence
  const toggleSidebarCollapse = useCallback(() => {
    if (!isSidebarCollapsed) {
      // When collapsing: first hide text, then animate width
      setTextVisible(false);
      setTimeout(() => {
        setIsSidebarCollapsed(true);
      }, TRANSITION_DURATION / 2);
    } else {
      // When expanding: first animate width, then show text
      setIsSidebarCollapsed(false);
      setTimeout(() => {
        setTextVisible(true);
      }, TRANSITION_DURATION / 2);
    }
  }, [isSidebarCollapsed, setTextVisible, setIsSidebarCollapsed]);

  const { user, signout } = useAuthStore((state) => state);
  const isPaid = user?.paid || false;
  const router = useRouter();
  const pathname = usePathname();

  // Save sidebar state in localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('isSidebarCollapsed');
    if (savedState !== null) {
      const isCollapsed = JSON.parse(savedState);
      setIsSidebarCollapsed(isCollapsed);
      setTextVisible(!isCollapsed);
    }
  }, []);

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem('isSidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Add escape key functionality to collapse sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSidebarCollapsed) {
        toggleSidebarCollapse();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarCollapsed, toggleSidebarCollapse]);

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

  // Modal controls
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
    `${pathname === href ? "text-green-500 font-bold" : ""} text-lg cursor-pointer transition-colors duration-200`;

  // Animation classes for text elements based on sidebar state
  const getTextClassName = (baseClasses = "") => `
    ${baseClasses}
    transform
    transition-all
    duration-${TRANSITION_DURATION}
    ${textVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"}
  `;

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
          className="flex flex-row gap-3 items-center opacity-50 cursor-not-allowed group relative w-full py-2"
          onClick={() => router.push("/dashboard/courses")} // Redirect to courses page when clicked
          role="button"
          aria-label={`${label} (Premium Feature)`}
          tabIndex={0}
        >
          <div className="min-w-6 flex justify-center">
            {React.createElement(icon, {
              className: getLinkClassName(href),
              size: 24,
              "aria-hidden": "true",
            })}
          </div>
          <div className={getTextClassName(getLinkClassName(href))}>
            <div className="flex flex-row items-center space-x-2">
              <p>{label}</p>
              <span className="text-xs text-[#F26900]">
                <LockKeyhole aria-hidden="true" />
              </span>
            </div>
          </div>
          
          {/* Tooltip for collapsed state */}
          {!textVisible && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
              {label} (Premium)
            </div>
          )}
        </div>
      );
    }

    // For non-premium features or if user has paid
    return (
      <Link
        href={href as any}
        className="flex flex-row gap-3 items-center hover:text-[#37BB65] group relative w-full py-2"
        aria-label={label}
      >
        <div className="min-w-6 flex justify-center">
          {React.createElement(icon, {
            className: getLinkClassName(href),
            size: 24,
            "aria-hidden": "true",
          })}
        </div>
        <p className={getTextClassName(getLinkClassName(href))}>
          {label}
        </p>
        
        {/* Tooltip for collapsed state */}
        {!textVisible && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
            {label}
          </div>
        )}
      </Link>
    );
  };

  // Custom spring animation style for sidebar
  const sidebarStyle = {
    width: isSidebarCollapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_EXPANDED_WIDTH}px`,
    transition: `width ${TRANSITION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  };

  return (
    <div className="flex space-x-4 relative w-full">
      {/* Fixed Sidebar with custom spring animation */}
      <div
        ref={sidebarRef}
        style={sidebarStyle}
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
          px-4
          rounded-tr-xl 
          rounded-br-xl 
          my-6 
          shadow-lg 
          shadow-black/10
          border-r
          border-slate-200
          border-t
          border-b
          overflow-hidden
          will-change-[width]
        `}
        aria-expanded={!isSidebarCollapsed}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={toggleSidebarCollapse}
          className="absolute top-4 right-4 z-10 hover:bg-green-400 p-2 rounded-full border border-slate-200 
                     shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 
                     focus:ring-green-400 focus:ring-opacity-50"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronsRight
              size={20}
              className="text-black hover:text-white transition-colors duration-200"
              aria-hidden="true"
            />
          ) : (
            <ChevronsLeft
              size={20}
              className="text-black hover:text-white transition-colors duration-200"
              aria-hidden="true"
            />
          )}
        </button>

        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex flex-col space-y-1 mb-10">
            <p className={getTextClassName("text-sm font-medium text-black/50 uppercase tracking-wider px-2 mb-2")}>
              Overview
            </p>

            {/* Admin Link */}
            {user?.role === "admin" &&
              createNavigationItem("/admin", ShieldAlert, "Admin")}

            <div className="flex flex-col space-y-1">
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
                className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] group relative w-full py-2 text-left"
                aria-label="Add Post"
              >
                <div className="min-w-6 flex justify-center">
                  <CirclePlus className={getLinkClassName("/posts")} size={24} aria-hidden="true" />
                </div>
                <p className={getTextClassName("text-lg")}>
                  Add Post
                </p>
                
                {/* Tooltip for collapsed state */}
                {!textVisible && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                    Add Post
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="flex flex-col space-y-1">
            <p className={getTextClassName("text-sm font-medium text-black/50 uppercase tracking-wider px-2 mb-2")}>
              Account
            </p>

            {/* Profile Button */}
            <button
              onClick={openProfileModal}
              className="flex flex-row gap-3 items-center group relative w-full py-2 text-left hover:text-[#37BB65]"
              aria-label="Profile"
            >
              <div className="min-w-6 flex justify-center">
                <IoPersonOutline
                  className={getLinkClassName("/profile")}
                  size={24}
                  aria-hidden="true"
                />
              </div>
              <p className={getTextClassName(getLinkClassName("/profile"))}>
                Profile
              </p>
              
              {/* Tooltip for collapsed state */}
              {!textVisible && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Profile
                </div>
              )}
            </button>

            {/* Notifications Link */}
            <Link
              href="/dashboard/notifications"
              className="flex flex-row gap-3 items-center group relative w-full py-2 hover:text-[#37BB65]"
              aria-label="Notifications"
            >
              <div className="min-w-6 flex justify-center">
                <Bell
                  className={getLinkClassName("/dashboard/notifications")}
                  size={24}
                  aria-hidden="true"
                />
              </div>
              <p className={getTextClassName(getLinkClassName("/dashboard/notifications"))}>
                Notifications
              </p>
              
              {/* Tooltip for collapsed state */}
              {!textVisible && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Notifications
                </div>
              )}
            </Link>
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col space-y-1 mt-auto pt-8 border-t border-slate-100">
            {/* Help Link */}
            <Link
              href="/dashboard/help"
              className="flex flex-row gap-3 items-center group relative w-full py-2 hover:text-[#37BB65]"
              aria-label="Help & support"
            >
              <div className="min-w-6 flex justify-center">
                <IoMdHelpCircleOutline
                  className={getLinkClassName("/dashboard/help")}
                  size={24}
                  aria-hidden="true"
                />
              </div>
              <p className={getTextClassName(getLinkClassName("/dashboard/help"))}>
                Help & support
              </p>
              
              {/* Tooltip for collapsed state */}
              {!textVisible && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Help & support
                </div>
              )}
            </Link>

            {/* Logout */}
            <div
              onClick={handleLogout}
              className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer group relative w-full py-2"
              role="button"
              aria-label="Logout"
              tabIndex={0}
            >
              <div className="min-w-6 flex justify-center">
                <LogOut size={24} aria-hidden="true" />
              </div>
              <p className={getTextClassName("text-lg")}>
                Logout
              </p>
              
              {/* Tooltip for collapsed state */}
              {!textVisible && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                  Logout
                </div>
              )}
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