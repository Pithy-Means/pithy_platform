import { Card } from "./ui/card";
import { ArrowLeft, ArrowDownLeft } from "lucide-react";
import TitleDot from "./TitleDot";

const arraybutton = [
  { name: "general" },
  { name: "assement & results" },
  { name: "pricing & payment" },
  { name: "technical issues" },
  { name: "partnership & affiliates" },
  { name: "support" },
];

const FreqAskeQuestion = () => {
  return (
    <div className="px-10 py-4 bg-white">
      <div className="flex flex-col space-y-4 lg:items-start items-center">
        <TitleDot title="Frequently asked questions" className="md:text-3xl"/>
        <p className="capitalize text-black lg:text-start text-center md:text-lg lg:text-lg xl:text-xl 4k:text-2xl">
          Get answers to your questions about pithy means
        </p>
        <div className="w-full max-w-full overflow-x-auto">
          <div className="flex space-x-4 items-center scroll-scroll-smooth snap-mandatory snap-x md:text-lg">
            {arraybutton.map((arr, index) => (
              <button
                key={index}
                className="px-4 py-2 text-black border border-black rounded capitalize snap-center whitespace-nowrap"
              >
                {arr.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white p-5">
            <div className="flex justify-between py-2 items-center">
              <h3 className=" md:text-lg lg:text-lg xl:text-xl 4k:text-2xl text-[14px] text-black capitalize font-extrabold">
                what is pithy means?
              </h3>
              <div className="lg:bg-[#5AC35A] lg:p-1 p-0 lg:rounded-full rounded-none bg-none">
                <ArrowLeft size={16}/>
              </div>
            </div>
            <p className="text-black capitalize lg:text-base text-[12px] md:text-lg">
              Pithy means is career and business assessment platform helping
              students, professionals, and business adventurers find their most
              suitable study, professional, or business areas.
            </p>
          </Card>

          <Card className="bg-white pt-5 px-5 row-span-1/2 hidden lg:block">
            <div className="flex justify-between py-1">
              <h3 className="md:text-lg lg:text-lg xl:text-xl 4k:text-2xl text-[14px] text-black capitalize font-extrabold">
                how does pithy means work?
              </h3>
              <div className="bg-[#5AC35A] rounded-full">
                <ArrowLeft />
              </div>
            </div>
            <p className="text-black capitalize lg:text-base text-[12px] md:text-lg">
              Take our online assessment, receive personalized results, and
              explore suitable career and business paths.
            </p>
          </Card>

          <Card className="bg-white p-5">
            <div className="flex justify-between py-1">
              <h3 className="md:text-lg lg:text-lg xl:text-xl 4k:text-2xl text-[14px] text-black capitalize font-extrabold">
                Is pithy means trustworthy?
              </h3>
              <div className="border p-1 rounded-full">
                <ArrowDownLeft className="text-[#5AC35A]" />
              </div>
            </div>
          </Card>

          <Card className="bg-white p-5 hidden lg:block">
            <div className="flex justify-between py-1">
              <h3 className="md:text-lg lg:text-lg xl:text-xl 4k:text-2xl text-[14px] text-black capitalize font-extrabold">
                is pithy means only in the USA and Uganda?
              </h3>
              <div className="border p-1 rounded-full">
                <ArrowDownLeft className="text-[#5AC35A]" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreqAskeQuestion;
