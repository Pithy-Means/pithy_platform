import React from "react";

const SkeletonLoader = () => {
  return (
    // <div className="space-y-6 w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-screen-3xl">
    //   {Array.from({ length: 5 }).map((_, index) => (
    //     <div
    //       key={index}
    //       className="flex animate-pulse items-start space-x-4 bg-white shadow rounded-lg p-4 sm:flex-row sm:space-x-4 flex-col sm:items-center"
    //     >
    //       {/* Profile Picture Placeholder */}
    //       <div className="rounded-full bg-gray-300 h-12 w-12 selection:sm:h-14 sm:w-14 lg:h-16 lg:w-16 mx-auto sm:mx-0"></div>

    //       {/* Content Placeholder */}
    //       <div className="flex-1 space-y-4 py-1 w-full">
    //         {/* Name Placeholder */}
    //         <div className="h-4 bg-gray-300 rounded w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 mx-auto sm:mx-0"></div>

    //         {/* Post Text Placeholder */}
    //         <div className="space-y-2">
    //           <div className="h-4 bg-gray-300 rounded w-full"></div>
    //           <div className="h-4 bg-gray-300 rounded w-5/6"></div>
    //           <div className="h-4 bg-gray-300 rounded w-4/6"></div>
    //         </div>

    //         {/* Action Buttons Placeholder */}
    //         <div className="flex space-x-4 pt-2 justify-center sm:justify-start">
    //           <div className="h-4 bg-gray-300 rounded w-10sm:w-12 lg:w-16 xl:w-20"></div>
    //           <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 lg:w-16 xl:w-20"></div>
    //           <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 lg:w-16 xl:w-20"></div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>
        <div className="space-y-4 w-full max-w-2xl mx-auto">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse bg-white shadow rounded-lg p-4 sm:space-x-4 space-y-4 flex-col sm:flex-row items-start sm:items-center"
            >
              {/* Profile Picture Placeholder */}
              <div className="rounded-full bg-gray-300 h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"></div>
    
              {/* Content Placeholder */}
              <div className="flex-1 space-y-4 w-full">
                {/* Name Placeholder */}
                <div className="h-4 bg-gray-300 rounded w-1/3 sm:w-1/4 md:w-1/6"></div>
    
                {/* Post Text Placeholder */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-300 rounded w-4/6"></div>
                </div>
    
                {/* Action Buttons Placeholder */}
                <div className="flex space-x-4 pt-2 justify-center sm:justify-start">
                  <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"></div>
                  <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"></div>
                  <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
 
  );
};

export default SkeletonLoader;
