import Image from "next/image";

const items = [
  {
    id: 1,
    title: "Take A Course",
    description: "Be guided through Our Module",
    image: "/assets/Frame 87.png",
  },
  {
    id: 2,
    title: "Take Our Guidance",
    description: "Answer a series of questions",
    image: "/assets/Frame 87.png",
  },
  {
    id: 3,
    title: "Get personalized results",
    description: "receive a customized report",
    image: "/assets/green.png",
  },
  {
    id: 4,
    title: "Explore and take action",
    description: "review your results & explore recommendations",
    Image: "/assets/report.png",
  },
];

export default function RandomGridCards() {
  return (
    <div className="flex justify-between items-center space-y-4 w-full md:flex-wrap sm:flex-nowrap flex-col md:flex-row my-8">
      {items.map((item) => (
        <div
          key={item.id}
          className={`bg-white shadow-lg rounded-lg border border-gray-200 w-64 md:w-72 lg:w-72 xl:w-96 4k:w-[32rem]`}
        >
          <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
            <h3 className="text-lg font-extrabold text-black capitalize">
              {item.title}
            </h3>
          </div>
          <div className="flex items-center flex-col space-y-2 py-4">
            <p className="capitalize text-black leading-relaxed">
              {item.description}
            </p>
            <Image
              src={item.image || "/assets/Frame 87.png"}
              alt="Frame"
              width={60}
              height={60}
              unoptimized
              className=""
              style={{ height: "50px", width: "30%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
