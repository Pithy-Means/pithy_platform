"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { logoutUser } from "@/lib/actions/user.actions";


const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  // Get logged-in user info
  const { user } = useContext(UserContext);

   // Handle outside clicks and Escape key to close the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

    const handleLogout = async () => {
      await logoutUser();
      router.push("/");
    };

  return (
    <div className="px-10 pt-6 bg-black">
      <div className="flex justify-between">
        <div className="text-2xl font-bold">
          <Logo />
        </div>

        {/* Hamburger Menu Icon for Small Screens */}
        <div className="lg:hidden">
          <Button
            onClick={handleToggle}
            className="text-white focus:outline-none"
          >
            {/* Hamburger Icon */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </Button>
        </div>

        {/* Links - Hidden on Small Screens, shown on larger */}
        <div className={"hidden lg:flex items-center space-x-6"}>
          <div className="flex space-x-4">
            <Link
              href="/"
              prefetch={true}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/" ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              prefetch={true}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/about" ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""}`}
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              prefetch={true}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/how-it-works" ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""}`}
            >
              How It Works
            </Link>
            <Link
              href="/contact"
              prefetch={true}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/contact" ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""}`}
            >
              Contact
            </Link>
          </div>
          <div className="flex space-x-12">
            { user ? (
              <div className="flex items-center gap-x-4">
                <Link
                  href="/dashboard"
                  className="text-white hover:text-[#5AC35A] transition duration-300"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  className="text-white hover:text-[#5AC35A] transition duration-300 bg-transparent border border-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <Link
                  href="/signIn"
                  className="text-[#5AC35A] hover:text-white transition duration-300"
                >
                  Login
                </Link>
                <div className="bg-white h-3 w-0.5"></div>
                <Link
                  href="/signUp"
                  className="text-white hover:text-[#5AC35A] transition duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div>
              <Button className="bg-[#5AC35A] px-8 py-0">Take Test</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Visible only when toggled open */}
      {isOpen && (
        <div
          ref={menuRef}
          className="lg:hidden flex flex-col space-y-4 mt-4 items-center text-center animate-slide-in"
        >
          <Link
            href="/"
            className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/" ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""}`}
            onClick={handleCloseMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/about" ? "underline decoration-[#5AC35A] underline-offset-4 decoration-2" : ""}`}
            onClick={handleCloseMenu}
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/how-it-works" ? "underline decoration-[#5AC35A] underline-offset-4 decoration-2" : ""}`}
            onClick={handleCloseMenu}
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === "/contact" ? "underline decoration-[#5AC35A] underline-offset-4 decoration-2" : ""}`}
            onClick={handleCloseMenu}
          >
            Contact
          </Link>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-x-2">
              <Link
                href="/signIn"
                className="text-[#5AC35A] hover:text-white transition duration-300"
              >
                Login
              </Link>
              <div className="bg-white h-1 w-1/2"></div>
              <Link
                href="/signUp"
                className="text-white hover:text-[#5AC35A] transition duration-300"
              >
                Sign Up
              </Link>
            </div>
            <div>
              <Button className="bg-[#5AC35A] w-full">Take Test</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
