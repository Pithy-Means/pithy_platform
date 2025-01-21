"use client";

import { updateVerify } from "@/lib/actions/user.actions";
import { VerifyUser } from "@/types/schema";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyAuth = () => {
  const searchParms = useSearchParams();
  const [formData, setFormData] = useState<VerifyUser>({
    user_id: "",
    secret: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const secret = searchParms.get("secret");
  const userId = searchParms.get("userId");

  useEffect(() => {
    const verifyUser = async () => {
      if (!userId || !secret || userId === "" || secret === "") {
        setMessage("Invalid verification link");
        return;
      }

      // Set user_id and secret if available
      if (userId && secret) {
        setFormData((prev) => ({
          ...prev,
          user_id: userId,
          secret: decodeURIComponent(secret), // Ensure proper decoding of secret
        }));
      }

      // Call API to verify user
      try {
        // Make API call to verify user
        await updateVerify(formData);
        setMessage("User verified successfully");
      } catch (error) {
        setMessage("Error verifying user");
      }
    };

    verifyUser();
  }, [searchParms, userId, secret, formData]);

  return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl mb-4">Verify Email</h1>
        <p>{message}</p>
      </div>
  );
};

export default VerifyAuth;
