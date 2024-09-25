'use client';

import Link from 'next/link';
import { usePathname} from 'next/navigation'
import Logo from './Logo'
import { Button } from './ui/button';



const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className='px-10 pt-6 bg-black'>
      <div className='flex justify-between'>
        <div className='text-2xl font-bold'>
          <Logo />
        </div>
        <div className='flex items-center space-x-6'>
          <div className='flex space-x-4'>
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
          </div>
          <div className='flex space-x-12'>
            <div className='flex items-center gap-x-2'>
              <Link href='#' className='text-[#5AC35A] hover:text-white transition duration-300'>Login</Link>
              <div className='bg-white h-3 w-0.5'></div>
              <Link href='#' className='text-white hover:text-[#5AC35A] transition duration-300'>Sign Up</Link>
            </div>
            <div>
              <Button className='bg-[#5AC35A] px-8 py-0'>Take Test</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar