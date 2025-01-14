"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Courses } from "@/types/schema";
import { UserContext } from "@/context/UserContext";
import PaymentButton from "./PaymentButton";

interface CourseCardProps {
  selectedCourse: Courses[];
}

const CourseCard: React.FC<CourseCardProps> = ({ selectedCourse }) => {
  const router = useRouter();
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const { user } = useContext(UserContext);

  const handleViewMore = (course: Courses) => {
    // Check if the user is in the list of students based on their name or email
    const isStudent = user?.name && course.students?.includes(user.name);
    const isStudentEmail =
      user?.email && course.student_email?.includes(user.email);

    // If the user is either not in the list of students by name or email, lock the course
    if (!isStudent && !isStudentEmail) {
      setModalMessage("Please complete the payment to access this course.");
    } else {
      router.push(`/dashboard/courses/${course.course_id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {selectedCourse.map((course) => {
        const student = course.students?.find(
          (student) => student === user?.name
        );

        const studentEmail = course.student_email?.find(
          (student) => student === user?.email
        );
        const isLocked = !student && !studentEmail;
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
                  <p className="text-gray-600 mb-4">{modalMessage}</p>
                  <PaymentButton />
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
              )}
            </div>
          </div>
        );
      })}

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
