"use client";

import React, { useState } from "react";
import Posts from "./Posts";
import SearchResults from "./SearchResults";
import { CircleUserRound, Search, X } from "lucide-react";
import { Button } from "./ui/button";
import { searchPosts } from "@/lib/actions/user.actions";
import { PostWithUser } from "@/types/schema";

interface SearchResults {
  posts: PostWithUser[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

const ShareSomething = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchMode, setSearchMode] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      clearSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchMode(true);

    try {
      const results = await searchPosts({
        searchTerm: searchTerm.trim(),
        page,
        limit,
        sortBy: "recent",
      });

      setSearchResults(results);
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
    setSearchResults(null);
    setPage(1);
    setSearchMode(false);
  };

  const handlePageChange = async (newPage: number) => {
    if (!searchTerm.trim() || newPage === page) return;

    setIsSearching(true);
    setPage(newPage);

    try {
      const results = await searchPosts({
        searchTerm: searchTerm.trim(),
        page: newPage,
        limit,
        sortBy: "recent",
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col no-scrollbar items-center justify-center max-h-screen mt-4">
      {/* Search Bar */}
      <div className="flex flex-col bg-white text-black rounded-lg shadow-md p-2 w-full mt-2">
        <div className="flex items-center justify-center">
          <CircleUserRound
            size={32}
            className="flex-shrink-0 text-gray-600 hidden md:block"
          />

          <div className="relative flex-1 mx-2">
            <input
              type="text"
              placeholder="Search Posts"
              className="border border-gray-300 rounded-lg w-full py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#5AC35A]"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <Button
            className="bg-gradient-to-t from-[#5AC35A] to-[#00AE76] text-white rounded-lg py-1 px-2 flex-shrink-0 hover:bg-gradient-to-tr"
            onClick={handleSearch}
            disabled={isSearching}
          >
            <Search size={16} className="mr-2" />
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {searchMode && searchResults && (
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-sm text-gray-600">
              {searchResults.totalPosts > 0
                ? `Found ${searchResults.totalPosts} result${searchResults.totalPosts !== 1 ? "s" : ""} for "${searchTerm}"`
                : `No results found for "${searchTerm}"`}
            </p>
            <button
              onClick={clearSearch}
              className="text-sm text-[#00AE76] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="overflow-y-auto no-scrollbar h-full mt-8 w-full">
        {searchMode ? (
          <>
            {/* Search Results */}
            <SearchResults
              searchPosts={searchResults?.posts || []}
              loading={isSearching}
              searchTerm={searchTerm}
            />

            {/* Pagination */}
            {searchResults && searchResults.totalPages > 1 && (
              <div className="flex justify-center mt-4 mb-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || isSearching}
                >
                  Previous
                </Button>

                <span className="flex items-center px-2">
                  Page {searchResults.currentPage} of {searchResults.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === searchResults.totalPages || isSearching}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Regular Posts */
          <Posts />
        )}
      </div>
    </div>
  );
};

export default ShareSomething;
