import React from "react";
import Image from "next/image";
import { IoIosPeople } from "react-icons/io";

const communty = () => {
  return (
    <div className="flex flex-col bg-white  text-black  justify-start rounded-lg w-full ">
      <div>
        <p className="text-lg font-bold flex justify-start my-3 px-2">
          Community
        </p>
      </div>
      <div className="flex flex-row gap-4 items-center mx-2  mb-10">
        <Image
          src="/assets/person_feedback.png"
          width={50}
          height={50}
          alt="person"
          className=" rounded-lg "
        />
        <div className="flex flex-col">
          <p className="text-base">The wakanda entrepreneurs</p>
          <div className="flex flex-row items-center gap-1">
            <IoIosPeople size={20} />
            <p>Members: 242</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default communty;
