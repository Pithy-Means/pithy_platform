import React, { Suspense } from "react";
import CourseView from "@/components/courseView";

const CoursePage = () => {
  return (
    <div className="flex h-full">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <CourseView />
        </Suspense>
      </div>
    </div>
  );
};

export default CoursePage;
