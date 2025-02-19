"use client";

import { useState, useEffect } from "react";
import { getFundings } from "@/lib/actions/user.actions";
import Link from "next/link";
import { Funding } from "@/types/schema";

const FundingList = () => {
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundings = async () => {
      try {
        const fetchedFundings = await getFundings();
        setFundings(fetchedFundings.documents || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load fundings. Please try again.");
        setLoading(false);
      }
    };

    fetchFundings();
  }, []);

  return (
    <div className="min-h-screen relative w-full py-8">
      <div className="w-full">
        <h1 className="text-4xl font-extrabold text-black text-center mb-8">
          Explore Fundings
        </h1>
        {loading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
            <p className="text-blue-500 text-xl font-medium animate-pulse">
              Loading Funding...
            </p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {fundings.length === 0 && (
              <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
                <p className="text-gray-500 text-xl font-medium">
                  No Fundings available for now. Please come later...
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-8">
              {fundings.map((funding, index) => {
                const styles = [
                  // Style 1: Clean and Green
                  "relative bg-gradient-to-br from-white to-green-50 border border-green-300 rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden w-full",
                  // Style 5: Modern Glassmorphism with Green Hints
                  "relative bg-white bg-opacity-30 backdrop-blur-lg border border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden w-full",
                ];

                const cardStyle = styles[index % styles.length]; // Cycle through styles

                return (
                  <div key={funding.funding_id} className={cardStyle}>
                    {/* Badge */}
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase rounded-lg ${
                        index % 2 === 0
                          ? "bg-green-600 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {funding.funding_type || "Funding"}
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Title */}
                      <h2 className="text-lg font-bold text-green-800">
                        {funding.title || "Untitled Funding"}
                      </h2>

                      {/* Details */}
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-600">
                          Donor:
                        </span>{" "}
                        {funding.donor || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-600">
                          Eligible Countries:
                        </span>{" "}
                        {funding.eligibre_countries || "All"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-600">
                          Grant Size:
                        </span>{" "}
                        {funding.grant_size || "Not specified"}
                      </p>

                      {/* Call to Action */}
                      <Link
                        href={`/dashboard/fundings/${funding.funding_id}`}
                        className={`block w-full text-center font-medium py-2 px-4 rounded-lg shadow-lg ${
                          index % 2 === 0
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105"
                            : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-xl hover:scale-105"
                        } transition-transform`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FundingList;
