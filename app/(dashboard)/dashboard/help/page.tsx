"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import toast, { Toaster } from "react-hot-toast";
import InputContact from '@/components/InputContact';
import { sendContactEmail } from '@/lib/store/emailService';

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
      <div className="p-8 w-full flex justify-center items-center flex-col m-8 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl transform transition-all hover:scale-75 hover:shadow-2xl">
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
            We&apos;re here to assist you! Whether you have a question or need support, our team is ready to help.
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
            <ContactFormWithToast setResponseMessage={setResponseMessage} closeModal={closeModal} />
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

// Enhanced ContactForm with toast notifications
interface ContactFormWithToastProps {
  setResponseMessage: (message: string) => void;
  closeModal: () => void;
}

const ContactFormWithToast: React.FC<ContactFormWithToastProps> = ({ setResponseMessage, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading("Sending your message...");

    try {
      // Simulate API call
      const success = await sendContactEmail(formData);
      
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success("Message sent successfully!", {
          duration: 3000
        });
        setResponseMessage("Email sent successfully!");
        // Don't close modal here, as we'll show the thank you message
      } else {
        toast.error("Failed to send message. Please try again.", {
          duration: 5000
        });
      }
    } catch (error) {
      console.error("Error sending form:", error);
      toast.dismiss(loadingToast);
      toast.error("An error occurred. Please try again later.", {
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-6 px-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
        <InputContact 
          label="Name"
          type="text"
          name="name"
          className="w-full"
          value={formData.name}
          onChange={handleChange}
        />
        <InputContact
          label="Email"
          type="email"
          name="email"
          className="w-full"
          value={formData.email}
          onChange={handleChange}
        />
        <InputContact
          label="Phone Number"
          type="tel"
          name="phone"
          className="w-full"
          value={formData.phone}
          onChange={handleChange}
        />
        <InputContact
          label="Message"
          isTextarea={true}
          name="message"
          className="w-full"
          value={formData.message}
          onChange={handleChange}
        />
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-md hover:from-green-700 hover:to-emerald-600 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

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