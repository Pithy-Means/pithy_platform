"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Toaster } from "react-hot-toast";
import ContactForm from "@/components/ContactForm";

const Help = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset response message when closing modal
    if (responseMessage) {
      setResponseMessage("");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="p-8 w-full flex justify-center items-center flex-col m-8 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl hover:shadow-2xl">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-green-500 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-6 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
            Need Help?
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            We&apos;re here to assist you! Whether you have a question or need
            support, our team is ready to help.
          </p>
          <div className="mt-8">
            <button
              onClick={openModal}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 transition-all transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-green-600">
              Contact Support
            </DialogTitle>
          </DialogHeader>

          {!responseMessage ? (
            <ContactForm setResponseMessage={setResponseMessage} />
          ) : (
            <ThankYouMessage closeModal={closeModal} />
          )}

          <DialogFooter className="sm:justify-center">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Help;

// ThankYou component for successful form submission
interface ThankYouMessageProps {
  closeModal: () => void;
}

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ closeModal }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
        Thank You!
      </h3>
      <p className="text-center text-gray-600 mb-6">
        We&apos;ve received your message and will get back to you soon.
      </p>
      <button
        onClick={closeModal}
        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-md hover:from-green-700 hover:to-emerald-600"
      >
        Close
      </button>
    </div>
  );
};
