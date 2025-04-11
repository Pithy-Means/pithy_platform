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
import { MoveLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";

const MAX_ATTEMPTS = 5;

// Create a Zod schema for login validation
const loginSchema = z.object({
  email: z.string()
    .min(3, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(3, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const [formdata, setFormdata] = useState<Partial<LoginInfo>>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when the user types
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formdata);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

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
        <div className="flex justify-center items-center mx-0 xl:mx-30  space-x-4 w-full md:flex-row flex-col">
          <div className="flex flex-col w-full lg:w-2/4 px-0 mx-0 lg:px-10 lg:mx-auto">
            <h2 className="text-xl lg:text-xl 2xl:text-2xl font-bold text-[#111111] mb-6 capitalize">
              Welcome back
            </h2>
            <form className="space-y-6 flex flex-col" onSubmit={handleSignIn}>
              <div className="flex flex-col gap-1">
                <InputContact
                  label="Email"
                  type="email"
                  name="email"
                  className={`w-full text-xl ${errors.email ? 'border-red-500' : ''}`}
                  value={formdata.email as string}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <InputContact
                    label="Password"
                    type={"password"}
                    className={`w-full text-xl ${errors.password ? 'border-red-500' : ''}`}
                    name="password"
                    value={formdata.password as string}
                    onChange={handleChange}
                  />
                </div>  
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full text-xl py-2 px-4 bg-[#529c50] text-white font-semibold rounded-md hover:bg-[#67d476] transition duration-200"
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