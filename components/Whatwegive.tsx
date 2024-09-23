import Image from 'next/image'
import { Button } from './ui/button';
import TitleDot from './TitleDot';
import { Card } from './ui/card';


const Whatwegive = () => {
  return (
    <div className="px-10 bg-white">
      <div className='flex flex-col space-y-2'>
        <h1 className='text-lg text-[#5AC35A]'>WHAT WE GIVE YOU</h1>
        <div className='flex space-x-2'>
          <TitleDot title={'unlock your potential'} />
          <TitleDot title={'future'} />
          <div className='flex space-x-2 place-items-center'>
            <h1 className='text-3xl text-black font-extrabold capitalize'>finance with</h1>
            <div className='flex flex-col pt-[16px]'>
              <h1 className='text-3xl text-[#5AC35A] font-extrabold uppercase'>Pithy means</h1>
              <img src='/assets/green-line.png' alt='line' className='object-cover' />
            </div>
          </div>
        </div>
        <p className='capitalize text-black'>avoid costly mistake and find your perfect fit</p>
        <Button className='text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit capitalize'>Start your journey</Button>
        <div className='flex justify-between py-6'>
          <Card className='bg-white w-72 rounded drop-shadow-2xl border-none'>
            <div className='flex flex-col items-center px-4 py-6 space-y-2'>
              <div className='relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded'>
                <img src='/assets/briefcase-04.png' alt='briefcase' className='absolute top-[-10px] left-[-10px]' />
              </div>
              <h1 className='text-lg text-black font-extrabold capitalize text-center'>find your ideal path</h1>
              <p className='text-black capitalize text-center'>Discover suitatble study, profesional or Business areas tailored to your strengths.</p>
            </div>
          </Card>
          <Card className='bg-white w-72 rounded drop-shadow-2xl border-none'>
            <div className='flex flex-col items-center px-4 py-6 space-y-2'>
              <div className='relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded'>
                <img src='/assets/cancel-circle.png' alt='cancel' className='absolute top-[-10px] left-[-10px]' />
              </div>
              <h1 className='text-lg text-black font-extrabold capitalize text-center'>avoid costly mistakes</h1>
              <p className='text-black capitalize text-center'>Minimize risks and wasted time and ressources.</p>
            </div>
          </Card>
          <Card className='bg-white w-72 rounded drop-shadow-2xl border-none'>
            <div className='flex flex-col items-center px-4 py-6 space-y-2'>
              <div className='relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded'>
                <img src='/assets/strike - stroke.png' alt='strike' className='absolute top-[-10px] left-[-10px]' />
              </div>
              <h1 className='text-lg text-black font-extrabold capitalize text-center'>Boost confidence</h1>
              <p className='text-black capitalize text-center'>Ensure success in you chosen path.</p>
            </div>
          </Card>
          <Card className='bg-white w-72 rounded drop-shadow-2xl border-none'>
            <div className='flex flex-col items-center px-4 py-6 space-y-2'>
              <div className='relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded'>
                <img src='/assets/square-lock-02.png' alt='briefcase' className='absolute top-[-10px] left-[-10px]' />
              </div>
              <h1 className='text-lg text-black font-extrabold capitalize text-center'>Secure your future</h1>
              <p className='text-black capitalize text-center'>Make informed decisions for yourself and your collaborators</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Whatwegive