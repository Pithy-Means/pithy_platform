import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Image from "next/image";

const Whatwegive = () => {
  return (
    <div className="p-10 bg-white">
      <div className="flex flex-col space-y-4 lg:items-start items-center">
        <h1 className="text-lg  text-[#5AC35A] md:text-center font-extrabold capitalize">
          WHAT WE GIVE YOU
        </h1>

        {/* For larger screens, show this */}
        <div className="hidden lg:flex space-x-2 items-center">
          <h1 className="py-2 text-2xl text-black font-extrabold capitalize">
            Unlock Your Potential{" "}
            <span className="mx-4 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
            Future{" "}
            <span className="mx-4 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
            Finance with
          </h1>
          <div className="flex space-x-2 items-center">
            <div className="flex flex-col pt-[10px]">
              <h1 className="text-xl text-[#5AC35A] font-extrabold uppercase">
                Pithy means
              </h1>
              <Image
                src="/assets/green-line.png"
                alt="line"
                width={40}
                height={40}
                priority
                className="object-cover w-full"
              />
            </div>
          </div>
        </div>

        {/* For smaller screens, show this */}
        <div className="flex lg:hidden flex-col space-y-4 items-center">
          <h1 className="text-[14px] text-black md:text-xl font-extrabold capitalize text-center">
            Unlock your potential
            <span className="mx-4 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
            Future
            <span className="mx-4 bg-gradient-to-t from-[#5AC35A] to-[#00AE76] h-1.5 w-1.5 rounded-full inline-block"></span>
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

        <p className="capitalize text-black text-center md:text-left text-xl">
          avoid costly mistakes and find your perfect fit
        </p>
        <Button className="text-white bg-gradient-to-r from-[#5AC35A] to-[#00AE76] w-fit capitalize md:text-xl">
          Start your journey
        </Button>

        <div className="flex flex-wrap justify-between py-6 w-full">
          <Card className="bg-white w-full sm:w-72 rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-2">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/briefcase-04.png"
                  alt="briefcase"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl">
                find your ideal path
              </h1>
              <p className="text-black capitalize text-center md:text-lg">
                Discover suitable study, professional, or business areas
                tailored to your strengths.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72 rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-2">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/cancel-circle.png"
                  alt="cancel"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl">
                avoid costly mistakes
              </h1>
              <p className="text-black capitalize text-center md:text-lg">
                Minimize risks and wasted time and resources.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72 rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-2">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/strike - stroke.png"
                  alt="strike"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl">
                Boost confidence
              </h1>
              <p className="text-black capitalize text-center md:text-lg">
                Ensure success in your chosen path.
              </p>
            </div>
          </Card>

          <Card className="bg-white w-full sm:w-72 rounded drop-shadow-2xl border-none">
            <div className="flex flex-col items-center px-4 py-6 space-y-2">
              <div className="relative bg-gradient-to-r from-[#5AC35A] to-[#00AE76] h-8 w-8 rounded-tl-3xl rounded md:h-14 md:w-14">
                <Image
                  src="/assets/square-lock-02.png"
                  alt="secure"
                  width={40}
                  height={40}
                  className="absolute top-[-10px] left-[-10px]"
                />
              </div>
              <h1 className="text-lg text-black font-extrabold capitalize text-center md:text-xl">
                Secure your future
              </h1>
              <p className="text-black capitalize text-center md:text-lg">
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
