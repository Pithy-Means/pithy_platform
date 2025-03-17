/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="flex flex-col no-scrollbar items-center justify-center max-h-screen mt-4">
      {/* Search Bar */}
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
            <Search size={16} className="mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        
        {searchTerm && (
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-sm text-gray-600">
              {searchResults.length > 0 
                ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : searchTerm && !isSearching 
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

      {/* Show Posts - Display Search Results or Default Posts */}
      <div className="overflow-y-auto no-scrollbar h-full mt-8 w-full">
        {searchResults.length > 0 ? (
          <Posts searchPosts={searchResults} /> // Show searched posts
        ) : (
          <Posts /> // Show default posts
        )}
      </div>
    </div>
  );
};

export default ShareSomething;
