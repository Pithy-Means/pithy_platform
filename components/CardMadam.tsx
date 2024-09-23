import Image from 'next/image';

const CardMadam = () => {
  return (
    <div className='h-[400px] w-[400px] bg-white'>
      <div className='bg-[#5AC35A] shadow-inner flex items-center justify-center h-[300px] w-[300px] relative rounded'>
        <Image
          src='/assets/whoweare.png'
          height={320}
          width={220}
          alt='Header'
          className='object-cover absolute top-[-76px] drop-shadow-2xl'
        />
      </div>
    </div>
  )
}

export default CardMadam;