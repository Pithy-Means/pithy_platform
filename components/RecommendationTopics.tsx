import React from "react";

type RecommendationTopicsProps = {
  majors: string[];
  title: string;
};

const RecommendationTopics: React.FC<RecommendationTopicsProps> = React.memo(({
  majors,
  title,
}) => {
  const topMajor = majors.slice(0, 2);
  return (
    <div className="p-3 bg-white shadow rounded-lg">
      <span className="font-bold mb-2 text-center">
        {title}
      </span>
      <div className="flex flex-wrap gap-3">
        {topMajor.map((major: string, index: number) => (
          <button
            key={index}
            className="bg-gray-500 text-black/85 px-2 py-1 rounded-lg hover:bg-green-600 transition duration-300"
          >
            {major}
          </button>
        ))}
      </div>
    </div>
  );
});

RecommendationTopics.displayName = "RecommendationTopics";

export default RecommendationTopics;
