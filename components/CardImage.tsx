import Image from 'next/image';


const CardImage = () => {
  return (
    <div className='bg-gradient-to-b from-[#5AC35A] via-[#00AE76] to-[#000] rounded-r-3xl flex items-center justify-center h-[400px] w-[350px] lg:p-0 px-10'>
      <Image src='/assets/Standing_ladies.png' height={450} width={250}  alt='Header' />
    </div>
  )
}

export default CardImage;