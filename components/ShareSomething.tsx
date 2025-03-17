"use client";

import React, { useState } from "react";
import Posts from "./Posts";
import { CircleUserRound, Search } from "lucide-react";
import { Button } from "./ui/button";
import { searchPostsByContent } from "@/lib/actions/user.actions"; // Import the search function

const ShareSomething = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  interface Post {
    id: string;
    title: string;
    content: string;
  }

  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false); // Track if search has been performed

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true); // Mark that a search was performed

    try {
      const results = await searchPostsByContent(searchTerm, 1, 10);
      setSearchResults(results);
      setPage(1);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false); // Reset search state
  };

  const loadMoreResults = async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    try {
      const nextPage = page + 1;
      const moreResults = await searchPostsByContent(searchTerm, nextPage, 10);
      if (moreResults && moreResults.length > 0) {
        setSearchResults([...searchResults, ...moreResults]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error loading more results:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col no-scrollbar items-center justify-center max-h-screen mt-4">
      {/* Header Section */}
      <div className="flex flex-col bg-white text-black rounded-lg shadow-md p-2 w-full mt-2">
        <div className="flex items-center justify-center">
          <CircleUserRound size={32} className="flex-shrink-0 text-gray-600 hidden md:block" />

          <input
            type="text"
            placeholder="Search Posts"
            className="border border-gray-300 rounded-lg flex-1 py-1 mx-2 px-2 focus:outline-none focus:ring-2 focus:ring-[#5AC35A]" 
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />

          <Button 
            className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-1 px-2 flex-shrink-0 hover:bg-gradient-to-tr"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </span>
            ) : (
              <span className="flex items-center">
                <Search size={16} className="mr-1" />
                Search
              </span>
            )}
          </Button>
        </div>
        
        {searchTerm && (
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-sm text-gray-600">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : hasSearched && !isSearching 
                  ? `No results found for "${searchTerm}"`
                  : ''}
            </p>
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="text-sm text-[#00AE76] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="overflow-y-auto no-scrollbar h-full mt-8 w-full">
        {hasSearched ? (
          searchResults.length > 0 ? (
            <>
              <Posts searchPosts={searchResults} />
              {searchResults.length >= 10 * page && (
                <div className="flex justify-center my-4">
                  <Button 
                    onClick={loadMoreResults}
                    variant="outline" 
                    className="text-[#00AE76] border-[#00AE76] hover:bg-[#00AE76]/10"
                    disabled={isSearching}
                  >
                    {isSearching ? "Loading..." : "Load more"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 mt-4">No posts found.</p>
          )
        ) : (
          <Posts />
        )}
      </div>
    </div>
  );
};

export default ShareSomething;
