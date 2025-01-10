"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Courses } from "@/types/schema";

interface CourseCardProps {
  courses: Courses[];
}

const CourseCard: React.FC<CourseCardProps> = ({ courses }) => {
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      {courses.map((course: Courses) => (
        <div
          key={course.course_id}
          className="bg-white shadow-lg rounded-lg overflow-hidden w-full flex flex-col"
          style={{ minHeight: "350px" }}
        >
          <Image
            src={course.image}
            alt={course.title}
            width={1200}
            height={500}
            unoptimized
            className="object-cover w-full h-48"
          />
          <div className="py-4 px-6 flex flex-col justify-between flex-grow">
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
                  onClick={() => setModalMessage("Please complete the payment to access this course.")}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Pay Now
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col space-y-1 border-b-slate-300 border-b-4">
                  <p className="text-black font-bold text-lg mb-2">
                    {course.title}
                  </p>
                  <div className="flex items-center justify-between pb-3">
                    <p className="text-gray-600 flex gap-1 items-center">
                      <MdAccessTimeFilled
                        size={20}
                        className="text-orange-600 gap-1"
                      />
                      {course.duration}
                    </p>
                    <p className="text-gray-600 flex gap-2">
                      <FaBookReader size={20} className="text-orange-600" />
                      {course.students} Learners
                    </p>
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center">
                  <p className="text-green-600 text-base">{course.price} UGX</p>
                  <button
                    type="button"
                    onClick={() => handleViewMore(course)}
                    className="text-black/85 font-semibold text-base hover:border rounded-md hov:bg-green-600/100 transition px-2 py-1"
                  >
                    View more
                  </button>
                </div>
              </>
            )}
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

export default CourseCard;
