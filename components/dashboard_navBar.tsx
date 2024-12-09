import React from "react";
import Logo from "./Logo";
import { FaSearch } from "react-icons/fa";
import { Button } from "./ui/button";
import { IoMdNotificationsOutline } from "react-icons/io";
// import Image from "next/image";

interface DashboardNavBarProps {
  user: string;
  children: React.ReactNode;
}

const DashboardNavBar: React.FC<DashboardNavBarProps> = ({
  user,
  children,
}) => {
  return (
    <div className="bg-white/90">
      <nav className="flex h-20 w-full bg-white justify-evenly items-center px-6">
        <div className="text-2xl font-bold  text-black">
          <Logo />
        </div>
        <div className="relative w-1/2 ">
          <div className="hidden relative lg:flex items-center">
            <FaSearch className="absolute left-3 text-black/35 " size={20} />
            <input
              className="bg-gray-300 border outline-none w-full p-2 pl-10 rounded-lg text-black/65"
              placeholder="search Course"
              id="searchHere"
            />
          </div>
          <div className="flex lg:hidden items-center justify-center">
            <FaSearch className="absolute left-3 text-black/55 " size={20} />
          </div>
        </div>
        <div>
          <Button className="bg-[#5AC35A] w-full">Take Test</Button>
        </div>
        <div>
          <IoMdNotificationsOutline className="text-black h-8 w-8" />
        </div>
        <div className="flex items-center gap-x-2">
          <div className="bg-gray-600 py-1 px-2 rounded-full border border-black">
            {user}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default DashboardNavBar;
