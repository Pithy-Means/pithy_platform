import React from 'react';
import Image from 'next/image';
import { FaRegClock } from "react-icons/fa";
import { VscFileSubmodule } from "react-icons/vsc";

interface Course {
  id: number;
  title: string;
  duration: string;
  modules: number;
  image: string;
}

interface OtherCoursesProps {
  courses: Course[];
}

const OtherCourses: React.FC<OtherCoursesProps> = ({ courses }) => {
  return (
    <div className="bg-white text-black shadow-md rounded-lg p-5 mb-8 mx-4 bg-t-green-600 w-full">
      <h2 className="text-lg font-semibold mb-4 text-green-600">Other Courses</h2>
      <p className="text-black-500 mb-5">These Could Also Interest You</p>
      <div>
        {courses.map((course) => (
          <div key={course.id} className="flex items-center mb-4 border-b pb-4">
            <div className="relative w-24 h-16 mr-4">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-md">
                <span className="text-white font-semibold text-sm">▶️</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{course.title}</h3>
              <div className="flex items-center text-black-500 text-xs mt-1">
                <span className="mr-3 flex items-center gap-1">
                  <FaRegClock size={20} className='text-green-600'/>
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                <VscFileSubmodule size={20} className='text-green-600'/>
                  {course.modules} Modules
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherCourses;
