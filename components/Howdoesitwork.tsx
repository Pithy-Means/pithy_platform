import TitleDot from "./TitleDot";
import RandomGridCards from "./AssCards";

const Howdoesitwork = () => {
  return (
    <div className="px-10 py-4 bg-white">
      <div className="flex flex-col lg:space-y-2 space-y-8 lg:items-start items-center">
        <TitleDot
          title={"how does it work?"}
          className="lg:text-xl md:text-3xl"
        />
        <p className="capitalize text-black lg:text-start text-center text-xl">
          Discover your ideal career path in 4 easy Steps
        </p>
        <div className="flex justify-center w-full items-center">
          <RandomGridCards />
        </div>
      </div>
    </div>
  );
};

export default Howdoesitwork;
