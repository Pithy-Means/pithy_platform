"use client";

import React from "react";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Courses, UserInfo } from "@/types/schema";
import PaymentButton from "./PaymentButton";
import { useCourseStore } from "@/lib/store/courseStore";
import { useAuthStore } from "@/lib/store/useAuthStore";

const CourseCard: React.FC<{ courses: Courses[] }> = ({ courses }) => {
  const router = useRouter();
  const { isLocked, setLocked } = useCourseStore();
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  const handleViewMore = (course: Courses) => {
    router.push(`/dashboard/courses/${course.course_id}`);
  };

  const name = `${user?.lastname} ${user?.firstname}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {courses.map((course) => {
        const isStudent = course.students?.includes(name);
        const isStudentEmail = course.student_email?.includes(user?.email);
        const isEnrolled = isStudent && isStudentEmail;

        if (isLocked) setLocked(false);

        return (
          <div
            key={course.course_id}
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full flex flex-col"
            style={{ minHeight: "350px" }}
          >
            <Image
              src={course.image}
              alt={course.title}
              width={800}
              height={400}
              unoptimized
              className="object-cover w-full h-48"
            />
            <div className="py-4 px-6 flex flex-col justify-between flex-grow">
              {/* Check if the course is locked */}
              {isLocked ? (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <p className="text-red-600 font-bold text-lg mb-2">
                    This course is locked.
                  </p>
                  <PaymentButton
                    course={{
                      course_id: course.course_id,
                      title: course.title,
                      price: course.price,
                    }}
                  />
                </div>
              ) : (
                // If course is not locked and user is enrolled
                isEnrolled ? (
                  <>
                    {/* Display course details if enrolled */}
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
                          {course.students?.length || 0} Learners
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <p className="text-green-600 text-base">
                        {course.price} UGX
                      </p>
                      <button
                        type="button"
                        onClick={() => handleViewMore(course)}
                        className="text-black/85 font-semibold text-base hover:border rounded-md hov:bg-green-600/100 transition px-2 py-1"
                      >
                        View more
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <p className="text-red-600 font-bold text-lg mb-2">
                      You are not enrolled in this course.
                    </p>
                    <PaymentButton
                      course={{
                        course_id: course.course_id,
                        title: course.title,
                        price: course.price,
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CourseCard;
