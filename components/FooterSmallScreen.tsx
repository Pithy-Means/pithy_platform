/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link, BriefcaseBusiness, HandCoins } from "lucide-react";
import React, { useState } from "react";
import { GoHome } from "react-icons/go";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import { MdOutlineAddCircle } from "react-icons/md";
import CreatePosts from "./createPosts";
import Modal from "./Modal";
import { AuthState, PostWithUser } from "@/types/schema";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function FooterSmallScreen() {
  const { user } = useAuthStore((state) => state as AuthState);
  const [model, setModel] = React.useState(false);
  const [posts, setPosts] = useState<PostWithUser[]>([]);

  const router = useRouter();

  const handleModel = () => {
    setModel(!model);
  };

  const addNewPost = (newPost: PostWithUser) => {
    setPosts((prevPosts: PostWithUser[]) => [newPost, ...prevPosts]);
    setModel(false);
  };

  return (
    <div>
      {/* Fixed bottom bar for smaller screens */}
      <div className="fixed bottom-0 h-20 w-full block md:hidden bg-[#5AC35A] py-4">
        <div className="flex justify-around items-center text-white">
          <Button onClick={() => router.push("/dashboard")} className="bg-transparent p-0" aria-label="Home">
            <div className="flex flex-col items-center">
              <GoHome size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Home</span>
            </div>
          </Button>
          <Button onClick={() => router.push("/dashboard/courses")} className="bg-transparent p-0" aria-label="Courses">
            <div className="flex flex-col items-center">
              <HiMiniClipboardDocumentList
                size={28}
                className="hover:text-gray-800"
              />
              <span className="text-xs text-black/70">Courses</span>
            </div>
          </Button>
          <button onClick={() => handleModel()} className="bg-transparent p-0" aria-label="Create Post">
            <div className="flex flex-col items-center">
              <MdOutlineAddCircle size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Post</span>
            </div>
          </button>
          <Button onClick={() => router.push("/dashboard/jobs")} className="bg-transparent p-0" aria-label="Jobs">
            <div className="flex flex-col items-center">
              <BriefcaseBusiness size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Jobs</span>
            </div>
          </Button>
          <Button onClick={() => router.push("/dashboard/fundings")} className="bg-transparent p-0" aria-label="Fundings">
            <div className="flex flex-col items-center">
              <HandCoins size={28} className="hover:text-gray-800" />
              <span className="text-xs text-black/70">Funding</span>
            </div>
          </Button>
        </div>
      </div>
      {model && (
        <Modal isOpen={model} onClose={handleModel}>
          <CreatePosts
            userId={user?.user_id || ""}
            onPostCreated={addNewPost}
          />
        </Modal>
      )}
    </div>
  );
}

export default FooterSmallScreen;
