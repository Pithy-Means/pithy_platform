'use client';

import Link from 'next/link';
import { usePathname} from 'next/navigation'
import Logo from './Logo'
import { Button } from './ui/button';
import { useState } from 'react';



const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className='px-10 pt-6 bg-black'>
      <div className='flex justify-between '>
        <div className='text-2xl font-bold'>
          <Logo />
        </div>

        {/* Hamburger Menu Icon for Small Screens */}
        <div className='lg:hidden'>
          <button
            onClick={handleToggle}
            className='text-white focus:outline-none'>
            {/* Hamburger Icon */}
            <svg
              className='w-8 h-8'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
        {/* Links - Hidden on Small Screens, shown on larger */}
        <div className={'hidden lg:flex items-center space-x-6'}>
          <div className='flex space-x-4'>
            <Link href='/' prefetch={true} className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>
              Home
            </Link>

            <Link href='/about' prefetch={true} className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/about' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>
              About
            </Link>
            <Link href='/how-it-works' prefetch={true} className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/how-it-works' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>
              How It Works
            </Link>
            <Link href='/contact' prefetch={true} className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/contact' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>

              Contact
            </Link>
          </div>
          <div className='flex space-x-12'>
            <div className='flex items-center gap-x-2'>
              <Link href='/signIn' prefetch={true} className='text-[#5AC35A] hover:text-white transition duration-300'>Login</Link>
              <div className='bg-white h-3 w-0.5'></div>
              <Link href='#'  prefetch={true}className='text-white hover:text-[#5AC35A] transition duration-300'>Sign Up</Link>
            </div>
            <div>
              <Button className='bg-[#5AC35A] px-8 py-0'>Take Test</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Visible only when toggled open */}
      {isOpen && (
        <div className='lg:hidden flex flex-col space-y-4 mt-4 items-center text-center'>
          <Link href='/' className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>
            Home
          </Link>

          <Link href='/about' className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/about' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
            About
          </Link>

          <Link href='/how-it-works' className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/how-it-works' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
            How It Works
          </Link>

          <Link href='/contact' className={`text-white hover:text-[#5AC35A] transition duration-300 ${pathname === '/contact' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
            Contact
          </Link>

          <div className='flex flex-col space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Link href='#' className='text-[#5AC35A] hover:text-white transition duration-300'>Login</Link>
              <div className='bg-white h-3 w-0.5'></div>
              <Link href='#' className='text-white hover:text-[#5AC35A] transition duration-300'>Sign Up</Link>
            </div>

            <div>
              <Button className='bg-[#5AC35A] w-full'>Take Test</Button>
            </div>
          </div>
        </div>
      )}
    
    </div>
  )
}

export default Navbar