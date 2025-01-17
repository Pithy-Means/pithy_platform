import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-start space-x-4 bg-white shadow rounded-lg p-4"
        >
          {/* Profile Picture Placeholder */}
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>

          {/* Content Placeholder */}
          <div className="flex-1 space-y-4 py-1">
            {/* Name Placeholder */}
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>

            {/* Post Text Placeholder */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>

            {/* Action Buttons Placeholder */}
            <div className="flex space-x-4 pt-2">
              <div className="h-4 bg-gray-300 rounded w-10"></div>
              <div className="h-4 bg-gray-300 rounded w-10"></div>
              <div className="h-4 bg-gray-300 rounded w-10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
