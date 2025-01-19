"use client";

import React from "react";
import RecommendationTopics from "./RecommendationTopics";
import CareerValues from "./CareerValues";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserInfo } from "@/types/schema";

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

  const { user } = useAuthStore((state) => state as { user: UserInfo });

  return (
    <div className="flex flex-col bg-white w-full text-black justify-start overflow-y-auto rounded-lg overflow-hidden">
      <div className="bg-green-500 h-16 rounded-t-lg w-full"></div>
      <div className="flex flex-col px-4 space-y-2 bg-white">
        {user && (
          <div className="flex flex-col justify-center items-center -mt-7">
            <div className="bg-white rounded-full p-2">
              <p className="text-black text-2xl font-extrabold">
                {user?.user.firstname?.charAt(0).toUpperCase() || ""}
              </p>
            </div>
            <div className="text-black items-center flex flex-col space-y-1">
              <span className="text-lg font-bold">
                {user.user.firstname} {user.user.lastname}
              </span>
              <button className="text-base bg-gray-400 rounded-sm px-2 py-1">
                {user?.user.categories?.charAt(0).toUpperCase()}
                {user?.user.categories?.slice(1)}
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
