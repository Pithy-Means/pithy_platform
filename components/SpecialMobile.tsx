import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from "./ui/button";


const SpecialMobile = () => {
  return (
    <div className='p-10 bg-white'>
      <Card className='bg-[#61BC5B] flex flex-col items-center py-12 space-y-6'>
        {/* The main image container */}
        <div className="relative w-full md:h-56 h-48">
          {/* First Image (woman.png) */}
          <Image
            src='/assets/woman.png'
            alt='Woman'
            layout='fill'
            objectFit='contain'
          />

          {/* Discount image positioned bottom-left of the first image */}
          <div className="absolute bottom-0 left-5 md:left-48 w-16 h-16">
            <Image
              src='/assets/discount.png'
              alt='90% Discount'
              layout='fill'
              objectFit='contain'
            />
          </div>
        </div>
        <div className=' text-black flex flex-col items-center space-y-4'>
          <h1 className='text-xl capitalize font-bold'>special offer!</h1>
          <div className='flex flex-col space-y-4 items-center px-6 md:px-0'>
            <p className='text-[14px] capitalize text-center'>Join now and get up to <b>40%</b> discount globally</p>
            <p className='text-[14px] capitalize text-center'>Ugandan resident: get additional <b>90%</b> discount through local partnership</p>
          </div>
          <div className='flex flex-col items-center space-y-6'>
            <Button className='bg-black text-white capitalize flex-grow'>Take the assessment</Button>
            <Button className='flex items-center space-x-2 bg-transparent text-black border-none outline-none hover:text-white'>
              <span className='text-[14px]'>Contact Us</span>
              <ArrowRight />
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default SpecialMobile;
