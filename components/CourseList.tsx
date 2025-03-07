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
  const { isCoursePurchased } = useCourseStore();
  const { user } = useAuthStore((state) => state);

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
    <div className="flex flex-col gap-6 px-8 py-4 w-full">
      {courses.map((course) => {
        // Check if course is purchased by current user
        const isEnrolled = isCoursePurchased(user?.user_id, course.course_id);
        
        // Determine if this course should be displayed as locked
        const shouldLockCourse = !isEnrolled && user?.paid === false;
        
        return (
          <div
            key={course.course_id}
            className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4"
          >
            {/* Image and Title/Description */}
            <div className="flex items-center gap-6">
              {/* Title and Description */}
              <div className="flex flex-col">
                {shouldLockCourse ? (
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
                ) : (
                  <div className="flex items-center gap-6">
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
                    <div className="flex flex-col gap-2">
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
                    </div>
                  </div>
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