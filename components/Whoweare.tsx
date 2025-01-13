import { Button } from "./ui/button";
import TitleDot from "./TitleDot";
import CardMadam from "./CardMadam";

const Whoweare = () => {
  return (
    <div className="pt-20 px-10 bg-white sm:px-10 lg:px-10 xl:px-10 4k:px-20 ">
      <div className="flex flex-col lg:flex-row justify-between space-y-10 lg:space-y-0 lg:space-x-16 xl:space-x-20 4k:space-x-32 w-full">
        <div className="flex flex-col w-2/3 space-y-4">
          <TitleDot title={"Who We Are"}  />
          <p className="capitalize text-black text-base lg:text-lg xl:text-lg 4k:text-4xl">
            Empowering informed decisions for a fulfing career.
          </p>
          <p className="text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl">
            At pithy means, we believe that everyone deserves to find their
            perfect fit. our mission is to guide students, professionals, and
            business managers towards their most suitable study, professional,
            or business areas.
          </p>
          <div className="flex justify-between flex-col lg:flex-row space-y-6 lg:space-y-2 lg:space-x-6 ">
            <div className="flex flex-col space-y-4 lg:w-2/3 4k:space-y-8">
              <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md text-base md:text-lg lg:text-xl xl-text-2xl 4k:text-5xl 4k:py-4 4k:mt-4">
                Our Story
              </div>
              <p className="capitalize text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl">
                Founded in the US and Uganda, our team saw the need to prevent:
              </p>
              <div className="flex flex-col ml-4 lg:space-y-2 xl:space-y-2 4k:space-y-6">
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 xl:h-2 xl:w-2 4k:h-4 4k:w-4 xl:p-1 4k:p-2"></div>
                  <p className="capitalize text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl">
                    identify natural strengths and interests
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1 xl:h-2 4k:h-4 4k:w-4 xl:w-2 xl:p-1 4k:p-2"></div>
                  <p className="capitalize text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl">
                    Explore suitable career and business paths
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1 xl:h-2 xl:w-2 4k:h-4 4k:w-4 xl:p-1 4k:p-2"></div>
                  <p className="capitalize text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl xl:mb-2 4k:mb-4">
                    Make informed decisions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4 4k:space-y-8">
              <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md text-base md:text-lg lg:text-xl xl-text-2xl 4k:text-5xl 4k:py-4 4k:mt-4">
                Our vision
              </div>
              <p className="capitalize text-black text-base md:text-lg lg:text-xl xl:text-xl 4k:text-5xl">
                A world where everyone thrives in their chosen path.
              </p>
              <Button className="text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit text-base md:text-lg lg:text-xl xl-text-2xl 4k:text-5xl 4k:p-10 4k:mt-4">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <CardMadam />
      </div>
    </div>
  );
};

export default Whoweare;
