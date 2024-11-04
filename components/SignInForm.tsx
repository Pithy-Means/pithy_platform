"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import InputContact from "@/components/InputContact";
import { LoginInfo } from "@/types/schema";
import { login } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";


const SignInForm = () => {
  const [formdata, setFormdata] = useState<Partial<LoginInfo>>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

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
    setErrorMessage(null);

    // Ensure no undefined values in formdata
    if (!formdata.email || !formdata.password) {
      setErrorMessage("Email or Password is missing.");
      setLoading(false);
      return;
    }
    try {
      const userdata = await login(formdata as LoginInfo);
      if (userdata) {
        router.push("/dashboard");
      } else {
        setErrorMessage("Invalid email or password.");
        setAttempts((prev) => prev + 1);
        // setLoading
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setAttempts((prev) => prev + 1);
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      {/* Sign-in form */}
      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 size={64} color="#3b82f6" />
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#ffffff] via-green-300 to-green-100 p-8 rounded-lg shadow-lg w-full max-w-m h-screen">
          <div className="flex justify-center space-x-4 items-center w-full">
            <div className="flex flex-col w-2/4 px-10">
              <h2 className="text-3xl font-bold text-[#111111] mb-6 text-center capitalize">
                Welcome back
              </h2>
              <form className="space-y-6 flex flex-col " onSubmit={handleSignIn}>
                {/* Email Input */}
                <InputContact
                  label="Email"
                  type="email"
                  name="email"
                  className="w-3/4"
                  value={formdata.email as string}
                  onChange={handleChange}
                />
                {/* Password Input */}
                <div className="relative">
                  <InputContact
                    label="Password"
                    type={showPassword ? "text" : "password"} // Dynamically change type
                    className="w-3/4"
                    name="password"
                    value={formdata.password as string}
                    onChange={handleChange}
                  />
                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {/* Error Message */}
                {errorMessage && (
                  <p className="text-red-500 text-center">{errorMessage}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-3/4 py-2 px-4 bg-[#3b82f6] text-white font-semibold rounded-md hover:bg-[#2563eb] transition duration-200"
                >
                  Sign In
                </button>
              </form>
              {/* Forgot password and sign up link */}
              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-sm text-gray-800 hover:text-green-600 transition duration-200"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="text-sm text-gray-800 hover:text-black hover:font-semibold transition duration-200"
                >
                  Don`&apos;`t have an account? Sign up
                </a>
              </div>
              {/* Password Reset Option after 3 failed attempts */}
              {attempts >= 3 && (
                <div className="mt-4 text-center">
                  <Link href="/reset-password"
                    className="text-sm text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    Too many attempts? Reset your password
                  </Link>
                </div>
              )}

            </div>
            {/* Image Section */}
            <div className="w-2/4 py-10 px-10 mt-6 md:mt-0 flex justify-center glass-effect">
              <Image
                src="/assets/sign.png"
                alt="Sign In"
                width={400}
                height={500}

                className="max-w-full h-auto object-fill md:max-h-[500px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInForm;
