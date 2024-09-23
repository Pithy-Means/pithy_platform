'use client';

import Link from 'next/link';
import {useRouter, usePathname} from 'next/navigation'
import Image from 'next/image';
import Logo from './Logo'
import { Button } from './ui/button';
import Header_description from './Header_description';
import CardImage from './CardImage';


const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className='px-10 py-4 bg-black h-screen'>
      <div className='flex justify-between my-8'>
        <div className='text-2xl font-bold'>
          <Logo />
        </div>
        <div className='flex items-center space-x-6'>
          <div className='flex space-x-4'>
            <Link href='/' className={`text-white ${pathname === '/' ? 'underline decoration-[#5AC35A] underline-offset-8 decoration-2' : ''}`}>
              Home
            </Link>
            <Link href='/about' className={`text-white ${pathname === '/about' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
              About
            </Link>
            <Link href='/how-it-works' className={`text-white ${pathname === '/how-it-works' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
              How It Works
            </Link>
            <Link href='/contact' className={`text-white ${pathname === '/contact' ? 'underline decoration-[#5AC35A] underline-offset-4 decoration-2' : ''}`}>
              Contact
            </Link>
          </div>
          <div className='flex space-x-12'>
            <div className='flex items-center gap-x-2'>
              <Link href='#' className='text-[#5AC35A]'>Login</Link>
              <div className='bg-white h-3 w-0.5'></div>
              <Link href='#' className='text-white'>Sign Up</Link>
            </div>
            <div>
              <Button className='bg-[#5AC35A] px-8 py-0'>Take Test</Button>
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-between items-center my-20'>
        <Header_description />
        <div>
          <CardImage />
        </div>
      </div>
    </div>
  )
}

export default Navbar