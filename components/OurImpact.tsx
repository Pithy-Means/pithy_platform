import Image from 'next/image';
import TitleDot from './TitleDot';
import StarRating from './Stars';
import { PiQuotesFill } from "react-icons/pi";
import CardCarousel from './cardSlide';
import SpecialOffer from './SpecialOffer';
import Footer from './Footer';
// import { IoIosArrowRoundForward } from "react-icons/io";



const cards = [
  {
    title: 'Transformed',
    description: 'i can reflect on the time i came across Pithy Means, i’m always amazed. what journey it’s been. thanks to their team’s guidance',
    imageSrc: '/assets/C2_15.png',
    name: 'Arnaud B.',
    role: 'CEO, Company',
  },
  {
    title: 'Transformed',
    description: 'i can reflect on the time i came across Pithy Means, i’m always amazed. what journey it’s been. thanks to their team’s guidance',
    imageSrc: '/assets/person_feedback.png',
    name: 'Jane Smith',
    role: 'Founder, Another Company',
  },
  {
    title: 'Exceptional Experience',
    description: 'Thanks to Pithy Means, I have grown both personally...',
    imageSrc: '/assets/C05_6.png',
    name: 'Alice Brown',
    role: 'COO, Yet Another Company',
  },

];

const OurImpact = () => {
  return (
    <div className='relative flex flex-col  w-full bg-white'>
      <div className=' text-black px-4 sm:px-8 lg:px-20'>
        <div className=''>
          {/* <h1 className='text-black font-extrabold'>Our impact<b className='text-green-600 text-xl'>.</b></h1> */}
          <TitleDot title='Our impact' />
          <p className='md:text-left'>Hear what others have to say about us</p>

          <StarRating />
          <div className='flex justify-center md:justify-start text-green-500 transform -scale-x-100 '>
            <PiQuotesFill size={30} />
          </div>
        </div>
        <div className=' mt-4'>
          <Image
            src='/assets/Group3473707.png'
            height={50}
            width={50}
            alt='Header'
            className='absolute left-0 object-contain'
          />
        </div>
        <CardCarousel cards={cards} />

        {/* <div className='flex flex-col bg-green-500 lg:flex-row  rounded p-4 mt-10 mb-10 lg:mx-20'>
        <div className=''>
           <Image
              src='/assets/Layer_1.png'
              height={250}
              width={220}
              alt=''
              className='left-30 absolute px-1 '
            />

          <div className='w-full lg:w-3/4 my-4 lg:my-8 px-4 lg:px-10'>
  
            <h2 className='text-black  text-lg lg:text-xl font-semibold'>Special offer!</h2>
            <p className='text-sm lg:text-base'>Join now and get up to 40% discount globally</p>
            <p className='text-sm lg:text-base'>Ugandan resident: get additional 90% discount through local partenership</p>

            <div className='flex md:flex-row lg:flex-row items-center mt-4'>
              <button className='bg-black p-2 rounded m-4 text-white border border-black'>Take the assessment</button>
              <p className='flex  items-center mt-2 md:ml-4'>Contact us <IoIosArrowRoundForward size={20} /></p>
            </div>
          </div>

        </div>

        <div className='flex flex-col items-center lg:items-end lg:flex-row lg:ml-auto'>
          <Image
            src='/assets/start_price.png'
            height={150}
            width={150}
            alt=''
            className='mb-4 lg:mb-0 lg:mr-4'
          />
        </div>
        <div>
          <Image
            src='/assets/Rectangle2390.png'
            height={350}
            width={350}
            alt=''
            className='mr-0 lg:mr-10 object-contain'
          />
        </div>
      </div> */}

      </div>
      <SpecialOffer />
      <Footer />
    </div>

  )
}

export default OurImpact