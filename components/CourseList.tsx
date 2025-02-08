"use client";

import React from "react";
import Image from "next/image";
import { Courses } from "@/types/schema";
import { useRouter } from "next/navigation";
import PaymentButton from "./PaymentButton";
import { useCourseStore } from "@/lib/store/courseStore";
import { useAuthStore } from "@/lib/store/useAuthStore";

const CourseList: React.FC<{ courses: Courses[] }> = ({ courses }) => {
  const router = useRouter();
  const { isLocked, setLocked } = useCourseStore();
  const { user } = useAuthStore((state) => state);

  const handleViewMore = (course: Courses) => {
    router.push(`/dashboard/courses/${course.course_id}`);
  };

  const studentName = user?.lastname + " " + user?.firstname;

  return (
    <div className="flex flex-col gap-6 px-8 py-4 max-w-full">
      {courses.map((course) => {
        const isEnrolled =
          course.students?.find((name) => name === studentName) &&
          course.student_email === user?.email;
        if (isEnrolled) setLocked(false);
        return (
          <div
            key={course.course_id}
            className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4"
          >
            {/* Image and Title/Description */}
            <div className="flex items-center gap-6">
              {/* Image */}

              {/* Title and Description */}
              <div className="flex flex-col">
                {isLocked === true || !isEnrolled ? (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <p className="text-red-600 font-bold text-lg mb-2">
                      This course is locked.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Please complete the payment to access course details.
                    </p>
                    <PaymentButton
                      course={{
                        course_id: course.course_id,
                        title: course.title,
                        price: course.price,
                      }}
                    />
                  </div>
                ) :  (
                  <>
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
        );
      })}
    </div>
  );
};

export default CourseList;
