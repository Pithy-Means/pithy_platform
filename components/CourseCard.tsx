"use client";

import React from "react";
import Image from "next/image";
import { MdAccessTimeFilled } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Courses } from "@/types/schema";
import PaymentButton from "./PaymentButton";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCourseStore } from "@/lib/store/courseStore";
import { CircleDollarSign } from "lucide-react";

const CourseCard: React.FC<{ courses: Courses[] }> = ({ courses }) => {
  const router = useRouter();
  const { user } = useAuthStore((state) => state);
  const { isCoursePurchased } = useCourseStore();

  // Sync courses on component mount
  React.useEffect(() => {
    if (user?.user_id) {
      // This would be a good place to sync with server on initial load
      const { syncPurchasesFromServer } = useCourseStore.getState();
      syncPurchasesFromServer(user.user_id);
    }
  }, [user?.user_id]);

  const handleViewMore = (course: Courses) => {
    router.push(`/dashboard/courses/${course.course_id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {courses.map((course) => {
        // Check if this course is purchased by the current user
        const isEnrolled = isCoursePurchased(user?.user_id, course.course_id);
        
        // Determine if this course should be displayed as locked
        const shouldLockCourse = !isEnrolled && user?.paid === false;
        
        return (
          <div
            key={course.course_id}
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full flex flex-col"
            style={{ minHeight: "350px" }}
          >
            <div className="py-4 px-6 flex flex-col justify-between flex-grow">
              {/* Check if the course is locked */}
              {shouldLockCourse ? (
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
                <>
                  {/* Display course details if enrolled or unlocked */}
                  <div className="flex flex-col space-y-1 border-b-slate-300 border-b-4">
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={800}
                      height={400}
                      unoptimized
                      className="object-cover w-full h-72"
                    />
                    <p className="text-black font-bold text-lg mb-2">
                      {course.title}
                    </p>
                    <div className="flex items-center justify-between pb-3">
                      <p className="text-gray-600 flex gap-1 items-center font-bold text-lg">
                        <MdAccessTimeFilled
                          size={20}
                          className="text-gray-600 gap-1"
                        />
                        {course.duration}
                      </p>
                      <p className="text-gray-600 flex gap-2 font-bold text-lg items-center">
                        <FaBookReader size={20} className="text-gray-600" />
                        {course.students?.length || 0} Learners
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center mt-4">
                    <p className="text-green-600 text-lg font-bold">
                      <CircleDollarSign size={20} className="text-green-600" />
                      {course.price} USD
                    </p>
                    <button
                      type="button"
                      onClick={() => handleViewMore(course)}
                      className="hover:text-black/85 hover:bg-green-100 font-bold text-lg hover:border rounded-md transition px-4 py-2 bg-green-600 text-white"
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
    </div>
  );
};

export default CourseCard;