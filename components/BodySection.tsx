import React from 'react';
import Header_description from './Header_description';
import CardImage from './CardImage';

const BodySection = () => {
  return (
    <div className='flex flex-col-reverse lg:flex-row justify-between items-center space-y-20 lg:space-y-0 lg:space-x-10 px-6 lg:px-10 py-20 bg-black'>
      <Header_description />
      <div className='pb-20 lg:pb-0'>
        <CardImage />
      </div>
    </div>
  );
}

export default BodySection;
