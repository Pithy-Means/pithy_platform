import React, { Suspense } from "react";
import CourseView from "@/components/courseView";

const page = () => {
  return (
    <div className="flex h-screen">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <CourseView />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
