import Link from "next/link";

const QuickLinks: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 md:w-1/5 text-center justify-center w-full">
      <h3 className="text-2xl font-extrabold text-white">Quick Links</h3>
      <nav className="flex flex-col space-y-2 ">
        <Link
          href="/"
          className="text-[12px] md:text-base text-white hover:text-white transition duration-300 ease-in-out"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-[12px] md:text-base text-white hover:text-white transition duration-300 ease-in-out"
        >
          About
        </Link>
        <Link
          href="/how-it-works"
          className="text-[12px] md:text-base text-white hover:text-white transition duration-300 ease-in-out"
        >
          How It Works
        </Link>
        <Link
          href="/contact"
          className="text-[12px] md:text-base text-white hover:text-white transition duration-300 ease-in-out"
        >
          Contact
        </Link>
        <div className="flex lg:space-x-2 text-center justify-center flex-wrap lg:flex-row flex-col">
          <Link
            href="/signIn"
            className="text-[12px] md:text-base  text-white hover:text-white transition duration-300 ease-in-out"
          >
            Login
          </Link>
          <span className="text-white hidden lg:block">|</span>
          <Link
            href="/signUp"
            className="text-[12px] md:text-base text-white hover:text-white transition duration-300 ease-in-out"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default QuickLinks;
