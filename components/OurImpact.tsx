import Image from "next/legacy/image";
import TitleDot from "./TitleDot";
import StarRating from "./Stars";
import { PiQuotesFill } from "react-icons/pi";
// import CardCarousel from "./cardSlide";
import Footer from "./Footer";
import SlidingCards from "./cardSlide";
// import { IoIosArrowRoundForward } from "react-icons/io";

const OurImpact = () => {
  return (
    <div className="relative flex flex-col  w-full bg-white overflow-hidden">
      <div className=" text-black px-4 sm:px-8 lg:px-20">
        <div className="">
          {/* <h1 className='text-black font-extrabold'>Our impact<b className='text-green-600 text-xl'>.</b></h1> */}
          <TitleDot title="Our impact" />
          <p className="md:text-left">Hear what others have to say about us</p>

          <StarRating />
          <div className="flex justify-center md:justify-start text-green-500 transform -scale-x-100 ">
            <PiQuotesFill size={30} />
          </div>
        </div>
        <div className=" mt-4">
          <Image
            src="/assets/Group3473707.png"
            height={50}
            width={50}
            alt="Header"
            className="absolute left-0 object-contain"
          />
        </div>
        <SlidingCards />
      </div>
      <Footer />
    </div>
  );
};

export default OurImpact;
