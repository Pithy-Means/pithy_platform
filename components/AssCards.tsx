import React from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

const AssCards = () => {
  return (
    <div className="flex flex-col lg:flex-row space-y-6 items-center xl:space-y-8 4k:space-y-12 ">
      <div className="flex  items-center ">
        <div className="flex flex-col items-center lg:gap-0 space-y-2 lg:mb-20 mb-0 xl:mb-72 4k:mb-96">
          <div className="text-center block lg:hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              1
            </div>
          </div>
          <Card className="bg-white w-64 md:w-96 lg:w-72 xl:w-[28rem] 4k:w-[36rem] ">
            <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
              <h3 className="text-lg md:text-xl xl:text-4xl 4k:text-2xl font-extrabold text-black capitalize">
                Take our assessment
              </h3>
            </div>
            <div className="flex items-center flex-col space-y-2 py-4">
              <p className="capitalize text-black md:text-xl ">
                Answer a series of questions
              </p>
              <Image
                src="/assets/Frame 87.png"
                alt="Frame"
                width={60}
                height={60}
                priority
                className=""
                style={{ height: "50px", width: "30%" }}
              />
            </div>
          </Card>
          <div className="text-center lg:block hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              1
            </div>
          </div>
          {/* Arrow for Desktop*/}
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
        <Image
          src="/assets/Arrow2.png"
          alt="Join"
          width={150}
          height={100}
          className="mb-[300px]  lg:block hidden"
        />
      </div>
      <div className="flex flex-col items-center lg:gap-0  space-y-2 lg:space-y-0 xl:gap-4 4k:gap-6">
        <Card className="bg-white w-64 md:w-96 xl:w-[28rem] 4k:w-[36rem] ml-0 lg:ml-2 lg:mt-[-240px] ">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg md:text-xl font-extrabold text-black capitalize first-line:">
              Get personalized results
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4">
            <p className="capitalize text-black md:text-xl">receive a customized report</p>
            <Image src="/assets/Frame 88.png"
              alt="Frame"
              width={60}
              height={60}
              priority
              className=" "
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </Card>
        <div className="text-center">
          <Image
            src="/assets/Arrow 3.png"
            alt=""
            width={150}
            height={100}
            className=" hidden lg:block relative -right-40 top-1/2 transform -translate-y-1/2 rotate-12 mt-[-10px]"
          />
        </div>
        <div className="block lg:hidden">
          <Image src="/assets/green.png"
            alt="Take"
            width={50}
            height={50}
            priority
            className="mb-[300px]  lg:block hidden"
          />
        </div>
        <div className="text-center block lg:hidden">
          <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
            3
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center ">
        <Card className="bg-white w-64 md:w-96 xl:w-[28rem] 4k:w-[36rem] lg:ml-28 lg:mt-[-140px]">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg md:text-xl font-extrabold text-black capitalize">
              Explore and take action
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4 px-6">
            <p className="capitalize text-black md:text-xl">
              review your results & explore recommendations
            </p>
            <Image src="/assets/Frame 89.png"
              alt="Frame"
              width={60}
              height={60}
              priority
              className=""
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AssCards;
