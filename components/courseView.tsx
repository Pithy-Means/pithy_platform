"use client";
import React, { useState, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { LiaThListSolid } from "react-icons/lia";
import CourseCard from './CourseCard';
import {getData} from '@/utils/apiUtils';



const CourseView: React.FC = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getData();
      setCourses(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching courses:", error);
      setError("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses ...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex flex-col bg-white  text-black px-6 justify-center h-10 p-4 m-6">
        <div className="flex justify-between">
          <div>
            <p className="text-lg">All Courses</p>
          </div>
          <div className="flex flex-row gap-10 items-center">
            <div>
              <LiaThListSolid size={30} className="text-green-600 text-fill" />
            </div>
            <div>
              <FaListUl size={20} className="" />
            </div>
          </div>
        </div>
      </div>

      <CourseCard courses={courses} />
    </div>
  );
};

export default CourseView;
