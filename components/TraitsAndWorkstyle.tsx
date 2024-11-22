import React from "react";

type TraitsAndWorkstyleProps = {
  traits: string[];
};

const TraitsAndWorkstyle: React.FC<TraitsAndWorkstyleProps> = ({ traits }) => {
  const traitsToDisplay = traits.slice(0, 4);
  return (
    <div className="flex flex-col px-2 bg-white rounded-lg">
      <div>
        <p className="text-base font-bold mb-2 flex justify-center items-center">
          Traits & Work Style
        </p>
        <div className="flex flex-wrap gap-2">
          {traitsToDisplay.map((trait: string, index: number) => (
            <button
              key={index}
              className="bg-gray-500 text-black/85 px-2 rounded-lg hover:bg-green-600  transition duration-300"
            >
              {trait}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TraitsAndWorkstyle;
