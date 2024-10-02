import DiscoverFit from '@/components/DiscoverFit'
import Footer from '@/components/Footer'
import FreqAskeQuestion from '@/components/FreqAskeQuestion'
import SpecialOffer from '@/components/SpecialOffer'
import React from 'react'

export default function HowItWorksPage() {
  return (
    <div className='flex flex-col items-center w-full'>
      <div className='flex justify-center items-center h-72 bg-black w-full top-0'>
        <h1 className='text-green-600 text-lg'>How It Works</h1>
      </div>
      <DiscoverFit />
    
      <FreqAskeQuestion />
      <SpecialOffer />
      <Footer />
    </div>
  )
}