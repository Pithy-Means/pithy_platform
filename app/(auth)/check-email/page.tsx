"use client";

import { createVerify } from "@/lib/actions/user.actions";
import { useState } from "react";

const CheckEmailPage = () => {
  const [isResending, setIsResending] = useState(false);

  // Function to handle resending the verification email
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await createVerify(); // Trigger the resend verification logic
      alert("Verification email resent! Please check your inbox.");
    } catch (error) {
      console.error("Error resending verification:", error);
      alert("There was an error resending the verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center flex-col p-4 bg-white/50  ">
      <h2 className="text-xl font-semibold mb-4">Check Your Email</h2>
      <p>
        We have sent a verification link to your email. Please check your inbox
        and click on the link to verify your account.
      </p>
      <p className="mt-4">
        If you haven&apos;t received the email, click the button below to resend the
        verification link.
      </p>
      <button
        onClick={handleResendVerification}
        disabled={isResending}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        {isResending ? "Resending..." : "Resend Verification Email"}
      </button>
    </div>
  );
};

export default CheckEmailPage;
