"use client";

import React, { useContext } from "react";
import RecommendationTopics from "./RecommendationTopics";
import CareerValues from "./CareerValues";
import { UserContext } from "@/context/UserContext";

const majorsList = ["Computer Science", "Engineering", "Data Analysis"];
const sampleTraits = [
  "Collaborative",
  "Result Driven",
  "Extraverted",
  "Intuitive",
  "Judging",
];
const valueList = ["Integrity", "Innovation", "Teamwork"];
const interests = ["Technology", "Science", "Art"];

const PersonSidebar = () => {

  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col bg-white w-full text-black justify-start overflow-y-auto mt-6 mr-4 rounded-lg overflow-hidden">
      <div className="bg-green-500 h-16 rounded-t-lg w-full"></div>
      <div className="flex flex-col items-center justify-center space-y-2 bg-white">
        {user && (
          <div className="flex flex-col justify-center items-center -mt-7">
            <div className="bg-white rounded-full p-2">
              <p className="text-black text-2xl font-extrabold">
                {user?.firstname?.charAt(0).toUpperCase() || ""}
              </p>
            </div>
            <div className="text-black items-center flex flex-col space-y-1">
              <span className="text-lg font-bold">
                {user.firstname} {user.lastname}
              </span>
              <button className="text-base bg-gray-400 rounded-sm px-2 py-1">
                {user?.categories?.charAt(0).toUpperCase()}
                {user?.categories?.slice(1)}
              </button>
            </div>
          </div>
        )}
        <div>
          <RecommendationTopics
            majors={majorsList}
            title={"Top Recommended Major"}
          />
        </div>
        <div>
          <RecommendationTopics
            majors={sampleTraits}
            title="Traits & Works Style"
          />
        </div>
        <div>
          <CareerValues values={valueList} interests={interests} />
        </div>
      </div>
    </div>
  );
};

export default PersonSidebar;
