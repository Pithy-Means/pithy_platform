/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InputContact from "@/components/InputContact";
import { AuthState, LoginInfo } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/lib/hooks/useAuth";
import { Button } from "./ui/button";
import { Eye, EyeOff, MoveLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import toast, { Toaster } from "react-hot-toast";

const MAX_ATTEMPTS = 5;

const SignInForm = () => {
  const [formdata, setFormdata] = useState<Partial<LoginInfo>>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const setUser = useAuth((state) => state.setUser);
  const { signin } = useAuthStore((state) => state as AuthState);
  const router = useRouter();

  // Load saved attempts on component mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem("loginAttempts");
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }
  }, []);

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

    if (!formdata.email || !formdata.password) {
      toast.error("Email or Password is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await signin(formdata as LoginInfo);

      if (response.success) {
        // Reset attempts on successful login
        setAttempts(0);
        localStorage.removeItem("loginAttempts");

        setUser(response.data?.user);
        toast.success("Login successful! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        // Calculate next attempts count
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        localStorage.setItem("loginAttempts", nextAttempts.toString());

        // Check if attempts have reached the limit
        if (nextAttempts >= MAX_ATTEMPTS) {
          toast.promise(
            new Promise<void>((resolve) => {
              setTimeout(() => {
                router.push("/forgot-password");
                resolve();
              }, 3000);
            }),
            {
              loading:
                "Maximum login attempts reached. Redirecting to password reset...",
              success: "Redirecting...",
              error: "An error occurred",
            },
          );
        } else {
          const remainingAttempts = MAX_ATTEMPTS - nextAttempts;
          toast.error(
            `${response.message ?? "Invalid credentials"}. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`,
          );
        }
      }
    } catch (error) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem("loginAttempts", nextAttempts.toString());

      if (nextAttempts >= MAX_ATTEMPTS) {
        toast.promise(
          new Promise<void>((resolve) => {
            setTimeout(() => {
              router.push("/forgot-password");
              resolve();
            }, 3000);
          }),
          {
            loading:
              "Maximum login attempts reached. Redirecting to password reset...",
            success: "Redirecting...",
            error: "An error occurred",
          },
        );
      } else {
        const remainingAttempts = MAX_ATTEMPTS - nextAttempts;
        toast.error(
          `An error occurred. Please try again. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Toaster />
      <div className="bg-gradient-to-r from-[#ffffff] via-green-300 to-green-100 p-8 rounded-lg shadow-lg w-full h-screen relative">
        <Button
          onClick={() => router.push("/")}
          className="fixed md:top-8 left-8 bottom-4 bg-transparent text-black hover:text-green-500 hover:bg-white"
        >
          <MoveLeft size={24} className="mx-3" />
          Go Back
        </Button>
        <div className="flex justify-center items-center my-auto space-x-4 w-full md:flex-row flex-col">
          <div className="flex flex-col w-full lg:w-2/4 px-0 mx-0 lg:px-10 lg:mx-auto">
            <h2 className="text-xl lg:text-xl 2xl:text-2xl font-bold text-[#111111] mb-6 capitalize">
              Welcome back
            </h2>
            <form className="space-y-6 flex flex-col" onSubmit={handleSignIn}>
              <InputContact
                label="Email"
                type="email"
                name="email"
                className="w-full lg:w-3/4 2xl:py-6 text-xl"
                value={formdata.email as string}
                onChange={handleChange}
              />
              <div className="relative">
                <InputContact
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full lg:w-3/4 2xl:py-6 text-xl"
                  name="password"
                  value={formdata.password as string}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 lg:right-[150px] xl:right-[220px] 5xl:right-[310px] flex items-center px-2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full lg:w-3/4 2xl:py-4 text-xl py-2 px-4 bg-[#529c50] text-white font-semibold rounded-md hover:bg-[#67d476] transition duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <span>Signing in...</span>
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
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="text-xl text-gray-800 hover:text-green-600 transition duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="">
              <li className="text-xl text-gray-800 list-none">
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
                  className="text-sm text-green-500 hover:text-green-700 transition duration-200"
                >
                  Too many attempts? Reset your password
                </Link>
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/4 p-10 md:mt-0 hidden md:flex justify-center glass-effect h-[calc(100vh-64px)] 2xl:h-[calc(100vh-64px)] border-2 border-[#92d192]">
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
