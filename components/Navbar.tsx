"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { AuthState } from "@/types/schema";


const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, signout } = useAuthStore((state) => state as AuthState);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleCloseMenu = () => setIsOpen(false);

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
    try {
      await signout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

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
            aria-label="Toggle menu"
          >
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

        {/* Links for larger screens */}
        <div className={"hidden lg:flex items-center space-x-6"}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${
                pathname === link.href ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-[#5AC35A] transition duration-300"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  className="text-white hover:text-[#5AC35A] transition duration-300 bg-transparent border border-white"
                  aria-label="Logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/signIn"
                  className="text-[#5AC35A] hover:text-white transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signUp"
                  className="text-white hover:text-[#5AC35A] transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="lg:hidden flex flex-col space-y-4 mt-4 items-center text-center"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleCloseMenu}
              className={`text-white hover:text-[#5AC35A] transition duration-300 ${
                pathname === link.href ? "underline decoration-[#5AC35A] underline-offset-8 decoration-2" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={handleCloseMenu}
                className="text-white hover:text-[#5AC35A] transition duration-300"
              >
                Dashboard
              </Link>
              <Button
                onClick={() => {
                  handleLogout();
                  handleCloseMenu();
                }}
                className="text-white hover:text-[#5AC35A] transition duration-300 bg-transparent border border-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/signIn"
                onClick={handleCloseMenu}
                className="text-[#5AC35A] hover:text-white transition duration-300"
              >
                Login
              </Link>
              <Link
                href="/signUp"
                onClick={handleCloseMenu}
                className="text-white hover:text-[#5AC35A] transition duration-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

