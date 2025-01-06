import { Button } from "./ui/button";
import TitleDot from "./TitleDot";
import CardMadam from "./CardMadam";

const Whoweare = () => {
  return (
    <div className="pt-20 px-10 bg-white">
      <div className="flex justify-between space-x-20 w-full">
        <div className="flex flex-col w-2/3 space-y-4 3xl:w-1/2">
          <TitleDot title={"Who We Are"} />
          <p className="capitalize text-black md:text-lg lg:text-lg xl:-text-2xl 2xl:text-2xl 3xl:text-2xl">
            Empowering informed decisions for a fulfing career
          </p>
          <p className="text-black text-base">
            At pithy means, we believe that everyone deserves to find their
            perfect fit. our mission is to guide students, professionals, and
            business managers towards their most suitable study, professional,
            or business areas.
          </p>
          <div className="flex justify-between space-x-4">
            <div className="flex flex-col space-y-4 3xl:space-y-4">
              <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md">
                Our Story
              </div>
              <p className="capitalize text-black text-base">
                Founded in the US and Uganda, our team saw the need to prevent:
              </p>
              <div className="flex flex-col ml-4 xl:space-y-2 2xl:space-y-2 3xl:space-y-4 text-base">
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5"></div>
                  <p className="capitalize text-black text-base">
                    identify natural strengths and interests
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1"></div>
                  <p className="capitalize text-black">
                    Explore suitable career and business paths
                  </p>
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1"></div>
                  <p className="capitalize text-black">
                    Make informed decisions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md">
                Our vision
              </div>
              <p className="capitalize text-black text-base">
                A world where everyone thrives in their chosen path.
              </p>
              <Button className="text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit">
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
