"use client";

import { useEffect, useState } from "react";
import { reset } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import InputContact from "./InputContact";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./ui/button";

type ResetFormData = {
  user_id: string;
  secret: string;
  password: string;
  passwordAgain: string;
};

const PasswordRecoveryForm: React.FC = () => {
  const [formData, setFormData] = useState<ResetFormData>({
    user_id: "",
    secret: "",
    password: "",
    passwordAgain: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Extract query parameters from URL using URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const secret = urlParams.get("secret");
    const userId = urlParams.get("userId");

    console.log("Extracted userId:", userId); // Log extracted userId
    console.log("Extracted secret:", secret); // Log extracted secret

    // Set user_id and secret if available
    if (userId && secret) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
        secret: decodeURIComponent(secret), // Ensure proper decoding of secret
      }));
    } else {
      console.error("Missing userId or secret in URL");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.passwordAgain) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check if user_id and secret are set
    if (!formData.user_id || !formData.secret) {
      toast.error("User ID or secret is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await reset(formData);
      toast.success("Password reset successfully.");
      console.log("Response:", response);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 max-w-xl mx-auto p-8 bg-white rounded-lg shadow-lg"
      >
        <Toaster />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back to Pithy Means. 🎉
        </h2>

        <p className="text-gray-600 text-center">
          Let’s get you back into your account. Enter a new password below.
        </p>

        <div className="flex flex-col space-y-8">
          <InputContact
            type="password"
            label="Password"
            name="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={formData.password}
            onChange={handleChange}
          />
          <InputContact
            type="password"
            label="Password Again"
            name="passwordAgain"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            value={formData.passwordAgain}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
        >
          {loading ? (
            <div className="flex items-center">
              <span>Resetting...</span>
              <svg
                className="animate-spin h-5 w-5 ml-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                ></path>
              </svg>
            </div>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default PasswordRecoveryForm;
