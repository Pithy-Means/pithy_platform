import React from 'react';
import Link from 'next/link';
import { Funding } from '@/types/schema';

interface FundingCardProps {
  funding: Funding;
  index: number;
}

const FundingCard: React.FC<FundingCardProps> = ({ funding, index }) => {
  const uniqueKey = funding.funding_id || `funding-${index}`;
  
  // Determine the badge color based on index or funding type
  const getBadgeColor = (index: number) => {
    // Could use funding type to determine color in the future
    return index % 3 === 0 
      ? "bg-indigo-600" 
      : index % 3 === 1 
        ? "bg-teal-600" 
        : "bg-purple-600";
  };

  return (
    <div
      key={uniqueKey}
      className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
                transform transition-all duration-300 hover:scale-105 hover:shadow-xl
                flex flex-col h-full"
    >
      {/* Badge */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase rounded-full shadow-md
                   ${getBadgeColor(index)} text-white`}
      >
        {funding.funding_type || "Opportunity"}
      </div>

      <div className="p-6 flex-grow space-y-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {funding.title || "Untitled Funding"}
        </h2>

        {/* Details Section */}
        <div className="space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold text-gray-800">Donor:</span> {funding.donor || "N/A"}</p>
          <p>
            <span className="font-semibold text-gray-800">Eligible Countries:</span> {funding.eligibre_countries || "Global"}
          </p>
          <p><span className="font-semibold text-gray-800">Grant Size:</span> {funding.grant_size || "Not specified"}</p>
          
          {/* Focus Area (new field) */}
          {funding.focus_earlier && (
            <p><span className="font-semibold text-gray-800">Focus Area:</span> {funding.focus_earlier}</p>
          )}
          
          {funding.closing_date && (
            <p className="text-red-600 font-semibold">
              Closing Date: {new Date(funding.closing_date).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-6 pt-0">
        <Link
          href={`/dashboard/fundings/${funding.funding_id}`}
          className={`block w-full text-center font-semibold py-3 px-4 rounded-lg shadow-lg
                    ${getBadgeColor(index).replace('bg-', 'bg-gradient-to-r from-').concat(
                      index % 3 === 0 
                        ? ' to-indigo-700' 
                        : index % 3 === 1 
                          ? ' to-teal-700'
                          : ' to-purple-700'
                    )}
                    text-white transition-all duration-300 transform hover:-translate-y-0.5`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default FundingCard;