"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFunding } from "@/lib/actions/user.actions";
import { Funding } from "@/types/schema";
import toast, { Toaster } from "react-hot-toast";
import { formatDateWithOrdinal } from "@/lib/utils";

const FundingDetail = () => {
  const { funding_id } = useParams();
  const [funding, setFunding] = useState<Funding | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (funding_id) {
      const fetchFunding = async () => {
        try {
          const validFundingId = Array.isArray(funding_id)
            ? funding_id[0]
            : funding_id;
          const fetchedFundings = await getFunding(validFundingId);
          toast.success("Funding details fetched successfully");
          setFunding(fetchedFundings);
          setLoading(false);
        } catch (err) {
          setError("Failed to load funding details. Please try again.");
          setLoading(false);
        }
      };

      fetchFunding();
    }
  }, [funding_id]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
        <p className="text-blue-500 text-xl font-medium animate-pulse">
          Loading Funding Details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!funding) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">No funding details found.</p>
      </div>
    ); // Shouldn't happen but added for safety.
  }
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center w-full">
      <Toaster />
      {/* Title and Header */}
      <div className="w-full  bg-gradient-to-r from-green-500 to-teal-500 p-8 rounded-lg shadow-xl text-center text-white">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          {funding.title || "Untitled Funding"}
        </h1>
        <p className="text-lg md:text-xl font-medium">
          {funding.donor || "Donor: Not Available"}
        </p>
      </div>

      {/* Content Section */}
      <div className="mt-10 w-full bg-white rounded-lg shadow-xl p-8 space-y-6">
        {/* Overview */}
        <div className="text-lg text-gray-800">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">
            Funding Overview
          </h2>
          <p className="mb-4">
            <span className="font-semibold">Donor:</span>{" "}
            {funding.donor || "N/A"}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Eligible Countries:</span>{" "}
            {funding.eligibre_countries || "All"}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Grant Size:</span>{" "}
            {funding.grant_size || "Not specified"}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Focus Area:</span>{" "}
            {funding.focus_earlier || "Not specified"}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Application Deadline:</span>{" "}
            {funding.closing_date ? formatDateWithOrdinal(new Date(funding.closing_date)) : "Not specified"}
          </p>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            About this Funding
          </h3>
          <p className="text-gray-700">
            {funding.funding_type || "No additional details provided."}
          </p>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mt-8">
          <a
            href={funding.reference_link}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg text-center transition duration-300"
          >
            Apply Now
          </a>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg text-center transition duration-300 mt-4 sm:mt-0"
          >
            Back to Listings
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gray-100 p-8 rounded-lg shadow-md mt-10">
        <h3 className="text-lg font-semibold text-green-600">
          Want More Opportunities?
        </h3>
        <p className="text-gray-600 mt-2">
          Stay updated with the latest funding opportunities, scholarships, and
          grants by subscribing to our newsletter or following us on social
          media.
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="text-green-600 font-semibold underline hover:text-green-800 transition duration-300"
          >
            Subscribe Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default FundingDetail;
