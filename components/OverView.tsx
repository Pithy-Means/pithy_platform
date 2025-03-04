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
  CircleX,
  GraduationCap,
  HandCoins,
  LogOut,
  School,
  ShieldAlert,
} from "lucide-react";
import ModalComp from "./ModalComp";
import { PostWithUser } from "@/types/schema";
import CreatePost from "./createPosts";
import ProfilePage from "./ProfilePage";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Modal from "./Modal";
import { useCourseStore } from "@/lib/store/courseStore";
import { useQuestionStore } from "@/lib/hooks/useQuestionStore";
import QuestionSlider from "./QuestionSlider";

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
  const { testStarted, testCompleted } = useQuestionStore();
  const [isRestrictedModalOpen, setIsRestrictedModalOpen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [restrictedLink, setRestrictedLink] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const { user, signout } = useAuthStore((state) => state);
  
  // Check if user has paid
  const isPaid = user?.paid || false;

  const router = useRouter();
  const pathname = usePathname();

  // Effect to check if we should redirect to courses after test completion
  useEffect(() => {
    if (testCompleted && isQuestionsModalOpen) {
      setRedirecting(true);
      setTimeout(() => {
        setIsQuestionsModalOpen(false);
        router.push("/dashboard/courses");
      }, 1500);
    }
  }, [testCompleted, isQuestionsModalOpen, router]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    linkName: string,
    isRestricted: boolean,
    isQuestionsRequired: boolean
  ) => {
    if (isRestricted) {
      e.preventDefault(); // Prevent navigation
      setRestrictedLink(linkName);
      setIsRestrictedModalOpen(true);
    } else if (isQuestionsRequired && !testCompleted) {
      e.preventDefault(); // Prevent navigation
      setIsQuestionsModalOpen(true);
    }
    // If questionsRequired but testCompleted, allow normal navigation
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const closeQuestionsModal = () => {
    if (testCompleted || redirecting) {
      setIsQuestionsModalOpen(false);
      router.push("/dashboard/courses");
    } else {
      setIsQuestionsModalOpen(false);
    }
  };

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
            {user?.role === "admin" && (
              <Link href="/admin" className="flex flex-row gap-3 items-center">
                <ShieldAlert className={getLinkClassName("/admin")} size={24} />
                <p className={`${getLinkClassName("/admin")} lg:block hidden`}>
                  Admin
                </p>
              </Link>
            )}
            <div className="flex flex-col space-y-2">
              {[
                { href: "/dashboard", icon: GoHome, label: "Home" },
                {
                  href: "/dashboard/courses",
                  icon: GraduationCap,
                  label: "Courses",
                  restricted: false,
                  questionsRequired: !testCompleted
                },
                {
                  href: "/dashboard/jobs",
                  icon: BriefcaseBusiness,
                  label: "Jobs",
                  restricted: !isPaid, // Only accessible if user has paid
                  questionsRequired: false
                },
                {
                  href: "/dashboard/scholarships",
                  icon: School,
                  label: "Scholarships",
                  restricted: !isPaid, // Only accessible if user has paid
                  questionsRequired: false
                },
                {
                  href: "/dashboard/fundings",
                  icon: HandCoins,
                  label: "Fundings",
                  restricted: !isPaid, // Only accessible if user has paid
                  questionsRequired: false
                },
              ].map(({ href, icon: Icon, label, restricted, questionsRequired }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={(e) =>
                    (restricted || (questionsRequired && !testCompleted)) && 
                    handleLinkClick(e, label, restricted, questionsRequired)
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
                <p className="text-lg lg:block hidden">Create A Post</p>
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
              href="/dashboard/notifications"
              className="flex flex-row gap-3 items-center"
            >
              <Bell className={getLinkClassName("/dashboard/notifications")} size={24} />
              <p
                className={`${getLinkClassName("/dashboard/notifications")} lg:block hidden`}
              >
                Notifications
              </p>
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Link href="/dashboard/help" className="flex flex-row gap-3 items-center">
            <IoMdHelpCircleOutline
              className={getLinkClassName("/dashboard/help")}
              size={24}
            />
            <p className={`${getLinkClassName("/dashboard/help")} lg:block hidden`}>
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

      {/* Questions Modal */}
      {isQuestionsModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-black/70">Complete these questions to access courses</h2>
            <QuestionSlider />
            <button
              onClick={closeQuestionsModal}
              className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-2 hover:bg-green-700"
            >
              <CircleX size={24} />
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
          <h2 className="text-lg font-bold">Only Accessible For Paid Members</h2>
          <p>
            This page is restricted. Please upgrade to a paid membership to access this
            feature.
          </p>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => {
                setIsRestrictedModalOpen(false);
                router.push("/dashboard/subscription"); // Assuming you have a subscription page
              }}
              className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
            >
              Upgrade Now
            </button>
          </div>
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