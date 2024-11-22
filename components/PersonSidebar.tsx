"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import RecommendationTopics from "./RecommendationTopics";
import TraitsAndWorkstyle from "./TraitsAndWorkstyle";
import CareerValues from "./CareerValues";
import { getLoggedInUser } from "@/lib/actions/user.actions";

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
  const [user, setUser] = useState<{
    user_id: string;
    firstname: string;
    lastname: string;
    categories: string;
  } | null>(null);

  const getUser = async () => {
    const loggedUser = await getLoggedInUser();
    setUser(loggedUser);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="flex flex-col bg-white w-full text-black  justify-start h-[calc(100vh-64px)] overflow-y-auto mt-6 mr-4 rounded-lg overflow-hidden">
      <div className="bg-green-500 h-20 rounded-t-lg w-full"></div>
      <div className="flex flex-col items-center justify-center gap-4 bg-white">
        {user && (
          <div className="flex flex-col justify-center items-center -mt-10">
            <div className="bg-white rounded-full p-5">
              <p className="text-black text-2xl font-extrabold">
                {user.firstname.charAt(0)}
              </p>
            </div>
            <div className="text-black items-center flex flex-col space-y-2">
              <p className=" text-lg">
                {user.firstname} {user.lastname}
              </p>
              <button className="text-base bg-gray-400 rounded-sm px-2 py-1">
                {user.categories}
              </button>
            </div>
          </div>
        )}
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
