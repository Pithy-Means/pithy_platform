// import { LinkPreview } from "./ui/link-preview";

import Link from "next/link";


const QuickLinks: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 md:w-1/5 text-center justify-center w-full ">
      <h3 className="text-lg font-bold text-white">Quick Links</h3>
      <nav className="flex flex-col space-y-2 ">
        <Link
          href="https://pithy-means.netlify.app/"
          className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600 transition duration-300 ease-in-out"
        >
          Home
        </Link>
        <Link
          href="https://pithy-means.netlify.app/about"
          className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600transition duration-300 ease-in-out"
        >
          About
        </Link>
        <Link
          href="https://pithy-means.netlify.app/how-it-works"
          className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600 transition duration-300 ease-in-out"
        >
          How It Works
        </Link>
        <Link
          href="https://pithy-means.netlify.app/contact"
          className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600 transition duration-300 ease-in-out"
        >
          Contact
        </Link>
        <div className="flex lg:space-x-2 text-center justify-center flex-wrap lg:flex-row flex-col">
          <Link
            href="https://pithy-means.netlify.app/signIn"
            className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600 transition duration-300 ease-in-out"
          >
            Login
          </Link>
          <span className="text-gray-600 hidden lg:block">|</span>
          <Link
            href="https://pithy-means.netlify.app/signUp"
            className="text-[12px] md:text-sm lg:text-base text-white hover:text-green-600transition duration-300 ease-in-out"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default QuickLinks;
