"use client";

import { getScholarship } from "@/lib/actions/user.actions";
import { formatDateWithOrdinal } from "@/lib/utils";
import { Scholarship } from "@/types/schema";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ScholarshipDetailPage = () => {
  const { scholarship_id } = useParams();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (scholarship_id) {
      // Fetch scholarship details
      const fetchScholarship = async () => {
        try {
          const validScholarshipId = Array.isArray(scholarship_id)
            ? scholarship_id[0]
            : scholarship_id;
          // Fetch scholarship details using scholarship_id
          const fetchedScholarship = await getScholarship(validScholarshipId);
          setScholarship(fetchedScholarship);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch scholarship details", error);
          setLoading(false);
        }
      };
      fetchScholarship();
    }
  }, [scholarship_id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
        <p className="text-green-500 text-xl font-medium animate-pulse">
          Loading Scholarship Details...
        </p>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">No scholarship details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-6 relative">
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-36 bg-gradient-to-r from-green-500 to-green-200">
          <div className="absolute inset-0 flex justify-center items-center">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white text-center px-4">
              {scholarship.title || "Untitled Scholarship"}
            </h1>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">Provider:</span>{" "}
                {scholarship.provider || "N/A"}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">
                  Level of Study:
                </span>{" "}
                {scholarship.study_level || "Not specified"}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">
                  Discipline:
                </span>{" "}
                {scholarship.discipline || "Any"}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">Amount:</span>{" "}
                {scholarship.amount || "Not specified"}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">Deadline:</span>{" "}
                {scholarship.deadline ? formatDateWithOrdinal(new Date(scholarship.deadline)) : "Not specified"}
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold text-green-600">
                  Country of Study:
                </span>{" "}
                {scholarship.country_of_study || "Global"}
              </p>
            </div>
          </div>
          {scholarship.reference_link && (
            <div className="mt-6">
              <a
                href={scholarship.reference_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-green-500 to-green-500/5 text-white text-lg font-medium py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                Apply Now
              </a>
            </div>
          )}
          <div className="flex flex-col space-y-4 mt-6 justify-end w-fit">
            <button
              onClick={() => router.back()}
              className="text-gray-500 font-medium hover:text-gray-800 transition"
            >
              &larr; Back to Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailPage;
