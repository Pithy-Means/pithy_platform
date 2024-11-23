import React from "react";

type ValuesAndInterestsProps = {
  values: string[];
  interests: string[];
};

const ValuesAndInterests: React.FC<ValuesAndInterestsProps> = ({
  values,
  interests,
}) => {
  return (
    <div>
      <div>
        <p className="text-base font-bold mb-2 flex justify-center items-center">
          Career values & Interests
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {values.map((value: string, index: number) => (
            <button key={`value-${index}`} className="">
              {value}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest: string, index: number) => (
            <button key={`interest-${index}`} className="">
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuesAndInterests;
