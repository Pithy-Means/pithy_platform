import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const SpecialOffer = () => {
  return (

    <div className='px-10 bg-white py-4'>
      <div className="flex h-96">
        {/* Left Side with full background color */}
        <Card className="w-full rounded-lg relative bg-[#61BC5B]">
          {/* Background image that covers only the left half */}
          <div
            className="absolute inset-0 bg-auto bg-left bg-no-repeat"
            style={{
              backgroundImage: "url('/assets/Layer_1.png')",
            }}
          >
            <div className='flex justify-between'>
              <div className='pl-48 pt-10 text-black flex flex-col space-y-4'>
                <h1 className='text-3xl capitalize font-bold'>special offer!</h1>
                <div>
                  <p className='text-base capitalize'>Join now and get up to <b>40%</b> discount globally</p>
                  <p className='text-base capitalize'>Ugandan resident: get additional <b>90%</b> discount through local partnership</p>
                </div>
                <div className='flex items-center space-x-6'>
                  <Button className='bg-black text-white capitalize flex-grow'>Take the assessment</Button>
                  <Button className='flex items-center space-x-2 bg-transparent text-black border-none outline-none hover:text-white'>
                    <span className='text-base'>Contact Us</span>
                    <ArrowRight />
                  </Button>
                </div>

              </div>
              <div className="relative w-full h-28">
                <Image
                  src='/assets/discount.png'
                  alt='90% Discount'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
              <div className="relative w-full h-80 mt-8">
                <Image
                  src='/assets/woman.png'
                  alt='Woman'
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SpecialOffer