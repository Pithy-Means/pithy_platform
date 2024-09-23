import TitleDot from './TitleDot';
import AssCards from './AssCards';

const Howdoesitwork = () => {
  return (
    <div className='px-10 py-4 bg-white'>
      <div className='flex flex-col space-y-2'>
        <TitleDot title={'how does it work?'} />
        <p className='capitalize text-black'>Discover your ideal career path in 3 easy Steps</p>
        <AssCards />
        <div className='h-4 w-4 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center'>1</div>
      </div>
    </div>
  )
}

export default Howdoesitwork