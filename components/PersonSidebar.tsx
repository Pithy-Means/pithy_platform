"use client";

import { useState } from "react";
import {
  Clipboard,
  Twitter,
  Facebook,
  CheckCircle,
  Sparkles,
  Send,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";
import { motion } from "framer-motion";

const PersonSidebar = () => {
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore((state) => state as { user: UserInfo });
  const referralLink = `http://localhost:3000/signUp?referral=${user?.referral_code || ""}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-opacity-20 backdrop-blur-lg bg-white w-full text-black justify-start overflow-y-auto rounded-2xl overflow-hidden border border-gray-700 pb-4 shadow-2xl shadow-purple-500/20">
      {/* Gradient Header */}
      <div className="h-20 rounded-t-2xl w-full bg-gradient-to-r from-green-600 via-green-300 to-green-500"></div>

      {/* User Profile Section */}
      <div className="flex flex-col px-6 space-y-4 bg-transparent">
        {user && (
          <div className="flex flex-col justify-center items-center -mt-10">
            {/* Holographic Avatar */}
            <div className="bg-gradient-to-r from-white/50 to-green-500 rounded-full p-1.5 shadow-lg">
              <div className="bg-gray-900 rounded-full py-2 px-4">
                <p className="text-white text-2xl font-extrabold">
                  {user?.firstname?.charAt(0).toUpperCase() || ""}
                </p>
              </div>
            </div>

            {/* User Name and Category */}
            <div className="text-white items-center flex flex-col space-y-2 mt-3">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300">
                {user.firstname} {user.lastname}
              </span>
              <button className="text-sm bg-black cursor-text rounded shadow shadow-slate-400 px-4 py-1.5 border border-gray-700 hover:bg-gray-700 transition-all">
                {user?.categories?.charAt(0).toUpperCase()}
                {user?.categories?.slice(1)}
              </button>
            </div>
          </div>
        )}
        <div className="w-full p-4 bg-white border border-green-400 rounded-3xl shadow-xl relative overflow-hidden mb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[-10px] right-[-10px] text-green-600 animate-pulse"
          >
            <Sparkles size={40} />
          </motion.div>

          <h2 className="text-lg font-extrabold text-green-800 text-center mb-4">
            Exclusive Referral Program
          </h2>

          <div className="flex items-center justify-between bg-white p-1.5 rounded-full shadow-md border border-green-300">
            <p className="text-green-700 font-medium truncate">
              {user?.referral_code
                ? referralLink
                : "No referral code available"}
            </p>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-full transition-all shadow-lg"
            >
              {copied ? <CheckCircle size={15} /> : <Clipboard size={15} />}
              <span className="text-sm">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          <div className="mt-6 flex space-x-4 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=Join%20me%20using%20this%20exclusive%20referral:%20${referralLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-black hover:bg-black/50 text-white py-1.5 px-3 rounded-full transition-all shadow-lg"
            >
              <Twitter size={18} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white py-1.5 px-3 rounded-full transition-all shadow-lg"
            >
              <Facebook size={18} /> 
            </a>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-start font-semibold text-green-800 flex items-center space-x-2"
          >
            <Send size={18} />
            <span>{user?.referral_points || "0"} Referral Points</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PersonSidebar;
