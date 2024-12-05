import React from "react";
import CourseView from "@/components/courseView";

const page = () => {
  return (
    <div>
      <div className="bg-white/90">
        <div className="flex h-screen">
            <div className="w-full">
              <CourseView />
            </div>
        </div>
      </div>
    </div>
  );
};

export default page;
