import { Button } from "./ui/button";
import TitleDot from "./TitleDot";
import { Card } from "./ui/card";
import Image from "next/image";

const Whatwegive = () => {
  return (
    <div className="p-10 bg-white">
      <div className="flex flex-col space-y-4 lg:items-start items-center ">
        <h1 className="text-base text-[#5AC35A] md:text-center md:text-lg lg:text-2xl xl:text-2xl 4k:text-6xl ">
          WHAT WE GIVE YOU
        </h1>

        {/* For larger screens, show this */}
        <div className="hidden lg:flex space-x-2 items-center ">
          <TitleDot title={"unlock your potential"}/>
          <TitleDot title={"future"} />
          <div className="flex space-x-2 items-center ">
            <h1 className="text-base  text-black font-extrabold capitalize lg:text-xl xl:text-xl 4k:text-5xl">
              finance with
            </h1>
            <div className="flex flex-col items-start pt-4 lg:w-72 xl:w-96 4k:w-[28rem] space-y-2">
              <h1 className="text-base text-[#5AC35A] font-extrabold uppercase lg:text-lg xl:text-xl 4k:text-4xl">
                Pithy means
              </h1>
              <Image
                src="/assets/green-line.png"
                alt="line"
                width={40}
                height={40}
                priority
                className="object-cover lg:w-28 lg:h-2 xl:w-34 xl:h-2 4k:w-44 4k:h-4"
              />
            </div>
          </div>
        </div>

        {/* For smaller screens, show this */}
        <div className="flex lg:hidden flex-col space-y-4 items-center">
          <h1 className="text-[14px] text-black md:text-xl font-extrabold capitalize text-center">
            Unlock your potential
            <span className="mx-2 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
            Future
            <span className="mx-2 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
            Finance with
          </h1>
          <div className="flex flex-col">
            <h1 className="text-[14px] text-[#5AC35A] font-extrabold uppercase md:text-xl">
              Pithy means
            </h1>
            <Image
              src="/assets/green-line.png"
              alt="line"
              width={40}
              height={40}
              className="object-contain w-24"
            />
          </div>
        </div>

        <p className="capitalize text-black text-center md:text-left text-base md:text-lg lg:text-lg xl:text-lg 4k:text-5xl 4k:py-4">
          avoid costly mistakes and find your perfect fit .
        </p>
        <Button className="text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit capitalize md:text-base lg:text-lg xl:text-xl 4k:text-5xl 4k:py-10">
          Start your journey
        </Button>

        <div className="flex flex-wrap justify-center md:justify-evenly lg:justify-evenly lg:gap-8  xl:justify-between xl:gap-10 xl:flex-nowrap 4k:gap-12 gap-6 py-6">
          <Card className="bg-white w-full sm:w-72 lg:w-80 xl:w-72 4k:w-[28rem] rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-2 lg:space-y-6">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 lg:h-16 lg:w-16 xl:h-14 xl:w-14 4k:h-24 4k:w-24 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/briefcase-04.png"
                  alt="briefcase"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px] lg:top-[-15px] lg:left-[-15px] xl:top-[-20px] xl:left-[-20px] 4k:top-[-24px] 4k:left-[-24px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl lg:text-xl xl:text-xl 4k:text-4xl">
                find your ideal path
              </h1>
              <p className="text-black capitalize text-center text-base md:text-lg lg:text-lg xl:text-lg 4k:text-3xl">
                Discover suitable study, professional, or business areas
                tailored to your strengths.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72 lg:w-80 xl:w-72 4k:w-[28rem] rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-4 lg:space-y-6">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 lg:h-16 lg:w-16 xl:h-14 xl:w-14 4k:h-24 4k:w-24 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/cancel-circle.png"
                  alt="cancel"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px] lg:top-[-15px] lg:left-[-15px] xl:top-[-20px] xl:left-[-20px] 4k:top-[-24px] 4k:left-[-24px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl lg:text-lg xl:text-xl 4k:text-4xl">
                avoid costly mistakes
              </h1>
              <p className="text-black capitalize text-center text-base md:text-lg lg:text-lg xl:text-lg 4k:text-3xl">
                Minimize risks and wasted time and resources.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72 lg:w-80 xl:w-72 4k:w-[28rem] rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-4 lg:space-y-6">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 lg:h-16 lg:w-16 xl:h-14 xl:w-14 4k:h-24 4k:w-24 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/strike - stroke.png"
                  alt="strike"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px] lg:top-[-15px] lg:left-[-15px] xl:top-[-20px] xl:left-[-20px] 4k:top-[-24px] 4k:left-[-24px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl lg:text-lg xl:text-xl 4k:text-4xl">
                Boost confidence
              </h1>
              <p className="text-black capitalize text-center md:text-lg lg:text-lg xl:text-lg 4k:text-3xl" >
                Ensure success in your chosen path.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72  lg:w-80 xl:w-72 4k:w-[28rem] rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-4 lg:space-y-6">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 lg:h-16 lg:w-16 xl:h-14 xl:w-14 4k:h-24 4k:w-24 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/square-lock-02.png"
                  alt="secure"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px] lg:top-[-15px] lg:left-[-15px] xl:top-[-20px] xl:left-[-20px] 4k:top-[-24px] 4k:left-[-24px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl md:text-xl lg:text-lg xl:text-xl 4k:text-4xl">
                Secure your future
              </h1>
              <p className="text-black capitalize text-center md:text-lg lg:text-lg xl:text-lg 4k:text-3xl">
                Make informed decisions for yourself and your collaborators.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Whatwegive;
