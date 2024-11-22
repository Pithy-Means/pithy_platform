import React from "react";
import Image from "next/image";
import RecommendationTopics from "./RecommendationTopics";
import TraitsAndWorkstyle from "./TraitsAndWorkstyle";
import CareerValues from "./CareerValues";

const majorsList = ["Computer Science", "Engineering", "Data Analysis"];
const sampleTraits = [
  "Collaborative",
  "Result Driven",
  "Extraverted",
  "Intuitive",
  "Judging",
];
const valueList = [""];
const interests = [""];

const PersonSidebar = () => {
  return (
    <div className="flex flex-col bg-white w-full text-black  justify-start h-[calc(100vh-64px)] overflow-y-auto mt-6 mr-4 rounded-lg overflow-hidden">
      <div className="bg-green-500 h-20 rounded-t-lg w-full"></div>
      <div className="flex flex-col items-center justify-center gap-4 bg-white">
        <div className="flex flex-col justify-center items-center -mt-10">
          <Image
            src="/assets/person_feedback.png"
            width={80}
            height={80}
            alt="person"
            className=" rounded-lg "
          />
          <div className="text-black items-center flex flex-col ">
            <p className=" text-lg">Bandoyake Arnaud</p>
            <button className="text-base bg-gray-400 rounded-sm px-2">
              Student
            </button>
          </div>
        </div>
        <div>
          <RecommendationTopics majors={majorsList} />
        </div>
        <div>
          <TraitsAndWorkstyle traits={sampleTraits} />
        </div>
        <div>
          <CareerValues values={valueList} interests={interests} />
        </div>
      </div>
    </div>
  );
};

export default PersonSidebar;
