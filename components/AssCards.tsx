import React from 'react'
import { Card } from './ui/card';

const AssCards = () => {
  return (
    <div className='flex'>
      <Card className='bg-white w-64'>
        <div className='bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2'>
          <h3 className='text-lg font-extrabold text-black capitalizefirst-line:'>Take our assessment</h3>
        </div>
        <div className='flex items-center flex-col space-y-2 py-4'>
          <p className='capitalize text-black'>Answer a series of questions</p>
          <img src='/assets/Frame 87.png' alt='Frame' />
        </div>
      </Card>
    </div>
  )
}

export default AssCards;