"use client";

import React, {useState, useEffect} from "react";
import InputContact from "@/components/InputContact";

const SignIn = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement;
    setEmail(emailInput.value);
    setPassword(passwordInput.value);
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
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password Input */}
              <div className="relative">
                <InputContact
                  label="Password"
                  type={showPassword ? "text" : "password"} // Dynamically change type
                  className="w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

export default SignIn;
