"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getFundings } from "@/lib/actions/user.actions"; // Assuming this fetches { total: number, documents: Funding[] }
import Link from "next/link";
import { Funding } from "@/types/schema"; // Assuming this type is correct

// Removed SEARCH_DEBOUNCE_DELAY as we are using a button/enter key now

// --- Helper Components (Keeping for clarity, could be separated) ---

const LoadingIndicator = () => (
  <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50 backdrop-blur-sm" aria-live="polite" aria-busy="true">
    <div className="flex flex-col items-center">
       {/* Simple modern spinner */}
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-4 text-green-700 text-lg font-semibold">Loading Fundings...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-center py-12 px-6 bg-red-50 border border-red-300 rounded-lg shadow-md">
    <p className="text-red-700 text-lg font-medium">
      {message}
    </p>
    <p className="mt-2 text-red-600 text-sm">Please try refreshing the page.</p>
  </div>
);

const NoDataMessage = ({ message }: { message: string }) => (
    <div className="text-center py-12 px-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
        <p className="text-gray-700 text-xl font-medium">{message}</p>
    </div>
);


// --- Main Component ---

const FundingList = () => {
  // --- State ---
  const [allFundings, setAllFundings] = useState<Funding[]>([]);
  const [filteredFundings, setFilteredFundings] = useState<Funding[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchFundings = async () => {
      setLoading(true);
      setError(null);
      try {
        const fundingResponse = await getFundings();
        const fetchedDocs = fundingResponse?.documents || [];
        setAllFundings(fetchedDocs);
        setFilteredFundings(fetchedDocs); // Initialize filtered list with all data
      } catch (err) {
        console.error("Failed to fetch fundings:", err);
        setError("Failed to load fundings. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFundings();
  }, []); // Fetch only on initial mount

  // --- Filtering Logic ---
  // This function is now called explicitly by the button click or Enter key press
  const filterFundings = useCallback(() => {
    const currentSearchTerm = searchTerm.toLowerCase().trim();

    if (!currentSearchTerm) {
      setFilteredFundings(allFundings); // If search is empty, show all
      return;
    }

    const filtered = allFundings.filter((funding) =>
      funding.title?.toLowerCase().includes(currentSearchTerm) ||
      funding.donor?.toLowerCase().includes(currentSearchTerm) // Also search by donor
    );
    setFilteredFundings(filtered);
  }, [allFundings, searchTerm]); // Dependencies: allFundings and searchTerm

  // --- Search Input Handlers ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    // No filtering here, filtering happens on button click or Enter
  };

  const handleSearchClick = () => {
    filterFundings(); // Trigger filtering on button click
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if input is part of a form
      filterFundings(); // Trigger filtering on Enter key press
    }
  };

  // --- Improved Card Design Component ---
  // Extracted the individual card rendering logic into a sub-component here
  // For larger applications, this would ideally be in a separate file (as shown in the previous response)
  const FundingCard = ({ funding, index }: { funding: Funding; index: number }) => {
      const uniqueKey = funding.funding_id || `funding-${index}`;

    return (
      <div
        key={uniqueKey}
        className="relative bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden
                   transform transition-all duration-300 hover:scale-103 hover:shadow-xl
                   flex flex-col h-full" // Added flex-col and h-full for consistent card height
      >
        {/* Badge */}
        <div
          className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase rounded-full shadow-md
                      ${index % 2 === 0 ? "bg-indigo-600" : "bg-teal-600"} text-white`} // More vibrant badge colors
        >
          {funding.funding_type || "Opportunity"} {/* Changed default text */}
        </div>

        <div className="p-6 flex-grow space-y-4"> {/* flex-grow to push button to bottom */}
          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            {funding.title || "Untitled Funding"}
          </h2>

          {/* Details Section */}
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-semibold text-gray-800">Donor:</span> {funding.donor || "N/A"}</p>
            <p><span className="font-semibold text-gray-800">Eligible Countries:</span> {funding.eligibre_countries || "Global"}</p> {/* Improved default */}
            <p><span className="font-semibold text-gray-800">Grant Size:</span> {funding.grant_size || "Not specified"}</p>
            {funding.closing_date && (
              <p className="text-red-600 font-semibold">
                Closing Date: {new Date(funding.closing_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Nicer date format */}
              </p>
            )}
          </div>
           {/* Optional: Add a short description if available in your Funding type */}
          {/* {funding.description && (
            <p className="text-gray-600 text-sm mt-3">{funding.description.substring(0, 100)}...</p>
          )} */}
        </div>

        {/* Call to Action */}
        <div className="p-6 pt-0"> {/* Added padding-top 0 to reduce space */}
            <Link
             href={`/dashboard/fundings/${funding.funding_id}`} // Use funding_id as the unique identifiere
             className={`block w-full text-center font-semibold py-3 px-4 rounded-lg shadow-lg
                       ${index % 2 === 0
                         ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
                         : "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"}
                       text-white transition-all duration-300 transform hover:-translate-y-0.5`} // More pronounced hover
           >
             View Details
           </Link>
        </div>
      </div>
    );
    };
    FundingCard.displayName = "FundingCard";

  // --- Render Logic ---
  const renderContent = () => {
    if (loading) {
      return <LoadingIndicator />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (allFundings.length === 0) {
        return <NoDataMessage message="No Fundings are available at the moment. Please check back later." />;
    }

    if (filteredFundings.length === 0 && searchTerm.trim()) { // Check if searchTerm is not empty before showing "no results" for filter
      return <NoDataMessage message={`No fundings found matching "${searchTerm.trim()}".`} />;
    }

    // Display the filtered list
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"> {/* Increased gap */}
        {filteredFundings.map((funding, index) => (
          <FundingCard key={funding.funding_id || `funding-${index}`} funding={funding} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 md:px-8 "> {/* More dynamic background */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 leading-tight"> {/* Larger, bolder heading */}
          Explore Global Funding Opportunities
        </h1>

        {/* Search Input with Button - Only show if there's data to search */}
        {!loading && !error && allFundings.length > 0 && (
            <div className="mb-10 max-w-xl mx-auto flex items-center border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"> {/* Integrated search bar style */}
              <label htmlFor="funding-search" className="sr-only">Search Fundings by Title or Donor</label> {/* Updated label */}
              <input
                  id="funding-search"
                  type="text" // Changed to text for consistency, although search works too
                  placeholder="Search by title or donor..." // More helpful placeholder
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown} // Add keydown handler
                  aria-label="Search Fundings by Title or Donor"
                  className="flex-grow px-5 py-3 text-gray-800 focus:outline-none focus:ring-0 border-none" // Input styling
              />
              <button
                onClick={handleSearchClick} // Button click handler
                className="bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out" // Button styling
                aria-label="Perform search"
              >
                Search
              </button>
            </div>
        )}

        {/* Render Loading, Error, or Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default FundingList;