import React from "react";
import TitleDot from "./TitleDot";
import Image from "next/image";

const DiscoverFit = () => {
  return (
    <div className="flex flex-col bg-white p-6 md:p-10  w-full ">
      <div className="text-black">
        <div className="sm:text-center text-start">
          <TitleDot title={"Discover Your Perfect Fit"} />
          <p className="md:block hideen lg:text-lg text-sm sm:text-base md:mb-6 ">
            Our 3-step process to guide you to your ideal career or business
            path.
          </p>
          <p className="block md:hidden text-base sm:text-start">
            contact us for questions, feedback or support .
          </p>
        </div>
        <div className="w-full lg:w-4/5 lg:my-10">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="hidden relative lg:flex md:flex flex-col items-center justify-center">
              <div className="relative z-10 lg:-mt-40 md:-mt-48">
                <Image
                  src="/assets/one.png"
                  alt="step 1"
                  width={50}
                  priority
                  height={50}
                />
              </div>
              <div className="relative lg:h-80 h-28 -mt-2 mr-2 lg:mb-2 md:h-72 ">
                <Image
                  src="/assets/lineone.png"
                  alt="line 1"
                  width={50}
                  priority
                  height={120}
                  style={{ height: "234px", width: "100%" }}
                />
              </div>
              <div className="relative z-10  lg:-mt-24 md:-mt-16 md:ml-2 ">
                <Image
                  src="/assets/two.png"
                  alt="step 2"
                  width={50}
                  priority
                  height={50}
                />
              </div>
              <div className="relative lg:h-56 -mt-1 md:h-52">
                <Image
                  src="/assets/linetwo.png"
                  alt="line 2 "
                  width={30}
                  priority
                  height={100}
                  style={{ height: "auto", width: "auto%" }}
                />
              </div>
              <div className="relative z-10 lg:-mt-2 md:mt-2">
                <Image
                  src="/assets/three.png"
                  alt="step 3"
                  width={50}
                  priority
                  height={50}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-10 md:space-y-4">
              <div className="flex lg:flex-row md:flex-row space-y-2 items-center space-x-4 flex-col">
                <div className="flex flex-col space-y-4 ">
                  <div className="block md:hidden">
                    <div className="relative z-10 flex justify-center">
                      <Image
                        src="/assets/one.png"
                        alt="step 1"
                        width={50}
                        priority
                        height={50}
                      />
                    </div>
                  </div>
                  <h2 className="font-bold text-2xl">Take Our Assessment</h2>
                  <p className="lg:text-xl sm:text-sm md:text-base">
                  <h2 className="font-bold text-2xl">Take Our Assessment</h2>
                  <p className="lg:text-xl sm:text-sm md:text-base">
                    Answer our comprehensive questionnaire, designed to identify
                    your 

                    <span className="hidden md:inline">
                      <br />
                    </span>
                    strengths, interests, and values.
                  </p>
                  <div className="flex flex-row items-center justify-between">
                    <ul className="flex flex-col space-y-3">
                      <li className="flex flex-col md:flex-row lg:flex-row space-y-2 space-x-3 items-center">
                        <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:w-2 lg:h-2 lg:p-1"></div>
                        <p className=" text-sm sm:text-base lg:text-lg">15 -minute assessment</p>
                      </li>
                      <li className="flex flex-col md:flex-row lg:flex-rowspace-x-3 space-y-2 items-center">
                        <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:w-2 lg:h-2 lg:p-1"></div>
                        <p className=" text-sm sm:text-base lg:text-lg ">~100 questions</p>
                      </li>
                      <li className="flex flex-col md:flex-row lg:flex-row space-y-2 space-x-3 items-center">
                        <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:w-2 lg:h-2 lg:p-1"></div>
                        <p className=" text-sm sm:text-base lg:text-lg">
                          our Proprietary algorithm analyzes your responses.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <Image
                  src="/assets/Frame 87.png"
                  width={150}
                  height={150}
                  priority
                  alt="DiscoverFit"
                  className=""
                />
                <div className="block md:hidden">
                  <div className="-mt-4">
                    <Image
                      src="/assets/lineone.png"
                      alt="line 1"
                      width={50}
                      priority
                      height={50}
                    />
                  </div>
                  <div className="-mt-2">
                    <Image
                      src="/assets/two.png"
                      alt="step 2"
                      width={50}
                      priority
                      height={50}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col space-y-4 md:space-y-1">
                  <h2 className="font-bold text-xl lg:text-2xl">
                    Get Personalized Results
                  </h2>
                  <p className="xl:text-lg text-sm sm:text-base">
                    Receive a detailed report highlighting your most suitable
                    career or  business paths.
                  </p>
                  <div className="flex lg:flex-row md:flex-row flex-col space-y-2 items-center  justify-between">
                    <div className="flex flex-row items-center justify-between">
                      <ul className="flex flex-col space-y-3">
                        <li className="flex flex-col md:flex-row lg:flex-row space-x-3 space-y-2 items-center md:jusitify-start">
                          <div className="border-2 border-[#5AC35A] rotate-45 lg:h-2 lg:w-2 lg:p-1 h-1 w-1 p-0.5"></div>
                          <p className="text-sm sm:text-base lg:text-lg">Customized report</p>
                        </li>
                        <li className="flex flex-col md:flex-row lg:flex-row space-x-3 items-center space-y-2">
                          <div className="border-2 border-[#5AC35A] rotate-45 lg:h-2 lg:w-2 lg:p-1 h-1 w-1 p-0.5"></div>
                          <p className="text-sm sm:text-base lg:text-lg ">
                            <span className="block sm:hidden -mt-6">
                              <br />
                            </span>{" "}
                            recommendations
                          </p>
                        </li>
                        <li className="flex flex-col md:flex-row lg:flex-row space-x-3 space-y-2 items-center">
                          <div className="border-2 border-[#5AC35A] rotate-45 lg:h-2 lg:w-2 lg:p-1 h-1 w-1 p-0.5"></div>
                          <p className=" text-sm sm:text-base lg:text-lg ">Actionable insights</p>
                        </li>
                      </ul>
                    </div>
                    <Image
                      src="/assets/Frame 88.png"
                      width={50}
                      height={140}
                      priority
                      alt="DiscoverFit"
                      style={{ height: "150px", width: "auto" }}
                    />
                    <div className="block md:hidden">
                      <div className="-mt-4">
                        <Image
                          src="/assets/lineone.png"
                          alt="line 1"
                          width={50}
                          priority
                          height={100}
                        />
                      </div>
                      <div className="-mt-2">
                        <Image
                          src="/assets/three.png"
                          alt="step 2"
                          width={50}
                          priority
                          height={50}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center space-x-4">
                <div className="flex flex-col space-y-4 md:space-y-1">
                  <h2 className="font-bold text-xl lg:text-2xl sm:text-center lg:text-start md:text-start">
                    Actionable insights
                  </h2>
                  <p className="xl:text-lg text-sm sm:text-base  ">
                    Review your results, explore recommended paths, and start
                    making informed decisions.
                  </p>
                  <div className="flex lg:flex-row md:flex-row flex-col space-y-2 items-center justify-between">
                    <div className="flex flex-row items-center justify-between">
                      <ul className="flex flex-col space-y-3 md:space-y-1">
                        <li className="flex flex-col md:flex-row lg:flex-row space-y-2 space-x-3 items-center">
                          <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:h-2 lg:w-2 lg:p-1"></div>
                          <p className=" text-sm sm:text-base lg:text-lg">
                            Career and business resources (courses & Community)
                          </p>
                        </li>
                        <li className="flex flex-col md:flex-row lg:flex-row space-y-2 space-x-3 items-center">
                          <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:w-2 lg:h-2 lg:p-1"></div>
                          <p className="text-sm sm:text-base lg:text-lg">Guidance and support</p>
                        </li>
                        <li className="flex flex-col md:flex-row lg:flex-row  space-y-2 space-x-3 items-center">
                          <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 lg:w-2 lg:h-2 lg:p-1"></div>
                          <p className=" text-sm sm:text-base lg:text-lg">
                            Ongoing assessment and refinement
                          </p>
                        </li>
                      </ul>
                    </div>
                    <Image
                      src="/assets/Frame 89.png"
                      width={150}
                      height={150}
                      priority
                      alt="DiscoverFit"
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverFit;
