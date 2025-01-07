"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      // setLoading(true);
      try {
        const user = await getLoggedInUser();
        setLoggedUser(user);
      } catch (error) {
        console.error("Error fetching user session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  const navigationLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/contact", label: "Contact" },
  ];

  const renderLinks = (isMobile: boolean) =>
    navigationLinks.map((link) => (
      <Link
        key={link.path}
        href={link.path}
        onClick={() => isMobile && setIsOpen(false)}
        className={`text-white hover:text-[#5AC35A] transition ${
          pathname === link.path ? "underline decoration-[#5AC35A] underline-offset-4 decoration-2" : ""
        }`}
      >
        {link.label}
      </Link>
    ));

     // Wait for client-side to mount before rendering user info
  if (loading) {
    return (
      <nav className="px-10 py-6 bg-black">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Logo />
          </div>
          {/* Loading state */}
          <div className="text-white">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="px-10 py-6 bg-black">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Logo />
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          className="text-white lg:hidden"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex space-x-4">{renderLinks(false)}</div>
          <div className="flex items-center space-x-6">
            {loading ? (
              <div className="text-white">Loading...</div>
            ) : loggedUser ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-white hover:text-[#5AC35A] transition">
                  Dashboard
                </Link>
                <Link href="/logout" className="text-white hover:text-[#5AC35A] transition">
                  Logout
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/signIn" className="text-[#5AC35A] hover:text-white transition">
                  Login
                </Link>
                <div className="bg-white h-3 w-0.5" />
                <Link href="/signUp" className="text-white hover:text-[#5AC35A] transition">
                  Sign Up
                </Link>
              </div>
            )}
            <Button className="bg-[#5AC35A] px-8 py-1">Take Test</Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          ref={menuRef}
          className="lg:hidden flex flex-col items-center space-y-4 mt-4 text-center animate-slide-in"
        >
          {renderLinks(true)}
          {loggedUser ? (
            <>
              <Link href="/dashboard" className="text-white hover:text-[#5AC35A] transition">
                Dashboard
              </Link>
              <Link href="/logout" className="text-white hover:text-[#5AC35A] transition">
                Logout
              </Link>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link href="/signIn" className="text-[#5AC35A] hover:text-white transition">
                Login
              </Link>
              <Link href="/signUp" className="text-white hover:text-[#5AC35A] transition">
                Sign Up
              </Link>
            </div>
          )}
          <Button className="bg-[#5AC35A] w-full">Take Test</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
