import React from "react";

type ProgressBarProps = {
  currentStep: number; // Current step (1-3)
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const totalSteps = 3;

  return (
    <div className="relative w-full h-16 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={index} className="flex items-center">
              {/* Step Node */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full text-white text-lg font-bold shadow-lg
                  ${isCompleted ? "bg-green-500" : isActive ? "bg-white text-green-500 border-2 border-green-500" : "bg-gray-300"}`}
              >
                {stepNumber}

                {/* Highlight Animation */}
                {isActive && (
                  <div className="absolute inset-0 w-full h-full rounded-full animate-ping bg-green-200"></div>
                )}
              </div>

              {/* Connecting Bar */}
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-2 rounded ${
                    currentStep > stepNumber ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
