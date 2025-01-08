"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Courses } from "@/types/schema";
import { useRouter } from "next/navigation";

interface CourseListProps {
  courses: Courses[];
}

const CourseList: React.FC<CourseListProps> = ({ courses }) => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const handleViewMore = (course: Courses) => {
    if (course.locked) {
      setModalMessage("Please complete the payment to access this course.");
    } else {
      router.push(`/dashboard/courses/${course.course_id}`);
    }
  };
  return (
    <div className="flex flex-col gap-6 px-8 py-4 max-w-full">
      {courses.map((course) => (
        <div
          key={course.course_id}
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
              {course.locked ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <p className="text-red-600 font-bold text-lg mb-2">
                    This course is locked.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Please complete the payment to access course details.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setModalMessage(
                        "Please complete the payment to access this course."
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Pay Now
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                  {/* Price */}
                  <div className="text-sm font-medium text-green-600 whitespace-nowrap">
                    {course.price ? `${course.price} UGX` : "Free"}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewMore(course)}
                    className="text-black/85 font-semibold text-base hover:border rounded-md hov:bg-green-600/100 transition px-2 py-1"
                  >
                    View more
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium text-gray-800">{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalMessage(null)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
