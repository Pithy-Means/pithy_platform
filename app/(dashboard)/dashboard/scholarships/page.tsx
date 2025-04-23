"use client";

import { useState, useEffect } from "react";
import { getScholarships } from "@/lib/actions/user.actions";
import Link from "next/link";
import { Scholarship } from "@/types/schema";
import SearchScholarship from "@/components/SearchScholarship";

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsCount, setResultsCount] = useState<number>(0);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const fetchedScholarships = await getScholarships();
        setScholarships(fetchedScholarships.documents || []);
        setResultsCount(fetchedScholarships.documents?.length || 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to load scholarships. Please try again.");
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // Handler for search results
  const handleSearchResults = (results: Scholarship[]) => {
    setScholarships(results);
    setResultsCount(results.length);
  };

  return (
    <div className="min-h-screen relative w-full p-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 animate-pulse">
          Your Next Scholarship is Waiting
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Discover opportunities to fund your future. Scholarships that you&apos;ll
          love.
        </p>
      </div>

      {/* Search Component */}
      <SearchScholarship 
        onSearchResults={handleSearchResults}
        setLoading={setLoading}
        setError={setError}
      />

      {/* Results Count */}
      {!loading && !error && (
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700 font-medium">
            {resultsCount === 0 ? (
              "No scholarships found. Try adjusting your search criteria."
            ) : (
              `Showing ${resultsCount} scholarship${resultsCount !== 1 ? 's' : ''}`
            )}
          </p>
          
          {/* Optional sorting dropdown could go here */}
        </div>
      )}

      {/* Loading / Error State */}
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
          <div className="text-green-500 text-xl font-medium animate-pulse">
            Loading Scholarships...
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3 w-full px-6 z-50">
          {scholarships.length === 0 ? (
            <div className="col-span-3 text-center py-16">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 mx-auto text-gray-400 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
                />
              </svg>
              <h3 className="text-2xl font-medium text-gray-700">No scholarships found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
            </div>
          ) : (
            scholarships.map((scholarship) => (
              <div
                key={scholarship.scholarship_id}
                className="bg-white bg-opacity-20 backdrop-blur-md border border-green-400 rounded-lg shadow-xl p-6 flex flex-col justify-between z-20 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-green-500"
              >
                {/* Title */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-4 z-50 relative">
                  {scholarship.title || "Untitled Scholarship"}
                </h2>

                {/* Scholarship Details */}
                <div className="z-50 relative space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-400">
                      Provider:
                    </span>{" "}
                    {scholarship.provider || "N/A"}
                  </p>
                  
                  {scholarship.study_level && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-green-400">
                        Study Level:
                      </span>{" "}
                      {scholarship.study_level}
                    </p>
                  )}
                  
                  {scholarship.discipline && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-green-400">
                        Discipline:
                      </span>{" "}
                      {scholarship.discipline}
                    </p>
                  )}
                  
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-400">
                      Country of Study:
                    </span>{" "}
                    {scholarship.country_of_study || "All"}
                  </p>
                  
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-400">Amount:</span>{" "}
                    {scholarship.amount || "Not specified"}
                  </p>
                  
                  {scholarship.deadline && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-green-400">
                        Deadline:
                      </span>{" "}
                      {new Date(scholarship.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  href={
                    scholarship.scholarship_id
                      ? `/dashboard/scholarships/${scholarship.scholarship_id}`
                      : "#"
                  }
                  className="z-50 mt-6 inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  onClick={(e) => {
                    if (!scholarship.scholarship_id) {
                      e.preventDefault();
                      alert("Invalid scholarship ID");
                    }
                  }}
                >
                  View Details
                </Link>

                {/* Soft Background Blur */}
                <div className="absolute inset-0 bg-opacity-10 bg-white rounded-lg"></div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;