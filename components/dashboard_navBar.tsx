"use client";

import React, { useState } from "react";
import Logo from "./Logo";
import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { IoMdNotificationsOutline } from "react-icons/io";
import useModal from "@/lib/hooks/useModal";
import Modal from "./Modal";
import QuestionSlider from "./QuestionSlider"; // Import your QuestionSlider component

interface DashboardNavBarProps {
  user: string | undefined;
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({ user, children }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [isTestStarted, setIsTestStarted] = useState(false); // State to track if test has started

  const handleStartTest = () => {
    setIsTestStarted(true);  // Start the test (i.e., show the question slider)
  };

  const handleCancelTest = () => {
    setIsTestStarted(false); // Cancel the test (i.e., close the modal)
    closeModal(); // Close the modal
  };

  return (
    <div className="bg-white/90 min-h-screen">
      <nav className="flex h-20 sm:h-24 lg:h-28 bg-white justify-between items-center px-4">
        <div className="text-2xl font-bold text-black">
          <Logo />
        </div>
        <div className="sm:hidden block">
          <div className="hidden relative lg:flex items-center">
            <FaSearch className="absolute left-3 text-black/35" size={20} />
            <input
              className="bg-gray-300 border outline-none w-full p-2 pl-10 rounded-lg text-black/65"
              placeholder="search Course"
              id="searchHere"
            />
          </div>
          <div className="flex  items-center justify-center">
            <FaSearch className="absolute left-3 text-black/55" size={20} />
          </div>
        </div>
        <div>
          <Button onClick={openModal} className="bg-[#5AC35A] w-full">
            Take Test
          </Button>
        </div>
        <div>
          <IoMdNotificationsOutline className="text-black h-8 w-8" />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="bg-gray-600 py-1 px-2 rounded-full border border-black hidden md:block">
            {user}
          </div>
        </div>
      </nav>
      {children}

      {/* Modal Logic */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col items-center space-y-4 ">
          {!isTestStarted ? (
            <>
              <h1 className="text-2xl text-black font-bold">Take Test</h1>
              <p className="text-black text-center">
                Are you ready to take the test? You will be redirected to the
                test page.
              </p>
              <div className="flex justify-center items-center space-x-4">
                <Button onClick={handleStartTest} className="bg-[#5AC35A]">
                  Yes
                </Button>
                <Button onClick={handleCancelTest} className="bg-[#FF5C5C]">
                  No
                </Button>
              </div>
            </>
          ) : (
            <QuestionSlider /> // Display the QuestionSlider when the test starts
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DashboardNavBar;
