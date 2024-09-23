
interface TitleDotProps {
  title: string;
}

const TitleDot: React.FC<TitleDotProps> = ({title}) => {
  return (
    <div className='flex items-center space-x-2 text-black'>
      <h1 className='text-3xl text-black font-extrabold capitalize'>{title}</h1>
      <span className='bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-2 w-2 rounded-full'></span>
    </div>
  )
}

export default TitleDot