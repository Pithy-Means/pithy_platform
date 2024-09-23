import Image from 'next/image';

const CardMadam = () => {
  return (
    <div className='h-[400px] w-[400px] bg-white'>
      <div className='bg-[#5AC35A] shadow-inner flex items-center justify-center h-[250px] w-[250px] relative rounded'>
        <Image
          src='/assets/whoweare.png'
          height={300}
          width={200}
          alt='Header'
          className='object-cover absolute top-[-90px] drop-shadow-2xl'
        />
      </div>
    </div>
  )
}

export default CardMadam;