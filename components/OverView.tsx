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
} from "lucide-react";
import ModalComp from "./ModalComp";
import { AuthState, PostWithUser } from "@/types/schema";
import CreatePost from "./createPosts";
import ProfilePage from "./ProfilePage";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Modal from "./Modal";
import { useCourseStore } from "@/lib/store/courseStore";
import { useQuestionStore } from "@/lib/hooks/useQuestionStore";

interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isCoursesModalOpen, setCoursesModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { isLocked } = useCourseStore(); // Get the lock state from the store
  const { testStarted } = useQuestionStore();
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);
  const [restrictedLink, setRestrictedLink] = useState("");

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    linkName: string,
    isLocked: boolean
  ) => {
    if (isLocked) {
      e.preventDefault(); // Prevent navigation only if locked
      setRestrictedLink(linkName);
      setIsRestrictedModalOpen(true);
    }
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const { user, signout } = useAuthStore((state) => state as AuthState);

  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className="flex space-x-4 relative w-full">
      <div className="hidden overflow-y-auto md:flex h-[90vh] flex-col justify-between bg-white text-black py-20 items-center px-8 rounded-tr-xl rounded-br-xl mt-6 shadow-lg shadow-black/10 lg:w-[250px] md:w-[75px]">
        <div className="flex flex-col space-y-12">
          <div className="flex flex-col space-y-2 mb-10">
            <p className="text-lg text-black/50 lg:block hidden">Overview</p>
            <div className="flex flex-col space-y-2">
              {[
                { href: "/dashboard", icon: GoHome, label: "Home" },
                {
                  href: "/dashboard/courses",
                  icon: GraduationCap,
                  label: "Courses",
                  restricted: testStarted,
                },
                {
                  href: "/dashboard/jobs",
                  icon: BriefcaseBusiness,
                  label: "Jobs",
                  restricted: isLocked,
                },
                {
                  href: "/dashboard/scholarships",
                  icon: School,
                  label: "Scholarships",
                  restricted: isLocked,
                },
                {
                  href: "/dashboard/fundings",
                  icon: HandCoins,
                  label: "Fundings",
                  restricted: isLocked,
                },
              ].map(({ href, icon: Icon, label, restricted }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={(e) =>
                    restricted && handleLinkClick(e, label, isLocked)
                  }
                  className="flex flex-row gap-3 items-center hover:text-[#37BB65]"
                >
                  <Icon className={getLinkClassName(href)} size={24} />
                  <p className={`${getLinkClassName(href)} lg:block hidden`}>
                    {label}
                  </p>
                </Link>
              ))}
              <button
                onClick={openModal}
                className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] p-0 bg-transparent"
              >
                <CirclePlus className={getLinkClassName("/posts")} size={24} />
                <p className="text-lg lg:block hidden">Post</p>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <p className="text-lg text-black/50 lg:block hidden">Account</p>
            <button
              onClick={openProfileModal}
              className="flex flex-row gap-3 items-center"
            >
              <IoPersonOutline
                className={getLinkClassName("/profile")}
                size={24}
              />
              <p className={`${getLinkClassName("/profile")} lg:block hidden`}>
                Profile
              </p>
            </button>
            <Link
              href="/notifications"
              className="flex flex-row gap-3 items-center"
            >
              <Bell className={getLinkClassName("/notifications")} size={24} />
              <p
                className={`${getLinkClassName("/notifications")} lg:block hidden`}
              >
                Notifications
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Link href="/help" className="flex flex-row gap-3 items-center">
            <IoMdHelpCircleOutline
              className={getLinkClassName("/help")}
              size={24}
            />
            <p className={`${getLinkClassName("/help")} lg:block hidden`}>
              Help & support
            </p>
          </Link>
          <div
            onClick={handleLogout}
            className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
          >
            <LogOut size={24} />
            <p className="text-lg lg:block hidden">Logout</p>
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

      {/* Restricted Modal */}
      {isRestrictedModalOpen && (
        <Modal
          isOpen={isRestrictedModalOpen}
          onClose={() => setIsRestrictedModalOpen(false)}
        >
          <h2 className="text-lg font-bold">Only Accessable For Paid Members</h2>
          <p>
            This page is restricted. Please unlock the course to access this
            page.
          </p>
        </Modal>
      )}

      <ModalComp
        isOpen={isCoursesModalOpen}
        onClose={() => setCoursesModalOpen(false)}
      >
        <h2 className="text-lg font-bold">Courses Information</h2>
        <p>This modal shows detailed information about courses.</p>
      </ModalComp>

      {children}
    </div>
  );
};

export default OverView;
