import React from "react";
import CardMadam from "./CardMadam";
import TitleDot from "./TitleDot";

const OurStory = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-center items-center bg-white py-20 w-full lg:py-20">
      {/* Content Section */}
      <div className="text-black px-4 sm:px-8 lg:px-20 w-full lg:w-3/4 flex flex-col items-center lg:items-start">
        <div className="pb-6">
          <TitleDot title={"Our story"} />
          <p className="text-sm sm:text-base text-center lg:text-left">
            Pithy means was founded to address the growing concern of academic
            regrets, professional issues, and business collapse. Our team
            realized that many people invest time and resources in the wrong
            areas, leading to dissatisfaction and poor performance.
          </p>
        </div>
        <div className="flex flex-col lg:justify-start justify-center">
          <h2 className="font-extrabold font-sans text-lg lg:text-xl text-black bg-[#5AC35A] rounded-md px-2 py-1 w-fit text-center lg:text-left">
            Our mission & vision
          </h2>
          <p className="mt-4 w-full lg:w-2/3 text-sm sm:text-base text-center lg:text-left">
            Our mission is to provide personalized career and business
            assessments, empowering individuals to make informed decisions. Our
            vision is a world where everyone thrives in their chosen paths.
          </p>
        </div>
      </div>

      {/* Card Section */}
      <div className="flex w-full mt-20 sm:mt-10 justify-center lg:mt-0">
        <CardMadam />
      </div>
    </div>
  );
};

export default OurStory;
