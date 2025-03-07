/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Link, BriefcaseBusiness, HandCoins } from 'lucide-react'
import React, { useState } from 'react'
import { GoHome } from 'react-icons/go'
import { HiMiniClipboardDocumentList } from 'react-icons/hi2'
import { MdOutlineAddCircle } from 'react-icons/md'
import CreatePosts from './createPosts'
import Modal from './Modal'
import { AuthState, PostWithUser } from '@/types/schema'
import { useAuthStore } from '@/lib/store/useAuthStore';

function FooterSmallScreen() {

  const { user } = useAuthStore((state) => state as AuthState);
  const [model, setModel] = React.useState(false);
    const [posts, setPosts] = useState<PostWithUser[]>([]);
  

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
      <div className="fixed bottom-0 h-20 w-full block md:hidden bg-[#5AC35A] py-4 z-50">
      <div className="flex justify-around items-center text-white">
        <Link href='/dashboard' >
          <GoHome size={28} className="hover:text-gray-800" />
        </Link>
        <Link href='/dashboard/courses' aria-label="Courses">
          <HiMiniClipboardDocumentList size={28} className="hover:text-gray-800" />
        </Link>
        <button onClick={() => handleModel()} aria-label="Create Post">
          <MdOutlineAddCircle size={28} className="hover:text-gray-800" />
        </button>
        <Link href='/dashboard/jobs' aria-label="Jobs">
          <BriefcaseBusiness size={28} className="hover:text-gray-800" />
        </Link>
        <Link href='/dashboard/funding' aria-label="Fundings">
          <HandCoins size={28} className="hover:text-gray-800" />
        </Link>
      </div>
    </div>
    {model && (
      <Modal
        isOpen={model}
        onClose={handleModel}
      >
        <CreatePosts userId={user?.user_id || ""} onPostCreated={addNewPost} />
      </Modal>
    )}

    </div>
  )
}

export default FooterSmallScreen