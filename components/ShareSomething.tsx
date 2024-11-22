"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CreatePost from "@/components/createPosts"; // Import CreatePost component
import Posts from "./Posts";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { PostWithUser } from "@/types/schema";
import { CircleUserRound } from "lucide-react";
import InputContact from "./InputContact";

const ShareSomething = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [user, setUser] = useState<{ user_id: string } | null>(null); // State to store logged in user
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

  return (
    <div className="flex flex-col w-full no-scrollbar max-h-screen">
      {/* Header Section */}
      <div className="flex flex-col bg-white text-black px-6 justify-center rounded h-16 p-4 m-6">
        <div className="flex flex-row items-center gap-4">
          <CircleUserRound size={32} />
          <InputContact
            type="text"
            label="Share something"
            className="border-2 border-gray-300 rounded-lg w-full"
            value="" // Add the value property
            onChange={openModal} // Open modal when the input is clicked
          />
          <button
            onClick={openModal} // Open modal when button is clicked
            className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg p-2 w-20"
          >
            Post
          </button>
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

      {/* Scrollable Posts Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6">
        <Posts />
      </div>
    </div>
  );
};

export default ShareSomething;
