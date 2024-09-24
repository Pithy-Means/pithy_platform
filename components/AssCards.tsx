import React from 'react'
import { Card } from './ui/card';

const AssCards = () => {
  return (
    <div className='flex space-x-4'>
      <div className='flex items-center'>
        <div className='flex flex-col items-center space-y-4 mb-64'>
          <Card className='bg-white w-64'>
            <div className='bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2'>
              <h3 className='text-lg font-extrabold text-black capitalizefirst-line:'>Take our assessment</h3>
            </div>
            <div className='flex items-center flex-col space-y-2 py-4'>
              <p className='capitalize text-black'>Answer a series of questions</p>
              <img src='/assets/Frame 87.png' alt='Frame' />
            </div>
          </Card>
          <div className='text-center'>
            <div className='h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center'>1</div>
          </div>
        </div>
        <img src='/assets/Arrow2.png' alt='Join' className='mb-[360px]' />      
      </div>
      <div className='flex flex-col items-center'>
        <Card className='bg-white w-64 mt-24 ml-[-260px]'>
          <div className='bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2'>
            <h3 className='text-lg font-extrabold text-black capitalize first-line:'>Get personalized results</h3>
          </div>
          <div className='flex items-center flex-col space-y-2 py-4'>
            <p className='capitalize text-black'>receive a customized report</p>
            <img src='/assets/Frame 88.png' alt='Frame' />
          </div>
        </Card>
        <div className='text-center'>
          <img src='/assets/Arrow 3.png' alt='' className='mt-[-160px]'/>
        </div>
      </div>      
      <div className='flex flex-col items-center'>
        <Card className='bg-white w-64 mt-14'>
          <div className='bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2'>
            <h3 className='text-lg font-extrabold text-black capitalize first-line:'>Explore and take action</h3>
          </div>
          <div className='flex items-center flex-col space-y-2 py-4 px-6'>
            <p className='capitalize text-black'>review your results & explore recommendations</p>
            <img src='/assets/Frame 89.png' alt='Frame' />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AssCards;