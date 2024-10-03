import React from 'react';

const SignIn = () => {
  return (
    <div className="absolute top-[-10px] left-0 right-0 flex items-center justify-center">

      {/* Sign-in form */}
      <div className="bg-gradient-to-r from-[#ffffff] via-green-300 to-green-100 p-8 rounded-lg shadow-lg w-full max-w-m h-screen">
      <div className="flex justify-center space-x-4 items-center w-full">
        <div className="flex flex-col w-2/4 px-10">
          <h2 className="text-3xl font-bold text-[#111111] mb-6 text-center capitalize">Welcome back</h2>

          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 bg-[#1f1f1f] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 bg-[#1f1f1f] text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#3b82f6] text-white font-semibold rounded-md hover:bg-[#2563eb] transition duration-200"
              >
                Sign In
              </button>
            </div>
          </form>

            {/* Forgot password and sign up link */}
            <div className="mt-6 text-center">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-200">Forgot your password?</a>
            </div>
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition duration-200">Don't have an account? Sign up</a>
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
