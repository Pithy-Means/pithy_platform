import React from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

const AssCards = () => {
  return (
    <div
      className="grid gap-10 lg:grid-cols-5 lg:px-10  xl:px-32 xl:space-y-0 items-center justify-items-center"
    >
      {/* Card 1 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-center lg:hidden" >
          <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center">
            1
          </div>
        </div>
        <Card className="bg-white w-64 md:w-96 lg:w-64 xl:w-[20rem] 2xl:w-[22rem] 3xl:w-[28rem]">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg xl:text-xl 4k:text-2xl font-extrabold text-black capitalize">
              Take our assessment
            </h3>
          </div>
          <div className="flex flex-col items-center space-y-2 py-4">
            <p className="capitalize text-black text-sm sm:text-base">Answer a series of questions</p>
            <Image
              src="/assets/Frame 87.png"
              alt="Frame"
              width={60}
              height={60}
              priority
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </Card>
        <div className="text-center hidden lg:block">
          <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center">
            1
          </div>
        </div>
        {/* Arrow for MOBILE*/}
        <div className="block lg:hidden">
          <Image
            src="/assets/green.png"
            alt="Take"
            width={20}
            height={100}

            className=" "
          />
        </div>
        <div className="text-center block md:block lg:hidden xl:hidden 4x:hidden">
          <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center ">
            2
          </div>
        </div>
      </div>

      {/* Arrow between Card 1 and Card 2 (Desktop Only) */}
      <div className="relative lg:ml-6 lg:mt-[-3rem] lg:flex-grow">
        <Image
          src="/assets/Arrow2.png"
          alt="Join"
          width={150}
          height={100}
          className="hidden lg:block"
        />
      </div>


      {/* Card 2 */}
      <div className="flex flex-col items-center space-y-2">
        <Card className="bg-white w-64 md:w-96 lg:w-64 lg:relative xl:w-[20rem]  2xl:w-[22rem] 3xl:w-[28rem] md:mt-[-50px] lg:ml-[-5rem] lg:mt-[10rem] xl:mt-[10rem] ">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg font-extrabold text-black capitalize ">
              Get personalized results
            </h3>
          </div>
          <div className="flex flex-col items-center space-y-2 py-4 text-base">
            <p className="capitalize text-black text-sm sm:text-base">Receive a customized report</p>
            <Image
              src="/assets/Frame 88.png"
              alt="Frame"
              width={60}
              height={60}
              priority
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </Card>
      </div>

      {/* Arrow between Card 2 and Card 3 (Desktop Only) */}
      <div className="relative lg:mb-[-320px] lg:ml-[-90px] 2xl:mb-20px ">
        <Image
          src="/assets/Arrow3.png"
          alt="Explore"
          width={150}
          height={100}
          className="hidden lg:block"
        />
      </div>
      <div className="block lg:hidden md:mt-[-80px]">
        <Image src="/assets/green.png"
          alt="Take"
          width={20}
          height={100}
          priority
          className=" "
        />
      </div>
      <div className="text-center block lg:hidden md:mt-[-30px]">
        <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
          3
        </div>
      </div>


      {/* Card 3 */}
      <div className="flex flex-col items-center space-y-2">
        <Card className="bg-white w-64 md:w-96 lg:w-64 lg:relative xl:w-[20rem] 2xl:w-[22rem] 3xl:w-[28rem]">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg font-extrabold text-black capitalize">
              Explore and take action
            </h3>
          </div>
          <div className="flex flex-col items-center space-y-2 py-4 px-6 text-base">
            <p className="capitalize text-black text-sm sm:text-base">
              Review your results & explore recommendations
            </p>
            <Image
              src="/assets/Frame 89.png"
              alt="Frame"
              width={60}
              height={60}
              priority
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssCards;
