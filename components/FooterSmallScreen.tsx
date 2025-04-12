/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link, BriefcaseBusiness, HandCoins, LockKeyhole, School, MoreHorizontal, LogOut, Bell } from "lucide-react";
import React, { useState, useEffect } from "react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineAddCircle } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import CreatePosts from "./createPosts";
import Modal from "./Modal";
import { AuthState, PostWithUser } from "@/types/schema";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useCourseStore } from "@/lib/store/courseStore";

function FooterSmallScreen() {
  const { user, signout } = useAuthStore((state) => state);
  const [model, setModel] = React.useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

  const router = useRouter();
  const { isCoursePurchased } = useCourseStore();

  // Check if user has paid
  const isPaid = user?.paid || false;

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

  const handleModel = () => {
    setModel(!model);
  };

  const toggleMoreModal = () => {
    setMoreModalOpen(!moreModalOpen);
  };

  const addNewPost = (newPost: PostWithUser) => {
    setPosts((prevPosts: PostWithUser[]) => [newPost, ...prevPosts]);
    setModel(false);
  };

  // Function to navigate based on premium status
  const handlePremiumNavigation = (path: string, isPremium: boolean = false) => {
    // Use the combined premium status check (user.paid OR hasPremiumAccess)
    const hasAccess = isPaid || hasPremiumAccess;

    // If the feature is premium and user hasn't paid, redirect to courses
    if (isPremium && !hasAccess) {
      router.push("/dashboard/courses");
    } else {
      router.push(path);
    }

    // Close the more modal if it's open
    if (moreModalOpen) {
      setMoreModalOpen(false);
    }
  };

  const handleLogout = async () => {
    await signout();
    router.push("/");
    setMoreModalOpen(false);
  };

  return (
    <div>
      {/* Fixed bottom bar for smaller screens */}
      <div className="fixed bottom-0 h-20 w-full block md:hidden bg-[#5AC35A] py-4">
        <div className="flex justify-around items-center text-white">
          <div
            onClick={() => router.push("/dashboard")}
            className="bg-transparent p-0 hover:bg-transparent"
            aria-label="Home"
          >
            <div className="flex flex-col items-center">
              <GoHome size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Home</span>
            </div>
          </div>
          <div
            onClick={() => router.push("/dashboard/courses")}
            className="bg-transparent p-0 hover:bg-transparent"
            aria-label="Courses"
          >
            <div className="flex flex-col items-center">
              <HiMiniClipboardDocumentList
                size={28}
                className="hover:text-gray-800"
              />
              <span className="text-xs text-black/70">Courses</span>
            </div>
          </div>
          <div
            onClick={() => handleModel()}
            className="bg-transparent p-0 hover:bg-transparent"
            aria-label="Create Post"
          >
            <div className="flex flex-col items-center">
              <MdOutlineAddCircle size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Post</span>
            </div>
          </div>
          {/* Jobs div with conditional lock */}
          <div
            onClick={() => handlePremiumNavigation("/dashboard/jobs", true)}
            className="bg-transparent p-0 hover:bg-transparent"
            aria-label="Jobs"
          >
            <div className="flex flex-col items-center relative">
              <BriefcaseBusiness size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Jobs</span>
              {!(isPaid || hasPremiumAccess) && (
                <LockKeyhole 
                  className="absolute -top-2 -right-2 text-[#F26900]" 
                  size={16} 
                />
              )}
            </div>
          </div>
          {/* More div to show additional options */}
          <div
            onClick={toggleMoreModal}
            className="bg-transparent p-0 hover:bg-transparent"
            aria-label="More Options"
          >
            <div className="flex flex-col items-center">
              <MoreHorizontal size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {model && (
        <Modal isOpen={model} onClose={handleModel}>
          <CreatePosts
            userId={user?.user_id || ""}
            onPostCreated={addNewPost}
          />
        </Modal>
      )}

      {/* More Options Modal */}
      {moreModalOpen && (
        <Modal isOpen={moreModalOpen} onClose={toggleMoreModal}>
          <div className="bg-white/10 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">More Options</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Fundings */}
              <div 
                onClick={() => handlePremiumNavigation("/dashboard/fundings", true)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="relative">
                  <HandCoins size={28} className="text-[#5AC35A]" />
                  {!(isPaid || hasPremiumAccess) && (
                    <LockKeyhole className="absolute -top-2 -right-2 text-[#F26900]" size={16} />
                  )}
                </div>
                <span className="text-sm text-white">Funding</span>
              </div>

              {/* Scholarships */}
              <div 
                onClick={() => handlePremiumNavigation("/dashboard/scholarships", true)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <div className="relative">
                  <School size={28} className="text-[#5AC35A]" />
                  {!(isPaid || hasPremiumAccess) && (
                    <LockKeyhole className="absolute -top-2 -right-2 text-[#F26900]" size={16} />
                  )}
                </div>
                <span className="text-sm text-white">Scholarships</span>
              </div>

              {/* Profile */}
              <div 
                onClick={() => {
                  router.push("/dashboard/profile");
                  setMoreModalOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <IoPersonOutline size={28} className="text-[#5AC35A]" />
                <span className="text-sm text-white">Profile</span>
              </div>

              {/* Notifications */}
              <div 
                onClick={() => {
                  router.push("/dashboard/notifications");
                  setMoreModalOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <Bell size={28} className="text-[#5AC35A]" />
                <span className="text-sm text-white">Notifications</span>
              </div>

              {/* Help & Support */}
              <div 
                onClick={() => {
                  router.push("/dashboard/help");
                  setMoreModalOpen(false);
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <IoMdHelpCircleOutline size={28} className="text-[#5AC35A]" />
                <span className="text-sm text-white">Help & Support</span>
              </div>

              {/* Logout */}
              <div 
                onClick={handleLogout}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <LogOut size={28} className="text-[#F26900]" />
                <span className="text-sm text-[#F26900]">Logout</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default FooterSmallScreen;