// import React from "react";
// import { Card } from "./ui/card";
// import Image from 'next/image';

// const AssCards = () => {
//   return (
//     <div className="flex flex-col lg:flex-row space-y-6 items-center lg:space-y-0 lg:space-x-6 xl:space-y-8 4k:space-y-12 ">
//       <div className="flex  items-center ">
//         <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12 4k:space-x-20  ">
//           <div className="text-center block lg:hidden">
//             <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
//               1
//             </div>
//           </div>
//           <Card className="bg-white w-64 md:w-72 lg:w-72 xl:w-72 4k:w-[32rem] 4k:relative 4k:-right-20 ">
//             <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
//               <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize">
//                 Take our guidance
//               </h3>
//             </div>
//             <div className="flex items-center flex-col space-y-2 py-4">
//               <p className="capitalize text-black md:text-lg lg:text-xl xl:text-lg 4k:text-4xl">
//                 Answer a series of questions
//               </p>
//               <Image
//                 src="/assets/Frame 87.png"
//                 alt="Frame"
//                 width={60}
//                 height={60}
//                 priority
//                 className=""
//                 style={{ height: "50px", width: "30%" }}
//               />
//             </div>
//           </Card>
//           <div className="text-center lg:block hidden">
//             <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
//               1
//             </div>
//           </div>
//           {/* Arrow for Desktop*/}
//           <div className="block lg:hidden">
//             <Image
//               src="/assets/green.png"
//               alt="Take"
//               width={20}
//               height={100}

//               className=" "
//             />
//           </div>
//           <div className="text-center block md:block lg:hidden xl:hidden 4x:hidden">
//             <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center ">
//               2
//             </div>
//           </div>
//         </div>
//         <Image
//           src="/assets/Arrow2.png"
//           alt="Join"
//           width={150}
//           height={100}
//           className="mb-[300px] md:mt-20 lg:block hidden lg:mb-[-10px] 4k:relative 4k:-right-20"
//         />
//       </div>
//       <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12">
//         <Card className="bg-white w-64 md:w-72  xl:w-72 4k:w-[32rem] 4k:-mt-32 4k:-right-20 4k:relative">
//           <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
//             <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize first-line">
//               Take A Course
//             </h3>
//           </div>
//           <div className="flex items-center flex-col space-y-2 py-4">
//             <p className="capitalize text-black md:text-xl lg:text-xl xl:text-lg 4k:text-4xl">Be guided through Our Module</p>
//             <Image src="/assets/Frame 88.png"
//               alt="Frame"
//               width={60}
//               height={60}
//               priority
//               className=" "
//               style={{ height: "50px", width: "30%" }}
//             />
//           </div>
//         </Card>
//         <div className="text-center">
//           <Image
//             src="/assets/Arrow 3.png"
//             alt=""
//             width={150}
//             height={100}
//             className=" hidden lg:block relative -right-40 top-1/2 transform -translate-y-1/2 rotate-12 mt-[-32px] 4k:block 4k:-right-[24rem]"
//           />
//         </div>
//         <div className="block lg:hidden">
//           <Image src="/assets/green.png"
//             alt="Take"
//             width={20}
//             height={100}
//             priority
//             className=" lg:hidden block"
//           />
//         </div>
//         <div className="text-center block lg:hidden">
//           <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
//             2
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12">
//         <Card className="bg-white w-64 md:w-72  xl:w-72 4k:w-[32rem] 4k:-mt-32 4k:-right-20 4k:relative">
//           <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
//             <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize first-line:">
//               Get personalized results
//             </h3>
//           </div>
//           <div className="flex items-center flex-col space-y-2 py-4">
//             <p className="capitalize text-black md:text-xl lg:text-xl xl:text-lg 4k:text-4xl">receive a customized report</p>
//             <Image src="/assets/Frame 88.png"
//               alt="Frame"
//               width={60}
//               height={60}
//               priority
//               className=" "
//               style={{ height: "50px", width: "30%" }}
//             />
//           </div>
//         </Card>
//         <div className="text-center">
//           <Image
//             src="/assets/Arrow 3.png"
//             alt=""
//             width={150}
//             height={100}
//             className=" hidden lg:block relative -right-40 top-1/2 transform -translate-y-1/2 rotate-12 mt-[-32px] 4k:block 4k:-right-[24rem]"
//           />
//         </div>
//         <div className="block lg:hidden">
//           <Image src="/assets/green.png"
//             alt="Take"
//             width={20}
//             height={100}
//             priority
//             className=" lg:hidden block"
//           />
//         </div>
//         <div className="text-center block lg:hidden">
//           <div className="h-6 w-6 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-full p-4 text-white flex justify-center items-center text-center">
//             3
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-col items-center space-y-2 lg:space-y-6 xl:space-y-8 4k:space-y-12">
//         <Card className="bg-white w-64 md:w-972 xl:w-72 4k:w-[32rem] xl:ml-[6rem] 4k:relative 4k:-mt-18 4k:-right-32">
//           <div className="bg-gradient-to-r from-[#5AC35A] to-[#00AE76] rounded-t-sm px-4 py-2">
//             <h3 className="text-lg md:text-xl xl:text-2xl 4k:text-3xl font-extrabold text-black capitalize">
//               Explore and take action
//             </h3>
//           </div>
//           <div className="flex items-center flex-col space-y-2 py-4">
//             <p className="capitalize text-black md:text-xl lg:text-2xl xl:text-lg xl:px-2 4k:text-4xl">
//               review your results & explore recommendations
//             </p>
//             <Image src="/assets/Frame 89.png"
//               alt="Frame"
//               width={60}
//               height={60}
//               priority
//               className=""
//               style={{ height: "50px", width: "30%" }}
//             />
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AssCards;

import Image from 'next/image';

const items = [
  { id: 1, title: 'Take A Course', description: 'Be guided through Our Module', image: '/assets/Frame 87.png' },
  { id: 2, title: 'Take Our Guidance', description: 'Answer a series of questions', image: '/assets/Frame 87.png' },
  { id: 3, title: 'Get personalized results', description: 'receive a customized report', image: '/assets/green.png' },
  { id: 4, title: 'Explore and take action', description: 'review your results & explore recommendations', Image: '/assets/report.png' },
];

export default function RandomGridCards() {

  return (
    <div className="flex justify-between w-full flex-wrap my-8">
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
              src={item.image || '/assets/Frame 87.png'}
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
