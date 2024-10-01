import React from 'react'
import CardMadam from './CardMadam';
import TitleDot from './TitleDot';

const OurStory = () => {
  return (
    <div className='flex flex-col lg:flex-row justify-between items-start bg-white py-20 w-full lg:py-20'>
      <div className='text-black px-4 sm:px-8 lg:px-20 w-full lg:w-3/4'>
        <div className='pb-6'>
          <TitleDot title={'Our story'} />
          <p className='text-sm sm:text-base'>Pithy means was founded to address the growing concern of academic regrets, professional issues, and business collapse. our team realized that many people invest time and resources in the wrong areas, leading to dissatisfaction and poor performance.</p>
        </div>
        <div className=''>
          <h2 className='font-extrabold font-sans text=lg lg:text-xl text-black bg-[#5AC35A] rounded-md px-2 py-1 w-fit '>Our mission & vision</h2>
          <p className='mt-4 w-full lg:w-2/3 text-sm sm:text-base'>our mission is to provide personalized career and business assessments, empowering individuals to make informed decisions. our vision is a world where everyone thrives in their chosen paths.</p>
        </div>
      </div>
      <div className='flex w-full  mt-20 sm:justify-center lg:mt-0'>
        <CardMadam />
      </div>
    </div>
  );
}

export default OurStory 