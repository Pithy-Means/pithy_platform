import React from 'react';
import Image from 'next/image';

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
    <div className="bg-white shadow-md rounded-lg p-5 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-green-600">Other Courses</h2>
      <p className="text-gray-500 mb-5">These Could Also Interest You</p>
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
              <div className="flex items-center text-gray-500 text-xs mt-1">
                <span className="mr-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-green-600 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13h1v6h-1zm0 8h1v2h-1z" />
                  </svg>
                  {course.duration}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-600 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h12v2H6V6zm0 6h12v2H6v-2zm0 6h12v2H6v-2z" />
                  </svg>
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
