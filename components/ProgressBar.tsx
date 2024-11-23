// components/ProgressBar.tsx
import React from "react";

type ProgressBarProps = {
  currentStep: number; // Current step (1-6)
};

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const totalSteps = 3;

  return (
    <div className="flex items-center w-full mx-auto">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        return (
          <div
            key={index}
            className={`flex items-center mb-2 w-full ${currentStep >= stepNumber ? "text-green-500" : "text-gray-500"}`}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${
                currentStep >= stepNumber
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              {stepNumber}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-1 ${currentStep > stepNumber ? "bg-green-500" : "bg-gray-300"}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
