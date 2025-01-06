import React from "react";
import Image from "next/legacy/image";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const SpecialMobile = () => {
  return (
    <div className="p-10 bg-white">
      <Card className="bg-[#61BC5B] flex flex-col items-center py-12 space-y-6 lg:w-full w-fit mx-auto px-6">
        {/* The main image container */}
        <div className="flex items-center justify-center relative lg:h-72 2xl:h-96 h-48">
          {/* First Image (woman.png) */}
          <Image
            src="/assets/woman.png"
            alt="Woman"
            width={200}
            height={300}
            objectFit="contain"
            priority
          />

          {/* Discount image positioned bottom-left of the first image */}
          <div className="absolute bottom-0 left-5 lg:left-0 w-16 h-16">
            <Image
              src="/assets/discount.png"
              alt="90% Discount"
              width={100}
              height={200}
              objectFit="contain"
              priority
            />
          </div>
        </div>
        <div className=" text-black flex flex-col items-center space-y-4">
          <h1 className="text-xl capitalize font-bold">special offer!</h1>
          <div className="flex flex-col space-y-4 items-center px-6 md:px-0">
            <p className="text-[14px] capitalize text-center">
              Join now and get up to <b>40%</b> discount globally
            </p>
            <p className="text-[14px] capitalize text-center">
              Ugandan resident: get additional <b>90%</b> discount through local
              partnership
            </p>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Button className="bg-black text-white capitalize flex-grow">
              Take the assessment
            </Button>
            <Button className="flex items-center space-x-2 bg-transparent text-black border-none outline-none hover:text-white">
              <span className="text-[14px]">Contact Us</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SpecialMobile;
