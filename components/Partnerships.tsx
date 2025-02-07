import React from "react";
import TitleDot from "./TitleDot";

const Partnerships = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full bg-white pb-10">
      <div className="px-4 sm:px-8 lg:px-20 w-full">
        {/* <h1 className='text-black font-semibold'>Partnerships <b className='text-green-600 text-xl'>.</b></h1> */}
        <TitleDot title="Worked With" />
        <div className="flex flex-wrap text-black mt-4 gap-2">
          <p className=" bg-white/75 border border-solid outline-none rounded-md  p-2 w-full sm:w-auto text-center">
            LOGO PARTNER1
          </p>
          <p className=" bg-white/75 border border-solid outline-none rounded-md  p-2 w-full sm:w-auto text-center">
            LOGO PARTNER2
          </p>
          <p className=" bg-white/75 border border-solid outline-none rounded-md  p-2 w-full sm:w-auto text-center">
            LOGO PARTNER3
          </p>
          <p className=" bg-white/75 border border-solid outline-none rounded-md  p-2 w-full sm:w-auto text-center">
            LOGO PARTNER4
          </p>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
