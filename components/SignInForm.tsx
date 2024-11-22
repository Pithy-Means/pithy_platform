"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import InputContact from "@/components/InputContact";
import { LoginInfo } from "@/types/schema";
import { login } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

const MAX_ATTEMPTS = 5;

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
    >,
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
      const response = await login(formdata as LoginInfo);

      if (response.success) {
        // Only navigate if login is successful
        router.push("/dashboard");
      } else {
        // Show error message and increment attempts on failure
        setErrorMessage(response.message ?? "An unknown error occurred.");
        setAttempts((prev) => prev + 1);

        // Redirect to forgot-password after 5 attempts
        if (attempts >= 4) {
          router.push("/forgot-password");
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
      setAttempts((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-gradient-to-r from-[#ffffff] via-green-300 to-green-100 p-8 rounded-lg shadow-lg w-full h-screen">
        <div className="flex justify-center items-center my-auto space-x-4 w-full md:flex-row flex-col">
          <div className="flex flex-col w-full lg:w-2/4 px-0 mx-0 lg:px-10 lg:mx-auto">
            <h2 className="text-xl lg:text-3xl 2xl:text-6xl font-bold text-[#111111] mb-6 capitalize">
              Welcome back
            </h2>
            <form className="space-y-6 flex flex-col" onSubmit={handleSignIn}>
              <InputContact
                label="Email"
                type="email"
                name="email"
                className="w-full lg:w-3/4 2xl:py-6 2xl:text-3xl"
                value={formdata.email as string}
                onChange={handleChange}
              />
              <div className="relative">
                <InputContact
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full lg:w-3/4 2xl:py-6 2xl:text-3xl"
                  name="password"
                  value={formdata.password as string}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 lg:right-[150px] 2xl:right-[300px] flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}

              {attempts > 0 && attempts < 5 && (
                <p className="text-red-500 text-center">
                  You have {5 - attempts} attempt{5 - attempts === 1 ? "" : "s"}{" "}
                  remaining.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-3/4 2xl:py-4 2xl:text-3xl py-2 px-4 bg-[#3b82f6] text-white font-semibold rounded-md hover:bg-[#2563eb] transition duration-200"
              >
                {loading ? "Signing In ...." : "Sign In"}
              </button>
            </form>

            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="text-sm 2xl:text-3xl text-gray-800 hover:text-green-600 transition duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="">
              <li className="text-sm 2xl:text-3xl text-gray-800 list-none">
                Don&apos;t have an account?
                <Link
                  href="/signUp"
                  className="mx-1 hover:font-semibold transition duration-400"
                >
                  <span className="text-blue-800">Sign up</span>
                </Link>
              </li>
            </div>

            {attempts >= 3 && attempts < MAX_ATTEMPTS && (
              <div className="mt-4 text-center">
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-500 hover:text-blue-700 transition duration-200"
                >
                  Too many attempts? Reset your password
                </Link>
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/4 p-10 md:mt-0 hidden md:flex justify-center glass-effect h-[calc(100vh-64px)] 2xl:h-[calc(100vh-64px)]">
            <div className="relative w-full h-full">
              <Image
                src="/assets/sign.png"
                alt="Sign In"
                layout="fill"
                objectFit="contain"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;