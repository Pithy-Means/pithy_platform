"use client";

import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DashboardNavBarProps {
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({ children }) => {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, signout } = useAuthStore((state) => state as unknown as UserInfo);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signout();
      toast.success("Thank You For Visiting Pithy Means, See You Soon!");
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Something Went Wrong. Please Try Again Later!");
    }
  };

  return (
    <div className="bg-white/90 w-full">
      <nav
        className="flex flex-wrap items-center justify-between 
        bg-white border-b border-gray-200
        shadow-b-md
        h-auto min-h-[5rem] 
        px-4 md:px-6 lg:px-10 xl:px-20 2xl:px-40 
        py-2 
        w-full mx-auto" // Adds max-width and centers on very large screens
      >
        {/* Logo and Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="text-2xl font-bold text-black">
            <Logo />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-black focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Input Section - Responsive */}
        <div
          className={`
          w-full lg:w-1/2 xl:w-[45%] 2xl:w-[40%]
          mx-0 lg:mx-8 my-2 lg:my-0
          ${isMobileMenuOpen ? "block" : "hidden lg:block"}
        `}
        >
          <div className="relative flex items-center bg-gray-200 border rounded-lg p-2 max-w-[800px] mx-auto">
            <input
              className="bg-gray-200 outline-none w-full p-2 pl-10 text-black/65"
              placeholder="Search Course"
              id="searchHere"
            />
            <Search color="#7f7676" className="absolute right-3" />
          </div>
        </div>

        {/* Notification and User Section - Responsive */}
        <div
          className={`
          w-full lg:w-auto flex items-center justify-between lg:justify-end 
          gap-x-4 lg:gap-x-8
          ${isMobileMenuOpen ? "block" : "hidden lg:flex"}
        `}
        >
          <div className="flex items-center justify-center">
            <IoMdNotificationsOutline className="text-black h-8 w-8" />
          </div>
          <div className="flex items-center justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-black py-1.5 px-3 rounded-full border border-white shadow-md text-white">
                  {user?.firstname?.charAt(0)?.toUpperCase() ?? "Guest"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-2 bg-green-50">
                <Button
                  variant={"default"}
                  className="bg-white text-black border border-gray-300 hover:bg-gray-200 rounded-full shadow-md py-1.5 px-3"
                  onClick={() => handleLogout()}
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default DashboardNavBar;
