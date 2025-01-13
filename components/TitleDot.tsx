interface TitleDotProps {
  title: string;
  className?: string;
}

const TitleDot: React.FC<TitleDotProps> = ({ title, className }) => {
  return (
    <div className="flex items-center md:justify-center lg:justify-start space-x-2 w-full">
      <h1 className={`text-xl sm:text-[6px] md:text-base md:text-center lg:text-start text-center text-black font-extrabold capitalize ${className}`}>
        {title}
      </h1>
      <span className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 xl:h-2 xl:w-2 4k:h-4 4k:w-4 rounded-full"></span>
    </div>
  );
};

export default TitleDot;
