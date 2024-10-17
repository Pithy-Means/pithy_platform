import React from 'react';

type RecommendationTopicsProps = {
  majors: string[];
};

const RecommendationTopics: React.FC<RecommendationTopicsProps> = ({ majors }) => {
  return (
    <div className='px-2 bg-white shadow rounded-lg'>
      <div>
        <p className='text-base font-bold mb-2 flex justify-center items-center'>Top Recommended Majors</p>
        <div className='flex flex-wrap gap-2'>
          {majors.map((major: string, index: number) => (
            <button
              key={index}
              className='bg-gray-500 text-black/85 px-2 rounded-lg hover:bg-green-600 transition duration-300'
            >
              {major}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationTopics;
