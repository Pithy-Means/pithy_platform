import React from "react";
import TitleDot from "./TitleDot";
import CardMadam from "./CardMadam";
import { Button } from "./ui/button";

const WhoWeAreMobile = () => {
  return (
    <div className="flex flex-col space-y-10 items-center bg-white p-10">
      <div className="flex flex-col space-y-4 items-center">
        <TitleDot title={"Who We Are"} />
        <p className="capitalize text-black text-center">
          Empowering informed decisions for a fulfing career
        </p>
        <p className="text-black text-center">
          At pithy means, we believe that everyone deserves to find their
          perfect fit. our mission is to guide students, professionals, and
          business managers towards their most suitable study, professional, or
          business areas.
        </p>
      </div>

      <div className="my-auto">
        <CardMadam />
      </div>
      <div className="flex flex-col space-y-6 w-full items-center">
        <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md">
          Our Story
        </div>
        <p className="capitalize text-black text-center">
          Founded in the US and Uganda, our team saw the need to prevent:
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex space-y-2 flex-col items-center">
            <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5"></div>
            <p className="capitalize text-black text-center">
              identify natural strengths and interests
            </p>
          </div>
          <div className="flex space-y-2 flex-col items-center">
            <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1"></div>
            <p className="capitalize text-black text-center">
              Explore suitable career and business paths
            </p>
          </div>
          <div className="flex space-y-2 flex-col items-center">
            <div className="border-2 border-[#5AC35A] rotate-45 p-0.5 h-1 w-1"></div>
            <p className="capitalize text-black">Make informed decisions</p>
          </div>
        </div>
        <div className="bg-[#5AC35A] w-fit text-black font-extrabold px-2 rounded-md">
          Our vision
        </div>
        <p className="capitalize text-black text-center">
          A world where everyone thrives in their chosen path.
        </p>
        <Button className="text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit">
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default WhoWeAreMobile;
