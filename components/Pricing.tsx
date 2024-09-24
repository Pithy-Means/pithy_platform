import { Card } from './ui/card';
import TitleDot from './TitleDot';
import CardMadam from './CardMadam';
import { Button } from './ui/button';

const Pricing = () => {
  return (
    <div className='bg-white px-10 pb-4'>
      <div className='flex flex-col space-y-4 mb-6'>
        <TitleDot title={'Pricing'} />
        <p className='capitalize text-black'>One time payment</p>
      </div>
      <div className='bg-white flex space-x-8 p-10 border border-black/50 rounded-md drop-shadow-2xl shadow'>
        <div className='bg-[#37BB65] rounded-lg'>
          <img src='/assets/C2_1.png.png' alt='Gentle' className='px-10 relative top-[-60px] drop-shadow-[0_200px_25px_rgba(0,0,0,0.90)]' />
          {/* <div className='bg-black/40 w-40 h-40 opacity-30  rounded-full'></div> */}
        </div>
        <div className='flex flex-col space-y-4'>
          <div className='text-black font-extrabold capitalize'>Only For you</div>
          <div className='flex flex-col space-y-4'>
            <div className='flex space-x-2 items-center'>
              <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
              <p className='capitalize text-black'>For <b>$5</b> or UGX20.000 get a 3 months access with to the online orientation</p>
            </div>            
            <div className='flex space-x-2 items-center'>
              <div className='border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5'></div>
              <p className='capitalize text-black'>Become an affiliate and earn 10% referral fees</p>
            </div>
            <Button className='text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit'>Get Started</Button>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Pricing