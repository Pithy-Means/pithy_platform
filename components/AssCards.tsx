import React from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

const AssCards = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-6 lg:items-start items-center">
      <div className="flex  items-center">
        <div className="flex flex-col items-center lg:gap-0 space-y-2 lg:mb-64 mb-0">
          <div className="text-center block lg:hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              1
            </div>
          </div>
          <Card className="bg-white w-64">
            <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
              <h3 className="text-lg font-extrabold text-black capitalize">
                Take our assessment
              </h3>
            </div>
            <div className="flex items-center flex-col space-y-2 py-4">
              <p className="capitalize text-black">
                Answer a series of questions
              </p>
              <Image
               src="/assets/Frame 87.png" 
               alt="Frame" 
               width={40}
               height={40}
               className=""
               />
            </div>
          </Card>
          <div className="text-center lg:block hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              1
            </div>
          </div>
          <div className="block lg:hidden">
            <Image 
            src="/assets/green.png" 
            alt="Take"
            width={40}
            height={40}
            className="" 
            />
          </div>
          <div className="text-center block lg:hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              2
            </div>
          </div>
        </div>
        <Image
          src="/assets/Arrow2.png"
          alt="Join"
          width={40}
          height={40}
          className="mb-[360px] lg:block hidden"
        />
      </div>
      <div className="flex flex-col items-center lg:gap-0  space-y-2">
        <Card className="bg-white w-64 lg:mt-24 lg:ml-[-260px] ml-0 mt-0">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg font-extrabold text-black capitalize first-line:">
              Get personalized results
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4">
            <p className="capitalize text-black">receive a customized report</p>
            <Image src="/assets/Frame 88.png" 
            alt="Frame"
            width={40}
            height={40}
            className=""
             />
          </div>
        </Card>
        <div className="text-center">
          <Image
            src="/assets/Arrow 3.png"
            alt=""
            width={40}
            height={40}
            className="mt-[-160px] lg:block hidden"
          />
        </div>
        <div className="block lg:hidden">
          <Image src="/assets/green.png"
           alt="Take" 
           width={40}
           height={40}
           className=""
           />
        </div>
        <div className="text-center block lg:hidden">
          <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
            3
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Card className="bg-white w-64 lg:mt-14 mt-0">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg font-extrabold text-black capitalize">
              Explore and take action
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4 px-6">
            <p className="capitalize text-black">
              review your results & explore recommendations
            </p>
            <Image src="/assets/Frame 89.png" 
            alt="Frame" 
            width={40}
            height={40}
            className=""
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssCards;
