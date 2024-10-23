"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import Post from './Post';
import { useRouter } from 'next/navigation';
import CreatePost from '@/components/createPost'; // Import CreatePost component

const ShareSomething = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-col bg-white text-black px-6 justify-center h-20 p-4 m-6'>
        <div className='flex flex-row gap-4'>
          <Image
            src='/assets/person_feedback.png'
            width={40}
            height={40}
            alt='person'
            className='rounded-lg'
          />
          <input
            type="text"
            placeholder='Share something'
            className='border-2 border-gray-300 rounded-lg w-full p-2'
            onClick={openModal} // Open modal when the input is clicked
          />
          <button
            onClick={openModal} // Open modal when button is clicked
            className='bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg p-2 w-20'
          >
            Post
          </button>
        </div>
      </div>
      
      {/* Conditionally render the modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <CreatePost userId="671890b20024c8ab999f" /> {/* Pass the userId as a prop */}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Post />
    </div>
  );
};

export default ShareSomething;
