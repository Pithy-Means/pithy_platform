"use client";

import React from "react";
import Image from "next/image";
import { Courses } from "@/types/schema";
import Link from "next/link";

interface CourseListProps {
  courses: Courses[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  return (
    <div className="flex flex-col gap-6 px-8 py-4 max-w-full">
      {courses.map((course) => (
        <Link
          href={`/dashboard/courses/${course.course_id}`}
          key={course.course_id}
        >
          <div
            className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4"
          >
            {/* Image and Title/Description */}
            <div className="flex items-center gap-6">
              {/* Image */}
              <div className="flex-shrink-0">
                <Image
                  src={course.image}
                  alt={course.title}
                  width={120}
                  height={120}
                  unoptimized
                  className="object-cover rounded-lg w-[220px] h-[120px]"
                />
              </div>
              {/* Title and Description */}
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">
                  {course.title}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {course.description}
                </p>
                {/* Price */}
                <div className="text-sm font-medium text-green-600 whitespace-nowrap">
                  {course.price ? `$${course.price}` : "Free"}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CourseList;
