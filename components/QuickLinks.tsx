import Link from 'next/link';

const QuickLinks: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 w-1/5">
      <h3 className="text-lg font-bold text-white">Quick Links</h3>
      <nav className="flex flex-col space-y-2">
        <Link href="/" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
          Home
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
          About
        </Link>
        <Link href="/how-it-works" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
          How It Works
        </Link>
        <Link href="/contact" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
          Contact
        </Link>
        <div className="flex space-x-2">
          <Link href="/login" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
            Login
          </Link>
          <span className="text-gray-600">|</span>
          <Link href="/signup" className="text-gray-600 hover:text-white transition duration-300 ease-in-out">
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default QuickLinks;
