"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoHome } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { Bell, BriefcaseBusiness, CirclePlus, GraduationCap, LogOut, School } from "lucide-react";
import { logoutUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import ModalComp from "./ModalComp";
import { PostWithUser } from "@/types/schema";
import CreatePost from "./createPosts";
import { UserContext } from "@/context/UserContext";

interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isCoursesModalOpen, setCoursesModalOpen] = useState(false); // State for Courses modal
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = useState<PostWithUser[]>([]); // State to store posts

  const { user } = useContext(UserContext);

  const isCoursesPage = /^\/dashboard\/courses\/[^/]+$/.test(pathname);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to add a new post to the state
  const addNewPost = (newPost: PostWithUser) => {
    setPosts((prevPosts) => {
      console.log("Previous posts:", prevPosts); // Debugging line
      return [newPost, ...(Array.isArray(prevPosts) ? prevPosts : [])];
    });
    closeModal(); // Close the modal after adding the post
  };

  const notAuthorizedLinks = ["Community", "Scholarship"];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    linkName: string
  ) => {
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
    `${
      pathname === href ? "text-green-500 font-bold" : ""
    } text-lg cursor-pointer hover:text-[#37BB65]`;

  return (
    <div className="flex">
      <div className="hidden md:flex h-screen flex-col justify-between bg-white text-black py-20 items-center rounded-tr-xl rounded-br-xl mt-6 shadow-lg shadow-black/10 lg:w-[250px] w-[100px]">
      <div className="flex flex-col justify-center space-y-12 items-center">
        <div className={`${"flex flex-col space-y-2 mb-10"}`}>
          {!isCoursesPage && (
            <p className="text-lg text-black/50">Overview</p>
          )}
          <div className="flex flex-col space-y-2">
            <Link href="/dashboard" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
              <GoHome className={getLinkClassName('/dashboard')} size={24} />
              {!isCoursesPage && (
                <p className={getLinkClassName('/dashboard')}>Home</p>
              )}
            </Link>
            <Link
              href="/dashboard/courses"
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
            >
              <GraduationCap className={getLinkClassName('/dashboard/courses')} size={24} />
              {!isCoursesPage && (
                <p className={getLinkClassName('/dashboard/courses')}>Courses</p>
              )}
            </Link>
            <Link
              href="/dashboard/community"
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
              onClick={(e) => handleLinkClick(e, "Community")}
            >
              <IoIosPeople className={getLinkClassName('/dashboard/community')} size={24} />
              {!isCoursesPage && (
                <p className={getLinkClassName('/dashboard/community')}>Community</p>
              )}
            </Link>
            <button onClick={openModal} className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] p-0 bg-transparent">
            <CirclePlus className={getLinkClassName('/posts')} size={24} />
              {!isCoursesPage && (
                <p className="text-lg">Post</p>
              )}
            </button>
            <Link
              href="/dashboard/jobs"
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
              onClick={(e) => handleLinkClick(e, "Job")}
            >
              <BriefcaseBusiness className={getLinkClassName('/dashboard/jobs')} size={24} />
              {!isCoursesPage && <p className={getLinkClassName('/dashboard/jobs')}>Job</p>}
            </Link>
            <Link
              href="/dashboard/scholarships"
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
              onClick={(e) => handleLinkClick(e, "Scholarship")}
            >
              <School className={getLinkClassName('/dashboard/scholarships')} size={24} />
              {!isCoursesPage && (
                <p className={getLinkClassName('/dashboard/scholarships')}>Scholarship</p>
              )}
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          {!isCoursesPage && <p className="text-lg text-black/50">Account</p>}
          <Link href="/profile" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
            <IoPersonOutline className={getLinkClassName('/profile')} size={24} />
            {!isCoursesPage && (
              <p className={getLinkClassName('/profile')}>Profile & settings</p>
            )}
          </Link>
          <Link
            href="/notifications"
            className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
          >
            <Bell className={getLinkClassName('/notifications')} size={24} />
            {!isCoursesPage && (
              <p className={getLinkClassName('/notifications')}>Notifications</p>
            )}
          </Link>
        </div>

      </div>
        <div className="flex flex-col space-y-2">
          {!isCoursesPage && (
            <p className="text-lg py-2 font-semibolg">
              Other features
            </p>
          )}
          <Link href="/help" className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]">
            <IoMdHelpCircleOutline className={getLinkClassName('/help')} size={24} />
            {!isCoursesPage && (
              <p className={getLinkClassName('/help')}>Help & support</p>
            )}
          </Link>
          <div
            className="flex flex-row gap-3 items-center text-[#F26900] hover:text-green-600 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={24} />
            {!isCoursesPage && (
              <p className="text-lg">Logout</p>
            )}
          </div>
        </div>
      </div>
      {/* Conditionally render the modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded-lg w-1/2 shadow-lg">
            <CreatePost
              userId={user?.user_id || ""}
              onPostCreated={addNewPost}
            />
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
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
