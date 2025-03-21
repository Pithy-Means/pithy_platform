import React from "react";
import CourseView from "@/components/courseView";

const CoursePage = () => {
  return (
    <div className="flex h-full">
      <div className="w-full no-scrollbar">
        <div className="flex items-center justify-between">
          <CourseView />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
