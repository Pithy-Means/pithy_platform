import React from "react";
import { Card } from "./ui/card";
import Image from 'next/image';

const AssCards = () => {
  return (
    <div className="flex flex-col lg:flex-row space-y-6 items-center lg:space-y-0 lg:space-x-6 xl:space-y-8 4k:space-y-12 ">
      <div className="flex  items-center ">
        <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12 ">
          <div className="text-center block lg:hidden">
            <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
              1
            </div>
          </div>
          <Card className="bg-white w-64 md:w-96 lg:w-72 xl:w-[28rem] 4k:w-[36rem] ">
            <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
              <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize">
                Take our assessment
              </h3>
            </div>
            <div className="flex items-center flex-col space-y-2 py-4">
              <p className="capitalize text-black md:text-xl lg:text-2xl xl:text-3xl 4k:text-4xl">
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
          className="mb-[300px]  lg:block hidden lg:mb-[-10px]"
        />
      </div>
      <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12">
        <Card className="bg-white w-64 md:w-96 xl:w-[28rem] 4k:w-[36rem]">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize first-line:">
              Get personalized results
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4">
            <p className="capitalize text-black md:text-xl lg:text-2xl xl:text-3xl 4k:text-4xl">receive a customized report</p>
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
      <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12">
        <Card className="bg-white w-64 md:w-96 xl:w-[28rem] 4k:w-[36rem]">
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize">
              Explore and take action
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4">
            <p className="capitalize text-black md:text-xl lg:text-2xl xl:text-3xl 4k:text-4xl">
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
