import Image from "next/legacy/image";
import TitleDot from './TitleDot';
import StarRating from './Stars';
import { PiQuotesFill } from "react-icons/pi";
import CardCarousel from './cardSlide';
import SpecialOffer from './SpecialOffer';
import Footer from './Footer';
import SpecialMobile from './SpecialMobile';
// import { IoIosArrowRoundForward } from "react-icons/io";



const cards = [
  {
    title: 'Transformed',
    description: 'i can reflect on the time i came across Pithy Means, i’m always amazed. what journey it’s been. thanks to their team’s guidance',
    imageSrc: '/assets/person_feedback.png',
    name: 'Arnaud B.',
    role: 'CEO, Company',
  },
  {
    title: 'Transformed',
    description: 'i can reflect on the time i came across Pithy Means, i’m always amazed. what journey it’s been. thanks to their team’s guidance',
    imageSrc: '/assets/C2_15.png',
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
    <div className='relative flex flex-col  w-full bg-white overflow-hidden'>
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
      </div>
      <div className='md:block hidden'>
        <SpecialOffer />
      </div>
      <div className='md:hidden block'>
        <SpecialMobile />
      </div>
      <Footer />
    </div>

  )
}

export default OurImpact