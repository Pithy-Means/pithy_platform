import TitleDot from "./TitleDot";
import AssCards from "./AssCards";

const Howdoesitwork = () => {
  return (
    <div className="px-10 py-4 bg-white">
      <div className="flex flex-col lg:space-y-2 space-y-8 lg:items-start items-center">
        <TitleDot title={"how does it work?"} />
        <p className="capitalize text-black lg:text-start text-center text-base lg:text-lg">
          Discover your ideal career path in 3 easy Steps
        </p>
        <AssCards />
      </div>
    </div>
  );
};

export default Howdoesitwork;
