import React from 'react'
import Image from 'next/image'
import Post from './Post'

const ShareSomething = () => {
  return (
    <div className='flex flex-col w-full h-full '>
      <div className='flex flex-col bg-white  text-black px-6 justify-center  h-20  p-4  m-6'>
        <div className='flex flex-row gap-4'>
          <Image src='/assets/person_feedback.png'
            width={40}
            height={40}
            alt='person'
            className=' rounded-lg' />
          <input type="text" placeholder='Share something'
            className='border-2 border-gray-300 rounded-lg w-full p-2' />
          <button className='bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg p-2 w-20'>Post</button>
        </div>

      </div>
      <Post />

    </div>
  )
}

export default ShareSomething