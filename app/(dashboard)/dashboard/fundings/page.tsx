/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { getFundings, searchFundingByTitle } from "@/lib/actions/user.actions";
import { Funding } from "@/types/schema";

// --- Component Imports ---
import SearchBar from "@/components/SearchBar";
import FundingCard from "@/components/FundingCard";
import { LoadingIndicator, ErrorMessage, NoDataMessage } from "@/components/UIComponents";

const FundingList = () => {
  // --- State ---
  const [allFundings, setAllFundings] = useState<Funding[]>([]);
  const [filteredFundings, setFilteredFundings] = useState<Funding[]>([]);
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchArea, setSearchArea] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Initial Data Fetching ---
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

  // --- Search Handler ---
  const handleSearch = async () => {
    if (!searchTitle.trim() && !searchArea.trim()) {
      setFilteredFundings(allFundings); // If both search fields are empty, show all
      return;
    }

    setIsSearching(true);
    try {
      // Use the enhanced search function with both title and area
      const searchResults = await searchFundingByTitle(
        searchTitle.trim(),
        searchArea.trim(),
        100 // Limit results to 100
      );
      
      setFilteredFundings(searchResults?.documents || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search operation failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // --- Client-side Filtering (fallback) ---
  const filterLocally = () => {
    const titleTerm = searchTitle.toLowerCase().trim();
    const areaTerm = searchArea.toLowerCase().trim();

    if (!titleTerm && !areaTerm) {
      setFilteredFundings(allFundings); // If both are empty, show all
      return;
    }

    const filtered = allFundings.filter((funding) => {
      const matchesTitle = !titleTerm || 
        (funding.title?.toLowerCase().includes(titleTerm) || 
         funding.donor?.toLowerCase().includes(titleTerm));
      
      const matchesArea = !areaTerm || 
        (funding.focus_earlier?.toLowerCase().includes(areaTerm));
      
      return matchesTitle && matchesArea;
    });
    
    setFilteredFundings(filtered);
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (loading || isSearching) {
      return <LoadingIndicator message={isSearching ? "Searching..." : "Loading Fundings..."} />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (allFundings.length === 0) {
      return <NoDataMessage message="No Fundings are available at the moment. Please check back later." />;
    }

    if (filteredFundings.length === 0 && (searchTitle.trim() || searchArea.trim())) {
      let message = "No fundings found matching ";
      if (searchTitle.trim() && searchArea.trim()) {
        message += `title "${searchTitle.trim()}" and area "${searchArea.trim()}".`;
      } else if (searchTitle.trim()) {
        message += `title "${searchTitle.trim()}".`;
      } else {
        message += `area "${searchArea.trim()}".`;
      }
      return <NoDataMessage message={message} />;
    }

    // Display the filtered list
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {filteredFundings.map((funding, index) => (
          <FundingCard 
            key={funding.funding_id || `funding-${index}`} 
            funding={funding} 
            index={index} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-12 leading-tight">
          Explore Global Funding Opportunities
        </h1>

        {/* Search Component - Only show if there's data to search */}
        {!loading && !error && allFundings.length > 0 && (
          <SearchBar
            searchTitle={searchTitle}
            setSearchTitle={setSearchTitle}
            searchArea={searchArea}
            setSearchArea={setSearchArea}
            onSearch={handleSearch}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSearch();
              }
            }}
            isDisabled={isSearching}
          />
        )}

        {/* Render Loading, Error, or Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default FundingList;