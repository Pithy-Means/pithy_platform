"use client";

import { useState, useEffect } from "react";
import { getScholarships } from "@/lib/actions/user.actions";
import Link from "next/link";
import { Scholarship } from "@/types/schema";

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const fetchedScholarships = await getScholarships();
        setScholarships(fetchedScholarships.documents || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load scholarships. Please try again.");
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  return (
    <div className="min-h-screen relative w-full p-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 animate-pulse">
          Your Next Scholarship is Waiting
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Discover opportunities to fund your future. Scholarships that you’ll
          love.
        </p>
      </div>

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
          {scholarships.map((scholarship) => (
            <div
              key={scholarship.scholarship_id}
              className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg shadow-xl p-6 flex flex-col justify-between z-20 relative overflow-hidden"
            >
              {/* Title */}
              <h2 className="text-3xl font-semibold text-gray-900 mb-4 z-50 relative">
                {scholarship.title || "Untitled Scholarship"}
              </h2>

              {/* Scholarship Details */}
              <div className="z-50 relative">
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold text-green-400">
                    Provider:
                  </span>{" "}
                  {scholarship.provider || "N/A"}
                </p>
                <p className="text-gray-700 mb-2 z-50">
                  <span className="font-semibold text-green-400">
                    Country of Study:
                  </span>{" "}
                  {scholarship.country_of_study || "All"}
                </p>
                <p className="text-gray-700 mb-4 z-50">
                  <span className="font-semibold text-green-400">Amount:</span>{" "}
                  {scholarship.amount || "Not specified"}
                </p>
              </div>

              {/* View Details Button */}
              <Link
                href={
                  scholarship.scholarship_id
                    ? `/dashboard/scholarships/${scholarship.scholarship_id}`
                    : "#"
                }
                className="z-50 mt-auto inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:translate-y-2"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarshipList;
