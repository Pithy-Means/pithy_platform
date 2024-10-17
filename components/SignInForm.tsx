"use client";

import React, { useState, useEffect } from "react";
import InputContact from "@/components/InputContact";
import { LoginInfo } from "@/types/schema";
import { login } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

const SignInForm = () => {
  const [formdata, setFormdata] = useState<Partial<LoginInfo>>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Ensure no undefined values in formdata
    if (!formdata.email || !formdata.password) {
      console.error("Email or Password is missing.");
      setLoading(false);
      return;
    }

    console.log("Form Data: ", formdata); // Add this line
    try {
      const userdata = await login(formdata as LoginInfo);
      if (userdata) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {/* Sign-in form */}
      <div className="bg-gradient-to-r from-[#ffffff] via-green-300 to-green-100 p-8 rounded-lg shadow-lg w-full max-w-m h-screen">
        <div className="flex justify-center space-x-4 items-center w-full">
          <div className="flex flex-col w-2/4 px-10">
            <h2 className="text-3xl font-bold text-[#111111] mb-6 text-center capitalize">
              Welcome back
            </h2>

            <form className="space-y-6" onSubmit={handleSignIn}>
              {/* Email Input */}
              <InputContact
                label="Email"
                type="email"
                name="email"
                className="w-full"
                value={formdata.email as string}
                onChange={handleChange}
              />
              {/* Password Input */}
              <div className="relative">
                <InputContact
                  label="Password"
                  type={showPassword ? "text" : "password"} // Dynamically change type
                  className="w-full"
                  name="password"
                  value={formdata.password as string}
                  onChange={handleChange}
                />
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-4 flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#3b82f6] text-white font-semibold rounded-md hover:bg-[#2563eb] transition duration-200"
              >
                Sign In
              </button>
            </form>
            {/* Forgot password and sign up link */}
            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition duration-200"
              >
                Forgot your password?
              </a>
            </div>
            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition duration-200"
              >
                Don't have an account? Sign up
              </a>
            </div>
          </div>
          {/* Image Section */}
          <div className="w-2/4 py-10 px-10 mt-6 md:mt-0 flex justify-center glass-effect">
            <img
              src="/assets/sign.png"
              alt="Sign In"
              className="max-w-full h-auto object-fill md:max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
