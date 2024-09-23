import Image from 'next/image';


const CardImage = () => {
  return (
    <div className='bg-gradient-to-b from-[#5AC35A] via-[#00AE76] to-[#000] rounded-l-xl flex items-center justify-center h-[400px] w-[400px]'>
      <Image src='/assets/Standing_ladies.png' height={350} width={250} alt='Header' />
    </div>
  )
}

export default CardImage;