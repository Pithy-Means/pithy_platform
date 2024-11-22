import OverView from "@/components/OverView";
import CourseView from "@/components/courseView";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-white/90">
        <div className="flex h-screen">
          <OverView>
            <div className="w-full">
              <CourseView />
            </div>
          </OverView>
        </div>
      </div>
    </div>
  );
};

export default page;
