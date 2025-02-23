"use client";

import { recovery } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";
import { useState, FormEvent } from "react";

const ForgotPasswordForm: React.FC = () => {
  const [form, setForm] = useState<Partial<UserInfo>>({ email: "" });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.email) {
      await recovery(form as UserInfo);
    } else {
      setMessage("Email is required.");
      setLoading(false);
    }

    // Simulate an API call
    setTimeout(() => {
      setLoading(false);
      setMessage("If this email is registered, a reset link has been sent.");
      setForm({ email: "" });
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          Forgot Password
        </h2>
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={form.email || ""}
              onChange={(e) => setForm({ email: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 text-white font-bold py-2 rounded-md transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
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
                    d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4a4 4 0 00-4-4H4z"
                  ></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
