interface TitleDotProps {
  title: string;
}

const TitleDot: React.FC<TitleDotProps> = ({ title }) => {
  return (
    <div className='flex items-center justify-center md:justify-center lg:justify-start space-x-2 w-full'>
      <h1 className='text-xl sm:text-[6px] md:text-base lg:text-3xl md:text-center lg:text-start text-center text-black font-extrabold capitalize'>
        {title}
      </h1>
      <span className='bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full'></span>
    </div>
  );
};

export default TitleDot;
