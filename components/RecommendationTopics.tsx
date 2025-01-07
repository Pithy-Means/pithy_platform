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
    <div className="p-3">
      <h2 className="mb-2 text-center">
        {title}
      </h2>
      <div className="flex flex-wrap gap-3">
        {topMajor.map((major: string, index: number) => (
          <button
            key={index}
            className="bg-gray-200 text-black/85 px-1 rounded-lg hover:bg-green-600 transition duration-300"
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
