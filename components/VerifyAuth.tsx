/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { updateVerify } from "@/lib/actions/user.actions";
import { VerifyUser } from "@/types/schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyAuth = () => {
  const searchParms = useSearchParams();
  const [formData, setFormData] = useState<VerifyUser>({
    user_id: "",
    secret: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const secret = searchParms.get("secret");
  const userId = searchParms.get("userId");

  useEffect(() => {
    const verifyUser = async () => {
      if (!userId || !secret || userId === "" || secret === "") {
        setMessage("Invalid verification link");
        return;
      }

      // Set user_id and secret if available
      setFormData({
        user_id: userId,
        secret: decodeURIComponent(secret), // Ensure proper decoding of secret
      });

      // Call API to verify user
      try {
        const updated = await updateVerify({
          user_id: userId,
          secret: decodeURIComponent(secret), // Pass the current parameters directly
        });

        console.log("Updated", updated);
        if (updated) {
          setMessage("User verified successfully");
          router.push("/signIn");
        }
      } catch (error) {
        setMessage("Error verifying user");
      }
    };

    verifyUser();
  }, [userId, secret, router]); // Removed formData from dependencies

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6 w-full">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">
          Verify Your Email
        </h1>
        <p className="text-center text-lg text-gray-700 mb-4">{message}</p>
        <div className="flex justify-center items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex justify-center items-center mb-4">
            <svg
              className="w-12 h-12 text-green-600 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M4 12a8 8 0 0116 0"
                className="opacity-75"
              />
            </svg>
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/signIn")}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAuth;
