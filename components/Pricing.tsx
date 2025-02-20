import { Card } from "./ui/card";
import TitleDot from "./TitleDot";
import { Button } from "./ui/button";
import Image from "next/image";

const Pricing = () => {
  return (
    <div className="bg-white px-10 pb-4">
      <div className="flex flex-col space-y-4 lg:items-start items-center mb-6">
        <TitleDot title={"Pricing"} className="md:text-3xl md:pt-4"/>
        <p className="capitalize text-black md:text-xl">One time payment</p>
      </div>
      <Card className="bg-white flex flex-col lg:flex-row md:space-x-8 space-y-8 lg:space-y-0 p-6 lg:p-10 items-center border border-black/10 rounded-md drop-shadow-2xl shadow lg:w-full w-fit mx-auto">
        <div className="bg-[#37BB65] rounded-lg">
          <Image
            src="/assets/C2_1.png.png"
            width={200}
            height={400}
            alt="Gentle"
            priority
            className="w-full md:w-auto px-10 relative top-[-10px] md:top-[-40px] drop-shadow-[0_150px_25px_rgba(0,0,0,0.90)]"
            style={{ height: "370px", width: "100%" }}
          />
        </div>
        <div className="flex flex-col space-y-4 w-full lg:items-start items-center md:w-auto text-center md:text-left">
          <div className="text-black font-extrabold capitalize md:text-3xl">
            Only For you
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 items-center">
              <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 md:h-2 md:w-4 md:p-1.5"></div>
              <p className="capitalize text-black md:text-xl font-bold">
                Get access to all the courses and resources in period of 3 Months.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 items-center">
              <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 md:h-2 md:w-4 md:p-1.5"></div>
              <p className="capitalize text-black md:text-xl font-bold">
                Get access to all the courses, Job opportunities, Scholarships and Fundings.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row space-y-2 lg:space-x-2 items-center">
              <div className="border-2 border-[#5AC35A] rotate-45 h-1 w-1 p-0.5 md:h-2 md:w-4 md:p-1.5"></div>
              <p className="capitalize text-black md:text-xl font-bold">
                refering to a friend and get 10% discount on our course if the refered buy our course.
              </p>
            </div>
            <Button className="text-white md:text-xl bg-gradient-to-r from-[#5AC35A] to-[#00AE76] lg:mx-0 mx-auto w-fit">
              Get Started
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Pricing;
