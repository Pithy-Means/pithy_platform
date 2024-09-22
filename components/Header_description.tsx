import React from 'react'
import { Button } from './ui/button'

const Header_description = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <h1 className='text-6xl text-[#5AC35A] font-bold'>Unlock your dream career.</h1>
      <p>Discover Your Strengths, Interest, Perfect Career Match And The Business Venture For You</p>
      <Button className='bg-gradient-to-tr from-[#5AC35A] to-[#00AE76] w-fit'>Start Your Journey</Button>
    </div>
  )
}

export default Header_description