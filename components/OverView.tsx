"use client";

import React, { useState, useEffect } from "react";
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
import { getLoggedInUser, logoutUser } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import ModalComp from "./ModalComp";
import { PostWithUser } from "@/types/schema";
import CreatePost from "./createPosts";

interface OverViewProps {
  children?: React.ReactNode;
  className?: string;
}

const OverView: React.FC<OverViewProps> = ({ children }) => {
  const [isCoursesModalOpen, setCoursesModalOpen] = useState(false); // State for Courses modal
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [user, setUser] = useState<{ user_id: string } | null>(null); // State to store logged in user
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = useState<PostWithUser[]>([]); // State to store posts

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await getLoggedInUser(); // Fetch logged in user
      setUser(loggedInUser);
    };
    fetchUser();
  }, []);

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
    linkName: string,
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
    `flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65] ${
      pathname === href ? "text-green-500 font-bold" : ""
    }`;

  return (
    <div className="flex">
      <div className="flex flex-col space-y-4 bg-white text-black py-4 items-center rounded-tr-xl mt-6 shadow-lg shadow-black lg:w-[250px] w-[100px]">
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-4 font-semibold hidden lg:block">Overview</p>
          <div className="flex flex-col space-y-2">
            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
              <GoHome size={24} />
              <p className="text-base hidden lg:block">Home</p>
            </Link>
            <Link
              href="/courses"
              className="flex flex-row gap-3 items-center cursor-pointer hover:text-[#37BB65]"
            >
              <HiMiniClipboardDocumentList size={24} />
              <p className="text-base hidden lg:block">Courses</p>
            </Link>
            <Link
              href="/community"
              className={getLinkClassName("/community")}
              onClick={(e) => handleLinkClick(e, "Community")}
            >
              <IoIosPeople size={24} />
              <p className="text-base hidden lg:block">Community</p>
            </Link>
            <button onClick={openModal} className={getLinkClassName("/post")}>
              <MdOutlineAddCircle size={24} />
              <p className="text-base hidden lg:block">Post</p>
            </button>
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
          <Link
            href="/notifications"
            className={getLinkClassName("/notifications")}
          >
            <IoNotifications size={24} />
            <p className="text-base hidden lg:block">Notifications</p>
          </Link>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-lg py-2 font-semibold hidden lg:block">
            Other features
          </p>
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
      {/* Conditionally render the modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
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
