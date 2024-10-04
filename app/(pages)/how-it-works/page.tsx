import DiscoverFit from '@/components/DiscoverFit';
import Footer from '@/components/Footer';
import FreqAskeQuestion from '@/components/FreqAskeQuestion';
import SpecialMobile from '@/components/SpecialMobile';
import SpecialOffer from '@/components/SpecialOffer';
import React from 'react';

export default function HowItWorksPage() {
  return (
    <div className='flex flex-col items-center w-full'>
      {/* Header Section */}
      <div className='flex justify-center items-center h-72 bg-black w-full top-0'>
        <h1 className='text-green-600 text-lg lg:text-3xl md:text-2xl'>How It Works</h1>
      </div>

      {/* DiscoverFit Component */}
      <DiscoverFit />

      {/* Ensure FreqAskeQuestion gets full width */}
      <div className='w-full'>
        <FreqAskeQuestion />
      </div>

      {/* Special Offer for larger screens */}
      <div className='lg:block hidden w-full'>
        <SpecialOffer />
      </div>

      {/* Special Mobile Offer for smaller screens */}
      <div className='lg:hidden block w-full'>
        <SpecialMobile />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
