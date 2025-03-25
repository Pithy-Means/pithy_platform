/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { createVerify } from "@/lib/actions/user.actions";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const CheckEmailPage = () => {
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState(""); // Add email state to get the user's email

  // Function to handle resending the verification email
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await createVerify(); // Trigger the resend verification logic
      toast.success("Verification email sent successfully.");
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("An error occurred while resending the verification email.");
    } finally {
      setIsResending(false);
    }
  };

  // Function to determine which inbox to open based on the email domain
  const handleGoToInbox = () => {
    const domain = email.split("@")[1]?.toLowerCase(); // Get the domain part of the email address
    let inboxUrl = "";

    switch (domain) {
      case "gmail.com":
        inboxUrl = "https://mail.google.com/mail/u/0/#inbox";
        break;
      case "yahoo.com":
        inboxUrl = "https://mail.yahoo.com";
        break;
      case "outlook.com":
        inboxUrl = "https://outlook.live.com/mail/";
        break;
      default:
        inboxUrl = "https://mail.google.com/mail/u/0/#inbox"; // Redirect to a generic mail provider (or handle other cases as needed)
        break;
    }

    window.open(inboxUrl, "_blank"); // Open in a new tab
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col space-y-6 p-4 bg-white w-full">
      <Toaster />
      <h2 className="text-xl font-bold mb-4 text-black">Check Your Email</h2>
      <p className="text-black">
        We have sent a verification link to your email. Please check your inbox
        and click on the link to verify your account.
      </p>
      <p className="mt-4 text-black">
        If you haven&apos;t received the email, click the button below to resend
        the verification link.
      </p>
      <button
        onClick={handleResendVerification}
        disabled={isResending}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        {isResending ? "Resending..." : "Resend Verification Email"}
      </button>
      <button
        onClick={handleGoToInbox}
        className="mt-4 px-4 py-2 bg-green-800 text-white rounded-lg"
      >
        Go to Inbox
      </button>
    </div>
  );
};

export default CheckEmailPage;
